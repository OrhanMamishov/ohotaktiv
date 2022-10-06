import "../imports";
import "../../styles/pages/sert/style.scss";
import Swiper, { Mousewheel, Navigation, Pagination } from "swiper";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

document.addEventListener("DOMContentLoaded", () => {
  // свайперы и чойзы
  const galleryThumbs = new Swiper(".swiper-images", {
    modules: [Pagination, Mousewheel],
    mousewheel: true,
    pagination: {
      el: ".sert__left-pagination",
      clickable: true,
    },
    breakpoints: {
      1023: {
        direction: "vertical",
      },
      320: {
        spaceBetween: 20,
        direction: "horizontal",
      },
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
  // свайперы и чойзы
});
