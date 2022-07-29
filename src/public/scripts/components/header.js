import "../../styles/components/header/style.scss";
// Находим кнопку Каталог
const catalogButtonHeader = document.querySelector(".header__button");
const catalogWrapHeader = document.querySelector(".header__catalog-wrap");
const catalogWrapCloseHeader = document.querySelector(
  ".header__catalog-wrap-close"
);
catalogWrapCloseHeader.addEventListener("click", () =>
  catalogButtonHeader.click()
);
// Вешаем обработчик
catalogButtonHeader.addEventListener("click", () => {
  // Тоглим стиль по нажатию
  catalogButtonHeader.classList.toggle("is-open");
  catalogWrapHeader.classList.toggle("is-open");
});
// Находим все элементы списка категории товаров
const catalogItemsHeader = document.querySelectorAll(
  ".header__catalog-left-column-item"
);
// Перебираем каждый
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
