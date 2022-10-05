import "../imports";
import "../../styles/pages/catalog/style.scss";
import Swiper, { Pagination, Grid } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.min.css";
import wNumb from "wnumb";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import { numberWithSpaces } from "../functions/numberWithSpaces";

document.addEventListener("DOMContentLoaded", async () => {
  // слайдеры
  const hostName = `https://ohotaktiv.ru/`;
  const sliderElements = document.querySelectorAll(".slider");
  sliderElements.forEach((slider) => {
    const rangeSlider = slider;
    const rangeFrom = slider.parentElement.children[0].children[1];
    const rangeTo = slider.parentElement.children[1].children[1];
    const rangesInputs = [rangeFrom, rangeTo];
    noUiSlider.create(rangeSlider, {
      start: [0, 500000],
      connect: true,
      range: {
        min: 0,
        max: 1000000,
      },
      format: wNumb({
        decimals: 0,
        thousand: " ",
      }),
    });
    rangeSlider.noUiSlider.on("update", function (values, handle) {
      rangesInputs[handle].value = values[handle];
    });
    rangesInputs.forEach(function (input, handle) {
      input.addEventListener("change", function () {
        rangeSlider.noUiSlider.setHandle(handle, this.value);
      });
      input.addEventListener("keydown", function (e) {
        let values = rangeSlider.noUiSlider.get();
        let value = Number(values[handle]);
        let steps = rangeSlider.noUiSlider.steps();
        let step = steps[handle];
        let position;
        switch (e.which) {
          case 13:
            rangeSlider.noUiSlider.setHandle(handle, this.value);
            break;
          case 38:
            position = step[1];
            if (position === false) {
              position = 1;
            }
            if (position !== null) {
              rangeSlider.noUiSlider.setHandle(handle, value + position);
            }
            break;
          case 40:
            position = step[0];
            if (position === false) {
              position = 1;
            }
            if (position !== null) {
              rangeSlider.noUiSlider.setHandle(handle, value - position);
            }
            break;
        }
      });
    });
  });
  const arrayFromBase = await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/catalog/catalog.json",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      // allCategories(res);
      showCategory(res, 4529);
    });

  function allCategories(res) {
    console.log(res);
    const catalogSection = document.querySelector(".catalog");
    while (catalogSection.firstChild) {
      catalogSection.removeChild(catalogSection.firstChild);
    }
    const [sectionList, parentList] = [
      res.catalog.parent_list,
      res.catalog.section_list,
    ];
    const element = `
    <div class="catalog__wrap container">
      <nav class="navigation">
        <ul class="navigation__list">
          <li class="navigation__item">
            <a href="#" class="navigation__link back">
              Назад
            </a>
          </li>
          <li class="navigation__item">
            <a href="${hostName}" class="navigation__link">
              Главная
            </a>
          </li>
          <li class="navigation__item">
            <a href="#" class="navigation__link">
              Каталог
            </a>
          </li>
        </ul>
      </nav>
      <h2 class="catalog__title">
        Каталог
      </h2>
      <ul class="catalog__list">
      ${Object.keys(sectionList)
        .map((key) => {
          const el = sectionList[key];
          return `
          <li class="catalog__item">
            <div class="catalog__img-wrap">
              <img src="${hostName + el.picture}" alt="${
            el.name
          }" class="catalog__img">
            </div>
            <a href="#" class="catalog__link title">
              ${el.name}
            </a>
            ${Object.values(parentList)
              .map((item) => {
                // console.log(item);
                if (item.section_parent == key) {
                  return `
                  <a href="#" class="catalog__link">
                    ${item.name}
                  </a>
                `;
                }
              })
              .join("")}
          </li>
        `;
        })
        .join("")}
      </ul>
    </div>
    `;
    catalogSection.insertAdjacentHTML("beforeend", element);
    const catalogItems = document.querySelectorAll(".catalog__item");
    catalogItems.forEach((item) => {
      if (item.childElementCount > 12) {
        const element = `
        <button class="catalog__more">
          Показать все категории
        </button>
      `;
        item.insertAdjacentHTML("beforeend", element);
      }
    });
    const moreButtons = document.querySelectorAll(".catalog__more");
    moreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        for (let link of button.parentElement.children) {
          if (link.tagName == "A") {
            link.style.display = "block";
          }
        }
        button.classList.add("none");
      });
    });
  }
  function showCategory(res, idCategory) {
    const catalogSection = document.querySelector(".catalog");
    catalogSection.remove();
    const [items, sectionList, parentList] = [
      res.catalog.items,
      res.catalog.parent_list,
      res.catalog.section_list,
    ];
    // console.log(idCategory);
    // console.log(parentList);
    // Object.values(items).forEach((item) => {
    //   console.log(item);
    // });
    // собираем все данные в массив
    console.log(sectionList[idCategory]);
    const thisCategoryList = [];
    let countGoods = 0;
    for (let key in parentList) {
      if (parentList[key].section_parent == idCategory) {
        const itemsList = [];
        Object.values(items).map((item) => {
          if (item.section_id !== undefined) {
            // const idSection = item.section_id ? item.section_id.length - 1 : 0;
            item.section_id.forEach((section) => {
              if (section == key) {
                countGoods++;
                itemsList.push(item);
              }
            });
          }
        }),
          thisCategoryList.push({
            [key]: {
              info: parentList[key],
              items: itemsList,
            },
          });
      }
    }
    console.log(thisCategoryList);
    const element = `
      <div class="detail-catalog">
      <section class="tabs">
        <h2 class="tabs__title visually-hidden">
          Таб оружия
        </h2>
        <div class="tabs__wrap container">
          <nav class="navigation">
            <ul class="navigation__list">
              <li class="navigation__item">
                <a href="#" class="navigation__link back">
                  Назад
                </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link">
                  Главная
                </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link catalog-nav">
                  Каталог
                </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link">
                  ${sectionList[idCategory].name}
                </a>
              </li>
            </ul>
          </nav>
          <ul class="tabs__list">
            <li class="tabs__item is-active" data-path="all">
              Все категории
            </li>
            ${thisCategoryList
              .map((list) => {
                return Object.keys(list)
                  .map((key) => {
                    return `
                    <li class="tabs__item" data-path="${
                      list[key].info.page_url.split("/")[3]
                    }">
                      ${list[key].info.name}
                    </li>
                  `;
                  })
                  .join("");
              })
              .join("")}
          </ul>
        </div>
      </section>
      <section class="result">
        <div class="result__wrap container is-open" data-target="tabs-all">
          <div class="result__img-wrap">
          <img class="result__img" src="${
            hostName + sectionList[idCategory].picture
          }" alt="Баннер">
          <div class="result__img-text-wrap">
            <h3 class="result__img-title">
              ${sectionList[idCategory].name}
            </h3>
            <p class="result__img-text">
              ${numberWithSpaces(countGoods)} товаров
            </p>
          </div>
        </div>
        <div class="result__filters">
            <div class="result__filters-wrap">
              <div class="result__filters-params accordion-container">
                <h3 class="result__filters-title">
                  Фильтры
                </h3>
                <div class="result__filters-avaliability-wrap">
                  <p class="result__filters-params-text">
                    Наличие в магазинах
                  </p>
                  <select class="js-select" id="select-city" name="select">
                    <option value="">Выберите магазин</option>
                    <option value="Москва">г. Москва</option>
                    <option value="Мурманск">г. Мурманск</option>
                    <option value="Иваново">г. Иваново</option>
                    <option value="Санкт-Петербург">г. Санкт-Петербург</option>
                    <option value="Ярославль">г. Ярославль</option>
                    <option value="Тюмень">г. Тюмень</option>
                  </select>
                </div>
                <div class="result__filters-price-wrap">
                  <p class="result__filters-params-text">
                    Цена
                  </p>
                  <div class="result__filters-slider">
                    <div class="result__filters-range-input-wrap">
                      <span>от</span>
                      <input class="result__filters-range-input" type="text">
                      <span>&#8381;</span>
                    </div>
                    <div class="result__filters-range-input-wrap">
                      <span>до</span>
                      <input class="result__filters-range-input" type="text">
                      <span>&#8381;</span>
                    </div>
                    <div class="slider-style slider"></div>
                  </div>
                </div>
                <div class="result__filters-another">
                  <p class="result__filters-params-text">
                    Бренды
                  </p>
                  <input type="text" class="result__filters-input" placeholder="Поиск значения">
                  <ul class="result__filters-another-list">
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="result__filters-another">
                  <p class="result__filters-params-text">
                    Страна-производитель
                  </p>
                  <input type="text" class="result__filters-input" placeholder="Поиск значения">
                  <ul class="result__filters-another-list">
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="result__filters-another">
                  <p class="result__filters-params-text">
                    Калибр
                  </p>
                  <input type="text" class="result__filters-input" placeholder="Поиск значения">
                  <ul class="result__filters-another-list">
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="result__filters-another">
                  <p class="result__filters-params-text">
                    Длина ствола
                  </p>
                  <input type="text" class="result__filters-input" placeholder="Поиск значения">
                  <ul class="result__filters-another-list">
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Материал цевья</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Материал ствола</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Вид сверловки</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Ёмкость магазина</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Шаг нарезов</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Принцип действия</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Расположения стволов</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-button-wrap">
                  <button class="result__filters-button">
                    Показать
                  </button>
                  <button class="result__filters-button">
                    Сбросить
                  </button>
                </div>
                <div class="result__filters-helpus">
                  <a href="#" class="result__filters-helpus-link">
                    Что улучшить в фильтрах?
                    <span>Сообщите нам</span>
                  </a>
                </div>
              </div>
              <div class="swiper swiper-result">
                <div class="result__filters-active">
                  <ul class="result__filters-active-list">
                    <li class="result__filters-active-item">
                      Бренд: Hatsan
                      <button class="result__filters-active-close"></button>
                    </li>
                    <li class="result__filters-active-item">
                      Калибр 12x7
                      <button class="result__filters-active-close"></button>
                    </li>
                  </ul>
                  <select class="js-select" id="select-sort" name="select">
                    <option value="Популярные">Популярные</option>
                    <option value="Ишо">Ишо</option>
                    <option value="Ещо">Ещо</option>
                    <option value="Ещё">Ещё</option>
                  </select>
                </div>
                <ul class="result__filters-list swiper-wrapper">
                  ${thisCategoryList
                    .map((list) => {
                      return Object.values(list)
                        .map((el) => {
                          return el.items
                            .map((item) => {
                              return `
                            <li class="result__filters-item swiper-slide card-item">
                              <div class="card-item__wrap">
                                <a href="#" class="card-item__link">
                                  <div class="card-item__photo-wrap">
                                  <img src="${
                                    item["Картинки"]
                                      ? hostName + item["Картинки"][1]
                                      : hostName +
                                        "/local/templates/ohota2021/img/no_photo.png"
                                  }" alt="Фото товара" class="card-item__photo">
                                    <div class="card-item__photo-button-wrap">
                                      <span class="card-item__photo-button compare"></span>
                                      <span class="card-item__photo-button favourite"></span>
                                    </div>
                                    <div class="card-item__photo-texts">
                                      <p class="card-item__photo-text new">
                                        Что то
                                      </p>
                                   
                                    </div>
                                  </div>
                                  <div class="card-item__description-wrap">
                                  
                                    <p class="card-item__description-text">
                                      ${item.name}
                                    </p>
                                    <div class="not-clicked-rate-wrap">
                                      <span class="active"></span>    
                                      <span class="active"></span>  
                                      <span class="active"></span>    
                                      <span class="active"></span>
                                      <span></span>
                                      <p class="not-clicked-rate-karma">
                                        ${item.reviews.cnt_reviews}
                                      </p>
                                    </div>
                                  </div>
                                </a>
                                <button class="card-item__button">
                                  В корзину
                                </button>
                              </div>
                            </li>
                            `;
                            })
                            .join("");
                        })
                        .join("");
                    })
                    .join("")}
                </ul>
                <div class="result__swiper-pagination swiper-pagination"></div>
              </div>
            </div>
          </div>
      </section>
    </div>
    `;
    document.querySelector("main").insertAdjacentHTML("beforeend", element);
  }
  // селекты
  const selectElements = document.querySelectorAll(".js-select");
  selectElements.forEach((select) => {
    const choices = new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
      allowHTML: true,
    });
  });
  // свайпер
  //eslint-disable-next-line
  const resultSwiper = new Swiper(".swiper-result", {
    modules: [Pagination, Grid],
    spaceBetween: 10,
    slidesPerView: 4,
    slidesPerGroup: 4,
    loopFillGroupWithBlank: true,
    grid: {
      rows: 4,
      fill: "row",
    },
    pagination: {
      el: ".result__swiper-pagination",
      clickable: true,
    },
  });
  // аккордеоны
  const accordions = document.querySelectorAll(".accordion-container");
  accordions.forEach((accordion) => {
    new Accordion(accordion);
  });
  // табы
  const tabsButtons = document.querySelectorAll(".tabs__item");
  const resultList = document.querySelectorAll(".result__wrap");
  tabsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) return;
      tabsButtons.forEach((el) => el.classList.remove("is-active"));
      button.classList.add("is-active");
      const target = button.getAttribute("data-path");
      const baseUrl = document.location.href.split("?")[0];
      const newUrl = baseUrl + "?" + target.split("-")[1];
      history.pushState(null, null, newUrl);
      resultList.forEach((list) => {
        list.classList.remove("is-open");
        if (list.getAttribute("data-target") == target)
          list.classList.add("is-open");
      });
    });
  });
  // ещё

  // загрузка страницы
  // if (document.location.search) {
  //   const catalog = document.querySelector(".catalog");
  //   // catalog.style.display = "none";
  //   const detailCatalog = document.querySelector(".detail-catalog");
  //   detailCatalog.style.display = "block";
  //   const tabButton = document.querySelector(
  //     `[data-path=tabs-${document.location.search.slice(1)}]`
  //   );
  //   tabButton.classList.add("is-active");
  //   const tabTarget = document.querySelector(
  //     `[data-target=tabs-${document.location.search.slice(1)}]`
  //   );
  //   tabTarget.classList.add("is-open");
  //   const catalogNavButton = document.querySelector(".catalog-nav");
  //   catalogNavButton.addEventListener("click", () => {
  //     catalog.style.display = "block";
  //     detailCatalog.style.display = "none";
  //     const baseUrl = document.location.href.split("?")[0];
  //     history.pushState(null, null, baseUrl);
  //   });
  // }
});

