import "../imports";
import "../../styles/pages/app/style.scss";
import Swiper from "swiper";
import "swiper/css";
document.addEventListener("DOMContentLoaded", () => {
  // swipers
  //eslint-disable-next-line
  const goodsSwiper = new Swiper(".sales-swiper", {
    spaceBetween: 30,
    breakpoints: {
      1559: {
        slidesPerView: 4,
      },
      1023: {
        slidesPerView: 2.5,
      },
      767: {
        slidesPerView: 2.25,
      },
      320: {
        slidesPerView: 1.5,
        spaceBetween: 25,
      },
    },
  });
  // swipers
});
