import "../../styles/pages/cart/style.scss";
import "../../styles/components/popup/style.scss";
import "../../scripts/functions/listeners";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { getUserData } from "../functions/getUserData";
import { showMessage } from "../functions/showMessage";

const choosedCity = localStorage.getItem("oa_choosed_city")
  ? JSON.parse(localStorage.getItem("oa_choosed_city"))
  : "Москва";

document.addEventListener("DOMContentLoaded", async () => {
  const headerButtonGeo = document.querySelector(".header__geo");
  headerButtonGeo.textContent = choosedCity;
  let userCart = await getArrayOfCart();
  refreshCart(userCart);
});

async function refreshCart(data) {
  console.log(data);
  const columns = document.querySelector(".cart__columns");
  while (columns.firstChild) {
    columns.removeChild(columns.firstChild);
  }
  if (data == 0) {
    const element = `
      <div class="cart__empty">
      <img class="cart__empty-img" src="../assets/img/basket.svg" alt="Пустая корзина" />
        <p class="cart__empty-title">
          Ваша корзина пуста!
        </p>
        <p class="cart__empty-text">
          Воспользуйтесь <a href="#" class="cart__empty-link">каталогом</a> чтобы добавить товар
        </p>
      </div>
    `;
    const regionText = document.querySelector(".cart__region");
    regionText.remove();
    return columns.insertAdjacentHTML("beforeend", element);
  }
  let countPrice = data.isAvailable
    .map((item) => item.oldPrice * item.count)
    .reduce((prev, curr) => prev + curr, 0);
  let countDiscount = data.isAvailable
    .map((item) => (item.startedPrice - item.oldPrice) * item.count)
    .reduce((prev, curr) => prev + curr, 0);
  const element = `
    <div class="cart__left">
    ${
      data.isAvailable.length
        ? `
        <div class="cart__left-block">
        <p class="cart__left-block-title">Доступно для заказа</p>
        ${data.isAvailable
          .map((el) => {
            return `
            <div class="cart__left-block-card">
              <div class="cart__left-block-img-wrap">
                <img src="${el.img}" alt="${
              el.name
            }" class="cart__left-block-img">
              </div>
              <div class="cart__left-block-description">
                <p class="cart__left-block-description-text">
                  ${el.name}
                </p>
              </div>
              <div class="cart__left-block-count">
                <button class="cart__left-block-count-button subtract-count" data-step="1">
                  -
                </button>
                <input class="cart__left-block-count-input" type="number" min="1" max="99999" value="${
                  el.count
                }">
                <button class="cart__left-block-count-button append-count" data-step="1">
                  +
                </button>
              </div>
              <p class="cart__left-block-price" data-price="${
                el.startedPrice
              }" data-old-price="${el.oldPrice}" data-price-now="${
              el.PRICE[13]
                ? Number(el.PRICE[13] * el.count)
                : el.PRICE[5]
                ? Number(el.PRICE[5]) * el.count
                : Number(el.PRICE[1]) * el.count
            }" ${
              (el.PRICE[13] && el.PRICE[13] !== el.PRICE[1]) ||
              (el.PRICE[5] && el.PRICE[5] !== el.PRICE[1])
                ? `data-price-now-discount="${Number(el.PRICE[1]) * el.count}"`
                : ``
            }>
                ${
                  el.PRICE[13]
                    ? numberWithSpaces(Number(el.PRICE[13]) * el.count)
                    : el.PRICE[5]
                    ? numberWithSpaces(Number(el.PRICE[5]) * el.count)
                    : numberWithSpaces(Number(el.PRICE[1]) * el.count)
                } ₽ ${
              (el.PRICE[13] && el.PRICE[13] !== el.PRICE[1]) ||
              (el.PRICE[5] && el.PRICE[5] !== el.PRICE[1])
                ? `<span>${numberWithSpaces(
                    Number(el.PRICE[1]) * el.count
                  )} ₽</span>`
                : ``
            }
              </p>
              <button id=${el.id} class="cart__left-block-delete"></button>
            </div>
        `;
          })
          .join("")}
      </div>`
        : ``
    }
    ${
      data.isNotAvailable.length
        ? `
        <div class="cart__left-block">
        <p class="cart__left-block-title">Нет в наличии</p>
        ${data.isNotAvailable
          .map((el) => {
            return `
            <div class="cart__left-block-card">
              <div class="cart__left-block-img-wrap">
                <img src="${el.img}" alt="${
              el.name
            }" class="cart__left-block-img">
              </div>
              <div class="cart__left-block-description">
                <p class="cart__left-block-description-text">
                  ${el.name}
                </p>
              </div>
              <div class="cart__left-block-count">
                <button class="cart__left-block-count-button">
                  -
                </button>
                <input class="cart__left-block-count-input" type="number" min="1" max="99999" value="${
                  el.count
                }" disabled>
                <button class="cart__left-block-count-button">
                  +
                </button>
              </div>
              <p class="cart__left-block-price">
                ${
                  el.PRICE[13]
                    ? numberWithSpaces(Number(el.PRICE[13]) * el.count)
                    : el.PRICE[5]
                    ? numberWithSpaces(Number(el.PRICE[5]) * el.count)
                    : numberWithSpaces(Number(el.PRICE[1]) * el.count)
                } ₽ ${
              (el.PRICE[13] && el.PRICE[13] !== el.PRICE[1]) ||
              (el.PRICE[5] && el.PRICE[5] !== el.PRICE[1])
                ? `<span>${numberWithSpaces(
                    Number(el.PRICE[1]) * el.count
                  )} ₽</span>`
                : ``
            }
              </p>
              <button id=${el.id} class="cart__left-block-delete"></button>
            </div>
        `;
          })
          .join("")}
      `
        : ``
    }
    </div>
  </div>
  <div class="cart__right">
    <p class="cart__right-title">Ваш заказ</p>
    <div class="cart__right-block">
      <div class="cart__right-info">
        <div class="cart__right-text-wrap">
          <p class="cart__right-text">Товары: ${data.isAvailable.length}</p>
          <p class="cart__right-text" data-count>${numberWithSpaces(
            countPrice
          )} &#8381;</p>
        </div>
        <div class="cart__right-text-wrap">
          <p class="cart__right-text">Скидка</p>
          <p class="cart__right-text text-red" data-discount>
            ${numberWithSpaces(countDiscount)} &#8381;
          </p>
        </div>
      </div>
      <div class="cart__right-info">
        <div class="cart__right-text-wrap">
          <p class="cart__right-text text-bold">Общая стоимость</p>
          <p class="cart__right-text text-bold" data-total-count>
            ${numberWithSpaces(countPrice + countDiscount)} &#8381;
          </p>
        </div>
        <a href="../order/" class="cart__right-link">
          Перейти к оформлению заказа
        </a>
        <p class="cart__right-description">
          Нажимая на кнопку «Перейти к оплате», вы принимаете условия
          Публичной оферты и Политику обработки ПДн и даете согласие
          на обработку ваших ПДн, включая их передачу
        </p>
      </div>
    </div>
  </div>
  `;
  columns.insertAdjacentHTML("beforeend", element);
  columns.addEventListener("click", async (e) => {
    if (e.target.className == "cart__left-block-delete") {
      await fetch(
        `https://ohotaktiv.ru/12dev/new-design/pages/cart/cart.php?product_id=${e.target.id}&delete=yes`
      ).then(async () => {
        let userCart = await getArrayOfCart();
        refreshCart(userCart);
        showMessage(
          "Товар удален",
          "Товар успешно удален из корзины",
          "success"
        );
      });
    }
    if (e.target.classList.contains("append-count")) {
      if (e.target.previousElementSibling.value == 99999) return;
      e.target.previousElementSibling.value++;
      calculatePrices(
        e.target.previousElementSibling,
        e.target.parentElement.nextElementSibling
      );
      fetch(
        `https://ohotaktiv.ru/12dev/new-design/pages/cart/cart.php?product_id=${e.target.parentElement.nextElementSibling.nextElementSibling.id}&quantity=${e.target.previousElementSibling.value}`
      );
    }
    if (e.target.classList.contains("subtract-count")) {
      if (e.target.nextElementSibling.value == 1) return;
      e.target.nextElementSibling.value--;
      calculatePrices(
        e.target.nextElementSibling,
        e.target.parentElement.nextElementSibling
      );
      fetch(
        `https://ohotaktiv.ru/12dev/new-design/pages/cart/cart.php?product_id=${e.target.parentElement.nextElementSibling.nextElementSibling.id}&quantity=${e.target.nextElementSibling.value}`
      );
    }
  });
  const inputs = document.querySelectorAll(".cart__left-block-count-input");
  function eventForInput(input) {
    if (input.value > 99999) input.value = 99999;
    if (input.value < 1) input.value = 1;
    calculatePrices(input, input.parentElement.nextElementSibling);
    fetch(
      `https://ohotaktiv.ru/12dev/new-design/pages/cart/cart.php?product_id=${input.parentElement.nextElementSibling.nextElementSibling.id}&quantity=${input.value}`
    );
  }
  inputs.forEach((input) => {
    input.addEventListener("keydown", (e) =>
      e.key == "Enter" ? eventForInput(input) : []
    );
    input.addEventListener("focusout", () => eventForInput(input));
  });
}

