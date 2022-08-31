import "../imports";
import "../../styles/pages/compare/style.scss";
import Swiper, { Navigation, Mousewheel, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

document.addEventListener("DOMContentLoaded", () => {
  const compareSwiper = new Swiper(".swiper-compare", {
    slidesPerView: 3,
    modules: [Navigation, Mousewheel, Scrollbar],
    direction: "vertical",
    mousewheel: true,
    scrollbar: {
      el: ".compare__card-list-scrollbar",
      draggable: true,
    },
  });
});
