import "../imports";
import "../../styles/pages/blog/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css/navigation";
import "swiper/css";

document.addEventListener("DOMContentLoaded", () => {
  // Свайперы
  //eslint-disable-next-line
  const blogsSwiper = new Swiper(".swiper-blogs", {
    modules: [Navigation],
    navigation: {
      nextEl: ".blog__swiper-button-next",
      prevEl: ".blog__swiper-button-prev",
    },
    breakpoints: {
      1559: {
        spaceBetween: 50,
        slidesPerView: 3,
      },
      1023: {
        spaceBetween: 30,
        slidesPerView: 3,
      },
      767: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 1.5,
      },
    },
  });
  const articlesSwiper = new Swiper(".swiper-articles", {
    modules: [Navigation],
    navigation: {
      nextEl: ".article__swiper-button-next",
      prevEl: ".article__swiper-button-prev",
    },
    breakpoints: {
      1559: {
        spaceBetween: 50,
        slidesPerView: 3,
      },
      1023: {
        spaceBetween: 30,
        slidesPerView: 3,
      },
      767: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 1.5,
      },
    },
  });
});
