const anchors = document.querySelectorAll(".item-menu");
const urlActual = window.location.href;
const paginas = [
  "profile.html",
  "artists.html",
  "recently.html",
  "chronoHits.html",
];
let i = 0;
for (const anchor of anchors) {
  if (
    anchor.getAttribute("href") === paginas[i] &&
    urlActual.includes(paginas[i])
  ) {
    anchor.parentElement.classList.add("active");
  }
  i++;
}
