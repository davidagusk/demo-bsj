const NEWS_DATA = [
  {
    id: 1,
    title: "BSJ Students Win Regional Robotics Competition",
    excerpt: "The BSJ robotics team secured first place in the Jakarta Regional Robotics Championship.",
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • TECHNOLOGY",
    date: "2025-03-02",
    content: `
<p>Students from the BSJ Robotics Club achieved first place in the Jakarta Regional Robotics Championship. The team demonstrated outstanding engineering and programming skills.</p>
<p>Participants designed autonomous robots capable of completing complex challenges under strict time constraints.</p>
<p>This achievement reflects BSJ’s strong commitment to innovation and STEM education.</p>
`,
  },

  {
    id: 2,
    title: "BSJ Sports Teams Excel in Inter-School Tournament",
    excerpt: "BSJ athletes delivered strong performances across football, basketball, and swimming events.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • SPORTS",
    date: "2025-03-15",
    content: `
<p>BSJ students achieved multiple victories in the annual inter-school sports tournament held in Jakarta.</p>
<p>Teams competed in football, swimming, and basketball, showing exceptional teamwork and sportsmanship.</p>
<p>The success highlights BSJ’s commitment to developing well-rounded student athletes.</p>
`,
  },

  {
    id: 3,
    title: "Creative Arts Festival Celebrates Student Talent",
    excerpt: "Students showcased music, drama, and visual arts performances at the BSJ Creative Arts Festival.",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • ARTS",
    date: "2025-03-20",
    content: `
<p>The BSJ Creative Arts Festival highlighted the incredible artistic talents of students across the school.</p>
<p>Performances included live music, theatre productions, and student art exhibitions.</p>
<p>The festival celebrated creativity, collaboration, and student expression.</p>
`,
  },

  {
    id: 4,
    title: "BSJ Launches New Sustainability Initiative",
    excerpt: "Students and staff collaborate to introduce new sustainability practices across campus.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • ENVIRONMENT",
    date: "2025-04-01",
    content: `
<p>BSJ has introduced a new sustainability programme designed to reduce waste and promote environmental responsibility.</p>
<p>Students participate in recycling initiatives, tree planting activities, and environmental awareness campaigns.</p>
<p>The programme aligns with BSJ’s commitment to responsible global citizenship.</p>
`,
  },

  {
    id: 5,
    title: "International Week Celebrates Global Cultures",
    excerpt: "Students explored cultures, traditions, and cuisines from around the world.",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • COMMUNITY",
    date: "2025-04-10",
    content: `
<p>International Week brought the BSJ community together to celebrate cultural diversity.</p>
<p>Students participated in cultural performances, exhibitions, and global food experiences.</p>
<p>The event highlighted the global perspective that defines the BSJ learning environment.</p>
`,
  },

  {
    id: 6,
    title: "BSJ Debate Team Advances to National Finals",
    excerpt: "The BSJ debate team impressed judges with critical thinking and persuasive arguments.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • ACADEMICS",
    date: "2025-04-18",
    content: `
<p>The BSJ Debate Team successfully advanced to the national finals after an impressive regional performance.</p>
<p>Students demonstrated strong analytical thinking and persuasive communication skills.</p>
<p>The competition provided valuable opportunities for academic growth and leadership.</p>
`,
  },

  {
    id: 7,
    title: "Primary Students Explore Coding and Game Design",
    excerpt: "Young learners built interactive games during a hands-on coding workshop.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • TECHNOLOGY",
    date: "2025-04-25",
    content: `
<p>Primary students at BSJ participated in an exciting coding workshop focused on game design.</p>
<p>Using beginner-friendly programming tools, students created interactive digital games.</p>
<p>The activity introduced students to computational thinking and creativity in technology.</p>
`,
  },

  {
    id: 8,
    title: "BSJ Charity Run Raises Funds for Education",
    excerpt: "Students, parents, and staff joined the annual BSJ Charity Run to support education initiatives.",
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • COMMUNITY",
    date: "2025-05-03",
    content: `
<p>The BSJ Charity Run brought together the school community in support of educational charities.</p>
<p>Participants completed a 5K run around the campus and surrounding areas.</p>
<p>Funds raised will support educational programmes and community outreach initiatives.</p>
`,
  },

  {
    id: 9,
    title: "BSJ Celebrates Graduation of the Class of 2025",
    excerpt: "The BSJ community celebrated the achievements of graduating students.",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1400&q=70",
    tag: "BSJ NEWS • STUDENTS",
    date: "2025-05-15",
    content: `
<p>The BSJ Class of 2025 celebrated their graduation in a ceremony attended by families and teachers.</p>
<p>Students reflected on their achievements and the friendships built during their time at BSJ.</p>
<p>Graduates will continue their studies at universities around the world.</p>
`,
  },
];

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initAutoNews() {
  const searchWrap = document.querySelector(".newsSearchWrap");
  const clearBtn = document.querySelector("#newsSearchClear");
  const root = document.querySelector("#newsAuto");
  const searchInput = document.querySelector("#newsSearch");
  const resultInfo = document.querySelector("#newsResultInfo");
  const paginationTop = document.querySelector("#newsPaginationTop");
  const paginationBottom = document.querySelector("#newsPaginationBottom");

  if (!root) return;

  const ITEMS_PER_PAGE = 6;

  let currentPage = 1;
  let currentQuery = "";

  const baseItems = [...NEWS_DATA].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  function getFilteredItems() {
    const q = currentQuery.trim().toLowerCase();
    if (!q) return baseItems;

    return baseItems.filter((n) => {
      const haystack = [n.title, n.excerpt, n.tag, n.date].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderCards(items) {
    if (!items.length) {
      root.innerHTML = `
        <div class="card" style="padding:16px; grid-column: 1 / -1;">
          <h3 style="margin:0 0 8px 0;">No news found</h3>
          <p style="margin:0; color:var(--muted);">Try another keyword.</p>
        </div>
      `;
      return;
    }

    root.innerHTML = items
      .map(
        (n) => `
        <article class="card">
          <div class="thumb" style="background-image:url('${escapeHtml(n.image || "")}')"></div>
          <div class="cardBody">
            ${n.tag ? `<div class="mini" style="border:0;padding:0;margin:0 0 8px 0">${escapeHtml(n.tag)}</div>` : ""}
            <h3><a href="${escapeHtml(n.href || `news-detail.html?id=${n.id}`)}">${escapeHtml(n.title)}</a></h3>
            <p>${escapeHtml(n.excerpt || "")}</p>
            <a href="${escapeHtml(n.href || `news-detail.html?id=${n.id}`)}" class="readMoreBtn">
              Read More <span class="arrow">→</span>
            </a>
          </div>
        </article>
      `,
      )
      .join("");
  }

  function renderPagination(totalItems, totalPages) {
    if (!paginationTop || !paginationBottom) return;

    if (totalPages <= 1) {
      paginationTop.innerHTML = "";
      paginationBottom.innerHTML = "";
      return;
    }

    const createPaginationHtml = () => {
      let html = `
        <button class="pageBtn" data-page="prev" ${currentPage === 1 ? "disabled" : ""}>Prev</button>
      `;

      for (let i = 1; i <= totalPages; i++) {
        html += `
          <button class="pageBtn ${i === currentPage ? "is-active" : ""}" data-page="${i}">
            ${i}
          </button>
        `;
      }

      html += `
        <button class="pageBtn" data-page="next" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
      `;

      return html;
    };

    paginationBottom.innerHTML = createPaginationHtml();

    [paginationTop, paginationBottom].forEach((wrap) => {
      wrap.querySelectorAll(".pageBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.page;
          if (action === "prev" && currentPage > 1) currentPage--;
          else if (action === "next" && currentPage < totalPages) currentPage++;
          else if (!Number.isNaN(Number(action))) currentPage = Number(action);

          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });
    });

    if (resultInfo) {
      const start = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
      const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
      resultInfo.textContent = `Showing ${start}-${end} of ${totalItems} news`;
    }
  }

  function render() {
    const filtered = getFilteredItems();
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleItems = filtered.slice(start, start + ITEMS_PER_PAGE);

    renderCards(visibleItems);
    renderPagination(totalItems, totalPages);

    if (resultInfo && totalItems === 0) {
      resultInfo.textContent = "Showing 0 results";
    }
  }

  if (searchInput) {
    const syncSearchState = () => {
      if (searchWrap) {
        searchWrap.classList.toggle("has-value", !!searchInput.value.trim());
      }
    };

    searchInput.addEventListener("input", (e) => {
      currentQuery = e.target.value || "";
      currentPage = 1;
      syncSearchState();
      render();
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        currentQuery = "";
        currentPage = 1;
        syncSearchState();
        render();
        searchInput.focus();
      });
    }

    syncSearchState();
  }

  render();
}

// fungsi untuk menampilkan 4 berita random di bagian lain (misal sidebar)
function initNewsLain() {
  const track = document.querySelector("#newsLainTrack");
  if (!track) return;

  // clone array
  const shuffled = [...NEWS_DATA];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // ambil 4 berita random
  const items = shuffled.slice(0, 4);

  track.innerHTML = items
    .map(
      (n) => `
<article class="card">
<div class="thumb" style="background-image:url('${n.image}')"></div>
<div class="cardBody">
<h3><a href="news-detail.html?id=${n.id}">${n.title}</a></h3>
<p>${n.excerpt || ""}</p>
</div>
</article>
`,
    )
    .join("");
}

function initNewsCarousel() {
  const track = document.querySelector("#newsCarouselTrack");
  if (!track) return;

  const items = [...NEWS_DATA].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 8);

  track.innerHTML = items
    .map(
      (n) => `
    <article class="card">
      <div class="thumb" style="background-image:url('${n.image || ""}')"></div>
      <div class="cardBody">
        ${n.tag ? `<div class="mini" style="border:0;padding:0;margin:0 0 8px 0">${n.tag}</div>` : ""}
        <h3><a href="news-detail.html?id=${n.id}">${n.title}</a></h3>
        <p>${n.excerpt || ""}</p>
        <a href="news-detail.html?id=${n.id}" class="readMoreBtn">
          Read More <span class="arrow">→</span>
        </a>
      </div>
    </article>
  `,
    )
    .join("");
}

