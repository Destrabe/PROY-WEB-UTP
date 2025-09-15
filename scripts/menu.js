document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");
  const currentPath = window.location.pathname;

  links.forEach((link) => {
    const linkPath = link.getAttribute("href");

    // Si coincide exactamente con la URL actual
    if (linkPath === currentPath) {
      link.classList.add("active");
    }

    // Caso especial para la página principal "/"
    if (currentPath === "/" && linkPath === "/") {
      link.classList.add("active");
    }
  });
});
