import "../../styles/components/header/style.scss";
import { bodyScrollToggle } from "../functions/scrollBody";
import ucFirst from "../functions/ucFirst";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const headerMenuWrap = document.querySelector(".header__menu-wrap");
  const headerMenu = document.querySelector(".header__menu");
  const headerCatalogWrap = document.querySelector(".header__catalog-wrap");
  const headerCatalog = document.querySelector(".header__catalog");
  const allAccordions = document.querySelectorAll(
    ".header__accordion-container"
  );
  allAccordions.forEach((accordion) => {
    if (window.innerWidth < 1024) new Accordion(accordion);
  });
  header.addEventListener("click", (e) => {
    if (e.target.className == "header__status") {
      bodyScrollToggle();
      const popupStatusElement = `
          <div id="popup-status" class="popup">
            <div class="popup__background"></div>
            <div class="popup__wrap">
              <button class="popup__wrap-close"></button>
              <p class="popup__wrap-subtitle">
                Статус заказа
              </p>
              <input type="text" class="popup__wrap-input" placeholder="Введите номер заказа" maxlength="6">
              <button class="popup__wrap-button">
                Проверить
              </button>
            </div>
          </div>
        `;
      document.body.insertAdjacentHTML("beforeend", popupStatusElement);
      const popupStatus = document.getElementById("popup-status");
      const inputPopup = document.querySelector(".popup__wrap-input");
      const buttonPopup = document.querySelector(".popup__wrap-button");
      inputPopup.addEventListener("input", (e) => {
        if (inputPopup.classList.contains("is-not-valid"))
          inputPopup.classList.remove("is-not-valid");
        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
      });
      buttonPopup.addEventListener("click", () => {
        if (inputPopup.value.length < 6)
          return inputPopup.classList.add("is-not-valid");
      });
    }
    if (e.target.className == "header__city") {
      bodyScrollToggle();
      const popupCityElement = `
          <div id="popup-city" class="popup">
            <div class="popup__background"></div>
            <div class="popup__wrap">
              <button class="popup__wrap-close"></button>
              <div class="popup__wrap-top">
                <p class="popup__wrap-top-title">
                  Выбор города
                </p>
                <p class="popup__wrap-top-text">
                  Ваш город Кострома?
                </p>
                <div class="popup__wrap-button-wrap">
                  <button id="city-confirm" class="popup__wrap-button">
                    Да, верно
                  </button>
                  <button id="city-change" class="popup__wrap-button">
                    Нет, изменить
                  </button>
                </div>
              </div>
              <div class="choose-cities__wrap">
                <p class="popup__wrap-top-title">
                  Выберите свой город
                </p>
                <input type="text" class="choose-cities__input" placeholder="Начните вводить название города">
                <ul class="choose-cities__list">
                  <li class="choose-cities__item">
                    <input class="radio__input" type="radio" id="city-1" name="city">
                    <label for="city-1">Кострома</label>
                  </li>
                  <li class="choose-cities__item">
                    <input class="radio__input" type="radio" id="city-2" name="city">
                    <label for="city-2">Иваново</label>
                  </li>
                  <li class="choose-cities__item">
                    <input class="radio__input" type="radio" id="city-3" name="city">
                    <label for="city-3">Мурманск</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        `;
      document.body.insertAdjacentHTML("beforeend", popupCityElement);
      const topPopup = document.querySelector(".popup__wrap-top");
      const chooseWrap = document.querySelector(".choose-cities__wrap");
      const cityChangeButton = document.getElementById("city-change");
      cityChangeButton.addEventListener("click", () => {
        topPopup.style.display = "none";
        chooseWrap.style.display = "block";
        const chooseCitiesItems = document.querySelectorAll(
          ".choose-cities__item"
        );
        chooseCitiesItems.forEach((el) => {
          el.addEventListener("click", () => {
            const cityText = document.querySelector(".popup__wrap-top-text");
            cityText.textContent = `Ваш город ${el.children[1].textContent}?`;
            topPopup.style.display = "block";
            chooseWrap.style.display = "none";
          });
        });
        const cityInput = document.querySelector(".choose-cities__input");
        cityInput.addEventListener("input", (e) => {
          e.currentTarget.value = e.currentTarget.value.replace(
            /[^а-я, ^А-Я, '']/,
            ""
          );
          chooseCitiesItems.forEach((el) => {
            if (
              !el.children[1].textContent.startsWith(ucFirst(cityInput.value))
            ) {
              el.style.display = "none";
            } else {
              el.style.display = "block";
            }
          });
        });
      });
    }
    if (e.target.className == "header__openmenu") {
      bodyScrollToggle();
      headerMenuWrap.style.visibility = "visible";
      headerMenuWrap.style.opacity = 1;
      headerMenu.style.transform = "translateX(0)";
    }
    if (
      e.target.className == "header__menu-close" ||
      e.target.className == "header__menu-background"
    ) {
      bodyScrollToggle();
      headerMenuWrap.style.opacity = 0;
      headerMenu.style.transform = "translateX(100%)";
      setTimeout(() => {
        headerMenuWrap.style.visibility = "hidden";
      }, 200);
    }
    if (e.target.classList.contains("catalog")) {
      if (headerCatalogWrap.style.visibility === "visible") {
        document.querySelector(".header__catalog-close").click();
        return;
      }
      bodyScrollToggle();
      e.target.classList.toggle("is-active");
      headerCatalogWrap.style.visibility = "visible";
      headerCatalogWrap.style.opacity = 1;
      headerCatalog.style.transform =
        window.innerWidth < 1024 ? "translateX(0)" : "translateY(0)";
    }
    if (
      e.target.className == "header__catalog-close" ||
      e.target.className == "header__catalog-background"
    ) {
      document
        .querySelector(".header__catalog-button")
        .classList.remove("is-active");
      bodyScrollToggle();
      headerCatalogWrap.style.opacity = 0;
      headerCatalog.style.transform =
        window.innerWidth < 1024 ? "translateX(-100%)" : "translateY(-10px)";
      setTimeout(() => {
        headerCatalogWrap.style.visibility = "hidden";
      }, 200);
    }
  });
});
