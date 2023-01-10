import "../imports";
import "../../styles/pages/vacancy/style.scss";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener("DOMContentLoaded", async () => {
  await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/vacancy/vacancy.php?read=allvacancies"
  )
    .then((res) => res.json())
    .then((res) => {
      return refreshVacancies(res);
    });
  function refreshVacancies(vacancies) {
    const element = `
      <input type="text" class="vacancy__input" placeholder="Найти работу в своем городе">
      <ul class="vacancy__list accordion-container">
      ${vacancies
        .map((vacancy) => {
          return `
            <li class="vacancy__item ac">
              <h2 class="ac-header">
                <button type="button" class="ac-trigger">
                  <span class="name">${vacancy.name}</span>
                  <span class="price"> ${vacancy.salary} </span>
                  <span class="address">
                    г. ${vacancy.city}
                  </span>
                  <span class="job">
                    <span> Должностные обязанности </span>
                    ${vacancy.responsibilities}
                  </span>
                </button>
              </h2>
              <div class="ac-panel">
                <p class="job">
                  <span> Требования: </span>
                  ${vacancy.requirements
                    .split("\n")
                    .map((el) => {
                      return `— ${el}<br />`;
                    })
                    .join("")}
                </p>
                <p class="job">
                  <span> Условия: </span>
                  ${vacancy.conditions
                    .split("\n")
                    .map((el) => {
                      return `— ${el}<br />`;
                    })
                    .join("")}
                </p>
                <a href="${
                  vacancy.urlvacancy
                }" class="vacancy__item-button" target="_blank">
                  Откликнуться на вакансию
                </a>
              </div>
            </li>
          `;
        })
        .join("")}
      </ul>
    `;
    const vacancyWrap = document.querySelector(".vacancy__wrap");
    while (vacancyWrap.firstChild) {
      vacancyWrap.removeChild(vacancyWrap.firstChild);
    }
    vacancyWrap.insertAdjacentHTML("beforeend", element);
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
        const nameVacancy =
          item.children[0].children[0].children[0].textContent;
        const cityVacancy =
          item.children[0].children[0].children[2].textContent;
        if (
          nameVacancy
            .toLowerCase()
            .includes(inputVacancy.value.toLowerCase()) ||
          cityVacancy.toLowerCase().includes(inputVacancy.value.toLowerCase())
        ) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
    // Выбор вакансии
  }
});
