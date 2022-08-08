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
  const catalogButtonHeader = document.querySelector(".header__button");
  const catalogWrapHeader = document.querySelector(".header__catalog-wrap");
  const catalogWrapLeftColumnHeader = document.querySelector(
    ".header__catalog-left-column"
  );
  const catalogWrapCloseHeader = document.querySelector(
    ".header__catalog-wrap-close"
  );
  const catalogItemsHeader = document.querySelectorAll(
    ".header__catalog-left-column-item"
  );
  const catalogTabsWrapHeader = document.querySelector(
    ".header__catalog-right-column"
  );
  const catalogTabsWrapCloseHeader = document.querySelector(
    ".header__catalog-wrap-back"
  );
  catalogTabsWrapCloseHeader.addEventListener("click", () => {
    catalogWrapLeftColumnHeader.classList.remove("disable-scroll");
    catalogTabsWrapHeader.classList.remove("is-active");
  });
  catalogWrapCloseHeader.addEventListener("click", () =>
    catalogButtonHeader.click()
  );
  catalogButtonHeader.addEventListener("click", () => {
    bodyScrollToggle();
    catalogWrapHeader.classList.toggle("is-open");
    catalogTabsWrapHeader.classList.remove("is-active");
    catalogButtonHeader.classList.toggle("is-active");
  });
  catalogItemsHeader.forEach((el) => {
    // Вешаем обработчик на каждый
    el.addEventListener("click", () => {
      catalogTabsWrapHeader.classList.add("is-active");
      // У остальных снимаем актив
      catalogItemsHeader.forEach((item) => item.classList.remove("is-active"));
      // На кликнутый добавляем актив
      el.classList.add("is-active");

      // Табы
      // Находим все элементы с атрибутом data-path
      const dataPath = el.getAttribute("data-path");
      // Находим все элементы с атрибутом data-target
      const dataTargets = document.querySelectorAll("[data-target]");
      // Перебираем все таргеты
      dataTargets.forEach((target) => {
        // Все скрываем
        target.classList.remove("is-active");
        // Если совпадают атрибуты, то показываем
        if (target.getAttribute("data-target") === dataPath) {
          catalogWrapLeftColumnHeader.classList.add("disable-scroll");
          target.classList.add("is-active");
        }
      });
    });
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
            <p class="popup__wrap-text">
              Ваш город Кострома?
            </p>
            <div class="popup__wrap-button-wrap">
              <div id="city-confirm" class="popup__wrap-button">
                Да, верно
              </div>
              <div id="city-change" class="popup__wrap-button">
                Изменить
              </div>
            </div>
          </div>
          <div class="choose-cities__wrap">
            <p class="choose-cities__title">
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
          <p class="popup__wrap-text">
            Введите номер заказа
          </p>
          <input type="text" class="popup__wrap-input" placeholder="000000" maxlength="6">
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
