// --- Translation System ---
const translations = {
    ar: {
        nav_home: "الرئيسية",
        nav_contact: "تواصل معنا",
        nav_about: "من نحن",
        nav_shop: "المتجر",
        hero_title: "GEL BRAND",
        hero_desc: "نحن لا نبيع الملابس فقط، نحن نصنع أسلوب حياة يجمع بين الفخامة والراحة العصرية. اكتشف مجموعتنا المختارة بعناية لتناسب ذوقك الرفيع.",
        hero_btn: "تصفح المنتجات",
        cart_title: "حقيبتك",
        cart_empty: "حقيبتك فارغة",
        cart_total: "الإجمالي",
        cart_checkout: "إتمام الطلب",
        footer_desc: "ملابس فاخرة للجيل العصري.",
        footer_rights: "جميع الحقوق محفوظة © 2026 براند GEL.",
        contact_title: "تواصل معنا",
        contact_desc: "نحن هنا لمساعدتك دائماً. يمكنك مراسلتنا عبر النموذج التالي:",
        contact_name: "الاسم",
        contact_email: "البريد الإلكتروني",
        contact_msg: "رسالتك",
        contact_send: "إرسال",
        contact_whatsapp: "أو تواصل معنا مباشرة عبر واتساب:",
        about_title: "رؤيتنا في GEL",
        about_p1: "بدأت رحلتنا بشغف لخلق ملابس تعكس روح العصر. في GEL، نحن لا نصمم مجرد أزياء، بل نصنع تجربة فريدة تمزج بين الفخامة والراحة اليومية.",
        about_p2: "كل قطعة في مجموعتنا مختارة بعناية لضمان أعلى مستويات الجودة وأدق التفاصيل التي تليق بذوقكم الرفيع.",
        shop_title: "المجموعة الكاملة",
        shop_subtitle: "اكتشف أحدث تصاميمنا الحصرية",
        add_to_cart: "أضف للسلة",
        added: "تمت الإضافة!",
        lang_btn: "English"
    },
    en: {
        nav_home: "Home",
        nav_contact: "Contact",
        nav_about: "About",
        nav_shop: "Shop",
        hero_title: "GEL BRAND",
        hero_desc: "We don't just sell clothes; we create a lifestyle that blends luxury with modern comfort. Discover our carefully selected collection to suit your refined taste.",
        hero_btn: "Browse Products",
        cart_title: "Your Bag",
        cart_empty: "Your bag is empty",
        cart_total: "Total",
        cart_checkout: "Checkout",
        footer_desc: "Premium apparel for the modern generation.",
        footer_rights: "© 2026 GEL Brand. All rights reserved.",
        contact_title: "Contact Us",
        contact_desc: "We are always here to help. You can message us via the form below:",
        contact_name: "Name",
        contact_email: "Email",
        contact_msg: "Your Message",
        contact_send: "Send",
        contact_whatsapp: "Or contact us directly via WhatsApp:",
        about_title: "Our Vision at GEL",
        about_p1: "Our journey began with a passion for creating clothes that reflect the spirit of the age. At GEL, we don't just design fashion; we craft a unique experience that blends luxury with daily comfort.",
        about_p2: "Each piece in our collection is carefully selected to ensure the highest levels of quality and the finest details that suit your refined taste.",
        shop_title: "Full Collection",
        shop_subtitle: "Discover our latest exclusive designs",
        add_to_cart: "Add to Cart",
        added: "Added!",
        lang_btn: "العربية"
    }
};

let currentLang = localStorage.getItem('gel_lang') || 'ar';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('gel_lang', lang);
    
    // KEEP RTL for both languages as requested
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Update the language button text/icon if needed
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) {
        langLabel.textContent = lang === 'ar' ? 'العربية' : 'English';
    }

    // Specific update for Add to Cart buttons that aren't dynamic
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        if (!btn.classList.contains('success')) {
            btn.textContent = translations[lang].add_to_cart;
        }
    });

    updateCartUI(); // Refresh cart text
}

function toggleLangDropdown() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('lang-dropdown');
    const langBtn = document.querySelector('.lang-switcher-container');
    if (dropdown && !langBtn.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

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
window.addEventListener('load', function() {
    setLanguage(currentLang); // Apply saved language
    window.scrollTo(0, 0);
    revealContent();
    updateCartUI();
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
        btn.innerText = translations[currentLang].added;
        btn.classList.add('success');
        setTimeout(() => {
            btn.innerText = translations[currentLang].add_to_cart;
            btn.classList.remove('success');
        }, 300);
    }
}

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
    const cartTitle = document.querySelector('#cart-sidebar h3');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (cartTitle) cartTitle.textContent = translations[currentLang].cart_title;
    if (checkoutBtn) checkoutBtn.textContent = translations[currentLang].cart_checkout;
    if (!cartItemsContainer) return;

    const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.innerText = totalQty;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-container">
                <i class="fas fa-shopping-bag empty-icon"></i>
                <p class="empty-msg">${translations[currentLang].cart_empty}</p>
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
        alert(translations[currentLang].cart_empty);
        return;
    }
    
    let message = currentLang === 'ar' ? "مرحباً GEL Brand، أرغب بطلب الآتي:\n\n" : "Hello GEL Brand, I would like to order:\n\n";
    cart.forEach(item => {
        message += `- ${item.name} | Qty: ${item.quantity} | Total: ${item.price * item.quantity} QAR\n`;
    });
    message += `\n${translations[currentLang].cart_total}: ${document.getElementById('cart-total').innerText}`;
    
    const whatsappUrl = `https://wa.me/97431121124?text=${encodeURIComponent(message)}`; 
    window.open(whatsappUrl, '_blank');
}