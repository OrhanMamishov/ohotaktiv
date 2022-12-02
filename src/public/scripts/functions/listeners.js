import { bodyScrollToggle } from "./scrollBody";
import { showMessage } from "./showMessage";
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
    await fetch(
      `https://ohotaktiv.ru/local/ajax/fav_2.php?p_id=${
        e.target.parentElement.parentElement.children[
          e.target.parentElement.parentElement.children.length - 1
        ].id
      }`,
      {
        method: "GET",
        mode: "no-cors",
      }
    ).then(() => {
      if (e.target.classList.contains("is-in")) {
        e.target.classList.remove("is-in");
        showMessage("Товар убран!", "Товар убран из избранного", "success");
      } else {
        e.target.classList.add("is-in");
        showMessage(
          "Товар добавлен!",
          "Товар успешно добавлен в избранное",
          "success"
        );
      }
    });
  }
});
