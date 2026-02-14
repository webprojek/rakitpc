/* ===============================
   PLATFORM
================================ */
const platform = localStorage.getItem("platform") || "AMD";



function saveBuild() {
  const data = {
    socket: socketDipilih || null,
    processor: processorDipilih || null,
    motherboard: motherboardDipilih || null,
    cpuCooler: cpuCoolerDipilih || null,
    ram: ramDipilih || null,
    gpu: gpuDipilih || null,

    // ✅ TAMBAH INI
    ssdNVMe: ssdNVMeDipilih || null,
    ssdSATA: ssdSATADipilih || null,

    hdd: hddDipilih || null,
    psu: psuDipilih || null,
    casing: casingDipilih || null
  };

  localStorage.setItem("buildPC", JSON.stringify(data));
  console.log("Build disimpan:", data);
}
/* ===============================
   STATE
================================ */
let socketDipilih = null;
let processorDipilih = null;
let motherboardDipilih = null;
let cpuCoolerDipilih = null;
let ramDipilih = null;
let gpuDipilih = null;
let ssdNVMeDipilih = null;   // SSD NVMe
let ssdSATADipilih = null;   // SSD SATA
let hddDipilih = null;
let psuDipilih = null;
let casingDipilih = null;

/* ===============================
   ELEMENTS
================================ */
const socketItem = document.getElementById("socketItem");
const processorItem = document.getElementById("processorItem");
const motherboardItem = document.getElementById("motherboardItem");
const cpucoolerItem = document.getElementById("cpucoolerItem");
const ramItem = document.getElementById("ramItem");
const gpuItem = document.getElementById("gpuItem");
const ssdnvmeItem = document.getElementById("ssdnvmeItem");
const ssdsataItem = document.getElementById("ssdsataItem");
const hardiskItem = document.getElementById("hddItem");
const psuItem = document.getElementById("psuItem")
const casingItem = document.getElementById("casingItem");

const modal = document.getElementById("socketModal");
const optionsBox = document.getElementById("socketOptions");
const btnTutup = document.getElementById("btnTutup");



/* ===============================
   MODAL CLOSE
================================ */


function normalizeSocket(sock) {
  return sock.trim().toUpperCase();
}

/* ===============================
   SOCKET PICK
================================ */
socketItem.onclick = () => {
optionsBox.innerHTML = `
  <h3>Pilih Socket</h3>
  <small class="socket-note">
    Pastikan socket cocok dengan CPU pilihan Anda.
  </small>
`;

  // 🔑 ambil socket sesuai platform
  const socketList = SOCKET_DATA[platform.toLowerCase()];

  if (!socketList) {
    alert("Platform tidak valid");
    return;
  }

  socketList.forEach(sock => {
  const btn = document.createElement("button");
  btn.className = "option-btn socket";
  
  btn.innerHTML = `
    <b>${sock.name}</b><br>
    <small class="spec">${sock.desc}</small>
  `;

btn.onclick = () => {
  socketDipilih = sock;

  // ✅ FIX DI SINI
  socketItem.innerText = "SOCKET : " + sock.name;

  // reset downstream
  processorDipilih = null;
  motherboardDipilih = null;
  ramDipilih = null;

  processorItem.innerText = "PROCESSOR :";
  motherboardItem.innerText = "MOTHERBOARD :";
  ramItem.innerText = "RAM :";
  gpuItem.innerText = "GPU :";
  ssdnvmeItem.innerText = "SSD NVMe :";
  ssdsataItem.innerText = "SSD SATA :";
  casingItem.innerText = "CASING :";

  modal.style.display = "none";
};

    optionsBox.appendChild(btn);
  });

  modal.style.display = "flex";
modal.classList.add("show");
};
/* ===============================
   PROCESSOR PICK
================================ */

