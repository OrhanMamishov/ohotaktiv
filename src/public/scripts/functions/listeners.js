import { bodyScrollToggle } from "./scrollBody";
import { showMessage } from "./showMessage";
import { getUserData } from "../functions/getUserData";
import { updateCountGoods } from "./updateCountGoods";

document.addEventListener("click", async (e) => {
  let userInfo = await getUserData();
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
    if (userInfo.personal.ID == null) {
      document.querySelector(".header__action-link.cabinet").click();
    } else {
      e.target.classList.toggle("is-in");
      const idGood =
        e.target.parentElement.parentElement.children[
          e.target.parentElement.parentElement.children.length - 1
        ].id;
      await fetch(`https://ohotaktiv.ru/local/ajax/fav_2.php?p_id=${idGood}`, {
        method: "GET",
        mode: "no-cors",
      }).then(async () => {
        updateCountGoods(await getUserData());
        if (!e.target.classList.contains("is-in")) {
          showMessage("Товар удален!", "Товар удален из избранного", "success");
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
      `https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?add2basket=yes&id=${e.target.id}`
    )
      .then((res) => res.json())
      .then(async (res) => {
        if (res.STATUS == "OK") {
          showMessage(
            "Товар добавлен!",
            "Товар успешно добавлен в корзину.",
            "success"
          );
          e.target.setAttribute("disabled", true);
          e.target.textContent = "В корзине";
          updateCountGoods(await getUserData());
        }
        if (res.STATUS == "NEOK") {
          showMessage(
            "Ошибка!",
            "Произошла ошибка, пожалуйста обратитесь в службу поддержки.",
            "error"
          );
        }
      });
  }
});
