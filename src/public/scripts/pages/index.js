import Swiper, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "../imports";
import "../../styles/pages/index/style.scss";
import { bodyScrollToggle } from "../functions/scrollBody";

document.addEventListener("DOMContentLoaded", () => {
  // Свайперы
  //eslint-disable-next-line
  const templateSwipers = [
    "swiper-bestsellers",
    "swiper-new",
    "swiper-recommended",
  ];
  templateSwipers.forEach((swiper) => {
    new Swiper("." + swiper, {
      spaceBetween: 10,
      modules: [Navigation],
      navigation: {
        nextEl: `.${swiper.split("-").reverse().join("__")}-button-next`,
        prevEl: `.${swiper.split("-").reverse().join("__")}-button-prev`,
      },
      breakpoints: {
        1559: {
          slidesPerView: 6,
        },
        // 1439: {
        //   spaceBetween: 30,
        //   slidesPerView: 5,
        // },
        1023: {
          // spaceBetween: 30,
          slidesPerView: 3,
        },
        767: {
          spaceBetween: 20,
          slidesPerView: 3,
        },
        320: {
          // spaceBetween: 10,
          slidesPerView: 2,
        },
      },
    });
  });
  const mainBannerSwiper = new Swiper(".swiper-banner", {
    modules: [Navigation],
    spaceBetween: 30,
    navigation: {
      nextEl: ".banners__swiper-button-next",
      prevEl: ".banners__swiper-button-prev",
    },
  });
  //eslint-disable-next-line
  const popularSwiper = new Swiper(".swiper-popular", {
    freeMode: true,
    breakpoints: {
      1559: {
        spaceBetween: 35,
        slidesPerView: 4,
      },
      1439: {
        spaceBetween: 30,
        slidesPerView: 3.5,
      },
      1023: {
        spaceBetween: 30,
        slidesPerView: 2.5,
      },
      767: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      320: {
        freeMode: true,
        spaceBetween: 10,
        slidesPerView: 1.5,
      },
    },
  });
  //eslint-disable-next-line
  const blogSwiper = new Swiper(".swiper-blog", {
    modules: [Navigation],
    navigation: {
      nextEl: ".blog__swiper-button-next",
      prevEl: ".blog__swiper-button-prev",
    },
    breakpoints: {
      1559: {
        spaceBetween: 35,
        slidesPerView: 4,
      },
      1439: {
        spaceBetween: 30,
        slidesPerView: 3.5,
      },
      1023: {
        spaceBetween: 30,
        slidesPerView: 2.5,
      },
      767: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      320: {
        freeMode: true,
        spaceBetween: 10,
        slidesPerView: 1.5,
      },
    },
  });
  // Свайперы
  // Табы в блоке Готовимся к сезону
  const readyButtonsIndex = document.querySelectorAll(".ready__tab-button");
  const readyListTabsIndex = document.querySelectorAll(".ready__list");
  readyButtonsIndex.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) return;
      readyButtonsIndex.forEach((el) => el.classList.remove("is-active"));
      button.classList.add("is-active");
      const target = button.getAttribute("data-path");
      readyListTabsIndex.forEach((list) => {
        list.classList.remove("is-open");
        if (list.getAttribute("data-target") == target)
          list.classList.add("is-open");
      });
    });
  });
  // Табы в блоке Готовимся к сезону

  // Попапчики
  // Вывод попапчика с оформлением заказа
  const bonuscardButtonIndex = document.getElementById(
    "index-bonuscard-button"
  );
  const popupBonuscardElement = `
    <div id="popup-bonuscard" class="popup">
      <div class="popup__background"></div>
      <div class="popup__wrap">
        <button class="popup__wrap-close"></button>
        <h2 class="popup__wrap-title">
          Получить бонусную карту ОхотАктив
        </h2>
        <form action="#" class="popup__form">
          <h3 class="popup__form-title">
              Личные данные
          </h3>
          <div class="popup__personal-wrap">
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-name-input" type="text" placeholder=" ">
              <label for="client-name-input">Имя</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-surname-input" type="text" placeholder=" ">
              <label for="client-surname-input">Фамилия</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-city-input" type="text" placeholder=" ">
              <label for="client-city-input">Город</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-email-input" type="email" placeholder=" ">
              <label for="client-email-input">E-mail</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-tel-input" type="tel" placeholder=" ">
              <label for="client-tel-input">Телефон</label>
            </div>
            <div class="input-wrap">
              <input class="popup__wrap-input" id="client-db-input" type="tel" placeholder=" ">
              <label for="client-db-input">Дата рождения</label>
            </div>
          </div>
          <div class="popup__hobbies-wrap">
            <div class="popup__hobbies-left-column">
              <h3 class="popup__form-title">
                Интересы
              </h3>
              <ul class="popup__hobbies-list">
                <li class="popup__hobbies-item">
                  <label class="checkbox__label">
                    Рыбалка
                    <input type="checkbox" class="checkbox visually-hidden" required>
                    <span class="checkbox__span"></span>
                  </label>
                </li>
                <li class="popup__hobbies-item">
                  <label class="checkbox__label">
                    Туризм
                    <input type="checkbox" class="checkbox visually-hidden" required>
                    <span class="checkbox__span"></span>
                  </label>
                </li>
                <li class="popup__hobbies-item">
                  <label class="checkbox__label">
                    Охота
                    <input type="checkbox" class="checkbox visually-hidden" required>
                    <span class="checkbox__span"></span>
                  </label>
                </li>
                <li class="popup__hobbies-item">
                  <label class="checkbox__label">
                    Спортивная стрельба
                    <input type="checkbox" class="checkbox visually-hidden" required>
                    <span class="checkbox__span"></span>
                  </label>
                </li>
              </ul>
            </div>
            <div class="popup__hobbies-right-column">
              <h3 class="popup__form-title">
                Пол
              </h3>
              <ul class="popup__hobbies-list">
                <li class="popup__hobbies-item">
                  <input class="radio__input" type="radio" id="female" name="sex">
                  <label for="female">Женский</label>
                </li>
                <li class="popup__hobbies-item">
                  <input class="radio__input" type="radio" id="male" name="sex">
                  <label for="male">Мужской</label>
                </li>
              </ul>
            </div>
          </div>
          <label class="checkbox__label">
            Я принимаю <a href="#" class="checkbox__link">условия обработки персональных данных</a>
            <input type="checkbox" class="checkbox visually-hidden" required>
            <span class="checkbox__span"></span>
          </label>
          <button id="bonuscard-button-confirm" class="popup__wrap-button">
            Зарегистрировать
          </button>
        </form>
      </div>
    </div>
  `;
  bonuscardButtonIndex.addEventListener("click", () => {
    bodyScrollToggle();
    document.body.insertAdjacentHTML("beforeend", popupBonuscardElement);
    const popupBonuscard = document.getElementById("popup-bonuscard");
    const closePopup = document.querySelector(".popup__wrap-close");
    const backgroundPopup = document.querySelector(".popup__background");
    closePopup.addEventListener("click", () => {
      bodyScrollToggle();
      popupBonuscard.remove();
    });
    backgroundPopup.addEventListener("click", () => closePopup.click());
  });
  // Вывод попапчика с оформлением заказа
});
