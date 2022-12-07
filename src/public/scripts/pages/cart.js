import "../../styles/pages/cart/style.scss";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { getUserData } from "../functions/getUserData";
import { generatePrice } from "../functions/generatePrice";
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
  let countPrice = 0;
  let countDiscount = 0;
  Object.values(data).forEach((available) => {
    available.forEach((good) => {
      countPrice += Number(
        good.PRICE[13]
          ? good.PRICE[13]
          : good.PRICE[5]
          ? good.PRICE[5]
          : good.PRICE[1]
          ? good.PRICE[1]
          : 0
      );
      countDiscount += Number(
        good.PRICE[13]
          ? good.PRICE[13] - good.PRICE[1]
          : good.PRICE[5]
          ? good.PRICE[5] - good.PRICE[1]
          : good.PRICE[1]
          ? good.PRICE[1] - good.PRICE[1]
          : 0
      );
    });
  });
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
                <p class="cart__left-block-description-status">
                  ${
                    el.is_licence == "true"
                      ? "Самовывоз"
                      : "Самовывоз или доставка"
                  }
                </p>
              </div>
              <div class="cart__left-block-count">
                <button class="cart__left-block-count-button subtract-count" data-step="1">
                  -
                </button>
                <input class="cart__left-block-count-input" type="number" min="1" max="1000" value="${
                  el.count
                }">
                <button class="cart__left-block-count-button append-count" data-step="1">
                  +
                </button>
              </div>
              <p class="cart__left-block-price">
                ${generatePrice(el)}
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
        <p class="cart__left-block-title">Доступно для получения в другом городе</p>
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
                <button class="cart__left-block-description-notavailable">
                  В наличии в других <span>магазинах</span>
                </button>
              </div>
              <div class="cart__left-block-count">
                <button class="cart__left-block-count-button subtract-count">
                  -
                </button>
                <input class="cart__left-block-count-input" type="number" min="1" max="1000" value="1">
                <button class="cart__left-block-count-button append-count">
                  +
                </button>
              </div>
              <p class="cart__left-block-price">
                ${generatePrice(el)}
              </p>
              <button class="cart__left-block-delete"></button>
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
          <p class="cart__right-text">Товары: ${
            data.isAvailable.length + data.isNotAvailable.length
          }</p>
          <p class="cart__right-text" data-count>${numberWithSpaces(
            countPrice
          )} &#8381;</p>
        </div>
        <div class="cart__right-text-wrap">
          <p class="cart__right-text">Скидка</p>
          <p class="cart__right-text text-red">
            ${numberWithSpaces(countDiscount)} &#8381;
          </p>
        </div>
      </div>
      <div class="cart__right-info">
        <div class="cart__right-text-wrap">
          <p class="cart__right-text text-bold">Общая стоимость</p>
          <p class="cart__right-text text-bold">
            ${numberWithSpaces(countPrice + countDiscount)} &#8381;
          </p>
        </div>
        <a href="#" class="cart__right-link">
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
  });
}

async function getArrayOfCart() {
  const userInfoFromFetch = await getUserData();
  // const userCartFromFetch = userInfoFromFetch.cart;
  const userCartFromFetch = {
    10585: "1.0000",
    104000: "3.0000",
    450212: "1.0000",
  };
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
      isAvailable.push(cardInfo);
    } else {
      isNotAvailable.push(cardInfo);
    }
  }
  return {
    isAvailable: isAvailable,
    isNotAvailable: isNotAvailable,
  };
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
        is_licence: res.properties
          ? res.properties["ИМ Лицензия"]
            ? res.properties["ИМ Лицензия"]
            : "false"
          : "false",
      };
      return item;
    });
}