processorItem.onclick = () => {
  if (!socketDipilih) {
    alert("Pilih socket dulu");
    return;
  }

  optionsBox.innerHTML = "<h3>Pilih Processor</h3>";

  let listCPU = [];

  if (DATA_CPU_AMD[socketDipilih.name]) {
    listCPU = DATA_CPU_AMD[socketDipilih.name];
  } else if (DATA_CPU_INTEL[socketDipilih.name]) {
    listCPU = DATA_CPU_INTEL[socketDipilih.name];
  }

  if (!Array.isArray(listCPU) || listCPU.length === 0) {
    optionsBox.innerHTML += "<p>Processor tidak tersedia</p>";
    modal.style.display = "flex";
    modal.classList.add("show");
    return;
  }

  listCPU.forEach(cpu => {
    const card = document.createElement("div");
    card.className = "option-btn processor";

    // default harga = harga pertama
if (!Array.isArray(cpu.prices) || cpu.prices.length === 0) {
  return; // skip cpu yang datanya rusak
}
let selectedPrice = cpu.prices[0];

card.innerHTML = `
  <div class="option-row">
    <img src="${cpu.img}" class="option-img">
    <div class="option-text">
      <strong>${cpu.name}</strong><br>
      <small style="white-space:pre-line">${cpu.spec}</small>
    </div>
  </div>

  <div class="price">
    <div class="price-label">Pilih harga :</div>

    <select class="price-select">
      ${cpu.prices.map((p, i) => `
        <option value="${i}">
          ${p.store} - Rp ${p.price.toLocaleString("id-ID")}
        </option>
      `).join("")}
    </select>

    <a class="buy-link" href="${selectedPrice.link}" target="_blank">
      Link produk
    </a>
  </div>
`;

    const priceSelect = card.querySelector(".price-select");
    const buyLink = card.querySelector(".buy-link");

    priceSelect.onchange = () => {
      selectedPrice = cpu.prices[priceSelect.value];
      buyLink.href = selectedPrice.link;
    };

    card.onclick = (e) => {
      if (e.target.tagName === "SELECT" || e.target.tagName === "A") return;

      processorDipilih = {
  name: cpu.name,
  img: cpu.img,
  spec: cpu.spec,
  tdp: cpu.tdp, // 🔥 WAJIB TAMBAH INI
  store: selectedPrice.store,
  price: selectedPrice.price,
  link: selectedPrice.link
};
      
       saveBuild();

      processorItem.innerHTML = `
        <img src="${cpu.img}" class="selected-img">
        <div>
          <strong>${cpu.name}</strong><br>
          <small>${selectedPrice.store} • Rp ${selectedPrice.price.toLocaleString("id-ID")}</small>
          
    <a class="buy-link" href="${selectedPrice.link}" target="_blank">
      Link produk
    </a>
        </div>
      `;

      modal.classList.remove("show");
      setTimeout(() => modal.style.display = "none", 300);
    };

    optionsBox.appendChild(card);
  });

  modal.style.display = "flex";
  modal.classList.add("show");
};

