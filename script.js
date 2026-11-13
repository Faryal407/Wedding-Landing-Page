// Keep the countdown rolling to the next September 10 at 7:00 PM.
let weddingDate = new Date(2027, 8, 10, 19, 0, 0);
const byId = (id) => document.getElementById(id);

function updateCountdown() {
  let diff = weddingDate.getTime() - Date.now();
  if (diff <= 0) {
    weddingDate = new Date(weddingDate.getFullYear() + 1, 8, 10, 19, 0, 0);
    diff = weddingDate.getTime() - Date.now();
  }
  byId("days").textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
  byId("hours").textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
  byId("minutes").textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  byId("seconds").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal headings and hero text when they enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

// Responsive navigation.
const menuToggle = byId("menu-toggle");
const navLinks = byId("nav-links");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Golden sparkles.
const sparkleLayer = byId("sparkles");
for (let i = 0; i < 34; i++) {
  const star = document.createElement("span");
  star.className = "sparkle";
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty("--duration", `${3 + Math.random() * 5}s`);
  star.style.animationDelay = `${Math.random() * 5}s`;
  sparkleLayer.appendChild(star);
}

// Celebrate when the event details first come into view or when requested.
const confettiLayer = byId("confetti");
let confettiCleanup;
function launchConfetti() {
  confettiLayer.replaceChildren();
  window.clearTimeout(confettiCleanup);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = ["#d9b879", "#c2944b", "#a87942", "#8d5e3b", "#fff8ed"];
  const pieceCount = reducedMotion ? 18 : 70;
  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");
    piece.className = `confetti-piece${i % 3 === 0 ? " confetti-circle" : ""}`;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    piece.style.setProperty("--spin", `${Math.random() * 900 + 360}deg`);
    piece.style.setProperty("--duration", reducedMotion ? "0.9s" : `${2.2 + Math.random() * 1.2}s`);
    confettiLayer.appendChild(piece);
  }

  confettiCleanup = window.setTimeout(() => confettiLayer.replaceChildren(), reducedMotion ? 1100 : 3600);
}
const celebrationObserver = new IntersectionObserver((entries) => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  celebrationObserver.disconnect();
  launchConfetti();
}, { threshold: 0.25 });
celebrationObserver.observe(byId("details"));
byId("celebrate-button").addEventListener("click", launchConfetti);

// Back to top.
const topButton = byId("top-button");
window.addEventListener("scroll", () => {
  const visible = window.scrollY > 450;
  topButton.classList.toggle("opacity-0", !visible);
  topButton.classList.toggle("translate-y-3", !visible);
  topButton.classList.toggle("opacity-100", visible);
  topButton.classList.toggle("translate-y-0", visible);
  topButton.classList.toggle("pointer-events-none", !visible);
});
topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Demo RSVP only: this alert does not send or save the response.
byId("rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = byId("guest-name").value.trim();
  const attendance = document.querySelector('input[name="attendance"]:checked').value;
  alert(`Thank you, ${name}! \n\nYour response: ${attendance}.\n\nThis is a demo form; connect a form service to receive RSVPs.`);
});

// Open the envelope to reveal the wedding invitation.
document.body.classList.add("invitation-locked");
const envelopeScreen = byId("envelope-screen");
byId("open-invitation").addEventListener("click", () => {
  if (envelopeScreen.classList.contains("opening")) return;
  envelopeScreen.classList.add("opening");
  window.setTimeout(() => {
    envelopeScreen.classList.add("envelope-opened");
    document.body.classList.remove("invitation-locked");
    byId("home").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 850);
});
