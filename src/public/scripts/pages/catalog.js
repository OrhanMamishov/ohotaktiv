import "../imports";
import "../../styles/pages/catalog/style.scss";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");
  const serverName = "https://ohotaktiv.ru";
  const baseUrl = document.location.href;
  const catalogHighArray = await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/catalog/sections/menu.json",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
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
                <a href="#" class="navigation__link back"> Назад </a>
              </li>
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
                      src="${serverName + list.picture}"
                      alt="${list.name}"
                      class="catalog__img"
                    />
                  </div>
                  <div class="catalog__accordion accordion-container">
                    <div class="ac">
                      <h2 class="ac-header">
                        <a href="${list.url.replace(
                          "/catalog",
                          ""
                        )}" class="catalog__link title"> ${list.name} </a>
                        <button type="button" class="ac-trigger"></button>
                        </h2>
                        <div class="ac-panel">
                          <div class="ac-panel-wrap">
                          ${list.depth
                            .map((el) => {
                              if (el.depth) {
                                el.depth.sort((a, b) =>
                                  Number(a.sort) > Number(b.sort) ? 1 : -1
                                );
                                return `
                                  <div class="catalog__accordion accordion-container">
                                    <div class="ac">
                                      <h2 class="ac-header">
                                        <a href="${el.url.replace(
                                          "/catalog",
                                          ""
                                        )}" class="catalog__link subtitle"> ${
                                  el.name
                                } </a>
                                      <button type="button" class="ac-trigger"></button>
                                      </h2>
                                      <div class="ac-panel">
                                        <div class="ac-panel-wrap">
                                          ${el.depth
                                            .map((firstDepth) => {
                                              if (firstDepth.depth) {
                                                firstDepth.depth.sort((a, b) =>
                                                  Number(a.sort) >
                                                  Number(b.sort)
                                                    ? 1
                                                    : -1
                                                );
                                                return `
                                                  <div class="catalog__accordion accordion-container">
                                                    <div class="ac">
                                                      <h2 class="ac-header">
                                                      <a href="${firstDepth.url.replace(
                                                        "/catalog",
                                                        ""
                                                      )}" class="catalog__link subtitle"> ${
                                                  firstDepth.name
                                                } </a>
                                                        <button type="button" class="ac-trigger"></button>
                                                      </h2>
                                                      <div class="ac-panel">
                                                        <div class="ac-panel-wrap">
                                                          ${firstDepth.depth
                                                            .map(
                                                              (secondDepth) => {
                                                                if (
                                                                  secondDepth.depth
                                                                ) {
                                                                  secondDepth.depth.sort(
                                                                    (a, b) =>
                                                                      Number(
                                                                        a.sort
                                                                      ) >
                                                                      Number(
                                                                        b.sort
                                                                      )
                                                                        ? 1
                                                                        : -1
                                                                  );
                                                                  return `
                                                                    <div class="catalog__accordion accordion-container">
                                                                      <div class="ac">
                                                                        <h2 class="ac-header">
                                                                        <a href="${secondDepth.url.replace(
                                                                          "/catalog",
                                                                          ""
                                                                        )}" class="catalog__link subtitle"> ${
                                                                    secondDepth.name
                                                                  } </a>
                                                                          <button type="button" class="ac-trigger"></button>
                                                                        </h2>
                                                                        <div class="ac-panel">
                                                                          <div class="ac-panel-wrap">
                                                                          ${secondDepth.depth
                                                                            .map(
                                                                              (
                                                                                thirdDepth
                                                                              ) => {
                                                                                return `
                                                                                <a href="${thirdDepth.url.replace(
                                                                                  "/catalog",
                                                                                  ""
                                                                                )}" class="catalog__link">${
                                                                                  thirdDepth.name
                                                                                }</a>
                                                                              `;
                                                                              }
                                                                            )
                                                                            .join(
                                                                              ""
                                                                            )}
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  `;
                                                                } else {
                                                                  return `
                                                                  <a href="${secondDepth.url.replace(
                                                                    "/catalog",
                                                                    ""
                                                                  )}" class="catalog__link">${
                                                                    secondDepth.name
                                                                  }</a>
                                                                `;
                                                                }
                                                              }
                                                            )
                                                            .join("")}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                `;
                                              } else {
                                                return `
                                                <a href="${firstDepth.url.replace(
                                                  "/catalog",
                                                  ""
                                                )}" class="catalog__link">${
                                                  firstDepth.name
                                                }</a>
                                              `;
                                              }
                                            })
                                            .join("")}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                `;
                              } else {
                                return `
                                  <a href="${el.url.replace(
                                    "/catalog",
                                    ""
                                  )}" class="catalog__link">${el.name}</a>
                                `;
                              }
                            })
                            .join("")}
                          </div>
                        </div>
                    </div>
                  </div>
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
  }
});
