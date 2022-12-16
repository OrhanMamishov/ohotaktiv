import "../imports";
import "../../styles/pages/card/style.scss";
import Swiper, { Mousewheel, Navigation, Pagination } from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import { bodyScrollToggle } from "../functions/scrollBody";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import { getUserData } from "../functions/getUserData";
import { generatePrice } from "../functions/generatePrice";
import { generateCard } from "../functions/generateCard";
import { showMessage } from "../functions/showMessage";
import Inputmask from "inputmask";

document.addEventListener("DOMContentLoaded", async () => {
  const idGood = document.location.search.split("?id=")[1];
  const userInfo = await getUserData();
  let accordion;
  const serverName = "https://ohotaktiv.ru";
  const arrayFromBase = await fetch(
    `https://ohotaktiv.ru/12dev/new-design/pages/card/hand.php?the_id=${idGood}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      refreshCard(res);
      refreshDescription(res);
      refreshViewed(userInfo.viewed);
    });
  // Функции
  function refreshCard(res) {
    const cardSection = document.querySelector(".card");
    while (cardSection.firstChild) {
      cardSection.removeChild(cardSection.firstChild);
    }
    const isInFavourite = userInfo
      ? userInfo.favorites
        ? Object.keys(userInfo.favorites).includes(idGood)
        : false
      : false;
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
            ${
              res["Картинки"]
                ? res["Картинки"]
                    .map((img) => {
                      return `
                <li class="card__left-slide swiper-slide">
                  <img data-fancybox="gallery" src="${serverName + img}" alt="${
                        res.NAME
                      }" class="card__img-big">
                </li>
              `;
                    })
                    .join("")
                : `
                  <li class="card__left-slide swiper-slide">
                    <img data-fancybox="gallery" src="${
                      serverName + `/local/templates/ohota2021/img/no_photo.png`
                    }" alt="${res.NAME}" class="card__img-big">
                  </li>
                `
            }
            </ul>
            <div class="card__left-pagination swiper-pagination"></div>
            <div class="card__left-infoblock">
            ${
              res.properties &&
              res.properties["ИМ Лицензия"] &&
              res.properties["ИМ Лицензия"] == "true"
                ? `
                <p class="card__left-infoblock-text license">
                  Лицензионный товар
                </p>
            `
                : ``
            }
              <div class="card-item__photo-button-wrap">
                <button class="card-item__photo-button share"></button>
                <button class="card-item__photo-button card favourite ${
                  isInFavourite ? "is-in" : ""
                }"></button>
                <div class="share-wrap">
                  <a href="http://vk.com/share.php?url=${
                    document.location
                  }" class="share-link vk" target="_blank">
                    VK
                  </a>
                  <a href="https://t.me/share/url?url=${
                    document.location
                  }&text=${
      res.NAME
    } - Купить по низкой цене в интернет-магазине ОхотАктив" class="share-link tg" target="_blank">
                    Telegram
                  </a>
                  <a href="https://connect.ok.ru/offer?url=${
                    document.location
                  }&title=${res.NAME}" class="share-link ok" target="_blank">
                    Одноклассники
                  </a>
                  <a href="viber://forward?text=${
                    res.NAME
                  } - Купить по низкой цене в интернет-магазине ОхотАктив ${
      document.location
    }" class="share-link viber" target="_blank">
                    Viber
                  </a>
                  <a href="https://api.whatsapp.com/send?text=${
                    res.NAME
                  } - Купить по низкой цене в интернет-магазине ОхотАктив ${
      document.location
    }" class="share-link whatsapp" target="_blank">
                    Whatsapp
                  </a>
                  <a href="https://web.skype.com/share?url=${
                    document.location
                  }" class="share-link skype" target="_blank">
                    Skype
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
          ${
            res["manufacturer"]
              ? `
            <p class="card__right-brand">
              ${res["manufacturer"]}
            </p>
            `
              : ``
          }
          <h1 class="card__right-name">
            ${res["NAME"]}
          </h1>
          <p class="card__right-article">
            ${res["barcode"] ? `Артикул: ${res["barcode"]}.` : ``} ${
      res["product_code"] ? `Код: ${res["product_code"]}` : ``
    }
          </p>
          <p class="card__right-reviews">${
            res["reviews"] ? res["reviews"].length : 0
          } отз.
          </p>
          ${
            res["warehouse"] == "0" && !res["Наличие в магазине"]
              ? `<div class="card__right-text">
                Цена последней поставки:
              </div>`
              : ""
          }
          <p class="card__right-price">
            ${generatePrice(res)}
          </p>
          ${
            res["warehouse"] == "0" && !res["Наличие в магазине"]
              ? `<p class="card__right-stock not-avaliable">Нет в наличии</p>`
              : `<p class="card__right-stock avaliable">В наличии <a class="card__right-stock-link" href="#description">Подробнее</a></p>`
          }
          <div class="card__right-dots">
          ${
            res.properties
              ? res.properties.print
                ? Object.keys(res.properties.print)
                    .map((el, index) => {
                      if (index < 4) {
                        return `
                        <div class="dot">
                          <span class="dot__prop"><span>${el}</span></span>
                          <span class="dot__value">${
                            res.properties.print[el] == "true"
                              ? "Да"
                              : res.properties.print[el] == "false"
                              ? "Нет"
                              : res.properties.print[el]
                          }</span>
                        </div>
                      `;
                      }
                    })
                    .join("")
                : ``
              : ``
          }
          ${
            res.properties
              ? res.properties.print
                ? Object.keys(res.properties.print).length > 4
                  ? `
                <a href="#description" class="card__right-dots-button">
                  Все характеристики
                </a>
            `
                  : ``
                : ``
              : ``
          }
          </div>
          <button class="card__right-button" ${
            res["warehouse"] == "0" && !res["Наличие в магазине"]
              ? `data-available="not-available"`
              : ""
          }>
            ${
              res["warehouse"] == "0" && !res["Наличие в магазине"]
                ? "Подобрать аналог"
                : "В корзину"
            }
          </button>
        </div>
      </div>
    `;
    cardSection.insertAdjacentHTML("beforeend", element);
    const wrapShare = document.querySelector(".share-wrap");
    cardSection.addEventListener("click", async (e) => {
      const withinBoundaries = e.composedPath().includes(wrapShare);
      if (e.target.className == "card__right-button") {
        if (e.target.getAttribute("data-available") == "not-available") {
          openPopupAnalogue();
        }
      }
      if (e.target.classList.contains("share-link")) {
        wrapShare.classList.toggle("is-open");
      }
      if (e.target.className == "card-item__photo-button share") {
        wrapShare.classList.toggle("is-open");
      }
      if (e.target.className == "share-link button") {
        navigator.clipboard
          .writeText(document.location)
          .then(() => {
            showMessage(
              "Ссылка скопирована!",
              "Ссылка скопирована в буфер обмена!",
              "success"
            );
          })
          .catch((err) => {
            showMessage("Ошибка!", err, "error");
          });
      }
      if (
        e.target.className == "card-item__photo-button card favourite " ||
        e.target.className == "card-item__photo-button card favourite is-in"
      ) {
        e.target.classList.toggle("is-in");
        let userInfo = await getUserData();
        if (userInfo.personal.ID == null) {
        } else {
          await fetch(
            `https://ohotaktiv.ru/local/ajax/fav_2.php?p_id=${idGood}`,
            {
              method: "GET",
              mode: "no-cors",
            }
          ).then(async () => {
            if (!e.target.classList.contains("is-in")) {
              showMessage(
                "Товар убран!",
                "Товар убран из избранного",
                "success"
              );
            } else {
              showMessage(
                "Товар добавлен!",
                "Товар успешно добавлен в избранное",
                "success"
              );
            }
          });
        }
      }
      if (
        !withinBoundaries &&
        e.target.className !== "card-item__photo-button share"
      ) {
        wrapShare.classList.remove("is-open");
      }
    });
    // свайпер
    const galleryThumbs = new Swiper(".swiper-images", {
      modules: [Pagination, Mousewheel],
      mousewheel: true,
      pagination: {
        el: ".card__left-pagination",
        clickable: true,
      },
      breakpoints: {
        1023: {
          direction: "vertical",
        },
        320: {
          spaceBetween: 20,
          direction: "horizontal",
        },
      },
    });
    Fancybox.bind('[data-fancybox="gallery"]', {
      animated: false,
      showClass: false,
      hideClass: false,
      click: false,
      dragToClose: false,
      Image: {
        zoom: false,
      },
      Toolbar: {
        display: [{ id: "counter", position: "center" }, "close"],
      },
    });
    // кнопка расшарить

    // кнопки все характеристики и подробнее
    const cardCharactersButton = document.querySelector(
      ".card__right-dots-button"
    );
    if (cardCharactersButton) {
      cardCharactersButton.addEventListener("click", () => {
        accordion.closeAll();
        accordion.open(0);
      });
    }
    const cardStockButton = document.querySelector(".card__right-stock-link");
    if (cardStockButton) {
      cardStockButton.addEventListener("click", () => {
        accordion.closeAll();
        accordion.open(document.querySelectorAll(".js-enabled").length - 1);
      });
    }
    // плавные ссылки
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
            ${Object.entries(arr)
              .map((el) => {
                return generateCard(el, ["favourite"], false, userInfo);
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
    <h2 class="visually-hidden">Описание товара</h2>
    <div class="accordion-container">
    ${
      (res.properties && res.properties.print) ||
      (res.DETAIL_TEXT && res.DETAIL_TEXT.length > 50)
        ? `
        <div class="ac">
          <p class="ac-header">
            <button type="button" class="ac-trigger">
              Описание и характеристики
            </button>
          </p>
          <div class="ac-panel">
            <div class="description__panel">
              <div class="description__stats">
                <div class="description__stats-left">
                  <div class="description__stats-dots">
                  ${
                    res.properties
                      ? res.properties.print
                        ? Object.keys(res.properties.print)
                            .map((el) => {
                              return `
                        <div class="dot">
                          <span class="dot__prop"><span>${el}</span></span>
                          <span class="dot__value">${
                            res.properties.print[el] == "true"
                              ? "Да"
                              : res.properties.print[el] == "false"
                              ? "Нет"
                              : res.properties.print[el]
                          }</span>
                        </div>
                      `;
                            })
                            .join("")
                        : ``
                      : ``
                  }
                  </div>
                </div>
                <div class="description__stats-right">
                  ${res.DETAIL_TEXT}
                </div>
              </div>
            </div>
          </div>
        </div>
        `
        : ``
    }
      <div class="ac">
        <p class="ac-header">
          <button type="button" class="ac-trigger">Отзывы</button>
        </p>
        <div class="ac-panel">
          <div class="description__panel">
            <div class="description__review-wrap">
              ${
                res.reviews
                  ? res.reviews.cnt_reviews == 0
                    ? `
                  <div class="description__review-empty">
                    <h3 class="description__review-title">
                      Ваш отзыв будет первым!
                    </h3>
                    <p class="description__review-text">
                      Поделитесь опытом, помогите другим покупателям с
                      выбором.
                    </p>
                    <button class="description__review-button">
                      Оставить отзыв
                    </button>
                  </div>
                `
                    : `
                <div class="description__review">
                  <ul class="description__review-list">
                  ${Object.values(res.reviews)
                    .map((review) => {
                      if (typeof review === "object") {
                        return `
                            <li class="description__review-item">
                              <div class="description__review-user">
                                <p class="description__review-user-avatar">
                                ${review.author
                                  .split(" ")
                                  .map(function (item) {
                                    return item[0];
                                  })
                                  .join("")}</p>
                                <p class="description__review-user-name">
                                  ${review.author}
                                </p>
                                <div class="not-clicked-rate-wrap">
                                  <span class="active"></span>
                                  <span class="active"></span>
                                  <span class="active"></span>
                                  <span class="active"></span>
                                  <span></span>
                                </div>
                              </div>
                              <p class="description__review-comment">
                                ${review.text}
                              </p>
                              <p class="description__review-date">
                                ${review.date}
                              </p>
                            </li>
                        `;
                      }
                    })
                    .join("")}
                  </ul>
                  <div class="description__review-result">
                    <div class="not-clicked-rate-wrap">
                      <p class="not-clicked-rate-karma">Средняя оценка 4.5/5</p>
                    </div>
                    <div class="description__review-starsby">
                      <div class="review-row">
                        <p class="label">5 звезд</p>
                        <div class="percent-line">
                          <div class="line"></div>
                        </div>
                        <div class="review-row-count">8</div>
                      </div>
                      <div class="review-row">
                        <p class="label">4 звезды</p>
                        <div class="percent-line">
                          <div class="line"></div>
                        </div>
                        <div class="review-row-count">8</div>
                      </div>
                      <div class="review-row">
                        <p class="label">3 звезды</p>
                        <div class="percent-line">
                          <div class="line"></div>
                        </div>
                        <div class="review-row-count">8</div>
                      </div>
                      <div class="review-row">
                        <p class="label">2 звезды</p>
                        <div class="percent-line">
                          <div class="line"></div>
                        </div>
                        <div class="review-row-count">8</div>
                      </div>
                      <div class="review-row">
                        <p class="label">1 звезда</p>
                        <div class="percent-line">
                          <div class="line"></div>
                        </div>
                        <div class="review-row-count">8</div>
                      </div>
                    </div>
                    <button class="description__review-button">
                      Оставить отзыв
                    </button>
                  </div>
                </div>
                `
                  : `
                    <div class="description__review-empty">
                      <h3 class="description__review-title">
                        Ваш отзыв будет первым!
                      </h3>
                      <p class="description__review-text">
                        Поделитесь опытом, помогите другим покупателям с
                        выбором.
                      </p>
                      <button class="description__review-button">
                        Оставить отзыв
                      </button>
                    </div>
                `
              }
            </div>
          </div>
        </div>
      </div>
      ${
        res["Наличие в магазине"] || res.warehouse !== "0"
          ? `
      <div class="ac">
      <p class="ac-header">
        <button type="button" class="ac-trigger">
          Наличие в магазинах
        </button>
      </p>
      <div class="ac-panel">
        <div class="description__panel">
          <div class="description__availability">
            <ul class="description__availability-list">
            ${
              res.warehouse !== "0"
                ? `
              <li class="description__availability-item">
                <a href="#" class="description__availability-link sklad">
                  <address class="description__availability-address">
                    г. Кострома, ул. Юбилейная д.28
                  </address>
                  <p class="description__availability-text">
                    Склад
                  </p>
                </a>
              </li>
            `
                : ``
            }
              ${
                res["Наличие в магазине"]
                  ? Object.entries(res["Наличие в магазине"])
                      .map((shop) => {
                        return `
                  <li class="description__availability-item">
                    <a href="../viewshop?id=${shop[0]}" class="description__availability-link" target="_blank">
                      <address class="description__availability-address">
                        ${shop[1].NAME}
                      </address>
                      <p class="description__availability-text">
                        Подробнее о магазине
                      </p>
                    </a>
                  </li>
                `;
                      })
                      .join("")
                  : ``
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
      `
          : ``
      }
      
    </div>
  </div>
    
    `;
    descriptionSection.insertAdjacentHTML("beforeend", element);
    accordion = new Accordion(".accordion-container");
    accordion.open(0);
    const tabSwiper = new Swiper(".swiper-set", {
      spaceBetween: 10,
      modules: [Navigation],
      navigation: {
        nextEl: ".description__set-swiper-button-next",
        prevEl: ".description__set-swiper-button-prev",
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
    // форма с отзывом
    const reviewButton = document.querySelector(".description__review-button");
    reviewButton.addEventListener("click", () => {
      bodyScrollToggle();
      const popupElement = `
      <div id="popup-review" class="popup">
        <div class="popup__background"></div>
          <div class="popup__wrap">
            <button class="popup__wrap-close"></button>
            <h2 class="popup__wrap-title">
              Поделитесь вашим мнением
            </h2>
            <div class="clicked-rate">
              <input class="rate-check" type="radio" id="star-5" name="rating" value="5">
              <label for="star-5" title="Оценка «5»"></label>
              <input class="rate-check" type="radio" id="star-4" name="rating" value="4">
              <label for="star-4" title="Оценка «4»"></label>
              <input class="rate-check" type="radio" id="star-3" name="rating" value="3">
              <label for="star-3" title="Оценка «3»"></label>
              <input class="rate-check" type="radio" id="star-2" name="rating" value="2">
              <label for="star-2" title="Оценка «2»"></label>
              <input class="rate-check" type="radio" id="star-1" name="rating" value="1">
              <label for="star-1" title="Оценка «1»"></label>
            </div>
            <form action="#" class="popup__form">
              <h3 class="popup__wrap-subtitle">
                Как вам товар?
              </h3>
              <textarea rows="5" class="popup__form-textarea" placeholder="Ваш подробный отзыв поможет другим покупателям определиться с выбором"></textarea>
              <p class="popup__form-text">
                Перед отправкой отзыва на модерацию, ознакомьтесь с <a href="#" class="popup_link">Правилами публикации</a>
              </p>
              <button id="review-button-confirm" class="popup__wrap-button">
                Оставить отзыв
              </button>
            </form>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", popupElement);
      const popupReview = document.getElementById("popup-review");
      const reviewPostButton = document.getElementById("review-button-confirm");
      reviewPostButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const attention = document.querySelector(".attention");
        if (attention) attention.remove();
        const stars = document.querySelectorAll(".rate-check");
        const popupForm = document.querySelector(".popup__form");
        let rate = "";
        stars.forEach((star) => {
          if (star.checked) {
            rate = star.value;
          }
        });
        if (!rate) {
          const attentionElement = `
            <p class="attention">Оценка не выставлена, пожалуйста поставьте оценку</p>
          `;
          popupForm.insertAdjacentHTML("beforeend", attentionElement);
          return;
        }
        const textArea = document.querySelector(".popup__form-textarea");
        textArea.addEventListener("input", () => {
          textArea.classList.remove("is-not-valid");
        });
        if (!textArea.value) {
          textArea.classList.add("is-not-valid");
          const attentionElement = `
            <p class="attention">Заполните поле</p>
          `;
          popupForm.insertAdjacentHTML("beforeend", attentionElement);
          return;
        }
        try {
          await fetch(
            "https://ohotaktiv.ru/12dev/new-design/pages/card/review.php",
            {
              method: "POST",
              body: JSON.stringify({
                goodId: "231822",
                userId: "4307",
                stars: rate,
                textReview: textArea.value,
              }),
            }
          )
            .then((res) => res.json())
            .then((res) => {
              if (res == 200) {
                popupReview.remove();
                showMessage(
                  "Отзыв оставлен!",
                  "Спасибо за ваш отзыв! Отзыв будет опубликован после модерации.",
                  "success"
                );
              } else {
                showMessage(
                  "Ошибка!",
                  `Произошла ошибка. Пожалуйста обратитесь в службу поддержки. Код ошибки: ${res}.`,
                  "error"
                );
              }
            });
        } catch (err) {
          showMessage(
            "Ошибка!",
            `Произошла ошибка. Пожалуйста обратитесь в службу поддержки. Код ошибки: ${err}.`,
            "error"
          );
        }
      });
    });
  }
  function openPopupAnalogue() {
    const element = `
    <div id="popup-analog" class="popup">
      <div class="popup__background"></div>
      <div class="popup__wrap">
        <button class="popup__wrap-close"></button>
        <p class="popup__wrap-title">
          Подобрать аналог
        </p>
        <form action="#" class="popup__form">
          <p class="popup__wrap-subtitle">
            Заказать звонок для подбора аналога
          </p>
          <div class="input-wrap">
            <input class="popup__wrap-input" id="client-tel-input" type="text" placeholder=" " autocomplete="off">
            <label for="client-tel-input">Введите номер телефона</label>
          </div>
          <label class="checkbox__label">
            Нажимая кнопку «Заказать звонок», вы соглашаетесь с условиями политики конфиденциальности
            <input
              type="checkbox"
              class="checkbox visually-hidden"
              value=""
            />
            <span class="checkbox__span"></span>
          </label>
          <div class="buttons-wrap">
            <button id="submit-button" class="popup__wrap-button">
              Заказать звонок
            </button>
          </div>             
        </form>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", element);
    const popupAnalog = document.getElementById("popup-analog");
    const telInput = document.getElementById("client-tel-input");
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
    popupAnalog.addEventListener("click", async (e) => {
      if (e.target.id == "submit-button") {
        e.preventDefault();
        const checkbox = document.querySelector(".checkbox");
        if (!telInput.value.length) telInput.classList.add("is-not-valid");
        if (checkbox.checked) {
          document
            .querySelector(".checkbox__span")
            .classList.remove("is-not-valid");
        } else {
          document
            .querySelector(".checkbox__span")
            .classList.add("is-not-valid");
        }
        const isNotValid = document.querySelectorAll(".is-not-valid");
        if (!isNotValid.length) {
          console.log("POST");
          // const changeDataFetch = await fetch(
          //   `https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?change_user_info=change&name=${nameInput.value}&last_name=${surnameInput.value}&phone=${telInput.value}&address=${addressInput.value}`,
          //   {
          //     method: "GET",
          //   }
          // )
          //   .then((res) => res.json())
          //   .then((res) => {
          //     if (res == true) {
          //       e.target.setAttribute("disabled", true);
          //       refreshThisPage("profile", "", true);
          //       popupUserdata.remove();
          //       showMessage(
          //         "Данные успешно обновлены!",
          //         "Ваши данные обновлены",
          //         "success"
          //       );
          //     } else {
          //       e.target.removeAttribute("disabled");
          //       showMessage("Ошибка!", res, "error");
          //     }
          //   });
        }
      }
    });
  }
});
