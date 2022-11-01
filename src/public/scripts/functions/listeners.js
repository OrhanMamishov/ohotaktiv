import { bodyScrollToggle } from "./scrollBody";
document.addEventListener("click", (e) => {
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
});
