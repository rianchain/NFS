document.getElementById('shopping-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Mengambil nilai input
    const item = document.getElementById('item').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    // Cek input 
    if (!item || !price || !quantity ) {
        alert('semua input harus di isi!');
        return;
    }

    if (isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
        alert('Masukkan angka yang valid untuk harga dan jumlah yang lebih besar dari 0.');
        return;
    }

    // Menambahkan baris ke tabel
    addItemToList(item, price, quantity);

    // Menyimpan ke localStorage
    saveToLocalStorage(item, price, quantity);

    // Menghitung ulang total harga
    updateTotalPrice();
});

// Fungai untuk menyimpan item ke localStorage di browser device
function saveToLocalStorage(item, price, quantity) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    console.log('Data sebelum disimpan:', shoppingList);
    shoppingList.push({ item, price, quantity });
    console.log('Data setelah disimpan:', shoppingList);
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

// Keyboard shortcut
// document.getElementById("myInput").addEventListener("keydown", function(event) {
//     if (event.key === "Enter") {
//       // Mencegah default behavior
//       event.preventDefault();
//       // Panggil fungsi atau klik button
//       document.getElementById("myButton").click();
//     }
//   });

  // Fungsi untuk menambahkan item ke dalam tabel
function addItemToList(item, price, quantity) {
    const table = document.getElementById('shopping-list').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    
    const cellItem = row.insertCell(0);
    const cellPrice = row.insertCell(1);
    const cellQuantity = row.insertCell(2);
    const cellTotal = row.insertCell(3);
    const cellAction = row.insertCell(4);

    // Mengisi data ke baris
    cellItem.textContent = item;
    cellPrice.textContent = price.toFixed(2);
    cellQuantity.textContent = quantity;
    cellTotal.textContent = (price * quantity).toFixed(2);

    // Tombol hapus
    const deleteButton = document.createElement('button');
    const icon = document.createElement('i');
    icon.className = 'bi bi-trash-fill'; 
    icon.style.color = 'black'
    icon.style.fontSize = '1.5rem';
    icon.style.alignItems = 'center'
    // deleteButton.textContent = 'Hapus';
    deleteButton.onclick = function() {
        table.deleteRow(row.rowIndex - 1);
        removeFromLocalStorage(item);
        updateTotalPrice();
    };
    deleteButton.style.width = '100%';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '2px';
    deleteButton.style.backgroundColor = 'transparent'; // Contoh warna latar belakang
    deleteButton.style.color = '#fff'; // Warna teks
    deleteButton.style.fontSize = '0.9rem'; // Ukuran font, sesuaikan jika perlu
    deleteButton.style.textAlign = 'center'; // Menyelaraskan teks di tengah
    deleteButton.style.padding = '8px 0'; // Ruang di sekitar teks, sesuaikan jika perlu
    deleteButton.style.boxSizing = 'border-box'; // Agar padding dan border tidak mempengaruhi ukuran total
    deleteButton.style.overflow = 'hidden'; // Menghindari overflow teks
    deleteButton.style.whiteSpace = 'nowrap'; // Menghindari teks terputus ke baris berikutnya
    deleteButton.style.textOverflow = 'ellipsis';
    deleteButton.appendChild(icon);
    cellAction.appendChild(deleteButton);
}

// Fungsi untuk menghitung ulang total harga
function updateTotalPrice() {
    const table = document.getElementById('shopping-list').getElementsByTagName('tbody')[0];
    let totalPrice = 0;

    // Menghitung total dari setiap baris
    for (let row of table.rows) {
        const total = parseFloat(row.cells[3].textContent);
        totalPrice += total;
    }

    // Update total harga di halaman
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

// Fungsi untuk menghapus item dari localStorage
function removeFromLocalStorage(item) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList = shoppingList.filter(entry => entry.item !== item);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Fungsi untuk memuat daftar dari localStorage saat halaman di muat
function loadFromLocalStorage() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList.forEach(entry => {
        addItemToList(entry.item, entry.price, entry.quantity);
    });
    updateTotalPrice();
}

// Fungsi nya untuk memanggil fungsi yang memuat data dari device browser pada saat pertama kali di buka
window.onload = function() {
    loadFromLocalStorage();
}