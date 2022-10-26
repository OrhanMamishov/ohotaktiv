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
        1365: {
          spaceBetween: 35,
          slidesPerView: 3,
        },
        767: {
          spaceBetween: 35,
          slidesPerView: 2,
          allowTouchMove: true,
        },
        320: {
          spaceBetween: 20,
          slidesPerView: 1.5,
          allowTouchMove: true,
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
  const hamburger = document.querySelector(".hamburger-lines");
  const tlMenu = gsap.timeline({ paused: true });
  const menu = document.querySelector(".header__list");
  menu.addEventListener("click", () => {
    if (window.outerWidth < 1024) {
      hamburger.click();
    }
  });
  hamburger.addEventListener("click", () => {
    tlMenu.to(menu, { visibility: "visible", opacity: 1, duration: 0.1 });
    if (menu.style.visibility === "visible") {
      tlMenu.reverse();
      hamburger.classList.remove("is-active");
    } else {
      tlMenu.play();
      hamburger.classList.add("is-active");
    }
  });
});
