import { generatePrice } from "./generatePrice";

export function generateCard(card, buttons, isCatalog, userData) {
  const serverName = "https://ohotaktiv.ru";
  const idCard = isCatalog ? card.ID : card[0];
  return `
  <li class="swiper-slide card-item">
    <div class="card-item__wrap">
      <div class="card-item__photo-button-wrap">
      ${buttons
        .map((button) => {
          let isInFavourite;
          if (button == "favourite") {
            isInFavourite = userData
              ? userData.favorites
                ? Object.keys(userData.favorites).includes(idCard)
                : false
              : false;
          }
          return `
          <span
            class="card-item__photo-button ${button} ${
            button == "favourite" ? (isInFavourite ? "is-in" : "") : ""
          }"
          ></span>
        `;
        })
        .join("")}
      </div>
      <a href="../card/?id=${idCard}" class="card-item__link" target="_blank">
        <div class="card-item__photo-wrap">
          <img
            src="${serverName}${
    isCatalog
      ? card.PREVIEW_PICTURE
        ? card.PREVIEW_PICTURE
        : card.properties
        ? card.properties.MORE_PHOTO
          ? card.properties.MORE_PHOTO.FILES
          : `/local/templates/ohota2021/img/no_photo.png`
        : `/local/templates/ohota2021/img/no_photo.png`
      : card[1].PREVIEW_PICTURE
      ? card[1].PREVIEW_PICTURE
      : card[1].img
      ? card[1].img
      : `/local/templates/ohota2021/img/no_photo.png`
  }"
            alt="${isCatalog ? card.name : card[1].NAME}"
            class="card-item__photo  ${
              isCatalog
                ? `${
                    card.properties &&
                    card.properties.STORE_AVAILABLE &&
                    Object.keys(card.properties.STORE_AVAILABLE).length
                      ? ``
                      : `not-available`
                  }`
                : ``
            }"
          />
          <div class="card-item__photo-texts">
            <p class="card-item__photo-text new">Что то</p>
            <p class="card-item__photo-text discount">-10%</p>
          </div>
        </div>
        <div class="card-item__description-wrap">
          <p class="card-item__description-price">
            ${generatePrice(isCatalog ? card : card[1])}
          </p>
          <p class="card-item__description-text">
            ${isCatalog ? card.name : card[1].NAME}
          </p>
          <p class="card-item__description-reviews">
            Отзывы: 10
          </p>
        </div>
      </a>
      <button id="${idCard}" class="card-item__button" data-url="/catalog/full_remington/sportivnaya-strelba/38674/" ${
    isCatalog
      ? `
      ${
        card.properties &&
        card.properties.STORE_AVAILABLE &&
        Object.keys(card.properties.STORE_AVAILABLE).length
          ? `${
              userData.cart
                ? Object.keys(userData.cart).includes(idCard)
                  ? "disabled"
                  : ""
                : ""
            }`
          : `disabled`
      }
    `
      : `${
          userData.cart
            ? Object.keys(userData.cart).includes(idCard)
              ? "disabled"
              : ""
            : ""
        }`
  }>${
    isCatalog
      ? `${
          card.properties &&
          card.properties.STORE_AVAILABLE &&
          Object.keys(card.properties.STORE_AVAILABLE).length
            ? `${
                userData.cart
                  ? Object.keys(userData.cart).includes(idCard)
                    ? "В корзине"
                    : "В корзину"
                  : "В корзину"
              }`
            : `Нет в наличии`
        }`
      : `${
          userData.cart
            ? Object.keys(userData.cart).includes(idCard)
              ? "В корзине"
              : "В корзину"
            : "В корзину"
        }`
  }</button>
    </div>
  </li>
  `;
}
