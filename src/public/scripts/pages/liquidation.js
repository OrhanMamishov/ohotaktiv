import "../imports";
import "../../styles/pages/liquidation/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.min.css";
import wNumb from "wnumb";

document.addEventListener("DOMContentLoaded", () => {
  // свайпер
  //eslint-disable-next-line
    const shopSwiper = new Swiper(".swiper-best", {
    modules: [Navigation],
    navigation: {
      nextEl: ".best__swiper-button-next",
      prevEl: ".best__swiper-button-prev",
    },
    breakpoints: {
      1559: {
        spaceBetween: 35,
        slidesPerView: 6,
      },
      1439: {
        spaceBetween: 30,
        slidesPerView: 5,
      },
    },
  });
  // свайпер
  // селекты
  const selectElements = document.querySelectorAll(".js-select");
  selectElements.forEach((select) => {
    const choices = new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
      allowHTML: true,
    });
  });
  // селекты
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
  // слайдеры
  // табы
  const filtersTabButtons = document.querySelectorAll(".filters__tabs-item");
  const filtersResultTabs = document.querySelectorAll(".filters__tab-result");
  filtersTabButtons.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("is-active")) return;
      filtersTabButtons.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      const target = item.getAttribute("data-path");
      filtersResultTabs.forEach((tab) => {
        tab.classList.remove("is-open");
        if (tab.getAttribute("data-target") == target)
          tab.classList.add("is-open");
      });
    });
  });
  // табы
});
