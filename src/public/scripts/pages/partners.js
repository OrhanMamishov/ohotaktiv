import "../imports";
import "../../styles/pages/partners/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  // кастомизация выбора файлов
  const inputFile = document.querySelector(".input-wrap-file__input");
  const labelFile = inputFile.nextElementSibling;
  inputFile.addEventListener("change", (e) => {
    labelFile.textContent = "Выбраны файлы: ";
    Object.values(e.target.files).forEach((el) => {
      labelFile.textContent += el.name;
    });
  });
  // кастомизация выбора файлов
});
