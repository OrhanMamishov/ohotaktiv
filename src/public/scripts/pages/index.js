import "../imports";
import "../../styles/pages/index/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

document.addEventListener("DOMContentLoaded", () => {
  const mainBannerSwiper = new Swiper(".swiper-banner", {
    modules: [Navigation],
    spaceBetween: 30,
    navigation: {
      nextEl: ".banners__swiper-button-next",
      prevEl: ".banners__swiper-button-prev",
    },
  });
});
