const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const VISITOR_FILE = process.env.VISITOR_STORE_PATH || path.join(ROOT, "data", "visitors.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readVisitorStore() {
  try {
    if (fs.existsSync(VISITOR_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(VISITOR_FILE, "utf8"));
      return {
        totalVisits: Number(parsed.totalVisits) || 0,
        uniqueVisitorIds: Array.isArray(parsed.uniqueVisitorIds) ? parsed.uniqueVisitorIds : [],
        daily: parsed.daily && typeof parsed.daily === "object" ? parsed.daily : {},
      };
    }
  } catch (err) {
    // Re-initialize cleanly if store file is missing or malformed
  }
  return { totalVisits: 0, uniqueVisitorIds: [], daily: {} };
}

function writeVisitorStore(store) {
  const dir = path.dirname(VISITOR_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const tmpFile = `${VISITOR_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), "utf8");
  fs.renameSync(tmpFile, VISITOR_FILE);
}

function formatVisitorSummary(store) {
  const todayKey = getTodayKey();
  return {
    totalVisits: store.totalVisits,
    uniqueVisitors: store.uniqueVisitorIds.length,
    todayVisits: Number(store.daily[todayKey]) || 0,
    source: "server",
  };
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, must-revalidate",
  });
  res.end(JSON.stringify(data));
}

function handleVisitorApi(req, res) {
  if (req.method === "GET") {
    const store = readVisitorStore();
    sendJson(res, formatVisitorSummary(store));
    return;
  }

  if (req.method === "POST") {
    let raw = "";
    req.on("data", (chunk) => {
      if (raw.length < 4096) raw += chunk;
    });
    req.on("end", () => {
      let clientId = "";
      try {
        const body = raw ? JSON.parse(raw) : {};
        if (body && typeof body.visitorId === "string") {
          clientId = body.visitorId.trim().slice(0, 64);
        }
      } catch (e) {}

      const ipSeed = clientId || `${req.socket.remoteAddress || "anon"}|${req.headers["user-agent"] || ""}`;
      const visitorHash = crypto.createHash("sha256").update(ipSeed).digest("hex").slice(0, 16);

      const store = readVisitorStore();
      const todayKey = getTodayKey();
      store.totalVisits += 1;
      store.daily[todayKey] = (Number(store.daily[todayKey]) || 0) + 1;
      if (!store.uniqueVisitorIds.includes(visitorHash)) {
        store.uniqueVisitorIds.push(visitorHash);
      }
      writeVisitorStore(store);
      sendJson(res, formatVisitorSummary(store));
    });
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Method Not Allowed");
}

function sendFile(res, filePath, status = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal Server Error");
      return;
    }
    res.writeHead(status, {
      "Content-Type": contentType,
      "Cache-Control": "no-store, must-revalidate",
    });
    res.end(data);
  });
}

function send404(res) {
  const notFoundPage = path.join(ROOT, "404.html");
  if (fs.existsSync(notFoundPage)) {
    sendFile(res, notFoundPage, 404);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - Page Not Found");
  }
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === "/api/visitors") {
    handleVisitorApi(req, res);
    return;
  }

  // Keep internal visitor storage folder private
  if (pathname === "/data" || pathname.startsWith("/data/")) {
    send404(res);
    return;
  }

  // Redirect any explicit .html URLs to clean extensionless URLs
  if (pathname === "/index.html") {
    res.writeHead(301, { Location: "/" + reqUrl.search });
    res.end();
    return;
  }

  if (pathname.endsWith("/index.html")) {
    const clean = pathname.slice(0, -"index.html".length);
    res.writeHead(301, { Location: clean + reqUrl.search });
    res.end();
    return;
  }

  if (pathname.endsWith(".html")) {
    const clean = pathname.slice(0, -".html".length) + "/";
    res.writeHead(301, { Location: clean + reqUrl.search });
    res.end();
    return;
  }

  const resolvedPath = path.resolve(ROOT, "." + pathname);
  if (!resolvedPath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  // If requesting a directory without trailing slash, redirect to trailing slash
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    if (!pathname.endsWith("/")) {
      res.writeHead(301, { Location: pathname + "/" + reqUrl.search });
      res.end();
      return;
    }
    const indexFile = path.join(resolvedPath, "index.html");
    if (fs.existsSync(indexFile)) {
      sendFile(res, indexFile);
      return;
    }
    send404(res);
    return;
  }

  // Serve static file directly if it exists
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    sendFile(res, resolvedPath);
    return;
  }

  // Fallback for extensionless flat html files if present
  const htmlFallback = resolvedPath + ".html";
  if (fs.existsSync(htmlFallback) && fs.statSync(htmlFallback).isFile()) {
    sendFile(res, htmlFallback);
    return;
  }

  send404(res);
});

server.listen(PORT, () => {
  console.log(`S.S Public School website running at http://localhost:${PORT}/`);
});
