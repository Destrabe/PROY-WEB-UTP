class CategoryFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.sections = document.querySelectorAll("[data-category]");

    if (!this.filterButtons.length || !this.sections.length) return;

    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  setActiveButton(activeButton) {
    this.filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn === activeButton);
      btn.setAttribute("aria-pressed", btn === activeButton);
    });
  }

  filterSections(category) {
    const visibleSections = [];

    this.sections.forEach((section) => {
      const sectionCategory = section.getAttribute("data-category");
      const shouldShow = category === "all" || sectionCategory === category;

      section.classList.toggle("hidden", !shouldShow);

      if (shouldShow) {
        visibleSections.push(section);
      }
    });

    return visibleSections;
  }

  scrollToFirstVisible(visibleSections, category) {
    if (category !== "all" && visibleSections.length > 0) {
      setTimeout(() => {
        const offset = 100;
        const elementPosition = visibleSections[0].getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  }

  handleFilterClick(button) {
    const category = button.getAttribute("data-category");
    this.setActiveButton(button);
    const visibleSections = this.filterSections(category);
    this.scrollToFirstVisible(visibleSections, category);
    this.trackFilter(category);
  }

  trackFilter(category) {
    console.log(`Filtro aplicado: ${category}`);
  }

  attachEventListeners() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleFilterClick(button);
      });
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handleFilterClick(button);
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CategoryFilter();
});
