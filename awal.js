let pilihanPlatform = null;

const btnRakit = document.getElementById("btnRakit");
const modal = document.getElementById("platformModal");

const btnIntel = document.getElementById("intel");
const btnAmd = document.getElementById("amd");
const btnLanjut = document.getElementById("lanjut");
const closePlatform = document.getElementById("closePlatform");

// ===== Popup Titik Tiga =====
const popup = document.getElementById("popupWindowNew");
const menuDot = document.querySelector(".menu-dot-new");

function toggleWindowNew() {
  if (!popup) return;

  if (popup.classList.contains("show")) {
    popup.classList.remove("show");
    popup.classList.add("hide");
    setTimeout(() => popup.style.display = "none", 300);
  } else {
    popup.style.display = "block";
    setTimeout(() => {
      popup.classList.remove("hide");
      popup.classList.add("show");
    }, 10);
  }
}

// ===== Modal platform =====
const box = document.querySelector(".platform-box");

btnRakit.onclick = () => {
  modal.style.display = "flex";
};

// klik luar modal
modal.addEventListener("click", (e) => {
  if (!box.contains(e.target)) {
    modal.style.display = "none";
    pilihanPlatform = null;
    btnIntel.classList.remove("active");
    btnAmd.classList.remove("active");
  }
});

box.addEventListener("click", e => e.stopPropagation());

// ===== Auto close popup titik tiga =====
document.addEventListener("click", (e) => {
  if (!popup || !menuDot) return;

  if (
    popup.style.display === "block" &&
    !popup.contains(e.target) &&
    e.target !== menuDot
  ) {
    popup.classList.remove("show");
    popup.classList.add("hide");
    setTimeout(() => popup.style.display = "none", 300);
  }
});

popup.addEventListener("click", e => e.stopPropagation());

const overlay = document.getElementById("popupOverlay");
const popupText = document.getElementById("popupText");

function openPopup(type) {
  let content = "";

if (type === "info") {
  content = `
<div 
  <h2 style="text-align:center;margin-bottom:15px;color:#333;">Info Web & Disclaimer</h2>

  <p>
    Website ini dibuat untuk mempermudah perencanaan dan simulasi <b>rakit PC</b>
    bagi pengguna di Indonesia.
  </p>

  <p>
    Website ini <b>masih dalam tahap pengembangan</b>, sehingga kemungkinan
    terdapat kesalahan kecil pada data, spesifikasi, atau informasi yang ditampilkan.
  </p>

  <p>
    Data komponen dan spesifikasi disusun serta difilter secara otomatis
    berdasarkan sumber yang tersedia. Harga dan ketersediaan produk mengikuti
    kondisi pasar Indonesia dan dapat berubah sewaktu-waktu.
  </p>

  <p>
    Link pembelian produk yang ditampilkan didukung oleh 
    <a href="https://shopee.co.id" target="_blank">Shopee Indonesia</a>
    untuk memudahkan pengguna mencari produk terkait.
    Harga yang tertera belum termasuk ongkir atau pajak yang berlaku.
  </p>

  <p>
    Website ini <b>bukan pengganti konsultasi teknisi profesional</b>.
    Untuk meminimalisir kesalahan, pengguna tetap disarankan
    melakukan pengecekan ulang atau berkonsultasi dengan ahli.
  </p>

  <p>
    Data yang dimasukkan pengguna hanya disimpan secara lokal di perangkat
    dan tidak dikirim ke server pihak ketiga.
  </p>

  <p>
    Untuk pertanyaan, saran, atau laporan bug, silakan hubungi admin melalui
    <a href="https://www.tiktok.com/@alif_setiawan2?_r=1&_t=ZS-93GuhcNj9eu">DM Tik Tok</a>.
  </p>
</div>
  `;
}

if (type === "bug") {
  content = `
    <h2 class="popup-title">Masukan & Bug</h2>

    <p>
      Website ini masih dalam tahap pengembangan.
      Masukan dan laporan bug sangat membantu
      untuk perbaikan ke depannya.
    </p>

    <p>
      Silakan masukan saran atau laporkan bug dan kesalahan data melalui:
    </p>

    <ul>
      <li>
        <a href="https://www.tiktok.com/@alif_setiawan2?_r=1&_t=ZS-93GuhcNj9eu" target="_blank">
          DM TikTok
        </a>
      </li>
    </ul>
  `;
}

  if (type === "infopengembangan") {
    content = `
      <h2>Cara Pakai</h2>
      <p>update web selanjutnya:.</p>
      <p>-memininalisir kesalahan data.</p>
      <p>-upgrade logic total watt pada part part pc.</p>
      <p>-menambah jumlah part pc yg kurang dengan spesifikasi akurat.</p>
      <p>-menerbitkan web menjadi aplikasi offline di play store.</p>
      <p>-melanjutkan projek simulasi 3d dan fitur pelajari komputer.</p>
    `;
  }

if (type === "about") {
  content = `
    <h2 class="popup-title">Tentang Website</h2>

    <p>
      Website ini dikembangkan oleh seorang siswa SMK
      ,jurusan bagian teknik mechanical engineering.    </p>

    <p>
      "sebenernya gua bikin web ini karna gabut aja sih,trus penasaran juga dengan diri gua sendiri,bakal sejauh apa sih kemampuan gua klo di asah,gua ga merasa diri sendiri paling benar atau paling ngerti dalam hal coding,gua masih pemula,dan banyak yg ga gua ngerti,gua harap web yg gua buat ini bisa memudahkan para user dalam melakukan rakit pc,mencari cari part pc dengan mudah,apalagi teruntuk orang awam".
    </p>

    <p>
      Proses pembuatan website ini dibantu oleh
      <b>AI</b> .
    </p>

    <p>
      Seluruh pengembangan dilakukan menggunakan
      perangkat <b>Samsung Galaxy A05</b>,
      tanpa bantuan komputer atau laptop.
    </p>

    <p>
      Website ini diharapkan dapat membantu pengguna,
      khususnya pemula, dalam memahami proses perencanaan
      perakitan PC secara lebih terarah.
    </p>
  `;
}

  popupText.innerHTML = content;
  overlay.style.display = "flex"; // PENTING
}

