import "../imports";
import "../../styles/pages/catalogview/style.scss";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import Swiper, { Pagination, Grid, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import wNumb from "wnumb";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { bodyScrollToggle } from "../functions/scrollBody";
import lozad from "lozad";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");
  const serverName = "https://ohotaktiv.ru";
  const baseUrl = document.location.href;
  const urlCatalog = "/full_remington/".split("/");
  const mainLevel = urlCatalog[1]; // главный каталог
  const level = urlCatalog.length - 2; // уровень этого каталога
  const fetchFromBase = await fetch(
    `https://ohotaktiv.ru/12dev/new-design/pages/catalog/sections/${mainLevel}.json`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      const thisCatalog = res.catalog.section_list.filter((el) =>
        el.page_url.includes(urlCatalog[2])
      );
      if (urlCatalog.length > 3) {
        for (let i = 3; i <= level; i++) {
          thisCatalog[0].depth.forEach((depth) => {
            if (depth.page_url.includes(urlCatalog[i])) {
              thisCatalog.push(depth);
              thisCatalog.shift();
            }
          });
        }
        refreshThisCatalog(thisCatalog[0]);
      } else {
        refreshThisCatalog(thisCatalog);
      }
    });

  async function refreshThisCatalog(catalog) {
    console.log(catalog);
    let catalogName = catalog.name;
    const items = [];
    if (catalog.length) {
      const catalogHighArray = await fetch(
        "https://ohotaktiv.ru/12dev/new-design/pages/catalog/sections/menu.json",
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          const catalogHigh = res.filter(
            (el) => el.file == `${mainLevel}.json`
          );
          catalogName = catalogHigh[0].name;
        });
      catalog.forEach((cat) => {
        if (cat.items) {
          cat.items.forEach((item) => items.push(item));
        }
        if (cat.depth) {
          cat.depth.forEach((firstDepth) => {
            if (firstDepth.items) {
              firstDepth.items.forEach((item) => items.push(item));
            }
            if (firstDepth.depth) {
              firstDepth.depth.forEach((secondDepth) => {
                if (secondDepth.items) {
                  secondDepth.items.forEach((item) => items.push(item));
                }
                if (secondDepth.depth) {
                  secondDepth.depth.forEach((thirdDepth) => {
                    if (thirdDepth.depth) {
                      thirdDepth.depth.forEach((fourthDepth) => {
                        if (fourthDepth.items) {
                          fourthDepth.items.forEach((item) => items.push(item));
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      catalog.items.forEach((item) => items.push(item));
      if (catalog.depth) {
        catalog.depth.forEach((firstDepth) => {
          if (firstDepth.items) {
            firstDepth.items.forEach((item) => items.push(item));
          }
          if (firstDepth.depth) {
            firstDepth.depth.forEach((secondDepth) => {
              if (secondDepth.items) {
                secondDepth.items.forEach((item) => items.push(item));
              }
              if (secondDepth.depth) {
                secondDepth.depth.forEach((thirdDepth) => {
                  if (thirdDepth.items) {
                    thirdDepth.items.forEach((item) => items.push(item));
                  }
                });
              }
            });
          }
        });
      }
    }
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    const element = `
      <section class="detail">
        <div class="detail__wrap container">
          <nav class="navigation">
            <ul class="navigation__list">
              <li class="navigation__item">
                <a href="#" class="navigation__link back"> Назад </a>
              </li>
              <li class="navigation__item">
                <a href="../index/" class="navigation__link"> Главная </a>
              </li>
              <li class="navigation__item">
                <a href="../catalog/" class="navigation__link"> Каталог </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link"> ${catalogName} </a>
              </li>
            </ul>
          </nav>
          <h1 class="detail__title"> ${catalogName} </h1>
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

            <div class="detail__cards-list-wrap">
              <ul class="detail__cards-list">
                ${itemsForPage(1, items)}
              </ul>
              <div class="pagination">
                <ul class="pagination-list">
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    main.insertAdjacentHTML("beforeend", element);
    const observer = lozad();
    observer.observe();
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
    changePagination(Math.floor(items.length / 12), 1);
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
      if (e.target.className == "prev") {
        let active = --document.querySelector(".numb.active").textContent;
        console.log(active);
        itemsForPage(active, items, true);
        changePagination(
          Math.floor(items.length / 12),
          Number(e.target.getAttribute("data-prev-page"))
        );
      }
      if (e.target.className == "next") {
        let active = ++document.querySelector(".numb.active").textContent;
        itemsForPage(active, items, true);
        changePagination(
          Math.floor(items.length / 12),
          Number(e.target.getAttribute("data-next-page"))
        );
      }
      if (e.target.classList.contains("numb")) {
        itemsForPage(e.target.textContent, items, true);
        if (e.target.getAttribute("data-first")) {
          changePagination(Math.floor(items.length / 12), Number(1));
          return;
        }
        if (e.target.getAttribute("data-last")) {
          changePagination(
            Math.floor(items.length / 12),
            Number(e.target.getAttribute("data-total-pages"))
          );
          return;
        }
        changePagination(
          Math.floor(items.length / 12),
          Number(e.target.getAttribute("data-page-length"))
        );
      }
    });
  }
  function generatePrice(item) {
    const price = item["PRICE"];
    if (price) {
      if (price[13]) {
        return `${numberWithSpaces(price[13])} &#8381; <span>${numberWithSpaces(
          price[1]
        )} &#8381;</span>`;
      } else {
        if (price[5]) {
          return `${numberWithSpaces(
            price[5]
          )} &#8381; <span>${numberWithSpaces(price[1])} &#8381;</span>`;
        } else {
          return numberWithSpaces(price[1]);
        }
      }
    } else {
      return "Нет в наличии";
    }
  }
  function itemsForPage(buttonNumber, arr, clicked) {
    const itemsOnPage = 12;
    const startFrom = buttonNumber * itemsOnPage;
    const data = arr.slice(startFrom, startFrom + itemsOnPage);
    let element = ``;
    data.forEach((item) => {
      element += `
      <li class="detail__cards-item card-item">
        <div class="card-item__wrap">
          <a href="../../card/?id=${item.ID}" class="card-item__link">
            <div class="card-item__photo-wrap">
              <img
                src="${
                  item.properties.Картинки
                    ? item.properties.Картинки[0]
                      ? serverName + item.properties.Картинки[0]
                      : serverName +
                        `/local/templates/ohota2021/img/no_photo.png`
                    : serverName + `/local/templates/ohota2021/img/no_photo.png`
                }"
                alt="${item.name}"
                class="card-item__photo lozad"
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
          <button id="${item.ID}" class="card-item__button">В корзину</button>
        </div>
      </li>
    `;
    });
    if (clicked) {
      const detailList = document.querySelector(".detail__cards-list");
      return (detailList.innerHTML = element);
    } else {
      return element;
    }
  }
  function changePagination(totalPages, page) {
    const paginationList = document.querySelector(".pagination-list");
    let liTag = "";
    let activeLi;
    let beforePages = page - 1;
    let afterPages = page + 1;
    if (page > 1) {
      liTag += `<li class="prev" data-prev-page="${page - 1}">Prev</li>`;
    }
    if (page > 2) {
      liTag += `<li class="numb" data-first="true">1</li>`;
      if (page > 3) {
        liTag += ` <li class="dots">...</li>`;
      }
    }
    for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
      if (pageLength > totalPages) {
        continue;
      }
      if (pageLength == 0) {
        pageLength = pageLength + 1;
      }
      if (page == pageLength) {
        activeLi = "active";
      } else {
        activeLi = "";
      }
      liTag += `<li class="numb ${activeLi}" data-page-length="${pageLength}">${pageLength}</li>`;
    }

    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        liTag += ` <li class="dots">...</li>`;
      }
      liTag += `<li class="numb" data-last="true"  data-total-pages="${totalPages}">${totalPages}</li>`;
    }

    if (page < totalPages) {
      liTag += `<li class="next" data-next-page="${page + 1}">Next</li>`;
    }
    paginationList.innerHTML = liTag;
  }
});
