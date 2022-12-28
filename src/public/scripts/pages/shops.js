import "../imports";
import "../../styles/pages/shops/style.scss";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener("DOMContentLoaded", async () => {
  const shopsFromBase = await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/shops/shops.php?shoplist=get",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      res.sort((a, b) => (Number(a.SORT) > Number(b.SORT) ? 1 : -1));
      return refreshShops(res);
    });
  function refreshShops(shops) {
    let myMap;
    const element = `
    <section class="map">
      <div class="map__wrap container">
        <nav class="navigation">
          <ul class="navigation__list">
            <li class="navigation__item">
              <a href="#" class="navigation__link back"> Назад </a>
            </li>
            <li class="navigation__item">
              <a href="../index/" class="navigation__link"> Главная </a>
            </li>
            <li class="navigation__item">
              <a href="#" class="navigation__link"> Магазины </a>
            </li>
          </ul>
        </nav>
        <h1 class="categories__title">
          Адреса магазинов ОхотАктив в городах России
        </h1>
        <div class="map__columns">
          <div class="map__left-column">
            <input
              type="text"
              class="map__input"
              placeholder="Введите город"
            />
            <ul class="map__list accordion-container">
              ${shops
                .map((shop, index) => {
                  return `
                  <li class="map__item ac">
                    <p class="map__item-title ac-header">
                      <button value="${shop.VALUE}" type="button" class="map__item-button ac-trigger" data-index="${index}">
                        ${shop.TITLE}
                      </button>
                    </p>
                    <div class="map__item-panel ac-panel">
                      <address class="map__item-address">
                        ${shop.ADDRESS}
                        <span> Время работы: ${shop.SCHEDULE} </span>
                      </address>
                      <a href="tel:88007008256" class="map__item-tel">8 (800) 700-82-56</a>
                    </div>
                  </li>
                `;
                })
                .join("")}
            </ul>
          </div>
          <div class="map__right-column">
            <div id="map"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="categories">
      <h2 class="map__title visually-hidden">Про нас</h2>
      <div class="categories__wrap container">
        <ul class="categories__list">
          <li class="categories__item">
            <p class="categories__item-title">Крупнейшая сеть</p>
            <p class="categories__item-text">
              Крупнейшая сеть магазинов для охоты, рыбалки и активного отдыха.
              Наши магазины представлены в большинстве субъектов РФ — от
              Владивостока до Калининграда.
            </p>
          </li>
          <li class="categories__item">
            <p class="categories__item-title">Широкий ассортимент</p>
            <p class="categories__item-text">
              Ассортимент розничной сети ОхотАктив насчитывает более 100 тысяч
              уникальных товаров ведущих производителей для охоты, рыбалки и
              активного отдыха.
            </p>
          </li>
          <li class="categories__item">
            <p class="categories__item-title">Официальный дилер</p>
            <p class="categories__item-text">
              Индивидуальный дистрибьютор на территории РФ ведущих мировых
              брендов: Sabatti, Remington, ATA Arms, Instanbul Silah, Hatsan и
              многих других.
            </p>
          </li>
          <li class="categories__item">
            <p class="categories__item-title">Гарантия</p>
            <p class="categories__item-text">
              Гарантия на всю продукцию и пост гарантийное обслуживание.
              ОхотАктив располагает собственной ремонтной базой и имеет полный
              ассортимент запасных частей и комплектующих.
            </p>
          </li>
        </ul>
      </div>
    </section>
    `;
    const main = document.querySelector("main");
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.insertAdjacentHTML("beforeend", element);
    ymaps.ready(init);
    function init() {
      // Создание карты.
      myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7,
        controls: ["zoomControl"],
      });
      shops.forEach((shop) => {
        const myPlacemark = new ymaps.Placemark([shop.GPS_N, shop.GPS_S], {
          balloonContentHeader: `
            <p class="map-header-title">${shop.TITLE}</p>
          `,
          balloonContentBody: `
            <p class="map-body-text">${shop.ADDRESS}</p>
            <p class="map-body-text grey--text">Время работы: ${shop.SCHEDULE}</p>
            <a href="tel:88007008256" class="map-body-text">8 (800) 700-82-56</a>
          `,
        });
        myMap.geoObjects.add(myPlacemark);
      });
      if (document.location.search) {
        const shop = document.location.search.split("?shop=")[1];
        const shopElement = document.querySelector(`[value=${shop}]`);
        shopElement.click();
      }
    }
    main.addEventListener("click", (e) => {
      if (e.target.className == "map__item-button ac-trigger") {
        myMap.geoObjects.each((el, index) => {
          if (index == e.target.getAttribute("data-index")) {
            el.balloon.open();
          }
        });
      }
    });
    new Accordion(".map__list");
    const mapItems = document.querySelectorAll(".map__item");
    const mapInput = document.querySelector(".map__input");
    mapInput.addEventListener("input", (e) => {
      e.currentTarget.value = e.currentTarget.value.replace(
        /[^а-я, ^А-Я, a-z, A-Z '']/,
        ""
      );
      mapItems.forEach((item) => {
        const nameCity = item.children[0].children[0].textContent.trim();
        if (nameCity.toLowerCase().startsWith(mapInput.value.toLowerCase())) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
});