motherboardItem.onclick = () => {
  if (!socketDipilih || !socketDipilih.name) {
    alert("Pilih socket dulu");
    return;
  }

  // RESET MODAL
  optionsBox.innerHTML = "";
  modal.classList.remove("show");
  optionsBox.innerHTML =`
<h3>Pilih Motherboard</h3>
<p class="gpu-warning">
  Halo para pencinta rakit PC. Meskipun menggunakan socket yang sama,
  tidak semua motherboard kompatibel. Perbedaan dapat terjadi karena chipset,
  generasi CPU, atau dukungan BIOS. Data kompatibilitas akan disempurnakan pada
  pembaruan berikutnya. Untuk kepastian, silakan konsultasikan dengan AI atau
  teknisi yang berpengalaman.
</p>`;

  const socketName = socketDipilih.name.trim().toUpperCase();

  // PILIH DATA BERDASARKAN SOCKET
const MOTHERBOARD_DATA =
  socketName.startsWith("AM") || socketName === "STR5" || socketName === "SWRX8"
    ? MOTHERBOARD_AMD
    : MOTHERBOARD_INTEL;

  // FILTER SOCKET (LOGIC LAMA)
  const list = MOTHERBOARD_DATA.filter(
    mb => mb.socket.toUpperCase() === socketName
  );

  if (list.length === 0) {
    optionsBox.innerHTML += `<p>Tidak ada motherboard untuk socket ${socketName}</p>`;
    modal.style.display = "flex";
    modal.classList.add("show");
    return;
  }

  // HELPER HARGA (SUPPORT prices[])
  const getPrice = mobo =>
    mobo.price ?? mobo.prices?.[0]?.price ?? 0;

  list.forEach(mobo => {
    const btn = document.createElement("button");
    btn.className = "option-btn motherboard";

    // LINK TOKO (AMBIL TOKO PERTAMA)
    const toko = mobo.prices && mobo.prices.length > 0
      ? `<a href="${mobo.prices[0].link}" target="_blank" class="store-link">
           Link produk
         </a>`
      : "";

    btn.innerHTML = `
      <div class="option-row">
        <img src="motherboard2d.png" class="option-img">
        <div class="option-text">
          <strong>${mobo.name}</strong><br>
          <small>
            Chipset : ${mobo.chipset}<br>
            DDR : ${mobo.ddr}<br>
            Max RAM : ${mobo.maxRam} GB<br>
            Slot RAM : ${mobo.slotRam} <br>
            Form Factor : ${mobo.formFactor}<br>
            Storage SSD : ${mobo.storageSsd}
          </small><br>
          <b>Rp ${getPrice(mobo).toLocaleString("id-ID")}</b><br>
          ${toko}
        </div>
      </div>
    `;

    btn.onclick = () => {
      // INJECT PRICE BIAR TOTAL AMAN
      motherboardDipilih = {
        ...mobo,
        price: getPrice(mobo)
      };

      saveBuild();

      motherboardItem.innerHTML = `
        <span class="label">MOTHERBOARD :</span>
        <div class="value">
          <img src="motherboard2d.png" class="selected-img">
          <div>
            <strong>${mobo.name}</strong><br>
            <small>Rp ${getPrice(mobo).toLocaleString("id-ID")}</small><br>
            ${toko}
          </div>
        </div>
      `;

      modal.classList.remove("show");
      setTimeout(() => modal.style.display = "none", 300);
    };

    optionsBox.appendChild(btn);
  });

  modal.style.display = "flex";
  modal.classList.add("show");
};

cpuCoolerItem.onclick = () => {
  optionsBox.innerHTML = "<h3>PILIH CPU COOLER</h3>";

  CPU_COOLER_DATA.forEach(cpuCooler => {
    const btn = document.createElement("button");
    btn.className = "option-btn";

    const priceData = cpuCooler.prices[0]; // ambil harga pertama

    btn.innerHTML = `
      <div class="option-row">
        <img src="cpucooler2d.jpg" class="option-img">
        <div class="option-text">
          <strong>${cpuCooler.name}</strong><br>
          <b>Rp ${priceData.price.toLocaleString("id-ID")}</b><br>
          <a href="${priceData.link}" target="_blank" class="detail-link">
            Link produk
          </a>
        </div>
      </div>
    `;

    btn.onclick = () => {
      cpuCoolerDipilih = cpuCooler;
      saveBuild();

      cpuCoolerItem.innerHTML = `
        <span class="label">CPU COOLER :</span>
        <div class="value">
          <img src="cpucooler2d.jpg" class="selected-img">
          <div>
            <strong>${cpuCooler.name}</strong><br>
              <small>
                ${(cpuCooler.spec || "").replace(/\n/g, "<br>")}
              </small><br>
            <b>Rp ${priceData.price.toLocaleString("id-ID")}</b>
          <a href="${priceData.link}" target="_blank" class="detail-link">
            Link produk
          </a>
          </div>
        </div>
      `;

      modal.style.display = "none";
      modal.classList.remove("show");
    };

    optionsBox.appendChild(btn);
  });

  modal.style.display = "flex";
  modal.classList.add("show");
};

/* ===============================
   RAM PICK (FIX FINAL)
================================ */
/* ===============================
   RAM PICK (LOGIC FIX FINAL)
================================ */
ramItem.onclick = () => {
  if (!motherboardDipilih) {
    alert("Pilih motherboard dulu");
    return;
  }

  openRAMModal();
};

