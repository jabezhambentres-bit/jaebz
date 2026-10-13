const entryScreen = document.getElementById("entry-screen");
const mainPage = document.getElementById("top");
const charScreen = document.getElementById("char-screen");
const letterScreen = document.getElementById("letter-screen");
const noteScreen = document.getElementById("note-screen");
const enterHeart = document.getElementById("enter-heart");
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const skipCharButton = document.getElementById("skip-char");
const charCat = document.getElementById("char-cat");
const huntBoard = document.getElementById("heart-hunt");
const foundCount = document.getElementById("found-count");
const huntTries = document.getElementById("hunt-tries");
const gameAnnouncement = document.getElementById("game-announcement");
const envelopeScene = document.getElementById("envelope-scene");
const envelopeLabel = document.getElementById("envelope-label");
const confessionLetter = document.getElementById("confession-letter");
const letterFooter = document.getElementById("letter-footer");
const openLetterButton = document.getElementById("open-letter");
const celebration = document.getElementById("celebration");
const christmasSnowfall = document.getElementById("christmas-snowfall");
const holidayLights = document.getElementById("holiday-lights");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const transitionMs = prefersReducedMotion.matches ? 0 : 520;
const exitMs = prefersReducedMotion.matches ? 0 : 320;
const catPhotos = [
  "assets/00.jpg",
  "assets/11.jpg",
  "assets/123.jpg",
  "assets/444.jpg",
  "assets/545.jpg",
  "assets/888.jpg",
  "assets/4544.jpg",
  "assets/8888.jpg",
  "assets/cat.jpg",
  "assets/cat-0.jpg",
  "assets/cat2.jpg"
];
const yesPleaseLines = [
  "Please :(",
  "I beg u :(",
  "Sadbai nako :(",
  "Pleeaseee",
  "Sugot naaa"
];
let noClicks = 0;
let heartsFound = 0;
let huntAttempts = 0;
let journeyStarted = false;
let boardCreated = false;
let gameCompleted = false;
let celebrationTimer;

function createChristmasAtmosphere() {
  const snowSymbols = ["❄", "✦", "·"];
  for (let index = 0; index < 42; index += 1) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = snowSymbols[index % snowSymbols.length];
    flake.style.left = Math.random() * 100 + "%";
    flake.style.setProperty("--flake-size", (6 + Math.random() * 13) + "px");
    flake.style.setProperty("--flake-duration", (8 + Math.random() * 13) + "s");
    flake.style.setProperty("--flake-delay", (-Math.random() * 18) + "s");
    flake.style.setProperty("--flake-drift", (Math.random() * 150 - 75) + "px");
    flake.style.setProperty("--flake-opacity", (0.4 + Math.random() * 0.6).toFixed(2));
    christmasSnowfall.append(flake);
  }

  for (let index = 0; index < 18; index += 1) {
    const bulb = document.createElement("i");
    bulb.style.setProperty("--bulb-delay", (-Math.random() * 2.6) + "s");
    holidayLights.append(bulb);
  }
}

createChristmasAtmosphere();

function shuffle(items) {
  const shuffled = items.slice();
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function moveToScreen(currentScreen, nextScreen, focusSelector) {
  currentScreen.classList.add("is-leaving");

  window.setTimeout(() => {
    currentScreen.hidden = true;
    currentScreen.classList.remove("is-leaving");
    nextScreen.hidden = false;
    nextScreen.classList.add("is-entering");

    window.requestAnimationFrame(() => nextScreen.classList.add("is-entered"));

    window.setTimeout(() => {
      nextScreen.classList.remove("is-entering", "is-entered");
      const focusTarget = nextScreen.querySelector(focusSelector);
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    }, transitionMs);
  }, exitMs);
}

function makePawIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6.2" cy="8" r="2.1"></circle><circle cx="11.8" cy="5.6" r="2.1"></circle><circle cx="17.5" cy="8" r="2.1"></circle><circle cx="20" cy="12.4" r="1.8"></circle><path d="M12.8 12.5c-2.2 0-3.6 1.4-4.8 3.1-1.1 1.6-.3 3.3 1.3 3.3 1.2 0 2.2-.7 3.8-.7s2.5.7 3.8.7c1.6 0 2.4-1.7 1.3-3.3-1.2-1.7-3.2-3.1-5.4-3.1Z"></path></svg>';
}

