document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const buildData = params.get("build");

  let data = null;

  if (buildData) {
    data = JSON.parse(decodeURIComponent(buildData));
  } else {
    data = JSON.parse(localStorage.getItem("buildPC"));
  }

  if (!data) return;

  const container = document.getElementById("buildContainer");
  let total = 0;



Object.entries(data).forEach(([key, item]) => {
  if (!item) return;

  // ✅ KHUSUS SOCKET (TEXT ONLY)
  if (key === "socket") {
    const div = document.createElement("div");
    div.className = "build-item";
    div.innerHTML = `
      <div class="info">
        <h3>Socket yang dipilih</h3>
        <p><b>${item.name}</b></p>
      </div>
    `;
    container.appendChild(div);
    return;
  }
  
  // ✅ KHUSUS MOTHERBOARD
if (key === "motherboard") {

  const harga = item.prices[0].price;
  total += harga;

  const div = document.createElement("div");
  div.className = "build-item";
  div.innerHTML = `
    <img src="motherboard2d.png">
    <div class="info">
      <h3>${item.name}</h3>
      <p>${item.socket} • ${item.chipset} • ${item.ddr}</p>
      <p>Max RAM : ${item.maxRam}GB • Slot : ${item.slotRam}</p>
      <b>Rp ${harga.toLocaleString("id-ID")}</b>
            <a href="${item.link}" target="_blank">Lihat Produk</a>
    </div>
  `;

  container.appendChild(div);
  return;
}
  
  // ✅ KHUSUS RAM
if (key === "ram") {

  const harga = item.price;
total += harga;

  const div = document.createElement("div");
  div.className = "build-item";
  div.innerHTML = `
    <img src="ram2d.jpg">
    <div class="info">
      <h3>${item.name}</h3>
      <p>${item.type} • ${item.speed} • ${item.capacity}</p>
      <p>Jumlah : ${item.qty} pcs</p>
      <b>Rp ${harga.toLocaleString("id-ID")}</b>
            <a href="${item.link}" target="_blank">Lihat Produk</a>
    </div>
  `;
  container.appendChild(div);
  return;
}

// ✅ KHUSUS GPU
if (key === "gpu") {

  const harga = item.prices[0].price;
  total += harga;

  const div = document.createElement("div");
  div.className = "build-item";
  div.innerHTML = `
    <img src="gpu2d.jpg">
    <div class="info">
      <h3>${item.name}</h3>
      <p>vram: ${item.vram}</p>
      <p>estimasi daya: ${item.power}</p>
      <b>Rp ${harga.toLocaleString("id-ID")}</b>
      <br>
      <a href="${item.link}" target="_blank">Lihat Produk</a>
    </div>
  `;

  container.appendChild(div);
  return;
}
  

  
  // ✅ KHUSUS HDD
if (key === "hdd") {

  // kalau HDD lu single object
  const harga = item.price;
  total += harga;

  const div = document.createElement("div");
  div.className = "build-item";
  div.innerHTML = `
    <img src="hdd2d.jpg">
    <div class="info">
      <h3>${item.name}</h3>
      <p>${item.spec}</p>
      <p>Jumlah : ${item.qty} pcs</p>
      <b>Rp ${harga.toLocaleString("id-ID")}</b>
            <a href="${item.link}" target="_blank">Lihat Produk</a>
    </div>
  `;
  container.appendChild(div);
  return;
}





  // ⬇️ PART LAIN (TETAP KAYA SEBELUMNYA)
  const harga = item.prices?.[0]?.price
    ? item.prices[0].price
    : parseInt(
        String(item.price || item.harga || "0").replace(/[^0-9]/g, "")
      );

  total += harga;

  const div = document.createElement("div");
  div.className = "build-item";
  div.innerHTML = `
    <img src="${item.image || item.img || ''}">
    <div class="info">
      <h3>${item.name || key}</h3>
      <p>${item.spec || item.vram || item.capacity || ''}</p>
      <b>Rp ${harga.toLocaleString("id-ID")}</b>
            <a href="${item.link}" target="_blank">Lihat Produk</a>
    </div>
  `;

  container.appendChild(div);
});

  document.getElementById("totalHarga").innerText =
    "Rp " + total.toLocaleString("id-ID");
    
const btnSave = document.getElementById("btnSave");

if (btnSave) {
  btnSave.onclick = function () {

    const build = localStorage.getItem("buildPC");

    if (!build) {
      alert("Belum ada build!");
      return;
    }

    const encoded = encodeURIComponent(build);

    // Copy link ke clipboard
    const link = window.location.origin + "/total.html?build=" + encoded;

    navigator.clipboard.writeText(link).then(() => {
      alert("Link berhasil disalin");
    }).catch(() => {
      alert("Gagal menyalin link.");
    });

  };
}
});