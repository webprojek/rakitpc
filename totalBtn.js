document.addEventListener("DOMContentLoaded", () => {
  const btnTotal = document.getElementById("btnTotal");
  if (!btnTotal) return;

  btnTotal.onclick = () => {
  if (!confirm("Yakin mau lihat total walaupun belum lengkap?")) return;
  window.location.href = "total.html";
};
});