function createHuntBoard() {
  if (boardCreated) return;
  boardCreated = true;

  const heartLocations = new Set(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3));
  const photos = shuffle(catPhotos);

  for (let index = 0; index < 9; index += 1) {
    const hasHeart = heartLocations.has(index);
    const card = document.createElement("button");
    card.className = "hunt-tile";
    card.type = "button";
    card.setAttribute("aria-label", "Mystery cat " + (index + 1) + " of 9");
    card.dataset.hasHeart = String(hasHeart);
    card.style.setProperty("--tile-delay", (index * 45) + "ms");

    card.innerHTML = '<span class="hunt-tile-inner"><span class="hunt-face hunt-front">' +
      makePawIcon() + '<span class="tile-number">CAT MAIL ' + String(index + 1).padStart(2, "0") + '</span></span>' +
      '<span class="hunt-face hunt-back"><span class="tile-heart" aria-hidden="true">♥</span>' +
      '<span class="tile-decoy" aria-hidden="true">zzz</span></span></span>';

    const photo = document.createElement("img");
    photo.src = photos[index % photos.length];
    photo.alt = "";
    photo.loading = "lazy";
    card.querySelector(".hunt-back").prepend(photo);
    card.addEventListener("click", () => revealCat(card, index));
    huntBoard.append(card);
  }
}

function revealCat(card, index) {
  if (gameCompleted || card.disabled || card.classList.contains("is-revealed")) return;

  huntAttempts += 1;
  huntTries.textContent = String(huntAttempts);
  card.classList.add("is-revealed");

  if (card.dataset.hasHeart === "true") {
    heartsFound += 1;
    card.classList.add("is-found");
    card.disabled = true;
    card.setAttribute("aria-label", "Heart found with cat " + (index + 1));
    foundCount.textContent = heartsFound + " / 3";
    gameAnnouncement.textContent = "A heart found. " + heartsFound + " of 3 hearts found.";

    if (heartsFound === 3) completePawMailHunt(card);
    return;
  }

  card.classList.add("is-miss");
  card.setAttribute("aria-label", "Sleepy decoy cat " + (index + 1) + ". It will hide again shortly.");
  gameAnnouncement.textContent = "A sleepy decoy cat. Try another portrait.";
  card.disabled = true;
  window.setTimeout(() => {
    card.classList.remove("is-revealed", "is-miss");
    card.disabled = false;
    card.setAttribute("aria-label", "Mystery cat " + (index + 1) + " of 9");
  }, prefersReducedMotion.matches ? 250 : 850);
}

function showerHearts(origin, count = 48) {
  window.clearTimeout(celebrationTimer);
  const colors = ["#b4233d", "#155c43", "#d7b24c", "#fbfff4", "#297859"];
  const bounds = origin.getBoundingClientRect();
  const originX = bounds.left + bounds.width / 2;
  const originY = bounds.top + bounds.height / 2;
  const travel = prefersReducedMotion.matches ? 0.14 : 1;

  for (let i = 0; i < (prefersReducedMotion.matches ? 12 : count); i += 1) {
    const heart = document.createElement("span");
    heart.className = "confetti-heart";
    heart.textContent = "♥";
    heart.style.left = originX + "px";
    heart.style.top = originY + "px";
    heart.style.setProperty("--heart-color", colors[i % colors.length]);
    heart.style.setProperty("--heart-size", (12 + Math.random() * 23) + "px");
    heart.style.setProperty("--fly-x", (Math.random() * 2 - 1) * (90 + Math.random() * 330) * travel + "px");
    heart.style.setProperty("--fly-y", (Math.random() * 2 - 1) * (100 + Math.random() * 260) * travel + "px");
    heart.style.setProperty("--heart-spin", (Math.random() * 720 - 360) + "deg");
    heart.style.setProperty("--heart-duration", (prefersReducedMotion.matches ? 650 : 1150 + Math.random() * 950) + "ms");
    heart.style.animationDelay = Math.random() * (prefersReducedMotion.matches ? 80 : 280) + "ms";
    celebration.append(heart);
  }

  celebrationTimer = window.setTimeout(() => celebration.replaceChildren(), prefersReducedMotion.matches ? 1000 : 2900);
}

function snowBurst(origin, count = 20) {
  window.clearTimeout(celebrationTimer);
  const bounds = origin.getBoundingClientRect();
  const originX = bounds.left + bounds.width / 2;
  const originY = bounds.top + bounds.height / 2;
  const symbols = ["❄", "✦", "✨", "🎁", "⭐"];
  const colors = ["#f8fff9", "#d7b24c", "#c82b45", "#247253"];

  for (let index = 0; index < (prefersReducedMotion.matches ? 8 : count); index += 1) {
    const flake = document.createElement("span");
    flake.className = "christmas-confetti";
    flake.textContent = symbols[index % symbols.length];
    flake.style.left = originX + "px";
    flake.style.top = originY + "px";
    flake.style.color = colors[index % colors.length];
    flake.style.setProperty("--flake-size", (12 + Math.random() * 17) + "px");
    flake.style.setProperty("--burst-x", (Math.random() * 2 - 1) * (80 + Math.random() * 250) + "px");
    flake.style.setProperty("--burst-y", (Math.random() * 2 - 1) * (80 + Math.random() * 220) + "px");
    flake.style.setProperty("--burst-spin", (Math.random() * 540 - 270) + "deg");
    flake.style.setProperty("--burst-duration", (prefersReducedMotion.matches ? 500 : 1000 + Math.random() * 850) + "ms");
    flake.style.animationDelay = Math.random() * (prefersReducedMotion.matches ? 80 : 220) + "ms";
    celebration.append(flake);
  }

  celebrationTimer = window.setTimeout(() => celebration.replaceChildren(), prefersReducedMotion.matches ? 1000 : 2900);
}

