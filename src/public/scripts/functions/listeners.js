document.addEventListener("click", (e) => {
  if (e.target.className == "navigation__link back") {
    history.back();
  }
});