function openRAMModal() {

  const ddrWajib = motherboardDipilih.ddr;
  optionsBox.innerHTML = `<h3>Pilih RAM (${ddrWajib})</h3>`;

  const ramFiltered = RAM_DATA.filter(ram => ram.type === ddrWajib);

  if (!ramFiltered.length) {
    optionsBox.innerHTML += `<p>RAM ${ddrWajib} tidak tersedia</p>`;
    showModal();
    return;
  }

  ramFiltered.forEach(ram => {

    const card = document.createElement("div");
    card.className = "option-btn ram";

    // 🔑 STATE (SAMA KAYA HDD)
    let qty = 1;
    let selectedPrice = {
      price: ram.price,
      link: ram.link,
      store: "Default"
    };

    card.innerHTML = `
      <div class="option-row">
        <img src="ram2d.jpg" class="option-img">
        <div class="option-text">
          <strong>${ram.name}</strong><br>
          <small style="white-space:pre-line">
TYPE : ${ram.type}
SPEED : ${ram.speed}
KAPASITAS : ${ram.capacity}
          </small>
          <b>Rp ${ram.price.toLocaleString("id-ID")}</b>
        </div>
      </div>

      <div class="price">
        <div class="price-label">Jumlah :</div>
        <select class="qty-select">
          <option value="1">1 pcs</option>
          <option value="2">2 pcs</option>
          <option value="4">4 pcs</option>
        </select>

        <a class="buy-link" href="${ram.link}" target="_blank">
          Link produk
        </a>
      </div>
    `;

    const qtySelect = card.querySelector(".qty-select");

    // 🔁 UPDATE JUMLAH
    qtySelect.onchange = () => {
      qty = Number(qtySelect.value);
    };

    // ❗ PILIH RAM
    card.onclick = (e) => {
      if (e.target.tagName === "SELECT" || e.target.tagName === "A") return;

      ramDipilih = {
        name: ram.name,
        type: ram.type,
        speed: ram.speed,
        capacity: ram.capacity,
        image: ram.image,

        qty: qty,
        unitPrice: selectedPrice.price,
        price: selectedPrice.price * qty,

        store: selectedPrice.store,
        link: selectedPrice.link
      };

      saveBuild();

      ramItem.innerHTML = `
        <span class="label">RAM :</span>
        <div class="value">
          <img src="ram2d.jpg" class="selected-img">
          <div>
            <strong>${ram.name}</strong><br>
            <small>${ram.type} • ${ram.speed} • ${ram.capacity}</small><br>
            <small>Jumlah : ${qty} pcs</small><br>
            <b>Rp ${(selectedPrice.price * qty).toLocaleString("id-ID")}</b>
        <a class="buy-link" href="${ram.link}" target="_blank">
          Link produk
        </a>
          </div>
        </div>
      `;

      hideModal();
    };

    optionsBox.appendChild(card);
  });

  showModal();
}

/* ===============================
   GPU
================================ */

/* ===============================
   GPU PICK (FINAL & STABLE)
================================ */

gpuItem.onclick = () => {
  if (!GPU_DATA || !Array.isArray(GPU_DATA)) {
    alert("Data GPU tidak terbaca");
    return;
  }

  optionsBox.innerHTML = `
    <h3>Pilih GPU</h3>
    <p class="gpu-warning">
      ⚠️ Perhatikan keseimbangan CPU dan GPU.
      GPU terlalu kuat dengan CPU lemah dapat menyebabkan <b>bottleneck</b>.
    </p>
  `;

  GPU_DATA.forEach(gpu => {
    const card = document.createElement("div");
    card.className = "option-card";

    const selectedPrice = gpu.prices[0];

    card.innerHTML = `
      <div class="option-row">
        <img src="gpu2d.jpg" class="option-img">
        <div class="option-text">
          <strong>${gpu.name}</strong><br>
            <small class="gpu-spec">
              VRAM: ${gpu.vram}<br>
              Etimasi Daya: ${gpu.power}<br>
              fan: ${gpu.fan}
            </small>
        </div>
      </div>

      <div class="price">
        <div class="price-label">Pilih harga :</div>

        <select class="price-select">
          ${gpu.prices.map((p, i) => `
            <option value="${i}">
              ${p.store} - Rp ${p.price.toLocaleString("id-ID")}
            </option>
          `).join("")}
        </select>

        <a class="buy-link" href="${selectedPrice.link}" target="_blank">
          Link produk
        </a>
      </div>
    `;

    // 🔄 UPDATE LINK SAAT GANTI TOKO
    const select = card.querySelector(".price-select");
    const link = card.querySelector(".buy-link");

select.onchange = () => {
  const priceIndex = Number(select.value);
  const chosenPrice = gpu.prices[priceIndex];

  link.href = chosenPrice.link;

  if (gpuDipilih && gpuDipilih.id === gpu.id) {
    gpuDipilih.price = chosenPrice.price;
    gpuDipilih.store = chosenPrice.store;
    gpuDipilih.link = chosenPrice.link;
    saveBuild();
  }
};

    // BIAR DROPDOWN & LINK BISA DIKLIK
    select.onclick = e => e.stopPropagation();
    link.onclick = e => e.stopPropagation();

    // ✅ SAAT GPU DIPILIH
    card.onclick = () => {
      const priceIndex = select.value;
      const chosenPrice = gpu.prices[priceIndex];

      gpuDipilih = {
        ...gpu,
        price: chosenPrice.price,
        store: chosenPrice.store,
        link: chosenPrice.link
      };

      saveBuild();

gpuItem.innerHTML = `
  <img src="gpu2d.jpg" class="selected-img">
  <div>
    <strong>${gpu.name}</strong><br>
    <small>
      ${gpu.vram} • ${gpu.fan}<br>
   ${chosenPrice.price.toLocaleString("id-ID")}
    </small><br>
    <a class="buy-link" href="${chosenPrice.link}" target="_blank">
      Link produk
    </a>
  </div>
`;

      modal.classList.remove("show");
      setTimeout(() => modal.style.display = "none", 300);
    };

    optionsBox.appendChild(card);
  });

  modal.style.display = "flex";
  modal.classList.add("show");
};