function completePawMailHunt(finalCard) {
  if (gameCompleted) return;
  gameCompleted = true;
  huntBoard.querySelectorAll("button").forEach((card) => { card.disabled = true; });
  huntBoard.classList.add("hunt-complete");
  document.querySelector(".game-panel").classList.add("is-game-finished");
  gameAnnouncement.textContent = "All three hearts found. Your confession note is ready.";
  showerHearts(finalCard, 62);
  snowBurst(finalCard, 32);

  window.setTimeout(() => {
    moveToScreen(letterScreen, noteScreen, "#open-letter");
  }, prefersReducedMotion.matches ? 0 : 900);
}

function openConfessionLetter() {
  if (!gameCompleted || noteScreen.classList.contains("is-note-open")) return;
  openLetterButton.disabled = true;
  openLetterButton.classList.add("is-pressed");
  envelopeScene.classList.add("is-opening");
  showerHearts(openLetterButton, 58);
  snowBurst(openLetterButton, 44);

  window.setTimeout(() => {
    confessionLetter.hidden = false;
    letterFooter.hidden = false;
    noteScreen.classList.add("is-note-open", "is-note-opening");
    envelopeScene.classList.add("is-open");
    envelopeLabel.textContent = "OPENED WITH A WHOLE LOT OF HEART";
    openLetterButton.hidden = true;
    showerHearts(confessionLetter, 42);
    snowBurst(confessionLetter, 26);
    window.setTimeout(() => {
      noteScreen.classList.remove("is-note-opening");
      envelopeScene.classList.remove("is-opening");
      document.getElementById("letter-title").focus({ preventScroll: true });
    }, prefersReducedMotion.matches ? 0 : 920);
  }, prefersReducedMotion.matches ? 0 : 500);
}

enterHeart.addEventListener("click", () => {
  enterHeart.disabled = true;
  enterHeart.classList.add("is-opening");
  window.setTimeout(() => {
    moveToScreen(entryScreen, mainPage, "#hero-title");
  }, prefersReducedMotion.matches ? 0 : 380);
});

noButton.addEventListener("click", () => {
  noClicks += 1;
  const phrase = yesPleaseLines[(noClicks - 1) % yesPleaseLines.length];
  yesButton.childNodes[0].textContent = phrase + " ";
  yesButton.setAttribute("aria-label", phrase);

  const answerBounds = document.querySelector(".answer-buttons").getBoundingClientRect();
  const widthScaleLimit = Math.max(1, (answerBounds.width - 10) / yesButton.offsetWidth);
  const yesScale = Math.min(1 + noClicks * 0.13, 2.2, widthScaleLimit);
  const noScale = Math.max(0.5, 1 - noClicks * 0.075);
  yesButton.style.setProperty("--yes-scale", String(yesScale));
  noButton.style.setProperty("--no-scale", String(noScale));
  yesButton.style.setProperty("--yes-tilt", (Math.random() * 12 - 6) + "deg");

  const noHeight = noButton.offsetHeight * noScale;
  const maxX = Math.min(42, Math.max(0, answerBounds.width - yesButton.offsetWidth * yesScale - 8));
  const maxY = Math.max(0, answerBounds.height - yesButton.offsetHeight * yesScale - noHeight - 16);
  yesButton.style.setProperty("--yes-x", Math.round(Math.random() * maxX) + "px");
  yesButton.style.setProperty("--yes-y", Math.round(Math.random() * maxY) + "px");
  yesButton.classList.remove("yes-hop");
  window.requestAnimationFrame(() => {
    yesButton.classList.add("yes-hop");
    window.setTimeout(() => yesButton.classList.remove("yes-hop"), 520);
  });

  noButton.classList.remove("no-wiggle");
  window.requestAnimationFrame(() => noButton.classList.add("no-wiggle"));
  window.setTimeout(() => noButton.classList.remove("no-wiggle"), 360);
  document.body.classList.remove("holiday-flash");
  window.requestAnimationFrame(() => document.body.classList.add("holiday-flash"));
  window.setTimeout(() => document.body.classList.remove("holiday-flash"), 1050);
  snowBurst(noButton, 18);
  snowBurst(yesButton, 12);
});

yesButton.addEventListener("click", () => {
  if (journeyStarted) return;
  journeyStarted = true;
  showerHearts(yesButton, 42);
  snowBurst(yesButton, 34);
  const surprisePhoto = catPhotos[Math.floor(Math.random() * catPhotos.length)];
  document.getElementById("char-cat").src = surprisePhoto;
  moveToScreen(mainPage, charScreen, "#char-title");
});

skipCharButton.addEventListener("click", () => {
  createHuntBoard();
  moveToScreen(charScreen, letterScreen, "#letter-screen-title");
});

openLetterButton.addEventListener("click", openConfessionLetter);


