import "../../styles/components/header/style.scss";
import { bodyScrollToggle } from "../functions/scrollBody";
import ucFirst from "../functions/ucFirst";
document.addEventListener("DOMContentLoaded", () => {
  // Проверяем есть ли в браузере выбранный город
  const cityTagButtonHeader = document.querySelector(".tag");
  if (!localStorage.getItem("KEY_CITY")) {
    getUserIp();
  }
  // Проверяем есть ли в браузере выбранный город

  // Каталог + табы
  const headerCatalogTargets = document.querySelectorAll(
    ".header__catalog-target-list"
  );
  const headerCatalogWrap = document.querySelector(".header__catalog-wrap");
  const headerCatalogButton = document.querySelector(".header__button");
  headerCatalogButton.addEventListener("click", () => {
    bodyScrollToggle();
    headerCatalogButton.classList.toggle("is-active");
    headerCatalogWrap.classList.toggle("is-open");
    headerCatalogTargets.forEach((target) =>
      target.classList.remove("is-active")
    );
  });
  const headerCatalogTabs = document.querySelectorAll(
    ".header__catalog-tabs-item"
  );
  headerCatalogTabs.forEach((tab) => {
    tab.addEventListener("mouseover", () => {
      headerCatalogTargets.forEach((target) => {
        target.classList.remove("is-active");
        if (
          target.getAttribute("data-target") == tab.getAttribute("data-path")
        ) {
          target.classList.add("is-active");
        }
      });
    });
  });
  const headerCatalogClose = document.querySelector(
    ".header__catalog-wrap-close"
  );
  headerCatalogClose.addEventListener("click", () =>
    headerCatalogButton.click()
  );
  const headerBackButton = document.querySelector(".header__catalog-wrap-back");
  headerBackButton.addEventListener("click", () => {
    headerCatalogTargets.forEach((target) =>
      target.classList.remove("is-active")
    );
  });
  // Каталог + табы

  // Выбор города
  cityTagButtonHeader.addEventListener("click", () => {
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
    const popupCity = document.getElementById("popup-city");
    const closePopup = document.querySelector(".popup__wrap-close");
    const backgroundPopup = document.querySelector(".popup__background");
    const cityConfirmButton = document.getElementById("city-confirm");
    const topPopup = document.querySelector(".popup__wrap-top");
    const chooseWrap = document.querySelector(".choose-cities__wrap");
    const cityChangeButton = document.getElementById("city-change");
    closePopup.addEventListener("click", () => {
      bodyScrollToggle();
      popupCity.remove();
    });
    backgroundPopup.addEventListener("click", () => closePopup.click());
    cityConfirmButton.addEventListener("click", () => {
      closePopup.click();
    });
    cityChangeButton.addEventListener("click", () => {
      topPopup.style.display = "none";
      chooseWrap.style.display = "block";
      const chooseCitiesItems = document.querySelectorAll(
        ".choose-cities__item"
      );
      chooseCitiesItems.forEach((el) => {
        el.addEventListener("click", () => {
          const cityText = document.querySelector(".popup__wrap-text");
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
  });
  async function getUserIp() {
    await fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((res) => {
        return getUserLocation(res.ip);
      });
  }
  async function getUserLocation(ip) {
    await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=5e01da5475ba486da5b4b4d332a34862&ip=${ip}`
    )
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem(
          "KEY_CITY",
          JSON.stringify({ key: res.geoname_id, city: res.city })
        );
      });
  }
  // Выбор города

  // Вывод попапчика с номером заказа
  const statusLinkHeader = document.getElementById("status-link");
  statusLinkHeader.addEventListener("click", () => {
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
    const closePopup = document.querySelector(".popup__wrap-close");
    const backgroundPopup = document.querySelector(".popup__background");
    const inputPopup = document.querySelector(".popup__wrap-input");
    const buttonPopup = document.querySelector(".popup__wrap-button");
    closePopup.addEventListener("click", () => {
      bodyScrollToggle();
      popupStatus.remove();
    });
    backgroundPopup.addEventListener("click", () => closePopup.click());
    inputPopup.addEventListener("input", (e) => {
      if (inputPopup.classList.contains("is-not-valid"))
        inputPopup.classList.remove("is-not-valid");
      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
    });
    buttonPopup.addEventListener("click", () => {
      if (inputPopup.value.length < 6)
        return inputPopup.classList.add("is-not-valid");
    });
  });
  // Вывод попапчика с номером заказа

  // Открытие менюшки на таблетке
  const menuButtonHeader = document.querySelector(".menu");
  const menuHeader = document.querySelector(".header__pages-list");
  menuButtonHeader.addEventListener("click", () => {
    bodyScrollToggle();
    menuHeader.classList.toggle("is-open");
  });
  const menuCloseHeader = document.querySelector(".close-menu");
  menuCloseHeader.addEventListener("click", () => {
    bodyScrollToggle();
    menuHeader.classList.remove("is-open");
  });
  menuHeader.addEventListener("click", (e) => {
    if (e.offsetX < 0) menuCloseHeader.click();
  });
  // Открытие менюшки на таблетке
});
