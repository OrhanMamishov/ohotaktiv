import "../imports";
import "../../styles/pages/cabinet/style.scss";
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import Inputmask from "inputmask";
import { bodyScrollToggle } from "../functions/scrollBody";

document.addEventListener("DOMContentLoaded", () => {
  const favouriteSwiper = new Swiper(".swiper-favourite", {
    spaceBetween: 10,
    modules: [Navigation, Pagination],
    navigation: {
      nextEl: ".cabinet__favourites-swiper-button-next",
      prevEl: ".cabinet__favourites-swiper-button-prev",
    },
    pagination: {
      el: ".cabinet__favourites-pagination",
      clickable: true,
    },
    breakpoints: {
      1560: {
        spaceBetween: 13,
        slidesPerView: 4,
      },
      1366: {
        slidesPerView: 3,
      },
      1023: {
        slidesPerView: 2,
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 3,
      },
      320: {
        slidesPerView: 2,
      },
    },
  });
  // открытие меню
  const hamburger = document.querySelector(".hamburger-lines");
  const cabinetLeft = document.querySelector(".cabinet__left");
  hamburger.addEventListener("click", () => {
    cabinetLeft.classList.toggle("is-open");
    hamburger.classList.toggle("is-active");
    bodyScrollToggle();
  });
  cabinetLeft.addEventListener("click", () => hamburger.click());
  // открытие меню
  // табы
  const tabsList = document.querySelectorAll(".tabs__item");
  const targetsList = document.querySelectorAll(".cabinet__target");
  tabsList.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("is-active")) return;
      if (item.getAttribute("data-path") == "logout") return;
      const baseUrl = document.location.href.split("?")[0];
      const newUrl = baseUrl + "?block=" + item.getAttribute("data-path");
      history.pushState(null, null, newUrl);
      tabsList.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      const target = item.getAttribute("data-path");
      targetsList.forEach((tab) => {
        tab.classList.remove("is-open");
        if (tab.getAttribute("data-target") == target)
          tab.classList.add("is-open");
      });
    });
  });
  const hashPath = document.querySelector(
    `[data-path = ${
      document.location.search
        ? document.location.search.split("=")[1]
        : `profile`
    }]`
  );
  const hashTarget = document.querySelector(
    `[data-target = ${
      document.location.search
        ? document.location.search.split("=")[1]
        : `profile`
    }]`
  );
  hashPath.classList.add("is-active");
  hashTarget.classList.add("is-open");
  // табы

  // // форма
  // const nameInput = document.getElementById("name-form-input");
  // const surnameInput = document.getElementById("surname-form-input");
  // const cityInput = document.getElementById("city-form-input");
  // const streetInput = document.getElementById("street-form-input");
  // const houseInput = document.getElementById("house-form-input");
  // const apartmentInput = document.getElementById("apartment-form-input");
  // const telInput = document.getElementById("tel-form-input");
  // const emailInput = document.getElementById("email-form-input");
  // const submitButton = document.getElementById("submit-button");
  // submitButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   const inputs = document.querySelectorAll(".cabinet__profile-form-input");
  //   inputs.forEach((input) => {
  //     if (input.type == "date") return;
  //     if (!input.validity.valid) {
  //       input.classList.add("is-not-valid");
  //     }
  //   });
  // });
  // Inputmask({
  //   mask: "*{30}",
  //   placeholder: "",
  //   showMaskOnHover: false,
  //   onKeyDown: function () {
  //     this.classList.remove("is-not-valid");
  //   },
  //   definitions: {
  //     "*": {
  //       validator: "[А-Яа-яЁё-]",
  //     },
  //   },
  // }).mask(nameInput);
  // Inputmask({
  //   mask: "*{30}",
  //   placeholder: "",
  //   showMaskOnHover: false,
  //   onKeyDown: function () {
  //     this.classList.remove("is-not-valid");
  //   },
  //   definitions: {
  //     "*": {
  //       validator: "[А-Яа-яЁё-]",
  //     },
  //   },
  // }).mask(surnameInput);
  // Inputmask({
  //   mask: "*{30}",
  //   placeholder: "",
  //   showMaskOnHover: false,
  //   onKeyDown: function () {
  //     this.classList.remove("is-not-valid");
  //   },
  //   definitions: {
  //     "*": {
  //       validator: "[А-Яа-яЁё -]",
  //     },
  //   },
  // }).mask(cityInput);
  // Inputmask({
  //   mask: "*{30}",
  //   placeholder: "",
  //   showMaskOnHover: false,
  //   onKeyDown: function () {
  //     this.classList.remove("is-not-valid");
  //   },
  //   definitions: {
  //     "*": {
  //       validator: "[А-Яа-я- Ёё /.]",
  //     },
  //   },
  // }).mask(streetInput);
  // Inputmask({
  //   mask: "*{5}",
  //   placeholder: "",
  //   showMaskOnHover: false,
  //   onKeyDown: function () {
  //     this.classList.remove("is-not-valid");
  //   },
  //   definitions: {
  //     "*": {
  //       validator: "[0-9/]",
  //     },
  //   },
  // }).mask(houseInput);
  // Inputmask({
  //   mask: "*{5}",
  //   placeholder: "",
  //   showMaskOnHover: false,
  //   onKeyDown: function () {
  //     this.classList.remove("is-not-valid");
  //   },
  //   definitions: {
  //     "*": {
  //       validator: "[0-9/]",
  //     },
  //   },
  // }).mask(apartmentInput);
  // Inputmask({
  //   mask: "+7 (999) 999-99-99",
  //   showMaskOnHover: false,
  //   onKeyDown: function () {
  //     this.classList.remove("is-not-valid");
  //   },
  //   onincomplete: function () {
  //     this.classList.add("is-not-valid");
  //   },
  // }).mask(telInput);
  // Inputmask({
  //   mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
  //   greedy: false,
  //   showMaskOnHover: false,
  //   definitions: {
  //     "*": {
  //       validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
  //       // casing: "lower",
  //     },
  //   },
  //   onKeyDown: function () {
  //     this.classList.remove("is-not-valid");
  //   },
  //   onincomplete: function () {
  //     this.classList.add("is-not-valid");
  //   },
  // }).mask(emailInput);
  // // форма
});
