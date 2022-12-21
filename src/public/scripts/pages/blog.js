import "../imports";
import "../../styles/pages/blog/style.scss";
import Swiper, { Pagination, Grid } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";

document.addEventListener("DOMContentLoaded", async () => {
  await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/blog/blog.php?read=all"
  )
    .then((res) => res.json())
    .then((res) => {
      res.sort((a, b) => (Number(a.id) > Number(b.id) ? -1 : 1));
      return refreshBlogs(res);
    });
  function refreshBlogs(blogs) {
    const element = `
      <section class="blog">
        <div class="blog__wrap container">
          <nav class="navigation">
            <ul class="navigation__list">
              <li class="navigation__item">
                <a href="../index/" class="navigation__link"> Главная </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link"> Блог </a>
              </li>
            </ul>
          </nav>
          <h1 class="blog__title">Блог</h1>
          <div class="blog__target">
            <div class="swiper swiper-blog">
              <ul class="swiper-wrapper">
                ${blogs
                  .map((blog) => {
                    return `
                    <li class="blog__item swiper-slide">
                      <a href="../viewblog?blog=${
                        blog.code
                      }" class="blog__link" target="_blank">
                        <img
                          src="https://ohotaktiv.ru${blog.pic}"
                          alt="${blog.name}"
                          class="blog__item-img"
                        />
                        ${
                          blog.tag && blog.tag !== null
                            ? `
                          <ul class="blog__tag-list">
                            <li class="blog__tag-item">${blog.tag}</li>
                          </ul>
                        `
                            : ``
                        }
                      </a>
                    </li>
                  `;
                  })
                  .join("")}
              </ul>
              <div class="blog__swiper-pagination swiper-pagination"></div>
            </div>
          </div>
        </div>
      </section>
    `;
    const main = document.querySelector("main");
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.insertAdjacentHTML("beforeend", element);
    const swiperBlog = new Swiper(".swiper-blog", {
      modules: [Pagination, Grid],
      spaceBetween: 50,
      slidesPerView: 3,
      slidesPerGroup: 3,
      loopFillGroupWithBlank: true,
      grid: {
        rows: 3,
        fill: "row",
      },
      pagination: {
        el: ".blog__swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 5,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      },
      breakpoints: {
        1365: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          grid: {
            rows: 3,
            fill: "row",
          },
        },
        1023: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          grid: {
            rows: 5,
            fill: "row",
          },
        },
        600: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          grid: {
            rows: 5,
            fill: "row",
          },
        },
        0: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          grid: {
            rows: 10,
            fill: "row",
          },
        },
      },
    });
  }
});