/* ===============================
   SSD NVMe ONLY
================================ */


// ---------- DOM READY ----------
document.addEventListener("DOMContentLoaded", () => {

  const ssdnvmeItem = document.getElementById("ssdnvmeItem");

  if (!ssdnvmeItem) {
    console.error("Element #ssdnvmeItem tidak ditemukan");
    return;
  }

  ssdnvmeItem.onclick = () => {

    if (!motherboardDipilih) {
      alert("Pilih motherboard dulu");
      return;
    }

    if (!motherboardDipilih.m2) {
      alert("Motherboard ini tidak mendukung SSD NVMe");
      return;
    }

    openNVMeModal();
  };

});

// ---------- MODAL NVMe ----------
function openNVMeModal() {

  optionsBox.innerHTML = "<h3>Pilih SSD NVMe</h3>";

  const ssdFiltered = SSD_NVME_DATA.filter(() => motherboardDipilih.m2);

  if (!ssdFiltered.length) {
    optionsBox.innerHTML += "<p>Tidak ada SSD NVMe yang cocok</p>";
    showModal();
    return;
  }

  ssdFiltered.forEach(ssd => {

    const btn = document.createElement("button");
    btn.className = "option-btn";

    let qty = 1;

    btn.innerHTML = `
      <div class="option-row">
        <img src="${ssd.image || 'ssd2d.jpg'}" class="option-img">
        <div class="option-text">
          <strong>${ssd.name}</strong><br>
          <small style="white-space:pre-line">
TYPE : NVME
KAPASITAS : ${ssd.size} GB
${ssd.spec}
          </small><br>

          <b>Rp ${ssd.price.toLocaleString("id-ID")}</b><br>

          <div class="price-label">Jumlah :</div>
          <select class="qty-select">
            <option value="1">1 pcs</option>
            <option value="2">2 pcs</option>
            <option value="4">4 pcs</option>
          </select>

          <a class="buy-link" href="${ssd.link}" target="_blank">
            Link produk
          </a>
        </div>
      </div>
    `;

    const qtySelect = btn.querySelector(".qty-select");

    qtySelect.onchange = () => {
      qty = Number(qtySelect.value);
    };

    btn.onclick = (e) => {
      if (e.target.tagName === "SELECT" || e.target.tagName === "A") return;

      ssdNVMeDipilih = {
        name: ssd.name,
        size: ssd.size,
        spec: ssd.spec,
        image: ssd.image,

        qty: qty,
        unitPrice: ssd.price,
        price: ssd.price * qty,

        link: ssd.link
      };

      saveBuild();

      ssdnvmeItem.innerHTML = `
        <span class="label">SSD NVMe :</span>
        <div class="value">
          <img src="${ssd.image || 'ssd2d.jpg'}" class="selected-img">
          <div>
            <strong>${ssd.name}</strong><br>
            <small>${ssd.size}GB</small><br>
            <small>Jumlah : ${qty} pcs</small><br>
            <b>Rp ${(ssd.price * qty).toLocaleString("id-ID")}</b>
          <a class="buy-link" href="${ssd.link}" target="_blank">
            Link produk
          </a>
          </div>
        </div>
      `;

      hideModal();
    };

    optionsBox.appendChild(btn);
  });

  showModal();
}

