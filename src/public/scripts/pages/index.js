import "../imports";
import "../../styles/pages/index/style.scss";
import { generateCard } from "../functions/generateCard";
import { bodyScrollToggle } from "../functions/scrollBody";
import Swiper, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css/bundle";
import { getUserData } from "../functions/getUserData";
import { showMessage } from "../functions/showMessage";

document.addEventListener("DOMContentLoaded", async () => {
  if (document.location.search.includes("?logout=yes")) {
    showMessage("Выход", "Вы вышли из учетной записи!", "success");
  }
  const userInfo = await getUserData();
  const main = document.querySelector("main");
  const hitItems = await fetch(
    `https://ohotaktiv.ru/12dev/new-design/widgets/items.php?read=hit`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
  const newItems = await fetch(
    `https://ohotaktiv.ru/12dev/new-design/widgets/items.php?read=new`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
  const popularItems = await fetch(
    `https://ohotaktiv.ru/12dev/new-design/widgets/sections.php?read=popular`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
  const recommendedItems = await fetch(
    `https://ohotaktiv.ru/12dev/new-design/widgets/items.php?read=recommended`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
  const blogItems = await fetch(
    `https://ohotaktiv.ru/12dev/new-design/pages/blog/blog.php?read=all`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res.slice(0, 6);
    });
  const mainBanners = [
    {
      picture: "../../assets/img/main-banner.jpg",
      title: "Новогодняя распродажа 2023",
      text: "Новогодняя акция! Успей приобрести товары со скидкой с 16 декабря по 20 января!",
      url: "#",
    },
    {
      picture: "../../assets/img/main-banner.jpg",
      title: "Новогодняя распродажа 2023 / 2",
      text: "Новогодняя акция! Успей приобрести товары со скидкой с 16 декабря по 20 января!",
      url: "#",
    },
    {
      picture: "../../assets/img/main-banner.jpg",
      title: "Новогодняя распродажа 2023 / 3",
      text: "Новогодняя акция! Успей приобрести товары со скидкой с 16 декабря по 20 января!",
      url: "#",
    },
  ];
  const element = `
  <section class="banners">
    <h2 class="banner__title visually-hidden">Главный баннер сайта</h2>
    <div class="banners__wrap">
      <div class="swiper swiper-banner">
        <ul class="banners__list swiper-wrapper">
          ${mainBanners
            .map((banner) => {
              return `
              <li class="banners__item swiper-slide">
                <a href="${banner.url}" class="banners__link">
                  <img class="banners__img" src="${banner.picture}" alt="${banner.title}">
                  <div class="banners__text-wrap container">
                    <p class="banners__title">${banner.title}</p>
                    <p class="banners__text">${banner.text}</p>
                    <p class="banners__more">Подробнее об акции</p>
                  </div>
                </a>
              </li>
            `;
            })
            .join("")}
        </ul>
        <div class="banners__pagination swiper-pagination"></div>
      </div>
    </div>
  </section>
  <section class="bestsellers">
    <div class="bestsellers__wrap container">
      <h2 class="bestsellers__title">Хиты продаж</h2>
      <div class="swiper swiper-bestsellers">
        <ul class="bestsellers__list swiper-wrapper cards-list">
          ${hitItems
            .map((item) => {
              return generateCard(item, ["favourite"], true, userInfo);
            })
            .join("")}
        </ul>
        <div
          class="bestsellers__swiper-button-prev swiper-button-prev"
        ></div>
        <div
          class="bestsellers__swiper-button-next swiper-button-next"
        ></div>
        <div class="bestsellers__pagination swiper-pagination"></div>
      </div>
    </div>
  </section>
  <section class="new">
    <div class="new__wrap container">
      <h2 class="new__title">Новинки</h2>
      <div class="swiper swiper-new">
        <ul class="new__list swiper-wrapper">
        ${newItems
          .map((item) => {
            return generateCard(item, ["favourite"], true, userInfo);
          })
          .join("")}
        </ul>
        <div class="new__swiper-button-prev swiper-button-prev"></div>
        <div class="new__swiper-button-next swiper-button-next"></div>
        <div class="new__pagination swiper-pagination"></div>
      </div>
    </div>
  </section>
  <section class="bonuscard">
    <div class="bonuscard__wrap container">
      <div class="bonuscard__text-wrap">
        <h2 class="bonuscard__title">Электронная бонусная карта</h2>
        <p class="bonuscard__text">
          Приобретайте бонусную карту ОхотАктив и получайте выгоду при
          покупке
        </p>
        <button id="index-bonuscard-button" class="bonuscard__button">
          Перейти в карточку товара
        </button>
      </div>
      <img
        src="../../assets/img/bonus-card.png"
        alt="Бонусная карта"
        class="bonuscard__img"
      />
    </div>
  </section>
  <section class="popular">
    <div class="popular__wrap container">
      <h2 class="popular__title">Популярные категории</h2>
      <div class="swiper swiper-popular">
        <ul class="popular__list swiper-wrapper">
        ${popularItems
          .map((item) => {
            return `
              <li class="popular__item swiper-slide">
                <a href="../catalog/?section=${item.code}" class="popular__link">
                  <div class="popular__img-wrap">
                    <img
                      src="https://ohotaktiv.ru${item.pic}"
                      alt="${item.name}"
                      class="popular__item-img"
                    />
                  </div>
                  <p class="popular__item-text">${item.name}</p>
                </a>
              </li>
            `;
          })
          .join("")}
        </ul>
        <div class="popular__swiper-button-prev swiper-button-prev"></div>
        <div class="popular__swiper-button-next swiper-button-next"></div>
        <div class="popular__pagination swiper-pagination"></div>
      </div>
    </div>
  </section>
  <section class="ready">
    <div class="ready__wrap container">
      <h2 class="ready__title">Готовимся к сезону</h2>
      <div class="swiper swiper-ready">
        <ul class="ready__list swiper-wrapper">
          <li class="ready__item swiper-slide">
            <img src="../../assets/img/ready-img.jpg" alt="Рыбалка" class="ready__img" />
            <ul class="ready__links-list">
              <li class="ready__links-item item-title">
                <p class="ready__links-link"> Рыбалка </p>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=udilishcha_2075401759" class="ready__links-link"> Удилища </a>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=primanka_1886428494" class="ready__links-link"> Приманка </a>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=ledobury-sanki" class="ready__links-link"> Ледобуры </a>
              </li>
            </ul>
          </li>
          <li class="ready__item swiper-slide">
            <img
              src="../../assets/img/ready-img-2.jpg"
              alt="Рыбалка"
              class="ready__img"
            />
            <ul class="ready__links-list">
              <li class="ready__links-item item-title">
                <p class="ready__links-link"> Охота </p>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=gladkostvolnoe-oruzhie" class="ready__links-link"> Гладкоствольное оружие </a>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=patrony" class="ready__links-link"> Патроны </a>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=pritsely" class="ready__links-link"> Прицелы </a>
              </li>
            </ul>
          </li>
          <li class="ready__item swiper-slide">
            <img
              src="../../assets/img/ready-img-3.jpg"
              alt="Рыбалка"
              class="ready__img"
            />
            <ul class="ready__links-list">
              <li class="ready__links-item item-title">
                <p class="ready__links-link"> Туризм </p>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=termobele" class="ready__links-link"> Термобелье </a>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=sapogi" class="ready__links-link"> Сапоги </a>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=kostyumy" class="ready__links-link"> Костюмы </a>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=turisticheskiy-inventar" class="ready__links-link"> Инвентарь </a>
              </li>
              <li class="ready__links-item">
                <a href="../catalog/?section=ryukzaki" class="ready__links-link"> Рюкзаки </a>
              </li>
            </ul>
          </li>
        </ul>
        <div class="ready__swiper-button-prev swiper-button-prev"></div>
        <div class="ready__swiper-button-next swiper-button-next"></div>
        <div class="ready__pagination swiper-pagination"></div>
      </div>
    </div>
  </section>
  <section class="recommended">
    <div class="recommended__wrap container">
      <h2 class="recommended__title">Рекомендуем</h2>
      <div class="swiper swiper-recommended">
        <ul class="recommended__list swiper-wrapper">
        ${recommendedItems
          .map((item) => {
            return generateCard(item, ["favourite"], true, userInfo);
          })
          .join("")}
        </ul>
        <div
          class="recommended__swiper-button-prev swiper-button-prev"
        ></div>
        <div
          class="recommended__swiper-button-next swiper-button-next"
        ></div>
        <div class="recommended__pagination swiper-pagination"></div>
      </div>
    </div>
  </section>
  <section class="blog">
    <div class="blog__wrap container">
      <h2 class="blog__title">Блог</h2>
      <div class="swiper swiper-blog">
        <ul class="blog__list swiper-wrapper">
          ${blogItems
            .map((blog) => {
              return `
                <li class="blog__item swiper-slide">
                  <a href="../blog/?blog=${blog.code}" class="blog__link">
                    <img
                      src="https://ohotaktiv.ru${blog.pic}"
                      alt="${blog.name}"
                      class="blog__item-img"
                    />
                    ${
                      blog.tag !== null
                        ? `
                      <ul class="blog__tag-list">
                        <li class="blog__tag-item">#туризм</li>
                      </ul>
                    `
                        : ``
                    }
                  </a>
                </li>
              `;
            })
            .join("")}
        </ul>
        <div class="blog__swiper-button-prev swiper-button-prev"></div>
        <div class="blog__swiper-button-next swiper-button-next"></div>
        <div class="blog__pagination swiper-pagination"></div>
      </div>
    </div>
  </section>
  <section class="about">
    <div class="about__wrap container">
      <h1 class="about__title">
        ОхотАктив — товары для охоты, рыбалки и туризма
      </h1>
      <p class="about__text">
        Магазин «ОхотАктив» ${
          document.querySelector(".header__city").textContent
        } — ваш поставщик оружия и экипировки. Наша
        компания является эксклюзивным представителем мировых брендов,
        располагает собственной ремонтной базой, а также сетью розничных
        магазинов для охотников и рыболовов. На
        всю продукцию действует гарантия качества.
      </p>
      <ul class="about__list">
        <li class="about__item">Быстрая доставка</li>
        <li class="about__item">Обмен и возврат</li>
        <li class="about__item">Качественный сервис</li>
        <li class="about__item">Более 75 магазинов</li>
      </ul>
      <a href="../history/" class="about__link">История компании</a>
    </div>
  </section>
      
  `;
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  main.insertAdjacentHTML("beforeend", element);
  const templateSwipers = ["bestsellers", "new", "recommended"];
  templateSwipers.forEach((swiper) => {
    const swiperNew = new Swiper(".swiper-" + swiper, {
      spaceBetween: 16,
      modules: [Navigation, Pagination],
      allowTouchMove: false,
      slidesPerView: "auto",
      navigation: {
        nextEl: `.${swiper}__swiper-button-next`,
        prevEl: `.${swiper}__swiper-button-prev`,
      },
      // loop: true,
      pagination: {
        el: `.${swiper}__pagination`,
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
  });
  //eslint-disable-next-line
  const mainBannerSwiper = new Swiper(".swiper-banner", {
    modules: [Pagination],
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".banners__pagination",
    },
  });
  //eslint-disable-next-line
  const popularSwiper = new Swiper(".swiper-popular", {
    modules: [Navigation, Pagination],
    freeMode: true,
    spaceBetween: 35,
    slidesPerView: 4,
    // loop: true,
    navigation: {
      nextEl: ".popular__swiper-button-next",
      prevEl: ".popular__swiper-button-prev",
    },
    pagination: {
      el: ".popular__pagination",
    },
    breakpoints: {
      1559: {
        spaceBetween: 35,
        slidesPerView: 4,
      },
      1365: {
        spaceBetween: 30,
        slidesPerView: 3.5,
      },
      769: {
        spaceBetween: 30,
        slidesPerView: 3,
      },
      600: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 1.5,
      },
    },
  });
  //eslint-disable-next-line
  const blogSwiper = new Swiper(".swiper-blog", {
    modules: [Navigation, Pagination],
    navigation: {
      nextEl: ".blog__swiper-button-next",
      prevEl: ".blog__swiper-button-prev",
    },
    pagination: {
      el: ".blog__pagination",
    },
    loop: true,
    breakpoints: {
      1559: {
        spaceBetween: 34,
        slidesPerView: 3,
      },
      1439: {
        spaceBetween: 37,
        slidesPerView: 3,
      },
      1023: {
        spaceBetween: 34,
        slidesPerView: 2,
      },
      500: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 1,
      },
    },
  });
  //eslint-disable-next-line
  const readySwiper = new Swiper(".swiper-ready", {
    modules: [Navigation, Pagination],
    navigation: {
      nextEl: ".ready__swiper-button-next",
      prevEl: ".ready__swiper-button-prev",
    },
    pagination: {
      el: ".ready__pagination",
    },
    // loop: true,
    breakpoints: {
      1559: {
        spaceBetween: 35,
        slidesPerView: 3,
      },
      1144: {
        spaceBetween: 30,
        slidesPerView: 2.5,
      },
      820: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      500: {
        spaceBetween: 25,
        slidesPerView: 1.5,
      },
      320: {
        spaceBetween: 10,
        slidesPerView: 1,
      },
    },
  });
});
