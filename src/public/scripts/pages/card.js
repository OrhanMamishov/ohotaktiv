import "../imports";
import "../../styles/pages/card/style.scss";
import Swiper, { Thumbs, Mousewheel, Navigation } from "swiper";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";

document.addEventListener("DOMContentLoaded", async () => {
  // запрос данных с БД
  // const idGood = document.location
  // console.log(document.location.search);
  // const arrayFromBase = await fetch("https://ohotaktiv.ru/12dev/begin/", {
  //   mode: "no-cors",
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((res) => res.json())
  //   .then((res) => console.log(res));
  // await fetch(`https://ohotaktiv.ru/12dev/order_status/?order_id=111111`, {
  //   mode: "no-cors",
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // }).then((res) => res.json());
  // запрос данных с БД
  // наполнение контента

  // наполнение контента
  // свайперы и чойзы
  const galleryThumbs = new Swiper(".gallery-thumbs", {
    modules: [Mousewheel],
    direction: "vertical",
    slidesPerView: 3,
    spaceBetween: 10,
    mousewheel: true,
    freeMode: true,
  });
  const galleryTop = new Swiper(".gallery-top", {
    modules: [Thumbs],
    // direction: "vertical",
    slidesPerView: 1,
    spaceBetween: 20,
    mousewheel: true,
    grabCursor: true,
    thumbs: {
      swiper: galleryThumbs,
    },
  });
  const viewedSwiper = new Swiper(".swiper-viewed", {
    spaceBetween: 10,
    modules: [Navigation],
    navigation: {
      nextEl: ".viewed__swiper-button-next",
      prevEl: ".viewed__swiper-button-prev",
    },
    breakpoints: {
      1559: {
        slidesPerView: 5,
      },
      1439: {
        spaceBetween: 30,
        slidesPerView: 5,
      },
      1366: {
        slidesPerView: 4,
      },
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
  const tabSwiper = new Swiper(".swiper-tab", {
    spaceBetween: 10,
    modules: [Navigation],
    navigation: {
      nextEl: ".description__tab-set-result-swiper-button-next",
      prevEl: ".description__tab-set-result-swiper-button-prev",
    },
    breakpoints: {
      1559: {
        slidesPerView: 5,
      },
      1439: {
        spaceBetween: 30,
        slidesPerView: 5,
      },
      1366: {
        slidesPerView: 4,
      },
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
  const choices = new Choices("#select-size", {
    searchEnabled: false,
    itemSelectText: "",
    allowHTML: true,
  });
  // свайперы и чойзы

  // реализация прибавления и убавления
  const discountButton = document.getElementById("discount-button");
  const countButton = document.getElementById("count-button");
  const countInput = document.querySelector(".card__pay-count-input");
  discountButton.addEventListener("click", () => {
    if (countInput.value <= 1) {
      countInput.value = 1;
    } else {
      countInput.value--;
    }
  });
  countButton.addEventListener("click", () => {
    if (countInput.value >= 1000) {
      countInput.value = 1000;
    } else {
      countInput.value++;
    }
  });
  countInput.addEventListener("input", () => {
    if (countInput.value <= 1) {
      countInput.value = 1;
    }
    if (countInput.value >= 1000) {
      countInput.value = 1000;
    }
  });
  // реализация прибавления и убавления

  // миллион табов
  const pathsDescriptions = document.querySelectorAll(
    ".description__tabs-item"
  );
  const targetsDescriptions = document.querySelectorAll(".description__tab");
  pathsDescriptions.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) return;
      pathsDescriptions.forEach((el) => el.classList.remove("is-active"));
      button.classList.add("is-active");
      const target = button.getAttribute("data-path");
      targetsDescriptions.forEach((el) => {
        el.classList.remove("is-open");
        if (el.getAttribute("data-target") == target)
          el.classList.add("is-open");
      });
    });
  });
  // миллион табов
  // Шарим
  const buttonShare = document.querySelector(".share");
  const wrapShare = document.querySelector(".share-wrap");
  const linksShare = document.querySelectorAll(".share-link");
  buttonShare.addEventListener("click", () => {
    wrapShare.classList.toggle("is-open");
  });
  // Шарим
});