async function getArrayOfCart() {
  const userInfoFromFetch = await getUserData();
  const userCartFromFetch = userInfoFromFetch.cart ? userInfoFromFetch.cart : 0;
  // const userCartFromFetch = {
  //   10585: "2.0000",
  //   104000: "3.0000",
  //   450212: "1.0000",
  //   232270: "1.0000",
  //   455799: "1.0000",
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
        cardInfo.warehouse == "0" &&
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
      if (res.NAME.length !== 0) {
        const item = {
          id: id,
          name: res.NAME,
          PRICE: res.PRICE,
          img: `https://ohotaktiv.ru${
            res.DETAIL_PICTURE
              ? res.DETAIL_PICTURE
              : res.PREVIEW_PICTURE
              ? res.PREVIEW_PICTURE
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
      }
    });
}

function calculatePrices(input, priceElement) {
  priceElement.setAttribute(
    "data-price-now",
    priceElement.getAttribute("data-price") * input.value
  );
  priceElement.getAttribute("data-price-now-discount")
    ? priceElement.setAttribute(
        "data-price-now-discount",
        priceElement.getAttribute("data-old-price") * input.value
      )
    : [];
  priceElement.innerHTML = `${numberWithSpaces(
    priceElement.getAttribute("data-price-now")
  )} ₽ ${
    priceElement.getAttribute("data-price-now-discount")
      ? `<span>${numberWithSpaces(
          priceElement.getAttribute("data-price-now-discount")
        )} ₽</span>`
      : ``
  }`;
  refreshPricesOnRightBlock();
}

function refreshPricesOnRightBlock() {
  const pricesElements = document.querySelectorAll("[data-price-now]");
  let pricesGoods = 0;
  let pricesDiscount = 0;
  pricesElements.forEach((el) => {
    pricesGoods += Number(el.getAttribute("data-price-now"));
    pricesDiscount += el.getAttribute("data-price-now-discount")
      ? Number(el.getAttribute("data-price-now-discount"))
      : Number(el.getAttribute("data-price-now"));
  });
  const dataCount = document.querySelector("[data-count]");
  dataCount.textContent = `${numberWithSpaces(pricesDiscount)} ₽`;
  const dataTotalCount = document.querySelector("[data-total-count]");
  dataTotalCount.textContent = `${numberWithSpaces(pricesGoods)} ₽`;
  const dataDiscount = document.querySelector("[data-discount]");
  dataDiscount.textContent = `-${numberWithSpaces(
    pricesDiscount - pricesGoods
  )} ₽`;
}
