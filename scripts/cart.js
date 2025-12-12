class ShoppingCart {
  constructor() {
    this.items = [];
    this.storageKey = "bramiCart";
    this.loadFromStorage();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.createCartUI();
    this.attachEventListeners();
    this.updateUI();
    console.log("🛒 Sistema de carrito inicializado");
  }

  createCartUI() {
    const floatBtn = document.createElement("button");
    floatBtn.className = "cart-float-btn";
    floatBtn.setAttribute("aria-label", "Ver carrito de compras");
    floatBtn.innerHTML = `
            <!-- Manija del carrito -->
            <path
            d="M3 4h2l1.2 9.5a1.8 1.8 0 001.8 1.5h9.3a1.8 1.8 0 001.7-1.2L21 7H7"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            />
            <!-- Línea del asa / empuñadura -->
            <path
            d="M3 4h2.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            />
            <!-- Ruedas -->
            <circle
            cx="9"
            cy="19"
            r="1.7"
            stroke="currentColor"
            stroke-width="1.5"
            />
            <circle
            cx="17"
            cy="19"
            r="1.7"
            stroke="currentColor"
            stroke-width="1.5"
            />
            </svg>

            <span class="cart-badge" style="display: none;">0</span>
        `;

    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";

    const sidebar = document.createElement("div");
    sidebar.className = "cart-sidebar";
    sidebar.innerHTML = `
            <div class="cart-header">
                <div class="cart-header-title">
                        <circle cx="9" cy="21" r="1" fill="currentColor"/>
                        <circle cx="20" cy="21" r="1" fill="currentColor"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2>Mi Carrito</h2>
                </div>
                <button class="cart-close-btn" aria-label="Cerrar carrito">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>

            <div class="cart-content">
                <div class="cart-empty">
                        <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                        <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega productos deliciosos de nuestra carta</p>
                </div>
                <div class="cart-items" style="display: none;"></div>
            </div>

            <div class="cart-footer" style="display: none;">
                <div class="cart-totals">
                    <div class="cart-total-row">
                        <span>Subtotal</span>
                        <span class="cart-subtotal">S/ 0.00</span>
                    </div>
                    <div class="cart-total-row total">
                        <span>Total</span>
                        <span class="cart-total-amount">S/ 0.00</span>
                    </div>
                </div>
                <div class="cart-actions">
                    <button class="cart-checkout-btn">
                        <span>Ir al Checkout</span>
                        <span class="btn-arrow">→</span>
                    </button>
                    <button class="cart-clear-btn">Vaciar Carrito</button>
                </div>
            </div>
        `;

    document.body.appendChild(floatBtn);
    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    this.floatBtn = floatBtn;
    this.overlay = overlay;
    this.sidebar = sidebar;
    this.badge = floatBtn.querySelector(".cart-badge");
    this.emptyState = sidebar.querySelector(".cart-empty");
    this.itemsContainer = sidebar.querySelector(".cart-items");
    this.footer = sidebar.querySelector(".cart-footer");
    this.subtotalElement = sidebar.querySelector(".cart-subtotal");
    this.totalElement = sidebar.querySelector(".cart-total-amount");
  }

  attachEventListeners() {
    this.floatBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openCart();
    });

    this.overlay.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeCart();
    });

    const closeBtn = this.sidebar.querySelector(".cart-close-btn");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeCart();
    });

    this.sidebar.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    this.sidebar
      .querySelector(".cart-checkout-btn")
      .addEventListener("click", () => this.goToCheckout());
    this.sidebar
      .querySelector(".cart-clear-btn")
      .addEventListener("click", () => this.clearCart());

    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-btn, .menu-btn");
      if (addBtn) {
        this.handleAddToCart(addBtn);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.sidebar.classList.contains("active")) {
        this.closeCart();
      }
    });
  }

  handleAddToCart(button) {
    const card = button.closest(".product-card, .menu-card");
    if (!card) return;

    const product = this.extractProductData(card);
    this.addItem(product);
  }

  extractProductData(card) {
    const nameElement = card.querySelector(".product-name, .menu-name");
    const priceElement = card.querySelector(".product-price, .menu-price");
    const imageElement = card.querySelector(
      ".product-image img, .menu-image img"
    );
    const descElement = card.querySelector(
      ".product-description, .menu-description"
    );

    let emoji = "🍽️";
    const placeholder = card.querySelector(".placeholder-image span");
    if (placeholder) {
      emoji = placeholder.textContent.trim();
    }

    return {
      id: this.generateId(nameElement?.textContent || "Producto"),
      name: nameElement?.textContent.trim() || "Producto sin nombre",
      price: this.extractPrice(priceElement?.textContent || "0"),
      image: imageElement?.src || null,
      emoji: emoji,
      description: descElement?.textContent.trim() || "",
      quantity: 1,
    };
  }

  extractPrice(priceText) {
    const match = priceText.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  generateId(name) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  addItem(product) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push(product);
    }

    this.saveToStorage();
    this.updateUI();
    this.animateBadge();
  }

  updateQuantity(productId, newQuantity) {
    const item = this.items.find((item) => item.id === productId);

    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = newQuantity;
        this.saveToStorage();
        this.updateUI();
      }
    }
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveToStorage();
    this.updateUI();
  }

  clearCart() {
    if (this.items.length === 0) return;

    if (confirm("¿Estás seguro de vaciar el carrito?")) {
      this.items = [];
      this.saveToStorage();
      this.updateUI();
    }
  }

  getSubtotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getTotal() {
    return this.getSubtotal();
  }

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateUI() {
    const totalItems = this.getTotalItems();
    const subtotal = this.getSubtotal();
    const total = this.getTotal();

    if (totalItems > 0) {
      this.badge.textContent = totalItems;
      this.badge.style.display = "flex";
    } else {
      this.badge.style.display = "none";
    }

    if (this.items.length === 0) {
      this.emptyState.style.display = "flex";
      this.itemsContainer.style.display = "none";
      this.footer.style.display = "none";
    } else {
      this.emptyState.style.display = "none";
      this.itemsContainer.style.display = "flex";
      this.footer.style.display = "block";

      this.renderItems();

      this.subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
      this.totalElement.textContent = `S/ ${total.toFixed(2)}`;
    }
  }

  renderItems() {
    this.itemsContainer.innerHTML = this.items
      .map(
        (item) => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    ${
                      item.image
                        ? `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="cart-item-placeholder" style="display: none;">${item.emoji}</div>`
                        : `<div class="cart-item-placeholder">${item.emoji}</div>`
                    }
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">S/ ${(
                      item.price * item.quantity
                    ).toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="cart-qty-btn cart-qty-decrease" data-id="${
                          item.id
                        }" aria-label="Disminuir cantidad">
                            −
                        </button>
                        <span class="cart-qty-value">${item.quantity}</span>
                        <button class="cart-qty-btn cart-qty-increase" data-id="${
                          item.id
                        }" aria-label="Aumentar cantidad">
                            +
                        </button>
                        <button class="cart-item-remove" data-id="${
                          item.id
                        }" aria-label="Eliminar producto">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    this.attachItemControls();
  }

  attachItemControls() {
    this.itemsContainer
      .querySelectorAll(".cart-qty-decrease")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          const item = this.items.find((item) => item.id === id);
          if (item) {
            this.updateQuantity(id, item.quantity - 1);
          }
        });
      });

    this.itemsContainer
      .querySelectorAll(".cart-qty-increase")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          const item = this.items.find((item) => item.id === id);
          if (item) {
            this.updateQuantity(id, item.quantity + 1);
          }
        });
      });

    this.itemsContainer.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        this.removeItem(id);
      });
    });
  }

  toggleCart() {
    if (this.sidebar.classList.contains("active")) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  openCart() {
    this.sidebar.classList.add("active");
    this.overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeCart() {
    this.sidebar.classList.remove("active");
    this.overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  goToCheckout() {
    if (this.items.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    this.saveToStorage();
    window.location.href = "/pages/checkout.html";
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.error("Error guardando en localStorage:", e);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error cargando de localStorage:", e);
      this.items = [];
    }
  }
  animateBadge() {
    this.badge.style.animation = "none";
    setTimeout(() => {
      this.badge.style.animation =
        "bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    }, 10);
  }
  getItems() {
    return [...this.items];
  }
  getCartData() {
    return {
      items: this.getItems(),
      subtotal: this.getSubtotal(),
      total: this.getTotal(),
      totalItems: this.getTotalItems(),
    };
  }
}
window.cart = new ShoppingCart();
