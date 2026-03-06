/* assets/js/site.js */
(() => {
  "use strict";

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- 1) set year ----------
  function initYear() {
    const el = $("#year");
    if (!el) return;
    el.textContent = new Date().getFullYear();
  }

  // ---------- 2) mobile menu ----------
  function initMobileMenu() {
    const mobileBtn = $("#mobileBtn");
    const mobileNav = $("#mobileNav");
    if (!mobileBtn || !mobileNav) return;

    mobileBtn.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("show");
      mobileBtn.setAttribute("aria-expanded", String(open));
    });
  }

  // ---------- 3) theme (select) : auto/light/dark ----------
  function initThemeSelect() {
    const root = document.documentElement;
    const select = $("#themeSelect");
    if (!select) return;

    const saved = localStorage.getItem("theme") || "auto";

    function applyTheme(mode) {
      if (mode === "auto") {
        root.removeAttribute("data-theme");
        localStorage.removeItem("theme"); // biar konsisten: auto = kosong
      } else {
        root.setAttribute("data-theme", mode);
        localStorage.setItem("theme", mode);
      }
    }

    applyTheme(saved);
    select.value = saved;

    select.addEventListener("change", (e) => {
      applyTheme(e.target.value);
    });
  }

  // ---------- 4) theme (dropdown custom) ----------
  function initThemeDropdown() {
    const root = document.documentElement;
    const dropdown = $("#themeDropdown");
    const trigger = $("#themeTrigger");
    const label = $("#themeLabel");
    if (!dropdown || !trigger || !label) return;

    const options = $$(".themeMenu button", dropdown);
    if (!options.length) return;

    function applyTheme(mode, labelText) {
      if (mode === "auto") {
        root.removeAttribute("data-theme");
        localStorage.removeItem("theme");
      } else {
        root.setAttribute("data-theme", mode);
        localStorage.setItem("theme", mode);
      }
      if (labelText) label.textContent = labelText;
    }

    // toggle open
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("open");
    });

    // click option
    options.forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        applyTheme(value, btn.textContent);
        dropdown.classList.remove("open");
      });
    });

    // click outside close
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) dropdown.classList.remove("open");
    });

    // init saved
    const saved = localStorage.getItem("theme");
    if (saved) {
      root.setAttribute("data-theme", saved);
      label.textContent = saved.charAt(0).toUpperCase() + saved.slice(1);
    } else {
      // default auto
      label.textContent = "Auto";
    }
  }

  // ---------- 5) hero video play/pause UI ----------
  function initHeroVideo() {
    const media = $(".heroMedia");
    const video = $(".heroVideo");
    const btn = $(".heroPlay");
    if (!media || !video || !btn) return;

    // ensure no autoplay
    video.autoplay = false;
    video.pause();

    const setPausedUI = () => {
      media.classList.add("is-paused");
      media.classList.remove("is-playing");
    };
    const setPlayingUI = () => {
      media.classList.remove("is-paused");
      media.classList.add("is-playing");
    };

    setPausedUI();

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (video.paused) {
        try {
          await video.play();
        } catch {
          setPausedUI();
        }
      } else {
        video.pause();
      }
    });

    video.addEventListener("playing", setPlayingUI);
    video.addEventListener("pause", setPausedUI);

    video.addEventListener("ended", () => {
      setPausedUI();
      video.currentTime = 0;
    });

    video.addEventListener("error", () => {
      setPausedUI();
      video.removeAttribute("src");
      video.load();
    });
  }

  // ---------- 6) news carousel (infinite-ish) ----------
  function initNewsCarousels() {
    const carousels = $$('[data-carousel="news"]');
    if (!carousels.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    carousels.forEach((wrap) => {
      if (wrap.dataset.inited === "true") return;
      wrap.dataset.inited = "true";

      const track = $(".cTrack", wrap);
      const prev = $(".cPrev", wrap);
      const next = $(".cNext", wrap);
      const dots = $(".cDots", wrap);

      if (!track || !prev || !next || !dots) return;

      const cards = Array.from(track.children).filter((el) => !el.classList.contains("is-clone"));
      if (cards.length < 2) return;

      wrap.dataset.carouselReady = "true";

      const AUTO_MS = 3500;
      const CLONE_COUNT = Math.min(2, cards.length);

      const headClones = cards.slice(0, CLONE_COUNT).map((n) => n.cloneNode(true));
      const tailClones = cards.slice(-CLONE_COUNT).map((n) => n.cloneNode(true));

      headClones.forEach((n) => n.classList.add("is-clone"));
      tailClones.forEach((n) => n.classList.add("is-clone"));

      tailClones.reverse().forEach((n) => track.insertBefore(n, track.firstChild));
      headClones.forEach((n) => track.appendChild(n));

      const getAllItems = () => Array.from(track.children);
      const realCount = cards.length;

      const getStep = () => {
        const allItems = getAllItems();
        const first = allItems[CLONE_COUNT];
        const second = allItems[CLONE_COUNT + 1] || first;
        if (!first) return 0;

        const r1 = first.getBoundingClientRect();
        const r2 = second.getBoundingClientRect();

        return Math.round(Math.abs(r2.left - r1.left)) || Math.round(r1.width + 18);
      };

      const jumpToFirstReal = () => {
        const step = getStep();
        if (!step) return;
        track.scrollLeft = step * CLONE_COUNT;
      };

      dots.innerHTML = "";
      const dotBtns = [];

      const goToRealIndex = (realIndex) => {
        const step = getStep();
        if (!step) return;
        const targetRaw = realIndex + CLONE_COUNT;
        track.scrollTo({
          left: targetRaw * step,
          behavior: prefersReduced ? "auto" : "smooth",
        });
      };

      for (let i = 0; i < realCount; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Go to news ${i + 1}`);
        b.addEventListener("click", () => goToRealIndex(i));
        dots.appendChild(b);
        dotBtns.push(b);
      }

      const setActiveDot = (realIndex) => {
        dotBtns.forEach((b, idx) => {
          b.setAttribute("aria-current", idx === realIndex ? "true" : "false");
        });
      };

      const getNearestRealIndex = () => {
        const step = getStep();
        if (!step) return 0;

        const raw = Math.round(track.scrollLeft / step);
        let real = raw - CLONE_COUNT;
        real = ((real % realCount) + realCount) % realCount;
        return real;
      };

      const updateOverflow = () => {
        const overflow = track.scrollWidth > track.clientWidth + 4;
        wrap.classList.toggle("is-overflow", overflow);
      };

      let isLock = false;
      const correctInfiniteIfNeeded = () => {
        if (isLock) return;

        const step = getStep();
        if (!step) return;

        const raw = Math.round(track.scrollLeft / step);

        if (raw < CLONE_COUNT) {
          isLock = true;
          track.scrollLeft = (raw + realCount) * step;
          isLock = false;
        }

        if (raw >= CLONE_COUNT + realCount) {
          isLock = true;
          track.scrollLeft = (raw - realCount) * step;
          isLock = false;
        }
      };

      const scrollByStep = (dir) => {
        const step = getStep();
        if (!step) return;

        track.scrollTo({
          left: track.scrollLeft + dir * step,
          behavior: prefersReduced ? "auto" : "smooth",
        });
      };

      prev.addEventListener("click", () => scrollByStep(-1));
      next.addEventListener("click", () => scrollByStep(1));

      let timer = null;
      let paused = false;

      const stopAuto = () => {
        if (timer) clearInterval(timer);
        timer = null;
      };

      const startAuto = () => {
        if (prefersReduced) return;
        stopAuto();
        timer = setInterval(() => {
          if (!paused) scrollByStep(1);
        }, AUTO_MS);
      };

      wrap.addEventListener("mouseenter", () => (paused = true));
      wrap.addEventListener("mouseleave", () => (paused = false));
      track.addEventListener("touchstart", () => (paused = true), { passive: true });
      track.addEventListener("touchend", () => (paused = false));

      let raf = null;
      track.addEventListener("scroll", () => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          correctInfiniteIfNeeded();
          setActiveDot(getNearestRealIndex());
        });
      });

      const init = () => {
        updateOverflow();
        jumpToFirstReal();
        setActiveDot(0);
        startAuto();
      };

      window.addEventListener("resize", () => {
        updateOverflow();
        const idx = getNearestRealIndex();
        jumpToFirstReal();
        goToRealIndex(idx);
      });

      setTimeout(init, 0);
    });
  }

  // ---------- 7) FAQ accordion ----------
  function initFaqAccordion() {
    const wrap = $("#faqAccordion");
    if (!wrap) return;

    const items = $$(".faqItem", wrap);
    if (!items.length) return;

    function closeItem(item) {
      const btn = $(".faqQ", item);
      const panel = $(".faqA", item);
      if (!btn || !panel) return;

      item.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      panel.style.maxHeight = "0px";
    }

    function openItem(item) {
      const btn = $(".faqQ", item);
      const panel = $(".faqA", item);
      if (!btn || !panel) return;

      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

    items.forEach((item) => {
      const btn = $(".faqQ", item);
      const panel = $(".faqA", item);
      if (!btn || !panel) return;

      panel.style.maxHeight = "0px";

      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        items.forEach((it) => {
          if (it !== item) closeItem(it);
        });

        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);

          // optional smooth scroll; aman (tanpa error offset undefined)
          const header = document.querySelector("header");

          const top = item.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });

      window.addEventListener("resize", () => {
        if (item.classList.contains("is-open")) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  // ---------- init all ----------
  function initAll() {
    initYear();
    initMobileMenu();
    initThemeSelect();
    initThemeDropdown();
    initHeroVideo();
    initNewsCarousels();
    initFaqAccordion();
    initNavlinksFlipOnScroll();
    initScrollStateByTopbar();
    initShareButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();

function initScrollStateByTopbar() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Titik pindah dibuat "lebih telat":
  // is-scrolled = true kalau topbar sudah mostly lewat (mis. tersisa < 30%)
  // balik ke false kalau topbar kelihatan lagi cukup banyak (mis. > 70%)
  // Implementasi hysteresis manual via intersectionRatio.
  let state = null;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (prefersReduced) {
        // buat yang reduce motion: tetap pakai state, tapi tanpa anim.
        document.body.classList.toggle("is-scrolled", entry.intersectionRatio < 0.3);
        return;
      }

      const ratio = entry.intersectionRatio;

      // hysteresis: ON di <0.3, OFF di >0.7
      if (state !== true && ratio < 0.3) {
        state = true;
        document.body.classList.add("is-scrolled");
        window.dispatchEvent(new CustomEvent("scrollStateChange", { detail: { isScrolled: true } }));
      } else if (state !== false && ratio > 0.7) {
        state = false;
        document.body.classList.remove("is-scrolled");
        window.dispatchEvent(new CustomEvent("scrollStateChange", { detail: { isScrolled: false } }));
      }
    },
    {
      threshold: [0, 0.3, 0.7, 1],
    },
  );

  observer.observe(topbar);
}

function initNavlinksFlipOnScroll() {
  const navlinks = document.querySelector("header .navlinks");
  if (!navlinks) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let isAnimating = false;

  const animateToState = () => {
    if (prefersReduced || isAnimating) return;

    const first = navlinks.getBoundingClientRect();
    // class is-scrolled sudah ditoggle duluan oleh initScrollStateByTopbar()
    const last = navlinks.getBoundingClientRect();

    const dx = first.left - last.left;
    const dy = first.top - last.top;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

    isAnimating = true;

    navlinks.style.transform = `translate(${dx}px, ${dy}px)`;
    navlinks.style.transition = "transform 0s";

    requestAnimationFrame(() => {
      navlinks.style.transition = "transform 700ms cubic-bezier(.18,.9,.2,1)";
      navlinks.style.transform = "translate(0px, 0px)";
    });

    navlinks.addEventListener(
      "transitionend",
      () => {
        navlinks.style.transition = "";
        navlinks.style.transform = "";
        isAnimating = false;
      },
      { once: true },
    );
  };

  // Saat state berubah, jalankan FLIP
  window.addEventListener("scrollStateChange", animateToState);

  // jalankan sekali saat load (kalau kebetulan page sudah kebuka di tengah)
  requestAnimationFrame(animateToState);
}

// ---------- Share Buttons (share current page) ----------
function initShareButtons() {
  const buttons = document.querySelectorAll(".shareBtn");
  if (!buttons.length) return;

  const getShareData = () => {
    const url = window.location.href;
    const title = document.title;

    // optional: ambil text ringkas dari h1 di glassCard kalau ada
    const h1 = document.querySelector(".glassCard h1");
    const text = h1 ? h1.textContent.trim() : title;

    return { url, title, text };
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    // fallback lama
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {}
    document.body.removeChild(ta);
    return ok;
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const platform = btn.dataset.platform;
      const { url, title, text } = getShareData();

      const pageUrl = encodeURIComponent(url);
      const pageTitle = encodeURIComponent(title);
      const pageText = encodeURIComponent(text);

      // Instagram: paling ideal lewat native share (mobile).
      // Kalau tidak ada, fallback: copy link (ini tetap share artikel yang lagi dilihat).
      if (platform === "instagram") {
        if (navigator.share) {
          try {
            await navigator.share({ title, text, url });
            return;
          } catch (_) {
            // user cancel -> lanjut fallback copy
          }
        }
        const ok = await copyToClipboard(url);
        alert(ok ? "Link artikel sudah dicopy. Paste ke Instagram (DM/Story)." : "Gagal copy link. Silakan copy manual dari address bar.");
        return;
      }

      // Platform lain: share URL halaman ini
      let shareUrl = "";

      switch (platform) {
        case "email":
          shareUrl = `mailto:?subject=${pageTitle}&body=${pageText}%0A${pageUrl}`;
          window.location.href = shareUrl;
          return;

        case "whatsapp":
          shareUrl = `https://api.whatsapp.com/send?text=${pageText}%0A${pageUrl}`;
          break;

        case "x":
          shareUrl = `https://twitter.com/intent/tweet?text=${pageText}&url=${pageUrl}`;
          break;

        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
          break;

        default:
          return;
      }

      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=520");
    });
  });
}

