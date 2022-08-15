import "../imports";
import "../../styles/pages/compare/style.scss";
import Swiper, { Scrollbar, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";

document.addEventListener("DOMContentLoaded", () => {
  const compareSwiper = new Swiper(".swiper-compare", {
    modules: [Scrollbar],
    slidesPerView: "auto",
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true,
    },
  });
});
