import "../imports";
import "../../styles/pages/shops/style.scss";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
document.addEventListener("DOMContentLoaded", () => {
  new Accordion(".map__list");
  ymaps.ready(init);
  function init() {
    // Создание карты.
    let myMap = new ymaps.Map("map", {
      // Координаты центра карты.
      // Порядок по умолчанию: «широта, долгота».
      // Чтобы не определять координаты центра карты вручную,
      // воспользуйтесь инструментом Определение координат.
      center: [55.76, 37.64],
      // Уровень масштабирования. Допустимые значения:
      // от 0 (весь мир) до 19.
      zoom: 7,
    });
  }
});
