import "../imports";
import "../../styles/pages/new/style.scss";
import Swiper, { Pagination, Grid, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import wNumb from "wnumb";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { bodyScrollToggle } from "../functions/scrollBody";

document.addEventListener("DOMContentLoaded", () => {
  const allSelects = document.querySelectorAll(".js-select");
  allSelects.forEach((select) => {
    new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
      allowHTML: true,
    });
  });
  const allAccordions = document.querySelectorAll(".accordion-container");
  allAccordions.forEach((accordion) => {
    new Accordion(accordion);
  });
  const swiperCards = new Swiper(".swiper-cards", {
    modules: [Pagination, Grid],
    spaceBetween: 10,
    slidesPerView: 4,
    slidesPerGroup: 4,
    loopFillGroupWithBlank: true,
    grid: {
      rows: 3,
      fill: "row",
    },
    pagination: {
      el: ".new__cards-swiper-pagination",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 5,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
    breakpoints: {
      1561: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        grid: {
          rows: 3,
          fill: "row",
        },
      },
      1023: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: {
          rows: 3,
          fill: "row",
        },
      },
      600: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 30,
        grid: {
          rows: 3,
          fill: "row",
        },
      },
      320: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10,
        grid: {
          rows: 2,
          fill: "row",
        },
      },
    },
  });
  const filterWrap = document.querySelector(".new__filters");
  const filter = document.querySelector(".new__filters-wrap");
  const newSection = document.querySelector(".new");
  newSection.addEventListener("click", (e) => {
    if (e.target.className == "new__cards-filter-open") {
      filterWrap.style.visibility = "visible";
      filterWrap.style.opacity = 1;
      filter.style.transform = "translateX(0)";
    }
    if (
      e.target.className == "new__close" ||
      e.target.className == "new__filters-background"
    ) {
      bodyScrollToggle();
      filterWrap.style.opacity = 0;
      filter.style.transform = "translateX(-100%)";
      setTimeout(() => {
        filterWrap.style.visibility = "hidden";
      }, 200);
    }
  });
});