function closePopup() {
  overlay.style.display = "none";
}

// ===== Pilih platform =====
btnIntel.onclick = () => {
  pilihanPlatform = "intel";
  localStorage.setItem("platform", "intel");
  btnIntel.classList.add("active");
  btnAmd.classList.remove("active");
};

btnAmd.onclick = () => {
  pilihanPlatform = "amd";
  localStorage.setItem("platform", "amd");
  btnAmd.classList.add("active");
  btnIntel.classList.remove("active");
};

btnLanjut.onclick = () => {
  if (!pilihanPlatform) {
    alert("Pilih Intel atau AMD dulu");
    return;
  }
  window.location.href = "rakit.html";
};

document.addEventListener("DOMContentLoaded", () => {
  const menuPopupOverlay = document.getElementById("menuPopupOverlay");
  const menuPopupContent = document.getElementById("menuPopupContent");

  window.openMenuPopup = function(type) {
    let html = "";

    if (type === "belajar") {
      html = `
        <h3>Pelajari Tentang Komputer</h3>
        <p>Fitur pembelajaran komputer masih dalam tahap pengembangan.</p>
        <p>Kedepan nya,user yg lebih awam dan tidak paham dengan alur rakit pc,bisa belajar terlebih dahulu disini,masih tahap pengembangan,jadi tunggu update kelanjutan nya aja.</p>
      `;
    }

    if (type === "simulasi") {
      html = `
        <h3>Simulasi 3D</h3>
        <p>Simulasi 3D belum tersedia dan akan hadir di update selanjutnya.</p>
        <p>Rencana nya ini web bakal bisa ngerakit pc versi simulasi 3d, user bakal bisa memakai fitur ini dengan gratis,dengan visual sederhana dan efek suara yg oke.</p>
      `;
    }

    menuPopupContent.innerHTML = html;
    menuPopupOverlay.style.display = "flex";
  }

  menuPopupOverlay.addEventListener("click", (e) => {
    if (e.target === menuPopupOverlay) {
      menuPopupOverlay.style.display = "none";
    }
  });
});