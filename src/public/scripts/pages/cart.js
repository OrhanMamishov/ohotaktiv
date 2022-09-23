import "../imports";
import "../../styles/pages/cart/style.scss";
import { numberWithSpaces } from "../functions/numberWithSpaces";

document.addEventListener("DOMContentLoaded", () => {
  refreshPrices();
  document.addEventListener("click", (e) => {
    // клик на +
    if (e.target.className.includes("append-count")) {
      // если value меньше или больше то возвращаем исходное
      if (e.target.previousElementSibling.value >= 1000) {
        e.target.previousElementSibling.value = 1000;
      } else {
        e.target.previousElementSibling.value++;
      }
      refreshPriceOnCard(e.target.parentElement.parentElement);
    }
    // клик на -
    if (e.target.className.includes("subtract-count")) {
      // если value меньше или больше то возвращаем исходное
      if (e.target.nextElementSibling.value <= 1) {
        e.target.nextElementSibling.value = 1;
      } else {
        e.target.nextElementSibling.value--;
      }
      refreshPriceOnCard(e.target.parentElement.parentElement);
    }
    // удаление товара из корзины
    if (e.target.className.includes("cart__left-block-description-button")) {
      e.target.parentElement.parentElement.remove();
    }
    // чекбоксы
    if (e.target.className.includes("checkbox__span")) {
      refreshPrices();
    }
  });
  function refreshPriceOnCard(block) {
    const priceElement = block.children[4].children[0];
    const oldpriceElement = block.children[4].children[1];
    const discountElement = block.children[4].children[2];
    const value = block.children[3].children[1].value;
    const price = priceElement.getAttribute("data-price");
    const oldprice = oldpriceElement.getAttribute("data-oldprice");
    const discount = discountElement.getAttribute("data-discount");
    priceElement.textContent = `${numberWithSpaces(price * value)} ₽`;
    oldpriceElement.textContent = `${numberWithSpaces(oldprice * value)} ₽`;
    discountElement.textContent = `- ${numberWithSpaces(discount * value)} ₽`;
    refreshPrices();
  }
  function refreshPrices() {
    const cartRight = document.querySelector(".cart__right");
    if (!cartRight) {
      const cartColumns = document.querySelector(".cart__columns");
      const element = `
      <div class="cart__right">
        <p class="cart__right-title">
          Ваш заказ
        </p>
        <div class="cart__right-block">
          <div class="cart__right-info">
            <div class="cart__right-text-wrap">
              <p class="cart__right-text">
                Способ получения
              </p>
              <p class="cart__right-text">
                Доставка,<br>самовывоз
              </p>
            </div>
            <div class="cart__right-text-wrap">
              <p class="cart__right-text">
                Стоимость доставки
              </p>
              <p class="cart__right-text" data-count-delivery>
                1500 &#8381;
              </p>
            </div>
            <div class="cart__right-text-wrap">
              <p class="cart__right-text" data-count-goods>
                Товары: 
              </p>
              <p class="cart__right-text" data-count>
                0 &#8381;
              </p>
            </div>
            <div class="cart__right-text-wrap">
              <p class="cart__right-text">
                Скидка
              </p>
              <p class="cart__right-text text-red" data-count-discount>
                0 &#8381;
              </p>
            </div>
            <div class="cart__right-text-wrap">
              <p class="cart__right-text text-green">
                Оплата за перемещение
              </p>
              <p class="cart__right-text text-green" data-count-transfer>
                5000 &#8381;
              </p>
            </div>
          </div>
          <div class="cart__right-info">
            <div class="cart__right-text-wrap">
              <p class="cart__right-text text-bold">
                Общая стоимость
              </p>
              <p class="cart__right-text text-bold" data-count-total>
                &#8381;
              </p>
            </div>
            <button class="cart__right-button">
              Перейти к оформлению заказа
            </button>
            <p class="cart__right-description">
              Нажимая на кнопку «Перейти к оплате», вы принимаете условия Публичной оферты и Политику обработки ПДн и даете согласие на обработку ваших ПДн, включая их передачу
            </p>
          </div>
        </div>
      </div>
      `;
      cartColumns.insertAdjacentHTML("beforeend", element);
    }
    setTimeout(() => {
      const checked = document.querySelectorAll(".checkbox:checked");
      const deliveryElement = Number(
        document
          .querySelector("[data-count-delivery]")
          .textContent.replace(/[^+\d]/g, "")
      );
      const transferElement = Number(
        document
          .querySelector("[data-count-transfer]")
          .textContent.replace(/[^+\d]/g, "")
      );
      const goodsElement = document.querySelector("[data-count-goods]");
      const countElement = document.querySelector("[data-count]");
      const discountElement = document.querySelector("[data-count-discount]");
      const countTotalElement = document.querySelector("[data-count-total]");
      let countPrice = 0;
      let countDiscount = 0;
      let countGoods = 0;
      checked.forEach((checkbox) => {
        const block = checkbox.parentElement.parentElement;
        if (!block.children[2].children[1].classList.contains("unavaliable")) {
          const price = Number(
            block.children[4].children[1].textContent.replace(/[^+\d]/g, "")
          );
          const discount = Number(
            block.children[4].children[2].textContent.replace(/[^+\d]/g, "")
          );
          countPrice += price;
          countDiscount += discount;
          countGoods++;
        }
      });
      countElement.textContent = `${numberWithSpaces(countPrice)} ₽`;
      discountElement.textContent = `- ${numberWithSpaces(countDiscount)} ₽`;
      goodsElement.textContent = `Товары: ${countGoods}`;
      countTotalElement.textContent = `${numberWithSpaces(
        deliveryElement + transferElement + countPrice - countDiscount
      )} ₽`;
    });
  }
});
