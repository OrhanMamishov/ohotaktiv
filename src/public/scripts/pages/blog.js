import "../imports";
import "../../styles/pages/blog/style.scss";
import Swiper, { Grid, Pagination } from "swiper";
import "swiper/css/pagination";
import "swiper/css/grid";
import "swiper/css";

document.addEventListener("DOMContentLoaded", () => {
  // Свайперы
  //eslint-disable-next-line
  const mainBannerSwiper = new Swiper(".swiper-blogs", {
    modules: [Pagination, Grid],
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
      1559: {
        spaceBetween: 35,
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      1023: {
        spaceBetween: 30,
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      767: {
        spaceBetween: 30,
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 1.5,
        slidesPerGroup: 1,
        grid: {
          rows: 1,
        },
      },
    },
  });
});
