/**
 * main.js
 * Logic global yang dipakai di semua halaman:
 * navigasi (hamburger + sticky header), reveal animation, parallax hero,
 * dan tahun footer otomatis.
 */

document.addEventListener("DOMContentLoaded", () => {
  initFooterYear();
  initStickyHeader();
  initNavToggle();
  initDocsPreview();
  initRevealOnScroll();
  initHeroParallax();
});

/* -------------------------------------------------- */
/* Tahun footer otomatis                               */
/* -------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById("currentYear");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

/* -------------------------------------------------- */
/* Header: transparan di hero, solid saat discroll     */
/* -------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const SCROLL_THRESHOLD = 24;

  const updateHeaderState = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

/* -------------------------------------------------- */
/* Hamburger menu (mobile navigation)                  */
/* -------------------------------------------------- */
function initNavToggle() {
  const toggleBtn = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggleBtn || !nav) return;

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.querySelector("i")?.classList.replace("ph-x", "ph-list");
  };

  const openNav = () => {
    nav.classList.add("is-open");
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.querySelector("i")?.classList.replace("ph-list", "ph-x");
  };

  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  });

  // Tutup menu saat salah satu link nav diklik (penting untuk mobile)
  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  // Tutup menu saat menekan Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      toggleBtn.focus();
    }
  });
}

/* -------------------------------------------------- */
/* Preview dokumentasi terbaru di beranda              */
/* -------------------------------------------------- */
function initDocsPreview() {
  const grid = document.getElementById("docsScroll");
  if (!grid || typeof dokumentasiData === "undefined") return;

  dokumentasiData.forEach((doc) => {
    const card = document.createElement("a");
    card.href = `dokumentasi.html#${doc.id}`;
    card.className = "doc-card";
    card.setAttribute("role", "listitem");
    card.setAttribute("data-reveal", "");

    const media = document.createElement("div");
    media.className = "doc-card-media";

    const image = document.createElement("img");
    image.src = doc.thumbnail;
    image.alt = doc.title;
    image.loading = "lazy";
    media.appendChild(image);

    const caption = document.createElement("p");
    caption.className = "doc-card-caption";
    caption.textContent = doc.title;

    card.append(media, caption);
    grid.appendChild(card);
  });
}

/* -------------------------------------------------- */
/* Reveal animation saat scroll (dan saat load)        */
/* -------------------------------------------------- */
function initRevealOnScroll() {
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay * 100);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------- */
/* Parallax tipis untuk gambar hero                    */
/* -------------------------------------------------- */
function initHeroParallax() {
  const parallaxEl = document.querySelector("[data-parallax]");
  if (!parallaxEl) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    const offset = Math.min(scrollY * 0.08, 24); // cap biar tetap subtle
    parallaxEl.style.transform = `translateY(${offset}px)`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
}