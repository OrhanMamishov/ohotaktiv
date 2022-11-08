import "../imports";
import "../../styles/pages/catalog/style.scss";
import Swiper, { Pagination, Grid, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import wNumb from "wnumb";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { bodyScrollToggle } from "../functions/scrollBody";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");
  const serverName = "https://ohotaktiv.ru";
  const baseUrl = document.location.href;
  const catalogHighArray = await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/catalog/sections/menu.json",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return refreshCatalog(res);
    });

  function refreshCatalog(catalog) {
    catalog.sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1));
    // console.log(catalog);
    const catalogDownArray = [];
    catalog.forEach(async (el) => {
      await fetch(
        `https://ohotaktiv.ru/12dev/new-design/pages/catalog/sections/${el.file}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          return catalogDownArray.push(res);
        });
      if (catalog.length == catalogDownArray.length) {
        while (main.firstChild) {
          main.removeChild(main.firstChild);
        }
        const element = `
            <section class="catalog">
              <div class="catalog__wrap container">
                <nav class="navigation">
                  <ul class="navigation__list">
                    <li class="navigation__item">
                      <a href="#" class="navigation__link back"> Назад </a>
                    </li>
                    <li class="navigation__item">
                      <a href="#" class="navigation__link"> Главная </a>
                    </li>
                    <li class="navigation__item">
                      <a href="#" class="navigation__link"> Каталог </a>
                    </li>
                  </ul>
                </nav>
                <h1 class="catalog__title">Каталог</h1>
                <ul class="catalog__list">
                ${catalog
                  .map((list) => {
                    const filteredList = catalogDownArray.filter(
                      (cat) => cat.catalog[0].section_parent == list.ID
                    );
                    return `
                      <li class="catalog__item">
                        <div class="catalog__img-wrap">
                          <img
                            src="${serverName + list.picture}"
                            alt="${list.name}"
                            class="catalog__img"
                          />
                        </div>
                        <a href="${list.url.replace(
                          "/catalog",
                          ""
                        )}" class="catalog__link title"> ${list.name} </a>
                        ${filteredList[0].catalog.section_list
                          .map((el) => {
                            if (el.depth) {
                              el.depth.sort((a, b) =>
                                Number(a.sort) > Number(b.sort) ? 1 : -1
                              );
                              return `
                                <div class="catalog__accordion accordion-container">
                                  <div class="ac">
                                    <h2 class="ac-header">
                                      <a href="${el.page_url.replace(
                                        "/catalog",
                                        ""
                                      )}" class="catalog__link subtitle"> ${
                                el.name
                              } </a>
                                      <button type="button" class="ac-trigger"></button>
                                    </h2>
                                    <div class="ac-panel">
                                      <div class="ac-panel-wrap">
                                        ${el.depth
                                          .map((firstDepth) => {
                                            if (firstDepth.depth) {
                                              firstDepth.depth.sort((a, b) =>
                                                Number(a.sort) > Number(b.sort)
                                                  ? 1
                                                  : -1
                                              );
                                              return `
                                                <div class="catalog__accordion accordion-container">
                                                  <div class="ac">
                                                    <h2 class="ac-header">
                                                    <a href="${firstDepth.page_url.replace(
                                                      "/catalog",
                                                      ""
                                                    )}" class="catalog__link subtitle"> ${
                                                firstDepth.name
                                              } </a>
                                                      <button type="button" class="ac-trigger"></button>
                                                    </h2>
                                                    <div class="ac-panel">
                                                      <div class="ac-panel-wrap">
                                                        ${firstDepth.depth
                                                          .map(
                                                            (secondDepth) => {
                                                              if (
                                                                secondDepth.depth
                                                              ) {
                                                                secondDepth.depth.sort(
                                                                  (a, b) =>
                                                                    Number(
                                                                      a.sort
                                                                    ) >
                                                                    Number(
                                                                      b.sort
                                                                    )
                                                                      ? 1
                                                                      : -1
                                                                );
                                                                return `
                                                                  <div class="catalog__accordion accordion-container">
                                                                    <div class="ac">
                                                                      <h2 class="ac-header">
                                                                      <a href="${secondDepth.page_url.replace(
                                                                        "/catalog",
                                                                        ""
                                                                      )}" class="catalog__link subtitle"> ${
                                                                  secondDepth.name
                                                                } </a>
                                                                        <button type="button" class="ac-trigger"></button>
                                                                      </h2>
                                                                      <div class="ac-panel">
                                                                        <div class="ac-panel-wrap">
                                                                        ${secondDepth.depth
                                                                          .map(
                                                                            (
                                                                              thirdDepth
                                                                            ) => {
                                                                              return `
                                                                              <a href="${thirdDepth.page_url.replace(
                                                                                "/catalog",
                                                                                ""
                                                                              )}" class="catalog__link">${
                                                                                thirdDepth.name
                                                                              }</a>
                                                                            `;
                                                                            }
                                                                          )
                                                                          .join(
                                                                            ""
                                                                          )}
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                `;
                                                              } else {
                                                                return `
                                                                <a href="${secondDepth.page_url.replace(
                                                                  "/catalog",
                                                                  ""
                                                                )}" class="catalog__link">${
                                                                  secondDepth.name
                                                                }</a>
                                                              `;
                                                              }
                                                            }
                                                          )
                                                          .join("")}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              `;
                                            } else {
                                              return `
                                              <a href="${firstDepth.page_url.replace(
                                                "/catalog",
                                                ""
                                              )}" class="catalog__link">${
                                                firstDepth.name
                                              }</a>
                                            `;
                                            }
                                          })
                                          .join("")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              `;
                            } else {
                              return `
                                <a href="${el.page_url.replace(
                                  "/catalog",
                                  ""
                                )}" class="catalog__link">${el.name}</a>
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
              </section>
          `;
        main.insertAdjacentHTML("beforeend", element);
        const allAccordions = document.querySelectorAll(".accordion-container");
        allAccordions.forEach((accordion) => {
          new Accordion(accordion);
        });
        const catalogSection = document.querySelector("section.catalog");
        catalogSection.addEventListener("click", (e) => {
          if (e.target.classList.contains("catalog__link")) {
            e.preventDefault();
            const newUrl = baseUrl + e.target.getAttribute("href");
            history.pushState(null, null, newUrl);
            refreshThisCatalog(e.target.getAttribute("href"), catalog);
          }
        });
      }
    });
  }
  async function refreshThisCatalog(url, catalog) {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    const filteredCatalog = catalog.filter(
      (cat) => cat.url == `/catalog${url}`
    );
    const catalogDownArray = [];
    await fetch(
      `https://ohotaktiv.ru/12dev/new-design/pages/catalog/sections/${filteredCatalog[0].file}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        return catalogDownArray.push(res);
      });
    // console.log(url.split("/").length - 2);
    // console.log(catalogDownArray);
    const items = [];
    catalogDownArray[0].catalog.section_list.forEach((el) => {
      el.items.forEach((item) => items.push(item));
    });
    const element = `
      <section class="detail">
        <div class="detail__wrap container">
          <nav class="navigation">
            <ul class="navigation__list">
              <li class="navigation__item">
                <a href="#" class="navigation__link back"> Назад </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link"> Главная </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link"> Каталог </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link"> ${
                  filteredCatalog[0].name
                } </a>
              </li>
            </ul>
          </nav>
          <h1 class="detail__title"> ${filteredCatalog[0].name} </h1>
          <p class="detail__subtitle"> ${items.length} товаров</p>
          <div class="detail__columns">
            <div class="detail__filters">
              <div class="detail__filters-background"></div>
              <div class="detail__filters-wrap">
                <button class="detail__close"></button>
                <div class="detail__filter">
                  <p class="detail__filter-title">Выберите категорию</p>
                  <ul class="detail__filter-list category-list">
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-1"
                        name="category"
                      />
                      <label for="category-1">Газовое оборудование</label>
                      <ul class="detail__filter-list subcategory-list">
                        <li class="detail__filter-item">
                          <input
                            class="radio__input"
                            type="radio"
                            id="subcategory-1"
                            name="subcategory"
                          />
                          <label for="subcategory-1"
                            >Газовое оборудование</label
                          >
                        </li>
                        <li class="detail__filter-item">
                          <input
                            class="radio__input"
                            type="radio"
                            id="subcategory-2"
                            name="subcategory"
                          />
                          <label for="subcategory-2"
                            >Газовое оборудование</label
                          >
                        </li>
                        <li class="detail__filter-item">
                          <input
                            class="radio__input"
                            type="radio"
                            id="subcategory-3"
                            name="subcategory"
                          />
                          <label for="subcategory-3"
                            >Газовое оборудование</label
                          >
                        </li>
                      </ul>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-2"
                        name="category"
                      />
                      <label for="category-2">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-3"
                        name="category"
                      />
                      <label for="category-3">Комплектующие</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-4"
                        name="category"
                      />
                      <label for="category-4">Газовые лампы</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-5"
                        name="category"
                      />
                      <label for="category-5">Газовые обогреватели</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-6"
                        name="category"
                      />
                      <label for="category-6">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-7"
                        name="category"
                      />
                      <label for="category-7">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-8"
                        name="category"
                      />
                      <label for="category-8">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-9"
                        name="category"
                      />
                      <label for="category-9">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="category-10"
                        name="category"
                      />
                      <label for="category-10">Газовые баллоны</label>
                    </li>
                  </ul>
                </div>
                <div class="detail__filter">
                  <p class="detail__filter-title">Тут доп категория</p>
                  <ul class="detail__filter-list">
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-1"
                        name="addcategory"
                      />
                      <label for="addcategory-1">Газовое оборудование</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-2"
                        name="addcategory"
                      />
                      <label for="addcategory-2">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-3"
                        name="addcategory"
                      />
                      <label for="addcategory-3">Комплектующие</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-4"
                        name="addcategory"
                      />
                      <label for="addcategory-4">Газовые лампы</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-5"
                        name="addcategory"
                      />
                      <label for="addcategory-5">Газовые обогреватели</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-6"
                        name="addcategory"
                      />
                      <label for="addcategory-6">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-7"
                        name="addcategory"
                      />
                      <label for="addcategory-7">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-8"
                        name="addcategory"
                      />
                      <label for="addcategory-8">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-9"
                        name="addcategory"
                      />
                      <label for="addcategory-9">Газовые баллоны</label>
                    </li>
                    <li class="detail__filter-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="addcategory-10"
                        name="addcategory"
                      />
                      <label for="addcategory-10">Газовые баллоны</label>
                    </li>
                  </ul>
                </div>
                <div class="detail__filter">
                  <p class="detail__filter-title">Наличие в магазинах</p>
                  <select class="js-select" id="select-city" name="select">
                    <option value="">Выберите город</option>
                    <option value="Кострома">Кострома</option>
                    <option value="Москва">Москва</option>
                    <option value="Мурманск">Мурманск</option>
                    <option value="Набережные челны">Набережные челны</option>
                  </select>
                </div>
                <div class="detail__filter">
                  <p class="detail__filter-title">Цена</p>
                  <div class="detail__filter-input-wrap">
                    <p class="detail__filter-input-text">от</p>
                    <input type="text" class="detail__filter-input" />
                    <p class="detail__filter-input-text symbol">&#8381;</p>
                  </div>
                  <div class="detail__filter-input-wrap">
                    <p class="detail__filter-input-text">до</p>
                    <input type="text" class="detail__filter-input" />
                    <p class="detail__filter-input-text symbol">&#8381;</p>
                  </div>
                </div>
                <div class="detail__filter">
                  <p class="detail__filter-title">Бренды</p>
                  <input
                    type="text"
                    class="detail__filter-input"
                    placeholder="Поиск значения"
                  />
                  <ul class="detail__filter-list">
                    <li class="detail__filter-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input
                          type="checkbox"
                          class="checkbox visually-hidden"
                        />
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="detail__filter-item">
                      <label class="checkbox__label">
                        Benelli
                        <input
                          type="checkbox"
                          class="checkbox visually-hidden"
                        />
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="detail__filter-item">
                      <label class="checkbox__label">
                        ВПО "МОЛОТ"
                        <input
                          type="checkbox"
                          class="checkbox visually-hidden"
                        />
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="detail__filter-item">
                      <label class="checkbox__label">
                        Retay
                        <input
                          type="checkbox"
                          class="checkbox visually-hidden"
                        />
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="detail__filter-item">
                      <label class="checkbox__label">
                        Webley & Scott
                        <input
                          type="checkbox"
                          class="checkbox visually-hidden"
                        />
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="detail__filter-item">
                      <label class="checkbox__label">
                        Benelli
                        <input
                          type="checkbox"
                          class="checkbox visually-hidden"
                        />
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="detail__filter-item">
                      <label class="checkbox__label">
                        ВПО "МОЛОТ"
                        <input
                          type="checkbox"
                          class="checkbox visually-hidden"
                        />
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                    <li class="detail__filter-item">
                      <label class="checkbox__label">
                        Retay
                        <input
                          type="checkbox"
                          class="checkbox visually-hidden"
                        />
                        <span class="checkbox__span"></span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="detail__filter accordion-container">
                  <div class="ac">
                    <h2 class="ac-header">
                      <button type="button" class="ac-trigger">
                        Материал ствола
                      </button>
                    </h2>
                    <div class="ac-panel">
                      <div class="ac-panel-wrap">
                        <input
                          type="text"
                          class="detail__filter-input"
                          placeholder="Поиск значения"
                        />
                        <ul class="detail__filter-list">
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Webley & Scott
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Benelli
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              ВПО "МОЛОТ"
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Retay
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Webley & Scott
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Benelli
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              ВПО "МОЛОТ"
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Retay
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="detail__filter accordion-container">
                  <div class="ac">
                    <h2 class="ac-header">
                      <button type="button" class="ac-trigger">
                        Вид сверловки
                      </button>
                    </h2>
                    <div class="ac-panel">
                      <div class="ac-panel-wrap">
                        <input
                          type="text"
                          class="detail__filter-input"
                          placeholder="Поиск значения"
                        />
                        <ul class="detail__filter-list">
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Webley & Scott
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Benelli
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              ВПО "МОЛОТ"
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Retay
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Webley & Scott
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Benelli
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              ВПО "МОЛОТ"
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              Retay
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="detail__filter-button">Сбросить</button>
                <div class="detail__filter-contact">
                  <p class="detail__filter-contact-text">
                    Что улучшить в фильтрах?
                  </p>
                  <button class="detail__filter-contact-button">
                    Сообщите нам
                  </button>
                </div>
              </div>
            </div>
          

          <div class="detail__cards">
            <div class="detail__cards-filters">
              <button class="detail__cards-filter-open"></button>
              <div class="detail__cards-filter">
                <p class="detail__cards-text">Газовое оборудование</p>
                <button class="detail__cards-filter-close"></button>
              </div>
              <div class="detail__cards-filter">
                <p class="detail__cards-text">Газовые баллоны</p>
                <button class="detail__cards-filter-close"></button>
              </div>
            </div>

            <div class="swiper swiper-cards">
              <ul class="detail__cards-list swiper-wrapper cards-list">
                ${items
                  .map((item) => {
                    return `
                      <li class="detail__cards-item swiper-slide card-item">
                      <div class="card-item__wrap">
                        <a href="../../card/?id=${
                          item.ID
                        }" class="card-item__link">
                          <div class="card-item__photo-wrap">
                            <img
                              src="#"
                              alt="${item.name}"
                              class="card-item__photo"
                            />
                            <div class="card-item__photo-button-wrap">
                              <span
                                class="card-item__photo-button compare"
                              ></span>
                              <span
                                class="card-item__photo-button favourite"
                              ></span>
                            </div>
                            <div class="card-item__photo-texts">
                              <p class="card-item__photo-text new">Что то</p>
                              <p class="card-item__photo-text discount">-10%</p>
                            </div>
                          </div>
                          <div class="card-item__description-wrap">
                            <p class="card-item__description-price">
                              ${generatePrice(item)}
                            </p>
                            <p class="card-item__description-text">
                              ${item.name}
                            </p>
                            <div class="not-clicked-rate-wrap">
                              <span class="active"></span>
                              <span class="active"></span>
                              <span class="active"></span>
                              <span class="active"></span>
                              <span></span>
                              <p class="not-clicked-rate-karma">10</p>
                            </div>
                          </div>
                        </a>
                        <button id="${
                          item.ID
                        }" class="card-item__button">В корзину</button>
                      </div>
                    </li>
                  `;
                  })
                  .join("")}
              </ul>
              <div
                class="detail__cards-swiper-pagination swiper-pagination"
              ></div>
          </div>

          </div>


        
        </div>
      </section>
    `;
    main.insertAdjacentHTML("beforeend", element);
    const allSelects = document.querySelectorAll(".js-select");
    allSelects.forEach((select) => {
      new Choices(select, {
        searchEnabled: false,
        itemSelectText: "",
        allowHTML: true,
      });
    });
    const swiperCards = new Swiper(".swiper-cards", {
      modules: [Pagination, Grid],
      spaceBetween: 10,
      slidesPerView: 4,
      slidesPerGroup: 4,
      loopFillGroupWithBlank: true,
      grid: {
        rows: 3,
        fill: "row",
      },
      pagination: {
        el: ".detail__cards-swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 5,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      },
      breakpoints: {
        1561: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          grid: {
            rows: 3,
            fill: "row",
          },
        },
        1023: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          grid: {
            rows: 3,
            fill: "row",
          },
        },
        600: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 30,
          grid: {
            rows: 3,
            fill: "row",
          },
        },
        320: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 10,
          grid: {
            rows: 2,
            fill: "row",
          },
        },
      },
    });
    const swiperRecommended = new Swiper(".swiper-recommended", {
      spaceBetween: 16,
      modules: [Navigation],
      allowTouchMove: false,
      navigation: {
        nextEl: ".recommended__swiper-button-next",
        prevEl: ".recommended__swiper-button-prev",
      },

      breakpoints: {
        1559: {
          slidesPerView: 5,
        },
        1366: {
          slidesPerView: 4,
        },
        1023: {
          slidesPerView: 3,
        },
        767: {
          spaceBetween: 20,
          slidesPerView: 3,
          allowTouchMove: true,
        },
        600: {
          spaceBetween: 20,
          slidesPerView: 3,
          allowTouchMove: true,
        },
        320: {
          spaceBetween: 25,
          slidesPerView: 2,
          allowTouchMove: true,
        },
      },
    });
    const swiperViewed = new Swiper(".swiper-viewed", {
      spaceBetween: 16,
      modules: [Navigation],
      allowTouchMove: false,
      navigation: {
        nextEl: ".viewed__swiper-button-next",
        prevEl: ".viewed__swiper-button-prev",
      },

      breakpoints: {
        1559: {
          slidesPerView: 5,
        },
        1366: {
          slidesPerView: 4,
        },
        1023: {
          slidesPerView: 3,
        },
        767: {
          spaceBetween: 20,
          slidesPerView: 3,
          allowTouchMove: true,
        },
        600: {
          spaceBetween: 20,
          slidesPerView: 3,
          allowTouchMove: true,
        },
        320: {
          spaceBetween: 25,
          slidesPerView: 2,
          allowTouchMove: true,
        },
      },
    });
    const filterWrap = document.querySelector(".detail__filters");
    const filter = document.querySelector(".detail__filters-wrap");
    const detailSection = document.querySelector(".detail");
    detailSection.addEventListener("click", (e) => {
      if (e.target.className == "detail__cards-filter-open") {
        bodyScrollToggle();
        filterWrap.style.visibility = "visible";
        filterWrap.style.opacity = 1;
        filter.style.transform = "translateX(0)";
      }
      if (
        e.target.className == "detail__close" ||
        e.target.className == "detail__filters-background"
      ) {
        bodyScrollToggle();
        filterWrap.style.opacity = 0;
        filter.style.transform = "translateX(-100%)";
        setTimeout(() => {
          filterWrap.style.visibility = "hidden";
        }, 200);
      }
    });
  }
});

function generatePrice(item) {
  const price = item["PRICE"];
  if (price) {
    if (price[13]) {
      return `${numberWithSpaces(price[13])} &#8381; <span>${numberWithSpaces(
        price[1]
      )} &#8381;</span>`;
    } else {
      if (price[5]) {
        return `${numberWithSpaces(price[5])} &#8381; <span>${numberWithSpaces(
          price[1]
        )} &#8381;</span>`;
      } else {
        return numberWithSpaces(price[1]);
      }
    }
  } else {
    return "Без цены";
  }
}
