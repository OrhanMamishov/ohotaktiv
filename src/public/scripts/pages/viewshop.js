import "../imports";
import "../../styles/pages/viewshop/style.scss";
import Swiper, { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

document.addEventListener("DOMContentLoaded", () => {
  //eslint-disable-next-line
    const shopSwiper = new Swiper(".swiper-shop", {
    modules: [Pagination],
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
    },
  });
});
