const EMBEDS = {
  // Put your embed URLs here.
  // Notes:
  // - If an embed site blocks iframes (X-Frame-Options/CSP), this page will show a button instead.
  // - Power BI: use the iframe src from "Publish to web" or "Embed".

  areaMap: {
    type: "iframe",
    src: "https://www.arcgis.com/apps/Embed/index.html?webmap=749f7c100cc34816bedba81042dcd041&extent=-118.4761,33.8032,-117.7887,34.2777&home=true&zoom=true&previewImage=false&scale=true&disable_scroll=false&theme=light",
  },

  unreal: {
    // If Pixel Streaming can be iframed, set type to "iframe" and add src.
    // Otherwise set type to "link" to show a button.
    type: "link",
    src: "",
    label: "Open Unreal Experience",
  },

  grasshopper: {
    type: "iframe",
    src: "",
  },

  canopy: {
    type: "iframe",
    src: "",
  },

  trees: {
    type: "iframe",
    src: "",
  },

  powerbi: {
    type: "link",
    src: "https://app.powerbi.com/links/crGlHEjFWc?ctid=0b71261a-495f-4ea9-9911-da844b9402ef&pbi_source=linkShare",
    label: "Open Power BI Report",
  },
};

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function renderIframe(container, src) {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.allow = "fullscreen";
  iframe.setAttribute("allowfullscreen", "true");

  container.innerHTML = "";
  container.appendChild(iframe);
}

function renderLinkFallback(container, url, label) {
  container.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "embed__fallback";

  const card = document.createElement("div");
  card.className = "fallbackCard";

  const title = document.createElement("div");
  title.className = "fallbackCard__title";
  title.textContent = "This content opens in a new tab";

  const text = document.createElement("p");
  text.className = "fallbackCard__text";
  text.textContent =
    "Some tools (including many Unreal/enterprise dashboards) block iframe embedding. Use the button below.";

  const row = document.createElement("div");
  row.className = "fallbackCard__row";

  const a = document.createElement("a");
  a.className = "button";
  a.href = url || "#";
  a.target = "_blank";
  a.rel = "noreferrer";
  a.textContent = label || "Open";
  if (!url) {
    a.setAttribute("aria-disabled", "true");
    a.style.opacity = "0.6";
    a.style.pointerEvents = "none";
  }

  const small = document.createElement("div");
  small.className = "small";
  small.textContent = url ? url : "Set the URL in app.js";

  row.appendChild(a);
  row.appendChild(small);

  card.appendChild(title);
  card.appendChild(text);
  card.appendChild(row);
  wrap.appendChild(card);
  container.appendChild(wrap);
}

function renderActionButton(container, url, label) {
  if (!container) return;

  container.innerHTML = "";

  const a = document.createElement("a");
  a.className = "button";
  a.href = url || "#";
  a.target = "_blank";
  a.rel = "noreferrer";
  a.textContent = label || "Open";
  if (!url) {
    a.setAttribute("aria-disabled", "true");
    a.style.opacity = "0.6";
    a.style.pointerEvents = "none";
  }

  const small = document.createElement("div");
  small.className = "small";
  small.textContent = url ? url : "Set the URL in app.js";

  container.appendChild(a);
  container.appendChild(small);
}

function mountEmbeds() {
  const slots = document.querySelectorAll("[data-embed-slot]");

  slots.forEach((el) => {
    const key = el.getAttribute("data-embed-slot");
    const cfg = EMBEDS[key];
    const actionSlot = document.querySelector(`[data-embed-action-slot="${key}"]`);

    if (key === "powerbi" || key === "unreal" || key === "grasshopper" || key === "canopy" || key === "trees") {
      const img = el.querySelector(".embed__image");
      if (img) {
        const markError = () => el.classList.add("image-error");
        if (img.complete && img.naturalWidth === 0) {
          markError();
        } else {
          img.addEventListener("error", markError, { once: true });
        }
      }
    }

    if (!cfg || !cfg.src) {
      return;
    }

    if (cfg.type === "link") {
      if (actionSlot) {
        renderActionButton(actionSlot, cfg.src, cfg.label);
        return;
      }

      renderLinkFallback(el, cfg.src, cfg.label);
      return;
    }

    renderIframe(el, cfg.src);
  });
}

function initSlideshows() {
  const slideshows = document.querySelectorAll("[data-slideshow]");

  slideshows.forEach((root) => {
    const slides = Array.from(root.querySelectorAll(".slideshow__img"));
    if (slides.length <= 1) return;

    let idx = slides.findIndex((s) => s.classList.contains("is-active"));
    if (idx < 0) idx = 0;

    window.setInterval(() => {
      const prev = slides[idx];
      idx = (idx + 1) % slides.length;
      const next = slides[idx];
      if (prev) prev.classList.remove("is-active");
      if (next) next.classList.add("is-active");
    }, 3500);
  });
}

setYear();
mountEmbeds();
initSlideshows();
