import "../imports";
import "../../styles/pages/viewblog/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
document.addEventListener("DOMContentLoaded", () => {
  // swipers
  //eslint-disable-next-line
  const goodsSwiper = new Swiper(".swiper-goods", {
    modules: [Navigation],
    spaceBetween: 10,
    navigation: {
      nextEl: ".goods__swiper-button-next",
      prevEl: ".goods__swiper-button-prev",
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
        slidesPerView: 3,
      },
      320: {
        slidesPerView: 2,
      },
    },
  });
  const asideSwiper = new Swiper(".swiper-aside", {
    modules: [Navigation],
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
  // swipers
});
