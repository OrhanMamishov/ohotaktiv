import "../../styles/components/footer/style.scss";
import Inputmask from "inputmask";

document.addEventListener("DOMContentLoaded", () => {
  const titleListsFooter = document.querySelectorAll(".item-title");
  const listsFooter = document.querySelectorAll(".footer__list");
  titleListsFooter.forEach((title) => {
    title.addEventListener("click", () => {
      const thisList = title.parentElement;
      if (thisList.classList.contains("is-open")) return;
      listsFooter.forEach((list) => list.classList.remove("is-open"));
      thisList.classList.add("is-open");
    });
  });
  const footerInput = document.getElementById("footer-form-input");
  const footerSubmitButton = document.querySelector(".footer__form-button");
  Inputmask({
    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
    greedy: false,
    showMaskOnHover: false,
    definitions: {
      "*": {
        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
        // casing: "lower",
      },
    },
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    onincomplete: function () {
      this.classList.add("is-not-valid");
    },
  }).mask(footerInput);
  footerSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (footerInput.value.length == 0) {
      footerInput.classList.add("is-not-valid");
      return;
    }
    if (!footerInput.value.includes(".")) {
      footerInput.classList.add("is-not-valid");
      return;
    }
    console.log("POST");
    footerInput.value = "";
  });
});
