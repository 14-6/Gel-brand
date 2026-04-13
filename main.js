// 1. وظيفة تشغيل الحركات عند تحميل الصفحة بالكامل
function revealContent() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // إظهار قسم البراند (Hero Section) بنعومة بعد تأخير بسيط
    setTimeout(() => {
        if (heroContent) {
            heroContent.style.opacity = "1";
            heroContent.style.transform = "translateY(0)";
        }
        if (heroImage) {
            heroImage.style.opacity = "1";
            heroImage.style.transform = "translateX(0)";
        }

        // تشغيل حركة ظهور صور المنتجات بالتدريج
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('reveal');
            }, index * 200);
        });
    }, 300);
}

// 2. كود لجعل التنقل بين الأقسام ناعماً
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 3. تشغيل الحركات عند تحميل الصفحة بالكامل
// Use addEventListener to prevent overwriting other scripts
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
    revealContent();
    updateCartUI(); // تحديث السلة عند التحميل
});

// --- نظام سلة المشتريات (Shopping Cart System) ---
let cart = JSON.parse(localStorage.getItem('gel_cart')) || [];

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function addToCart(name, price, img, event) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const item = { name, price, img, quantity: 1, id: Date.now() };
        cart.push(item);
    }
    
    saveCart();
    updateCartUI();
    
    // Feedback feedback: turn button green
    const btn = event ? event.currentTarget : null;
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "Added!";
        btn.classList.add('success');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('success');
        }, 1000);
    }
}

// وظيفة جديدة لتغيير الكمية (زيادة أو نقصان)
function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('gel_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;

    const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.innerText = totalQty;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-container">
                <i class="fas fa-shopping-bag empty-icon"></i>
                <p class="empty-msg">Your bag is empty</p>
            </div>
        `;
        cartTotal.innerText = '0 QAR';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} QAR</p>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    </div>
                </div>
                <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
            </div>
        `;
    });
    
    cartTotal.innerText = total + ' QAR';
}

function checkout() {
    if (cart.length === 0) {
        alert("Your bag is empty!");
        return;
    }
    
    let message = "Hello GEL Brand, I would like to order:\n\n";
    cart.forEach(item => {
        message += `- ${item.name} | Qty: ${item.quantity} | Total: ${item.price * item.quantity} QAR\n`;
    });
    message += `\nFinal Total: ${document.getElementById('cart-total').innerText}`;
    
    const whatsappUrl = `https://wa.me/97431121124?text=${encodeURIComponent(message)}`; 
    window.open(whatsappUrl, '_blank');
}