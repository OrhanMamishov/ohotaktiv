import "../imports";
import "../../styles/pages/partners/style.scss";
import Inputmask from "inputmask";

document.addEventListener("DOMContentLoaded", () => {
  const innInput = document.getElementById("inn-form-input");
  const nameCompanyInput = document.getElementById("namecompany-form-input");
  const goodsInput = document.getElementById("goods-form-input");
  const nameInput = document.getElementById("name-form-input");
  const jobInput = document.getElementById("job-form-input");
  const telInput = document.getElementById("tel-form-input");
  const emailInput = document.getElementById("email-form-input");
  const submitButton = document.querySelector(".blank__form-button");
  const inputs = [
    innInput,
    nameCompanyInput,
    goodsInput,
    jobInput,
    nameInput,
    telInput,
    emailInput,
  ];
  document.addEventListener("click", (e) => {
    if (e.target.className == "blank__form-dropdown-item") {
      if (e.target.getAttribute("data-inn")) {
        nameCompanyInput.value = e.target.textContent;
        innInput.setAttribute("disabled", true);
        nameCompanyInput.classList.add("is-valid");
        innInput.classList.add("is-valid");
      }
      e.target.parentElement.remove();
    }
    if (e.target.className == "radio__input") {
      e.target.parentElement.classList.remove("is-not-valid");
      e.target.parentElement.classList.add("is-selected");
    }
  });
  Inputmask({
    mask: "*{10}",
    placeholder: "",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
      const dropdown = document.querySelector(".blank__form-dropdown");
      if (dropdown && !this.inputmask.isComplete()) dropdown.remove();
    },
    oncomplete: async function () {
      await fetch(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:
              "Token " + "6469d62ecc3146040716bb2321fdd7559f318eaa",
          },
          body: JSON.stringify({ query: this.value }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          const form = document.querySelector(".blank__form");
          const element = `
            <ul class="blank__form-dropdown">
              ${
                res.suggestions.length
                  ? res.suggestions
                      .map((el) => {
                        return `
                          <li class="blank__form-dropdown-item" data-inn="${el.data.inn}">${el.value}, ИНН: ${el.data.inn}, КПП: ${el.data.kpp}</li>
                        `;
                      })
                      .join("")
                  : `<li class="blank__form-dropdown-item">Не найдено!</li>`
              }
            </ul>
            `;
          form.insertAdjacentHTML("beforeend", element);
        });
    },
    definitions: {
      "*": {
        validator: "[0-9/]",
      },
    },
  }).mask(innInput);
  Inputmask({
    mask: "*{30}",
    placeholder: "",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    definitions: {
      "*": {
        validator: "[А-Яа-я- Ёё]",
      },
    },
  }).mask(nameInput);
  Inputmask({
    mask: "*{30}",
    placeholder: "",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    definitions: {
      "*": {
        validator: "[А-Яа-я- Ёё]",
      },
    },
  }).mask(jobInput);
  Inputmask({
    mask: "+7 (999) 999-99-99",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    onincomplete: function () {
      this.classList.add("is-not-valid");
      this.classList.remove("is-valid");
    },
    oncomplete: function () {
      this.classList.add("is-valid");
    },
  }).mask(telInput);
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
      this.classList.remove("is-valid");
    },
    onincomplete: function () {
      this.classList.add("is-not-valid");
      this.classList.remove("is-valid");
    },
    oncomplete: function () {
      this.classList.add("is-valid");
    },
  }).mask(emailInput);
  Inputmask({
    mask: "",
    placeholder: "",
    showMaskOnHover: false,
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
      this.classList.remove("is-valid");
    },
  }).mask(goodsInput);
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    inputs.forEach((input) => {
      if (!input.validity.valid) {
        input.classList.add("is-not-valid");
        if (input.type == "file")
          input.nextElementSibling.classList.add("is-not-valid");
      }
    });
    const isNotValid = document.querySelectorAll(".is-not-valid");
    const radioButtonsWrap = document.querySelectorAll(
      ".blank__form-radio-wrap"
    );
    let trigger = true;
    radioButtonsWrap.forEach((buttonWrap) => {
      if (!buttonWrap.classList.contains("is-selected")) {
        trigger = false;
        buttonWrap.classList.add("is-not-valid");
      }
    });
    if (!isNotValid.length && trigger) {
      console.log("POST");
      inputs.forEach((input) => {
        input.value = "";
        input.classList.remove("is-valid");
        if (input.type == "file") {
          input.nextElementSibling.classList.remove("is-valid");
          input.nextElementSibling.textContent =
            "Прикрепить файлы .png, .jpg, .doc, .pdf, не более 8МВ";
        }
      });
      innInput.removeAttribute("disabled");
      const radioButtons = document.querySelectorAll("radio__input");
      radioButtons.forEach((button) => (button.checked = "false"));
    }
  });
});
