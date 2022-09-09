import "../imports";
import "../../styles/pages/brands/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  const brandsStartItems = document.querySelectorAll(".brands__start-item");
  const brandsInput = document.querySelector(".brands__input");
  const brandsItem = document.querySelectorAll(".brands__item");
  brandsStartItems.forEach((item) => {
    item.addEventListener("click", () => {
      brandsInput.value = "";
      brandsStartItems.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      if (item.textContent.includes("Все")) {
        brandsItem.forEach((el) => (el.style.display = "block"));
        return;
      }
      brandsItem.forEach((el) => {
        const brand = el.children[0].textContent;
        if (
          brand
            .replace(/\s/g, "")
            .startsWith(item.textContent.replace(/\s/g, ""))
        ) {
          el.style.display = "block";
        } else {
          el.style.display = "none";
        }
      });
    });
  });
  brandsInput.addEventListener("input", (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(
      /[^а-я, ^А-Я, a-z, A-Z '']/,
      ""
    );
    brandsItem.forEach((item) => {
      const brand = item.children[0].textContent;
      if (brand.toLowerCase().includes(brandsInput.value.toLowerCase())) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});
