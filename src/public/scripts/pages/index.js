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
    navigation: {
      nextEl: ".bestsellers__swiper-button-next",
      prevEl: ".bestsellers__swiper-button-prev",
    },
    breakpoints: {
      1441: {
        spaceBetween: 35,
        slidesPerView: 6,
      },
      1201: {
        spaceBetween: 30,
        slidesPerView: 5,
      },
      769: {
        spaceBetween: 30,
        slidesPerView: 3,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 2,
      },
    },
  });
  const newSwiper = new Swiper(".swiper-new", {
    modules: [Navigation],
    navigation: {
      nextEl: ".new__swiper-button-next",
      prevEl: ".new__swiper-button-prev",
    },
    breakpoints: {
      1441: {
        spaceBetween: 35,
        slidesPerView: 6,
      },
      1201: {
        spaceBetween: 30,
        slidesPerView: 5,
      },
      769: {
        spaceBetween: 30,
        slidesPerView: 3,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 2,
      },
    },
  });
  const recommendedSwiper = new Swiper(".swiper-recommended", {
    modules: [Navigation],
    navigation: {
      nextEl: ".recommended__swiper-button-next",
      prevEl: ".recommended__swiper-button-prev",
    },
    breakpoints: {
      1441: {
        spaceBetween: 35,
        slidesPerView: 6,
      },
      1201: {
        spaceBetween: 30,
        slidesPerView: 5,
      },
      769: {
        spaceBetween: 30,
        slidesPerView: 3,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 2,
      },
    },
  });
  const popularSwiper = new Swiper(".swiper-popular", {
    freeMode: true,
    breakpoints: {
      1441: {
        slidesPerView: 4,
        spaceBetween: 35,
      },
      1201: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      769: {
        slidesPerView: 2,
        spaceBetween: 27,
      },
      320: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    },
  });
  const blogSwiper = new Swiper(".swiper-blog", {
    modules: [Navigation],
    navigation: {
      nextEl: ".blog__swiper-button-next",
      prevEl: ".blog__swiper-button-prev",
    },
    breakpoints: {
      1441: {
        spaceBetween: 35,
        slidesPerView: 4,
      },
      1201: {
        spaceBetween: 30,
        slidesPerView: 3,
      },
      769: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      320: {
        freeMode: true,
        spaceBetween: 16,
        slidesPerView: 1.5,
      },
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
