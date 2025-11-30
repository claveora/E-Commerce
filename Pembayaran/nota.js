// --- File: nota.js (atau taruh di dalam tag <script> di nota.html) ---

// Konfigurasi
const CART_KEY = 'caveokkaCart';
let cartData = [];

// DOM Elements
const itemsContainer = document.getElementById('items-list');
const subtotalEl = document.getElementById('subtotal-display');
const taxEl = document.getElementById('service-fee-display');
const totalEl = document.getElementById('grand-total-display');
const payBtn = document.getElementById('pay-button');
const emptyMsg = document.getElementById('empty-cart-message-nota');

// 1. Load Data saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadCartData();
    renderCartItems();
});

function loadCartData() {
    const stored = localStorage.getItem(CART_KEY);
    cartData = stored ? JSON.parse(stored) : [];
}

function saveCartData() {
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
    renderCartItems(); // Render ulang setelah update
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

// 2. Menampilkan Item (Render)
function renderCartItems() {
    itemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cartData.length === 0) {
        emptyMsg.classList.remove('hidden');
        payBtn.disabled = true;
        payBtn.classList.add('opacity-50', 'cursor-not-allowed');
        updateSummary(0);
        return;
    } 
    
    emptyMsg.classList.add('hidden');
    payBtn.disabled = false;
    payBtn.classList.remove('opacity-50', 'cursor-not-allowed');

    cartData.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const html = `
            <div class="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-100 bg-white rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex-1 mb-2 sm:mb-0 text-center sm:text-left">
                    <h3 class="font-bold text-amber-900 text-lg">${item.name}</h3>
                    <p class="text-sm text-gray-500">${formatRupiah(item.price)} x ${item.quantity}</p>
                </div>
                
                <div class="flex items-center gap-4">
                    <div class="flex items-center bg-gray-100 rounded-full px-2">
                        <button onclick="updateQty(${index}, -1)" class="w-8 h-8 flex items-center justify-center text-amber-900 font-bold hover:bg-amber-200 rounded-full transition">-</button>
                        <span class="mx-3 font-semibold text-gray-700 w-4 text-center">${item.quantity}</span>
                        <button onclick="updateQty(${index}, 1)" class="w-8 h-8 flex items-center justify-center text-amber-900 font-bold hover:bg-amber-200 rounded-full transition">+</button>
                    </div>
                    <div class="font-bold text-lg text-amber-900 w-32 text-right">
                        ${formatRupiah(itemTotal)}
                    </div>
                    <button onclick="removeItem(${index})" class="text-red-500 hover:text-red-700 ml-2 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        itemsContainer.innerHTML += html;
    });

    updateSummary(subtotal);
}

// Update Ringkasan Harga
function updateSummary(subtotal) {
    const tax = subtotal * 0.05; // Pajak 5%
    const total = subtotal + tax;

    subtotalEl.innerText = formatRupiah(subtotal);
    taxEl.innerText = formatRupiah(tax);
    totalEl.innerText = formatRupiah(total);
}

// Fungsi Ubah Quantity (+ / -)
window.updateQty = function(index, change) {
    cartData[index].quantity += change;
    if (cartData[index].quantity <= 0) {
        cartData.splice(index, 1); // Hapus jika 0
    }
    saveCartData();
}

// Fungsi Hapus Item
window.removeItem = function(index) {
    cartData.splice(index, 1);
    saveCartData();
}

// 3. LOGIKA PEMBAYARAN DENGAN SWEETALERT
payBtn.addEventListener('click', () => {
    // Ambil total untuk ditampilkan di alert
    const totalBayar = totalEl.innerText;

    Swal.fire({
        title: 'Konfirmasi Pesanan',
        text: `Total yang harus dibayar adalah ${totalBayar}. Lanjutkan pembayaran?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#78350f', // Warna Amber-900 sesuai tema
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Bayar Sekarang!',
        cancelButtonText: 'Batal',
        background: '#fffbeb', // Background agak krem
        backdrop: `
            rgba(0,0,0,0.4)
            left top
            no-repeat
        `
    }).then((result) => {
        if (result.isConfirmed) {
            // Simulasi Loading
            let timerInterval;
            Swal.fire({
                title: 'Memproses Pembayaran...',
                html: 'Mohon tunggu sebentar.',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                // Alert Sukses
                if (result.dismiss === Swal.DismissReason.timer) {
                    Swal.fire({
                        title: 'Pembayaran Berhasil!',
                        text: 'Terima kasih telah berbelanja di Caveokka. Pesanan Anda sedang disiapkan.',
                        icon: 'success',
                        confirmButtonColor: '#78350f',
                        confirmButtonText: 'Kembali ke Menu Utama'
                    }).then(() => {
                        // 4. Reset Keranjang setelah bayar
                        localStorage.removeItem(CART_KEY);
                        // Redirect ke index.html
                        window.location.href = '../index.html';
                    });
                }
            });
        }
    });
});