// ---------- MODAL CONTROL ----------
function showModal() {
  modal.style.display = "flex";
  modal.classList.add("show");
}

function hideModal() {
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 300);
}

/* ===============================
   SSD SATA ONLY (FINAL FIX)
================================ */

// ---------- DOM READY ----------
document.addEventListener("DOMContentLoaded", () => {

  const ssdsataItem = document.getElementById("ssdsataItem");

  if (!ssdsataItem) {
    console.error("Element #ssdsataItem tidak ditemukan");
    return;
  }

  ssdsataItem.onclick = () => {

    if (!motherboardDipilih) {
      alert("Pilih motherboard dulu");
      return;
    }

    if (!motherboardDipilih.sata) {
      alert("Motherboard ini tidak mendukung SSD SATA");
      return;
    }

    openSATAModal();
  };

});

// ---------- MODAL SATA ----------
function openSATAModal() {

  optionsBox.innerHTML = "<h3>Pilih SSD SATA</h3>";

  const ssdFiltered = SSD_SATA_DATA.filter(() => motherboardDipilih.sata);

  if (!ssdFiltered.length) {
    optionsBox.innerHTML += "<p>Tidak ada SSD SATA yang cocok</p>";
    showModal();
    return;
  }

  ssdFiltered.forEach(ssd => {

    const btn = document.createElement("button");
    btn.className = "option-btn";

    let qty = 1;

    btn.innerHTML = `
      <div class="option-row">
        <img src="${ssd.image || 'ssdsata2d.jpg'}" class="option-img">
        <div class="option-text">
          <strong>${ssd.name}</strong><br>
          <small style="white-space:pre-line">
TYPE : SATA
KAPASITAS : ${ssd.size} GB
${ssd.spec}
          </small><br>

          <b>Rp ${ssd.price.toLocaleString("id-ID")}</b><br>

          <div class="price-label">Jumlah :</div>
          <select class="qty-select">
            <option value="1">1 pcs</option>
            <option value="2">2 pcs</option>
            <option value="4">4 pcs</option>
          </select>

          <a class="buy-link" href="${ssd.link}" target="_blank">
            Link produk
          </a>
        </div>
      </div>
    `;

    const qtySelect = btn.querySelector(".qty-select");

    qtySelect.onchange = () => {
      qty = Number(qtySelect.value);
    };

    btn.onclick = (e) => {
      if (e.target.tagName === "SELECT" || e.target.tagName === "A") return;

      ssdSATADipilih = {
        name: ssd.name,
        size: ssd.size,
        spec: ssd.spec,
        image: ssd.image,

        qty: qty,
        unitPrice: ssd.price,
        price: ssd.price * qty,

        link: ssd.link
      };

      saveBuild();

      ssdsataItem.innerHTML = `
        <span class="label">SSD SATA :</span>
        <div class="value">
          <img src="${ssd.image || 'ssdsata2d.jpg'}" class="selected-img">
          <div>
            <strong>${ssd.name}</strong><br>
            <small>${ssd.size} GB</small><br>
            <small>Jumlah : ${qty} pcs</small><br>
            <b>Rp ${(ssd.price * qty).toLocaleString("id-ID")}</b>
          <a class="buy-link" href="${ssd.link}" target="_blank">
            Link produk
          </a>
          </div>
        </div>
      `;

      hideModal();
    };

    optionsBox.appendChild(btn);
  });

  showModal();
}

