document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");
  const formSections = document.querySelectorAll(".form-section");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const deliveryOptions = document.querySelectorAll(".delivery-option");
  const paymentMethods = document.querySelectorAll(".payment-method");
  const direccionSection = document.getElementById("direccion-section");
  const cardDetails = document.getElementById("card-details");
  const deliveryCostElement = document.querySelector(".delivery-cost");
  const totalAmountElement = document.querySelector(".total-amount");
  const qtyBtns = document.querySelectorAll(".qty-btn");
  const promoBtn = document.querySelector(".promo-btn");
  const promoInput = document.querySelector(".promo-input");
  let currentStep = 1;
  const totalSteps = 3;
  let checkoutState = {
    subtotal: 75.0,
    deliveryCost: 5.0,
    discount: 0,
    deliveryType: "delivery",
    paymentMethod: "efectivo",
    formData: {
      nombre: "",
      telefono: "",
      email: "",
      direccion: "",
      distrito: "",
      referencia: "",
      instrucciones: "",
    },
  };
  function showStep(step) {
    formSections.forEach((section) => {
      section.classList.remove("active");
    });
    const currentSections = document.querySelectorAll(
      `[data-step-content="${step}"]`
    );
    currentSections.forEach((section) => {
      section.classList.add("active");
    });
    updateStepsIndicator(step);
    updateNavigationButtons(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function updateStepsIndicator(step) {
    steps.forEach((stepElement, index) => {
      const stepNumber = index + 1;
      stepElement.classList.remove("active", "completed");
      if (stepNumber < step) {
        stepElement.classList.add("completed");
      } else if (stepNumber === step) {
        stepElement.classList.add("active");
      }
    });
  }

  function updateNavigationButtons(step) {
    if (step === 1) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = "flex";
    }
    if (step === totalSteps) {
      nextBtn.style.display = "none";
    } else {
      nextBtn.style.display = "flex";
    }
  }

  function validateStep(step) {
    let isValid = true;
    let errorMessage = "";
    switch (step) {
      case 1:
        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const email = document.getElementById("email").value.trim();
        if (!nombre) {
          isValid = false;
          errorMessage = "Por favor ingresa tu nombre completo";
        } else if (!telefono || telefono.length < 9) {
          isValid = false;
          errorMessage = "Por favor ingresa un teléfono válido (9 dígitos)";
        } else if (!email || !validateEmail(email)) {
          isValid = false;
          errorMessage = "Por favor ingresa un email válido";
        }
        if (isValid) {
          checkoutState.formData.nombre = nombre;
          checkoutState.formData.telefono = telefono;
          checkoutState.formData.email = email;
        }
        break;

      case 2:
        if (checkoutState.deliveryType === "delivery") {
          const direccion = document.getElementById("direccion").value.trim();
          const distrito = document.getElementById("distrito").value;
          if (!direccion) {
            isValid = false;
            errorMessage = "Por favor ingresa tu dirección";
          } else if (!distrito) {
            isValid = false;
            errorMessage = "Por favor selecciona tu distrito";
          }
          if (isValid) {
            checkoutState.formData.direccion = direccion;
            checkoutState.formData.distrito = distrito;
            checkoutState.formData.referencia = document
              .getElementById("referencia")
              .value.trim();
            checkoutState.formData.instrucciones = document
              .getElementById("instrucciones")
              .value.trim();
          }
        }
        break;

      case 3:
        if (checkoutState.paymentMethod === "tarjeta") {
          const cardNumber = document
            .getElementById("card-number")
            .value.trim();
          const cardExpiry = document
            .getElementById("card-expiry")
            .value.trim();
          const cardCvv = document.getElementById("card-cvv").value.trim();
          if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
            isValid = false;
            errorMessage = "Por favor ingresa un número de tarjeta válido";
          } else if (!cardExpiry || cardExpiry.length < 5) {
            isValid = false;
            errorMessage = "Por favor ingresa la fecha de vencimiento";
          } else if (!cardCvv || cardCvv.length < 3) {
            isValid = false;
            errorMessage = "Por favor ingresa el CVV";
          }
        }
        break;
    }

    if (!isValid) {
      showNotification(errorMessage, "error");
    }
    return isValid;
  }
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  nextBtn.addEventListener("click", function () {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        showNotification("Paso completado correctamente", "success");
      }
    }
  });
  prevBtn.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });
  steps.forEach((step, index) => {
    step.addEventListener("click", function () {
      const targetStep = index + 1;
      if (targetStep <= currentStep) {
        currentStep = targetStep;
        showStep(currentStep);
      } else {
        let canProceed = true;
        for (let i = 1; i < targetStep; i++) {
          if (!validateStep(i)) {
            canProceed = false;
            break;
          }
        }
        if (canProceed) {
          currentStep = targetStep;
          showStep(currentStep);
        }
      }
    });
  });
  deliveryOptions.forEach((option) => {
    option.addEventListener("click", function () {
      deliveryOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");
      const deliveryType = this.querySelector('input[type="radio"]').value;
      checkoutState.deliveryType = deliveryType;
      if (deliveryType === "delivery") {
        direccionSection.style.display = "block";
        checkoutState.deliveryCost = 5.0;
      } else {
        direccionSection.style.display = "none";
        checkoutState.deliveryCost = 0;
      }
      updateTotals();
    });
  });
  paymentMethods.forEach((method) => {
    method.addEventListener("click", function () {
      paymentMethods.forEach((m) => m.classList.remove("active"));
      this.classList.add("active");
      const paymentType = this.querySelector('input[type="radio"]').value;
      checkoutState.paymentMethod = paymentType;
      if (paymentType === "tarjeta") {
        cardDetails.style.display = "block";
      } else {
        cardDetails.style.display = "none";
      }
    });
  });
  qtyBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const orderItem = this.closest(".order-item");
      const qtyValue = orderItem.querySelector(".qty-value");
      const itemPrice = orderItem.querySelector(".item-price");
      let currentQty = parseInt(qtyValue.textContent);
      const totalPrice = parseFloat(
        itemPrice.textContent.replace("S/", "").trim()
      );
      const unitPrice = totalPrice / currentQty;
      if (this.textContent.includes("+")) {
        currentQty++;
      } else if (this.textContent.includes("−") && currentQty > 1) {
        currentQty--;
      }
      qtyValue.textContent = currentQty;
      itemPrice.textContent = `S/ ${(unitPrice * currentQty).toFixed(2)}`;
      recalculateSubtotal();
      updateTotals();
    });
  });
  promoBtn.addEventListener("click", function () {
    const promoCode = promoInput.value.trim().toUpperCase();
    const promoCodes = {
      BRAMI10: { type: "percentage", value: 10 },
      BRAMI20: { type: "percentage", value: 20 },
      PRIMERA: { type: "fixed", value: 5 },
      BIENVENIDO: { type: "fixed", value: 10 },
    };
    if (promoCode && promoCodes[promoCode]) {
      const promo = promoCodes[promoCode];
      if (promo.type === "percentage") {
        checkoutState.discount = (checkoutState.subtotal * promo.value) / 100;
      } else {
        checkoutState.discount = promo.value;
      }
      showNotification(
        `¡Código aplicado! S/ ${checkoutState.discount.toFixed(
          2
        )} de descuento`,
        "success"
      );
      document.querySelector(".total-row.discount").style.display = "flex";
      promoInput.disabled = true;
      promoBtn.disabled = true;
      promoBtn.textContent = "Aplicado ✓";
      promoBtn.style.background = "var(--accent-gold)";
      promoBtn.style.color = "var(--bg-primary)";
    } else if (promoCode) {
      showNotification("Código promocional inválido", "error");
    } else {
      showNotification("Ingresa un código promocional", "error");
    }
    updateTotals();
  });
  function recalculateSubtotal() {
    let newSubtotal = 0;
    document.querySelectorAll(".order-item").forEach((item) => {
      const price = parseFloat(
        item.querySelector(".item-price").textContent.replace("S/", "").trim()
      );
      newSubtotal += price;
    });
    checkoutState.subtotal = newSubtotal;
    if (checkoutState.discount > 0) {
      const promoCode = promoInput.value.trim().toUpperCase();
      const promoCodes = { BRAMI10: 10, BRAMI20: 20 };
      if (promoCodes[promoCode]) {
        checkoutState.discount =
          (checkoutState.subtotal * promoCodes[promoCode]) / 100;
      }
    }
  }
  function updateTotals() {
    document.querySelector(
      ".total-row:first-child span:last-child"
    ).textContent = `S/ ${checkoutState.subtotal.toFixed(2)}`;
    deliveryCostElement.textContent =
      checkoutState.deliveryCost > 0
        ? `S/ ${checkoutState.deliveryCost.toFixed(2)}`
        : "Gratis";
    if (checkoutState.discount > 0) {
      document.querySelector(
        ".discount-amount"
      ).textContent = `- S/ ${checkoutState.discount.toFixed(2)}`;
    }
    const total =
      checkoutState.subtotal +
      checkoutState.deliveryCost -
      checkoutState.discount;
    totalAmountElement.textContent = `S/ ${total.toFixed(2)}`;
  }
  checkoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let allStepsValid = true;
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        allStepsValid = false;
        currentStep = i;
        showStep(i);
        break;
      }
    }
    if (!allStepsValid) {
      return;
    }
    const orderData = {
      cliente: checkoutState.formData,
      entrega: {
        tipo: checkoutState.deliveryType,
        costo: checkoutState.deliveryCost,
      },
      pago: {
        metodo: checkoutState.paymentMethod,
      },
      pedido: gatherOrderItems(),
      totales: {
        subtotal: checkoutState.subtotal,
        delivery: checkoutState.deliveryCost,
        descuento: checkoutState.discount,
        total:
          checkoutState.subtotal +
          checkoutState.deliveryCost -
          checkoutState.discount,
      },
      fecha: new Date().toISOString(),
    };
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = "<span>Procesando pedido...</span>";
    setTimeout(() => {
      console.log("Pedido procesado:", orderData);
      localStorage.setItem("lastOrder", JSON.stringify(orderData));
      showOrderConfirmationModal(orderData);
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML =
        '<span>Confirmar Pedido</span><span class="btn-arrow">→</span>';
    }, 2000);
  });

  function gatherOrderItems() {
    const items = [];
    document.querySelectorAll(".order-item").forEach((item) => {
      const name = item.querySelector(".item-name").textContent;
      const qty = parseInt(item.querySelector(".qty-value").textContent);
      const price = parseFloat(
        item.querySelector(".item-price").textContent.replace("S/", "").trim()
      );

      items.push({ name, quantity: qty, price, unitPrice: price / qty });
    });
    return items;
  }
  function showNotification(message, type = "info") {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    let icon = "";
    if (type === "success") {
      icon =
        '<svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (type === "error") {
      icon =
        '<svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      icon =
        '<svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    notification.innerHTML = icon + "<span>" + message + "</span>";

    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${
              type === "success"
                ? "var(--accent-gold)"
                : type === "error"
                ? "var(--accent-red)"
                : "var(--bg-elevated)"
            };
            color: ${
              type === "error" ? "var(--text-primary)" : "var(--bg-primary)"
            };
            padding: 16px 24px;
            border-radius: var(--radius-sm);
            font-weight: 600;
            font-size: 14px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  const style = document.createElement("style");
  style.textContent = `
        .notification-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  function showOrderConfirmationModal(orderData) {
    const modal = document.createElement("div");
    modal.className = "order-confirmation-modal";
    modal.innerHTML = `
            <div class="confirmation-overlay"></div>
            <div class="confirmation-content">
                <div class="confirmation-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>¡Pedido Confirmado!</h2>
                <p class="confirmation-message">
                    Gracias <strong>${
                      orderData.cliente.nombre
                    }</strong> por tu pedido.
                    Te contactaremos al <strong>${
                      orderData.cliente.telefono
                    }</strong> para confirmar los detalles.
                </p>
                <div class="confirmation-details">
                    <div class="detail-row">
                        <span>Tipo de entrega:</span>
                        <strong>${
                          orderData.entrega.tipo === "delivery"
                            ? "Delivery"
                            : "Recojo en tienda"
                        }</strong>
                    </div>
                    ${
                      orderData.entrega.tipo === "delivery"
                        ? `
                    <div class="detail-row">
                        <span>Dirección:</span>
                        <strong>${orderData.cliente.direccion}</strong>
                    </div>
                    `
                        : ""
                    }
                    <div class="detail-row">
                        <span>Método de pago:</span>
                        <strong>${formatPaymentMethod(
                          orderData.pago.metodo
                        )}</strong>
                    </div>
                    <div class="detail-row total-row">
                        <span>Total a pagar:</span>
                        <strong class="total-amount">S/ ${orderData.totales.total.toFixed(
                          2
                        )}</strong>
                    </div>
                </div>
                <div class="confirmation-items">
                    <h3>Resumen del pedido:</h3>
                    <div class="items-list">
                        ${orderData.pedido
                          .map(
                            (item) => `
                            <div class="item-summary">
                                <span class="item-qty">${item.quantity}x</span>
                                <span class="item-name">${item.name}</span>
                                <span class="item-price">S/ ${item.price.toFixed(
                                  2
                                )}</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                <button class="confirm-btn" id="confirmModalBtn">
                    Entendido
                </button>
            </div>
        `;
    const modalStyle = document.createElement("style");
    modalStyle.textContent = `
            .order-confirmation-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }
            
            .confirmation-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(4px);
            }
            
            .confirmation-content {
                position: relative;
                background: var(--bg-card);
                border: 1px solid var(--border-hover);
                border-radius: var(--radius-lg);
                padding: 40px 35px;
                max-width: 550px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                text-align: center;
                box-shadow: var(--shadow-xl);
                animation: slideUp 0.4s ease;
            }
            
            .confirmation-icon {
                width: 90px;
                height: 90px;
                margin: 0 auto 25px;
                background: rgba(16, 185, 129, 0.1);
                border: 3px solid var(--accent-gold);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: scaleIn 0.5s ease 0.2s both;
            }
            
            .confirmation-icon svg {
                width: 55px;
                height: 55px;
                color: var(--accent-gold);
            }
            
            .confirmation-content h2 {
                font-size: 32px;
                font-weight: 700;
                color: var(--accent-gold);
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
            }
            
            .confirmation-message {
                font-size: 15px;
                color: var(--text-secondary);
                line-height: 1.7;
                margin-bottom: 30px;
            }
            
            .confirmation-message strong {
                color: var(--text-primary);
                font-weight: 600;
            }
            
            .confirmation-details {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                padding: 20px;
                margin-bottom: 25px;
                text-align: left;
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                font-size: 14px;
                color: var(--text-secondary);
            }
            
            .detail-row:not(:last-child) {
                border-bottom: 1px solid var(--border-color);
            }
            
            .detail-row strong {
                color: var(--text-primary);
                font-weight: 600;
            }
            
            .detail-row.total-row {
                padding-top: 15px;
                margin-top: 8px;
                font-size: 16px;
                border-top: 2px solid var(--border-hover);
            }
            
            .detail-row .total-amount {
                color: var(--accent-gold);
                font-size: 24px;
                font-weight: 700;
            }
            
            .confirmation-items {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                padding: 20px;
                margin-bottom: 30px;
                text-align: left;
            }
            
            .confirmation-items h3 {
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                color: var(--text-primary);
                margin-bottom: 15px;
                letter-spacing: 0.5px;
            }
            
            .items-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .item-summary {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: var(--bg-primary);
                border-radius: var(--radius-sm);
                font-size: 14px;
            }
            
            .item-qty {
                color: var(--accent-gold);
                font-weight: 700;
                min-width: 35px;
            }
            
            .item-name {
                flex: 1;
                color: var(--text-primary);
            }
            
            .item-price {
                color: var(--accent-gold);
                font-weight: 600;
            }
            
            .confirm-btn {
                width: 100%;
                padding: 18px;
                background: var(--accent-red);
                color: var(--text-primary);
                border: none;
                border-radius: var(--radius-sm);
                font-size: 16px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                cursor: pointer;
                transition: all var(--transition-normal);
                font-family: var(--font-main);
            }
            
            .confirm-btn:hover {
                background: var(--accent-red-hover);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 30, 45, 0.5);
            }
            
            @keyframes scaleIn {
                from {
                    transform: scale(0);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            .confirmation-content::-webkit-scrollbar {
                width: 8px;
            }
            
            .confirmation-content::-webkit-scrollbar-track {
                background: var(--bg-primary);
                border-radius: 10px;
            }
            
            .confirmation-content::-webkit-scrollbar-thumb {
                background: var(--accent-gold);
                border-radius: 10px;
            }
            
            @media (max-width: 768px) {
                .confirmation-content {
                    padding: 30px 25px;
                }
                
                .confirmation-content h2 {
                    font-size: 26px;
                }
                
                .confirmation-icon {
                    width: 70px;
                    height: 70px;
                }
                
                .confirmation-icon svg {
                    width: 45px;
                    height: 45px;
                }
            }
            
            @media (max-width: 480px) {
                .order-confirmation-modal {
                    padding: 15px;
                }
                
                .confirmation-content {
                    padding: 25px 20px;
                }
                
                .confirmation-content h2 {
                    font-size: 22px;
                }
                
                .confirmation-icon {
                    width: 60px;
                    height: 60px;
                }
                
                .confirmation-icon svg {
                    width: 35px;
                    height: 35px;
                }
                
                .detail-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }
                
                .detail-row.total-row {
                    flex-direction: row;
                    justify-content: space-between;
                }
            }
        `;

    document.head.appendChild(modalStyle);
    document.body.appendChild(modal);
    document
      .getElementById("confirmModalBtn")
      .addEventListener("click", function () {
        modal.style.animation = "fadeOut 0.3s ease";
        setTimeout(() => {
          modal.remove();
          window.location.href = "/index.html";
        }, 300);
      });
  }

  function formatPaymentMethod(method) {
    const methods = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta de crédito/débito",
      yape: "Yape / Plin",
    };
    return methods[method] || method;
  }

  const cardNumberInput = document.getElementById("card-number");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
      let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
      e.target.value = formattedValue;
    });
  }

  const cardExpiryInput = document.getElementById("card-expiry");
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  const cardCvvInput = document.getElementById("card-cvv");
  if (cardCvvInput) {
    cardCvvInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
    });
  }

  const telefonoInput = document.getElementById("telefono");
  if (telefonoInput) {
    telefonoInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
    });
  }

  showStep(currentStep);
  updateTotals();
  console.log("Checkout system initialized successfully");
  console.log("Current step:", currentStep);
});
