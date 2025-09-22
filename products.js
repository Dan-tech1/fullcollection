// Base de données des produits
const products = [
    {
        id: 1,
        name: "Maucassin noir",
        description: "Chaussure en cuir confortable et élégante, parfaite pour toutes les occasions.",
        price: 20000,
        image: "/assets/images/full1.jpg",
        category: "chaussures",
        featured: true
    },
    {
        id: 2,
        name: "Maucassin",
        description: "Chaussure en cuir confortable et élégante, parfaite pour toutes les occasions.",
        price: 29000.99,
        image: "/assets/images/full2.jpg",
        category: "chaussures",
        featured: true
    },
    {
        id: 3,
        name: "Balérine homme",
        description: "Chaussure légère et stylée, idéale pour un usage quotidien.",
        price: 29000.50,
        image: "/assets/images/full3.jpg",
        category: "chaussures",
        featured: true
    },
    {
        id: 4,
        name: "Veste en Cuir",
        description: "Veste en cuir véritable, intemporelle et élégante.",
        price: 15000.00,
        image: "/assets/images/full4.jpg",
        category: "chaussures",
        promo: true
    },
    {
        id: 5,
        name: "Sneakers Urban",
        description: "Sneakers confortables et stylées pour un look décontracté.",
        price: 15000.75,
        image: "/assets/images/full5.jpg",
        category: "chaussures",
        promo: true
    },
    {
        id: 6,
        name: "Sac à Main",
        description: "Sac à main élégant avec compartiments multiples.",
        price: 25000.00,
        image: "/assets/images/full1.jpg",
        category: "chaussures",
        featured: true
    },
    {
        id: 7,
        name: "Montre Classique",
        description: "Montre bracelet en cuir avec cadran élégant.",
        price: 25000.00,
        image: "/assets/images/full3.jpg",
        category: "chaussures",
    },
    {
        id: 8,
        name: "Chemise Business",
        description: "Chemise habillée en coton égyptien, parfaite pour le bureau.",
        price: 29000.99,
        image: "/assets/images/full2.jpg",
        category: "chaussures"
    },
    {
        id: 9,
        name: "Chapeau Panama",
        description: "Chapeau style Panama pour se protéger du soleil avec élégance.",
        price: 35000.99,
        image: "/assets/images/full4.jpg",
        category: "chaussures"
    },
    {
        id: 10,
        name: "Bottes en Cuir",
        description: "Bottes robustes en cuir véritable pour toutes les saisons.",
        price: 14000.00,
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        category: "chaussures",
        promo: true
    },
    {
        id: 11,
        name: "Écharpe en Laine",
        description: "Écharpe douce et chaude en laine mérinos de haute qualité.",
        price: 32000.99,
        image: "/assets/images/full4.jpg",
        category: "chaussures"
    },
    {
        id: 12,
        name: "Pull en Cachemire",
        description: "Pull ultra-doux en cachemire pour un confort exceptionnel.",
        price: 15000.00,
        image: "/assets/images/full2.jpg",
        category: "chaussures",
        promo: true
    }
];

// Fonctions pour manipuler les produits
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

function getPromoProducts() {
    return products.filter(product => product.promo);
}

function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
}

function searchProducts(query) {
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerCaseQuery) || 
        product.description.toLowerCase().includes(lowerCaseQuery)
    );
}

// Fonction pour obtenir un produit par son ID (doit être globale)
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}
