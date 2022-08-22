import "../imports";
import "../../styles/pages/article/style.scss";
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
        spaceBetween: 30,
        slidesPerView: 2,
      },
    },
  });
  // swipers
});
