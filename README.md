# S.S Public School, Sushma Nagar, Lucknow

Redesigned light-mode website with clean extensionless URLs (no `.html` visible in the browser URL bar).

## Clean URL Setup (No `.html` in URL)
Every page lives inside its own clean route directory:
- `/` -> `index.html`
- `/about/` -> `about/index.html`
- `/academics/` -> `academics/index.html`
- `/faculty/` -> `faculty/index.html`
- `/gallery/` -> `gallery/index.html`
- `/admission/` -> `admission/index.html`
- `/contact/` -> `contact/index.html`

Plus server rewrite configs are included for all major hosts:
- `server.js` + `start-website.bat` (local Node.js server — redirects any `.html` request to clean URLs)
- `.htaccess` (Apache / cPanel / XAMPP / Hostinger)
- `vercel.json` (Vercel)
- `netlify.toml` & `_redirects` (Netlify / Cloudflare Pages)

## How to Run Locally
1. Double-click `start-website.bat` (or run `node server.js` in this folder), then open `http://localhost:3000/`.
2. Or open with VS Code **Live Server** — all URLs automatically show `/about/`, `/academics/`, `/admission/`, etc. without `.html`.
