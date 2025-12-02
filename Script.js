// 1. Ambil data lama jika ada saat halaman di-load
let cart = JSON.parse(localStorage.getItem('caveokkaCart')) || [];

// Fungsi bantu hitung total item untuk badge
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Fungsi notifikasi sederhana
function showNotification(message) {
    // Simple notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 bg-amber-900 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function addToCart(productName, price) {
    // Cek apakah produk sudah ada di cart
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }

    // Simpan ke LocalStorage
    localStorage.setItem('caveokkaCart', JSON.stringify(cart));
    
    updateCartDisplay();
    showNotification(`${productName} ditambahkan ke keranjang!`);
}

function updateCartDisplay() {
    const cartBadge = document.getElementById('cart-count');
    const totalCount = getCartCount(); 

    if (cartBadge) {
        if (totalCount > 0) {
            cartBadge.textContent = totalCount;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    // Menutup modal dengan transisi
    modal.classList.add('opacity-0');
    const transformElement = modal.querySelector('.transform');
    if (transformElement) {
        transformElement.classList.add('scale-95');
    }

    // Sembunyikan setelah transisi selesai
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); 
}

// Fungsi untuk menampilkan modal (Perlu global karena dipanggil oleh event click dari HTML)
function showProductModal(productName, description, price, imageSrc) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    // Mengisi konten modal
    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-product-description').textContent = description;
    
    // Format harga ke Rupiah
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price).replace('IDR', 'Rp.');

    document.getElementById('modal-product-price').textContent = formattedPrice;
    document.getElementById('modal-product-image').src = imageSrc;
    document.getElementById('modal-product-image').alt = productName;

    // Menghubungkan tombol "Tambahkan ke Keranjang" di modal
    const addToCartBtn = document.getElementById('modal-add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            addToCart(productName, price);
            closeModal();
        };
    }

    // Menampilkan modal dengan transisi
    modal.classList.remove('hidden');
    // Beri sedikit jeda agar transisi CSS berjalan
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const transformElement = modal.querySelector('.transform');
        if (transformElement) {
            transformElement.classList.remove('scale-95');
        }
    }, 10);
}


document.addEventListener('DOMContentLoaded', () => {
    // Panggil cart display saat pertama load
    updateCartDisplay();

    // 1. LOGIKA MENU MOBILE (HAMBURGER)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon'); // SVG element

    if (mobileMenuBtn && mobileMenu && menuIcon) {
        mobileMenuBtn.addEventListener('click', () => {
            // Menambah/menghapus class 'active' untuk memicu CSS transition
            mobileMenu.classList.toggle('active');
            
            // Mengubah ikon (Hamburger <-> Close)
            if (mobileMenu.classList.contains('active')) {
                // Ikon Close (X)
                menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                // Ikon Hamburger
                menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });

        // Tutup menu mobile
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });
    }

    // 2. Category filter
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

    // 3. Testimonial slider
    let currentTestimonial = 0;
    const testimonialSlider = document.getElementById('testimonial-slider');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const totalTestimonials = 3;

    function showTestimonial(index) {
        currentTestimonial = index;
        if(testimonialSlider) {
            testimonialSlider.style.transform = `translateX(-${index * 105}%)`;
        }
        
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
    
    if (document.getElementById('prev-testimonial') && document.getElementById('next-testimonial')) {
        document.getElementById('prev-testimonial').addEventListener('click', () => {
            const newIndex = currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
            showTestimonial(newIndex);
        });

        document.getElementById('next-testimonial').addEventListener('click', () => {
            const newIndex = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
            showTestimonial(newIndex);
        });
    }


    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });

    // Auto-play testimonials
    setInterval(() => {
        const newIndex = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
        showTestimonial(newIndex);
    }, 5000);

    // 4. Scroll animations
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

    // 5. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 6. Smooth scroll for navigation links
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
});