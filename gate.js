const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const heartsHost = document.querySelector(".hearts");
let dodgeCount = 0;
let noMoveLocked = false;
let lastPointer = null;
let noButtonFloating = false;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function moveNoButtonToBodyLayer() {
  if (noButtonFloating) return;
  const startRect = noBtn.getBoundingClientRect();
  document.body.appendChild(noBtn);
  noBtn.style.position = "fixed";
  noBtn.style.left = `${Math.round(startRect.left)}px`;
  noBtn.style.top = `${Math.round(startRect.top)}px`;
  noBtn.style.right = "auto";
  noBtn.style.transform = "none";
  noBtn.style.zIndex = "50";
  noButtonFloating = true;
}

function getBounds(btnRect) {
  const margin = window.innerWidth < 560 ? 8 : 12;
  const width = document.documentElement.clientWidth || window.innerWidth;
  const height = document.documentElement.clientHeight || window.innerHeight;

  return {
    margin,
    minX: margin,
    minY: margin,
    maxX: Math.max(margin, width - btnRect.width - margin),
    maxY: Math.max(margin, height - btnRect.height - margin)
  };
}

function clampNoButtonWithinBounds() {
  if (!noButtonFloating) return;
  const btn = noBtn.getBoundingClientRect();
  const bounds = getBounds(btn);
  const currentX = Number.parseFloat(noBtn.style.left || `${btn.left}`);
  const currentY = Number.parseFloat(noBtn.style.top || `${btn.top}`);
  const x = Math.min(Math.max(currentX, bounds.minX), bounds.maxX);
  const y = Math.min(Math.max(currentY, bounds.minY), bounds.maxY);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${Math.round(x)}px`;
  noBtn.style.top = `${Math.round(y)}px`;
  noBtn.style.right = "auto";
  noBtn.style.transform = "none";
}

function getNextPosition(bounds) {
  const minDistance = 110;
  for (let i = 0; i < 8; i += 1) {
    const x = randomInRange(bounds.minX, bounds.maxX);
    const y = randomInRange(bounds.minY, bounds.maxY);
    if (!lastPointer) return { x, y };

    const dx = x - lastPointer.x;
    const dy = y - lastPointer.y;
    if (Math.hypot(dx, dy) >= minDistance) return { x, y };
  }

  return {
    x: randomInRange(bounds.minX, bounds.maxX),
    y: randomInRange(bounds.minY, bounds.maxY)
  };
}

function dodgeNoButton() {
  if (noMoveLocked) return;
  noMoveLocked = true;
  moveNoButtonToBodyLayer();

  const btn = noBtn.getBoundingClientRect();
  const bounds = getBounds(btn);
  const next = getNextPosition(bounds);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${Math.round(next.x)}px`;
  noBtn.style.top = `${Math.round(next.y)}px`;
  noBtn.style.right = "auto";
  noBtn.style.transform = "none";
  requestAnimationFrame(clampNoButtonWithinBounds);

  dodgeCount += 1;
  if (dodgeCount === 2) hint.textContent = "UMM,... is shy and keeps running away.";
  if (dodgeCount === 5) hint.textContent = "Still trying? Hit Yes, Always to unlock your surprise.";

  setTimeout(() => {
    noMoveLocked = false;
  }, 150);
}

["mouseenter", "touchstart", "click"].forEach((eventName) => {
  noBtn.addEventListener(eventName, (event) => {
    event.preventDefault();
    if ("clientX" in event && "clientY" in event) {
      lastPointer = { x: event.clientX, y: event.clientY };
    } else if (event.touches && event.touches[0]) {
      lastPointer = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    dodgeNoButton();
  });
});

window.addEventListener("resize", clampNoButtonWithinBounds);
window.addEventListener("orientationchange", clampNoButtonWithinBounds);
noBtn.addEventListener("transitionend", clampNoButtonWithinBounds);
setInterval(clampNoButtonWithinBounds, 220);

function spawnHeart() {
  if (!heartsHost) return;

  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.bottom = "-20px";
  heart.style.animationDuration = `${8 + Math.random() * 5}s`;

  const size = 8 + Math.random() * 16;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;

  heartsHost.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(spawnHeart, 700);
}
