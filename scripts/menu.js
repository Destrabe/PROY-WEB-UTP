document.addEventListener("DOMContentLoaded", () => {
  const menuCheckbox = document.getElementById("menu-checkbox");
  const navLinks = document.querySelectorAll("nav a");
  const body = document.body;

  menuCheckbox.addEventListener("change", function () {
    if (this.checked) {
      body.classList.add("menu-open");
    } else {
      body.classList.remove("menu-open");
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuCheckbox.checked = false;
      body.classList.remove("menu-open");
    });
  });

  body.addEventListener("click", (e) => {
    if (
      body.classList.contains("menu-open") &&
      !e.target.closest("nav") &&
      !e.target.closest(".menu-toggle")
    ) {
      menuCheckbox.checked = false;
      body.classList.remove("menu-open");
    }
  });
});