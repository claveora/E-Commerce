Caveokka E-Commerce (Web Penjualan Kopi Premium)
==================================================

[GitHub license: MIT] | [Language: HTML5] | [Framework: Tailwind CSS] | [Language: JavaScript]

Deskripsi:
----------
Caveokka adalah situs web E-Commerce sederhana, cepat, dan responsif yang dibangun menggunakan Vanilla JavaScript dan Tailwind CSS. Web ini berfokus pada pengalaman pengguna yang lancar dalam menelusuri produk kopi premium, menambahkan ke keranjang, dan menyelesaikan proses checkout (simulasi).

✨ Fitur Utama
--------------
Proyek ini mencakup fungsionalitas inti sebuah situs belanja single-page (SPA) dengan fitur simulasi transaksi:

* Pencatatan Keranjang (Cart Persistence): Menggunakan localStorage untuk menyimpan data keranjang, memastikan item tetap tersimpan saat navigasi antar halaman (index.html dan nota.html).
* Simulasi Transaksi: Menampilkan detail pesanan dan memproses simulasi pembayaran dengan konfirmasi visual menggunakan SweetAlert2.
* Filter Produk: Menyaring daftar produk berdasarkan kategori.
* Tampilan Responsif (Mobile-First): Desain yang optimal untuk perangkat seluler dan desktop (dengan menu hamburger yang berfungsi penuh).
* Efek Scroll & Animasi: Efek sticky navbar, animasi fade-in saat scroll, dan slider testimonial otomatis.
* Rincian Produk Interaktif: Penggunaan Modal Box untuk menampilkan deskripsi dan detail produk.

🚀 Teknologi yang Digunakan
--------------------------
Proyek ini murni menggunakan frontend stack untuk simulasi web aplikasi.

| Teknologi                   | Keterangan                                                              |
|-----------------------------|-------------------------------------------------------------------------|
| HTML 5                      | Struktur dasar halaman web.                                             |
| Tailwind CSS                | Kerangka kerja CSS utility-first untuk desain yang cepat dan responsif. |
| JavaScript (Vanilla)        | Logika bisnis, manipulasi DOM, manajemen keranjang, dan interaksi pengguna. |
| SweetAlert2                 | Library JavaScript untuk notifikasi dan alert yang menarik.             |
| Intersection Observer API   | Digunakan untuk memicu animasi saat elemen terlihat di layar.           |

---------------------------------------------------------------------------------

💻 Panduan Instalasi (Development)
---------------------------------
Karena proyek ini tidak memerlukan backend atau database, instalasinya sangat mudah.

### Prasyarat
Anda hanya memerlukan browser web modern (seperti Chrome, Firefox, atau Edge).

### Langkah-langkah Instalasi
1.  **Clone Repositori:** Buka terminal atau Command Prompt Anda dan jalankan perintah berikut:
    ```
    git clone [https://github.com/claveora/E-Commerce.git](https://github.com/claveora/E-Commerce.git)
    ```

2.  **Masuk ke Direktori Proyek:**
    ```
    cd E-Commerce
    ```

3.  **Jalankan Aplikasi:**
    * Cukup buka file **index.html** di browser Anda.
    * (Disarankan): Gunakan ekstensi Live Server di VS Code atau sejenisnya untuk menjalankan proyek di server lokal.

📁 Struktur Proyek
------------------
E-Commerce/
├── index.html # Halaman utama (Home & Katalog Produk)
├── Script.js # Logika JavaScript utama (Cart, Modal, Filter) 
├── Pembayaran/ # Folder berisi halaman checkout 
    │ ├── nota.html # Halaman nota/keranjang/checkout 
    │ └── nota.js # Logika spesifik untuk halaman nota 
├── Image/ # Folder aset gambar (Logo, Produk, dll.) 

---------------------------------------------------------------------------------

🤝 Kontribusi
--------------
Kontribusi sangat dihargai! Jika Anda memiliki saran atau menemukan bug, silakan:

1.  Fork repositori ini.
2.  Buat branch baru (git checkout -b feature/nama-fitur).
3.  Lakukan perubahan dan commit (git commit -m 'feat: Tambahkan fitur baru X').
4.  Push ke branch Anda (git push origin feature/nama-fitur).
5.  Buka **Pull Request** ke branch main.

📜 Lisensi
----------
Silahkan di modif secara bebas.

---------------------------------------------------------------------------------

Dibuat oleh [ClaveoraDev]
© 2025 Caveokka
