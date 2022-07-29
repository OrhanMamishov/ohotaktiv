import "../../styles/components/header/style.scss";
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("KEY_CITY")) {
    getUserIp();
  }
});
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
const cityConfirmButtonHeader = document.getElementById("header-city-confirm");
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
