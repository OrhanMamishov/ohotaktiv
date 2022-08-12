import "../imports";
import "../../styles/pages/remington/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  const remingtonTabButtons = document.querySelectorAll(
    ".remington__tabs-item"
  );
  const remingtonResultTabs = document.querySelectorAll(".remington__tab-list");
  remingtonTabButtons.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("is-active")) return;
      remingtonTabButtons.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      const target = item.getAttribute("data-path");
      remingtonResultTabs.forEach((tab) => {
        tab.classList.remove("is-open");
        if (tab.getAttribute("data-target") == target)
          tab.classList.add("is-open");
      });
    });
  });
});
