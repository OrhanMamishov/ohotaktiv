import "../imports";
import "../../styles/pages/return/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  // табы
  const returnTabButtons = document.querySelectorAll(".return__tabs-item");
  const returnResultTabs = document.querySelectorAll(".return__result");
  returnTabButtons.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("is-active")) return;
      returnTabButtons.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      const target = item.getAttribute("data-path");
      returnResultTabs.forEach((tab) => {
        tab.classList.remove("is-open");
        if (tab.getAttribute("data-target") == target)
          tab.classList.add("is-open");
      });
    });
  });
  // табы
});
