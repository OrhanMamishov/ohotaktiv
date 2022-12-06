import { bodyScrollToggle } from "./scrollBody";
import { showMessage } from "./showMessage";
import { getUserData } from "../functions/getUserData";
import { updateCountGoods } from "./updateCountGoods";

document.addEventListener("click", async (e) => {
  if (e.target.className == "navigation__link back") {
    history.back();
  }
  if (e.target.className == "popup__background") {
    bodyScrollToggle();
    e.target.parentElement.remove();
  }
  if (e.target.className == "popup__wrap-close") {
    document.querySelector(".popup__background").click();
  }
  if (
    e.target.className == "card-item__photo-button favourite " ||
    e.target.className == "card-item__photo-button favourite is-in"
  ) {
    e.target.classList.toggle("is-in");
    const idGood =
      e.target.parentElement.parentElement.children[
        e.target.parentElement.parentElement.children.length - 1
      ].id;
    let userInfo = await getUserData();
    if (userInfo.personal.ID == null) {
      // const parent = e.target.parentElement.parentElement;
      // console.log(parent);
    } else {
      await fetch(`https://ohotaktiv.ru/local/ajax/fav_2.php?p_id=${idGood}`, {
        method: "GET",
        mode: "no-cors",
      }).then(async () => {
        updateCountGoods(await getUserData());
        if (!e.target.classList.contains("is-in")) {
          showMessage("Товар убран!", "Товар убран из избранного", "success");
        } else {
          showMessage(
            "Товар добавлен!",
            "Товар успешно добавлен в избранное",
            "success"
          );
        }
      });
    }
  }
  if (e.target.className == "card-item__button") {
    await fetch(
      `https://ohotaktiv.ru${e.target.getAttribute(
        "data-url"
      )}?action=ADD2BASKET&id=${
        e.target.id
      }&ajax_basket=Y&quantity=1&prop[0]=0`,
      {}
    )
      .then((res) => res.json())
      .then(async (res) => {
        if (res.STATUS == "OK") {
          showMessage("Товар добавлен!", res.MESSAGE, "success");
          e.target.setAttribute("disabled", true);
          e.target.textContent = "В корзине";
        }
        updateCountGoods(await getUserData());
      });
  }
});
