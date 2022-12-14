import "../../styles/pages/order/style.scss";
import { getUserData } from "../functions/getUserData";
import Inputmask from "inputmask";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { showMessage } from "../functions/showMessage";

const choosedCity = localStorage.getItem("oa_choosed_city")
  ? JSON.parse(localStorage.getItem("oa_choosed_city"))
  : "Москва";

document.addEventListener("DOMContentLoaded", async () => {
  const headerButtonGeo = document.querySelector(".header__geo");
  headerButtonGeo.textContent = choosedCity;
  let userCart = await getArrayOfCart();
  refreshOrder(userCart);
});

async function getArrayOfCart() {
  const userInfoFromFetch = await getUserData();
  const userCartFromFetch = userInfoFromFetch.cart ? userInfoFromFetch.cart : 0;
  // const userCartFromFetch = {
  //   242252: "1.0000",
  //   232270: "1.0000",
  // };
  if (userCartFromFetch == 0) {
    return userCartFromFetch;
  } else {
    const isAvailable = [];
    const isNotAvailable = [];
    for (const item of Object.entries(userCartFromFetch)) {
      const id = item[0];
      const count = item[1];
      const cardInfo = await getCardInfo(id, count);
      if (
        cardInfo.warehouse <= 0 &&
        Object.keys(cardInfo.available).length == 0
      ) {
        isNotAvailable.push(cardInfo);
      } else {
        isAvailable.push(cardInfo);
      }
    }
    return {
      isAvailable: isAvailable,
      isNotAvailable: isNotAvailable,
    };
  }
}

