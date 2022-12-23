import "../imports";
import "../../styles/pages/cabinet/style.scss";
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import Inputmask from "inputmask";
import { bodyScrollToggle } from "../functions/scrollBody";
import { phoneFormat } from "../functions/phoneFormat";
import { showMessage } from "../functions/showMessage";
import QRCodeStyling from "qr-code-styling";
import { numberWithSpaces } from "../../scripts/functions/numberWithSpaces";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { generateCard } from "../functions/generateCard";
import { getUserData } from "../functions/getUserData";
import { updateCountGoods } from "../functions/updateCountGoods";

document.addEventListener("DOMContentLoaded", async () => {
  let userInfo = await getUserData();
  if (!document.location.search && userInfo.personal.ID == null) {
    const baseUrl = document.location.href.split("?")[0];
    const newUrl = baseUrl + "?block=favourites";
    history.pushState(null, null, newUrl);
  }
  if (userInfo.personal.ID == null) {
    const baseUrl = document.location.href.split("?")[0];
    const newUrl = baseUrl + "?block=favourites";
    history.pushState(null, null, newUrl);
  }
  const serverName = "https://ohotaktiv.ru";
  const main = document.querySelector("main");
  refreshCabinet(userInfo);
  async function refreshThisPage(page, data, clicked) {
    let pageElement = ``;
    let subscriptions;
    if (clicked) data = await getUserData();
    switch (page) {
      case "profile":
        pageElement = `
        <div class="cabinet__target" data-target="profile">
          <h2 class="cabinet__profile-title">Личные данные</h2>
          <div class="cabinet__profile-blocks">
            <div id="block-profile" class="cabinet__profile-block">
                <p class="cabinet__profile-block-user-name">
                  ${data.personal.NAME ? data.personal.NAME : ""} ${
          data.personal.LAST_NAME ? data.personal.LAST_NAME : ""
        }
                </p>
                <p class="cabinet__profile-block-user-birthdate">
                  ${
                    data.personal.BIRTHDAY
                      ? data.personal.BIRTHDAY
                      : "Не указано"
                  }
                </p>
                <p class="cabinet__profile-block-text">
                  <span>Телефон: </span> ${
                    data.personal.PERSONAL_PHONE
                      ? phoneFormat(data.personal.PERSONAL_PHONE)
                      : "Не указано"
                  }
                </p>
                <p class="cabinet__profile-block-text">
                  <span>Почта: </span> ${
                    data.personal.EMAIL ? data.personal.EMAIL : "Не указано"
                  }
                </p>
                <p class="cabinet__profile-block-text">
                <span>Адрес доставки: </span> ${
                  data.personal.PERSONAL_CITY
                    ? data.personal.PERSONAL_CITY
                    : "Не указано"
                }
              </p>
                <button id="change-user-data" class="cabinet__profile-block-button">
                  Изменить данные
                </button>
              </div>
              <div class="cabinet__profile-block">
                <p class="cabinet__profile-block-title">Бонусная карта</p>
                ${
                  data.personal.MEMBER_CARD
                    ? `<div class="qrcode"></div>`
                    : `
                <p class="cabinet__profile-block-text">
                  Если у вас есть бонусная карта, вы можете добавить её здесь и
                  продолжать покупки со скидкой
                </p>
                <button id="append-card" class="cabinet__profile-block-button background--transparent">
                  Добавить или приобрести карту
                </button>
                `
                }
              </div>
            </div>
          </div>
        `;
        break;
      case "subscription":
        await fetch(
          "https://api.mindbox.ru/v3/operations/sync?endpointId=ohotaktiv-website&operation=Website.GetSubscriptionInfo",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Mindbox secretKey="RTh6yZ1o696DtaSS8RDA"`,
            },
            body: JSON.stringify({
              customer: {
                ids: {
                  websiteID: data.personal.ID,
                },
              },
            }),
          }
        )
          .then((res) => res.json())
          .then((res) => {
            subscriptions = res.customer.subscriptions;
          });
        pageElement = `
          <div class="cabinet__target" data-target="subscription">
            <h2 class="cabinet__profile-title">Управление подпиской</h2>
            <p class="cabinet__subscription-text">
              Письма будут приходить на Email указанный в профиле. Вы в любой
              момент сможете настроить частоту рассылки или отказаться от неё.
            </p>
            <ul class="cabinet__subscription-list">
              <li class="cabinet__subscription-item">
                <p class="cabinet__subscription-item-title">
                  СМС-уведомления
                </p>
                <p class="cabinet__subscription-item-text">
                  Информация о предстоящих акциях, скидках и новинках
                </p>
                <label class="switch">
                  <input type="checkbox" ${
                    subscriptions.filter(
                      (sub) => sub.pointOfContact == "Sms"
                    )[2].isSubscribed
                      ? "checked"
                      : ""
                  }/>
                  <span class="slider" data-subscribe="Sms"></span>
                </label>
              </li>
              <li class="cabinet__subscription-item">
                <p class="cabinet__subscription-item-title">
                  Email-уведомления
                </p>
                <p class="cabinet__subscription-item-text">
                  Персональные скидки, подборки товаров по вашим интересам
                </p>
                <label class="switch">
                  <input type="checkbox" ${
                    subscriptions.filter(
                      (sub) => sub.pointOfContact == "Email"
                    )[2].isSubscribed
                      ? "checked"
                      : ""
                  }/>
                  <span class="slider" data-subscribe="Email"></span>
                </label>
              </li>
            </ul>
          </div>
        `;
        break;
      case "ad":
        pageElement = `
          <div class="cabinet__target" data-target="ad">
            <h2 class="cabinet__profile-title">Мои объявления</h2>
            <p class="cabinet__ad-text">У вас пока нет ни одного объявления</p>
            <button id="ad-post-button" class="cabinet__ad-button">Разместить</button>
          </div>
        `;
        break;
      case "orders":
        pageElement = `
          <div class="cabinet__target" data-target="orders">
            <h2 class="cabinet__profile-title">Мои заказы</h2>
            ${
              data.orders
                ? `
                <ul class="cabinet__orders-list">
                ${
                  data.orders
                    ? Object.entries(data.orders)
                        .reverse()
                        .map((order) => {
                          return `
                            <li class="cabinet__orders-item">
                              <p class="cabinet__orders-item-title ${
                                order[1].STATUS_ID !== "Отменен" ||
                                order[1].STATUS_ID !== "Выполнен"
                                  ? ``
                                  : `is-worked`
                              }">
                                Заказ №${order[0]} <span>Дата создания: ${
                            order[1].DATE_CREATE.split(" ")[0]
                          }</span>
                              </p>
                              ${
                                order[1].cart
                                  ? order[1].cart
                                      .map((el) => {
                                        `
                                          <li class="order__left-block-card">
                                            <div class="order__left-block-img-wrap">
                                              <img src="${el.img}" alt="${
                                          el.name
                                        }" class="order__left-block-img">
                                            </div>
                                            <div class="order__left-block-description">
                                              <p class="order__left-block-price">
                                              ${numberWithSpaces(
                                                el.startedPrice * el.count
                                              )} &#8381
                                              </p>
                                              <p class="order__left-block-description-text">
                                                ${el.name}
                                              </p>
                                              <p class="order__left-block-cards-item-text">
                                                Кол-во: ${el.count}
                                              </p>
                                            </div>
                                          </li>

                                        `;
                                        return `
                                <div class="cabinet__orders-item-panel">
                                  <div class="cabinet__orders-item-panel-img-wrap">
                                    <img
                                      class="cabinet__orders-item-panel-img"
                                      src="${serverName}${
                                          el.PREVIEW_PICTURE
                                            ? el.PREVIEW_PICTURE
                                            : `/local/templates/ohota2021/img/no_photo.png`
                                        }"
                                      alt="${el.NAME}"
                                    />
                                  </div>
                                  <div class="cabinet__orders-item-panel-status">
                                    <p class="cabinet__orders-item-panel-status-price">
                                      ${numberWithSpaces(
                                        Number(el.FINAL_PRICE) *
                                          Number(el.QUANTITY)
                                      )} &#8381;
                                    </p>
                                    <p class="cabinet__orders-item-panel-status-text">
                                      ${el.NAME}
                                    </p>
                                    <p class="cabinet__orders-item-panel-status-text">Кол-во: ${Number(
                                      el.QUANTITY
                                    )} шт.</p>
                                  </div>
                                </div>
                                `;
                                      })
                                      .join("")
                                  : `Товары отсутствуют`
                              }
    
                            </li>
                          `;
                        })
                        .join("")
                    : ``
                }
                </ul>
                `
                : `<p class="cabinet__text">У вас пока нет заказов</p>`
            }
          </div>
          `;
        break;
      case "favourites":
        pageElement = `
          <div class="cabinet__target" data-target="favourites">
            <h2 class="cabinet__profile-title">Избранное</h2>
            ${
              data.favorites
                ? `
                <div class="swiper swiper-favourite">
                <ul class="cabinet__favourites-list swiper-wrapper cards-list">
                  ${Object.entries(data.favorites)
                    .map((favourite) => {
                      return generateCard(favourite, ["remove"], false, data);
                    })
                    .join("")}
                </ul>
                <div
                  class="cabinet__favourites-swiper-button-prev swiper-button-prev"
                ></div>
                <div
                  class="cabinet__favourites-swiper-button-next swiper-button-next"
                ></div>
                <div
                  class="cabinet__favourites-pagination swiper-pagination"
                ></div>
                </div>
                  `
                : `<p class="cabinet__text">У вас пока нет товаров в избранных. ${
                    userInfo.personal.ID == null
                      ? `Для получения большего функционала, пожалуйста <button class="authorize-button">авторизуйтесь.</button>`
                      : ``
                  }</p>`
            }
          `;
        break;
    }
    if (clicked) {
      const cabinetTarget = document.querySelector(".cabinet__target");
      const cabinetWrap = document.querySelector(".cabinet__wrap");
      cabinetTarget.remove();
      cabinetWrap.insertAdjacentHTML("beforeend", pageElement);
      const qrCodeWrap = document.querySelector(".qrcode");
      if (qrCodeWrap) generateQrCode(data.personal.MEMBER_CARD);
      const favouriteSwiper = document.querySelector(".swiper-favourite");
      if (favouriteSwiper) {
        new Swiper(favouriteSwiper, {
          spaceBetween: 10,
          modules: [Navigation, Pagination],
          navigation: {
            nextEl: ".cabinet__favourites-swiper-button-next",
            prevEl: ".cabinet__favourites-swiper-button-prev",
          },
          pagination: {
            el: ".cabinet__favourites-pagination",
            clickable: true,
          },
          breakpoints: {
            1560: {
              spaceBetween: 13,
              slidesPerView: 4,
            },
            1366: {
              slidesPerView: 3,
            },
            1023: {
              slidesPerView: 2,
            },
            767: {
              spaceBetween: 20,
              slidesPerView: 3,
            },
            320: {
              slidesPerView: 2,
            },
          },
        });
      }
    } else {
      return pageElement;
    }
  }
  async function refreshCabinet(data) {
    const thisPage = document.location.search.split("=")[1];
    const element = `
      <section class="cabinet">
        <div class="cabinet__wrap container">
          <div class="hamburger-lines">
            <span class="line line1"></span>
            <span class="line line2"></span>
            <span class="line line3"></span>
          </div>
          <div class="cabinet__left">
            <p class="cabinet__profile-user-name">Меню ID</p>
            ${
              userInfo.personal.ID !== null
                ? `
                <ul class="tabs__list">
                  <li class="tabs__item" data-path="profile">Личные данные</li>
                  <li class="tabs__item" data-path="subscription">
                    Управление подпиской
                  </li>
                  <li class="tabs__item" data-path="ad">Мои объявления</li>
                  <li class="tabs__item" data-path="orders">Мои заказы</li>
                  <li class="tabs__item" data-path="favourites">Избранное</li>
                  <li class="tabs__item" data-path="logout">Выйти из профиля</li>
                  <li class="tabs__item" data-path="delete">Удалить аккаунт</li>
                </ul>
            `
                : `
                <ul class="tabs__list">
                  <li class="tabs__item" data-path="favourites">Избранное</li>
                </ul>
                `
            }

          </div>
          ${await refreshThisPage(thisPage, data, false)}
        </div>
      </section>
    `;
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.insertAdjacentHTML("beforeend", element);
    const qrCodeWrap = document.querySelector(".qrcode");
    if (qrCodeWrap) generateQrCode(data.personal.MEMBER_CARD);
    const favouriteSwiper = document.querySelector(".swiper-favourite");
    if (favouriteSwiper) {
      new Swiper(favouriteSwiper, {
        spaceBetween: 10,
        modules: [Navigation, Pagination],
        navigation: {
          nextEl: ".cabinet__favourites-swiper-button-next",
          prevEl: ".cabinet__favourites-swiper-button-prev",
        },
        pagination: {
          el: ".cabinet__favourites-pagination",
          clickable: true,
        },
        breakpoints: {
          1560: {
            spaceBetween: 13,
            slidesPerView: 4,
          },
          1366: {
            slidesPerView: 3,
          },
          1023: {
            slidesPerView: 2,
          },
          767: {
            spaceBetween: 20,
            slidesPerView: 3,
          },
          320: {
            slidesPerView: 2,
          },
        },
      });
    }
    const hashPath = document.querySelector(
      `[data-path = ${document.location.search ? thisPage : `profile`}]`
    );
    if (hashPath) hashPath.classList.add("is-active");
    main.addEventListener("click", async (e) => {
      if (e.target.id == "change-user-data") {
        openPopupChangeUserData();
      }
      if (e.target.classList.contains("tabs__item")) {
        if (e.target.classList.contains("is-active")) return;
        if (e.target.getAttribute("data-path") == "logout") {
          window.location.href =
            "https://ohotaktiv.ru/12dev/new-design/pages/index/?logout=yes";
          return;
        }
        const baseUrl = document.location.href.split("?")[0];
        const newUrl = baseUrl + "?block=" + e.target.getAttribute("data-path");
        history.pushState(null, null, newUrl);
        const tabsList = document.querySelectorAll(".tabs__item");
        tabsList.forEach((tab) => tab.classList.remove("is-active"));
        e.target.classList.add("is-active");
        refreshThisPage(e.target.getAttribute("data-path"), "", true);
      }
      if (e.target.id == "ad-post-button") {
        openPopupAd();
      }
      if (e.target.className == "card-item__photo-button remove ") {
        await fetch(
          `https://ohotaktiv.ru/local/ajax/fav_2.php?p_id=${
            e.target.parentElement.parentElement.children[
              e.target.parentElement.parentElement.children.length - 1
            ].id
          }`,
          {
            method: "GET",
            mode: "no-cors",
          }
        );
        refreshThisPage("favourites", "", true);
        showMessage("Товар убран!", "Товар убран из избранного", "success");
        updateCountGoods(await getUserData());
      }
      if (e.target.id == "append-card") {
        openPopupCard();
      }
      if (e.target.className == "slider") {
        await fetch(
          "https://api.mindbox.ru/v3/operations/sync?endpointId=ohotaktiv-website&operation=Website.EditCustomer",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Mindbox secretKey="RTh6yZ1o696DtaSS8RDA"`,
            },
            body: JSON.stringify({
              customer: {
                ids: {
                  websiteID: data.personal.ID,
                },
                subscriptions: [
                  {
                    pointOfContact: e.target.getAttribute("data-subscribe"),
                    topic: 1,
                    isSubscribed: e.target.previousElementSibling.checked
                      ? false
                      : true,
                  },
                  {
                    pointOfContact: e.target.getAttribute("data-subscribe"),
                    topic: 2,
                    isSubscribed: e.target.previousElementSibling.checked
                      ? false
                      : true,
                  },
                  {
                    pointOfContact: e.target.getAttribute("data-subscribe"),
                    isSubscribed: e.target.previousElementSibling.checked
                      ? false
                      : true,
                  },
                ],
              },
            }),
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.status == "Success") {
              showMessage(
                `Вы ${
                  e.target.previousElementSibling.checked
                    ? "подписались"
                    : "отписались"
                }`,
                `Вы успешно ${
                  e.target.previousElementSibling.checked
                    ? "подписались на рассылку"
                    : "отписались от рассылки"
                }`,
                "success"
              );
            }
          });
      }
      if (e.target.classList == "authorize-button") {
        document.querySelector(".header__action-link.cabinet").click();
      }
    });
    const hamburger = document.querySelector(".hamburger-lines");
    const cabinetLeft = document.querySelector(".cabinet__left");
    hamburger.addEventListener("click", () => {
      cabinetLeft.classList.toggle("is-open");
      hamburger.classList.toggle("is-active");
      if (window.outerWidth < 1024) bodyScrollToggle();
    });
    cabinetLeft.addEventListener("click", () => hamburger.click());
  }
  function openPopupChangeUserData() {
    const element = `
    <div id="popup-change-userdata" class="popup">
      <div class="popup__background"></div>
      <div class="popup__wrap">
        <button class="popup__wrap-close"></button>
        <p class="popup__wrap-title">
          Личные данные
        </p>
        <form action="#" class="popup__form">
          <div class="popup__personal-wrap">
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-name-input" type="text" placeholder=" " autocomplete="off">
              <label for="client-name-input">Имя</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-surname-input" type="text" placeholder=" " autocomplete="off">
              <label for="client-surname-input">Фамилия</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-tel-input" type="tel" placeholder=" " autocomplete="off">
              <label for="client-tel-input">Телефон</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-address-input" type="text" placeholder=" " autocomplete="off">
              <label for="client-tel-input">Адрес доставки</label>
            </div>
          </div>
          <div class="buttons-wrap">
            <button id="submit-button" class="popup__wrap-button">
              Сохранить
            </button>
            <button id="change-password-button" class="popup__wrap-button background--transparent">
              Сменить пароль
            </button>
          </div>             
        </form>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", element);
    const popupUserdata = document.getElementById("popup-change-userdata");
    const nameInput = document.getElementById("client-name-input");
    const surnameInput = document.getElementById("client-surname-input");
    const telInput = document.getElementById("client-tel-input");
    const addressInput = document.getElementById("client-address-input");
    Inputmask({
      mask: "*{30}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
        if (!this.value.length) this.classList.add("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[А-Яа-яЁё-]",
        },
      },
    }).mask(nameInput);
    Inputmask({
      mask: "*{30}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[А-Яа-яЁё-]",
        },
      },
    }).mask(surnameInput);
    Inputmask({
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
    }).mask(addressInput);
    let fetchAddress;
    addressInput.addEventListener("input", () => {
      clearTimeout(fetchAddress);
      if (addressInput.value.length > 4) {
        fetchAddress = setTimeout(async () => {
          await fetch(
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
            {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization:
                  "Token " + "6469d62ecc3146040716bb2321fdd7559f318eaa",
              },
              body: JSON.stringify({ query: addressInput.value }),
            }
          )
            .then((res) => res.json())
            .then((res) => {
              const dropdown = document.querySelector(".dropdown-cities-list");
              if (dropdown) dropdown.remove();
              if (res.suggestions.length) {
                const element = `
                  <ul class="dropdown-cities-list">
                    ${res.suggestions
                      .map((address, index) => {
                        if (index < 2) {
                          return `
                            <li class="dropdown-cities-item" data-value="${address.unrestricted_value}">
                              ${address.unrestricted_value}
                            </li>
                          `;
                        }
                      })
                      .join("")}
                  </ul>
                `;
                const popupPersonal = document.querySelector(
                  ".popup__personal-wrap"
                );
                popupPersonal.children[3].insertAdjacentHTML(
                  "beforeend",
                  element
                );
              }
            });
        }, 1000);
      } else {
        const dropdown = document.querySelector(".dropdown-cities-list");
        if (dropdown) dropdown.remove();
      }
    });
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
    popupUserdata.addEventListener("click", async (e) => {
      if (e.target.id == "submit-button") {
        e.preventDefault();
        const inputs = [nameInput, surnameInput, telInput, addressInput];
        inputs.forEach((input) => {
          if (!input.value.length) {
            input.classList.add("is-not-valid");
          }
        });
        const isNotValid = document.querySelectorAll(".is-not-valid");
        if (!isNotValid.length) {
          const changeDataFetch = await fetch(
            `https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?change_user_info=change&name=${
              nameInput.value
            }&last_name=${
              surnameInput.value
            }&phone=7${telInput.inputmask.unmaskedvalue()}&address=${
              addressInput.value
            }`,
            {
              method: "GET",
            }
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.success) {
                e.target.setAttribute("disabled", true);
                refreshThisPage("profile", "", true);
                popupUserdata.remove();
                showMessage(
                  "Данные успешно обновлены!",
                  "Ваши данные обновлены",
                  "success"
                );
              } else {
                e.target.removeAttribute("disabled");
                showMessage("Ошибка!", res.error, "error");
              }
            });
        }
      }
      if (e.target.id == "change-password-button") {
        e.preventDefault();
        popupUserdata.remove();
        openPopupChangePassword();
      }
      if (e.target.className == "dropdown-cities-item") {
        const dropdown = document.querySelector(".dropdown-cities-list");
        addressInput.value = e.target.getAttribute("data-value");
        dropdown.remove();
      }
    });
  }
  function openPopupChangePassword() {
    const element = `
    <div id="popup-change-password" class="popup">
      <div class="popup__background"></div>
      <div class="popup__wrap">
        <button class="popup__wrap-close"></button>
        <p class="popup__wrap-title">
          Смена пароля
        </p>
        <form action="#" class="popup__form">
          <div class="popup__personal-wrap">
            <div class="input-wrap">
              <input class="popup__wrap-input" id="old-password-input" type="password" placeholder=" " minlength="6">
              <label for="old-password-input">Старый пароль</label>
              <button class="show-password showed"></button>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="new-password-input" type="password" placeholder=" " minlength="6">
              <label for="new-password-input">Новый пароль</label>
              <button class="show-password showed"></button>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="repeat-password-input" type="password" placeholder=" " minlength="6">
              <label for="repeat-password-input">Повторите новый пароль</label>
              <button class="show-password showed"></button>
            </div>
          </div>
          <div class="buttons-wrap">
            <button id="change-button" class="popup__wrap-button">
              Изменить пароль
            </button>
          </div>             
        </form>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML("beforeend", element);
    const oldPasswordInput = document.getElementById("old-password-input");
    const newPasswordInput = document.getElementById("new-password-input");
    const repeatPasswordInput = document.getElementById(
      "repeat-password-input"
    );
    const popupPassword = document.getElementById("popup-change-password");
    const inputs = [oldPasswordInput, newPasswordInput, repeatPasswordInput];
    inputs.forEach((input) => {
      Inputmask({
        showMaskOnHover: false,
        onKeyDown: function () {
          this.classList.remove("is-not-valid");
        },
      }).mask(input);
      input.addEventListener("focusout", () => {
        if (input.value.length < 6) input.classList.add("is-not-valid");
      });
    });
    popupPassword.addEventListener("click", async (e) => {
      if (e.target.classList.contains("show-password")) {
        e.preventDefault();
        if (e.target.parentElement.children[0].type == "text") {
          e.target.parentElement.children[0].type = "password";
          e.target.classList.add("showed");
          e.target.classList.remove("hidden");
        } else {
          e.target.parentElement.children[0].type = "text";
          e.target.classList.add("hidden");
          e.target.classList.remove("showed");
        }
      }
      if (e.target.id == "change-button") {
        e.preventDefault();
        inputs.forEach((input) => {
          if (!input.value.length) {
            input.classList.add("is-not-valid");
          }
        });
        const isNotValid = document.querySelectorAll(".is-not-valid");
        if (!isNotValid.length) {
          if (newPasswordInput.value !== repeatPasswordInput.value) {
            showMessage("Ошибка!", "Пароли не совпадают", "error");
            newPasswordInput.classList.add("is-not-valid");
            repeatPasswordInput.classList.add("is-not-valid");
          } else {
            const changePasswordFetch = await fetch(
              `https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?change_user_password=change&password_1=${newPasswordInput.value}&password_2=${repeatPasswordInput.value}`,
              {
                method: "GET",
              }
            )
              .then((res) => res.json())
              .then((res) => {
                e.target.setAttribute("disabled", true);
                if (res == true) {
                  showMessage(
                    "Данные успешно обновлены!",
                    "Ваш пароль обновлен!",
                    "success"
                  );
                  popupPassword.remove();
                } else {
                  e.target.removeAttribute("disabled");
                  showMessage(
                    "Ошибка!",
                    "Пожалуйста, проверьте правильность ввода пароля",
                    "error"
                  );
                }
              });
          }
        }
      }
    });
  }
  function openPopupAd() {
    const element = `
    <div id="popup-ad" class="popup">
      <div class="popup__background"></div>
      <div class="popup__wrap">
        <button class="popup__wrap-close"></button>
        <p class="popup__wrap-title">
          Новое объявление
        </p>
        <form action="#" class="popup__form">
          <p class="popup__wrap-subtitle">
            Свойства/характеристики
          </p>
          <div class="popup__ad-wrap">
            <select class="js-select" id="select-type" name="select">
              <option value="">Вид оружия</option>
              <option value="Гладкоствольное">Гладкоствольное</option>
              <option value="Нарезное">Нарезное</option>
              <option value="ОООП">ОООП</option>
            </select>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="calibr-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="calibr-input">Калибр</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="priklad-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="priklad-input">Материал приклада</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="capacity-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="capacity-input">Емкость магазина</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="num-trunks-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="num-trunks-input">Количество стволов</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="location-trunks-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="location-trunks-input">Расположение стволов</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="barrel-length-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="barrel-length-input">Длина ствола, мм</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="total-length-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="total-length-input">Общая длина, мм</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="principle-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="principle-input">Принцип действия</label>
            </div>
              <div class="input-wrap">
              <input class="popup__wrap-input" id="model-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="model-input">Производитель</label>
            </div>
          </div>
          <p class="popup__wrap-subtitle">
            Внешний вид, описание
          </p>
          <div class="popup__ad-wrap">
            <div class="input-wrap">
              <input class="popup__wrap-input" id="condition-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="condition-input">Состояние</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="price-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="price-input">Цена, р</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="year-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="year-input">Год выпуска, г</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="weight-input" type="text" placeholder=" " minlength="1" autocomplete="off">
              <label for="weight-input">Вес, г</label>
            </div>
          </div>
          <div class="input-wrap-file">
            <input
              name="file"
              type="file"
              id="input-wrap-file"
              class="input-wrap-file__input"
              multiple
              required
              accept=".jpg, .jpeg, .png"
            />
            <label for="input-wrap-file">
              Прикрепить файлы<span class="dots">...</span>
              <span class="another"
                >.png, .jpg не более 8МВ</span
              >
            </label>
          </div>
          <div class="textarea-wrap">
            <textarea class="textarea" name="description" placeholder="Добавьте описание" rows="4"></textarea>
            <p class="text-for-textarea">Не менее 250 символов</p>
          </div>
          <label class="checkbox__label">
            Нажимая кнопку «Разместить объявление», вы соглашаетесь с условиями пользовательского соглашения
            <input
              type="checkbox"
              class="checkbox visually-hidden"
              value=""
            />
            <span class="checkbox__span"></span>
          </label>
          <div class="buttons-wrap">
            <button id="submit-ad-button" class="popup__wrap-button">
              Разместить объявление
            </button>
          </div>             
        </form>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", element);
    const selectElement = document.querySelector(".js-select");
    const choice = new Choices(selectElement, {
      itemSelectText: "",
      allowHTML: true,
      searchEnabled: false,
    });
    const popupAd = document.getElementById("popup-ad");
    const calibrInput = document.getElementById("calibr-input");
    const prikladInput = document.getElementById("priklad-input");
    const capacityInput = document.getElementById("capacity-input");
    const numTrunksInput = document.getElementById("num-trunks-input");
    const locationTrunksInput = document.getElementById(
      "location-trunks-input"
    );
    const barrelLengthInput = document.getElementById("barrel-length-input");
    const totalLengthInput = document.getElementById("total-length-input");
    const principleInput = document.getElementById("principle-input");
    const modelInput = document.getElementById("model-input");
    const condititonInput = document.getElementById("condition-input");
    const priceInput = document.getElementById("price-input");
    const yearInput = document.getElementById("year-input");
    const weightInput = document.getElementById("weight-input");
    const textArea = document.querySelector(".textarea");
    const fileInput = document.querySelector(".input-wrap-file__input");
    const checkbox = document.querySelector(".checkbox");
    const inputs = [
      calibrInput,
      prikladInput,
      capacityInput,
      numTrunksInput,
      locationTrunksInput,
      barrelLengthInput,
      totalLengthInput,
      principleInput,
      modelInput,
      condititonInput,
      priceInput,
      yearInput,
      weightInput,
      textArea,
    ];
    const labelFile = fileInput.nextElementSibling;
    fileInput.addEventListener("change", (e) => {
      labelFile.textContent = "Выбраны файлы: ";
      let size = 0;
      Object.values(e.target.files).forEach((el) => {
        labelFile.textContent += `${el.name}, `;
        size += el.size;
      });
      if (size > 8000000) {
        labelFile.textContent = "Превышен размер файлов!";
        return;
      }
      if (e.target.files.length < 3) {
        fileInput.nextElementSibling.classList.add("is-not-valid");
        return;
      }
      fileInput.nextElementSibling.classList.remove("is-not-valid");
      fileInput.classList.remove("is-not-valid");
    });
    Inputmask({
      mask: "*{25}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[А-Яа-я-Ёё.0-9/*]",
        },
      },
    }).mask(calibrInput);
    Inputmask({
      mask: "*{10}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[А-Яа-я]",
        },
      },
    }).mask(prikladInput);
    Inputmask({
      mask: "*{5}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[0-9+]",
        },
      },
    }).mask(capacityInput);
    Inputmask({
      mask: "*{2}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[0-9]",
        },
      },
    }).mask(numTrunksInput);
    Inputmask({
      mask: "*{15}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[А-Яа-я]",
        },
      },
    }).mask(locationTrunksInput);
    Inputmask({
      mask: "*{3}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[0-9]",
        },
      },
    }).mask(barrelLengthInput);
    Inputmask({
      mask: "*{4}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[0-9]",
        },
      },
    }).mask(totalLengthInput);
    Inputmask({
      mask: "*{15}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[А-Яа-я]",
        },
      },
    }).mask(principleInput);
    Inputmask({
      mask: "*{15}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[А-Яа-яA-Za-z -]",
        },
      },
    }).mask(modelInput);
    Inputmask({
      mask: "*{15}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[А-Яа-я ]",
        },
      },
    }).mask(condititonInput);
    Inputmask({
      mask: "*{6}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[0-9]",
        },
      },
    }).mask(priceInput);
    Inputmask({
      mask: "*{4}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[0-9]",
        },
      },
    }).mask(yearInput);
    Inputmask({
      mask: "*{4}",
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[0-9]",
        },
      },
    }).mask(weightInput);
    Inputmask({
      placeholder: "",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
    }).mask(textArea);
    popupAd.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("choices__item") ||
        e.target.classList.contains("choices__inner")
      ) {
        selectElement.parentElement.classList.remove("is-not-valid");
      }
      if (e.target.id == "submit-ad-button") {
        e.preventDefault();
        selectElement.parentElement.classList.remove("is-not-valid");
        if (selectElement.children[0].value == "") {
          selectElement.parentElement.classList.add("is-not-valid");
        }
        inputs.forEach((input) => {
          if (!input.value.length) {
            input.classList.add("is-not-valid");
          }
        });
        if (textArea.value.length < 250) textArea.classList.add("is-not-valid");
        if (checkbox.checked) {
          document
            .querySelector(".checkbox__span")
            .classList.remove("is-not-valid");
        } else {
          document
            .querySelector(".checkbox__span")
            .classList.add("is-not-valid");
        }
        if (fileInput.files.length < 3) {
          fileInput.nextElementSibling.classList.add("is-not-valid");
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
  function openPopupCard() {
    const element = `
    <div id="popup-card" class="popup">
      <div class="popup__background"></div>
      <div class="popup__wrap">
        <button class="popup__wrap-close"></button>
        <p class="popup__wrap-title">
          Бонусная карта
        </p>
        <form action="#" class="popup__form">
          <div class="popup__personal-wrap">
            <div class="input-wrap">
              <input class="popup__wrap-input" id="card-number-input" type="text" placeholder=" " autocomplete="off">
              <label for="card-number-input">Введите номер карты</label>
            </div>
          </div>
          <div class="buttons-wrap">
            <button id="submit-button" class="popup__wrap-button">
              Сохранить карту
            </button>
            <a href="#" class="popup__wrap-button background--transparent" target="_blank">
              У меня ещё нет карты
            </a>
          </div>             
        </form>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", element);
    const cardNumberInput = document.getElementById("card-number-input");
    const popupCard = document.getElementById("popup-card");
    Inputmask({
      mask: "*{10}",
      showMaskOnHover: false,
      onKeyDown: function () {
        this.classList.remove("is-not-valid");
      },
      onincomplete: function () {
        this.classList.add("is-not-valid");
      },
      definitions: {
        "*": {
          validator: "[0-9/]",
        },
      },
    }).mask(cardNumberInput);
    popupCard.addEventListener("click", async (e) => {
      if (e.target.id == "submit-button") {
        e.preventDefault();
        if (!cardNumberInput.value.length) {
          cardNumberInput.classList.add("is-not-valid");
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
  function generateQrCode(value) {
    const qrCode = new QRCodeStyling({
      width: 200,
      height: 200,
      type: "svg",
      data: value,
      dotsOptions: {
        color: "#000000",
        type: "extra-rounded",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        imageSize: 1,
      },
    });
    return qrCode.append(document.querySelector(".qrcode"));
  }
});
