/**
 * anggota.js
 * Hanya jalan di anggota.html.
 * Bergantung pada: anggotaData, kepengurusanInti (data/anggota.js)
 */

let activeMemberTrigger = null;
let memberDetailCloseTimer = null;
let memberDetailOpenFrame = null;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof anggotaData === "undefined") return;

  const state = {
    divisi: "semua"
  };

  const grid = document.getElementById("memberGrid");
  const emptyState = document.getElementById("memberEmptyState");
  const filterGroup = document.getElementById("divisionFilter");
  const divisionIntro = document.getElementById("divisionIntro");

  initFilterFromUrl(state, filterGroup);
  renderMemberGrid(state, grid, emptyState, divisionIntro);

  filterGroup?.addEventListener("click", (event) => {
    const chip = event.target.closest(".filter-chip");
    if (!chip) return;
    setActiveChip(filterGroup, chip);
    state.divisi = chip.dataset.filter;
    renderMemberGrid(state, grid, emptyState, divisionIntro);
  });

  initMemberDetailOverlay(grid);
});

/* -------------------------------------------------- */
/* Baca ?divisi=... dari URL (datang dari profil.html) */
/* -------------------------------------------------- */
function initFilterFromUrl(state, filterGroup) {
  const params = new URLSearchParams(window.location.search);
  const divisiParam = params.get("divisi");
  if (!divisiParam || !filterGroup) return;

  const matchingChip = filterGroup.querySelector(
    `[data-filter="${divisiParam}"]`
  );
  if (!matchingChip) return;

  state.divisi = divisiParam;
  setActiveChip(filterGroup, matchingChip);

  // Bawa user langsung ke bagian filter, biar nggak bingung kenapa grid berubah
  filterGroup.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setActiveChip(filterGroup, activeChip) {
  filterGroup.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.remove("is-active");
    chip.setAttribute("aria-pressed", "false");
  });
  activeChip.classList.add("is-active");
  activeChip.setAttribute("aria-pressed", "true");
}

function initMemberDetailOverlay(grid) {
  const overlay = document.getElementById("memberDetailOverlay");
  const closeButton = document.getElementById("memberDetailClose");
  if (!overlay || !grid) return;

  closeButton?.addEventListener("click", closeMemberDetail);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeMemberDetail();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeMemberDetail();
  });

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest(".member-card-trigger");
    if (!trigger) return;

    const card = trigger.closest(".member-card");
    const member = anggotaData.find((item) => item.id === card?.dataset.id);
    if (member) openMemberDetail(member, trigger);
  });

  grid.addEventListener("keydown", (event) => {
    const trigger = event.target.closest(".member-card-trigger");
    if (!trigger || (event.key !== "Enter" && event.key !== " ")) return;

    event.preventDefault();
    trigger.click();
  });
}

function openMemberDetail(member, trigger) {
  const overlay = document.getElementById("memberDetailOverlay");
  const image = document.getElementById("memberDetailImage");
  const name = document.getElementById("memberDetailName");
  const role = document.getElementById("memberDetailRole");
  const memberClass = document.getElementById("memberDetailClass");
  const intro = document.getElementById("memberDetailIntro");
  const quote = document.getElementById("memberDetailQuote");
  if (!overlay || !image || !name || !role || !memberClass || !intro || !quote) return;

  activeMemberTrigger = trigger;
  image.src = member.foto;
  image.alt = `Foto ${member.nama}`;
  name.textContent = member.nama;
  role.textContent = member.jabatan || formatDivisiLabel(member.divisi);
  memberClass.textContent = `Kelas: ${member.kelas || "Belum ada data"}`;
  intro.textContent = member.perkenalan || "";
  quote.textContent = member.quote ? `“${member.quote}”` : "";
  quote.hidden = !member.quote;

  window.clearTimeout(memberDetailCloseTimer);
  memberDetailCloseTimer = null;
  window.cancelAnimationFrame(memberDetailOpenFrame);
  overlay.hidden = false;
  overlay.inert = false;
  overlay.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("memberDetailClose")?.focus();
  memberDetailOpenFrame = window.requestAnimationFrame(() => {
    overlay.classList.add("is-open");
    memberDetailOpenFrame = null;
  });
}

function closeMemberDetail() {
  const overlay = document.getElementById("memberDetailOverlay");
  if (!overlay || overlay.hidden || memberDetailCloseTimer !== null) return;

  window.cancelAnimationFrame(memberDetailOpenFrame);
  memberDetailOpenFrame = null;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  overlay.inert = true;
  activeMemberTrigger?.focus();
  activeMemberTrigger = null;

  const finishClose = () => {
    overlay.hidden = true;
    overlay.inert = false;
    overlay.removeAttribute("aria-hidden");
    document.body.style.overflow = "";
    memberDetailCloseTimer = null;
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishClose();
    return;
  }

  memberDetailCloseTimer = window.setTimeout(finishClose, 260);
}

