import "../../styles/pages/order/style.scss";
import { getUserData } from "../functions/getUserData";
import Inputmask from "inputmask";
import { numberWithSpaces } from "../functions/numberWithSpaces";

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
  // const userCartFromFetch = userInfoFromFetch.cart ? userInfoFromFetch.cart : 0;
  const userCartFromFetch = {
    10585: "2.0000",
    104000: "3.0000",
    450212: "1.0000",
    232270: "1.0000",
    455799: "1.0000",
  };
  if (userCartFromFetch == 0) {
    return userCartFromFetch;
  } else {
    const isAvailable = [];
    const isNotAvailable = [];
    for (const item of Object.entries(userCartFromFetch)) {
      const id = item[0];
      const count = item[1];
      const cardInfo = await getCardInfo(id, count);
      const available = Object.values(cardInfo.available).filter((el) =>
        el.NAME.includes(choosedCity)
      );
      if (available.length) {
        isAvailable.push(cardInfo);
      } else if (cardInfo.warehouse == "0") {
        isNotAvailable.push(cardInfo);
      } else {
        isNotAvailable.push(cardInfo);
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
        img: `https://ohotaktiv.ru${
          res.DETAIL_PICTURE
            ? res.DETAIL_PICTURE
            : res["Картинки"]
            ? res["Картинки"][0]
            : `/local/templates/ohota2021/img/no_photo.png`
        }`,
        warehouse: res.warehouse,
        count: Number(count),
        available: res["Наличие в магазине"] ? res["Наличие в магазине"] : {},
        startedPrice: res.PRICE[13]
          ? Number(res.PRICE[13])
          : res.PRICE[5]
          ? Number(res.PRICE[5])
          : Number(res.PRICE[1]),
        oldPrice: Number(res.PRICE[1]),
        is_licence: res.properties
          ? res.properties["ИМ Лицензия"]
            ? res.properties["ИМ Лицензия"]
            : "false"
          : "false",
      };
      return item;
    });
}

async function refreshOrder(data) {
  console.log(data);
  const userInfo = await getUserData();
  const orderWrap = document.querySelector(".order__wrap");
  while (orderWrap.firstChild) {
    orderWrap.removeChild(orderWrap.firstChild);
  }
  const goods = data.isAvailable.concat(data.isNotAvailable);
  const amount = goods
    .map((item) => item.startedPrice * item.count)
    .reduce((prev, curr) => prev + curr, 0);
  const discount = goods
    .map((item) => (item.startedPrice - item.oldPrice) * item.count)
    .reduce((prev, curr) => prev + curr, 0);
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
                      ? userInfo.personal.PERSONAL_PHONE
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
                          checked
                        />
                        <label for="method-online">Онлайн оплата</label>
                      </li>`
                  }
                  <li class="order__left-block-radio">
                    <input
                      class="radio__input"
                      type="radio"
                      id="method-receive"
                      name="method"
                      ${
                        goods.find((el) => el.is_licence == "true")
                          ? `checked`
                          : ``
                      }
                    />
                    <label for="method-receive">Оплата при получении</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="order__left-block" data-goods>
            <p class="order__left-block-title">Товары в заказе</p>
            <div class="order__left-block-section">
              <ul class="order__left-block-cards-list">
              ${goods
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
                    <div class="order__left-block-cards-info">
                      <p class="order__left-block-cards-text">
                        ${el.name}
                      </p>
                      <p class="order__left-block-cards-text">
                        Кол-во: ${el.count}
                      </p>
                      <p class="order__left-block-cards-text text-bold">
                        Цена: ${numberWithSpaces(
                          el.startedPrice * el.count
                        )} &#8381;
                      </p>
                    </div>
                  </li>
                `;
                })
                .join("")}
              </ul>
            </div>
          </div>
        </div>
        <div class="order__right">
          <p class="order__right-title">Ваш заказ</p>
          <div class="order__right-block">
            <div class="order__right-info">
              <div class="order__right-text-wrap">
                <p class="order__right-text" data-count-goods>Товары: ${
                  data.isAvailable.length + data.isNotAvailable.length
                }</p>
                <p class="order__right-text" data-count>${numberWithSpaces(
                  amount
                )} &#8381;</p>
              </div>
              <div class="order__right-text-wrap">
                <p class="order__right-text">Скидка</p>
                <p class="order__right-text text-red" data-count-discount>
                ${numberWithSpaces(discount)} &#8381;
                </p>
              </div>
            </div>
            <div class="order__right-info">
              <div class="order__right-text-wrap">
                <p class="order__right-text text-bold">Общая стоимость</p>
                <p class="order__right-text text-bold" data-count-total>
                  ${numberWithSpaces(amount + discount)} &#8381;
                </p>
              </div>
              <button id="submit-order" class="order__right-button">Перейти к оплате</button>
              <div class="order__right-input-wrap">
                <input class="order__right-input" placeholder="Промокод / Сертификат" id="check-coupon"/>
                <button class="order__right-input-check">Применить</button>
              </div>
              <p class="order__right-description">
                Нажимая на кнопку «Перейти к оплате», вы принимаете условия
                Публичной оферты и Политику обработки ПДн и даете согласие
                на обработку ваших ПДн, включая их передачу
              </p>
            </div>
          </div>
        </div>
      </div>
  `;
  orderWrap.insertAdjacentHTML("beforeend", element);
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
  orderWrap.addEventListener("click", (e) => {
    if (e.target.className == "dropdown-cities-item") {
      const dropdown = document.querySelector(".dropdown-cities-list");
      addressInput.value = e.target.getAttribute("data-value");
      dropdown.remove();
    }
    if (e.target.className == "order__right-input-check") {
      console.log("check coupon");
    }
    if (e.target.id == "submit-order") {
      e.preventDefault();
      inputs.forEach((input) => {
        if (!input.value.length) {
          input.classList.add("is-not-valid");
        }
      });
      const isNotValid = document.querySelectorAll(".is-not-valid");
      console.log(isNotValid);
      if (!isNotValid.length) {
        console.log("POST");
      }
    }
  });
}
