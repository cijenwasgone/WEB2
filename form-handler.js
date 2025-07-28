
document.addEventListener('DOMContentLoaded', function() {

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
     * Mencegah pengiriman formulir default dan memanggil fungsi untuk menampilkan output.
     */
    form.addEventListener('submit', function(event) {
        // Mencegah halaman me-refresh saat form disubmit
        event.preventDefault(); 
        
        // Memanggil fungsi untuk memvalidasi, memproses, dan menampilkan data
        if (validateAndDisplaySummary()) {
            // Jika validasi berhasil, tampilkan modal
            modal.style.display = 'block';
        }
    });

    /**
     * Fungsi untuk memvalidasi input, mengumpulkan data, dan menampilkannya.
     * @returns {boolean} - Mengembalikan true jika valid, false jika tidak.
     */
    function validateAndDisplaySummary() {
        // Hapus pesan error lama jika ada
        const oldError = form.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }

        // Mengumpulkan nilai dari setiap input
        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();
        const telepon = document.getElementById('telepon').value.trim();
        const paket = document.getElementById('paket').value;

        // Validasi input
        if (!nama || !email || !telepon || !paket) {
            // Jika ada yang kosong, tampilkan pesan error di atas tombol
            const errorMessage = "Harap isi semua kolom yang wajib diisi (Nama, Email, Telepon, dan Paket).";
            displayError(errorMessage);
            return false; // Hentikan proses
        }
        
        // Mengumpulkan layanan yang dipilih (checkboxes)
        const layananCheckboxes = document.querySelectorAll('input[name="layanan"]:checked');
        let layananTerpilih = [];
        layananCheckboxes.forEach(function(checkbox) {
            layananTerpilih.push(checkbox.value);
        });
        const layananText = layananTerpilih.length > 0 ? layananTerpilih.join(', ') : 'Tidak ada layanan yang dipilih';

        // Mengumpulkan gaya yang dipilih (radio button)
        const gayaRadio = document.querySelector('input[name="gaya"]:checked');
        const gaya = gayaRadio ? gayaRadio.value : 'Tidak ada gaya yang dipilih';
        
        const deskripsi = document.getElementById('deskripsi').value.trim() || 'Tidak ada deskripsi tambahan.';

        // Membuat konten HTML untuk ditampilkan di modal
        const summaryHTML = `
            <p><strong>Nama Lengkap:</strong> ${nama}</p>
            <p><strong>Alamat Email:</strong> ${email}</p>
            <p><strong>Nomor Telepon:</strong> ${telepon}</p>
            <hr>
            <p><strong>Layanan yang Dipilih:</strong> ${layananText}</p>
            <p><strong>Paket:</strong> ${paket}</p>
            <p><strong>Preferensi Gaya:</strong> ${gaya}</p>
            <hr>
            <p><strong>Deskripsi Kebutuhan:</strong></p>
            <p>${deskripsi}</p>
            <br>
            <p style="text-align:center; font-style:italic;">Terima kasih telah melakukan pemesanan. Tim kami akan segera menghubungi Anda!</p>
        `;

        // Memasukkan konten HTML ke dalam modal
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

        // Masukkan pesan error sebelum tombol form
        const formButtons = form.querySelector('.form-buttons');
        form.insertBefore(errorDiv, formButtons);
    }

    /**
     * Menambahkan event listener ke tombol tutup (X) pada modal.
     * Saat diklik, modal akan disembunyikan.
     */
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    /**
     * Menambahkan event listener pada area window.
     * Jika pengguna mengklik di luar area modal, modal akan tertutup.
     */
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

});
