// Cart functionality
// 1. Inisialisasi keranjang dari Local Storage, jika tidak ada, gunakan array kosong.
let cart = JSON.parse(localStorage.getItem('cart')) || []; 
// cartCount global tidak digunakan lagi

// Mendapatkan elemen DOM (Cart & Checkout)
const cartSidebar = document.getElementById('cart-sidebar');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalDisplay = document.getElementById('cart-total');
const cartBadge = document.getElementById('cart-count'); 
const emptyCartMessage = document.getElementById('empty-cart-message');
const checkoutButton = document.getElementById('checkout-btn');
const cartButton = document.getElementById('cart-btn');

// Mendapatkan elemen DOM (Product Modal)
const modal = document.getElementById('product-modal');
const modalName = document.getElementById('modal-product-name');
const modalDesc = document.getElementById('modal-product-description');
const modalPrice = document.getElementById('modal-product-price');
const modalImage = document.getElementById('modal-product-image');
const modalButton = document.getElementById('modal-add-to-cart-btn'); 

// --- FUNGSI UTAMA KERANJANG ---

/**
 * Menyimpan array keranjang ke Local Storage.
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Menambahkan atau memperbarui produk di keranjang.
 * @param {string} productName - Nama produk.
 * @param {number} price - Harga produk.
 */
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }

    saveCart(); // Simpan ke Local Storage
    updateCartDisplay();
    showNotification(`${productName} ditambahkan ke keranjang!`, 'success');
}

/**
 * Mengubah kuantitas produk di keranjang.
 * @param {string} productName - Nama produk.
 * @param {number} change - Perubahan kuantitas (+1 atau -1).
 */
function changeQuantity(productName, change) {
    const itemIndex = cart.findIndex(item => item.name === productName);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }

    saveCart(); // Simpan ke Local Storage
    updateCartDisplay();
    renderCart(); 
}

/**
 * Mengubah tampilan badge keranjang dan status tombol checkout.
 */
function updateCartDisplay() {
    // Hitung total kuantitas item secara real-time
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    if (totalQuantity > 0) {
        cartBadge.textContent = totalQuantity;
        cartBadge.style.display = 'flex';
        checkoutButton.disabled = false;
    } else {
        cartBadge.style.display = 'none';
        checkoutButton.disabled = true;
    }
}

/**
 * Merender daftar item di dalam sidebar/modal nota.
 */
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        cartTotalDisplay.textContent = 'Rp. 0';
        return;
    } else {
        emptyCartMessage.classList.add('hidden');
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const escapedName = item.name.replace(/'/g, "\\'"); // Mengatasi tanda kutip tunggal

        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center p-4 bg-amber-50 rounded-xl shadow-sm';
        itemElement.innerHTML = `
            <div class="flex-1">
                <h4 class="text-lg font-semibold text-amber-900">${item.name}</h4>
                <p class="text-sm text-gray-600">Rp. ${item.price.toLocaleString('id-ID')}</p>
            </div>
            <div class="flex items-center space-x-3">
                <button onclick="changeQuantity('${escapedName}', -1)" class="w-8 h-8 bg-amber-200 text-amber-900 rounded-full hover:bg-amber-300 transition-colors font-bold text-xl">-</button>
                <span class="text-lg font-bold text-amber-900 w-6 text-center">${item.quantity}</span>
                <button onclick="changeQuantity('${escapedName}', 1)" class="w-8 h-8 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors font-bold text-xl">+</button>
            </div>
            <span class="ml-4 text-lg font-bold text-amber-900 w-24 text-right">Rp. ${itemTotal.toLocaleString('id-ID')}</span>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalDisplay.textContent = 'Rp. ' + total.toLocaleString('id-ID');
}

/**
 * Mengubah visibilitas sidebar keranjang.
 */
function toggleCartSidebar() {
    cartSidebar.classList.toggle('active');
    cartBackdrop.classList.toggle('active');
    if (cartSidebar.classList.contains('active')) {
        renderCart(); 
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Proses pembayaran (Checkout).
 */
function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang Anda kosong!', 'error');
        return;
    }

    const totalBayar = cartTotalDisplay.textContent;

    Swal.fire({
        title: 'Konfirmasi Pembayaran',
        html: `Apakah Anda yakin ingin membayar total <strong>${totalBayar}</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#78350f', 
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Bayar Sekarang!',
        cancelButtonText: 'Batalkan',
    }).then((result) => {
        if (result.isConfirmed) {
            cart = [];
            saveCart(); // Bersihkan Local Storage
            updateCartDisplay();
            renderCart();
            toggleCartSidebar(); 

            Swal.fire({
                title: 'Pembayaran Berhasil!',
                html: 'Pesanan Anda telah dibayar. Silakan tunggu kopi Anda siap!',
                icon: 'success',
                confirmButtonColor: '#78350f'
            });
        }
    });
}

/**
 * Menampilkan notifikasi SweetAlert.
 */
function showNotification(message, type = 'success') {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: 'animate-fade-in' 
        }
    });
}


// --- FUNGSI MODAL PRODUK ---

/**
 * Membuka modal dan mengisi detail produk.
 */
function showProductModal(name, description, price, imageSrc) {
    modalName.textContent = name;
    modalDesc.textContent = description;
    modalPrice.textContent = 'Rp. ' + price.toLocaleString('id-ID');
    modalImage.src = imageSrc;
    modalImage.alt = name;

    modalButton.onclick = function() {
        addToCart(name, price); 
        closeModal();
    };

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('opacity-100');
        const modalContent = modal.querySelector('div:not([id])');
        if (modalContent) {
             // Asumsi ini adalah div konten modal
            modalContent.classList.remove('scale-95'); 
        }
    }, 10);
}

/**
 * Menutup modal.
 * @param {Event} [event] - Event click, digunakan untuk menutup hanya jika mengklik backdrop.
 */
function closeModal(event) {
    // Cek jika event ada dan target bukan backdrop (modal itu sendiri)
    if (event && event.target !== modal) return; 

    modal.classList.remove('opacity-100');
    const modalContent = modal.querySelector('div:not([id])');
    if (modalContent) {
        modalContent.classList.add('scale-95');
    }
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// --- INISIALISASI & EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Panggil updateCartDisplay() saat halaman dimuat
    updateCartDisplay();
    
    // 2. Event listener untuk tombol keranjang di navbar
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah navigasi default
            toggleCartSidebar();
        });
    }

    // 3. Event listener untuk menutup modal (jika mengklik backdrop)
    if (modal) {
        modal.addEventListener('click', closeModal);
    }
});


// --- Fungsionalitas Lain (Disimpan Utuh) ---

// Category filter
const categoryButtons = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        productCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Testimonial slider
let currentTestimonial = 0;
const testimonialSlider = document.getElementById('testimonial-slider');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const totalTestimonials = 3;

function showTestimonial(index) {
    currentTestimonial = index;
    testimonialSlider.style.transform = `translateX(-${index * 105}%)`;
    
    testimonialDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.remove('bg-gray-300');
            dot.classList.add('bg-amber-900');
        } else {
            dot.classList.remove('bg-amber-900');
            dot.classList.add('bg-gray-300');
        }
    });
}

document.getElementById('prev-testimonial').addEventListener('click', () => {
    const newIndex = currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
    showTestimonial(newIndex);
});

document.getElementById('next-testimonial').addEventListener('click', () => {
    const newIndex = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
    showTestimonial(newIndex);
});

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
});

// Auto-play testimonials
setInterval(() => {
    const newIndex = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
    showTestimonial(newIndex);
}, 5000);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
    } else {
        menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    }
});

// Close mobile menu when clicking links
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});