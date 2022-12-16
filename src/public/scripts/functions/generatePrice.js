import { numberWithSpaces } from "./numberWithSpaces";
export function generatePrice(item) {
  const price = item["PRICE"];
  if (price) {
    if (price[13]) {
      return `${numberWithSpaces(
        Math.ceil(Number(price[13]))
      )} &#8381; <span>${numberWithSpaces(
        Math.ceil(Number(price[1]))
      )} &#8381;</span>`;
    } else {
      if (price[5]) {
        if (price[5] == price[1]) {
          return `${numberWithSpaces(Math.ceil(Number(price[5])))} &#8381;`;
        } else {
          return `${numberWithSpaces(
            Math.ceil(Number(price[5]))
          )} &#8381; <span>${numberWithSpaces(
            Math.ceil(Number(price[1]))
          )} &#8381;</span>`;
        }
      } else {
        return numberWithSpaces(Math.ceil(Number(price[1])));
      }
    }
  } else {
    return "Нет цены";
  }
}
