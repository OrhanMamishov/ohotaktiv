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

  const selectEl = document.querySelector(".js-select");
  const choices = new Choices(selectEl, {
    searchEnabled: false,
    itemSelectText: "",
    allowHTML: true,
  });

  const rangeSlider = document.getElementById("slider");
  const rangeFrom = document.getElementById("range-from");
  const rangeTo = document.getElementById("range-to");
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
