import "../../styles/components/footer/style.scss";
import Inputmask from "inputmask";
import { showMessage } from "../functions/showMessage";

document.addEventListener("DOMContentLoaded", () => {
  const titleListsFooter = document.querySelectorAll(".item-title");
  const listsFooter = document.querySelectorAll(".footer__list");
  titleListsFooter.forEach((title) => {
    title.addEventListener("click", () => {
      const thisList = title.parentElement;
      if (thisList.classList.contains("is-open")) return;
      listsFooter.forEach((list) => list.classList.remove("is-open"));
      thisList.classList.add("is-open");
    });
  });
  const footerInput = document.getElementById("footer-form-input");
  const footerSubmitButton = document.querySelector(".footer__form-button");
  Inputmask({
    mask: "*{50}",
    placeholder: "",
    greedy: false,
    showMaskOnHover: false,
    definitions: {
      "*": {
        validator: "[0-9A-Za-z@._-]",
      },
    },
    onKeyDown: function () {
      this.classList.remove("is-not-valid");
    },
    onincomplete: function () {
      if (!this.value.includes("@") && !this.value.includes("."))
        this.classList.add("is-not-valid");
    },
  }).mask(footerInput);
  footerSubmitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (footerInput.value.length == 0) {
      footerInput.classList.add("is-not-valid");
      return;
    }
    const deviceCookie = document.cookie
      .split(";")
      .filter((el) => el.includes("mindboxDeviceUUID"));
    const deviceId = deviceCookie[0].split("=")[1];
    await fetch(
      `https://api.mindbox.ru/v3/operations/async?endpointId=ohotaktiv-website&operation=Website.SubscriptionInFooter&deviceUUID=${deviceId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Mindbox secretKey="RTh6yZ1o696DtaSS8RDA"`,
        },
        body: JSON.stringify({
          customer: {
            email: footerInput.value,
          },
        }),
      }
    ).then(() => {
      footerInput.value = "";
      showMessage("Успешно!", "Вы подписались на новости", "success");
    });
  });
});
