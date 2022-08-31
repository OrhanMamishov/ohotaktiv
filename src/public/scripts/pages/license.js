import "../imports";
import "../../styles/pages/license/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  // табы
  const licenseTabButtons = document.querySelectorAll(".license__tabs-item");
  const licenseResultTabs = document.querySelectorAll(".license__result");
  licenseTabButtons.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("is-active")) return;
      licenseTabButtons.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      const target = item.getAttribute("data-path");
      licenseResultTabs.forEach((tab) => {
        tab.classList.remove("is-open");
        if (tab.getAttribute("data-target") == target)
          tab.classList.add("is-open");
      });
    });
  });
  // табы
});
