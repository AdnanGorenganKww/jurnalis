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
  renderLeadershipCards();
  initLeaderCardDetails();
});

let activeLeaderTrigger = null;
let leaderDetailCloseTimer = null;
let leaderDetailOpenFrame = null;

function renderLeadershipCards() {
  if (typeof kepengurusanInti === "undefined") return;

  const pembinaContainer = document.getElementById("pembinaCards");
  const intiContainer = document.getElementById("pengurusIntiCards");
  if (!pembinaContainer && !intiContainer) return;

  const roleIcons = {
    "Pembina": "ph-shield-check",
    "Ketua": "ph-crown",
    "Wakil Ketua 1": "ph-user-gear",
    "Wakil Ketua 2": "ph-user-gear"
  };
  const createCard = (person, extraClass = "") => {
    const card = document.createElement("article");
    card.className = `org-card org-card-lead ${extraClass}`.trim();
    card.dataset.leader = person.id;
    card.setAttribute("aria-label", `Lihat detail ${person.jabatan}: ${person.nama}`);

    const image = document.createElement("img");
    image.className = "org-card-photo";
    if (person.foto) image.src = person.foto;
    else image.hidden = true;
    image.alt = `Foto ${person.nama} JURNALISTIK`;

    const role = document.createElement("p");
    role.className = "org-card-role";
    const icon = document.createElement("i");
    icon.className = `ph ${roleIcons[person.jabatan] || "ph-user"}`;
    icon.setAttribute("aria-hidden", "true");
    role.append(icon, document.createTextNode(` ${person.jabatan}`));

    const name = document.createElement("h3");
    name.className = "org-card-name";
    name.textContent = person.nama;

    card.append(image, role, name);
    return card;
  };

  const pembina = kepengurusanInti.filter((person) => person.id.startsWith("pembina-"));
  const pengurusIntiOrder = ["wakil-ketua-1", "ketua", "wakil-ketua-2"];
  const pengurusInti = pengurusIntiOrder
    .map((id) => kepengurusanInti.find((person) => person.id === id))
    .filter(Boolean);

  if (pembinaContainer) {
    pembinaContainer.replaceChildren(
      ...pembina.map((person) => createCard(person, "org-pembina-card"))
    );
  }
  if (intiContainer) {
    intiContainer.replaceChildren(...pengurusInti.map((person) => createCard(person)));
  }
}

function initLeaderCardDetails() {
  const leaderCards = document.querySelectorAll(".org-card[data-leader]");
  if (!leaderCards.length) return;

  const overlay = ensureLeaderDetailOverlay();
  const hasMemberDetailController =
    typeof openMemberDetail === "function" &&
    typeof closeMemberDetail === "function";

  if (!hasMemberDetailController) {
    const closeButton = document.getElementById("memberDetailClose");
    closeButton?.addEventListener("click", () => closeLeaderDetail(overlay));

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeLeaderDetail(overlay);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) {
        closeLeaderDetail(overlay);
      }
    });
  }

  leaderCards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", () =>
      openLeaderDetail(card, overlay, hasMemberDetailController)
    );
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });
}

function ensureLeaderDetailOverlay() {
  let overlay = document.getElementById("memberDetailOverlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "memberDetailOverlay";
  overlay.className = "member-detail-overlay";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "memberDetailName");
  overlay.innerHTML = `
    <div class="member-detail-panel">
      <div class="member-detail-header">
        <h2 class="member-detail-name" id="memberDetailName"></h2>
        <div class="member-detail-toolbar">
          <button type="button" class="member-detail-close" id="memberDetailClose" aria-label="Tutup detail">
            <i class="ph ph-x" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <img class="member-detail-image" id="memberDetailImage" src="" alt="">
      <div class="member-detail-body">
        <p class="member-detail-role" id="memberDetailRole"></p>
        <p class="member-detail-class" id="memberDetailClass"></p>
        <p class="member-detail-intro" id="memberDetailIntro"></p>
        <blockquote class="member-detail-quote" id="memberDetailQuote"></blockquote>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

function openLeaderDetail(card, overlay, hasMemberDetailController) {
  const key = card.dataset.leader;
  const leader = typeof kepengurusanInti === "undefined"
    ? null
    : kepengurusanInti.find((person) => person.id === key);
  if (!leader) return;

  if (hasMemberDetailController) {
    openMemberDetail({ ...leader, divisi: "kreatif" }, card);
    return;
  }

  const image = document.getElementById("memberDetailImage");
  const name = document.getElementById("memberDetailName");
  const role = document.getElementById("memberDetailRole");
  const memberClass = document.getElementById("memberDetailClass");
  const intro = document.getElementById("memberDetailIntro");
  const quote = document.getElementById("memberDetailQuote");

  if (!image || !name || !role || !memberClass || !intro || !quote) return;

  image.hidden = !leader.foto;
  if (leader.foto) image.src = leader.foto;
  image.alt = `Foto ${leader.nama}`;
  name.textContent = leader.nama;
  role.textContent = leader.jabatan;
  memberClass.textContent = leader.id.startsWith("pembina-")
    ? `Guru Mata Pelajaran: ${leader.mataPelajaran || "Belum ada data"}`
    : `Kelas: ${leader.kelas || "Belum ada data"}`;
  memberClass.hidden = false;
  intro.textContent = leader.perkenalan || "Belum ada data";
  intro.hidden = false;
  quote.textContent = leader.quote ? `“${leader.quote}”` : "";
  quote.hidden = !leader.quote;

  activeLeaderTrigger = card;
  window.clearTimeout(leaderDetailCloseTimer);
  leaderDetailCloseTimer = null;
  window.cancelAnimationFrame(leaderDetailOpenFrame);
  overlay.hidden = false;
  overlay.inert = false;
  overlay.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("memberDetailClose")?.focus();
  leaderDetailOpenFrame = window.requestAnimationFrame(() => {
    overlay.classList.add("is-open");
    leaderDetailOpenFrame = null;
  });
}

function closeLeaderDetail(overlay) {
  if (!overlay || overlay.hidden || leaderDetailCloseTimer !== null) return;

  window.cancelAnimationFrame(leaderDetailOpenFrame);
  leaderDetailOpenFrame = null;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  overlay.inert = true;
  activeLeaderTrigger?.focus();
  activeLeaderTrigger = null;

  const finishClose = () => {
    overlay.hidden = true;
    overlay.inert = false;
    overlay.removeAttribute("aria-hidden");
    document.body.style.overflow = "";
    leaderDetailCloseTimer = null;
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishClose();
    return;
  }

  leaderDetailCloseTimer = window.setTimeout(finishClose, 260);
}

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

  const featuredDocs = [...dokumentasiData]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  featuredDocs.forEach((doc) => {
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