gpuItem.onclick = () => {
  if (!GPU_DATA || !Array.isArray(GPU_DATA)) {
    alert("Data GPU tidak terbaca");
    return;
  }

  optionsBox.innerHTML = `
    <h3>Pilih GPU</h3>
    <p class="gpu-warning">
      ⚠️ Perhatikan keseimbangan CPU dan GPU.
      GPU terlalu kuat dengan CPU lemah dapat menyebabkan <b>bottleneck</b>.
    </p>
  `;

  GPU_DATA.forEach(gpu => {
    const card = document.createElement("div");
    card.className = "option-card";

    let qty = 1; // default 1 pcs
    let selectedPrice = gpu.prices[0]; // default harga pertama

    card.innerHTML = `
      <div class="option-row">
        <img src="gpu2d.jpg" class="option-img">
        <div class="option-text">
          <strong>${gpu.name}</strong><br>
          <small class="gpu-spec">
            VRAM: ${gpu.vram}<br>
            Etimasi Daya: ${gpu.power}W<br>
            fan: ${gpu.fan}
          </small>
        </div>
      </div>

      <div class="price">
        <div class="price-label">Pilih harga :</div>
        <select class="price-select">
          ${gpu.prices.map((p, i) => `
            <option value="${i}">${p.store} - Rp ${p.price.toLocaleString("id-ID")}</option>
          `).join("")}
        </select>

        <div class="price-label">Jumlah :</div>
        <select class="qty-select">
          <option value="1">1 pcs</option>
          <option value="2">2 pcs</option>
          <option value="3">3 pcs</option>
          <option value="4">4 pcs</option>
        </select>

        <a class="buy-link" href="${selectedPrice.link}" target="_blank">Link produk</a>
      </div>
    `;

    const priceSelect = card.querySelector(".price-select");
    const qtySelect = card.querySelector(".qty-select");
    const link = card.querySelector(".buy-link");

    // 🔄 Update link & selectedPrice saat ganti toko
    priceSelect.onchange = e => {
      const chosenPrice = gpu.prices[Number(priceSelect.value)];
      selectedPrice = chosenPrice;
      link.href = chosenPrice.link;
    };

    priceSelect.onclick = e => e.stopPropagation();
    link.onclick = e => e.stopPropagation();
    qtySelect.onclick = e => e.stopPropagation();

card.onclick = () => {
  const chosenPrice = gpu.prices[Number(priceSelect.value)];
  const gpuQty = Number(qtySelect.value);

  // ✅ Ambil tdp dari data GPU
  const unitTDP = gpu.tdp; // pastikan ini 56 misal
  const totalTDP = unitTDP * gpuQty;

  gpuDipilih = {
    ...gpu,
    price: chosenPrice.price * gpuQty,
    unitPrice: chosenPrice.price,
    store: chosenPrice.store,
    link: chosenPrice.link,
    qty: gpuQty,
    totalTDP: totalTDP
  };

  saveBuild();

  gpuItem.innerHTML = `
    <img src="gpu2d.jpg" class="selected-img">
    <div>
      <strong>${gpu.name}</strong><br>
      <small>
        ${gpu.vram} • ${gpu.fan}<br>
        Jumlah : ${gpuQty} pcs<br>
        Est. Daya : ${totalTDP}W
      </small><br>
      <b>Rp ${gpuDipilih.price.toLocaleString("id-ID")}</b><br>
      <a class="buy-link" href="${gpuDipilih.link}" target="_blank">Link produk</a>
    </div>
  `;

  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 300);
};

    optionsBox.appendChild(card);
  });

  modal.style.display = "flex";
  modal.classList.add("show");
};



// =====================
// Hitung total kebutuhan PSU
// =====================
function hitungKebutuhanPSU() {
  const cpuWatt = Number(processorDipilih?.tdp ?? 0);
  const gpuWatt = Number(gpuDipilih?.tdp ?? 0) * (gpuDipilih?.qty ?? 1); // ✅ kalikan qty
  const coolerWatt = Number(cpuCoolerDipilih?.tdp ?? 0);

  const partLain = 100; // perkiraan part lain

  const total = cpuWatt + gpuWatt + coolerWatt + partLain;

  console.log("CPU:", cpuWatt);
  console.log("GPU:", gpuWatt, `(qty: ${gpuDipilih?.qty ?? 1})`);
  console.log("Cooler:", coolerWatt);
  console.log("TOTAL:", total);

  return Math.ceil(total * 1.0); // safety margin 30%
}

