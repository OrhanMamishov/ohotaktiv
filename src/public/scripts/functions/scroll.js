document.addEventListener("DOMContentLoaded", () => {
  const anchors = document.querySelectorAll('a[href*="#"]');
  for (let anchor of anchors) {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const anchorWithout = anchor.getAttribute("href").substr(1);
      if (!anchorWithout) return;
      const element = document.getElementById(anchorWithout);
      window.scroll({
        top: element.offsetTop - 140,
        behavior: "smooth",
      });
    });
  }
});