async function getCardInfo(id, count) {
  return await fetch(
    `https://ohotaktiv.ru/12dev/new-design/pages/card/hand.php?the_id=${id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      const item = {
        id: id,
        name: res.NAME,
        PRICE: res.PRICE,
        mb_prop: res.properties
          ? res.properties.system
            ? res.properties.system.mb_prop
              ? res.properties.system.mb_prop
              : ""
            : ""
          : "",
        img: `https://ohotaktiv.ru${
          res.DETAIL_PICTURE
            ? res.DETAIL_PICTURE
            : res["Картинки"]
            ? res["Картинки"][0]
            : `/local/templates/ohota2021/img/no_photo.png`
        }`,
        warehouse: res.warehouse ? Number(res.warehouse) : 0,
        count: Number(count),
        available: res["Наличие в магазине"] ? res["Наличие в магазине"] : {},
        startedPrice: Math.ceil(
          res.PRICE[13]
            ? Number(res.PRICE[13])
            : res.PRICE[5]
            ? Number(res.PRICE[5])
            : Number(res.PRICE[1])
        ),
        oldPrice: Math.ceil(Number(res.PRICE[1])),
        is_licence: res.properties
          ? res.properties.system
            ? res.properties.system["ИМ Лицензия"]
              ? res.properties.system["ИМ Лицензия"]
              : "false"
            : "false"
          : "false",
      };
      return item;
    });
}

async function refreshOrder(data) {
  if (data == 0) return (document.location.href = "https://ohotaktiv.ru");
  const userInfo = await getUserData();
  const orderWrap = document.querySelector(".order__wrap");
  while (orderWrap.firstChild) {
    orderWrap.removeChild(orderWrap.firstChild);
  }
  const goods = data.isAvailable;
  const amount = goods
    .map((item) => item.startedPrice * item.count)
    .reduce((prev, curr) => prev + curr, 0);
  const licenceGoods = goods.filter((good) => good.is_licence == "true"); // Лицензионные товары
  const isInGoods = goods.filter(
    (obj) =>
      obj.is_licence == "false" &&
      Object.values(obj.available).some((el) => el.NAME.includes(choosedCity))
  ); // товары в городе
  const isNotInGoods = goods.filter(
    (obj) =>
      obj.is_licence == "false" &&
      !Object.values(obj.available).some((el) => el.NAME.includes(choosedCity))
  ); // товары не в городе
  const element = `
    <button class="order__back">Вернуться в корзину</button>
      <h1 class="order__title">Оформление заказа</h1>
      ${
        goods.find((el) => el.is_licence == "true")
          ? `
        <p class="order__attention">
          Внимание! В вашем заказе присутствуют лицензионные товары, получить
          которые вы можете только самовывозом из магазинов розничной сети
          ОхотАктив.
        </p>`
          : ``
      }
      <div class="order__columns">
        <div class="order__left">
          <div class="order__left-block" data-personal>
            <div class="order__left-block-section-wrap">
              <div class="order__left-block-section">
                <p class="order__left-block-title">Получатель</p>
                <input
                  type="text"
                  class="order__left-block-input"
                  id="client-name-input"
                  placeholder="Имя"
                  autocomplete="off"
                  value="${
                    userInfo.personal.NAME !== null
                      ? userInfo.personal.NAME
                      : ``
                  }"
                />
                <input
                  type="text"
                  class="order__left-block-input"
                  id="client-surname-input"
                  placeholder="Фамилия"
                  autocomplete="off"
                  value="${
                    userInfo.personal.LAST_NAME !== null
                      ? userInfo.personal.LAST_NAME
                      : ``
                  }"
                />
                <input
                  type="text"
                  class="order__left-block-input"
                  id="client-tel-input"
                  placeholder="Телефон"
                  autocomplete="off"
                  value="${
                    userInfo.personal.PERSONAL_PHONE !== null
                      ? userInfo.personal.PERSONAL_PHONE.slice(1)
                      : ``
                  }"
                />
                <input
                  type="text"
                  class="order__left-block-input"
                  id="client-email-input"
                  placeholder="E-mail"
                  autocomplete="off"
                  value="${
                    userInfo.personal.EMAIL !== null
                      ? userInfo.personal.EMAIL
                      : ``
                  }"
                />
                <div class="address-input__wrap">
                  <input
                    type="text"
                    class="order__left-block-input"
                    id="client-address-input"
                    placeholder="Ваш город"
                    autocomplete="off"
                  />
                </div>
              </div>
              <div class="order__left-block-section">
                <p class="order__left-block-title">Способ оплаты</p>
                <ul class="order__left-block-radio-wrap">
                  ${
                    goods.find((el) => el.is_licence == "true")
                      ? ``
                      : `
                      <li class="order__left-block-radio">
                        <input
                          class="radio__input"
                          type="radio"
                          id="method-online"
                          name="method"
                          value="14"
                          checked
                        />
                        <label for="method-online">Онлайн банковской картой</label>
                      </li>`
                  }
                  <li class="order__left-block-radio">
                  <input
                    class="radio__input"
                    type="radio"
                    id="method-receive"
                    name="method"
                    value="2"
                    ${
                      goods.find((el) => el.is_licence == "true")
                        ? `checked`
                        : ``
                    }
                  />
                  <label for="method-receive">Оплата при получении</label>
                  <li class="order__left-block-radio">
                    <input
                      class="radio__input"
                      type="radio"
                      id="method-transfer"
                      name="method"
                      value="3"
                    />
                    <label for="method-transfer">Оплата переводом (менеджер сообщит реквизиты по счету)</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="order__left-block">
            <p class="order__left-block-title">Товары в заказе</p>
            <div class="order__left-block-section">
              <ul class="order__left-block-cards-list">
              ${goods
                .map((el) => {
                  return `
                    <li class="order__left-block-card" id="${
                      el.id
                    }" data-price="${el.startedPrice * el.count}">
                      <div class="order__left-block-img-wrap">
                        <img src="${el.img}" alt="${
                    el.name
                  }" class="order__left-block-img">
                      </div>
                      <div class="order__left-block-description">
                        <p class="order__left-block-price">
                        ${numberWithSpaces(el.startedPrice * el.count)} &#8381
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
                })
                .join("")}
              </ul>
            </div>
          </div>
          ${
            false && licenceGoods.length
              ? `
              <div class="order__left-block">
                <p class="order__left-block-title">Лицензионные товары (только самовывозом)</p>
                <div class="order__left-block-section">
                  <ul class="order__left-block-cards-list">
                  ${licenceGoods
                    .map((el) => {
                      return `
                      <li class="order__left-block-cards-item">
                        <div class="order__left-block-img-wrap">
                          <img
                            src="${el.img}"
                            alt="${el.name}"
                            class="order__left-block-img"
                          />
                        </div>
                      </li>
                    `;
                    })
                    .join("")}
                  </ul>
                  <p class="order__left-block-section-text">
                    В вашем городе отсутствуют розничные магазин ОхотАктив, мы можем доставить ваш заказ в ближайший город.
                  </p>
                  <select class="js-select" id="select-city" name="select">
                    <option value="">Выберите ближайший магазин</option>
                    <option value="Кострома">Кострома</option>
                    <option value="Москва">Москва</option>
                    <option value="Мурманск">Мурманск</option>
                    <option value="Набережные челны">Набережные челны</option>
                  </select>
                </div>
              </div>
              `
              : ``
          }
          ${
            false && isNotInGoods.length
              ? `
              <div class="order__left-block">
                <p class="order__left-block-title">Выберите способ доставки</p>
                <div class="order__left-block-section">
                  <ul class="order__left-block-cards-list">
                  ${isNotInGoods
                    .map((el) => {
                      return `
                      <li class="order__left-block-cards-item">
                        <div class="order__left-block-img-wrap">
                          <img
                            src="${el.img}"
                            alt="${el.name}"
                            class="order__left-block-img"
                          />
                        </div>
                      </li>
                    `;
                    })
                    .join("")}
                  </ul>
                  <ul class="order__left-block-delivery-list">
                    <li class="order__left-block-delivery-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="delivery-isnotin-courier"
                        name="delivery-isnotin"
                      />
                      <label class="label" for="delivery-isnotin-courier">
                        <span class="label-title">Курьерская доставка</span>
                        <span class="label-text">Посылка склад-дверь</span>
                      </label>
                    </li>
                    <li class="order__left-block-delivery-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="delivery-isnotin-sdek"
                        name="delivery-isnotin"
                      />
                      <label class="label" for="delivery-isnotin-sdek">
                        <span class="label-title">СДЭК ПВЗ</span>
                        <span class="label-text">Посылка склад-дверь</span>
                      </label>
                    </li>
                    <li class="order__left-block-delivery-item">
                      <input
                        class="radio__input"
                        type="radio"
                        id="delivery-isnotin-shop"
                        name="delivery-isnotin"
                      />
                      <label class="label" for="delivery-isnotin-shop">
                        <span class="label-title">Доставка в магазин</span>
                        <span class="label-text">Доставка на склад магазина</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            `
              : ``
          }
          ${
            false && isInGoods.length
              ? `
          <div class="order__left-block">
            <p class="order__left-block-title">Товары в вашем городе</p>
            <div class="order__left-block-section">
              <ul class="order__left-block-cards-list">
              ${isInGoods
                .map((el) => {
                  return `
                  <li class="order__left-block-cards-item">
                    <div class="order__left-block-img-wrap">
                      <img
                        src="${el.img}"
                        alt="${el.name}"
                        class="order__left-block-img"
                      />
                    </div>
                  </li>
                `;
                })
                .join("")}
              </ul>
              <ul class="order__left-block-delivery-list">
                <li class="order__left-block-delivery-item">
                  <input
                    class="radio__input"
                    type="radio"
                    id="delivery-isin-courier"
                    name="delivery-isin"
                  />
                  <label class="label" for="delivery-isin-courier">
                    <span class="label-title">Курьерская доставка</span>
                    <span class="label-text">Посылка склад-дверь</span>
                  </label>
                </li>
                <li class="order__left-block-delivery-item">
                  <input
                    class="radio__input"
                    type="radio"
                    id="delivery-isin-myself"
                    name="delivery-isin"
                  />
                  <label class="label" for="delivery-isin-myself">
                    <span class="label-title">Самовывоз</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          `
              : ``
          }
        </div>
        <div class="order__right">
          <p class="order__right-title">Ваш заказ</p>
          <div class="order__right-block">
            <div class="order__right-info">
              <div class="order__right-text-wrap">
                <p class="order__right-text">Товары: ${
                  data.isAvailable.length
                }</p>
                <p class="order__right-text" data-count="${amount}">${numberWithSpaces(
    amount
  )} &#8381;</p>
              </div>
            </div>
            <div class="order__right-info">
              <div class="order__right-text-wrap">
                <p class="order__right-text text-bold">Общая стоимость</p>
                <p class="order__right-text text-bold" data-total-count>
                  ${numberWithSpaces(amount)} &#8381;
                </p>
              </div>
              <div class="order__right-input-wrap">
                <input class="order__right-input" placeholder="Промокод / Сертификат" id="check-coupon"/>
              </div>
              <button id="submit-order" class="order__right-button">Оформить заказ</button>
              <p class="order__right-description">
                Нажимая на кнопку «Оформить заказ», вы принимаете условия
                Публичной оферты и Политику обработки ПДн и даете согласие
                на обработку ваших ПДн, включая их передачу
              </p>
            </div>
          </div>
        </div>
      </div>
  `;
  orderWrap.insertAdjacentHTML("beforeend", element);
  // const selectElement = document.querySelector(".js-select");
  // const choice = new Choices(selectElement, {
  //   itemSelectText: "",
  //   searchEnabled: false,
  //   allowHTML: true,
  // });
  // selectElement.addEventListener("change", () => {
  //   console.log("here");
  // });
  const checkCouponInput = document.getElementById("check-coupon");
  const nameInput = document.getElementById("client-name-input");
  const surnameInput = document.getElementById("client-surname-input");
  const telInput = document.getElementById("client-tel-input");
  const addressInput = document.getElementById("client-address-input");
  const emailInput = document.getElementById("client-email-input");
  const inputs = [nameInput, surnameInput, telInput, addressInput, emailInput];
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
              const addressInputWrap = document.querySelector(
                ".address-input__wrap"
              );
              addressInputWrap.insertAdjacentHTML("beforeend", element);
            }
          });
      }, 1000);
    } else {
      const dropdown = document.querySelector(".dropdown-cities-list");
      if (dropdown) dropdown.remove();
    }
  });
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
  Inputmask({
    mask: "*{100}",
    placeholder: "",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    definitions: {
      "*": {
        validator: "[A-Za-z-0-9]",
      },
    },
  }).mask(checkCouponInput);
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
  }).mask(emailInput);
  checkCouponInput.addEventListener("focusin", (e) => {
    if (!document.querySelector(".order__right-input-check")) {
      e.target.parentNode.insertAdjacentHTML(
        "beforeend",
        `<button id="check-coupon-button" class="order__right-input-check">Применить</button>`
      );
    }
  });
  checkCouponInput.addEventListener("focusout", (e) => {
    if (!e.target.value.length) {
      e.target.nextElementSibling.remove();
    }
  });
  orderWrap.addEventListener("click", async (e) => {
    if (e.target.className == "order__back") {
      history.back();
    }
    if (e.target.className == "dropdown-cities-item") {
      const dropdown = document.querySelector(".dropdown-cities-list");
      addressInput.value = e.target.getAttribute("data-value");
      dropdown.remove();
    }
    if (e.target.id == "check-coupon-button") {
      if (document.querySelector("[data-discount-total]")) {
        return showMessage("Ошибка", "Промокод на заказ уже применен", "error");
      }
      if (!checkCouponInput.value) {
        return showMessage(
          "Не заполнено поле",
          "Заполните поле с промокодом",
          "error"
        );
      }
      await fetch(
        `https://ohotaktiv.ru/12dev/new-design/pages/checkout/checkout.php?coupon=${checkCouponInput.value}&event=check`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.value == null) {
            showMessage(
              "Ошибка",
              "Промокод введен некорректно либо такого промокода не существует",
              "error"
            );
          } else if (res.active !== "Y") {
            showMessage("Ошибка", "Промокод уже использован", "error");
          } else {
            goods.forEach((good) => {
              if (res.mb_prop && res.mb_prop == "true") {
                if (good.mb_prop !== "5" && good.mb_prop !== "fetter") {
                  const getElement = document.getElementById(`${good.id}`);
                  const startedPrice = Number(
                    getElement.getAttribute("data-price")
                  );
                  const newPrice =
                    startedPrice - (startedPrice / 100) * res.value;
                  getElement.children[1].children[0].innerHTML = `${numberWithSpaces(
                    Math.ceil(newPrice)
                  )} &#8381;<span class="promo-discount">${numberWithSpaces(
                    startedPrice
                  )} &#8381;</span>`;
                  getElement.setAttribute(
                    "data-price-promo",
                    Math.ceil(newPrice)
                  );
                }
              } else {
                const getElement = document.getElementById(`${good.id}`);
                const startedPrice = Number(
                  getElement.getAttribute("data-price")
                );
                const newPrice =
                  startedPrice - (startedPrice / 100) * res.value;
                getElement.children[1].children[0].innerHTML = `${numberWithSpaces(
                  Math.ceil(newPrice)
                )} &#8381;<span class="promo-discount">${numberWithSpaces(
                  startedPrice
                )} &#8381;</span>`;
                getElement.setAttribute(
                  "data-price-promo",
                  Math.ceil(newPrice)
                );
              }
            });
            refreshPricesOnRightBlock();
            checkCouponInput.setAttribute(
              "data-coupon",
              checkCouponInput.value
            );
            checkCouponInput.disabled = true;
            e.target.parentNode.insertAdjacentHTML(
              "beforeend",
              `<button id="cancel-coupon-button" class="order__right-input-check">Отменить</button>`
            );
            e.target.remove();
          }
        });
    }
    if (e.target.id == "submit-order") {
      e.preventDefault();
      inputs.forEach((input) => {
        if (!input.value.length) {
          input.classList.add("is-not-valid");
        }
      });
      const isNotValid = document.querySelectorAll(".is-not-valid");
      if (!isNotValid.length) {
        const methodId = document.querySelector("[name=method]:checked");
        await fetch(
          `https://ohotaktiv.ru/12dev/new-design/pages/checkout/checkout.php?delivery_id=2&pay_id=${
            methodId.value
          }&address=${
            addressInput.value
          }&phone=7${telInput.inputmask.unmaskedvalue()}&email=${
            emailInput.value
          }&first_name=${nameInput.value}&second_name=${surnameInput.value}`
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.success && methodId.value == 14) {
              document.location.href = res.success.pay_url;
            } else {
              document.location.href =
                "https://ohotaktiv.ru/12dev/new-design/pages/result/";
            }
          });
      }
    }
    if (e.target.id == "cancel-coupon-button") {
      const allDiscounts = document.querySelectorAll("[data-price-promo]");
      if (allDiscounts.length) {
        allDiscounts.forEach((el) => {
          const span = el.children[1].children[0];
          const spanText = `${numberWithSpaces(
            el.getAttribute("data-price")
          )} &#8381`;
          span.innerHTML = spanText;
          el.removeAttribute("data-price-promo");
        });
        refreshPricesOnRightBlock(true);
      }
      fetch(
        `https://ohotaktiv.ru/12dev/new-design/pages/checkout/checkout.php?coupon=${checkCouponInput.value}&event=clear`
      );
      checkCouponInput.disabled = false;
      checkCouponInput.value = "";
      e.target.parentNode.insertAdjacentHTML(
        "beforeend",
        `<button id="check-coupon-button" class="order__right-input-check">Применить</button>`
      );
      e.target.remove();
    }
  });
}

