import "../../styles/components/message/style.scss";
export function showMessage(message, submessage, status) {
  if (document.querySelector(".message"))
    document.querySelector(".message").remove();
  const errorMessageHtml = `
    <div class="message">
      <p class="title-message ${status}">${message}</p>
      <p>${submessage}</p>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", errorMessageHtml);
  if (document.querySelector(".message")) {
    setTimeout(
      () => (document.querySelector(".message").style.opacity = "0"),
      2000
    );
  }
  document
    .querySelector(".message")
    .addEventListener("transitionend", function () {
      document.querySelector(".message").remove();
    });
}
