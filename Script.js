// --- Script.js (Update Bagian Cart) ---

// 1. Ambil data lama jika ada saat halaman di-load
let cart = JSON.parse(localStorage.getItem('caveokkaCart')) || [];

// Fungsi bantu hitung total item untuk badge
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update tampilan badge saat pertama kali load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

function addToCart(productName, price) {
    // Cek apakah produk sudah ada di cart
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        // Jika ada, tambahkan jumlahnya (quantity)
        existingItem.quantity += 1;
    } else {
        // Jika belum ada, masukkan sebagai item baru
        cart.push({ name: productName, price: price, quantity: 1 });
    }

    // PENTING: Simpan ke LocalStorage agar bisa dibaca di nota.html
    localStorage.setItem('caveokkaCart', JSON.stringify(cart));
    
    updateCartDisplay();
    showNotification(`${productName} ditambahkan ke keranjang!`);
}

function updateCartDisplay() {
    const cartBadge = document.getElementById('cart-count');
    const totalCount = getCartCount(); // Hitung total dari quantity

    if (totalCount > 0) {
        cartBadge.textContent = totalCount;
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

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

    // Modal functions
    function openModal(productName, description, price, imageSrc) {
        const modal = document.getElementById('product-modal');
        document.getElementById('modal-title').textContent = productName;
        document.getElementById('modal-description').textContent = description;
        document.getElementById('modal-price').textContent = `Rp. ${price.toLocaleString()}`;
        document.getElementById('modal-image').src = imageSrc;
        
        document.getElementById('modal-add-btn').onclick = () => {
            addToCart(productName, price);
            closeModal();
        };
        
        modal.classList.add('active');
    }

    function closeModal() {
        document.getElementById('product-modal').classList.remove('active');
    }

    // Close modal when clicking outside
    document.getElementById('product-modal').addEventListener('click', (e) => {
        if (e.target.id === 'product-modal') {
            closeModal();
        }
    });

    // Fungsi untuk menampilkan modal
function showProductModal(productName, description, price, imageSrc) {
    const modal = document.getElementById('product-modal');
    
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
    addToCartBtn.onclick = () => {
        addToCart(productName, price);
        closeModal();
    };

    // Menampilkan modal dengan transisi
    modal.classList.remove('hidden');
    // Beri sedikit jeda agar transisi CSS berjalan
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 10);
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('product-modal');
    
    // Menutup modal dengan transisi
    modal.classList.add('opacity-0');
    modal.querySelector('.transform').classList.add('scale-95');

    // Sembunyikan setelah transisi selesai
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // 300ms sesuai durasi transisi
}

// Menutup modal saat mengklik di luar konten modal
document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
        closeModal();
    }
});