// Rendre les articles du panier
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartSummary = document.getElementById('cartSummary');
    
    // Recharger le panier depuis le localStorage à chaque fois
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItems) cartItems.innerHTML = '';
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;
    if (cartSummary) cartSummary.style.display = 'block';
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">${item.price.toFixed(2)} FCFA</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    updateCartSummary();
}

// Mettre à jour le récapitulatif du panier
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + shipping;
    
    if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} FCFA`;
    if (shippingElement) shippingElement.textContent = `${shipping.toFixed(2)} FCFA`;
    if (totalElement) totalElement.textContent = `${total.toFixed(2)} FCFA`;
}

// Rendre les commandes en attente
function renderPendingOrders() {
    const pendingOrdersContainer = document.getElementById('pendingOrders');
    
    if (!pendingOrdersContainer) return;
    
    if (pendingOrders.length === 0) {
        pendingOrdersContainer.innerHTML = '<p class="no-orders">Aucune commande en attente.</p>';
        return;
    }
    
    pendingOrdersContainer.innerHTML = pendingOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h3>Commande #${order.id}</h3>
                <span class="order-date">${order.date}</span>
            </div>
            <div class="order-details">
                <p><strong>Client:</strong> ${order.customer.name}</p>
                <p><strong>Téléphone:</strong> ${order.customer.phone}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)} FCFA</p>
                <p><strong>Statut:</strong> <span class="status-pending">${order.status}</span></p>
            </div>
            <div class="order-items">
                <h4>Articles:</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)} FCFA</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Initialisation de la page panier
function initCartPage() {
    console.log('Initialisation de la page panier');
    
    // Charger les données depuis le localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    pendingOrders = JSON.parse(localStorage.getItem('pendingOrders')) || [];
    
    // Mettre à jour le compteur du panier
    updateCartCount();
    
    // Rendre les éléments
    renderCartItems();
    renderPendingOrders();
    
    // Gestion du bouton de commande
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            openOrderModal(); // Ouvre le modal sans ID produit (pour commander tout le panier)
        });
    }
}

// Vérifier si on est sur la page panier et initialiser
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cartItems') || document.getElementById('pendingOrders')) {
        initCartPage();
    }
});