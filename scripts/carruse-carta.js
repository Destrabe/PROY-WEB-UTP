class ProductCarousel {
  constructor(sectionSelector) {
    this.section = document.querySelector(sectionSelector);
    if (!this.section) return;
    this.grid = this.section.querySelector(".products-grid");
    this.cards = [...this.section.querySelectorAll(".product-card")];
    this.prevBtn = this.section.querySelector(".nav-btn:first-of-type");
    this.nextBtn = this.section.querySelector(".nav-btn:last-of-type");
    this.currentIndex = 0;
    this.cardsPerView = this.getCardsPerView();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.resizeTimer = null;
    this.init();
  }

  init() {
    this.setupCarousel();
    this.attachEventListeners();
    if (this.maxIndex > 0) {
      this.createIndicators();
    }
  }

  getCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  setupCarousel() {
    const containerWidth = this.section.offsetWidth - 120;
    const gap = 24;
    const totalGapWidth = (this.cardsPerView - 1) * gap;
    const cardWidth = (containerWidth - totalGapWidth) / this.cardsPerView;
    Object.assign(this.grid.style, {
      display: "flex",
      gap: `${gap}px`,
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    });
    this.cards.forEach((card) => {
      Object.assign(card.style, {
        minWidth: `${cardWidth}px`,
        maxWidth: `${cardWidth}px`,
        flex: "0 0 auto",
      });
    });
    this.updateCarousel();
    this.updateButtons();
  }

  updateCarousel() {
    const cardWidth = this.cards[0]?.offsetWidth || 0;
    const gap = 24;
    const offset = -(this.currentIndex * (cardWidth + gap));
    this.grid.style.transform = `translateX(${offset}px)`;
  }

  updateButtons() {
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
  }

  navigate(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex <= this.maxIndex) {
      this.currentIndex = newIndex;
      this.updateCarousel();
      this.updateButtons();
      this.updateIndicators();
    }
  }

  goToSlide(index) {
    if (index >= 0 && index <= this.maxIndex) {
      this.currentIndex = index;
      this.updateCarousel();
      this.updateButtons();
      this.updateIndicators();
    }
  }

  createIndicators() {
    const container = document.createElement("div");
    container.className = "carousel-indicators";
    for (let i = 0; i <= this.maxIndex; i++) {
      const indicator = document.createElement("button");
      indicator.className = "carousel-indicator";
      indicator.setAttribute("aria-label", `Ir a página ${i + 1}`);
      indicator.classList.toggle("active", i === this.currentIndex);
      indicator.addEventListener("click", () => this.goToSlide(i));
      container.appendChild(indicator);
    }
    this.section.appendChild(container);
    this.indicators = container.querySelectorAll(".carousel-indicator");
  }

  updateIndicators() {
    this.indicators?.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === this.currentIndex);
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      this.navigate(diff > 0 ? 1 : -1);
    }
  }

  handleResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      const newCardsPerView = this.getCardsPerView();
      if (newCardsPerView !== this.cardsPerView) {
        this.cardsPerView = newCardsPerView;
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        const oldIndicators = this.section.querySelector(
          ".carousel-indicators"
        );
        if (oldIndicators) {
          oldIndicators.remove();
        }
        if (this.maxIndex > 0) {
          this.createIndicators();
        }
      }
      this.setupCarousel();
    }, 250);
  }

  handleKeyboard(e) {
    const rect = this.section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (!isVisible) return;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        this.navigate(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        this.navigate(1);
        break;
    }
  }

  attachEventListeners() {
    this.prevBtn?.addEventListener("click", () => this.navigate(-1));
    this.nextBtn?.addEventListener("click", () => this.navigate(1));
    this.grid.addEventListener(
      "touchstart",
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    this.grid.addEventListener(
      "touchend",
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      { passive: true }
    );
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
    window.addEventListener("resize", () => this.handleResize());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ProductCarousel(".best-sellers");
});
