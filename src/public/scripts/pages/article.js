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
    spaceBetween: 30,
    slidesPerView: 5,
    navigation: {
      nextEl: ".goods__swiper-button-next",
      prevEl: ".goods__swiper-button-prev",
    },
  });
  // swipers
});
