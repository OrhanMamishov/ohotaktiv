export function updateCountGoods(array) {
  const spanFavouriteElement = `<span class="count">${
    array.favorites ? Object.keys(array.favorites).length : 0
  }</span>`;
  const headerFavourite = document.querySelector(
    ".header__action-link.favourite"
  );
  const spanFavourite = document.querySelector(
    ".header__action-link.favourite>.count"
  );
  if (spanFavourite) spanFavourite.remove();
  headerFavourite.insertAdjacentHTML("beforeend", spanFavouriteElement);

  const spanCartElement = `<span class="count">${
    array.cart ? array.cart.length : 0
  }</span>`;
  const headerCart = document.querySelector(".header__action-link.cart");
  const spanCart = document.querySelector(".header__action-link.cart>.count");
  if (spanCart) spanCart.remove();
  headerCart.insertAdjacentHTML("beforeend", spanCartElement);
}
