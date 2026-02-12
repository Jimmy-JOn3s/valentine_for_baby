const modal = document.getElementById("memoryModal");
const memoryTitle = document.getElementById("memoryTitle");
const memoryNote = document.getElementById("memoryNote");
const closeModal = document.getElementById("closeModal");
const acceptApologyBtn = document.getElementById("acceptApologyBtn");
const apologyHint = document.getElementById("apologyHint");
const storyEnvelope = document.getElementById("storyEnvelope");
const memoryGrid = document.querySelector(".polaroid-grid");

function showMemoryCard(card) {
  memoryTitle.textContent = card.dataset.title || "Memory";
  memoryNote.textContent = card.dataset.note || "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

if (memoryGrid) {
  memoryGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".polaroid");
    if (!card) return;
    showMemoryCard(card);
  });
}

function applyPolaroidOrientation(img) {
  const card = img.closest(".polaroid");
  if (!card) return;

  card.classList.remove("is-landscape", "is-portrait", "is-square");
  const ratio = img.naturalWidth / img.naturalHeight;

  if (ratio > 1.12) {
    card.classList.add("is-landscape");
  } else if (ratio < 0.9) {
    card.classList.add("is-portrait");
  } else {
    card.classList.add("is-square");
  }
}

document.querySelectorAll(".polaroid img").forEach((img) => {
  if (img.complete && img.naturalWidth > 0) {
    applyPolaroidOrientation(img);
  } else {
    img.addEventListener("load", () => applyPolaroidOrientation(img), { once: true });
  }
});

if (acceptApologyBtn && storyEnvelope) {
  acceptApologyBtn.addEventListener("click", () => {
    storyEnvelope.classList.add("open");
    storyEnvelope.setAttribute("aria-hidden", "false");
    acceptApologyBtn.disabled = true;
    acceptApologyBtn.textContent = "Apology Accepted";
    if (apologyHint) {
      apologyHint.textContent = "Thank you. Scroll down, our story is open.";
      apologyHint.style.animation = "none";
    }
    setTimeout(() => {
      storyEnvelope.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 140);
  });
}

const hideModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) hideModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideModal();
});

const slides = Array.from(document.querySelectorAll(".slide"));
const nextSlide = document.getElementById("nextSlide");
const prevSlide = document.getElementById("prevSlide");
const slideshowEl = document.querySelector(".slideshow");
let currentSlide = 0;
let slideshowTimer;

function renderSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

function goToSlide(direction) {
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  renderSlide(currentSlide);
}

function startSlideshow() {
  stopSlideshow();
  slideshowTimer = setInterval(() => goToSlide(1), 4200);
}

function stopSlideshow() {
  if (slideshowTimer) clearInterval(slideshowTimer);
}

if (nextSlide && prevSlide) {
  nextSlide.addEventListener("click", () => {
    goToSlide(1);
    startSlideshow();
  });
  prevSlide.addEventListener("click", () => {
    goToSlide(-1);
    startSlideshow();
  });
}

if (slideshowEl) {
  slideshowEl.addEventListener("mouseenter", stopSlideshow);
  slideshowEl.addEventListener("mouseleave", startSlideshow);
}

if (slides.length > 1) {
  startSlideshow();
}

const revealTargets = document.querySelectorAll(".reveal, .reveal-item");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (entry.target.classList.contains("reveal-item")) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll(".reveal-item"));
        siblings.forEach((item, idx) => {
          setTimeout(() => item.classList.add("in-view"), idx * 130);
          observer.unobserve(item);
        });
      } else {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const heartsHost = document.querySelector(".hearts");

function spawnHeart() {
  if (!heartsHost) return;

  const heart = document.createElement("span");
  heart.className = "heart";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.bottom = "-20px";
  heart.style.animationDuration = `${8 + Math.random() * 5}s`;
  heart.style.opacity = `${0.18 + Math.random() * 0.24}`;

  const size = 8 + Math.random() * 16;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;

  heartsHost.appendChild(heart);

  heart.addEventListener("animationend", () => {
    heart.remove();
  });
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches === false) {
  setInterval(spawnHeart, 760);
}
