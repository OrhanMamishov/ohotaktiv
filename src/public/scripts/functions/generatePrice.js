import { numberWithSpaces } from "./numberWithSpaces";
export function generatePrice(item) {
  const price = item["PRICE"];
  if (price) {
    if (price[13]) {
      return `${numberWithSpaces(price[13])} &#8381; <span>${numberWithSpaces(
        price[1]
      )} &#8381;</span>`;
    } else {
      if (price[5]) {
        return `${numberWithSpaces(price[5])} &#8381; <span>${numberWithSpaces(
          price[1]
        )} &#8381;</span>`;
      } else {
        return numberWithSpaces(price[1]);
      }
    }
  } else {
    return "Нет в наличии";
  }
}
