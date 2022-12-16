import "../../styles/pages/result/style.scss";
import { getUserData } from "../functions/getUserData";
import { numberWithSpaces } from "../functions/numberWithSpaces";

const choosedCity = localStorage.getItem("oa_choosed_city")
  ? JSON.parse(localStorage.getItem("oa_choosed_city"))
  : "Москва";

document.addEventListener("DOMContentLoaded", async () => {
  const headerButtonGeo = document.querySelector(".header__geo");
  headerButtonGeo.textContent = choosedCity;
});