function initHomeNewsControls() {
  const wrap = document.querySelector("#homeNewsCarousel");
  const track = document.querySelector("#newsCarouselTrack");
  const prev = document.querySelector("#newsPrev");
  const next = document.querySelector("#newsNext");
  const dotsWrap = document.querySelector("#newsDots");

  if (!wrap || !track || !prev || !next || !dotsWrap) return;

  const cards = Array.from(track.children);
  if (cards.length < 2) return;

  const getStep = () => {
    const first = cards[0];
    if (!first) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || 18) || 18;
    return first.getBoundingClientRect().width + gap;
  };

  const getPerView = () => {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  };

  const getPageCount = () => {
    return Math.max(1, Math.ceil(cards.length / getPerView()));
  };

  const getCurrentPage = () => {
    const step = getStep();
    if (!step) return 0;
    const perView = getPerView();
    const cardIndex = Math.round(track.scrollLeft / step);
    return Math.min(getPageCount() - 1, Math.round(cardIndex / perView));
  };

  const goToPage = (page) => {
    const perView = getPerView();
    const step = getStep();
    if (!step) return;
    const left = page * perView * step;
    track.scrollTo({ left, behavior: "smooth" });
  };

  const renderDots = () => {
    const count = getPageCount();
    dotsWrap.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.setAttribute("aria-current", i === getCurrentPage() ? "true" : "false");
      b.addEventListener("click", () => goToPage(i));
      dotsWrap.appendChild(b);
    }
  };

  const updateUI = () => {
    const page = getCurrentPage();
    const last = getPageCount() - 1;

    prev.disabled = page <= 0;
    next.disabled = page >= last;

    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.setAttribute("aria-current", i === page ? "true" : "false");
    });
  };

  prev.addEventListener("click", () => {
    const page = getCurrentPage();
    goToPage(Math.max(0, page - 1));
  });

  next.addEventListener("click", () => {
    const page = getCurrentPage();
    goToPage(Math.min(getPageCount() - 1, page + 1));
  });

  let raf = null;
  track.addEventListener("scroll", () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateUI);
  });

  window.addEventListener("resize", () => {
    renderDots();
    updateUI();
  });

  renderDots();
  updateUI();
}
