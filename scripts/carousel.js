class SimpleCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll(".carousel-slide-simple");
    this.dots = document.querySelectorAll(".dot");
    this.prevBtn = document.querySelector(".prev-btn");
    this.nextBtn = document.querySelector(".next-btn");
    this.autoPlayInterval = null;
    this.autoPlayDelay = 4000;
    this.init();
  }

  init() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });
    this.addSwipeSupport();
    this.startAutoPlay();
    const wrapper = document.querySelector(".carousel-wrapper");
    wrapper.addEventListener("mouseenter", () => this.stopAutoPlay());
    wrapper.addEventListener("mouseleave", () => this.startAutoPlay());
  }

  goToSlide(index) {
    this.slides[this.currentSlide].classList.remove("active");
    this.dots[this.currentSlide].classList.remove("active");
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add("active");
    this.dots[this.currentSlide].classList.add("active");
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(
      () => this.nextSlide(),
      this.autoPlayDelay
    );
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  addSwipeSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    const wrapper = document.querySelector(".carousel-wrapper");
    wrapper.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    wrapper.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    this.handleSwipe = () => {
      if (touchEndX < touchStartX - 50) this.nextSlide();
      if (touchEndX > touchStartX + 50) this.prevSlide();
    };
  }
}

const lazyLoadImages = () => {
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.tagName === "IMG" && img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add("loaded");
            img.removeAttribute("data-src");
          }
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px",
      threshold: 0.01,
    }
  );
  document.querySelectorAll(".lazy-load").forEach((img) => {
    imageObserver.observe(img);
  });
};

const animateOnScroll = () => {
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }
  );
  document
    .querySelectorAll(".fade-in, .menu-card, .evento-card, .gallery-item")
    .forEach((el) => {
      fadeObserver.observe(el);
    });
};

const addStaggerEffect = () => {
  const menuCards = document.querySelectorAll(".menu-card");
  menuCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
  const eventoCards = document.querySelectorAll(".evento-card");
  eventoCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
  });
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
  });
};

document.addEventListener("DOMContentLoaded", function () {
  new SimpleCarousel();
  lazyLoadImages();
  animateOnScroll();
  addStaggerEffect();
  const menuToggle = document.getElementById("menu-toggle");
  const overlay = document.querySelector(".overlay");
  const body = document.body;
  overlay.addEventListener("click", function () {
    menuToggle.checked = false;
    body.classList.remove("no-scroll");
  });
  menuToggle.addEventListener("change", function () {
    if (this.checked) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }
  });
  const navLinks = document.querySelectorAll(".nav-list a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      menuToggle.checked = false;
      body.classList.remove("no-scroll");
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerHeight =
          document.querySelector(".main-header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
  let lastScroll = 0;
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".main-header");
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
      header.style.background = "rgba(0, 0, 0, 0.98)";
    } else {
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.3)";
      header.style.background = "rgba(0, 0, 0, 0.95)";
    }
    lastScroll = currentScroll;
  });

  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent =
          target + (element.textContent.includes("+") ? "+" : "");
        clearInterval(timer);
      } else {
        element.textContent =
          Math.floor(current) + (element.textContent.includes("+") ? "+" : "");
      }
    }, 30);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("animated")
        ) {
          const target = entry.target.textContent.replace(/[^0-9.]/g, "");
          animateCounter(entry.target, parseFloat(target));
          entry.target.classList.add("animated");
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".stat-number").forEach((stat) => {
    statsObserver.observe(stat);
  });
});
