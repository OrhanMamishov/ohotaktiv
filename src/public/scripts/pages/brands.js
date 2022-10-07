import "../imports";
import "../../styles/pages/brands/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  const brandsInput = document.querySelector(".brands__input");
  const brandsItem = document.querySelectorAll(".brands__item");
  const brandsButton = document.querySelector(".brands__button");
  brandsInput.addEventListener("input", (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(
      /[^а-я, ^А-Я, a-z, A-Z '']/,
      ""
    );
    brandsItem.forEach((item) => {
      if (item.classList.contains("title")) return;
      const brand = item.children[0].textContent;
      if (brand.toLowerCase().includes(brandsInput.value.toLowerCase())) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
  brandsButton.addEventListener("click", () => {
    document.querySelector(".brands__all").classList.add("is-open");
    brandsButton.remove();
  });
});
