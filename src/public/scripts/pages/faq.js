import "../imports";
import "../../styles/pages/faq/style.scss";
import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener("DOMContentLoaded", () => {
  new Accordion(".accordion-container", {
    showMultiple: true,
  });
});
