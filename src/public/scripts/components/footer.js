import "../../styles/components/footer/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  const titleListsFooter = document.querySelectorAll(".footer__lists-title");
  const listsFooter = document.querySelectorAll(".footer__buyer-list");
  titleListsFooter.forEach((title) => {
    title.addEventListener("click", () => {
      if (title.classList.contains("is-active")) return;
      titleListsFooter.forEach((el) => el.classList.remove("is-active"));
      title.classList.add("is-active");
      listsFooter.forEach((el) => {
        el.classList.remove("is-open");
        if (el.getAttribute("data-target") == title.getAttribute("data-path")) {
          el.classList.add("is-open");
        }
      });
    });
  });
});
