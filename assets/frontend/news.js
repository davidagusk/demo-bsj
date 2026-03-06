const NEWS_DATA = [
  {
    title: "Open Day at BSJ: Meet Our Teachers & Explore the Campus",
    excerpt: "Meet teachers, tour our facilities, and learn how BSJ supports every student.",
    href: "news1.html",
    image: "https://www.bsj.sch.id/storage/app/media/01-home/Be%20Spoke%20Campus.jpg",
    tag: "BSJ NEWS • ADMISSIONS",
    date: "2025-01-10",
  },
  {
    title: "BSJ Students Shine at ReEarth International Art Prize 2025",
    excerpt: "BSJ secondary students earned international recognition across AI, digital, and acrylic artworks.",
    href: "news2.html",
    image: "https://www.bsj.sch.id/storage/app/uploads/public/69a/00a/5a8/69a00a5a8ae4f598993769.jpg",
    tag: "BSJ NEWS • ARTS",
    date: "2025-02-14",
  },
];

async function initAutoNews() {
  const root = document.querySelector("#newsAuto");
  if (!root) return;

  const items = [...NEWS_DATA].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  root.innerHTML = items
    .map(
      (n) => `
    <article class="card">
      <div class="thumb" style="background-image:url('${n.image || ""}')"></div>
      <div class="cardBody">
        ${n.tag ? `<div class="mini" style="border:0;padding:0;margin:0 0 8px 0">${n.tag}</div>` : ""}
        <h3><a href="${n.href}">${n.title}</a></h3>
        <p>${n.excerpt || ""}</p>
        <a href="${n.href}" class="readMoreBtn">
          Read More <span class="arrow">→</span>
        </a>
      </div>
    </article>
  `,
    )
    .join("");
}
