import "../imports";
import "../../styles/pages/compare/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

document.addEventListener("DOMContentLoaded", () => {
  const compareSwiper = new Swiper(".swiper-compare", {
    slidesPerView: 4,
    modules: [Navigation],
    navigation: {
      nextEl: ".compare__swiper-button-next",
      prevEl: ".compare__swiper-button-prev",
    },
  });
});
