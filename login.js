const loginForm = document.getElementById("loginForm");
const passcodeInput = document.getElementById("passcode");
const errorPopup = document.getElementById("errorPopup");
const closePopup = document.getElementById("closePopup");
const successPopup = document.getElementById("successPopup");
const confettiLayer = document.getElementById("confettiLayer");
const toTimeline = document.getElementById("toTimeline");
const NORMALIZED_PASSCODES = new Set(["babylone"]);

function normalizePasscode(value) {
  return value.toLowerCase().replace(/\s+/g, "").trim();
}

function showPopup() {
  errorPopup.classList.add("open");
  errorPopup.setAttribute("aria-hidden", "false");
}

function hidePopup() {
  errorPopup.classList.remove("open");
  errorPopup.setAttribute("aria-hidden", "true");
}

function showSuccessPopup() {
  successPopup.classList.add("open");
  successPopup.setAttribute("aria-hidden", "false");
  launchConfetti();
}

function launchConfetti() {
  confettiLayer.innerHTML = "";
  const colors = ["#ff4f7d", "#ff9a62", "#ffd166", "#ffc7da", "#ffffff"];

  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = `${-14 - Math.random() * 22}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.3 + Math.random() * 1.9}s`;
    piece.style.animationDelay = `${Math.random() * 0.55}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(piece);
  }
}

closePopup.addEventListener("click", () => {
  hidePopup();
  passcodeInput.focus();
  passcodeInput.select();
});

toTimeline.addEventListener("click", () => {
  window.location.href = "./story.html";
});

errorPopup.addEventListener("click", (event) => {
  if (event.target === errorPopup) {
    hidePopup();
    passcodeInput.focus();
    passcodeInput.select();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && errorPopup.classList.contains("open")) {
    hidePopup();
    passcodeInput.focus();
    passcodeInput.select();
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const entered = normalizePasscode(passcodeInput.value);

  if (NORMALIZED_PASSCODES.has(entered)) {
    showSuccessPopup();
    return;
  }

  showPopup();
});
