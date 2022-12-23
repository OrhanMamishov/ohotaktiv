import "../imports";
import "../../styles/pages/new/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { bodyScrollToggle } from "../functions/scrollBody";
import lozad from "lozad";
import { generateCard } from "../functions/generateCard";
import { getUserData } from "../functions/getUserData";

document.addEventListener("DOMContentLoaded", async () => {
  const userInfo = await getUserData();
  let items = [];
  let itemsOnPage = [];
  const main = document.querySelector("main");
  await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/new/new.php?read=allnew"
  )
    .then((res) => res.json())
    .then((res) => {
      items = res;
      return refreshThisCatalog(items);
    });

  async function refreshThisCatalog(catalog) {
    console.log(catalog);
    itemsOnPage = items;
    const element = `
        <section class="detail">
          <div class="detail__wrap container">
            <nav class="navigation">
              <ul class="navigation__list">
                <li class="navigation__item">
                  <a href="../index/" class="navigation__link"> Главная </a>
                </li>
                <li class="navigation__item">
                  <a href="../catalog/" class="navigation__link"> Каталог </a>
                </li>
                <li class="navigation__item">
                  <a href="#" class="navigation__link"> Новинки </a>
                </li>
              </ul>
            </nav>
            <h1 class="detail__title title-seo"> Новинки <span>${
              itemsOnPage.length
            }</span> </h1>
            <button class="detail__cards-filter-open">Фильтры</button>
            <div class="detail__columns">
              <div class="detail__filters">
                <div class="detail__filters-background"></div>
                <div class="detail__filters-wrap">
                  <button class="detail__close"></button>
                  ${
                    catalog.depth || catalog.length
                      ? `
                  <div class="detail__filter">
                  <p class="detail__filter-title">Выберите категорию</p>
                  <ul class="detail__filter-list category-list">
                    ${
                      catalog.depth
                        ? catalog.depth
                            .map((section) => {
                              return `
                            <li class="detail__filter-item">
                              <input
                                class="radio__input"
                                type="radio"
                                id="${section.section_this}"
                                name="category"
                              />
                              <label for="${section.section_this}">${
                                section.name
                              }</label>
                              ${
                                section.depth
                                  ? `<ul class="detail__filter-list subcategory-list">
                                    ${section.depth
                                      .map((firstDepth) => {
                                        return `
                                        <li class="detail__filter-item">
                                          <input
                                            class="radio__input"
                                            type="radio"
                                            id="${firstDepth.section_this}"
                                            name="category"
                                          />
                                          <label for="${
                                            firstDepth.section_this
                                          }">${firstDepth.name}</label>
                                          ${
                                            firstDepth.depth
                                              ? `
                                            <ul class="detail__filter-list subcategory-list">
                                              ${firstDepth.depth
                                                .map((secondDepth) => {
                                                  return `
                                                  <li class="detail__filter-item">
                                                    <input
                                                      class="radio__input"
                                                      type="radio"
                                                      id="${
                                                        secondDepth.section_this
                                                      }"
                                                      name="category"
                                                    />
                                                    <label for="${
                                                      secondDepth.section_this
                                                    }">${
                                                    secondDepth.name
                                                  }</label>
                                                    ${
                                                      secondDepth.depth
                                                        ? `
                                                    <ul class="detail__filter-list subcategory-list">
                                                      ${secondDepth.depth
                                                        .map((thirdDepth) => {
                                                          return `
                                                          <li class="detail__filter-item">
                                                            <input
                                                              class="radio__input"
                                                              type="radio"
                                                              id="${thirdDepth.section_this}"
                                                              name="category"
                                                            />
                                                            <label for="${thirdDepth.section_this}">${thirdDepth.name}</label>
                                                          </li>
                                                        `;
                                                        })
                                                        .join("")}
                                                    </ul>
                                                    `
                                                        : ``
                                                    }
                                                  </li>
                                                `;
                                                })
                                                .join("")}
                                            </ul>
                                          `
                                              : ``
                                          }
                                      </li>
                                      `;
                                      })
                                      .join("")}
                                  </ul>`
                                  : ``
                              }
                            </li>
                          `;
                            })
                            .join("")
                        : catalog.length
                        ? catalog
                            .map((section) => {
                              return `
                                <li class="detail__filter-item">
                                  <input
                                    class="radio__input"
                                    type="radio"
                                    id="${section.section_this}"
                                    name="category"
                                  />
                                  <label for="${section.section_this}">${
                                section.name
                              }</label>
                                  ${
                                    section.depth
                                      ? `<ul class="detail__filter-list subcategory-list">
                                        ${section.depth
                                          .map((firstDepth) => {
                                            return `
                                            <li class="detail__filter-item">
                                              <input
                                                class="radio__input"
                                                type="radio"
                                                id="${firstDepth.section_this}"
                                                name="category"
                                              />
                                              <label for="${
                                                firstDepth.section_this
                                              }">${firstDepth.name}</label>
                                              ${
                                                firstDepth.depth
                                                  ? `
                                                <ul class="detail__filter-list subcategory-list">
                                                  ${firstDepth.depth
                                                    .map((secondDepth) => {
                                                      return `
                                                      <li class="detail__filter-item">
                                                        <input
                                                          class="radio__input"
                                                          type="radio"
                                                          id="${
                                                            secondDepth.section_this
                                                          }"
                                                          name="category"
                                                        />
                                                        <label for="${
                                                          secondDepth.section_this
                                                        }">${
                                                        secondDepth.name
                                                      }</label>
                                                        ${
                                                          secondDepth.depth
                                                            ? `
                                                        <ul class="detail__filter-list subcategory-list">
                                                          ${secondDepth.depth
                                                            .map(
                                                              (thirdDepth) => {
                                                                return `
                                                              <li class="detail__filter-item">
                                                                <input
                                                                  class="radio__input"
                                                                  type="radio"
                                                                  id="${thirdDepth.section_this}"
                                                                  name="category"
                                                                />
                                                                <label for="${thirdDepth.section_this}">${thirdDepth.name}</label>
                                                              </li>
                                                            `;
                                                              }
                                                            )
                                                            .join("")}
                                                        </ul>
                                                        `
                                                            : ``
                                                        }
                                                      </li>
                                                    `;
                                                    })
                                                    .join("")}
                                                </ul>
                                              `
                                                  : ``
                                              }
                                          </li>
                                          `;
                                          })
                                          .join("")}
                                      </ul>`
                                      : ``
                                  }
                                </li>
                              `;
                            })
                            .join("")
                        : []
                    }
                  </ul>
                </div>
                  `
                      : ``
                  }
                  <div class="detail__filter-all">
                    <div class="detail__filter">
                      <p class="detail__filter-title">Цена</p>
                      <div class="detail__filter-input-wrap">
                        <p class="detail__filter-input-text">от</p>
                        <input type="text" class="detail__filter-input" id="price-from" maxlength="8"/>
                        <p class="detail__filter-input-text symbol">&#8381;</p>
                      </div>
                      <div class="detail__filter-input-wrap">
                        <p class="detail__filter-input-text">до</p>
                        <input type="text" class="detail__filter-input" id="price-to" maxlength="8"/>
                        <p class="detail__filter-input-text symbol">&#8381;</p>
                      </div>
                    </div>
                  </div>
                  <button class="detail__filter-button">Сбросить</button>
                </div>
              </div>
            <div class="detail__cards">
              <div class="detail__cards-filters">
              </div>
              <div class="detail__cards-list-wrap">
                <ul class="detail__cards-list">
                  ${itemsForPage(itemsOnPage)}
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.insertAdjacentHTML("beforeend", element);
    const observer = lozad();
    observer.observe();
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
      if (e.target.className == "radio__input") {
        itemsFromRadio(items, e.target.getAttribute("data-name"));
      }
      if (e.target.className == "detail__filter-button") {
        refreshThisCatalog(items);
      }
    });
    const priceFrom = document.getElementById("price-from");
    const priceTo = document.getElementById("price-to");
    const pricesInputs = [priceFrom, priceTo];
    let timeoutForInputs;
    pricesInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        e.currentTarget.value = numberWithSpaces(
          e.currentTarget.value.replace(/\D/g, "")
        );
        clearTimeout(timeoutForInputs);
        timeoutForInputs = setTimeout(() => {
          filterGoodsOnPage(items);
        }, 1000);
      });
    });
  }
  function itemsForPage(arr, clicked) {
    let element = ``;
    if (itemsOnPage.length == 0) {
      element += `<li class="goods-not-found__wrap">
          <p class="goods-not-found__text">
            По заданным фильтрам товары не найдены!<br>Попробуйте изменить фильтр или сбросить его.
          </p>
      </li>`;
    } else {
      itemsOnPage.forEach((item) => {
        element += generateCard(item, ["favourite"], true, userInfo);
      });
    }
    if (clicked) {
      const detailList = document.querySelector(".detail__cards-list");
      const detailTitle = document.querySelector(".detail__title span");
      detailTitle.textContent = `${arr.length}`;
      return (detailList.innerHTML = element);
    } else {
      return element;
    }
  }
  function filterGoodsOnPage(items) {
    const priceFrom = document.getElementById("price-from").value
      ? Number(document.getElementById("price-from").value.replace(/\s/g, ""))
      : 0;
    const priceTo = document.getElementById("price-to").value
      ? Number(document.getElementById("price-to").value.replace(/\s/g, ""))
      : 3000000;
    itemsOnPage = items.filter(
      (el) =>
        el.properties.FILTER_PRICE.VALUE >= priceFrom &&
        el.properties.FILTER_PRICE.VALUE <= priceTo
    );
    itemsForPage(itemsOnPage, true);
  }
  function itemsFromRadio(items, name) {
    itemsForPage(itemsOnPage, true);
  }
});
