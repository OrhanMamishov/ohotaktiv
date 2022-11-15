import "../imports";
import "../../styles/pages/catalogview/style.scss";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { bodyScrollToggle } from "../functions/scrollBody";
import lozad from "lozad";
import numWord from "../functions/numWord";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");
  const serverName = "https://ohotaktiv.ru";
  const urlCatalog = "/pnevmaticheskoe_oruzhie/pnevmaticheskie-vintovki/".split(
    "/"
  );
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
      // узнаем каталог
      const thisCatalog = res.catalog.section_list.filter((el) =>
        el.page_url.includes(urlCatalog[2])
      );
      // если каталог не верхнего уровня
      if (urlCatalog.length > 3) {
        // перебираем полученные каталоги
        for (let i = 3; i <= level; i++) {
          // перебираем полученные подкаталоги
          thisCatalog[0].depth.forEach((depth) => {
            // если каталог совпадает с нужным
            if (depth.page_url.includes(urlCatalog[i])) {
              // пушим его в этот каталог
              thisCatalog.push(depth);
              // удаляем предыдущий массив
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
    // Название каталога в котором находимся
    let catalogName = catalog.name;
    // Айтемы этого каталога
    // СОБИРАЕМ АЙТЕМЫ
    const items = [];
    // если каталог верхнего уровня (если у него есть длина)
    if (catalog.length) {
      // спрашиваем что это за каталог
      const catalogHighArray = await fetch(
        "https://ohotaktiv.ru/12dev/new-design/pages/catalog/sections/menu.json",
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          // фильтруем полученный результат по нужному каталогу
          const catalogHigh = res.filter(
            (el) => el.file == `${mainLevel}.json`
          );
          // даем имя полученного каталога
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
      // если каталог не верхнего уровня (нет длины)
      // если у каталога есть айтемы, пушим их в основной массив
      if (catalog.items) {
        catalog.items.forEach((item) => items.push(item));
      }
      // если у каталога есть подкаталог
      if (catalog.depth) {
        // перебираем его
        catalog.depth.forEach((firstDepth) => {
          // если у этого подкаталога есть айтемы - пушим в основной массив
          if (firstDepth.items) {
            firstDepth.items.forEach((item) => items.push(item));
          }
          // если у подкаталога есть подкаталог
          if (firstDepth.depth) {
            // перебираем его
            firstDepth.depth.forEach((secondDepth) => {
              // если у этого подкаталога есть айтемы - пушим в основной массив
              // И ТАК ДАЛЕЕ 4 УРОВНЯ
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
    // после сбора полученных айтемов сортируем их по наличию картинок и наличию в магазине
    items.sort((item) =>
      item.properties.Картинки && item.properties["Наличие в магазине"] ? -1 : 1
    );
    // новая копия айтемов для фильтрации
    let filteredItems = items;
    // создаем элемент
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
          <div class="detail__subtitle-wrap">
            <p class="detail__subtitle"> ${filteredItems.length} товаров</p>
            <button class="detail__cards-filter-open"></button>
          </div>
          <div class="detail__columns">
            <div class="detail__filters">
              <div class="detail__filters-background"></div>
              <div class="detail__filters-wrap">
                <button class="detail__close"></button>
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
                                    id="${section.id}"
                                    name="category"
                                  />
                                  <label for="${section.id}">${section.name}</label>
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
                              <label for="${section.section_this}">${section.name}</label>
                            </li>
                          `;
                            })
                            .join("")
                        : []
                    }
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
                ${filtersForPage(filteredItems)}
                <button class="detail__filter-button">Сбросить</button>
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
                ${itemsForPage(1, filteredItems)}
              </ul>
              <div class="pagination-list">
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    // удаляем все элементы DOM дерева
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    // вставляем созданный элемент в main
    main.insertAdjacentHTML("beforeend", element);
    // lazy картинки
    const observer = lozad();
    observer.observe();
    // все селекты и назначение свойств селекту
    const allSelects = document.querySelectorAll(".js-select");
    allSelects.forEach((select) => {
      new Choices(select, {
        searchEnabled: false,
        itemSelectText: "",
        allowHTML: true,
      });
    });
    // свайперы
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
    // аккордеоны
    const allAccordions = document.querySelectorAll(".accordion-container");
    allAccordions.forEach((acc) => new Accordion(acc));
    // выбираем фильтры
    const filterWrap = document.querySelector(".detail__filters");
    const filter = document.querySelector(".detail__filters-wrap");
    const detailSection = document.querySelector(".detail");
    // назначаем пагинацию, общий размер пагинации и активный элемент
    changePagination(Math.round(items.length / 12), 1);
    // события на созданном элементе
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
        // если нажали на пагинации стрелку prev то
        // узнаем активный элемент
        let active = --document.querySelector(".numb.active").textContent;
        // обновляем айтемы на странице, дав ему страницу и фильтрованный массив, так же триггер что это был клик
        itemsForPage(active, filteredItems, true);
        // назначаем пагинацию, общий размер пагинации и активный элемент
        changePagination(
          Math.round(filteredItems.length / 12),
          Number(e.target.getAttribute("data-prev-page"))
        );
      }
      if (e.target.className == "next") {
        // тоже самое что и prev, только next
        let active = ++document.querySelector(".numb.active").textContent;
        itemsForPage(active, filteredItems, true);
        changePagination(
          Math.round(filteredItems.length / 12),
          Number(e.target.getAttribute("data-next-page"))
        );
      }
      if (e.target.classList.contains("numb")) {
        // если нажали на пагинацию на номер
        // то обновляем айтемы у страницы
        itemsForPage(e.target.textContent, filteredItems, true);
        if (e.target.getAttribute("data-first")) {
          // если ткнули на первый элемент то возвращаем пагинацию на 1 элемент
          changePagination(Math.round(filteredItems.length / 12), Number(1));
          return;
        }
        if (e.target.getAttribute("data-last")) {
          // если ткнули на последний элемент то возвращаем пагинацию на последний элемент
          changePagination(
            Math.round(filteredItems.length / 12),
            Number(e.target.getAttribute("data-total-pages"))
          );
          return;
        }
        changePagination(
          Math.round(filteredItems.length / 12),
          Number(e.target.getAttribute("data-page-length"))
        );
      }
      if (e.target.className == "radio__input") {
        itemsFromRadio(filteredItems, catalog, e.target.id);
      }
      if (e.target.className == "detail__cards-filter-close") {
        filterGoodsOnPage(items, e.target.previousElementSibling.textContent);
        e.target.parentElement.remove();
      }
      if (e.target.classList.contains("checkbox")) {
        filterGoodsOnPage(items, catalog);
      }
      if (e.target.className == "detail__filter-button") {
        refreshThisCatalog(catalog);
      }
    });
    // событие на цене
    const priceFrom = document.getElementById("price-from");
    const priceTo = document.getElementById("price-to");
    const pricesInputs = [priceFrom, priceTo];
    pricesInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        e.currentTarget.value = numberWithSpaces(
          e.currentTarget.value.replace(/\D/g, "")
        );
        if (input == priceFrom) {
          // const filteredPriceItems = filteredItems.filter(
          //   (item) =>
          //     Number(item["PRICE"][5]) >=
          //     e.currentTarget.value.split(" ").join("")
          // );
          // console.log(filteredPriceItems);
        }
      });
    });
  }
  function generatePrice(item) {
    const price = item["PRICE"];
    let trigger = true;
    if (price) {
      if (price[13] && trigger) {
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
    const startFrom = buttonNumber == 1 ? 1 : (buttonNumber - 1) * itemsOnPage;
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
  function changePagination(totalPages, page) {
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
    paginationList.innerHTML = liTag;
  }
  function itemsFromRadio(filteredItems, catalog, id, clicked) {
    // если ткнули на радиокнопку фильтра то обнуляем фильтровый массив
    filteredItems = [];
    // создаем новую переменную для фильтрового каталога
    let filteredCatalog;
    // если каталог имеет длину то есть каталог не содержит подкаталогов
    if (catalog.length) {
      // фильтруем каталог по ID
      filteredCatalog = catalog.filter((section) => section.section_this == id);
    } else {
      // иначе фильтруем подкаталог по ID
      filteredCatalog = catalog.depth.filter((section) => section.id == id);
    }
    // если каталог содержит айтемы
    if (filteredCatalog[0].items) {
      // пушим их в основной массив
      filteredCatalog[0].items.forEach((item) => filteredItems.push(item));
    }
    // если каталог содержит подкаталоги то собираем айтемы на 4 уровнях
    if (filteredCatalog[0].depth) {
      filteredCatalog[0].depth.forEach((firstDepth) => {
        if (firstDepth.items) {
          firstDepth.items.forEach((item) => filteredItems.push(item));
        }
        if (firstDepth.depth) {
          firstDepth.depth.forEach((secondDepth) => {
            if (secondDepth.items) {
              secondDepth.items.forEach((item) => filteredItems.push(item));
            }
            if (secondDepth.depth) {
              secondDepth.depth.forEach((thirdDepth) => {
                if (thirdDepth.items) {
                  thirdDepth.items.forEach((item) => filteredItems.push(item));
                }
              });
            }
          });
        }
      });
    }
    // после собранных айтемов фильтруем по картинкам
    filteredItems.sort((item) => (item.properties.Картинки ? -1 : 1));
    if (clicked) {
      return filteredItems;
    } else {
      // меняем пагинацию
      changePagination(Math.round(filteredItems.length / 12), 1);
      // отрисовываем айтемы
      itemsForPage(1, filteredItems, true);
      filtersForPage(filteredItems, true);
    }
  }
  function filterGoodsOnPage(items, catalog) {
    const idCategory = document.querySelector(".radio__input:checked").id;
    const filteredItemsFromRadio = itemsFromRadio(
      items,
      catalog,
      idCategory,
      true
    );
    console.log(filteredItemsFromRadio);
    // const againFiltered
    // const checkboxes = document.querySelectorAll(".checkbox:checked");
    // console.log(clicked);
    // const filteredItems = items;
    // checkboxes.forEach((checkbox) => {
    //   console.log(checkbox);
    // });
  }
  function filtersForPage(items, clicked) {
    const filters = {};
    items.forEach((item) => {
      Object.keys(item.properties).forEach((prop) => {
        if (/[а-я]/i.test(prop)) {
          if (!filters[prop] && !prop.startsWith("Картинки")) {
            filters[prop] = [];
          }
          if (!prop.startsWith("Картинки")) {
            if (!filters[prop].includes(item.properties[prop])) {
              filters[prop].push(item.properties[prop]);
            }
          }
        }
      });
    });
    const element = `
    <div class="detail__filter-all">
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
      .map((filter) => {
        if (filter == "Наличие в магазине") return;
        if (filter == "Бренды") {
          return `
            <div class="detail__filter">
              <p class="detail__filter-title">Бренды</p>
              <input
                type="text"
                class="detail__filter-input"
                placeholder="Поиск Бренда"
              />
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
        } else {
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
                    <input
                      type="text"
                      class="detail__filter-input"
                      placeholder="Поиск значения"
                    />
                    <ul class="detail__filter-list">
                    ${Object.values(filters[filter])
                      .map((value) => {
                        return `
                        <li class="detail__filter-item">
                          <label class="checkbox__label">
                            ${value}
                            <input
                              type="checkbox"
                              class="checkbox visually-hidden"
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
        }
      })
      .join("")}
      </div>
    `;
    if (clicked) {
      const detailFilterAll = document.querySelector(".detail__filter-all");
      detailFilterAll.innerHTML = element;
      const allAccordions = document.querySelectorAll(".accordion-container");
      allAccordions.forEach((acc) => new Accordion(acc));
      const allSelects = document.querySelectorAll(".js-select");
      allSelects.forEach((select) => {
        new Choices(select, {
          searchEnabled: false,
          itemSelectText: "",
          allowHTML: true,
        });
      });
      return;
    } else {
      return element;
    }
  }
});
