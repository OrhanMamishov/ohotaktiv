import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "../imports";
import "../../styles/pages/index/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  // Свайперы
  const mainBannerSwiper = new Swiper(".swiper-banner", {
    modules: [Navigation],
    spaceBetween: 30,
    navigation: {
      nextEl: ".banners__swiper-button-next",
      prevEl: ".banners__swiper-button-prev",
    },
  });
  const bestsellersSwiper = new Swiper(".swiper-bestsellers", {
    modules: [Navigation],
    spaceBetween: 35,
    slidesPerView: 6,
    navigation: {
      nextEl: ".bestsellers__swiper-button-next",
      prevEl: ".bestsellers__swiper-button-prev",
    },
  });
  const newSwiper = new Swiper(".swiper-new", {
    modules: [Navigation],
    spaceBetween: 35,
    slidesPerView: 6,
    navigation: {
      nextEl: ".new__swiper-button-next",
      prevEl: ".new__swiper-button-prev",
    },
  });
  const recommendedSwiper = new Swiper(".swiper-recommended", {
    modules: [Navigation],
    spaceBetween: 35,
    slidesPerView: 6,
    navigation: {
      nextEl: ".recommended__swiper-button-next",
      prevEl: ".recommended__swiper-button-prev",
    },
  });
  // Свайперы
  // Табы в блоке Готовимся к сезону
  const readyButtonsIndex = document.querySelectorAll(".ready__tab-button");
  const readyListTabsIndex = document.querySelectorAll(".ready__list");
  readyButtonsIndex.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) return;
      readyButtonsIndex.forEach((el) => el.classList.remove("is-active"));
      button.classList.add("is-active");
      const target = button.getAttribute("data-path");
      readyListTabsIndex.forEach((list) => {
        list.classList.remove("is-open");
        if (list.getAttribute("data-target") == target)
          list.classList.add("is-open");
      });
    });
  });
  // Табы в блоке Готовимся к сезону
});