/*     const element = `
    <div class="detail-catalog">
      <section class="tabs">
        <h2 class="tabs__title visually-hidden">
          Таб оружия
        </h2>
        <div class="tabs__wrap container">
          <nav class="navigation">
            <ul class="navigation__list">
              <li class="navigation__item">
                <a href="#" class="navigation__link back">
                  Назад
                </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link">
                  Главная
                </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link catalog-nav">
                  Каталог
                </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link">
                  Огнестрельное оружие
                </a>
              </li>
            </ul>
          </nav>
          <ul class="tabs__list">
            <li class="tabs__item is-active" data-path="all">
              Все категории
            </li>
            ${Object.values(parentList)
              .map((list) => {
                if (list.section_parent == idCategory) {
                  console.log(list);
                  return `
                  <li class="tabs__item" data-path="${
                    list.page_url.split("/")[3]
                  }">
                    ${list.name}
                  </li>
                `;
                }
              })
              .join("")}
          </ul>
        </div>
      </section>
      <section class="result">
        <div class="result__wrap container" data-target="tabs-all">
          <div class="result__img-wrap">
            <img class="result__img" src="img/catalog-banner.jpg" alt="Баннер">
            <div class="result__img-text-wrap">
              <h3 class="result__img-title">
                Огнестрельное оружие
              </h3>
              <p class="result__img-text">
                12 568 товаров
              </p>
            </div>
          </div>
          <div class="result__filters">
            <div class="result__filters-wrap">
              <div class="result__filters-params accordion-container">
                <h3 class="result__filters-title">
                  Фильтры
                </h3>
                <div class="result__filters-avaliability-wrap">
                  <p class="result__filters-params-text">
                    Наличие в магазинах
                  </p>
                  <select class="js-select" id="select-city" name="select">
                    <option value="">Выберите магазин</option>
                    <option value="Москва">г. Москва</option>
                    <option value="Мурманск">г. Мурманск</option>
                    <option value="Иваново">г. Иваново</option>
                    <option value="Санкт-Петербург">г. Санкт-Петербург</option>
                    <option value="Ярославль">г. Ярославль</option>
                    <option value="Тюмень">г. Тюмень</option>
                  </select>
                </div>
                <div class="result__filters-price-wrap">
                  <p class="result__filters-params-text">
                    Цена
                  </p>
                  <div class="result__filters-slider">
                    <div class="result__filters-range-input-wrap">
                      <span>от</span>
                      <input class="result__filters-range-input" type="text">
                      <span>&#8381;</span>
                    </div>
                    <div class="result__filters-range-input-wrap">
                      <span>до</span>
                      <input class="result__filters-range-input" type="text">
                      <span>&#8381;</span>
                    </div>
                    <div class="slider-style slider"></div>
                  </div>
                </div>
                <div class="result__filters-another">
                  <p class="result__filters-params-text">
                    Бренды
                  </p>
                  <input type="text" class="result__filters-input" placeholder="Поиск значения">
                  <ul class="result__filters-another-list">
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="result__filters-another">
                  <p class="result__filters-params-text">
                    Страна-производитель
                  </p>
                  <input type="text" class="result__filters-input" placeholder="Поиск значения">
                  <ul class="result__filters-another-list">
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="result__filters-another">
                  <p class="result__filters-params-text">
                    Калибр
                  </p>
                  <input type="text" class="result__filters-input" placeholder="Поиск значения">
                  <ul class="result__filters-another-list">
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="result__filters-another">
                  <p class="result__filters-params-text">
                    Длина ствола
                  </p>
                  <input type="text" class="result__filters-input" placeholder="Поиск значения">
                  <ul class="result__filters-another-list">
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="result__filters-another-item">
                      <label class="checkbox__label">
                        Япония
                        <input type="checkbox" class="checkbox visually-hidden" required>
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Материал цевья</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Материал ствола</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Вид сверловки</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Ёмкость магазина</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Шаг нарезов</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Принцип действия</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-another ac">
                  <p class="result__filters-params-text ac-header">
                    <button type="button" class="ac-trigger">Расположения стволов</button>
                  </p>
                  <div class="ac-panel">
                    <input type="text" class="result__filters-input" placeholder="Поиск значения">
                    <ul class="result__filters-another-list">
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                      <li class="result__filters-another-item">
                        <label class="checkbox__label">
                          Япония
                          <input type="checkbox" class="checkbox visually-hidden" required>
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="result__filters-button-wrap">
                  <button class="result__filters-button">
                    Показать
                  </button>
                  <button class="result__filters-button">
                    Сбросить
                  </button>
                </div>
                <div class="result__filters-helpus">
                  <a href="#" class="result__filters-helpus-link">
                    Что улучшить в фильтрах?
                    <span>Сообщите нам</span>
                  </a>
                </div>
              </div>
              <div class="swiper swiper-result">
                <div class="result__filters-active">
                  <ul class="result__filters-active-list">
                    <li class="result__filters-active-item">
                      Бренд: Hatsan
                      <button class="result__filters-active-close"></button>
                    </li>
                    <li class="result__filters-active-item">
                      Калибр 12x7
                      <button class="result__filters-active-close"></button>
                    </li>
                  </ul>
                  <select class="js-select" id="select-sort" name="select">
                    <option value="Популярные">Популярные</option>
                    <option value="Ишо">Ишо</option>
                    <option value="Ещо">Ещо</option>
                    <option value="Ещё">Ещё</option>
                  </select>
                </div>
                <ul class="result__filters-list swiper-wrapper">
                  <li class="result__filters-item swiper-slide card-item">
                    <div class="card-item__wrap">
                      <a href="#" class="card-item__link">
                        <div class="card-item__photo-wrap">
                          <img src="img/card-img.png" alt="Фото товара" class="card-item__photo">
                          <div class="card-item__photo-button-wrap">
                            <span class="card-item__photo-button compare"></span>
                            <span class="card-item__photo-button favourite"></span>
                          </div>
                          <div class="card-item__photo-texts">
                            <p class="card-item__photo-text new">
                              Что то
                            </p>
                            <p class="card-item__photo-text discount">
                              -10%
                            </p>
                          </div>
                        </div>
                        <div class="card-item__description-wrap">
                          <p class="card-item__description-price">
                            61 290 &#8381; <span>62 490 &#8381;</span>
                          </p>
                          <p class="card-item__description-text">
                            The 20th century was very notable with its unparalleled
                          </p>
                          <div class="card-item__description-stock-wrap">
                            <p class="card-item__description-stock avaliable">
                              Склад
                            </p>
                            <p class="card-item__description-stock not-avaliable">
                              Магазин
                            </p>
                            <p class="card-item__description-stock">
                              Нет в наличии
                            </p>
                          </div>
                          <div class="not-clicked-rate-wrap">
                            <span class="active"></span>    
                            <span class="active"></span>  
                            <span class="active"></span>    
                            <span class="active"></span>
                            <span></span>
                            <p class="not-clicked-rate-karma">
                              10
                            </p>
                          </div>
                        </div>
                      </a>
                      <button class="card-item__button">
                        В корзину
                      </button>
                    </div>
                  </li>
                </ul>
                <div class="result__swiper-pagination swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    `;
    */
