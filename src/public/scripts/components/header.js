import "../../styles/components/header/style.scss";
document.addEventListener("DOMContentLoaded", () => {
  // Проверяем есть ли в браузере выбранный город
  if (!localStorage.getItem("KEY_CITY")) {
    getUserIp();
  }
  // Проверяем есть ли в браузере выбранный город

  // Каталог + табы
  const catalogButtonHeader = document.querySelector(".header__button");
  const catalogWrapHeader = document.querySelector(".header__catalog-wrap");
  const catalogWrapCloseHeader = document.querySelector(
    ".header__catalog-wrap-close"
  );
  const catalogItemsHeader = document.querySelectorAll(
    ".header__catalog-left-column-item"
  );
  catalogWrapCloseHeader.addEventListener("click", () =>
    catalogButtonHeader.click()
  );
  catalogButtonHeader.addEventListener("click", () => {
    catalogButtonHeader.classList.toggle("is-open");
    catalogWrapHeader.classList.toggle("is-open");
  });
  catalogItemsHeader.forEach((el) => {
    // Вешаем обработчик на каждый
    el.addEventListener("click", () => {
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
        if (target.getAttribute("data-target") === dataPath)
          target.classList.add("is-active");
      });
    });
  });
  // Каталог + табы

  // Выбор города
  const cityWrapHeader = document.querySelector(".header__pages-city-wrap");
  const cityCloseButtonHeader = document.querySelector(
    ".header__pages-city-wrap-close"
  );
  const cityConfirmButtonHeader = document.getElementById(
    "header-city-confirm"
  );
  const cityTagButtonHeader = document.querySelector(".tag");
  cityCloseButtonHeader.addEventListener("click", () => {
    cityWrapHeader.classList.remove("is-open");
  });
  cityConfirmButtonHeader.addEventListener("click", () =>
    cityCloseButtonHeader.click()
  );
  cityTagButtonHeader.addEventListener("click", () =>
    cityWrapHeader.classList.add("is-open")
  );

  async function getUserIp() {
    cityWrapHeader.classList.add("is-open");
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
  const popupElement = `
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
  statusLinkHeader.addEventListener("click", () => {
    document.body.insertAdjacentHTML("beforeend", popupElement);
    const popupStatus = document.getElementById("popup-status");
    const closePopup = document.querySelector(".popup__wrap-close");
    const backgroundPopup = document.querySelector(".popup__background");
    const inputPopup = document.querySelector(".popup__wrap-input");
    const buttonPopup = document.querySelector(".popup__wrap-button");
    closePopup.addEventListener("click", () => popupStatus.remove());
    backgroundPopup.addEventListener("click", () => popupStatus.remove());
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
});
