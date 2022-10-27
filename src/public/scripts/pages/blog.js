import "../imports";
import "../../styles/pages/blog/style.scss";
import Swiper, { Pagination, Grid, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";

document.addEventListener("DOMContentLoaded", () => {
  // Свайперы
  //eslint-disable-next-line
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
  const tabsList = document.querySelectorAll(".blog__path-item");
  const targetsList = document.querySelectorAll(".blog__target");
  tabsList.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("is-active")) return;
      const baseUrl = document.location.href.split("?")[0];
      const newUrl = baseUrl + "?block=" + item.getAttribute("data-path");
      history.pushState(null, null, newUrl);
      tabsList.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      const target = item.getAttribute("data-path");
      targetsList.forEach((tab) => {
        tab.classList.remove("is-open");
        if (tab.getAttribute("data-target") == target)
          tab.classList.add("is-open");
      });
    });
  });
  const hashPath = document.querySelector(
    `[data-path = ${
      document.location.search
        ? document.location.search.split("=")[1]
        : `views`
    }]`
  );
  const hashTarget = document.querySelector(
    `[data-target = ${
      document.location.search
        ? document.location.search.split("=")[1]
        : `views`
    }]`
  );
  hashPath.classList.add("is-active");
  hashTarget.classList.add("is-open");
});
