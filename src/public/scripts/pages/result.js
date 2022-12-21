import "../../styles/pages/result/style.scss";
import { getUserData } from "../functions/getUserData";
import { numberWithSpaces } from "../functions/numberWithSpaces";

const choosedCity = localStorage.getItem("oa_choosed_city")
  ? JSON.parse(localStorage.getItem("oa_choosed_city"))
  : "Москва";

document.addEventListener("DOMContentLoaded", async () => {
  const headerButtonGeo = document.querySelector(".header__geo");
  headerButtonGeo.textContent = choosedCity;
  let userData = await getUserData();
  if (userData.personal.ID == null)
    return (document.location.href = "https://ohotaktiv.ru");
  const order = Object.entries(userData.orders).reverse()[0];
  const element = `
    <div class="result__content">
      <img class="result__img" src="../../assets/img/paysuccess.svg" alt="Статус" />
      <h1 class="result__title">Заказ № ${order[0]} принят!</h1>
      <p class="result__text">
        Ваш заказ на сумму ${numberWithSpaces(
          order[1].PRICE
        )} &#8381; принят. Менеджер уточнит информацию по вашему заказу и свяжется с Вами в ближайшее время.
      </p>
      <a href="../catalog/" class="result__link"> Продолжить покупки </a>
      ${
        userData.cart && Object.keys(userData.cart).length
          ? `
        <p class="result__text text--grey">
          У вас в корзине остались неоформленные товары
        </p>
        <a href="../cart/" class="result__link cart"> Перейти в корзину </a>
      `
          : ``
      }
    </div>
  `;
  const resultWrap = document.querySelector(".result__wrap");
  while (resultWrap.firstChild) {
    resultWrap.removeChild(resultWrap.firstChild);
  }
  resultWrap.insertAdjacentHTML("beforeend", element);
});