// =====================
// Event klik PSU
// =====================
psuItem.onclick = () => {

  // 🚫 Cegah kalau belum pilih processor
  if (!processorDipilih) {
    alert("Pilih processor dulu sebelum memilih PSU!");
    return;
  }

  const kebutuhanWatt = hitungKebutuhanPSU();

  // Judul + total watt
  optionsBox.innerHTML = `
    <h3>Pilih PSU</h3>
    <small style="opacity:.7">
      Perkiraan Total daya sistem ± <b>${kebutuhanWatt}W</b>
    </small>
  `;

  // Filter PSU berdasarkan watt saja
  const psuFiltered = PSU_DATA.filter(psu =>
    psu.watt >= kebutuhanWatt
  );

  if (psuFiltered.length === 0) {
    optionsBox.innerHTML += `<p>Tidak ada PSU yang sesuai dengan kebutuhan daya</p>`;
    modal.style.display = "flex";
    modal.classList.add("show");
    return;
  }

  psuFiltered.forEach(psu => {
    const btn = document.createElement("button");
    btn.className = "option-btn";

    btn.innerHTML = `
      <div class="option-row">
        <img src="psu2d.jpg" class="option-img">
        <div class="option-text">
          <strong>${psu.name}</strong><br>
          <small>${psu.spec}</small><br>
          <b>Rp ${psu.price.toLocaleString("id-ID")}</b><br>
          <a href="${psu.link}" target="_blank" class="detail-link">Link produk</a>
        </div>
      </div>
    `;

    btn.onclick = () => {
      psuDipilih = psu;
      saveBuild();

      psuItem.innerHTML = `
        <span class="label">PSU :</span>
        <div class="value">
          <img src="psu2d.jpg" class="selected-img">
          <div>
            <strong>${psu.name}</strong><br>
            <small>${psu.spec}</small><br>
          <b>Rp ${psu.price.toLocaleString("id-ID")}</b><br>
          <a href="${psu.link}" target="_blank" class="detail-link">Link produk</a>
          </div>
        </div>
      `;

      modal.style.display = "none";
      modal.classList.remove("show");
    };

    optionsBox.appendChild(btn);
  });

  modal.style.display = "flex";
  modal.classList.add("show");
};

casingItem.onclick = () => {
  if (!motherboardDipilih) {
    alert("Pilih motherboard dulu");
    return;
  }

  optionsBox.innerHTML = "<h3>Pilih Casing</h3>";

  const moboForm = motherboardDipilih.formFactor;

  const casingFiltered = CASING_DATA.filter(casing =>
    casing.support.includes(moboForm)
  );

  if (casingFiltered.length === 0) {
    optionsBox.innerHTML += `<p>Tidak ada casing untuk ${moboForm}</p>`;
    modal.style.display = "flex";
    modal.classList.add("show");
    return;
  }

  casingFiltered.forEach(casing => {
    const btn = document.createElement("button");
    btn.className = "option-btn casing";

    btn.innerHTML = `
      <div class="option-row">
        <img src="casing2d.jpg" class="option-img">
        <div class="option-text">
          <strong>${casing.name}</strong><br>
          <small>
            Support : ${casing.support.join(", ")}<br>
            Spesifikasi : ${casing.spec}<br>
            level : ${casing.level}
          </small><br>
          <b>Rp ${casing.price.toLocaleString("id-ID")}</b><br>
          <a href="${casing.link}" target="_blank" class="buy-link">Beli</a>
        </div>
      </div>
    `;

    btn.onclick = () => {
      casingDipilih = casing;
      saveBuild();

      casingItem.innerHTML = `
        <span class="label">CASING :</span>
        <div class="value">
          <img src="/casing2d.jpg" class="selected-img">
          <div>
            <strong>${casing.name}</strong><br>
            <small>${casing.support.join(", ")}</small><br>
          <b>Rp ${casing.price.toLocaleString("id-ID")}</b><br>
            <a href="${casing.link}" target="_blank" class="buy-link">Link Produk</a>
          </div>
        </div>
      `;

      modal.style.display = "none";
      modal.classList.remove("show");
    };

    optionsBox.appendChild(btn);
  });

  modal.style.display = "flex";
  modal.classList.add("show");
};



btnTutup.onclick = () => {
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 400); // tunggu animasi selesai
};

modal.onclick = e => {
  if(e.target === modal) {
    modal.classList.remove("show");
    setTimeout(() => modal.style.display = "none", 400);
  }
};
