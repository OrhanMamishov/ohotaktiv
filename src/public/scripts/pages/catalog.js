import "../imports";
import "../../styles/pages/catalog/style.scss";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");
  const serverName = "https://ohotaktiv.ru";
  const baseUrl = document.location.href;
  const catalogHighArray = await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/catalog/gentwo/sections/menu.json",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return refreshCatalog(res);
    });

  function refreshCatalog(catalog) {
    catalog.sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1));
    const element = `
      <section class="catalog">
        <div class="catalog__wrap container">
          <nav class="navigation">
            <ul class="navigation__list">
              <li class="navigation__item">
                <a href="../index/" class="navigation__link"> Главная </a>
              </li>
              <li class="navigation__item">
                <a href="../catalog/" class="navigation__link"> Каталог </a>
              </li>
            </ul>
          </nav>
          <h1 class="catalog__title">Каталог</h1>
          <ul class="catalog__list">
          ${catalog
            .map((list) => {
              if (list.name == "other") return;
              return `
                <li class="catalog__item">
                  <div class="catalog__img-wrap">
                    <img
                      src="${serverName}${
                list.picture
                  ? list.picture
                  : `/local/templates/ohota2021/img/no_photo.png`
              }"
                      alt="${list.name}"
                      class="catalog__img"
                    />
                  </div>
                  <a href="${list.code}" class="catalog__link title"> ${
                list.name
              } </a>
                  ${
                    list.depth
                      ? `
                    <ul class="catalog__depths-list">
                      ${list.depth
                        .map((el, index) => {
                          return `
                            <li class="catalog__depths-item ${
                              index > 9 ? "none" : ""
                            }">
                              <a href="${
                                el.code
                              }" class="catalog__depths-link"> ${el.name} </a>
                            </li>
                            ${
                              index == 9 && list.depth[10]
                                ? `<li class="catalog__depths-item"><button class="catalog__more">Еще категории</button></li>`
                                : ``
                            }
                          `;
                        })
                        .join("")}
                    </ul>
                  `
                      : ``
                  }
                </li>
                `;
            })
            .join("")}
            </ul>
          </div>
        </section>
      `;
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.insertAdjacentHTML("beforeend", element);
    const allAccordions = document.querySelectorAll(".accordion-container");
    allAccordions.forEach((accordion) => {
      new Accordion(accordion);
    });
    const catalogElement = document.querySelector("section.catalog");
    catalogElement.addEventListener("click", (e) => {
      if (e.target.className == "catalog__more") {
        for (let item of e.target.parentElement.parentElement.children) {
          if (item.classList.contains("none")) {
            item.classList.remove("none");
          }
        }
        e.target.parentElement.remove();
      }
      if (
        e.target.classList.contains("catalog__link") ||
        e.target.classList.contains("catalog__depths-link")
      ) {
        e.preventDefault();
        console.log(e.target);
      }
    });
  }
});
