/**
 * Integración del Carrito con Checkout
 * Este archivo extiende checkout.js para leer productos del carrito
 */

document.addEventListener('DOMContentLoaded', function() {
    loadCartIntoCheckout();
});

function loadCartIntoCheckout() {
    // Cargar items del carrito desde localStorage
    const cartItems = getCartItems();
    
    if (!cartItems || cartItems.length === 0) {
        showEmptyCartMessage();
        return;
    }

    // Renderizar productos en el resumen del checkout
    renderCheckoutItems(cartItems);
    
    // Actualizar totales
    updateCheckoutTotals(cartItems);
    
    console.log('✅ Productos cargados del carrito al checkout');
}

function getCartItems() {
    try {
        const stored = localStorage.getItem('bramiCart');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error cargando carrito:', e);
        return [];
    }
}

function renderCheckoutItems(items) {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;

    // Limpiar items existentes (los de ejemplo)
    orderItemsContainer.innerHTML = '';

    // Renderizar items del carrito
    items.forEach(item => {
        const itemElement = createCheckoutItemElement(item);
        orderItemsContainer.appendChild(itemElement);
    });

    // Reattach event listeners para los botones de cantidad
    attachQuantityControls();
}

function createCheckoutItemElement(item) {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.dataset.id = item.id;
    div.dataset.unitPrice = item.price;

    div.innerHTML = `
        <div class="item-image">
            ${item.image ? 
                `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                 <div style="display: none; font-size: 40px; text-align: center;">${item.emoji || '🍽️'}</div>` 
                : 
                `<div style="font-size: 40px; text-align: center;">${item.emoji || '🍽️'}</div>`
            }
        </div>
        <div class="item-details">
            <h3 class="item-name">${item.name}</h3>
            <div class="item-quantity">
                <button class="qty-btn qty-decrease" aria-label="Disminuir cantidad">
                    −
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn qty-increase" aria-label="Aumentar cantidad">
                    +
                </button>
            </div>
        </div>
        <div class="item-price">S/ ${(item.price * item.quantity).toFixed(2)}</div>
    `;

    return div;
}

function attachQuantityControls() {
    document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.order-item');
            updateItemQuantity(item, -1);
        });
    });

    document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.order-item');
            updateItemQuantity(item, 1);
        });
    });
}

function updateItemQuantity(itemElement, change) {
    const qtyElement = itemElement.querySelector('.qty-value');
    const priceElement = itemElement.querySelector('.item-price');
    const unitPrice = parseFloat(itemElement.dataset.unitPrice);
    const itemId = itemElement.dataset.id;
    
    let currentQty = parseInt(qtyElement.textContent);
    let newQty = currentQty + change;
    
    if (newQty < 1) {
        // Preguntar si quiere eliminar
        if (confirm('¿Deseas eliminar este producto del pedido?')) {
            itemElement.remove();
            updateCartInStorage(itemId, 0);
            recalculateCheckoutTotals();
            
            // Verificar si el carrito quedó vacío
            if (document.querySelectorAll('.order-item').length === 0) {
                showEmptyCartMessage();
            }
        }
        return;
    }
    
    // Actualizar UI
    qtyElement.textContent = newQty;
    priceElement.textContent = `S/ ${(unitPrice * newQty).toFixed(2)}`;
    
    // Actualizar en localStorage
    updateCartInStorage(itemId, newQty);
    
    // Recalcular totales
    recalculateCheckoutTotals();
}

function updateCartInStorage(itemId, newQuantity) {
    try {
        let cartItems = getCartItems();
        
        if (newQuantity === 0) {
            // Eliminar item
            cartItems = cartItems.filter(item => item.id !== itemId);
        } else {
            // Actualizar cantidad
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                item.quantity = newQuantity;
            }
        }
        
        localStorage.setItem('bramiCart', JSON.stringify(cartItems));
    } catch (e) {
        console.error('Error actualizando carrito:', e);
    }
}

function recalculateCheckoutTotals() {
    const items = document.querySelectorAll('.order-item');
    let subtotal = 0;
    
    items.forEach(item => {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('S/', '').trim());
        subtotal += price;
    });
    
    // Actualizar subtotal
    const subtotalElement = document.querySelector('.total-row:first-child span:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
    }
    
    // Obtener costo de delivery
    const deliveryCostText = document.querySelector('.delivery-cost')?.textContent || 'S/ 5.00';
    const deliveryCost = deliveryCostText === 'Gratis' ? 0 : parseFloat(deliveryCostText.replace('S/', '').trim());
    
    // Obtener descuento
    const discountElement = document.querySelector('.discount-amount');
    const discount = discountElement ? parseFloat(discountElement.textContent.replace('- S/', '').trim()) : 0;
    
    // Calcular total
    const total = subtotal + deliveryCost - discount;
    
    // Actualizar total
    const totalElement = document.querySelector('.total-amount');
    if (totalElement) {
        totalElement.textContent = `S/ ${total.toFixed(2)}`;
    }
    
    // Actualizar checkoutState si existe
    if (typeof checkoutState !== 'undefined') {
        checkoutState.subtotal = subtotal;
    }
}

function updateCheckoutTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Actualizar subtotal en el DOM
    const subtotalElement = document.querySelector('.total-row:first-child span:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
    }
    
    // Recalcular total incluyendo delivery
    recalculateCheckoutTotals();
}

function showEmptyCartMessage() {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
            <svg style="width: 80px; height: 80px; margin-bottom: 20px; opacity: 0.5;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3 style="font-size: 18px; margin-bottom: 10px; color: var(--text-primary);">Tu carrito está vacío</h3>
            <p style="margin-bottom: 20px; font-size: 14px;">Agrega productos desde nuestra carta</p>
            <a href="/pages/carta.html" style="display: inline-block; padding: 12px 24px; background: var(--accent-red); color: var(--text-primary); text-decoration: none; border-radius: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 13px;">
                Ver Carta
            </a>
        </div>
    `;
    
    // Ocultar el botón de confirmar pedido
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
    }
}

// Función para limpiar el carrito después de confirmar el pedido
function clearCartAfterCheckout() {
    try {
        localStorage.removeItem('bramiCart');
        console.log('🧹 Carrito limpiado después del checkout');
    } catch (e) {
        console.error('Error limpiando carrito:', e);
    }
}

// Exportar función para usar en checkout.js
window.clearCartAfterCheckout = clearCartAfterCheckout;

// Listener para cuando se confirma el pedido
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        // Guardar el click handler original
        const originalHandler = checkoutBtn.onclick;
        
        checkoutBtn.addEventListener('click', function() {
            // Después de procesar el pedido exitosamente, limpiar el carrito
            // Esto se debe llamar en el callback exitoso del pedido
            setTimeout(() => {
                // Verificar si el pedido fue exitoso (puedes agregar tu lógica aquí)
                const orderProcessed = true; // Cambiar según tu lógica
                
                if (orderProcessed) {
                    clearCartAfterCheckout();
                }
            }, 2500); // Esperar a que se muestre el modal de confirmación
        });
    }
});