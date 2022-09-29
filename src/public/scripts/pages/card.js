import "../imports";
import "../../styles/pages/card/style.scss";
import Swiper, { Mousewheel, Navigation, Pagination } from "swiper";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { eNumerate } from "../functions/eNumerate";

document.addEventListener("DOMContentLoaded", async () => {
  const serverName = "https://ohotaktiv.ru";
  const arrayFromBase = await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/card/hand.php",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      refreshCard(res);
      refreshViewed(res["viewed"]);
      refreshDescription(res);
    });

  // Функции
  function refreshCard(res) {
    const cardSection = document.querySelector(".card");
    while (cardSection.firstChild) {
      cardSection.removeChild(cardSection.firstChild);
    }
    const element = `
      <div class="card__wrap container">
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
              <a href="#" class="navigation__link">
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
        <div class="card__left">
          <div class="card__left-wrap swiper swiper-images">
            <ul class="swiper-wrapper">
            ${res["Картинки"]
              .map((img) => {
                return `
                <li class="card__left-slide swiper-slide">
                  <img src="${
                    serverName + img
                  }" alt="Картинка товара" class="card__img-big">
                </li>
              `;
              })
              .join("")}
            </ul>
            <div class="card__left-pagination swiper-pagination"></div>
            <div class="card__left-infoblock">
            ${
              res["is_license"] == true
                ? `
                <p class="card__left-infoblock-text license">
                  Лицензионный товар
                </p>
            `
                : ``
            }
              <div class="card-item__photo-button-wrap">
                <button class="card-item__photo-button share"></button>
                <button class="card-item__photo-button favourite"></button>
                <button class="card-item__photo-button compare"></button>
                <div class="share-wrap">
                  <a href="#" class="share-link vk">
                    VK
                  </a>
                  <a href="#" class="share-link tg">
                    Telegram
                  </a>
                  <a href="#" class="share-link viber">
                    Viber
                  </a>
                  <button class="share-link button">
                    Скопировать ссылку
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card__right">
          <p class="card__right-brand">
            ${res["manufacturer"]}
          </p>
          <p class="card__right-name">
            ${res["NAME"]}
          </p>
          <p class="card__right-article">
            ${res["barcode"] ? `Артикул: ${res["barcode"]}.` : ``} ${
      res["product_code"] ? `Код: ${res["product_code"]}` : ``
    }
          </p>
          <p class="card__right-reviews">
            <span>5</span> ${res["reviews"].length} отз.
          </p>
          <p class="card__right-price">
          ${
            res["PRICE"][13]
              ? numberWithSpaces(res["PRICE"][13])
              : numberWithSpaces(res["PRICE"][5])
          } &#8381; <span>${numberWithSpaces(res["PRICE"][1])} &#8381;</span>
          </p>
          ${
            res["warehouse"] == "0" && res["Наличие в магазине"].length == 0
              ? `<p class="card__right-stock not-avaliable">Отсутствует в наличии</p>`
              : `<p class="card__right-stock avaliable">В наличии <a class="card__right-stock-link" href="#description">Подробнее</a></p>`
          }
          <div class="card__right-dots">
          ${Object.keys(res["properties"])
            .map((el, index) => {
              if (index < 4) {
                return `
                <div class="dot">
                  <span class="dot__prop"><span>${el}</span></span>
                  <span class="dot__value">${res["properties"][el]}</span>
                </div>
              `;
              }
            })
            .join("")}
            <a href="#description" class="card__right-dots-button">
              Все характеристики
            </a>
          </div>
          <button class="card__right-button">
            В корзину
          </button>
          <div class="card__right-text">
            Самовывоз: 12 июня. Курьером: 14 июня, от 280 ₽
          </div>
        </div>
      </div>
    `;
    cardSection.insertAdjacentHTML("beforeend", element);
    const galleryThumbs = new Swiper(".swiper-images", {
      modules: [Pagination, Mousewheel],
      mousewheel: true,
      direction: "vertical",
      pagination: {
        el: ".card__left-pagination",
        clickable: true,
      },
    });
    const buttonShare = document.querySelector(".share");
    const wrapShare = document.querySelector(".share-wrap");
    const linksShare = document.querySelectorAll(".share-link");
    buttonShare.addEventListener("click", () => {
      wrapShare.classList.toggle("is-open");
    });
    const cardCharactersButton = document.querySelector(
      ".card__right-dots-button"
    );
    cardCharactersButton.addEventListener("click", () => {
      const pathsDescriptions = document.querySelectorAll(
        ".description__tabs-item"
      );
      pathsDescriptions.forEach((path) => {
        path.classList.remove("is-active");
        if (path.getAttribute("data-path") == "description-stats") {
          path.classList.add("is-active");
        }
      });
      const tabDescriptions = document.querySelectorAll(".description__tab");
      tabDescriptions.forEach((tab) => {
        tab.classList.remove("is-open");
        if (tab.getAttribute("data-target") == "description-stats") {
          tab.classList.add("is-open");
        }
      });
    });
    const cardStockButton = document.querySelector(".card__right-stock-link");
    cardStockButton.addEventListener("click", () => {
      const pathsDescriptions = document.querySelectorAll(
        ".description__tabs-item"
      );
      pathsDescriptions.forEach((path) => {
        path.classList.remove("is-active");
        if (path.getAttribute("data-path") == "description-avaliability") {
          path.classList.add("is-active");
        }
      });
      const tabDescriptions = document.querySelectorAll(".description__tab");
      tabDescriptions.forEach((tab) => {
        tab.classList.remove("is-open");
        if (tab.getAttribute("data-target") == "description-avaliability") {
          tab.classList.add("is-open");
        }
      });
    });
    const anchors = document.querySelectorAll('a[href*="#"]');
    for (let anchor of anchors) {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const anchorWithout = anchor.getAttribute("href").substr(1);
        if (!anchorWithout) return;
        const element = document.getElementById(anchorWithout);
        window.scroll({
          top: element.offsetTop - 147,
          behavior: "smooth",
        });
      });
    }
  }
  function refreshViewed(arr) {
    const viewedSection = document.querySelector(".viewed");
    viewedSection.children[0].remove();
    if (!arr) return;
    const viewedElement = `
    <div class="viewed__wrap container">
      <h2 class="viewed__title">
        Просмотренные товары
      </h2>
      <div class="swiper swiper-viewed">
        <ul class="viewed__list swiper-wrapper cards-list">
          ${arr
            .map((el) => {
              return `
              <li class="viewed__item swiper-slide card-item">
                <div class="card-item__wrap">
                  <a href="#" class="card-item__link">
                    <div class="card-item__photo-wrap">
                      <img src="${
                        serverName + el.img
                      }" alt="Фото товара" class="card-item__photo">
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
                      ${
                        el.PRICE["13"]
                          ? numberWithSpaces(el.PRICE["13"])
                          : numberWithSpaces(el.PRICE["5"])
                      } &#8381; <span>${numberWithSpaces(
                el.PRICE["1"]
              )} &#8381;</span>
                      </p>
                      <p class="card-item__description-text">
                        ${el.NAME}
                      </p>
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
                  <button class="card-item__button" data-id="asd">
                    В корзину
                  </button>
                </div>
              </li>`;
            })
            .join("")}
        </ul>
      </div>
    </div>
    `;
    viewedSection.insertAdjacentHTML("beforeend", viewedElement);
    const viewedSwiper = new Swiper(".swiper-viewed", {
      spaceBetween: 10,
      modules: [Navigation],
      navigation: {
        nextEl: ".viewed__swiper-button-next",
        prevEl: ".viewed__swiper-button-prev",
      },
      breakpoints: {
        1559: {
          slidesPerView: 5,
        },
        1439: {
          spaceBetween: 30,
          slidesPerView: 5,
        },
        1366: {
          slidesPerView: 4,
        },
        1023: {
          // spaceBetween: 30,
          slidesPerView: 3,
        },
        767: {
          spaceBetween: 20,
          slidesPerView: 3,
        },
        320: {
          // spaceBetween: 10,
          slidesPerView: 2,
        },
      },
    });
  }
  function refreshDescription(res) {
    const descriptionSection = document.querySelector(".description");
    descriptionSection.children[0].remove();
    const element = `
    <div class="description__wrap container">
      <ul class="description__tabs-list">
        <li class="description__tabs-item is-active" data-path="description-stats">
          Описание и характеристики
        </li>
        <li class="description__tabs-item" data-path="description-set">
          Товары в комплект
        </li>
        <li class="description__tabs-item" data-path="description-review">
          Отзывы
        </li>
        <li class="description__tabs-item" data-path="description-avaliability">
          Наличие в магазинах
        </li>
      </ul>
      <div class="description__tab is-open" data-target="description-stats">
        <div class="description__tab-stats-wrap">
          <div class="description__tab-stats-left">
            <div class="description__tab-dots">
            ${Object.keys(res["properties"])
              .map((el) => {
                return `
                <div class="dot">
                  <span class="dot__prop"><span>${el}</span></span>
                  <span class="dot__value">${res["properties"][el]}</span>
                </div>
              `;
              })
              .join("")}
            </div>
          </div>
          <div class="description__tab-stats-right">
            <div class="description__tab-text">
            ${res.DETAIL_TEXT}
            </div>
          </div>
        </div>
      </div>
        <div class="description__tab" data-target="description-set">
            <div class="swiper swiper-tab">
              <ul class="description__tab-set-result-list swiper-wrapper cards-list">
                
                <li class="description__tab-set-result-item swiper-slide card-item">
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
                <div class="description__tab-set-result-swiper-button-prev swiper-button-prev"></div>
                <div class="description__tab-set-result-swiper-button-next swiper-button-next"></div>
              </div>
        </div>
        <div class="description__tab" data-target="description-review"> 
          <div class="description__tab-review-wrap">
          ${
            res.reviews.length == 0
              ? `
            <div class="description__tab-review-empty">
              <h3 class="description__tab-review-title">
                Ваш отзыв будет первым!
              </h3>
              <p class="description__tab-review-text">
                Поделитесь опытом, помогите другим покупателям с выбором.
              </p>
              <button class="description__tab-review-button">
                Оставить отзыв
              </button>
            </div>
          `
              : `
              
              <div class="description__tab-review">
              <ul class="description__tab-review-list">
              ${res.reviews
                .map((review) => {
                  return `
                <li class="description__tab-review-item">
                  <div class="description__tab-review-user">
                    <p class="description__tab-review-user-avatar">
                    ${review.author
                      .split(" ")
                      .map(function (item) {
                        return item[0];
                      })
                      .join("")}</p>
                    <p class="description__tab-review-user-name">
                      ${review.author}
                    </p>
                    <div class="not-clicked-rate-wrap">
                      <span class="active"></span>    
                      <span class="active"></span>  
                      <span class="active"></span>    
                      <span class="active"></span>
                      <span></span>
                      <p class="not-clicked-rate-karma">
                        ${review.date}
                      </p>
                    </div>
                  </div>
                  <p class="description__tab-review-comment">
                  ${review.text}
                  </p>
                </li>
                `;
                })
                .join("")}
              </ul>
              <div class="description__tab-review-result">
                <div class="not-clicked-rate-wrap">
                  <span class="active"></span>    
                  <span class="active"></span>  
                  <span class="active"></span>    
                  <span class="active"></span>
                  <span></span>
                  <p class="not-clicked-rate-karma">
                    4.5/5
                  </p>
                </div>
                <div class="description__tab-review-starsby">
                  <div class="review-row">
                    <p class="label">5 звезд</p>
                    <div class="percent-line">
                      <div class="line"></div>
                    </div>
                    <div class="review-row-count">
                      8
                    </div>
                  </div>
                  <div class="review-row">
                    <p class="label">4 звезды</p>
                    <div class="percent-line">
                      <div class="line"></div>
                    </div>
                    <div class="review-row-count">
                      8
                    </div>
                  </div>
                  <div class="review-row">
                    <p class="label">3 звезды</p>
                    <div class="percent-line">
                      <div class="line"></div>
                    </div>
                    <div class="review-row-count">
                      8
                    </div>
                  </div>
                  <div class="review-row">
                    <p class="label">2 звезды</p>
                    <div class="percent-line">
                      <div class="line"></div>
                    </div>
                    <div class="review-row-count">
                      8
                    </div>
                  </div>
                  <div class="review-row">
                    <p class="label">1 звезда</p>
                    <div class="percent-line">
                      <div class="line"></div>
                    </div>
                    <div class="review-row-count">
                      8
                    </div>
                  </div>
                </div>
                <button class="description__tab-review-button">
                  Оставить отзыв
                </button>
              </div>
              `
          }
            </div>
          </div>
        </div>
        <div class="description__tab" data-target="description-avaliability">
          <div class="description__tab-avaliability-wrap">
            <ul class="description__tab-avaliability-list">
              <li class="description__tab-avaliability-item">
                <a href="#" class="description__tab-avaliability-link"> 
                  <address class="description__tab-avaliability-address">
                    г. Владимир, пр. Суздальский, д. 26
                  </address>
                  <p class="description__tab-avaliability-text">
                    Подробнее о магазине
                  </p>
                </a>
              </li>
              <li class="description__tab-avaliability-item">
                <a href="#" class="description__tab-avaliability-link"> 
                  <address class="description__tab-avaliability-address">
                    г. Владимир, пр. Суздальский, д. 26
                  </address>
                  <p class="description__tab-avaliability-text">
                    Подробнее о магазине
                  </p>
                </a>
              </li>
              <li class="description__tab-avaliability-item">
                <a href="#" class="description__tab-avaliability-link"> 
                  <address class="description__tab-avaliability-address">
                    г. Владимир, пр. Суздальский, д. 26
                  </address>
                  <p class="description__tab-avaliability-text">
                    Подробнее о магазине
                  </p>
                </a>
              </li>
              <li class="description__tab-avaliability-item">
                <a href="#" class="description__tab-avaliability-link"> 
                  <address class="description__tab-avaliability-address">
                    г. Владимир, пр. Суздальский, д. 26
                  </address>
                  <p class="description__tab-avaliability-text">
                    Подробнее о магазине
                  </p>
                </a>
              </li>
              <li class="description__tab-avaliability-item">
                <a href="#" class="description__tab-avaliability-link"> 
                  <address class="description__tab-avaliability-address">
                    г. Владимир, пр. Суздальский, д. 26
                  </address>
                  <p class="description__tab-avaliability-text">
                    Подробнее о магазине
                  </p>
                </a>
              </li>
            </ul>
          </div>
        </div>
    </div>
    `;
    descriptionSection.insertAdjacentHTML("beforeend", element);
    const tabSwiper = new Swiper(".swiper-tab", {
      spaceBetween: 10,
      modules: [Navigation],
      navigation: {
        nextEl: ".description__tab-set-result-swiper-button-next",
        prevEl: ".description__tab-set-result-swiper-button-prev",
      },
      breakpoints: {
        1559: {
          slidesPerView: 5,
        },
        1439: {
          spaceBetween: 30,
          slidesPerView: 5,
        },
        1366: {
          slidesPerView: 4,
        },
        1023: {
          // spaceBetween: 30,
          slidesPerView: 3,
        },
        767: {
          spaceBetween: 20,
          slidesPerView: 3,
        },
        320: {
          // spaceBetween: 10,
          slidesPerView: 2,
        },
      },
    });
    const pathsDescriptions = document.querySelectorAll(
      ".description__tabs-item"
    );
    const targetsDescriptions = document.querySelectorAll(".description__tab");
    pathsDescriptions.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("is-active")) return;
        pathsDescriptions.forEach((el) => el.classList.remove("is-active"));
        button.classList.add("is-active");
        const target = button.getAttribute("data-path");
        targetsDescriptions.forEach((el) => {
          el.classList.remove("is-open");
          if (el.getAttribute("data-target") == target)
            el.classList.add("is-open");
        });
      });
    });
  }
});
