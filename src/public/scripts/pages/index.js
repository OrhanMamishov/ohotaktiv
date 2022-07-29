import "../imports";
import "../../styles/pages/index/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css";

document.addEventListener("DOMContentLoaded", () => {
  const mainBannerSwiper = new Swiper(".swiper-banner", {
    modules: [Navigation],
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});
