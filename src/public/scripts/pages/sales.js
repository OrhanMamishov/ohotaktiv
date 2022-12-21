import "../imports";
import "../../styles/pages/sales/style.scss";

document.addEventListener("DOMContentLoaded", async () => {
  await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/sales/sales.php?read=allsales"
  )
    .then((res) => res.json())
    .then((res) => {
      res.sort((a, b) => (Number(a.id) > Number(b.id) ? -1 : 1));
      return refreshSales(res);
    });
  function refreshSales(sales) {
    const element = `
      <section class="sales">
        <div class="sales__wrap container">
          <nav class="navigation">
            <ul class="navigation__list">
              <li class="navigation__item">
                <a href="#" class="navigation__link"> Главная </a>
              </li>
              <li class="navigation__item">
                <a href="#" class="navigation__link"> Акции </a>
              </li>
            </ul>
          </nav>
          <h1 class="sales__title">Акции</h1>
          <ul class="sales__list">
          ${sales
            .map((sale) => {
              if (sale.main_banner !== "Нет") {
                return `
                <li class="sales__item">
                  <a href="${sale.url}" class="sales__link" target="_blank">
                    <img
                      src="https://ohotaktiv.ru/${sale.min_pic}"
                      alt="Товары по акции"
                      class="sales__img"
                    />
                  </a>
                </li>
              `;
              }
            })
            .join("")}
          </ul>
        </div>
      </section>
    `;
    const main = document.querySelector("main");
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.insertAdjacentHTML("beforeend", element);
  }
});
