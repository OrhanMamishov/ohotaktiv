import "../imports";
import "../../styles/pages/compare/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("compare__select")) {
      e.target.nextElementSibling.classList.toggle("is-open");
      e.target.classList.toggle("is-open");
    }
  });
  const paths = document.querySelectorAll(".compare__path");
  const targets = document.querySelectorAll(".compare__result");
  paths.forEach((path) => {
    path.addEventListener("click", () => {
      if (path.classList.contains("is-active")) return;
      paths.forEach((el) => el.classList.remove("is-active"));
      path.classList.add("is-active");
      targets.forEach((target) => {
        target.classList.remove("is-open");
        if (
          target.getAttribute("data-target").split("-")[0] ==
          path.getAttribute("data-path").split("-")[0]
        )
          target.classList.add("is-open");
      });
    });
  });
});
