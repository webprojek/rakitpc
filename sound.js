document.addEventListener("DOMContentLoaded", () => {
  const sound = new Audio("click.mp3");
  sound.preload = "auto";

  let lastPlay = 0;
  const delay = 120; // ms (atur sesuai selera)

  function playSound() {
    const now = Date.now();
    if (now - lastPlay < delay) return;

    lastPlay = now;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  document.addEventListener("pointerdown", playSound);
});