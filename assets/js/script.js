// Gestion de la navigation responsive
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Fermer le menu en cliquant sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Gestion du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let pendingOrders = JSON.parse(localStorage.getItem('pendingOrders')) || [];

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Ajouter un produit au panier
function addToCart(product, quantity = 1) {
    if (typeof product === 'number') {
        product = getProductById(product);
    }
    
    if (!product) {
        console.error('Produit non trouvé');
        return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} a été ajouté au panier`);
}

// Supprimer un produit du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    if (typeof renderCartItems === 'function') {
        renderCartItems();
    }
}

// Modifier la quantité
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            if (typeof renderCartItems === 'function') {
                renderCartItems();
            }
        }
    }
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Gestion du modal de commande
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const closeModal = document.querySelector('.close');

// Ouvrir le modal de commande
function openOrderModal(productId = null) {
    if (productId) {
        document.getElementById('productId').value = productId;
    }
    orderModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fermer le modal de commande
function closeOrderModal() {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (orderForm) orderForm.reset();
}

// Fermer le modal en cliquant en dehors
window.addEventListener('click', (event) => {
    if (event.target === orderModal) {
        closeOrderModal();
    }
});

// Fermer le modal avec la touche Échap
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && orderModal.style.display === 'block') {
        closeOrderModal();
    }
});

// Gestion de la soumission du formulaire de commande
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('productId').value;
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        let orderItems;
        let totalAmount;
        
        if (productId) {
            const product = getProductById(productId);
            if (!product) {
                alert('Produit non trouvé!');
                return;
            }
            orderItems = [{
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }];
            totalAmount = product.price;
        } else {
            orderItems = cart;
            totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        
        const order = {
            id: Date.now(),
            date: new Date().toLocaleDateString('fr-FR'),
            customer: { name, phone, address },
            items: orderItems,
            total: totalAmount,
            paymentMethod,
            status: 'pending'
        };
        
        pendingOrders.push(order);
        localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
        
        if (!productId) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }
        
        const message = prepareWhatsAppMessage(order);
        const phoneNumber = "+212779639119";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        
        closeOrderModal();
        alert('Votre commande a été passée avec succès! Vous allez être redirigé vers WhatsApp pour confirmer.');
    });
}

// Préparer le message WhatsApp pour la commande
function prepareWhatsAppMessage(order) {
    let message = `Nouvelle commande #${order.id}\n`;
    message += `Client: ${order.customer.name}\n`;
    message += `Téléphone: ${order.customer.phone}\n`;
    message += `Adresse: ${order.customer.address}\n\n`;
    message += `Articles:\n`;
    
    order.items.forEach(item => {
        message += `- ${item.name} x${item.quantity}: ${(item.price * item.quantity).toFixed(2)}FCFA\n`;
        if (item.image) {
            message += `  Image: ${item.image}\n`;
        }
    });
    
    message += `\nTotal: ${order.total.toFixed(2)}FCFA\n`;
    message += `Méthode de paiement: ${order.paymentMethod === 'livraison' ? 'Payer à la livraison' : 'Airtel Money'}\n`;
    message += `Date: ${order.date}`;
    
    return message;
}

// RENDER DES PRODUITS - FONCTIONS SPÉCIFIQUES À LA PAGE BOUTIQUE

// Rendre tous les produits sur la page boutique
function renderAllProducts(productsToRender = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsGrid) {
        if (productsToRender.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">Aucun produit ne correspond à votre recherche.</p>';
            return;
        }
        
        productsGrid.innerHTML = productsToRender.map(product => `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price.toFixed(2)} FCFA</div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Ajouter au panier</button>
                    <button class="btn btn-outline" onclick="openOrderModal(${product.id})" style="margin-top: 10px;">Commander</button>
                </div>
            </div>
        `).join('');
        
        initScrollAnimations();
    }
}

// Rendre les produits sur la page d'accueil
function renderFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    const promoContainer = document.getElementById('promoProducts');
    
    if (featuredContainer) {
        const featuredProducts = getFeaturedProducts();
        featuredContainer.innerHTML = featuredProducts.map(product => `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price.toFixed(2)} FCFA</div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Ajouter au panier</button>
                    <button class="btn btn-outline" onclick="openOrderModal(${product.id})" style="margin-top: 10px;">Commander</button>
                </div>
            </div>
        `).join('');
    }
    
    if (promoContainer) {
        const promoProducts = getPromoProducts();
        promoContainer.innerHTML = promoProducts.map(product => `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price" style="color: #e63946; font-weight: bold;">${product.price.toFixed(2)} FCFA</div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Ajouter au panier</button>
                    <button class="btn btn-outline" onclick="openOrderModal(${product.id})" style="margin-top: 10px;">Commander</button>
                </div>
            </div>
        `).join('');
    }
}

// RECHERCHE AUTOMATIQUE - NOUVELLE VERSION
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) {
        console.log('searchInput non trouvé - peut-être pas sur la page boutique');
        return;
    }
    
    console.log('Initialisation de la recherche automatique');
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = this.value.trim();
            console.log('Recherche automatique pour:', query);
            
            if (query === '') {
                // Si la recherche est vide, afficher tous les produits
                renderAllProducts();
            } else {
                // Sinon, effectuer la recherche
                const results = searchProducts(query);
                renderAllProducts(results);
            }
        }, 300);
    });
    
    // Recherche par Enter (optionnel)
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            const results = searchProducts(query);
            renderAllProducts(results);
        }
    });
}

// Filtrer les produits par catégorie
function filterProductsByCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const filteredProducts = getProductsByCategory(selectedCategory);
            renderAllProducts(filteredProducts);
        });
    }
}

// ANIMATIONS
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// INITIALISATION SPÉCIFIQUE À LA PAGE BOUTIQUE
function initBoutiquePage() {
    console.log('Initialisation de la page boutique');
    renderAllProducts();
    filterProductsByCategory();
    setupSearch(); // RECHERCHE AUTOMATIQUE ACTIVÉE ICI
    initScrollAnimations();
}

// INITIALISATION GÉNÉRALE
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Détection automatique de la page
    if (document.getElementById('featuredProducts')) {
        // Page d'accueil
        console.log('Page d\'accueil détectée');
        renderFeaturedProducts();
        initScrollAnimations();
    }
    
    if (document.getElementById('productsGrid')) {
        // Page boutique
        console.log('Page boutique détectée');
        initBoutiquePage();
    }
    
    // Fermer le modal
    if (closeModal) {
        closeModal.addEventListener('click', closeOrderModal);
    }
});

// Bloquer le clic droit
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showNotification('👑 L\'élégance ne se copie pas - Merci de respecter notre travail');
});

// Optionnel : Bloquer aussi les touches F12, Ctrl+Shift+I, etc.
document.addEventListener('keydown', function(e) {
    // Empêcher F12
    if (e.key === 'F12') {
        e.preventDefault();
        showNotification('👑 L\'élégance ne se copie pas - Merci de respecter notre travail');
    }
    
    // Empêcher Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        showNotification('👑 L\'élégance ne se copie pas - Merci de respecter notre travail');
    }
    
    // Empêcher Ctrl+U (code source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        showNotification('👑 L\'élégance ne se copie pas - Merci de respecter notre travail');
    }
});