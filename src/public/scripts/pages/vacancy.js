import "../imports";
import "../../styles/pages/vacancy/style.scss";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import { bodyScrollToggle } from "../functions/scrollBody";
import Inputmask from "inputmask";

document.addEventListener("DOMContentLoaded", () => {
  new Accordion(".vacancy__list");
  // Выбор вакансии
  const inputVacancy = document.querySelector(".vacancy__input");
  const vacanciesItems = document.querySelectorAll(".vacancy__item");
  inputVacancy.addEventListener("input", (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(
      /[^а-я, ^А-Я, a-z, A-Z '']/,
      ""
    );
    vacanciesItems.forEach((item) => {
      const nameVacancy = item.children[0].children[0].children[0].textContent;
      const cityVacancy = item.children[0].children[0].children[2].textContent;
      if (
        nameVacancy.toLowerCase().includes(inputVacancy.value.toLowerCase()) ||
        cityVacancy.toLowerCase().includes(inputVacancy.value.toLowerCase())
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
  // Выбор вакансии
  // Откликнуться на вакансию
  const buttonsVacancy = document.querySelectorAll(".vacancy__item-button");
  buttonsVacancy.forEach((button) => {
    button.addEventListener("click", () => {
      const idVacancy = button.getAttribute("id");
      const nameVacancy =
        button.parentElement.parentElement.children[0].children[0].children[0]
          .textContent;
      bodyScrollToggle();
      const popupVacancyElement = `
        <div id="popup-vacancy" class="popup">
          <div class="popup__background"></div>
          <div class="popup__wrap">
            <button class="popup__wrap-close"></button>
            <h2 class="popup__wrap-title">
              Отклик на вакансию ${nameVacancy}
            </h2>
            <form action="#" class="popup__form">
              <div class="popup__personal-wrap">
                <div class="input-wrap">
                  <input class="popup__wrap-input" id="name-form-input" type="text" placeholder=" " required>
                  <label for="name-form-input">Имя</label>
                </div>
                <div class="input-wrap">
                  <input class="popup__wrap-input" id="surname-form-input" type="text" placeholder=" " required>
                  <label for="surname-form-input">Фамилия</label>
                </div>
                <div class="input-wrap">
                  <input class="popup__wrap-input" id="email-form-input" type="text" placeholder=" " required>
                  <label for="email-form-input">E-mail</label>
                </div>
                <div class="input-wrap">
                  <input class="popup__wrap-input" id="tel-form-input" type="tel" placeholder=" " required>
                  <label for="tel-form-input">Телефон</label>
                </div>
                <div class="input-wrap-file">
                  <input name="file" type="file" id="input-wrap-file" class="input-wrap-file__input" accept=".pdf, .jpg, .doc, .docx" required>
                  <label for="input-wrap-file">
                    Прикрепить резюме
                  </label>
                </div>
              </div>
              <label class="checkbox__label">
                Я даю согласие на обработку персональных данных</a>
                <input type="checkbox" class="checkbox visually-hidden" required>
                <span class="checkbox__span"></span>
              </label>
              <button id="submit-button" class="popup__wrap-button">
                Отправить
              </button>
            </form>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", popupVacancyElement);
      // закрытие формы
      const popupVacancy = document.getElementById("popup-vacancy");
      const closePopup = document.querySelector(".popup__wrap-close");
      const backgroundPopup = document.querySelector(".popup__background");
      closePopup.addEventListener("click", () => {
        bodyScrollToggle();
        popupVacancy.remove();
      });
      backgroundPopup.addEventListener("click", () => closePopup.click());
      // закрытие формы
      // выбор файлов
      const inputFile = document.querySelector(".input-wrap-file__input");
      const labelFile = inputFile.nextElementSibling;
      inputFile.addEventListener("change", (e) => {
        labelFile.textContent = "Выбран файл: ";
        Object.values(e.target.files).forEach((el) => {
          labelFile.textContent += el.name;
        });
      });
      // выбор файлов
      // валидация
      const nameInput = document.getElementById("name-form-input");
      const surnameInput = document.getElementById("surname-form-input");
      const telInput = document.getElementById("tel-form-input");
      const emailInput = document.getElementById("email-form-input");
      const submitButton = document.getElementById("submit-button");
      submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        const inputs = document.querySelectorAll(".popup__wrap-input");
        inputs.forEach((input) => {
          if (!input.validity.valid) {
            input.classList.add("is-not-valid");
          }
        });
      });
      Inputmask({
        mask: "*{30}",
        placeholder: "",
        showMaskOnHover: false,
        onKeyDown: function () {
          this.classList.remove("is-not-valid");
        },
        definitions: {
          "*": {
            validator: "[А-Яа-яЁё-]",
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
            validator: "[А-Яа-яЁё-]",
          },
        },
      }).mask(surnameInput);
      Inputmask({
        mask: "+7 (999) 999-99-99",
        showMaskOnHover: false,
        onKeyDown: function () {
          this.classList.remove("is-not-valid");
        },
        onincomplete: function () {
          this.classList.add("is-not-valid");
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
        },
        onincomplete: function () {
          this.classList.add("is-not-valid");
        },
      }).mask(emailInput);
      // валидация
    });
  });
  // Откликнуться на вакансию
});
