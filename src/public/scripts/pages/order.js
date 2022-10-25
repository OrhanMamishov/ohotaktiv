import "../../styles/pages/order/style.scss";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import Inputmask from "inputmask";

document.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.querySelector(".js-select");
  const choice = new Choices(selectElement, {
    itemSelectText: "",
    allowHTML: true,
    noResultsText: "Город не найден",
    searchPlaceholderValue: "Начните вводить город",
  });
  selectElement.addEventListener("change", function () {
    refreshLeft();
  });
  const nameInput = document.getElementById("name-input");
  const surnameInput = document.getElementById("surname-input");
  const telInput = document.getElementById("tel-input");
  const emailInput = document.getElementById("email-input");
  Inputmask({
    mask: "*{30}",
    placeholder: "",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    definitions: {
      "*": {
        validator: "[А-Яа-яЁё-]",
      },
    },
  }).mask(nameInput);
  Inputmask({
    mask: "*{30}",
    placeholder: "",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    definitions: {
      "*": {
        validator: "[А-Яа-яЁё-]",
      },
    },
  }).mask(surnameInput);
  Inputmask({
    mask: "+7 (999) 999-99-99",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    onincomplete: function () {
      this.classList.add("is-not-valid");
    },
  }).mask(telInput);
  Inputmask({
    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
    greedy: false,
    showMaskOnHover: false,
    definitions: {
      "*": {
        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
        // casing: "lower",
      },
    },
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    onincomplete: function () {
      this.classList.add("is-not-valid");
    },
  }).mask(emailInput);
  function refreshLeft() {
    const leftColumn = document.querySelector(".order__left");
    while (leftColumn.children.length > 1) {
      leftColumn.removeChild(leftColumn.lastChild);
    }
    const goodsWithDeliveryElement = `
      <div class="order__left-block" data-delivery>
        <p class="order__left-block-title">
          Товары с доставкой
        </p>
        <div class="order__left-block-section">
          <ul class="order__left-block-cards-list">
            <li class="order__left-block-cards-item" data-delivery-point>
              <div class="order__left-block-img-wrap">
                <img src="/assets/img/card-img.png" alt="Карточка товара" class="order__left-block-img">
              </div>
            </li>
            <li class="order__left-block-cards-item" data-delivery-point>
              <div class="order__left-block-img-wrap">
                <img src="/assets/img/card-img.png" alt="Карточка товара" class="order__left-block-img">
              </div>
            </li>
          </ul>
          <p class="order__left-block-subtitle">
            Выберите способ доставки
          </p>
          <ul class="order__left-block-delivery-list">
            <li class="order__left-block-delivery-item selected">
              <p class="order__left-block-delivery-title">
                CDEK Курьерская доставка
              </p>
              <p class="order__left-block-delivery-text">
                Посылка склад-дверь
              </p>
              <p class="order__left-block-delivery-price">
                1500 &#8381;
              </p>
              <p class="order__left-block-delivery-date">
                4-5 дней
              </p>
            </li>
            <li class="order__left-block-delivery-item">
              <p class="order__left-block-delivery-title">
                CDEK Курьерская доставка
              </p>
              <p class="order__left-block-delivery-text">
                Посылка склад-дверь
              </p>
              <p class="order__left-block-delivery-price">
                1500 &#8381;
              </p>
              <p class="order__left-block-delivery-date">
                4-5 дней
              </p>
            </li>
            <li class="order__left-block-delivery-item">
              <p class="order__left-block-delivery-title">
                CDEK Курьерская доставка
              </p>
              <p class="order__left-block-delivery-text">
                Посылка склад-дверь
              </p>
              <p class="order__left-block-delivery-price">
                1500 &#8381;
              </p>
              <p class="order__left-block-delivery-date">
                4-5 дней
              </p>
            </li>
            <li class="order__left-block-delivery-item">
              <p class="order__left-block-delivery-title">
                CDEK Курьерская доставка
              </p>
              <p class="order__left-block-delivery-text">
                Посылка склад-дверь
              </p>
              <p class="order__left-block-delivery-price">
                1500 &#8381;
              </p>
              <p class="order__left-block-delivery-date">
                4-5 дней
              </p>
            </li>
          </ul>
        </div>
        <div class="order__left-block-section">
          <p class="order__left-block-subtitle">
            Укажите адрес доставки
          </p>
          <input type="text" class="order__left-block-map-input" placeholder="Искать по улице, метро">
          <p class="order__left-block-map-text">
            Выбрано: обл. Костромская, г. Кострома, просп. Мира, д. 10/11
          </p>
          <div class="order__left-block-map">
            <div id="map"></div>
          </div>
        </div>
      </div>
    `;
    const goodsWithDeliveryMyselfElement = `
      <div class="order__left-block" data-delivery-myself>
        <p class="order__left-block-title">
          Товары самовывозом
        </p>
        <div class="order__left-block-section">
          <ul class="order__left-block-cards-list">
            <li class="order__left-block-cards-item">
              <div class="order__left-block-img-wrap">
                <img src="/assets/img/card-img.png" alt="Карточка товара" class="order__left-block-img">
              </div>
            </li>
            <li class="order__left-block-cards-item">
              <div class="order__left-block-img-wrap">
                <img src="/assets/img/card-img.png" alt="Карточка товара" class="order__left-block-img">
              </div>
            </li>
          </ul>
          <p class="order__left-block-subtitle">
            Выберите пункт самовывоза
          </p>
          <ul class="order__left-block-delivery-list">
            <li class="order__left-block-delivery-item selected" data-delivery-myself>
              <p class="order__left-block-delivery-title">
                Кострома
              </p>
              <p class="order__left-block-delivery-text">
                просп. Мира, д. 10/11
              </p>
              <a href="#" class="order__left-block-delivery-tel">
                +7 (831)-2-147-147
              </a>
              <p class="order__left-block-delivery-work">
                9:00 - 20:00, вс 9:00 - 16:00
              </p>
            </li>
            <li class="order__left-block-delivery-item" data-delivery-myself>
              <p class="order__left-block-delivery-title">
                Кострома
              </p>
              <p class="order__left-block-delivery-text">
                просп. Мира, д. 10/11
              </p>
              <a href="#" class="order__left-block-delivery-tel">
                +7 (831)-2-147-147
              </a>
              <p class="order__left-block-delivery-work">
                9:00 - 20:00, вс 9:00 - 16:00
              </p>
            </li>
          </ul>
        </div>
      </div>
    `;
    leftColumn.insertAdjacentHTML("beforeend", goodsWithDeliveryElement);
    leftColumn.insertAdjacentHTML("beforeend", goodsWithDeliveryMyselfElement);
    // карта
    const geoMagazines = [
      {
        name: "улица Титова 6, г.Кострома",
        coords: [57.758071, 40.974595],
      },
      {
        name: "улица Пряничные Ряды 1, г.Кострома",
        coords: [57.765644, 40.925018],
      },
      {
        name: "микрорайон Паново 15, г.Кострома",
        coords: [57.736203, 40.908649],
      },
    ];
    // eslint-disable-next-line
    ymaps.ready(init);
    function init() {
      let myMap = new ymaps.Map("map", {
        center: [57.73, 40.97],
        zoom: 11,
        yandexMapDisablePoiInteractivity: true,
        controls: ["zoomControl"],
      });
      geoMagazines.forEach((geo) => {
        const myPlacemark = new ymaps.Placemark(geo.coords, {
          // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
          balloonContentHeader: `<p class="balloon-title">Адрес доставки</p>`,
          balloonContentBody: geo.name,
        });
        myMap.geoObjects.add(myPlacemark);
      });
    }
  }
});