function refreshPricesOnRightBlock(cancel) {
  const pricesElements = document.querySelectorAll(".order__left-block-card");
  let pricesGoods = 0;
  pricesElements.forEach((el) => {
    pricesGoods += el.getAttribute("data-price-promo")
      ? Number(el.getAttribute("data-price-promo"))
      : Number(el.getAttribute("data-price"));
  });
  const dataTotalCount = document.querySelector("[data-total-count]");
  dataTotalCount.textContent = `${numberWithSpaces(pricesGoods)} ₽`;
  const dataCount = document.querySelector("[data-count]");
  const dataDiscount = document.querySelector("[data-discount-total]");

  if (cancel) {
    if (dataDiscount) {
      dataDiscount.remove();
      dataTotalCount.textContent = `${numberWithSpaces(pricesGoods)} ₽`;
    }
  } else {
    const elementDiscount = `
    <div class="order__right-text-wrap" data-discount-total>
      <p class="order__right-text">Скидка</p>
      <p class="order__right-text text-red">
        ${numberWithSpaces(
          pricesGoods - Number(dataCount.getAttribute("data-count"))
        )} &#8381;
      </p>
  </div>
  `;
    dataCount.parentElement.parentElement.insertAdjacentHTML(
      "beforeend",
      elementDiscount
    );
  }
}
