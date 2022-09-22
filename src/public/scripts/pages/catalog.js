import "../imports";
import "../../styles/pages/catalog/style.scss";
import Swiper, { Navigation, Pagination, Grid } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.min.css";
import wNumb from "wnumb";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener("DOMContentLoaded", () => {
  // слайдеры
  const sliderElements = document.querySelectorAll(".slider");
  sliderElements.forEach((slider) => {
    const rangeSlider = slider;
    const rangeFrom = slider.parentElement.children[0].children[1];
    const rangeTo = slider.parentElement.children[1].children[1];
    const rangesInputs = [rangeFrom, rangeTo];
    noUiSlider.create(rangeSlider, {
      start: [0, 500000],
      connect: true,
      range: {
        min: 0,
        max: 1000000,
      },
      format: wNumb({
        decimals: 0,
        thousand: " ",
      }),
    });
    rangeSlider.noUiSlider.on("update", function (values, handle) {
      rangesInputs[handle].value = values[handle];
    });
    rangesInputs.forEach(function (input, handle) {
      input.addEventListener("change", function () {
        rangeSlider.noUiSlider.setHandle(handle, this.value);
      });
      input.addEventListener("keydown", function (e) {
        let values = rangeSlider.noUiSlider.get();
        let value = Number(values[handle]);
        let steps = rangeSlider.noUiSlider.steps();
        let step = steps[handle];
        let position;
        switch (e.which) {
          case 13:
            rangeSlider.noUiSlider.setHandle(handle, this.value);
            break;
          case 38:
            position = step[1];
            if (position === false) {
              position = 1;
            }
            if (position !== null) {
              rangeSlider.noUiSlider.setHandle(handle, value + position);
            }
            break;
          case 40:
            position = step[0];
            if (position === false) {
              position = 1;
            }
            if (position !== null) {
              rangeSlider.noUiSlider.setHandle(handle, value - position);
            }
            break;
        }
      });
    });
  });
  // селекты
  const selectElements = document.querySelectorAll(".js-select");
  selectElements.forEach((select) => {
    const choices = new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
      allowHTML: true,
    });
  });
  // свайпер
  //eslint-disable-next-line
  const resultSwiper = new Swiper(".swiper-result", {
    modules: [Pagination, Grid],
    spaceBetween: 10,
    slidesPerView: 4,
    slidesPerGroup: 4,
    loopFillGroupWithBlank: true,
    grid: {
      rows: 4,
      fill: "row",
    },
    pagination: {
      el: ".result__swiper-pagination",
      clickable: true,
    },
  });
  // аккордеоны
  const accordions = document.querySelectorAll(".accordion-container");
  accordions.forEach((accordion) => {
    new Accordion(accordion);
  });
  // табы
  const tabsButtons = document.querySelectorAll(".tabs__item");
  const resultList = document.querySelectorAll(".result__wrap");
  tabsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) return;
      tabsButtons.forEach((el) => el.classList.remove("is-active"));
      button.classList.add("is-active");
      const target = button.getAttribute("data-path");
      const baseUrl = document.location.href.split("?")[0];
      const newUrl = baseUrl + "?" + target.split("-")[1];
      history.pushState(null, null, newUrl);
      resultList.forEach((list) => {
        list.classList.remove("is-open");
        if (list.getAttribute("data-target") == target)
          list.classList.add("is-open");
      });
    });
  });
  // ещё
  const moreButtons = document.querySelectorAll(".catalog__more");
  moreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      for (let link of button.parentElement.children) {
        if (link.tagName == "A") {
          link.style.display = "block";
        }
      }
      button.classList.add("none");
    });
  });
  // загрузка страницы
  if (document.location.search) {
    const catalog = document.querySelector(".catalog");
    catalog.style.display = "none";
    const detailCatalog = document.querySelector(".detail-catalog");
    detailCatalog.style.display = "block";
    const tabButton = document.querySelector(
      `[data-path=tabs-${document.location.search.slice(1)}]`
    );
    tabButton.classList.add("is-active");
    const tabTarget = document.querySelector(
      `[data-target=tabs-${document.location.search.slice(1)}]`
    );
    tabTarget.classList.add("is-open");
    const catalogNavButton = document.querySelector(".catalog-nav");
    catalogNavButton.addEventListener("click", () => {
      catalog.style.display = "block";
      detailCatalog.style.display = "none";
      const baseUrl = document.location.href.split("?")[0];
      history.pushState(null, null, baseUrl);
    });
  }
});
