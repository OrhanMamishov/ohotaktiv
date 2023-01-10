import "../../styles/components/header/style.scss";
import { bodyScrollToggle } from "../functions/scrollBody";
import ucFirst from "../functions/ucFirst";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import Inputmask from "inputmask";
import { showMessage } from "../functions/showMessage";
import { getUserData } from "../functions/getUserData";
import { updateCountGoods } from "../functions/updateCountGoods";
import { numberWithSpaces } from "../functions/numberWithSpaces";

document.addEventListener("DOMContentLoaded", async () => {
  await fetch("../header/")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      document.querySelector("header").innerHTML = data;
    });
  const allLinks = document.querySelectorAll(".header__pages-link");
  allLinks.forEach((link) => {
    if (link.href == document.location) {
      link.classList.add("is-here");
    }
  });
  const headerAccordion = document.querySelector(
    ".header__accordion-container"
  );
  while (headerAccordion.firstChild) {
    headerAccordion.removeChild(headerAccordion.firstChild);
  }
  const catalogHighArray = await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/catalog/gentwo/sections/menu.json",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      res.sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1));
      res.forEach((cat) => {
        if (cat.name == "other") return;
        const element = `
          <div class="ac">
            <h2 class="ac-header">
              <a href="../catalog/?section=${cat.code}" class="ac-link">${
          cat.name
        }</a>
              <button type="button" class="ac-trigger"></button>
            </h2>
            <div class="ac-panel">
              <div class="ac-panel-wrap">
                <ul class="header__catalog-list">
                ${
                  cat.depth
                    ? cat.depth
                        .map((depth) => {
                          return `
                    <li class="header__catalog-item">
                      <a href="../catalog/?section=${depth.code}" class="header__catalog-link">
                        ${depth.name}
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
        `;
        headerAccordion.insertAdjacentHTML("beforeend", element);
      });
    });

  const userInfo = await getUserData();
  const cityName = document.querySelector(".header__city");
  console.log(userInfo);
  if (!localStorage.getItem("oa_choosed_city")) {
    const userCity = await fetch(
      `https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=${userInfo.IP.VALUE}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + "6469d62ecc3146040716bb2321fdd7559f318eaa",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.location.data.city) {
          cityName.textContent = res.location.data.city;
          localStorage.setItem(
            "oa_choosed_city",
            JSON.stringify(res.location.data.city)
          );
        } else {
          cityName.textContent = "Москва";
          localStorage.setItem("oa_choosed_city", JSON.stringify("Москва"));
        }
      });
  } else {
    cityName.textContent = JSON.parse(localStorage.getItem("oa_choosed_city"));
  }
  const header = document.querySelector(".header");
  const headerMenuWrap = document.querySelector(".header__menu-wrap");
  const headerMenu = document.querySelector(".header__menu");
  const headerCatalogWrap = document.querySelector(".header__catalog-wrap");
  const headerCatalog = document.querySelector(".header__catalog");
  if (window.innerWidth < 1024)
    new Accordion(headerAccordion, {
      showMultiple: true,
    });
  const IS_AUTHORIZED = userInfo.personal.ID !== null ? true : false;
  IS_AUTHORIZED ? updateCountGoods(userInfo) : updateCountGoods(userInfo);
  header.addEventListener("click", (e) => {
    if (e.target.className == "header__status") {
      bodyScrollToggle();
      const popupStatusElement = `
          <div id="popup-status" class="popup">
            <div class="popup__background"></div>
            <div class="popup__wrap">
              <button class="popup__wrap-close"></button>
              <p class="popup__wrap-subtitle">
                Статус заказа
              </p>
              <input type="text" class="popup__wrap-input" placeholder="Введите номер заказа" maxlength="6">
              <button class="popup__wrap-button">
                Проверить
              </button>
            </div>
          </div>
        `;
      document.body.insertAdjacentHTML("beforeend", popupStatusElement);
      const popupStatus = document.getElementById("popup-status");
      const inputPopup = document.querySelector(".popup__wrap-input");
      const buttonPopup = document.querySelector(".popup__wrap-button");
      inputPopup.addEventListener("input", (e) => {
        if (inputPopup.classList.contains("is-not-valid"))
          inputPopup.classList.remove("is-not-valid");
        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
      });
      buttonPopup.addEventListener("click", async () => {
        if (inputPopup.value.length < 6)
          return inputPopup.classList.add("is-not-valid");
        await fetch(
          `https://ohotaktiv.ru/12dev/order_status/?order_id=${inputPopup.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            const element = `
              <div class="popup__wrap">
                <button class="popup__wrap-close"></button>
                <div class="popup__result-header">
                  <p class="popup__result-title">
                    Заказ № ${inputPopup.value}
                  </p>
                  <p class="popup__result-subtitle">
                    Создан ${res.DATE_INSERT}
                  </p>
                </div>
                <div class="popup__result-body">
                  <p class="popup__result-text">
                    Статус
                  </p>
                  <p class="popup__result-subtext">
                    ${res.status}
                  </p>
                  <p class="popup__result-text">
                    Оплата
                  </p>
                  <p class="popup__result-statuspay">
                    ${res.PAYED}<span>${numberWithSpaces(
              res.PRICE
            )} &#8381;</span>
                  </p>
                </div>
              </div>
            `;
            document.querySelector(".popup__wrap").remove();
            popupStatus.insertAdjacentHTML("beforeend", element);
          });
      });
    }
    if (e.target.className == "header__city") {
      bodyScrollToggle();
      const currentCityList = [
        {
          name: "Москва",
          id: 1,
        },
        {
          name: "Санкт-Петербург",
          id: 2,
        },
        {
          name: "Новосибирск",
          id: 3,
        },
        {
          name: "Екатеринбург",
          id: 4,
        },
        {
          name: "Казань",
          id: 5,
        },
        {
          name: "Нижний Новгород",
          id: 6,
        },
        {
          name: "Краснодар",
          id: 7,
        },
        {
          name: "Красноярск",
          id: 1,
        },
      ];
      const popupCityElement = `
          <div id="popup-city" class="popup">
            <div class="popup__background"></div>
            <div class="popup__wrap">
              <button class="popup__wrap-close"></button>
              <div class="choose-cities__wrap">
                <p class="popup__wrap-top-title">
                  Выберите свой город
                </p>
                <input type="text" class="choose-cities__input" placeholder="Начните вводить название города">
                <ul class="choose-cities__list initial">
                ${Object.values(currentCityList)
                  .map((city) => {
                    return `
                    <li class="choose-cities__item">
                      <input class="radio__input" type="radio" id="${city.id}" name="city" data-city="${city.name}">
                      <label for="${city.id}">${city.name}</label>
                    </li>
                  `;
                  })
                  .join("")}
                </ul>
              </div>
            </div>
          </div>
        `;
      document.body.insertAdjacentHTML("beforeend", popupCityElement);
      const chooseCitiesList = document.querySelector(
        ".choose-cities__list.initial"
      );
      const chooseCitiesInput = document.querySelector(".choose-cities__input");
      const chooseCitiesWrap = document.querySelector(".choose-cities__wrap");
      let fetchAddress;
      chooseCitiesInput.addEventListener("input", () => {
        clearTimeout(fetchAddress);
        if (chooseCitiesInput.value.length > 2) {
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
                body: JSON.stringify({
                  query: chooseCitiesInput.value,
                  from_bound: { value: "city" },
                  to_bound: { value: "city" },
                }),
              }
            )
              .then((res) => res.json())
              .then((res) => {
                if (res.suggestions.length) {
                  chooseCitiesList.style.display = "none";
                  const element = `
                    <ul class="choose-cities__list custom">
                      ${res.suggestions
                        .map((el) => {
                          if (el.data.city.includes("км")) return;
                          return `
                          <li class="choose-cities__item">
                            <input class="radio__input" type="radio" id="${el.data.city_kladr_id}" name="city" data-city="${el.data.city}">
                            <label for="${el.data.city_kladr_id}">${el.data.city}, <span>${el.data.region_with_type}</span></label>
                          </li>
                        `;
                        })
                        .join("")}
                    </ul>
                  `;
                  const chooseCitiesCustom = document.querySelector(
                    ".choose-cities__list.custom"
                  );
                  if (chooseCitiesCustom) chooseCitiesCustom.remove();
                  chooseCitiesWrap.insertAdjacentHTML("beforeend", element);
                } else {
                  const chooseCitiesCustom = document.querySelector(
                    ".choose-cities__wrap.list"
                  );
                  if (chooseCitiesCustom) chooseCitiesCustom.remove();
                  chooseCitiesList.style.display = "flex";
                }
              });
          }, 1000);
        } else {
          const chooseCitiesCustom = document.querySelector(
            ".choose-cities__list.custom"
          );
          if (chooseCitiesCustom) chooseCitiesCustom.remove();
          chooseCitiesList.style.display = "flex";
        }
      });
      chooseCitiesWrap.addEventListener("click", (e) => {
        if (e.target.className == "radio__input") {
          cityName.textContent = e.target.getAttribute("data-city");
          localStorage.setItem(
            "oa_choosed_city",
            JSON.stringify(e.target.getAttribute("data-city"))
          );
          document.querySelector(".popup__wrap-close").click();
        }
      });
    }
    if (e.target.className == "header__openmenu") {
      bodyScrollToggle();
      headerMenuWrap.style.visibility = "visible";
      headerMenuWrap.style.opacity = 1;
      headerMenu.style.transform = "translateX(0)";
    }
    if (
      e.target.className == "header__menu-close" ||
      e.target.className == "header__menu-background"
    ) {
      bodyScrollToggle();
      headerMenuWrap.style.opacity = 0;
      headerMenu.style.transform = "translateX(100%)";
      setTimeout(() => {
        headerMenuWrap.style.visibility = "hidden";
      }, 200);
    }
    if (e.target.classList.contains("catalog")) {
      if (headerCatalogWrap.style.visibility === "visible") {
        document.querySelector(".header__catalog-close").click();
        return;
      }
      bodyScrollToggle();
      e.target.classList.toggle("is-active");
      headerCatalogWrap.style.visibility = "visible";
      headerCatalogWrap.style.opacity = 1;
      headerCatalog.style.transform =
        window.innerWidth < 1024 ? "translateX(0)" : "translateY(0)";
    }
    if (
      e.target.className == "header__catalog-close" ||
      e.target.className == "header__catalog-background"
    ) {
      document
        .querySelector(".header__catalog-button")
        .classList.remove("is-active");
      bodyScrollToggle();
      headerCatalogWrap.style.opacity = 0;
      headerCatalog.style.transform =
        window.innerWidth < 1024 ? "translateX(-100%)" : "translateY(-10px)";
      setTimeout(() => {
        headerCatalogWrap.style.visibility = "hidden";
      }, 200);
    }
    if (e.target.className == "header__action-link cabinet") {
      e.preventDefault();
      if (IS_AUTHORIZED) {
        window.location.href = e.target.href;
      } else {
        const element = `
        <div id="popup-authorize" class="popup">
          <div class="popup__background"></div>
          <div class="popup__wrap">
            <button class="popup__wrap-close"></button>
            <p class="popup__wrap-title">
              Вход или регистрация
            </p>
            <div class="authorize-switcher">
              <button class="authorize-switcher__button active" data-path="authorization">
                Вход
              </button>
              <button class="authorize-switcher__button" data-path="registration">
                Регистрация
              </button>
            </div>
            <div class="tab__target active" data-target="authorization">
              <input type="text" id="email-input-authorize" class="popup__wrap-input" placeholder="E-mail*">
              <input type="password" id="password-input-authorize" class="popup__wrap-input" placeholder="Пароль*">
              <button id="authorize-button" class="popup__wrap-button">
                Войти
              </button>
              <button class="popup__wrap-button forgot-password">Напомнить пароль</button>
            </div>
            <div class="tab__target" data-target="registration">
              <input type="text" id="email-input-registration" class="popup__wrap-input" placeholder="E-mail*">
              <input type="password" id="password-input-registration" class="popup__wrap-input" placeholder="Пароль*">
              <button id="registration-button" class="popup__wrap-button">
                Зарегистрироваться
              </button>
            </div>
            <div class="tab__target" data-target="forgot-password">
              <input type="text" id="forgot-input" class="popup__wrap-input" placeholder="E-mail*">
              <button id="forgot-password-button" class="popup__wrap-button">
                Напомнить пароль
              </button>
            </div>
          </div>
        </div>
      `;
        document.body.insertAdjacentHTML("beforeend", element);
        const emailInputAuthorization = document.getElementById(
          "email-input-authorize"
        );
        const passwordInputAuthorization = document.getElementById(
          "password-input-authorize"
        );
        const emailInputRegistration = document.getElementById(
          "email-input-registration"
        );
        const passwordInputRegistration = document.getElementById(
          "password-input-registration"
        );
        const emailInputForgot = document.getElementById("forgot-input");
        Inputmask({
          mask: "*{50}",
          placeholder: "",
          greedy: false,
          showMaskOnHover: false,
          definitions: {
            "*": {
              validator: "[0-9A-Za-z@._-]",
            },
          },
          onKeyDown: function () {
            this.classList.remove("is-not-valid");
          },
          onincomplete: function () {
            if (!this.value.includes("@")) this.classList.add("is-not-valid");
          },
        }).mask(emailInputAuthorization);
        Inputmask({
          showMaskOnHover: false,
          onKeyDown: function () {
            this.classList.remove("is-not-valid");
          },
        }).mask(passwordInputAuthorization);
        Inputmask({
          mask: "*{50}",
          placeholder: "",
          greedy: false,
          showMaskOnHover: false,
          definitions: {
            "*": {
              validator: "[0-9A-Za-z@._-]",
            },
          },
          onKeyDown: function () {
            this.classList.remove("is-not-valid");
          },
          onincomplete: function () {
            if (!this.value.includes("@")) this.classList.add("is-not-valid");
          },
        }).mask(emailInputRegistration);
        Inputmask({
          showMaskOnHover: false,
          onKeyDown: function () {
            this.classList.remove("is-not-valid");
          },
        }).mask(passwordInputRegistration);
        Inputmask({
          mask: "*{50}",
          placeholder: "",
          greedy: false,
          showMaskOnHover: false,
          definitions: {
            "*": {
              validator: "[0-9A-Za-z@._-]",
            },
          },
          onKeyDown: function () {
            this.classList.remove("is-not-valid");
          },
          onincomplete: function () {
            if (!this.value.includes("@")) this.classList.add("is-not-valid");
          },
        }).mask(emailInputForgot);
        const popupAuthorize = document.getElementById("popup-authorize");
        popupAuthorize.addEventListener("click", async (e) => {
          if (e.target.id == "authorize-button") {
            e.target.setAttribute("disabled", true);
            const [popupEmail, popupPassword] = [
              emailInputAuthorization,
              passwordInputAuthorization,
            ];
            if (!popupEmail.value.length) {
              popupEmail.classList.add("is-not-valid");
              e.target.removeAttribute("disabled");
            }
            if (!popupPassword.value.length) {
              popupPassword.classList.add("is-not-valid");
              e.target.removeAttribute("disabled");
            }
            if (
              !popupEmail.classList.contains("is-not-valid") &&
              !popupPassword.classList.contains("is-not-valid")
            ) {
              const fetchFromBase = await fetch(
                `https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?get_user_login=${popupEmail.value}&password=${popupPassword.value}`,
                {
                  method: "GET",
                }
              )
                .then((res) => res.json())
                .then(async (res) => {
                  if (res.success) {
                    const userInfoAfterAuthorize = await getUserData();
                    updateCountGoods(userInfoAfterAuthorize);
                    showMessage(
                      "Вы успешно авторизованы!",
                      res.success,
                      "success"
                    );
                    popupAuthorize.remove();
                    setTimeout(() => {
                      if (document.location.search.includes("?logout=yes")) {
                        return (document.location = "../index/");
                      }
                    }, 1000);
                  }
                  if (res.error) {
                    e.target.removeAttribute("disabled");
                    showMessage("Ошибка!", res.error.MESSAGE, "error");
                  }
                });
            }
          }
          if (e.target.classList.contains("authorize-switcher__button")) {
            if (e.target.classList.contains("active")) return;
            const buttons = document.querySelectorAll(
              ".authorize-switcher__button"
            );
            buttons.forEach((button) => button.classList.remove("active"));
            e.target.classList.add("active");
            const targets = document.querySelectorAll(".tab__target");
            targets.forEach((target) => target.classList.remove("active"));
            document
              .querySelector(
                `[data-target=${e.target.getAttribute("data-path")}]`
              )
              .classList.add("active");
          }
          if (e.target.className == "popup__wrap-button forgot-password") {
            const buttons = document.querySelectorAll(
              ".authorize-switcher__button"
            );
            buttons.forEach((button) => button.classList.remove("active"));
            const targets = document.querySelectorAll(".tab__target");
            targets.forEach((target) => target.classList.remove("active"));
            document
              .querySelector(`[data-target=forgot-password]`)
              .classList.add("active");
          }
          if (e.target.id == "registration-button") {
            e.target.setAttribute("disabled", true);
            const [popupEmail, popupPassword] = [
              emailInputRegistration,
              passwordInputRegistration,
            ];
            if (!popupEmail.value.length) {
              popupEmail.classList.add("is-not-valid");
              e.target.removeAttribute("disabled");
            }
            if (!popupPassword.value.length) {
              popupPassword.classList.add("is-not-valid");
              e.target.removeAttribute("disabled");
            }
            if (
              !popupEmail.classList.contains("is-not-valid") &&
              !popupPassword.classList.contains("is-not-valid")
            ) {
              const fetchFromBase = await fetch(
                `https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?user_registration=yes&email=${popupEmail.value}&password=${popupPassword.value}`,
                {
                  method: "GET",
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  if (res.success) {
                    showMessage(
                      "Вы успешно зарегистрированы!",
                      res.success,
                      "success"
                    );
                    popupAuthorize.remove();
                  }
                  if (res.error) {
                    e.target.removeAttribute("disabled");
                    showMessage("Ошибка!", res.error, "error");
                  }
                });
            }
          }
          if (e.target.id == "forgot-password-button") {
            e.target.setAttribute("disabled", true);
            if (!emailInputForgot.value.length) {
              emailInputForgot.classList.add("is-not-valid");
              e.target.removeAttribute("disabled");
            }
            if (!emailInputForgot.value.length) {
              emailInputForgot.classList.add("is-not-valid");
              e.target.removeAttribute("disabled");
            }
            if (!emailInputForgot.classList.contains("is-not-valid")) {
              const fetchFromBase = await fetch(
                `https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?send_password=yes&login=${emailInputForgot.value}`,
                {
                  method: "GET",
                }
              )
                .then((res) => res.json())
                .then(async (res) => {
                  if (res.success) {
                    showMessage("Успешно!", res.success, "success");
                    popupAuthorize.remove();
                  }
                  if (res.error) {
                    e.target.removeAttribute("disabled");
                    showMessage("Ошибка!", res.error.MESSAGE, "error");
                  }
                });
            }
          }
        });
      }
    }
  });
});
