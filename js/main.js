// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Produto adicionado ao carrinho!');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2700);
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Calculate discount price
function calculateDiscountPrice(price) {
    return price * 0.85; // 15% discount
}

// Format price with BRL currency
function formatPrice(price) {
    return 'R$ ' + price.toFixed(2).replace('.', ',');
}

// Create product card
function createProductCard(product, index) {
    const discountPrice = calculateDiscountPrice(product.price);
    const isNew = index < 2; // First two products are marked as new
    const discount = ((product.price - discountPrice) / product.price * 100).toFixed(0);
    
    // Check if we're on the main page or in a subdirectory
    const isMainPage = window.location.pathname.indexOf('/pages/') === -1;
    const productLink = isMainPage 
        ? `pages/product-details.html?id=${product.id}` 
        : `product-details.html?id=${product.id}`;
    
    return `
        <div class="product-card" onclick="window.location.href='${productLink}';" style="cursor: pointer;">
            <div class="product-image">
                <a href="${productLink}">
                    <img src="${product.image}" alt="${product.name}">
                    ${isNew ? '<div class="product-tag">NOVO</div>' : `<div class="product-tag">-${discount}%</div>`}
                </a>
            </div>
            <div class="product-info">
                <h3><a href="${productLink}" style="color: inherit; text-decoration: none;">${product.name}</a></h3>
                <div class="product-price">
                    ${formatPrice(discountPrice)}
                    <span style="text-decoration: line-through; color: var(--text-light); font-size: 0.85em; margin-left: 5px;">
                        ${formatPrice(product.price)}
                    </span>
                </div>
                <div class="product-meta">
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                        <span style="margin-left: 5px;">${product.rating}</span>
                    </div>
                    <div class="product-sold">
                        ${Math.floor(Math.random() * 200) + 10} vendidos
                    </div>
                </div>
                <button onclick="event.stopPropagation(); addToCart(${product.id})" class="add-to-cart-btn">
                    <i class="fas fa-cart-plus"></i> Adicionar
                </button>
            </div>
        </div>
    `;
}

// Display featured products
function displayFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        const featuredProducts = products.slice(0, 4); // Show first 4 products as featured
        featuredProductsContainer.innerHTML = featuredProducts.map((product, index) => 
            createProductCard(product, index)
        ).join('');
    }
}

// Shuffle products for more natural browsing experience
function shuffleProducts(products) {
    return [...products].sort(() => 0.5 - Math.random());
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Update UI
    updateCartCount();
    displayFeaturedProducts();
    
    // Add countdown functionality
    if (document.querySelector('.countdown')) {
        startCountdown();
    }
});

// Countdown timer for flash deals
function startCountdown() {
    const hours = document.querySelector('.countdown-item:nth-child(1)');
    const minutes = document.querySelector('.countdown-item:nth-child(3)');
    const seconds = document.querySelector('.countdown-item:nth-child(5)');
    
    if (!hours || !minutes || !seconds) return;
    
    let h = parseInt(hours.textContent);
    let m = parseInt(minutes.textContent);
    let s = parseInt(seconds.textContent);
    
    const countdownInterval = setInterval(() => {
        s--;
        
        if (s < 0) {
            s = 59;
            m--;
            
            if (m < 0) {
                m = 59;
                h--;
                
                if (h < 0) {
                    clearInterval(countdownInterval);
                    // Reset or do something when countdown ends
                    h = 8;
                    m = 0;
                    s = 0;
                }
            }
        }
        
        hours.textContent = h.toString().padStart(2, '0');
        minutes.textContent = m.toString().padStart(2, '0');
        seconds.textContent = s.toString().padStart(2, '0');
    }, 1000);
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: var(--white);
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1100;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
    }
    
    .notification i {
        margin-right: 10px;
        font-size: 1.2rem;
    }
    
    .fade-out {
        animation: fadeOut 0.3s forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
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
    
    .text-center {
        text-align: center;
    }
`;
document.head.appendChild(style); 