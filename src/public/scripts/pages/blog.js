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
    spaceBetween: 35,
    slidesPerView: 4,
    slidesPerGroup: 4,
    grid: {
      rows: 3,
      fill: "row",
    },
    pagination: {
      el: ".pagination-blogs",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 5,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
  });
});
