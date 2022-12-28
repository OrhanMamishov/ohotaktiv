import "../imports";
import "../../styles/pages/blog/style.scss";
import Swiper, { Pagination, Grid, Navigation, Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/mousewheel";

document.addEventListener("DOMContentLoaded", async () => {
  await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/blog/blog.php?read=all"
  )
    .then((res) => res.json())
    .then((res) => {
      res.sort((a, b) => (Number(a.id) > Number(b.id) ? -1 : 1));
      if (document.location.search) {
        return viewBlog(res, document.location.search.split("blog=")[1]);
      } else {
        return refreshBlogs(res);
      }
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
                      <a href="../blog/?blog=${
                        blog.code
                      }" class="blog__item-link">
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
    const blogElement = document.querySelector(".blog");
  }
  function viewBlog(blogs, code) {
    const blog = blogs.filter((blog) => blog.code == code)[0];
    console.log(blog);
    const element = `
    <section class="viewblog">
      <div class="viewblog__wrap container">
        <nav class="navigation">
          <ul class="navigation__list">
            <li class="navigation__item">
              <a href="../index/" class="navigation__link"> Главная </a>
            </li>
            <li class="navigation__item">
              <a href="../blog/" class="navigation__link"> Блог </a>
            </li>
            <li class="navigation__item">
              <a href="#" class="navigation__link"> Обзор </a>
            </li>
          </ul>
        </nav>
        <div class="viewblog__item">
          <iframe class="viewblog__iframe" src="https://www.youtube.com/embed/${
            blog.youtube
          }" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <p class="viewblog__item-date">${blog.date}</p>
          <h1 class="viewblog__item-title">
            ${blog.name}
          </h1>
          <p class="viewblog__item-text">
            ${blog.description}
          </p>
        </div>
        <aside class="viewblog__aside swiper swiper-aside">
          <ul class="viewblog__aside-list swiper-wrapper">
            ${blogs
              .map((blog, index) => {
                if (index > 11 || blog.code == code) return;
                return `
                <li class="viewblog__aside-item swiper-slide">
                  <img
                    src="https://ohotaktiv.ru${blog.pic}"
                    alt="${blog.name}"
                    class="viewblog__aside-img"
                    data-blog="${blog.code}"
                  />
                </li>
              `;
              })
              .join("")}
          </ul>
          <div class="viewblog__swiper-button-prev swiper-button-prev"></div>
          <div class="viewblog__swiper-button-next swiper-button-next"></div>
        </aside>
      </div>
    </section>
    `;
    const main = document.querySelector("main");
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.insertAdjacentHTML("beforeend", element);
    const asideSwiper = new Swiper(".swiper-aside", {
      modules: [Navigation, Mousewheel],
      mousewheel: true,
      spaceBetween: 35,
      direction: "vertical",
      freeMode: true,
      navigation: {
        nextEl: ".viewblog__swiper-button-next",
        prevEl: ".viewblog__swiper-button-prev",
      },
      breakpoints: {
        1559: {
          slidesPerView: 3.5,
          spaceBetween: 35,
        },
        1366: {
          slidesPerView: 4,
          spaceBetween: 25,
        },
        1023: {
          slidesPerView: 2,
          direction: "horizontal",
        },
        767: {
          slidesPerView: 2,
          direction: "horizontal",
          spaceBetween: 30,
        },
        320: {
          direction: "horizontal",
          spaceBetween: 10,
          slidesPerView: 1.25,
        },
      },
    });
    const viewblogElement = document.querySelector(".viewblog");
    viewblogElement.addEventListener("click", (e) => {
      if (e.target.className == "viewblog__aside-img") {
        const baseUrl = document.location;
        let newUrl =
          baseUrl.origin +
          baseUrl.pathname +
          `?blog=${e.target.getAttribute("data-blog")}`;
        history.pushState(null, null, newUrl);
        viewBlog(blogs, e.target.getAttribute("data-blog"));
      }
    });
  }
});
