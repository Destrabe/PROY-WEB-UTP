const btn = document.getElementById("collapseBtn");
const sidebar = document.querySelector(".sidebar");

btn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});