/* -------------------------------------------------- */
/* Render grid anggota berdasarkan filter divisi        */
/* -------------------------------------------------- */
function renderMemberGrid(state, grid, emptyState, divisionIntro) {
  if (!grid) return;

  updateDivisionIntro(state.divisi, divisionIntro);

  const filtered =
    state.divisi === "semua"
      ? anggotaData
      : anggotaData.filter((member) => member.divisi === state.divisi);

  grid.setAttribute("aria-busy", "false");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  filtered.forEach((member, index) => {
    const li = document.createElement("li");
    li.className = "member-card";
    li.dataset.divisi = member.divisi;
    li.dataset.id = member.id;
    li.setAttribute("data-reveal", "");
    li.setAttribute("data-reveal-delay", String(index % 4));

    li.innerHTML = `
      <div class="member-card-trigger" role="button" tabindex="0" aria-label="Lihat foto dan detail ${member.nama}">
        <div class="member-card-photo">
          <img src="${member.foto}" alt="Foto ${member.nama}" loading="lazy">
        </div>
        <h3 class="member-card-name">${member.nama}</h3>
        <p class="member-card-role">${
          member.jabatan ? member.jabatan : formatDivisiLabel(member.divisi)
        }</p>
        ${
          member.quote
            ? `<p class="member-card-quote">&ldquo;${member.quote}&rdquo;</p>`
            : ""
        }
      </div>
    `;

    grid.appendChild(li);
  });

  // Kartu baru ditambahkan setelah main.js pasang observer-nya duluan,
  // jadi reveal animation perlu di-attach ulang khusus untuk kartu ini.
  attachRevealToNewCards(grid);
}

function updateDivisionIntro(divisi, intro) {
  if (!intro) return;

  const divisions = {
    semua: {
      title: "Semua Divisi",
      description:
        "Kenali para anggota JURNALISTIK dari berbagai divisi yang bekerja bersama untuk membuat cerita dan informasi.",
      icon: "ph-users-three"
    },
    kreatif: {
      title: "Kreatif",
      description:
        "Mengembangkan ide dan konsep konten agar setiap karya JURNALISTIK terasa segar, relevan, dan bermakna.",
      icon: "ph-palette"
    },
    "desain-grafis": {
      title: "Desain Grafis",
      description:
        "Mengolah ide menjadi visual yang menarik dan komunikatif, mulai dari poster hingga identitas konten.",
      icon: "ph-paint-brush"
    },
    editing: {
      title: "Editing",
      description:
        "Menyusun dan menyempurnakan foto maupun video agar setiap dokumentasi siap dinikmati dan dibagikan.",
      icon: "ph-film-slate"
    },
    fotografi: {
      title: "Fotografi",
      description:
        "Mengabadikan momen dan cerita di lingkungan sekolah melalui sudut pandang fotografi.",
      icon: "ph-camera"
    },
    videografi: {
      title: "Videografi",
      description:
        "Merekam momen dan merangkainya menjadi cerita bergerak yang hidup dan berkesan.",
      icon: "ph-video-camera"
    },
    artikel: {
      title: "Artikel",
      description:
        "Merangkai informasi dan cerita sekolah menjadi tulisan yang jelas, menarik, dan mudah dipahami.",
      icon: "ph-newspaper"
    }
  };
  const content = divisions[divisi] || divisions.semua;
  const title = intro.querySelector("#divisionIntroTitle");
  const description = intro.querySelector("#divisionIntroDescription");
  const icon = intro.querySelector(".division-intro-icon i");

  if (title) title.textContent = content.title;
  if (description) description.textContent = content.description;
  if (icon) icon.className = `ph ${content.icon}`;
}

/* -------------------------------------------------- */
/* Reveal animation untuk kartu yang di-render belakangan */
/* -------------------------------------------------- */
function attachRevealToNewCards(grid) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const cards = grid.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add("is-visible"));
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

  cards.forEach((card) => observer.observe(card));
}

/* -------------------------------------------------- */
/* Fallback label kalau jabatan kosong                 */
/* -------------------------------------------------- */
function formatDivisiLabel(divisiId) {
  const labels = {
    kreatif: "Kreatif",
    "desain-grafis": "Desain Grafis",
    editing: "Editing",
    fotografi: "Fotografi",
    videografi: "Videografi",
    artikel: "Artikel"
  };
  return labels[divisiId] || divisiId;
}