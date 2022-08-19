export const bodyScrollToggle = () => {
  document.body.classList.contains("disable-scroll")
    ? document.body.classList.remove("disable-scroll")
    : document.body.classList.add("disable-scroll");
};
