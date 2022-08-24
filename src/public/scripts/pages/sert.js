import "../imports";
import "../../styles/pages/sert/style.scss";
import Swiper, { Navigation, Mousewheel, Thumbs } from "swiper";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css";

document.addEventListener("DOMContentLoaded", () => {
  // свайперы и чойзы
  const galleryThumbs = new Swiper(".gallery-thumbs", {
    modules: [Mousewheel],
    direction: "vertical",
    slidesPerView: 3,
    spaceBetween: 10,
    mousewheel: true,
    freeMode: true,
  });
  const galleryTop = new Swiper(".gallery-top", {
    modules: [Thumbs],
    // direction: "vertical",
    slidesPerView: 1,
    spaceBetween: 20,
    mousewheel: true,
    grabCursor: true,
    thumbs: {
      swiper: galleryThumbs,
    },
  });
  const viewedSwiper = new Swiper(".swiper-viewed", {
    spaceBetween: 10,
    modules: [Navigation],
    navigation: {
      nextEl: ".viewed__swiper-button-next",
      prevEl: ".viewed__swiper-button-prev",
    },
    breakpoints: {
      1559: {
        slidesPerView: 5,
      },
      1439: {
        spaceBetween: 30,
        slidesPerView: 5,
      },
      1366: {
        slidesPerView: 4,
      },
      1023: {
        // spaceBetween: 30,
        slidesPerView: 3,
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 3,
      },
      320: {
        // spaceBetween: 10,
        slidesPerView: 2,
      },
    },
  });
});
