(function () {
  const page = document.body.dataset.page || "index";
  const isFileProtocol = window.location.protocol === "file:";
  const base = page === "index" ? "./" : "../";
  const logoImgHtml = `<img class="brand-logo" src="${base}assets/images/school-logo.png" alt="S.S Public School Logo" />`;

  // Clean URL normalization on HTTP/HTTPS if someone opened /index.html explicitly
  if (!isFileProtocol && window.location.pathname.endsWith("/index.html")) {
    const cleanPath = window.location.pathname.slice(0, -"index.html".length);
    window.history.replaceState(null, "", cleanPath + window.location.search + window.location.hash);
  }

  function routeHref(slug) {
    if (slug === "index") {
      return isFileProtocol ? `${base}index.html` : base;
    }
    return isFileProtocol ? `${base}${slug}/index.html` : `${base}${slug}/`;
  }

  // Ensure any static clean links inside HTML also work seamlessly on file:// double-click
  if (isFileProtocol) {
    document.querySelectorAll('a[href$="/"]').forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("//")) {
        anchor.setAttribute("href", href + "index.html");
      }
    });
  }

  const navItems = [
    { id: "index", label: "Home", key: "nav_home" },
    { id: "about", label: "About", key: "nav_about" },
    { id: "academics", label: "Academics", key: "nav_academics" },
    { id: "faculty", label: "Faculty", key: "nav_faculty" },
    { id: "gallery", label: "Gallery", key: "nav_gallery" },
    { id: "contact", label: "Contact", key: "nav_contact" },
  ];

  // Top progress bar
  const progressBar = document.createElement("div");
  progressBar.id = "scroll-progress";
  document.body.prepend(progressBar);

  // Header
  const hdrMount = document.getElementById("hdr");
  if (hdrMount) {
    hdrMount.outerHTML = `
      <header class="site-header" id="siteHeader">
        <div class="nav-wrap">
          <a class="brand" href="${routeHref("index")}">
            ${logoImgHtml}
            <span class="brand-text">
              <strong data-i18n="brand_name">S.S Public School</strong>
              <small data-i18n="brand_sub">Sushma Nagar, Lucknow</small>
            </span>
          </a>

          <nav class="main-nav" id="mainNav" aria-label="Main navigation">
            <div class="nav-links">
              ${navItems
                .map(
                  (item) =>
                    `<a href="${routeHref(item.id)}" data-i18n="${item.key}" class="${
                      page === item.id ? "active" : ""
                    }">${item.label}</a>`
                )
                .join("")}
            </div>
            <div class="nav-actions">
              <a href="${routeHref("contact")}" class="nav-btn nav-btn-soft" data-i18n="nav_enquire">Enquire Now</a>
              <a href="${routeHref("admission")}" class="nav-btn nav-btn-accent ${
                page === "admission" ? "active" : ""
              }" data-i18n="nav_admission">Admission Open</a>
              <div class="lang-switch" role="group" aria-label="Language switcher">
                <button class="lang-btn" type="button" data-lang="en">EN</button>
                <button class="lang-btn" type="button" data-lang="hi">हिंदी</button>
              </div>
            </div>
          </nav>

          <button class="burger" id="navToggle" type="button" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mainNav">☰</button>
        </div>
      </header>
    `;
  }

  // Footer
  const ftrMount = document.getElementById("ftr");
  if (ftrMount) {
    ftrMount.outerHTML = `
      <footer class="site-footer">
        <div class="footer-top-strip">
          <div class="footer-top-inner">
            <div class="footer-cta-copy">
              <span class="footer-cta-badge" data-i18n="footer_cta_badge">Admissions 2027–28 Open</span>
              <h3 data-i18n="footer_cta_title">Give Your Child a Bright Beginning at S.S Public School</h3>
            </div>
            <a class="btn btn-primary" href="${routeHref("admission")}" data-i18n="footer_cta_btn">Apply for Admission →</a>
          </div>
        </div>

        <div class="footer-grid">
          <div class="footer-col-brand">
            <a class="footer-brand-row" href="${routeHref("index")}">
              ${logoImgHtml}
              <span>
                <strong data-i18n="brand_name">S.S Public School</strong>
                <small data-i18n="brand_sub">Sushma Nagar, Lucknow</small>
              </span>
            </a>
            <p data-i18n="footer_bio">Building a bright future for children with knowledge, discipline, and strong moral values. A trusted school in Sushma Nagar, Lucknow.</p>
            <div class="social-pills">
              <a href="#top" aria-label="Facebook">Facebook</a>
              <a href="#top" aria-label="Instagram">Instagram</a>
              <a href="#top" aria-label="YouTube">YouTube</a>
              <a href="#top" aria-label="WhatsApp">WhatsApp</a>
            </div>
          </div>

          <div>
            <h4 data-i18n="footer_quick_links">Quick Links</h4>
            <div class="footer-links">
              ${navItems
                .map(
                  (item) => `<a href="${routeHref(item.id)}" data-i18n="${item.key}">${item.label}</a>`
                )
                .join("")}
              <a href="${routeHref("admission")}" data-i18n="nav_admission">Admission Open</a>
            </div>
          </div>

          <div>
            <h4 data-i18n="footer_contact">Contact</h4>
            <div class="footer-contact-list">
              <p class="footer-contact-item"><span data-i18n="footer_address_line">📍 Sushma Nagar, Lucknow, Uttar Pradesh</span></p>
              <p class="footer-contact-item">📞 <a href="tel:+919876543210">+91 98765 43210</a></p>
              <p class="footer-contact-item">✉️ <a href="mailto:info@sspublicschool.in">info@sspublicschool.in</a></p>
            </div>
            <div class="footer-timings-box">
              <h5 data-i18n="footer_timings">School Timings</h5>
              <p data-i18n-html="footer_timings_html">
                Mon–Sat: 8:00 AM – 2:30 PM<br />
                Office: 9:00 AM – 3:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          <div>
            <h4 data-i18n="footer_visits_lbl">Total Visitors</h4>
            <div class="visitor-card" id="visitorCard" aria-live="polite">
              <div class="visitor-head">
                <span class="visitor-live-dot" aria-hidden="true"></span>
                <span class="visitor-label" data-i18n="footer_visits_lbl">Total Visitors</span>
              </div>
              <div class="visitor-main-num" id="visitorTotal">—</div>
              <div class="visitor-stats-mini">
                <div>
                  <small data-i18n="footer_unique_lbl">Unique</small>
                  <strong id="visitorUnique">—</strong>
                </div>
                <div>
                  <small data-i18n="footer_today_lbl">Today</small>
                  <strong id="visitorToday">—</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-inner">
            <span data-i18n="footer_copy">© 2026 S.S Public School, Sushma Nagar, Lucknow. All rights reserved.</span>
            <span class="visitor-pill">
              <span class="visitor-live-dot" aria-hidden="true"></span>
              <span data-i18n="footer_visits_lbl">Total Visitors</span>:
              <strong id="visitorBadgeCount">—</strong>
            </span>
          </div>
        </div>
      </footer>
    `;
  }

  // Bilingual Language Switcher (EN / हिंदी)
  const dict = window.SSPS_I18N || {};
  let currentLang = "en";
  try {
    const saved = localStorage.getItem("ssps_lang");
    if (saved === "hi" || saved === "en") currentLang = saved;
  } catch (e) {}

  let activePhrases = (dict[currentLang] && dict[currentLang].typing_phrases) || [
    "Excellence in Education",
    "Values & Discipline",
    "Learning with Joy",
    "Shaping Future Leaders",
  ];
  let resetTypingFn = null;

  function applyLanguage(lang) {
    if (!dict[lang]) return;
    currentLang = lang;
    try {
      localStorage.setItem("ssps_lang", lang);
    } catch (e) {}

    const t = dict[lang];
    document.documentElement.lang = lang;

    const titleKey = `title_${page}`;
    if (t[titleKey]) document.title = t[titleKey];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key] !== undefined) el.setAttribute("placeholder", t[key]);
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const isSelected = btn.dataset.lang === lang;
      btn.classList.toggle("active", isSelected);
      btn.setAttribute("aria-pressed", String(isSelected));
    });

    if (Array.isArray(t.typing_phrases) && t.typing_phrases.length) {
      activePhrases = t.typing_phrases;
      if (resetTypingFn) resetTypingFn();
    }
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.dataset.lang);
    });
  });

  // Mobile Menu Behavior
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    const closeMenu = () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.textContent = "☰";
    };

    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.textContent = open ? "✕" : "☰";
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (e) => {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Scroll Progress, Sticky Header, Back to Top
  const headerEl = document.getElementById("siteHeader");
  const backTopBtn = document.createElement("button");
  backTopBtn.className = "back-top";
  backTopBtn.type = "button";
  backTopBtn.setAttribute("aria-label", "Back to top");
  backTopBtn.textContent = "↑";
  backTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(backTopBtn);

  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    if (headerEl) headerEl.classList.toggle("scrolled", window.scrollY > 24);
    backTopBtn.classList.toggle("show", window.scrollY > 360);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Typing Effect on Home Hero (reacts to language switches)
  const typEl = document.getElementById("typ");
  if (typEl) {
    let pIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timerId = null;

    const schedule = (ms) => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(step, ms);
    };

    const step = () => {
      const current = activePhrases[pIndex % activePhrases.length] || "";
      if (!deleting) {
        charIndex += 1;
        typEl.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          deleting = true;
          schedule(1800);
          return;
        }
        schedule(65);
      } else {
        charIndex -= 1;
        typEl.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          pIndex = (pIndex + 1) % activePhrases.length;
          schedule(350);
          return;
        }
        schedule(38);
      }
    };

    resetTypingFn = () => {
      pIndex = 0;
      deleting = true;
      const first = activePhrases[0] || "";
      charIndex = first.length;
      typEl.textContent = first;
      schedule(1800);
    };

    resetTypingFn();
  }

  // Apply initial language right after DOM & typing setup
  applyLanguage(currentLang);

  // Real Visitor Counter (Server-backed via /api/visitors, with static fallback)
  function renderVisitorStats(stats) {
    const fmt = (n) => (typeof n === "number" && !Number.isNaN(n) ? n.toLocaleString("en-IN") : "—");
    const totalEl = document.getElementById("visitorTotal");
    const uniqueEl = document.getElementById("visitorUnique");
    const todayEl = document.getElementById("visitorToday");
    const badgeEl = document.getElementById("visitorBadgeCount");
    if (totalEl) totalEl.textContent = fmt(stats.totalVisits);
    if (uniqueEl) uniqueEl.textContent = fmt(stats.uniqueVisitors);
    if (todayEl) todayEl.textContent = fmt(stats.todayVisits);
    if (badgeEl) badgeEl.textContent = fmt(stats.totalVisits);
  }

  async function initVisitorCounter() {
    if (!document.getElementById("visitorCard")) return;
    let visitorId = "";
    let isNewSession = true;
    try {
      visitorId = localStorage.getItem("ssps_visitor_id") || "";
      if (!visitorId) {
        visitorId = "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
        localStorage.setItem("ssps_visitor_id", visitorId);
      }
      isNewSession = !sessionStorage.getItem("ssps_visit_recorded");
    } catch (e) {}

    // 1. Primary: Real server-side persistent counter (/api/visitors)
    if (!isFileProtocol) {
      try {
        const res = await fetch(`${base}api/visitors`.replace(/^\.\//, "/"), {
          method: isNewSession ? "POST" : "GET",
          headers: isNewSession ? { "Content-Type": "application/json" } : undefined,
          body: isNewSession ? JSON.stringify({ visitorId }) : undefined,
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          try {
            if (isNewSession) sessionStorage.setItem("ssps_visit_recorded", "1");
          } catch (e) {}
          renderVisitorStats(data);
          return;
        }
      } catch (e) {}

      // 2. Fallback for static deployments (GitHub Pages / Netlify / Vercel without server.js)
      try {
        const endpoint = isNewSession
          ? "https://api.counterapi.dev/v1/ss-public-school-sushma-nagar/visits/up"
          : "https://api.counterapi.dev/v1/ss-public-school-sushma-nagar/visits";
        const extRes = await fetch(endpoint, { cache: "no-store" });
        if (extRes.ok) {
          const extData = await extRes.json();
          const count = Number(extData.count) || 1;
          try {
            if (isNewSession) sessionStorage.setItem("ssps_visit_recorded", "1");
          } catch (e) {}
          renderVisitorStats({ totalVisits: count, uniqueVisitors: count, todayVisits: 1 });
          return;
        }
      } catch (e) {}
    }

    // 3. Offline / file:// fallback using browser localStorage
    try {
      let localCount = Number(localStorage.getItem("ssps_local_visits")) || 0;
      if (isNewSession || localCount === 0) {
        localCount += 1;
        localStorage.setItem("ssps_local_visits", String(localCount));
        sessionStorage.setItem("ssps_visit_recorded", "1");
      }
      renderVisitorStats({ totalVisits: localCount, uniqueVisitors: 1, todayVisits: localCount });
    } catch (e) {
      renderVisitorStats({ totalVisits: 1, uniqueVisitors: 1, todayVisits: 1 });
    }
  }
  initVisitorCounter();

  // Smooth Scroll Reveal
  const revealEls = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${(idx % 4) * 75}ms`;
            entry.target.classList.add("in", "anim-rise");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // Counter Animation
  const counters = document.querySelectorAll("[data-n]");
  if (counters.length) {
    const animateCounter = (el) => {
      const target = Number(el.dataset.n) || 0;
      const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : "+";
      const duration = 1100;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    counters.forEach((el) => co.observe(el));
  }

  // Inline Form Confirmation
  document.querySelectorAll(".school-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const status = form.querySelector(".form-status");
      if (status) {
        status.classList.add("show");
      }
      form.reset();
    });
  });

  // Gallery Filter & Lightbox
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryCards = document.querySelectorAll(".gallery-card");
  if (filterBtns.length && galleryCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.filter;
        galleryCards.forEach((card) => {
          const match = cat === "all" || card.dataset.category === cat;
          card.classList.toggle("hidden", !match);
        });
      });
    });
  }

  const lightbox = document.getElementById("galleryLightbox");
  if (lightbox && galleryCards.length) {
    const lbTitle = lightbox.querySelector("#lbTitle");
    const lbImg = lightbox.querySelector("#lbImg");
    const lbDesc = lightbox.querySelector("#lbDesc");
    const lbClose = lightbox.querySelector("#lbClose");

    const closeLightbox = () => lightbox.classList.remove("open");

    galleryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img");
        const title = card.querySelector("h3")?.textContent || "";
        const desc = card.querySelector("p")?.textContent || "";
        if (img && lbImg) {
          lbImg.src = img.src;
          lbImg.alt = img.alt || title;
        }
        if (lbTitle) lbTitle.textContent = title;
        if (lbDesc) lbDesc.textContent = desc;
        lightbox.classList.add("open");
      });
    });

    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }
})();
