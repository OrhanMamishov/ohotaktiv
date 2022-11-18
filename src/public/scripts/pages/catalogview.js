import "../imports";
import "../../styles/pages/catalogview/style.scss";
import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { bodyScrollToggle } from "../functions/scrollBody";
import lozad from "lozad";
import numWord from "../functions/numWord";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import ucFirst from "../functions/ucFirst";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");
  const serverName = "https://ohotaktiv.ru";
  const urlCatalog = "/pnevmaticheskoe_oruzhie/".split("/");
  const mainLevel = urlCatalog[1]; // главный каталог
  const level = urlCatalog.length - 2; // уровень этого каталога
  let itemsOnPage = [];
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
          cat.items.forEach((item) => {
            // нужен норм массив со стороны коробки
            const hasId = items.some((o) => o.ID == item.ID);
            if (!hasId) items.push(item);
          });
        }
        if (cat.depth) {
          cat.depth.forEach((firstDepth) => {
            if (firstDepth.items) {
              firstDepth.items.forEach((item) => {
                const hasId = items.some((o) => o.ID == item.ID);
                if (!hasId) items.push(item);
              });
            }
            if (firstDepth.depth) {
              firstDepth.depth.forEach((secondDepth) => {
                if (secondDepth.items) {
                  secondDepth.items.forEach((item) => {
                    const hasId = items.some((o) => o.ID == item.ID);
                    if (!hasId) items.push(item);
                  });
                }
                if (secondDepth.depth) {
                  secondDepth.depth.forEach((thirdDepth) => {
                    if (thirdDepth.depth) {
                      thirdDepth.depth.forEach((fourthDepth) => {
                        if (fourthDepth.items) {
                          fourthDepth.items.forEach((item) => {
                            const hasId = items.some((o) => o.ID == item.ID);
                            if (!hasId) items.push(item);
                          });
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
        catalog.items.forEach((item) => {
          const hasId = items.some((o) => o.ID == item.ID);
          if (!hasId) items.push(item);
        });
      }
      // если у каталога есть подкаталог
      if (catalog.depth) {
        // перебираем его
        catalog.depth.forEach((firstDepth) => {
          // если у этого подкаталога есть айтемы - пушим в основной массив
          if (firstDepth.items) {
            firstDepth.items.forEach((item) => {
              const hasId = items.some((o) => o.ID == item.ID);
              if (!hasId) items.push(item);
            });
          }
          // если у подкаталога есть подкаталог
          if (firstDepth.depth) {
            // перебираем его
            firstDepth.depth.forEach((secondDepth) => {
              // если у этого подкаталога есть айтемы - пушим в основной массив
              // И ТАК ДАЛЕЕ 4 УРОВНЯ
              if (secondDepth.items) {
                secondDepth.items.forEach((item) => {
                  const hasId = items.some((o) => o.ID == item.ID);
                  if (!hasId) items.push(item);
                });
              }
              if (secondDepth.depth) {
                secondDepth.depth.forEach((thirdDepth) => {
                  if (thirdDepth.items) {
                    thirdDepth.items.forEach((item) => {
                      const hasId = items.some((o) => o.ID == item.ID);
                      if (!hasId) items.push(item);
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
    // после сбора полученных айтемов сортируем их по наличию картинок и наличию в магазине
    items.sort((item) => (item.PREVIEW_PICTURE ? -1 : 1));
    // новая копия айтемов для фильтрации
    itemsOnPage = items;
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
          <h1 class="detail__title title-seo"> ${catalogName} </h1>
          <div class="detail__subtitle-wrap">
            <p class="detail__subtitle"> ${itemsOnPage.length} товаров</p>
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
                                            id="${firstDepth.id}"
                                            name="category"
                                          />
                                          <label for="${firstDepth.id}">${
                                          firstDepth.name
                                        }</label>
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
                                                      id="${secondDepth.id}"
                                                      name="category"
                                                    />
                                                    <label for="${
                                                      secondDepth.id
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
                                                              id="${thirdDepth.id}"
                                                              name="category"
                                                            />
                                                            <label for="${thirdDepth.id}">${thirdDepth.name}</label>
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
                                                id="${firstDepth.id}"
                                                name="category"
                                              />
                                              <label for="${firstDepth.id}">${
                                              firstDepth.name
                                            }</label>
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
                                                          id="${secondDepth.id}"
                                                          name="category"
                                                        />
                                                        <label for="${
                                                          secondDepth.id
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
                                                                  id="${thirdDepth.id}"
                                                                  name="category"
                                                                />
                                                                <label for="${thirdDepth.id}">${thirdDepth.name}</label>
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
                ${filtersForPage(itemsOnPage)}
                <button class="detail__filter-button">Сбросить</button>
              </div>
            </div>
          <div class="detail__cards">
            <div class="detail__cards-filters">

            </div>
            <div class="detail__cards-list-wrap">
              <ul class="detail__cards-list">
                ${itemsForPage(1, itemsOnPage)}
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
    changePagination(1);
    // события на созданном элементе
    // -------------------------------------------------------------------------------------
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
        itemsForPage(active, itemsOnPage, true);
        // назначаем пагинацию, общий размер пагинации и активный элемент
        changePagination(Number(e.target.getAttribute("data-prev-page")));
      }
      if (e.target.className == "next") {
        // тоже самое что и prev, только next
        let active = ++document.querySelector(".numb.active").textContent;
        itemsForPage(active, itemsOnPage, true);
        changePagination(Number(e.target.getAttribute("data-next-page")));
      }
      if (e.target.classList.contains("numb")) {
        // если нажали на пагинацию на номер
        // то обновляем айтемы у страницы
        itemsForPage(e.target.textContent, itemsOnPage, true);
        if (e.target.getAttribute("data-first")) {
          // если ткнули на первый элемент то возвращаем пагинацию на 1 элемент
          changePagination(1);
          return;
        }
        if (e.target.getAttribute("data-last")) {
          // если ткнули на последний элемент то возвращаем пагинацию на последний элемент
          changePagination(Number(e.target.getAttribute("data-total-pages")));
          return;
        }
        changePagination(Number(e.target.getAttribute("data-page-length")));
      }
      if (e.target.className == "radio__input") {
        itemsFromRadio(catalog, e.target.id);
      }
      if (e.target.className == "detail__cards-filter-close") {
        const checkbox = document.querySelector(
          `[value = "${e.target.previousElementSibling.textContent}"]`
        );
        checkbox.click();
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
        // if (input == priceFrom) {
        // }
      });
    });
    // события в поиске магазина
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
        if (!el.value.startsWith(ucFirst(magazinesInput.value))) {
          el.parentElement.style.display = "none";
        } else {
          el.parentElement.style.display = "block";
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
    const data =
      arr.length <= 12 ? arr : arr.slice(startFrom, startFrom + itemsOnPage);
    let element = ``;
    data.forEach((item) => {
      element += `
      <li class="detail__cards-item card-item">
        <div class="card-item__wrap">
          <a href="../../card/?id=${item.ID}" class="card-item__link">
            <div class="card-item__photo-wrap">
              <img
                src="${serverName}${
        item.PREVIEW_PICTURE
          ? item.PREVIEW_PICTURE
          : item.properties.MORE_PHOTO
          ? item.properties.MORE_PHOTO.FILES
          : `/local/templates/ohota2021/img/no_photo.png`
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
  function itemsFromRadio(catalog, id, clicked) {
    // если ткнули на радиокнопку фильтра то обнуляем фильтровый массив
    itemsOnPage = [];
    // создаем новую переменную для фильтрового каталога
    let filteredCatalog;
    // если каталог имеет длину то есть каталог не содержит подкаталогов
    if (catalog.length) {
      // фильтруем каталог по ID
      catalog.forEach((el) => {
        if (el.section_this !== id) {
          if (el.depth) {
            el.depth.forEach((firstDepth) => {
              if (firstDepth.id !== id) {
                if (firstDepth.depth) {
                  firstDepth.depth.forEach((secondDepth) => {
                    if (secondDepth.id !== id) {
                      if (secondDepth.depth) {
                        secondDepth.depth.forEach((thirdDepth) => {
                          filteredCatalog = thirdDepth;
                        });
                      }
                    } else {
                      filteredCatalog = secondDepth;
                    }
                  });
                }
              } else {
                filteredCatalog = firstDepth;
              }
            });
          }
        } else {
          filteredCatalog = el;
        }
      });
    } else {
      // иначе фильтруем подкаталог по ID
      catalog.depth.forEach((el) => {
        if (el.id !== id) {
          if (el.depth) {
            el.depth.forEach((firstDepth) => {
              if (firstDepth.id !== id) {
                if (firstDepth.depth) {
                  firstDepth.depth.forEach((secondDepth) => {
                    if (secondDepth.id !== id) {
                      if (secondDepth.depth) {
                        secondDepth.depth.forEach((thirdDepth) => {
                          filteredCatalog = thirdDepth;
                        });
                      }
                    } else {
                      filteredCatalog = secondDepth;
                    }
                  });
                }
              } else {
                filteredCatalog = firstDepth;
              }
            });
          }
        } else {
          filteredCatalog = el;
        }
      });
    }
    //
    // если каталог содержит айтемы
    if (filteredCatalog.items) {
      // пушим их в основной массив
      filteredCatalog.items.forEach((item) => {
        const hasId = itemsOnPage.some((o) => o.ID == item.ID);
        if (!hasId) itemsOnPage.push(item);
      });
    }
    // если каталог содержит подкаталоги то собираем айтемы на 4 уровнях
    if (filteredCatalog.depth) {
      filteredCatalog.depth.forEach((firstDepth) => {
        if (firstDepth.items) {
          firstDepth.items.forEach((item) => {
            const hasId = itemsOnPage.some((o) => o.ID == item.ID);
            if (!hasId) itemsOnPage.push(item);
          });
        }
        if (firstDepth.depth) {
          firstDepth.depth.forEach((secondDepth) => {
            if (secondDepth.items) {
              secondDepth.items.forEach((item) => {
                const hasId = itemsOnPage.some((o) => o.ID == item.ID);
                if (!hasId) itemsOnPage.push(item);
              });
            }
            if (secondDepth.depth) {
              secondDepth.depth.forEach((thirdDepth) => {
                if (thirdDepth.items) {
                  thirdDepth.items.forEach((item) => {
                    const hasId = itemsOnPage.some((o) => o.ID == item.ID);
                    if (!hasId) itemsOnPage.push(item);
                  });
                }
              });
            }
          });
        }
      });
    }
    // после собранных айтемов фильтруем по картинкам
    itemsOnPage.sort((item) => (item.PREVIEW_PICTURE ? -1 : 1));
    if (clicked) {
      return itemsOnPage;
    } else {
      // меняем пагинацию
      changePagination(1);
      // отрисовываем айтемы
      itemsForPage(1, itemsOnPage, true);
      filtersForPage(itemsOnPage, true);
      // события в поиске магазина
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
          if (!el.value.startsWith(ucFirst(magazinesInput.value))) {
            el.parentElement.style.display = "none";
          } else {
            el.parentElement.style.display = "block";
          }
        });
      });
    }
  }
  function filterGoodsOnPage(items, catalog) {
    const idCategory = document.querySelector(".radio__input:checked");
    const checkboxes = document.querySelectorAll(".checkbox:checked");
    let filteredItemsFromRadio = idCategory
      ? itemsFromRadio(catalog, idCategory.id, true)
      : items;
    let choosedFilters = {};
    checkboxes.forEach((checkbox) => {
      if (!choosedFilters[checkbox.getAttribute("data-filter")]) {
        choosedFilters[checkbox.getAttribute("data-filter")] = [];
      }
      if (checkbox.getAttribute("data-filter") == "STORE_AVAILABLE") {
        choosedFilters[checkbox.getAttribute("data-filter")].push(checkbox.id);
      } else {
        choosedFilters[checkbox.getAttribute("data-filter")].push(
          checkbox.value
        );
      }
    });
    let mergedArr = [];
    if (choosedFilters["STORE_AVAILABLE"]) {
      filteredItemsFromRadio.forEach((item) => {
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
      mergedArr.length ? mergedArr : filteredItemsFromRadio,
      choosedFilters
    );
    itemsForPage(1, itemsOnPage, true);
    changePagination(1);
    const miniFiltersContainer = document.querySelector(
      ".detail__cards-filters"
    );
    const element = `
      ${Object.values(checkboxes)
        .map((checkbox) => {
          return `
            <div class="detail__cards-filter">
              <p class="detail__cards-text">${checkbox.value}</p>
              <button class="detail__cards-filter-close"></button>
            </div>
        `;
        })
        .join("")}
    `;
    miniFiltersContainer.innerHTML = element;
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
  function filtersForPage(items, clicked) {
    const filters = {};
    const filtersCode = {};
    items.forEach((item) => {
      if (item.properties) {
        Object.values(item.properties).forEach((prop) => {
          if (prop.NAME == "Картинки") return;
          if (!prop.NAME) {
            Object.values(prop).forEach((el) => {
              if (!el.NAME) return;
              if (!filters["Магазины"]) filters["Магазины"] = [];
              if (!filtersCode["Магазины"])
                filtersCode["Магазины"] = "STORE_AVAILABLE";
              const isContain = filters["Магазины"].find(
                (shop) => shop.VALUE === el.VALUE
              );
              if (!isContain) {
                filters["Магазины"].push({ VALUE: el.VALUE, NAME: el.NAME });
              }
            });
          }
          if (!filters[prop.NAME]) filters[prop.NAME] = [];
          if (!filtersCode[prop.NAME]) filtersCode[prop.NAME] = prop.CODE;
          if (!filters[prop.NAME].includes(prop.VALUE))
            filters[prop.NAME].push(prop.VALUE);
        });
      }
    });
    const element = `
    <div class="detail__filter-all">
      <div class="detail__filter">
        <p class="detail__filter-title">Наличие в магазинах</p>
          <input
            type="text"
            class="detail__filter-input"
            placeholder="Поиск магазина"
          />
        <ul class="detail__filter-list">
        ${filters["Магазины"]
          .map((el) => {
            return `
              <li class="detail__filter-item">
                <label class="checkbox__label">
                  ${el.NAME}
                  <input
                    type="checkbox"
                    class="checkbox visually-hidden"
                    value="${el.NAME}"
                    data-filter="STORE_AVAILABLE"
                    id="${el.VALUE}"
                  />
                  <span class="checkbox__span"></span>
                </label>
              </li>
            `;
          })
          .join("")}
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
                              value="${value}"
                              data-filter="${filtersCode[filter]}"
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
      return;
    } else {
      return element;
    }
  }
});
