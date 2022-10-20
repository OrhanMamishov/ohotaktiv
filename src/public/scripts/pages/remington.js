import "../../styles/pages/remington/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css/bundle";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother.js";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  const smoother = ScrollSmoother.create({
    content: "#content",
    effects: true,
    smooth: 1,
  });
  smoother.effects(".parallax-img", { speed: "auto" });
  const swipers = document.querySelectorAll(".swiper");
  swipers.forEach((swiper) => {
    new Swiper(swiper, {
      modules: [Navigation],
      spaceBetween: 30,
      allowTouchMove: false,
      navigation: {
        nextEl: `.${swiper.parentElement.parentElement.id}__swiper-button-next`,
        prevEl: `.${swiper.parentElement.parentElement.id}__swiper-button-prev`,
      },

      breakpoints: {
        1559: {
          spaceBetween: 35,
          slidesPerView: 3,
        },
        1439: {
          // spaceBetween: 30,
          // slidesPerView: 4,
        },
        500: {
          // spaceBetween: 30,
          // slidesPerView: 3,
        },
        320: {
          // spaceBetween: 10,
          // slidesPerView: 2,
        },
      },
    });
  });
  const headerLinks = document.querySelectorAll(".header__link");
  headerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      smoother.scrollTo(link.getAttribute("href"), true, "top 80px");
    });
  });
  const arrowButton = document.querySelector(".banner__bot");
  arrowButton.addEventListener("click", (e) => {
    e.preventDefault();
    smoother.scrollTo(arrowButton.getAttribute("href"), true, "top 80px");
  });
});
