/**
 * dokumentasi.js
 * Hanya jalan di dokumentasi.html.
 * Bergantung pada: dokumentasiData (data/dokumentasi.js)
 */

let docDetailCloseTimer = null;
let docDetailOpenFrame = null;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof dokumentasiData === "undefined") return;

  const state = {
    category: "semua"
  };

  const grid = document.getElementById("docsGrid");
  const emptyState = document.getElementById("docsEmptyState");
  const categoryFilter = document.getElementById("docsCategoryFilter");

  renderGrid(state, grid, emptyState);

  categoryFilter?.addEventListener("click", (event) => {
    const chip = event.target.closest(".filter-chip");
    if (!chip) return;

    categoryFilter
      .querySelectorAll(".filter-chip")
      .forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });

    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");
    state.category = chip.dataset.category;
    renderGrid(state, grid, emptyState);
  });

  grid?.addEventListener("click", (event) => {
    const trigger = event.target.closest(".doc-grid-trigger");
    if (!trigger) return;
    const card = trigger.closest("[data-id]");
    openDocDetail(card.dataset.id);
  });

  initDetailOverlay();

  // Buka langsung kalau URL punya hash, misalnya dokumentasi.html#upacara-bendera
  if (window.location.hash) {
    const idFromHash = window.location.hash.replace("#", "");
    if (dokumentasiData.some((d) => d.id === idFromHash)) {
      openDocDetail(idFromHash);
    }
  }
});

/* -------------------------------------------------- */
/* Render grid berdasarkan kategori                   */
/* -------------------------------------------------- */
function renderGrid(state, grid, emptyState) {
  if (!grid) return;

  const filtered = dokumentasiData.filter((doc) => {
    const categories = Array.isArray(doc.category)
      ? doc.category
      : [doc.category];
    return state.category === "semua" || categories.includes(state.category);
  });

  grid.setAttribute("aria-busy", "false");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  filtered.forEach((doc, index) => {
    const li = document.createElement("li");
    li.className = "doc-grid-card";
    li.dataset.id = doc.id;
    li.dataset.category = Array.isArray(doc.category)
      ? doc.category.join(" ")
      : doc.category;
    li.setAttribute("data-reveal", "");
    li.setAttribute("data-reveal-delay", String(index % 4));

    const formattedDate = formatter.format(new Date(doc.date));

    li.innerHTML = `
      <button type="button" class="doc-grid-trigger" aria-haspopup="dialog">
        <div class="doc-grid-media">
          <img src="${doc.thumbnail}" alt="Dokumentasi ${doc.title}" loading="lazy">
        </div>
        <div class="doc-grid-info">
          <h3 class="doc-grid-title">${doc.title}</h3>
          <p class="doc-grid-date">${formattedDate}</p>
        </div>
      </button>
    `;

    grid.appendChild(li);
  });

  attachRevealToDocCards(grid);
}

function attachRevealToDocCards(grid) {
  const cards = grid.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const delay = Number(entry.target.dataset.revealDelay || 0);
        window.setTimeout(() => entry.target.classList.add("is-visible"), delay * 80);
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  cards.forEach((card) => observer.observe(card));
}

/* -------------------------------------------------- */
/* Panel detail dokumentasi                           */
/* -------------------------------------------------- */
function initDetailOverlay() {
  const overlay = document.getElementById("docDetailOverlay");
  const closeBtn = document.getElementById("docDetailClose");
  if (!overlay) return;

  closeBtn?.addEventListener("click", closeDocDetail);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeDocDetail();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeDocDetail();
  });
}

function openDocDetail(id) {
  if (!id) return;
  const doc = dokumentasiData.find((d) => d.id === id);
  if (!doc) return;

  const overlay = document.getElementById("docDetailOverlay");
  const image = document.getElementById("docDetailImage");
  const title = document.getElementById("docDetailTitle");
  const date = document.getElementById("docDetailDate");
  const description = document.getElementById("docDetailDescription");
  const driveLink = document.getElementById("docDetailDriveLink");

  if (!overlay) return;

  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  if (image) {
    image.src = doc.thumbnail || "";
    image.alt = `Dokumentasi ${doc.title}`;
  }
  if (title) title.textContent = doc.title;
  if (date) date.textContent = formatter.format(new Date(doc.date));
  if (description) description.textContent = doc.description;
  if (driveLink) driveLink.href = doc.driveUrl || "#";

  window.clearTimeout(docDetailCloseTimer);
  docDetailCloseTimer = null;
  window.cancelAnimationFrame(docDetailOpenFrame);
  overlay.hidden = false;
  overlay.inert = false;
  overlay.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
  history.replaceState(null, "", `#${doc.id}`);

  document.getElementById("docDetailClose")?.focus();
  docDetailOpenFrame = window.requestAnimationFrame(() => {
    overlay.classList.add("is-open");
    docDetailOpenFrame = null;
  });
}

function closeDocDetail() {
  const overlay = document.getElementById("docDetailOverlay");
  if (!overlay || overlay.hidden || docDetailCloseTimer !== null) return;

  window.cancelAnimationFrame(docDetailOpenFrame);
  docDetailOpenFrame = null;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  overlay.inert = true;
  history.replaceState(null, "", window.location.pathname + window.location.search);

  const finishClose = () => {
    overlay.hidden = true;
    overlay.inert = false;
    overlay.removeAttribute("aria-hidden");
    document.body.style.overflow = "";
    docDetailCloseTimer = null;
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishClose();
    return;
  }

  docDetailCloseTimer = window.setTimeout(finishClose, 260);
}
