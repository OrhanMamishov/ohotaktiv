import "../imports";
import "../../styles/pages/sert/style.scss";
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

document.addEventListener("DOMContentLoaded", () => {
  // свайперы и чойзы
  const viewedSwiper = new Swiper(".swiper-viewed", {
    spaceBetween: 16,
    modules: [Navigation, Pagination],
    allowTouchMove: false,
    slidesPerView: "auto",
    navigation: {
      nextEl: ".viewed__swiper-button-next",
      prevEl: ".viewed__swiper-button-prev",
    },
    pagination: {
      el: ".viewed__pagination",
    },
    breakpoints: {
      1559: {
        slidesPerView: 5,
      },
      1366: {
        slidesPerView: 4,
      },
      1023: {
        slidesPerView: 3,
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 3,
        allowTouchMove: true,
      },
      600: {
        spaceBetween: 20,
        slidesPerView: 3,
        allowTouchMove: true,
      },
      320: {
        spaceBetween: 25,
        slidesPerView: 2,
        allowTouchMove: true,
      },
    },
  });
  // свайперы и чойзы
});
