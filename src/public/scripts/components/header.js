import "../../styles/components/header/style.scss";
import { bodyScrollToggle } from "../functions/scrollBody";
import ucFirst from "../functions/ucFirst";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import Inputmask from "inputmask";
import { showMessage } from "../functions/showMessage";

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
  const IS_AUTHORIZED = false;
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
    if (
      e.target.className == "header__action-link cabinet" ||
      e.target.className == "header__action-link favourite" ||
      e.target.className == "header__action-link cart"
    ) {
      e.preventDefault();
      if (IS_AUTHORIZED) {
        window.location.href = e.target.href;
      } else {
        const element = `
        <div id="popup-authorize" class="popup">
          <div class="popup__background"></div>
          <div class="popup__wrap">
            <button class="popup__wrap-close"></button>
            <p class="popup__wrap-title">
              Вход или регистрация
            </p>
            <input type="text" id="email-input-authorize" class="popup__wrap-input" placeholder="E-mail*">
            <input type="password" id="password-input-authorize" class="popup__wrap-input" placeholder="Пароль*">
            <button id="authorize-button" class="popup__wrap-button">
              Войти
            </button>
            <button class="popup__wrap-button forgot-password">Напомнить пароль</button>
          </div>
        </div>
      `;
        document.body.insertAdjacentHTML("beforeend", element);
        const emailInput = document.getElementById("email-input-authorize");
        Inputmask({
          mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
          greedy: false,
          showMaskOnHover: false,
          definitions: {
            "*": {
              validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
            },
          },
          onKeyDown: function () {
            this.classList.remove("is-not-valid");
          },
          onincomplete: function () {
            this.classList.add("is-not-valid");
          },
        }).mask(emailInput);
        const passwordInput = document.getElementById(
          "password-input-authorize"
        );
        Inputmask({
          onKeyDown: function () {
            this.classList.remove("is-not-valid");
          },
        }).mask(passwordInput);
        const popupAuthorize = document.getElementById("popup-authorize");
        const authorizeButton = document.getElementById("authorize-button");
        authorizeButton.addEventListener("click", async () => {
          authorizeButton.disabled = true;
          const popups = document.querySelectorAll(".popup__wrap-input");
          const [popupEmail, popupPassword] = popups;
          if (!popupEmail.value.length) {
            popupEmail.classList.add("is-not-valid");
          }
          if (!popupPassword.value.length) {
            popupPassword.classList.add("is-not-valid");
          }
          if (
            !popupEmail.classList.contains("is-not-valid") &&
            !popupPassword.classList.contains("is-not-valid")
          ) {
            const fetchFromBase = await fetch(
              `https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?get_user_login=${popupEmail.value}&password=${popupPassword.value}`,
              {
                method: "GET",
              }
            )
              .then((res) => res.json())
              .then((res) => {
                console.log(res);
                if (res) {
                  showMessage(
                    "Вы успешно авторизованы!",
                    "Теперь вам доступны товары со скидкой",
                    "success"
                  );
                  popupAuthorize.remove();
                } else {
                  authorizeButton.removeAttribute("disabled");
                  showMessage(
                    "Неверный логин или пароль!",
                    "Пожалуйста, повторите попытку",
                    "error"
                  );
                }
              });
          }
        });
      }
    }
  });
  // постоянный запрос
  //
});