// SEO WEBSITE
(function injectJsonLdSchema() {
  // Avoid duplicates if site.js loaded multiple times
  if (document.querySelector('script[data-schema="bsj-school"]')) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "School",
    name: "British School Jakarta",
    alternateName: "BSJ",
    url: "https://www.bsj.sch.id/",
    logo: "https://www.bsj.sch.id/themes/bsj/assets/images/fav.png",
    description: "British School Jakarta (BSJ) is a leading British international school in Indonesia offering education from Early Years to Sixth Form with a strong focus on academic excellence and wellbeing.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bintaro Jaya Sektor 9, Jl. Raya Jombang",
      addressLocality: "Pondok Aren",
      addressRegion: "Tangerang Selatan",
      postalCode: "15427",
      addressCountry: "ID",
    },
    telephone: "+62-21-8082-8140",
    sameAs: ["https://www.instagram.com/britishschooljkt", "https://www.facebook.com/BritishSchoolJakarta/", "https://www.youtube.com/channel/UCQdvOB82ithc4RZwo1D5P3w"],
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-schema", "bsj-school");
  script.text = JSON.stringify(schema);

  document.head.appendChild(script);
})();

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const id = parseInt(getParam("id"));

const news = NEWS_DATA.find((n) => n.id === id);

if (news) {
  document.title = news.title;

  document.getElementById("newsTitle").innerText = news.title;
  document.getElementById("newsMeta").innerText = news.tag + " • " + news.date;
  document.getElementById("newsImage").src = news.image;
  document.getElementById("newsContent").innerHTML = news.content;
}

window.initNewsCarousels = initNewsCarousels;
