/**
 * Menunggu hingga seluruh konten halaman (DOM) selesai dimuat
 * sebelum menjalankan skrip.
 */
document.addEventListener('DOMContentLoaded', function() {

    // Mendefinisikan harga untuk setiap layanan dan paket
    const prices = {
        layanan: {
            'Desain Logo': 500000,
            'Desain Brosur': 300000,
            'Desain Tipografi': 75000,
            'Lainnya': 0 // Harga untuk 'Lainnya' bisa disesuaikan atau memerlukan konsultasi
        },
        paket: {
            'Basic': 100000,
            'Premium': 250000,
            'Custom': 0 // Paket custom memerlukan diskusi lebih lanjut
        }
    };

    // Mendapatkan elemen-elemen penting dari DOM
    const form = document.getElementById('orderForm');
    const modal = document.getElementById('outputModal');
    const closeButton = document.querySelector('.close-button');
    const outputContent = document.getElementById('output-content');

    // Periksa apakah semua elemen penting ditemukan sebelum melanjutkan
    if (!form || !modal || !closeButton || !outputContent) {
        console.error("Elemen formulir atau modal tidak ditemukan. Pastikan ID elemen di file HTML sudah benar dan sesuai.");
        return; // Hentikan eksekusi jika ada elemen yang hilang
    }

    /**
     * Menambahkan event listener untuk event 'submit' pada formulir.
     */
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        if (validateAndDisplaySummary()) {
            modal.style.display = 'block';
        }
    });

    /**
     * Fungsi untuk memvalidasi input, menghitung harga, dan menampilkannya.
     * @returns {boolean} - Mengembalikan true jika valid, false jika tidak.
     */
    function validateAndDisplaySummary() {
        const oldError = form.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }

        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();
        const telepon = document.getElementById('telepon').value.trim();
        const paketValue = document.getElementById('paket').value;

        if (!nama || !email || !telepon || !paketValue) {
            const errorMessage = "Harap isi semua kolom yang wajib diisi (Nama, Email, Telepon, dan Paket).";
            displayError(errorMessage);
            return false;
        }
        
        // --- Mulai Kalkulasi Harga ---
        let totalPrice = 0;
        
        // Kalkulasi dari layanan yang dipilih (checkboxes)
        const layananCheckboxes = document.querySelectorAll('input[name="layanan"]:checked');
        let layananTerpilih = [];
        layananCheckboxes.forEach(function(checkbox) {
            layananTerpilih.push(checkbox.value);
            totalPrice += prices.layanan[checkbox.value] || 0;
        });
        const layananText = layananTerpilih.length > 0 ? layananTerpilih.join(', ') : 'Tidak ada layanan yang dipilih';

        // Kalkulasi dari paket yang dipilih
        totalPrice += prices.paket[paketValue] || 0;
        
        // Format harga ke format Rupiah
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(totalPrice);
        // --- Akhir Kalkulasi Harga ---

        const gayaRadio = document.querySelector('input[name="gaya"]:checked');
        const gaya = gayaRadio ? gayaRadio.value : 'Tidak ada gaya yang dipilih';
        
        const deskripsi = document.getElementById('deskripsi').value.trim() || 'Tidak ada deskripsi tambahan.';

        // Membuat konten HTML untuk ditampilkan di modal, termasuk harga
        const summaryHTML = `
            <p><strong>Nama Lengkap:</strong> ${nama}</p>
            <p><strong>Alamat Email:</strong> ${email}</p>
            <p><strong>Nomor Telepon:</strong> ${telepon}</p>
            <hr>
            <p><strong>Layanan yang Dipilih:</strong> ${layananText}</p>
            <p><strong>Paket:</strong> ${paketValue}</p>
            <p><strong>Preferensi Gaya:</strong> ${gaya}</p>
            <hr>
            <h3 style="text-align:center; margin-bottom: 10px;">Estimasi Biaya: ${formattedPrice}</h3>
            ${paketValue === 'Custom' || layananTerpilih.includes('Lainnya') ? '<p style="text-align:center; font-size:0.9em; color:#757575;"><i>(Harga untuk item Custom/Lainnya akan dikonfirmasi via konsultasi)</i></p>' : ''}
            <hr>
            <p><strong>Deskripsi Kebutuhan:</strong></p>
            <p>${deskripsi}</p>
            <br>
            <p style="text-align:center; font-style:italic;">Terima kasih telah melakukan pemesanan. Tim kami akan segera menghubungi Anda!</p>
        `;

        outputContent.innerHTML = summaryHTML;
        return true; // Validasi berhasil
    }

    /**
     * Fungsi untuk menampilkan pesan error di dalam formulir.
     * @param {string} message - Pesan error yang akan ditampilkan.
     */
    function displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.backgroundColor = '#f8d7da';
        errorDiv.style.border = '1px solid #f5c6cb';
        errorDiv.style.padding = '10px';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.marginBottom = '1rem';
        errorDiv.textContent = message;

        const formButtons = form.querySelector('.form-buttons');
        form.insertBefore(errorDiv, formButtons);
    }

    /**
     * Menambahkan event listener ke tombol tutup (X) pada modal.
     */
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    /**
     * Menambahkan event listener pada area window agar bisa menutup modal.
     */
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

});
