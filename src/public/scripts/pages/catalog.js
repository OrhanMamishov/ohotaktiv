import "../imports";
import "../../styles/pages/catalog/style.scss";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { bodyScrollToggle } from "../functions/scrollBody";
import lozad from "lozad";
import numWord from "../functions/numWord";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import ucFirst from "../functions/ucFirst";
import { generateCard } from "../functions/generateCard";
import { getUserData } from "../functions/getUserData";

document.addEventListener("DOMContentLoaded", async () => {
  const userInfo = await getUserData();
  const main = document.querySelector("main");
  const serverName = "https://ohotaktiv.ru";
  let items = [];
  let itemsOnPage = [];
  const catalogHighArray = await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/catalog/gentwo/sections/menu.json",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
  if (document.location.search) {
    refreshThisCatalog(catalogHighArray);
  } else {
    refreshCatalog(catalogHighArray);
  }
  function refreshCatalog(catalog) {
    catalog.sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1));
    const element = `
      <section class="catalog">
        <div class="catalog__wrap container">
          <nav class="navigation">
            <ul class="navigation__list">
              <li class="navigation__item">
                <a href="../index/" class="navigation__link"> Главная </a>
              </li>
              <li class="navigation__item">
                <a href="../catalog/" class="navigation__link"> Каталог </a>
              </li>
            </ul>
          </nav>
          <h1 class="catalog__title">Каталог</h1>
          <ul class="catalog__list">
          ${catalog
            .map((list) => {
              if (list.name == "other") return;
              return `
                <li class="catalog__item">
                  <div class="catalog__img-wrap">
                    <img
                      src="${serverName}${
                list.picture
                  ? list.picture
                  : `/local/templates/ohota2021/img/no_photo.png`
              }"
                      alt="${list.name}"
                      class="catalog__img"
                    />
                  </div>
                  <a href="../catalog/?section=${
                    list.code
                  }" class="catalog__link title"> ${list.name} </a>
                  ${
                    list.depth
                      ? `
                    <ul class="catalog__depths-list">
                      ${list.depth
                        .map((el, index) => {
                          return `
                            <li class="catalog__depths-item ${
                              index > 9 ? "none" : ""
                            }">
                              <a href="../catalog/?section=${
                                el.code
                              }" class="catalog__depths-link"> ${el.name} </a>
                            </li>
                            ${
                              index == 9 && list.depth[10]
                                ? `<li class="catalog__depths-item"><button class="catalog__more">Еще категории</button></li>`
                                : ``
                            }
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
          </div>
        </section>
      `;
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.insertAdjacentHTML("beforeend", element);
    const allAccordions = document.querySelectorAll(".accordion-container");
    allAccordions.forEach((accordion) => {
      new Accordion(accordion);
    });
    const catalogElement = document.querySelector("section.catalog");
    catalogElement.addEventListener("click", (e) => {
      if (e.target.className == "catalog__more") {
        for (let item of e.target.parentElement.parentElement.children) {
          if (item.classList.contains("none")) {
            item.classList.remove("none");
          }
        }
        e.target.parentElement.remove();
      }
    });
  }
  function refreshThisCatalog(thisCatalog) {
    window.addEventListener("popstate", () => {
      // console.log(event);
      window.location = document.referrer;
      // const url = new URL(document.location);
      // url.searchParams.forEach((value, index) => {
      //   if (index !== "section") {
      //     const values = value.split("%");
      //     values.forEach((el) => {
      //       const checkbox = document.querySelector(
      //         `.checkbox[data-filter="${index.toUpperCase()}"][value="${el}"]`
      //       );
      //       checkbox.click();
      //     });
      //   }
      // });
    });
    const urlSearch = document.location.search.split("?")[1];
    const searchParams = urlSearch.split("&");
    const thisSection = searchParams[0].split("section=")[1];
    const breadcrumbs = [];
    thisCatalog.sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1));
    let catalog;
    thisCatalog.forEach((firstDepth) => {
      if (firstDepth.code !== thisSection) {
        if (firstDepth.depth) {
          firstDepth.depth.forEach((secondDepth) => {
            if (secondDepth.code !== thisSection) {
              if (secondDepth.depth) {
                secondDepth.depth.forEach((thirdDepth) => {
                  if (thirdDepth.CODE !== thisSection) {
                    if (thirdDepth.depth) {
                      thirdDepth.depth.forEach((fourthDepth) => {
                        if (fourthDepth.CODE == thisSection) {
                          breadcrumbs.push(
                            { name: firstDepth.name, code: firstDepth.code },
                            {
                              name: secondDepth.name,
                              code: secondDepth.code,
                            },
                            { name: thirdDepth.name, code: thirdDepth.CODE },
                            { name: fourthDepth.name, code: fourthDepth.CODE }
                          );
                          catalog = fourthDepth;
                        }
                      });
                    }
                  } else {
                    breadcrumbs.push(
                      { name: firstDepth.name, code: firstDepth.code },
                      { name: secondDepth.name, code: secondDepth.code },
                      { name: thirdDepth.name, code: thirdDepth.CODE }
                    );
                    catalog = thirdDepth;
                  }
                });
              }
            } else {
              breadcrumbs.push(
                { name: firstDepth.name, code: firstDepth.code },
                { name: secondDepth.name, code: secondDepth.code }
              );
              catalog = secondDepth;
            }
          });
        }
      } else {
        breadcrumbs.push({ name: firstDepth.name, code: firstDepth.code });
        catalog = firstDepth;
      }
    });
    fetchCatalog(catalog);
    async function fetchCatalog(catalog, clicked) {
      await fetch(
        `https://ohotaktiv.ru/12dev/new-design/pages/catalog/gentwo/sections/${thisSection}.json`
      )
        .then((res) => res.json())
        .then((res) => {
          res.sort((item) => (item.PREVIEW_PICTURE ? -1 : 1));
          items = res;
          itemsOnPage = res;
        });
      // ТУТ СОРТИРОВКА АЙТЕМОВ!
      console.log(items);
      const element = `
         <section class="detail">
         ${
           catalog.code == "liquidation"
             ? `
          <div class="liquidation">
            <div class="liquidation__banner-wrap container">
              <p class="liquidation__banner-title">
                Ликвидация товаров
              </p>
              <p class="liquidation__banner-subtitle">
                Скидки до 50%!
              </p>
              <p class="liquidation__banner-text">
                Успей приобрести! <br> Количество товаров ограничено!
              </p>
            </div>
          </div>
         `
             : ``
         }

           <div class="detail__wrap container" id="detailSection">
             <nav class="navigation">
               <ul class="navigation__list">
                 <li class="navigation__item">
                   <a href="../index/" class="navigation__link"> Главная </a>
                 </li>
                 <li class="navigation__item">
                   <a href="../catalog/" class="navigation__link"> Каталог </a>
                 </li>
                 ${breadcrumbs
                   .map((breadcrumb) => {
                     return `
                      <li class="navigation__item">
                        <a href="../catalog/?section=${breadcrumb.code}" class="navigation__link"> ${breadcrumb.name} </a>
                      </li>
                    `;
                   })
                   .join("")}
  
               </ul>
             </nav>
             <h1 class="detail__title title-seo"> ${catalog.name} </h1>
             <div class="detail__subtitle-wrap">
               <p class="detail__subtitle"> ${items.length} товаров</p>
              </div>
              <button class="detail__cards-filter-open">Фильтры</button>
             <div class="detail__columns">
               <div class="detail__filters">
                 <div class="detail__filters-background"></div>
                 <div class="detail__filters-wrap">
                   <button class="detail__close"></button>
                   ${
                     catalog.depth
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
                                          id="${
                                            section.CODE
                                              ? section.CODE
                                              : section.code
                                          }"
                                          name="category"
                                        />
                                        <label for="${
                                          section.CODE
                                            ? section.CODE
                                            : section.code
                                        }">${section.name}</label>
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
                                                      id="${
                                                        firstDepth.CODE
                                                          ? firstDepth.CODE
                                                          : firstDepth.code
                                                      }"
                                                      name="category"
                                                    />
                                                    <label for="${
                                                      firstDepth.CODE
                                                        ? firstDepth.CODE
                                                        : firstDepth.code
                                                    }">${
                                                    firstDepth.name
                                                  }</label>
                                                    ${
                                                      firstDepth.depth
                                                        ? `
                                                      <ul class="detail__filter-list subcategory-list">
                                                        ${firstDepth.depth
                                                          .map(
                                                            (secondDepth) => {
                                                              return `
                                                            <li class="detail__filter-item">
                                                              <input
                                                                class="radio__input"
                                                                type="radio"
                                                                id="${
                                                                  secondDepth.CODE
                                                                    ? secondDepth.CODE
                                                                    : secondDepth.code
                                                                }"
                                                                name="category"
                                                              />
                                                              <label for="${
                                                                secondDepth.CODE
                                                                  ? secondDepth.CODE
                                                                  : secondDepth.code
                                                              }">${
                                                                secondDepth.name
                                                              }</label>
                                                              ${
                                                                secondDepth.depth
                                                                  ? `
                                                              <ul class="detail__filter-list subcategory-list">
                                                                ${secondDepth.depth
                                                                  .map(
                                                                    (
                                                                      thirdDepth
                                                                    ) => {
                                                                      return `
                                                                    <li class="detail__filter-item">
                                                                      <input
                                                                        class="radio__input"
                                                                        type="radio"
                                                                        id="${
                                                                          thirdDepth.CODE
                                                                            ? thirdDepth.CODE
                                                                            : thirdDepth.code
                                                                        }"
                                                                        name="category"
                                                                      />
                                                                      <label for="${
                                                                        thirdDepth.CODE
                                                                          ? thirdDepth.CODE
                                                                          : thirdDepth.code
                                                                      }">${
                                                                        thirdDepth.name
                                                                      }</label>
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
                   ${filtersForPage(items)}
                  <button class="detail__filter-button">Сбросить</button>
                </div>
              </div>
            <div class="detail__cards">
              <div class="detail__cards-filters">
              </div>
              <div class="detail__cards-list-wrap">
                <ul class="detail__cards-list">
                  ${itemsForPage(1, items)}
                </ul>
                <div class="pagination-list">
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
      while (main.firstChild) {
        main.removeChild(main.firstChild);
      }
      main.insertAdjacentHTML("beforeend", element);
      const allAccordions = document.querySelectorAll(".accordion-container");
      allAccordions.forEach((acc) => new Accordion(acc));
      const detailSection = document.querySelector(".detail");
      const filterWrap = document.querySelector(".detail__filters");
      const filter = document.querySelector(".detail__filters-wrap");
      const magazinesInput = document.querySelector(".detail__filter-input");
      const chooseMagazinesItems = document.querySelectorAll(
        `[data-filter="STORE_AVAILABLE"]`
      );
      magazinesInput.addEventListener("input", (e) => {
        e.currentTarget.value = e.currentTarget.value.replace(
          /[^а-я, ^А-Я, '']/,
          ""
        );
        chooseMagazinesItems.forEach((el) => {
          if (
            !el
              .getAttribute("data-ru-value")
              .startsWith(ucFirst(magazinesInput.value))
          ) {
            el.parentElement.parentElement.style.display = "none";
          } else {
            el.parentElement.parentElement.style.display = "block";
          }
        });
      });
      detailSection.addEventListener("click", (e) => {
        if (e.target.className == "radio__input") {
          if (
            e.target.parentNode.children[2] &&
            !e.target.parentNode.children[2].classList.contains(
              "subcategory-active"
            )
          ) {
            const allSubcategoryList = document.querySelectorAll(
              ".subcategory-active"
            );
            allSubcategoryList.forEach((sub) =>
              sub.classList.remove("subcategory-active")
            );
            e.target.parentNode.children[2].classList.add("subcategory-active");
          }
          itemsFromRadio(e.target.id);
        }
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
          // если нажали на пагинации стрелку prev то
          // узнаем активный элемент
          let active = --document.querySelector(".numb.active").textContent;
          // обновляем айтемы на странице, дав ему страницу и фильтрованный массив, так же триггер что это был клик
          itemsForPage(active, itemsOnPage, true);
          // назначаем пагинацию, общий размер пагинации и активный элемент
          changePagination(Number(e.target.getAttribute("data-prev-page")));
          window.scroll({
            top: document.getElementById("detailSection").offsetTop - 140,
            behavior: "smooth",
          });
        }
        if (e.target.className == "next") {
          // тоже самое что и prev, только next
          let active = ++document.querySelector(".numb.active").textContent;
          itemsForPage(active, itemsOnPage, true);
          changePagination(Number(e.target.getAttribute("data-next-page")));
          window.scroll({
            top: document.getElementById("detailSection").offsetTop - 140,
            behavior: "smooth",
          });
        }
        if (e.target.classList.contains("numb")) {
          itemsForPage(e.target.textContent, itemsOnPage, true);
          if (e.target.getAttribute("data-first")) {
            changePagination(1);
            return;
          }
          if (e.target.getAttribute("data-last")) {
            changePagination(Number(e.target.getAttribute("data-total-pages")));
            return;
          }
          changePagination(Number(e.target.getAttribute("data-page-length")));
          window.scroll({
            top: document.getElementById("detailSection").offsetTop - 140,
            behavior: "smooth",
          });
        }
        if (
          e.target.className == "detail__filter-button" ||
          e.target.className == "detail__filter-button-text"
        ) {
          const baseUrl = document.location;
          let newUrl =
            baseUrl.origin + baseUrl.pathname + `?section=${thisSection}`;
          history.pushState(null, null, newUrl);
          fetchCatalog(catalog, "true");
          window.scroll({
            top: document.getElementById("detailSection").offsetTop - 140,
            behavior: "smooth",
          });
        }
        if (e.target.className == "detail__cards-filter-close") {
          const checkbox = document.querySelector(
            `.checkbox[data-filter="${e.target
              .getAttribute("data-filter")
              .toUpperCase()}"][value="${e.target.getAttribute("value")}"]`
          );
          checkbox.click();
        }
        if (e.target.classList.contains("checkbox")) {
          e.target.parentElement.parentElement.style.order = "-1";
          filterGoodsOnPage();
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
            filterGoodsOnPage();
          }, 1000);
        });
      });
      const url = new URL(document.location);
      url.searchParams.forEach((value, index) => {
        if (index !== "section") {
          const values = value.split("%");
          values.forEach((el) => {
            const checkbox = document.querySelector(
              `.checkbox[data-filter="${index.toUpperCase()}"][value="${el}"]`
            );
            checkbox.click();
          });
        }
      });
      if (searchParams.length == 1 && clicked !== "true") {
        const cityCheckboxes = document.querySelectorAll(
          `.checkbox[data-filter]`
        );
        cityCheckboxes.forEach((city) =>
          city
            .getAttribute("data-ru-value")
            .includes(JSON.parse(localStorage.getItem("oa_choosed_city")))
            ? city.click()
            : ``
        );
      }
      changePagination(1);
    }
    async function itemsFromRadio(id) {
      const baseUrl = document.location;
      let newUrl = baseUrl.origin + baseUrl.pathname + `?section=${id}`;
      history.pushState(null, null, newUrl);
      const filters = document.querySelectorAll(".detail__cards-filter");
      filters.forEach((filter) => filter.remove());
      await fetch(
        `https://ohotaktiv.ru/12dev/new-design/pages/catalog/gentwo/sections/${id}.json`
      )
        .then((res) => res.json())
        .then((res) => {
          // ТУТ СОРТИРОВКА
          items = res;
          itemsOnPage = items;
          filtersForPage(items, true);
          itemsForPage(1, items, true);
          changePagination(1);
          const magazinesInput = document.querySelector(
            ".detail__filter-input"
          );
          const chooseMagazinesItems = document.querySelectorAll(
            `[data-filter="STORE_AVAILABLE"]`
          );
          magazinesInput.addEventListener("input", (e) => {
            e.currentTarget.value = e.currentTarget.value.replace(
              /[^а-я, ^А-Я, '']/,
              ""
            );
            chooseMagazinesItems.forEach((el) => {
              if (
                !el
                  .getAttribute("data-ru-value")
                  .startsWith(ucFirst(magazinesInput.value))
              ) {
                el.parentElement.style.display = "none";
              } else {
                el.parentElement.style.display = "block";
              }
            });
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
                filterGoodsOnPage();
              }, 1000);
            });
          });
        });
    }
    function filtersForPage(items, clicked) {
      const filters = {};
      items.forEach((item) => {
        if (item.properties) {
          Object.entries(item.properties).forEach((item) => {
            const key = item[0];
            const value = item[1];
            switch (key) {
              case "MORE_PHOTO":
                break;
              case "STORE_AVAILABLE": {
                Object.keys(value).forEach((el) => {
                  if (!value[el].NAME) return;
                  if (!filters["Магазины"]) filters["Магазины"] = [];
                  const isContain = filters["Магазины"].find(
                    (shop) => shop.VALUE === value[el].VALUE
                  );
                  if (!isContain) {
                    filters["Магазины"].push({
                      VALUE: value[el].VALUE,
                      NAME: value[el].NAME,
                      ID: el,
                    });
                  }
                });
                break;
              }
              default: {
                if (value.NAME) {
                  if (!filters[value.NAME]) filters[value.NAME] = [];
                  const isContain = filters[value.NAME].find(
                    (filter) => filter.VALUE === value.VALUE
                  );
                  if (!isContain)
                    filters[value.NAME].push({
                      NAME: value.NAME,
                      VALUE: value.VALUE,
                      PRINT: value.VALUE_PRINT,
                      CODE: value.CODE,
                    });
                }
              }
            }
          });
        }
      });
      const element = `
        <div class="detail__filter-all">
          ${
            filters["Магазины"]
              ? `
          <div class="detail__filter">
          <p class="detail__filter-title">Наличие в магазинах</p>
          <div class="detail__filter-input-available-wrap">
            <input
              type="text"
              class="detail__filter-input available-input"
              placeholder="Поиск магазина"
            />
            <button class="detail__filter-input-available-button">
            </button>
          </div>
          <ul class="detail__filter-list available-list">
            ${filters["Магазины"]
              .map((el) => {
                return `
                  <li class="detail__filter-item">
                    <label class="checkbox__label">
                      ${el.NAME}
                      <input
                        type="checkbox"
                        class="checkbox visually-hidden"
                        value="${el.VALUE}"
                        data-filter="STORE_AVAILABLE"
                        id="${el.ID}"
                        data-ru-value="${el.NAME}"
                      />
                      <span class="checkbox__span"></span>
                    </label>
                  </li>
                `;
              })
              .join("")}
              </ul>
          </div>
          `
              : ``
          }
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
      ${Object.keys(filters)
        .map((filter, index) => {
          if (filter == "Магазины" || filter == "undefined") return;
          if (filter == "Бренды") {
            return `
              <div class="detail__filter">
                <p class="detail__filter-title">Бренды</p>
                <ul class="detail__filter-list">
                  ${filters["Бренды"]
                    .map((el) => {
                      return `
                      <li class="detail__filter-item">
                        <label class="checkbox__label">
                          ${el}
                          <input
                            type="checkbox"
                            class="checkbox visually-hidden"
                            value="${el}"
                            data-filter="${filter}"
                          />
                          <span class="checkbox__span"></span>
                        </label>
                      </li>
                    `;
                    })
                    .join("")}
                </ul>
            </div>
            `;
          }
          console.log(index);
          if (breadcrumbs.length == 1 && index > 1) return;
          return `
              <div class="detail__filter accordion-container">
                <div class="ac">
                  <h2 class="ac-header">
                    <button type="button" class="ac-trigger">
                      ${filter}
                    </button>
                  </h2>
                  <div class="ac-panel">
                    <div class="ac-panel-wrap">
                      <ul class="detail__filter-list">
                      ${Object.values(filters[filter])
                        .map((value) => {
                          return `
                          <li class="detail__filter-item">
                            <label class="checkbox__label">
                              ${value.PRINT}
                              <input
                                type="checkbox"
                                class="checkbox visually-hidden"
                                value="${value.VALUE}"
                                data-filter="${value.CODE}"
                                data-ru-value="${value.PRINT}"
                              />
                              <span class="checkbox__span"></span>
                            </label>
                          </li>
                        `;
                        })
                        .join("")}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            `;
        })
        .join("")}
        </div>
      `;
      if (clicked) {
        const detailFilterAll = document.querySelector(".detail__filter-all");
        detailFilterAll.innerHTML = element;
        const allAccordions = document.querySelectorAll(".accordion-container");
        allAccordions.forEach((acc) => new Accordion(acc));
        return;
      } else {
        return element;
      }
    }
    function itemsForPage(buttonNumber, arr, clicked) {
      const countItemsOnPage = 12;
      const startFrom =
        buttonNumber == 1 ? 1 : (buttonNumber - 1) * countItemsOnPage;
      const data =
        arr.length <= 12
          ? arr
          : arr.slice(startFrom, startFrom + countItemsOnPage);
      let element = ``;
      if (data.length == 0) {
        element += `<li class="goods-not-found__wrap">
            <p class="goods-not-found__text">
              Товаров по указанным фильтрам не найдено.
            </p>
            <button class="detail__filter-button-text">Сбросить фильтры</button>
        </li>`;
      } else {
        data.forEach((item) => {
          element += generateCard(item, ["favourite"], true, userInfo);
        });
      }
      if (clicked) {
        const detailList = document.querySelector(".detail__cards-list");
        const detailSubtitle = document.querySelector(".detail__subtitle");
        detailSubtitle.textContent = `${arr.length} ${numWord(arr.length, [
          "товар",
          "товара",
          "товаров",
        ])}`;
        return (detailList.innerHTML = element);
      } else {
        return element;
      }
    }
    function changePagination(page) {
      const totalPages = Math.round(itemsOnPage.length / 12);
      const paginationList = document.querySelector(".pagination-list");
      let liTag = "";
      let activeLi;
      let beforePages = page - 1;
      let afterPages = page + 1;
      if (page > 1) {
        liTag += `<button class="prev" data-prev-page="${
          page - 1
        }">Prev</button>`;
      }
      if (page > 2) {
        liTag += `<button class="numb" data-first="true">1</button>`;
        if (page > 3) {
          liTag += ` <p class="dots">...</p>`;
        }
      }
      for (
        let pageLength = beforePages;
        pageLength <= afterPages;
        pageLength++
      ) {
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
        liTag += `<button class="numb ${activeLi}" data-page-length="${pageLength}">${pageLength}</button>`;
      }

      if (page < totalPages - 1) {
        if (page < totalPages - 2) {
          liTag += ` <p class="dots">...</p>`;
        }
        liTag += `<button class="numb" data-last="true"  data-total-pages="${totalPages}">${totalPages}</button>`;
      }

      if (page < totalPages) {
        liTag += `<button class="next" data-next-page="${
          page + 1
        }">Next</button>`;
      }
      if (totalPages == 0) {
        liTag = "";
      }
      paginationList.innerHTML = liTag;
    }
    function filterGoodsOnPage() {
      const checkboxes = document.querySelectorAll(".checkbox:checked");
      let choosedFilters = {};
      checkboxes.forEach((checkbox, index) => {
        if (!choosedFilters[checkbox.getAttribute("data-filter")]) {
          choosedFilters[checkbox.getAttribute("data-filter")] = [];
        }
        if (checkbox.getAttribute("data-filter") == "STORE_AVAILABLE") {
          choosedFilters[checkbox.getAttribute("data-filter")].push(
            checkbox.id
          );
        } else {
          choosedFilters[checkbox.getAttribute("data-filter")].push(
            checkbox.value
          );
        }
        newUrl += `${index == 0 ? `` : `&`}${checkbox.getAttribute(
          "data-filter"
        )}=${checkbox.value}`;
      });
      let mergedArr = [];
      if (choosedFilters["STORE_AVAILABLE"]) {
        items.forEach((item) => {
          let trigger = 0;
          for (let i = 0; i < choosedFilters["STORE_AVAILABLE"].length; i++) {
            if (!item.properties) continue;
            if (!item.properties.STORE_AVAILABLE) continue;
            if (
              item.properties.STORE_AVAILABLE[
                choosedFilters["STORE_AVAILABLE"][i]
              ]
            )
              trigger++;
          }
          if (trigger === choosedFilters["STORE_AVAILABLE"].length) {
            mergedArr.push(item);
          }
        });
      }
      itemsOnPage = nestedFilter(
        mergedArr.length ? mergedArr : items,
        choosedFilters
      );
      const priceFrom = document.getElementById("price-from").value
        ? Number(document.getElementById("price-from").value.replace(/\s/g, ""))
        : 0;
      const priceTo = document.getElementById("price-to").value
        ? Number(document.getElementById("price-to").value.replace(/\s/g, ""))
        : 3000000;
      itemsOnPage = itemsOnPage.filter(
        (el) => el.properties && el.properties.FILTER_PRICE
      );
      itemsOnPage = itemsOnPage.filter(
        (el) =>
          Number(el.properties.FILTER_PRICE.VALUE) >= priceFrom &&
          Number(el.properties.FILTER_PRICE.VALUE) <= priceTo
      );
      itemsForPage(1, itemsOnPage, true);
      changePagination(1);
      let neededUrl = `${Object.keys(choosedFilters).length ? `&` : ``}`;
      Object.keys(choosedFilters).forEach((filter, index) => {
        neededUrl += `${index == 0 ? `` : `&`}${filter.toLowerCase()}=`;
        if (filter == "STORE_AVAILABLE") {
          choosedFilters[filter].forEach(
            (el, index) =>
              (neededUrl += `${index == 0 ? `` : `%`}${document
                .getElementById(el)
                .value.toLowerCase()}`)
          );
        } else {
          choosedFilters[filter].forEach(
            (el, index) =>
              (neededUrl += `${index == 0 ? `` : `%`}${el.toLowerCase()}`)
          );
        }
      });
      const baseUrl = document.location.href.split("&")[0];
      let newUrl = baseUrl + neededUrl;
      history.pushState(null, null, newUrl);
      const miniFiltersContainer = document.querySelector(
        ".detail__cards-filters"
      );
      const element = `
        ${Object.values(checkboxes)
          .map((checkbox) => {
            return `
              <div class="detail__cards-filter">
                <p class="detail__cards-text">${checkbox.getAttribute(
                  "data-ru-value"
                )}</p>
                <button class="detail__cards-filter-close" data-filter=${checkbox.getAttribute(
                  "data-filter"
                )} value="${checkbox.value}"></button>
              </div>
          `;
          })
          .join("")}
      `;
      miniFiltersContainer.innerHTML = element;
    }
    function nestedFilter(targetArray, filters) {
      const filterKeys = Object.keys(filters).filter(
        (key) => key !== "STORE_AVAILABLE"
      );
      return targetArray.filter(function (eachObj) {
        return filterKeys.every(function (eachKey) {
          if (!filters[eachKey].length) {
            return true;
          }
          if (eachObj.properties) {
            if (eachObj.properties[eachKey]) {
              return filters[eachKey].includes(
                eachObj.properties[eachKey].VALUE
              );
            }
          }
        });
      });
    }
  }
});
