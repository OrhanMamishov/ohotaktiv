import "../imports";
import "../../styles/pages/catalog/style.scss";
import Swiper, { Pagination, Grid, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import gsap from "gsap";
import wNumb from "wnumb";
import { numberWithSpaces } from "../functions/numberWithSpaces";
import { bodyScrollToggle } from "../functions/scrollBody";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");
  const serverName = "https://ohotaktiv.ru";
  const allSelects = document.querySelectorAll(".js-select");
  allSelects.forEach((select) => {
    new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
      allowHTML: true,
    });
  });
  const allAccordions = document.querySelectorAll(".accordion-container");
  allAccordions.forEach((accordion) => {
    new Accordion(accordion);
  });
  const swiperCards = new Swiper(".swiper-cards", {
    modules: [Pagination, Grid],
    spaceBetween: 10,
    slidesPerView: 4,
    slidesPerGroup: 4,
    loopFillGroupWithBlank: true,
    grid: {
      rows: 3,
      fill: "row",
    },
    pagination: {
      el: ".detail__cards-swiper-pagination",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 5,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
    breakpoints: {
      1561: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        grid: {
          rows: 3,
          fill: "row",
        },
      },
      1023: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: {
          rows: 3,
          fill: "row",
        },
      },
      600: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 30,
        grid: {
          rows: 3,
          fill: "row",
        },
      },
      320: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10,
        grid: {
          rows: 2,
          fill: "row",
        },
      },
    },
  });
  const swiperRecommended = new Swiper(".swiper-recommended", {
    spaceBetween: 16,
    modules: [Navigation],
    allowTouchMove: false,
    navigation: {
      nextEl: ".recommended__swiper-button-next",
      prevEl: ".recommended__swiper-button-prev",
    },

    breakpoints: {
      1559: {
        slidesPerView: 5,
      },
      1366: {
        slidesPerView: 4,
      },
      1023: {
        slidesPerView: 3,
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 3,
        allowTouchMove: true,
      },
      600: {
        spaceBetween: 20,
        slidesPerView: 3,
        allowTouchMove: true,
      },
      320: {
        spaceBetween: 25,
        slidesPerView: 2,
        allowTouchMove: true,
      },
    },
  });
  const swiperViewed = new Swiper(".swiper-viewed", {
    spaceBetween: 16,
    modules: [Navigation],
    allowTouchMove: false,
    navigation: {
      nextEl: ".viewed__swiper-button-next",
      prevEl: ".viewed__swiper-button-prev",
    },

    breakpoints: {
      1559: {
        slidesPerView: 5,
      },
      1366: {
        slidesPerView: 4,
      },
      1023: {
        slidesPerView: 3,
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 3,
        allowTouchMove: true,
      },
      600: {
        spaceBetween: 20,
        slidesPerView: 3,
        allowTouchMove: true,
      },
      320: {
        spaceBetween: 25,
        slidesPerView: 2,
        allowTouchMove: true,
      },
    },
  });
  const tlFilter = gsap.timeline({ paused: true });
  const filterWrap = document.querySelector(".detail__filters");
  const filter = document.querySelector(".detail__filters-wrap");
  const detailSection = document.querySelector(".detail");
  detailSection.addEventListener("click", (e) => {
    if (e.target.className == "detail__cards-filter-open") {
      tlFilter
        .to(filterWrap, { visibility: "visible", opacity: 1, duration: 0.1 })
        .to(filter, { x: 0, duration: 0.2 });
      bodyScrollToggle();
      tlFilter.play();
    }
    if (
      e.target.className == "detail__close" ||
      e.target.className == "detail__filters-background"
    ) {
      bodyScrollToggle();
      tlFilter.reverse();
    }
  });
  // const catalogArray = await fetch(
  //   "https://ohotaktiv.ru/12dev/new-design/pages/catalog/catalog.json",
  //   {
  //     method: "GET",
  //   }
  // )
  //   .then((res) => res.json())
  //   .then((res) => {
  //     refreshCatalog(res);
  //   });

  // function refreshCatalog(res) {
  //   while (main.firstChild) {
  //     main.removeChild(main.firstChild);
  //   }
  //   const parentList = res.catalog.parent_list;
  //   const sectionList = res.catalog.section_list;
  //   parentList.sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1));
  //   console.log(res);
  //   const element = `
  //     <section class="catalog">
  //       <div class="catalog__wrap container">
  //         <nav class="navigation">
  //           <ul class="navigation__list">
  //             <li class="navigation__item">
  //               <a href="#" class="navigation__link back"> Назад </a>
  //             </li>
  //             <li class="navigation__item">
  //               <a href="#" class="navigation__link"> Главная </a>
  //             </li>
  //             <li class="navigation__item">
  //               <a href="#" class="navigation__link"> Каталог </a>
  //             </li>
  //           </ul>
  //         </nav>
  //         <h1 class="catalog__title">Каталог</h1>
  //         <ul class="catalog__list">
  //         ${parentList
  //           .map((list) => {
  //             const filteredList = sectionList.filter(
  //               (section) => section.section_parent == list.ID
  //             );
  //             filteredList.sort((a, b) =>
  //               Number(a.sort) > Number(b.sort) ? 1 : -1
  //             );
  //             // console.log(filteredList);
  //             return `
  //               <li class="catalog__item">
  //                 <div class="catalog__img-wrap">
  //                   <img
  //                     src="${serverName + list.picture}"
  //                     alt="${list.name}"
  //                     class="catalog__img"
  //                   />
  //                 </div>
  //                 <a href="#" class="catalog__link title"> ${list.name} </a>
  //                 ${filteredList
  //                   .map((el) => {
  //                     return `
  //                       <a href="#" class="catalog__link"> ${el.name} </a>
  //                     `;
  //                   })
  //                   .join("")}
  //                 <button class="catalog__more none">Еще категории</button>
  //               </li>
  //             `;
  //           })
  //           .join("")}
  //         </ul>
  //       </div>
  //     </section>
  //   `;
  //   main.insertAdjacentHTML("beforeend", element);
  // }
});
