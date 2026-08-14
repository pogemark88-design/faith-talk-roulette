/* =========================================================================
   FAITH TALK ROULETTE — GAME LOGIC
   Organized in sections:
     1. Question data (numbers 1–100 -> { category, question })
     2. Category accent map
     3. State & localStorage persistence
     4. Theme / light-dark / sound toggles
     5. Wheel construction (SVG, built for 100 segments)
     6. Spin logic (selection, rotation math, animation)
     7. Sound engine (Web Audio API, no external files)
     8. Modal logic (question popup, completion, reset confirm)
     9. History / remaining-counter UI
     10. Init
   ========================================================================= */

/* ---------- 1. QUESTION DATA ---------- */
/* Every number 1–100 maps to exactly one category + question.
   This is the single source of truth for wheel + popup content. */
const QUESTIONS = {
  1:   { category: "PERSONAL FAITH",  question: "What quality of Jehovah do you admire most?" },
  2:   { category: "PERSONAL FAITH",  question: "Why is prayer important?" },
  3:   { category: "CHRISTIAN LIFE",  question: "What does it mean to imitate Jesus?" },
  4:   { category: "PERSONAL FAITH",  question: "How can we strengthen our faith?" },
  5:   { category: "CHRISTIAN LIFE",  question: "Why should Christians choose friends carefully?" },
  6:   { category: "FUTURE & HOPE",   question: "What does the Kingdom of God mean to you?" },
  7:   { category: "BIBLE",           question: "How can the Bible guide our decisions?" },
  8:   { category: "CHRISTIAN LIFE",  question: "Why is forgiveness important?" },
  9:   { category: "CONGREGATION",    question: "How can we encourage someone who is discouraged?" },
  10:  { category: "MINISTRY",        question: "What motivates us to share our faith?" },
  11:  { category: "PERSONAL FAITH",  question: "Who is Jehovah?" },
  12:  { category: "CHRISTIAN LIFE",  question: "How can we show self-control?" },
  13:  { category: "CHALLENGES",      question: "What can we learn from Job\u2019s endurance?" },
  14:  { category: "CONGREGATION",    question: "Why should we attend congregation meetings regularly?" },
  15:  { category: "PERSONAL FAITH",  question: "What is faith?" },
  16:  { category: "PERSONAL FAITH",  question: "How can we become closer to Jehovah?" },
  17:  { category: "CHRISTIAN LIFE",  question: "Why is honesty important?" },
  18:  { category: "CHALLENGES",      question: "How can prayer help us when we are worried?" },
  19:  { category: "CHRISTIAN LIFE",  question: "What qualities make someone a good friend?" },
  20:  { category: "MINISTRY",        question: "Why do Jehovah\u2019s Witnesses preach?" },
  21:  { category: "BIBLE",           question: "How can we make personal Bible study more meaningful?" },
  22:  { category: "PERSONAL FAITH",  question: "Why should we trust Jehovah\u2019s direction?" },
  23:  { category: "CHRISTIAN LIFE",  question: "How can we show love to others?" },
  24:  { category: "PERSONAL FAITH",  question: "What spiritual goals can we set?" },
  25:  { category: "BIBLE",           question: "What does Jehovah\u2019s name mean?" },
  26:  { category: "CHALLENGES",      question: "How can we remain positive during difficult circumstances?" },
  27:  { category: "CONGREGATION",    question: "Why is congregation association important?" },
  28:  { category: "PERSONAL FAITH",  question: "What can weaken our faith?" },
  29:  { category: "FAMILY",          question: "How can we show appreciation for family members?" },
  30:  { category: "MINISTRY",        question: "What can we learn from Jesus\u2019 example in the ministry?" },
  31:  { category: "BIBLE",           question: "Why should we meditate on what we read?" },
  32:  { category: "PERSONAL FAITH",  question: "How does Jehovah show patience?" },
  33:  { category: "CONGREGATION",    question: "Why is unity important among Christians?" },
  34:  { category: "MINISTRY",        question: "How can we improve our teaching ability?" },
  35:  { category: "BIBLE",           question: "What Bible principle has helped you personally?" },
  36:  { category: "CHALLENGES",      question: "How can we maintain spiritual routines during stressful periods?" },
  37:  { category: "PERSONAL FAITH",  question: "Why should we pray for others?" },
  38:  { category: "YOUNG ONES",      question: "How can young ones contribute to the congregation?" },
  39:  { category: "PERSONAL FAITH",  question: "What does dedication to Jehovah mean?" },
  40:  { category: "CHRISTIAN LIFE",  question: "How can we avoid judging others unfairly?" },
  41:  { category: "BIBLE",           question: "Why is Jehovah\u2019s name important?" },
  42:  { category: "PERSONAL FAITH",  question: "How can we strengthen our relationship with Jehovah through prayer?" },
  43:  { category: "CHRISTIAN LIFE",  question: "What does it mean to have a clean conscience?" },
  44:  { category: "MINISTRY",        question: "Why is patience important in the ministry?" },
  45:  { category: "FAMILY",          question: "How can family members strengthen one another spiritually?" },
  46:  { category: "FUTURE & HOPE",   question: "What hope does Jehovah give mankind?" },
  47:  { category: "BIBLE",           question: "Why is regular Bible reading important?" },
  48:  { category: "CHALLENGES",      question: "How can we respond when someone treats us unfairly?" },
  49:  { category: "BIBLE",           question: "What Bible account inspires you most?" },
  50:  { category: "CONGREGATION",    question: "How can we seek help when we need encouragement?" },
  51:  { category: "PERSONAL FAITH",  question: "How does Jehovah show love?" },
  52:  { category: "CONGREGATION",    question: "Why should we cooperate with congregation arrangements?" },
  53:  { category: "MINISTRY",        question: "How can we use Bible verses effectively?" },
  54:  { category: "PERSONAL FAITH",  question: "What does baptism mean to you?" },
  55:  { category: "CHRISTIAN LIFE",  question: "Why should Christians be humble?" },
  56:  { category: "CHALLENGES",      question: "How can trials strengthen our faith?" },
  57:  { category: "MINISTRY",        question: "How can we show genuine interest in people in the ministry?" },
  58:  { category: "CHRISTIAN LIFE",  question: "How can we avoid harmful influences?" },
  59:  { category: "PERSONAL FAITH",  question: "Why should we thank Jehovah in prayer?" },
  60:  { category: "CHRISTIAN LIFE",  question: "How can we be a better friend to others?" },
  61:  { category: "PERSONAL FAITH",  question: "What does it mean to dedicate yourself to Jehovah?" },
  62:  { category: "BIBLE",           question: "How can we apply Bible counsel in everyday life?" },
  63:  { category: "BIBLE",           question: "What can we learn from Bible characters who made mistakes?" },
  64:  { category: "FUTURE & HOPE",   question: "Why should we focus on Jehovah\u2019s promises?" },
  65:  { category: "CONGREGATION",    question: "How can we encourage our brothers and sisters?" },
  66:  { category: "PERSONAL FAITH",  question: "How can we make our prayers more specific?" },
  67:  { category: "FAMILY",          question: "Why is communication important in a family?" },
  68:  { category: "BIBLE",           question: "What does Jehovah want humans to know about him?" },
  69:  { category: "MINISTRY",        question: "How can we become more confident in the ministry?" },
  70:  { category: "PERSONAL FAITH",  question: "Why should we continue making spiritual progress?" },
  71:  { category: "PERSONAL FAITH",  question: "How does Jehovah show justice?" },
  72:  { category: "CONGREGATION",    question: "How can we benefit more from congregation meetings?" },
  73:  { category: "PERSONAL FAITH",  question: "What subjects should we include in our prayers?" },
  74:  { category: "CHRISTIAN LIFE",  question: "How can we control our speech?" },
  75:  { category: "PERSONAL FAITH",  question: "Why is faith important?" },
  76:  { category: "FAMILY",          question: "How can we encourage a family member who is struggling?" },
  77:  { category: "CHALLENGES",      question: "What helps us keep serving Jehovah despite difficulties?" },
  78:  { category: "MINISTRY",        question: "How can we start conversations about the Bible?" },
  79:  { category: "PERSONAL FAITH",  question: "Why should we pray before making important decisions?" },
  80:  { category: "CHRISTIAN LIFE",  question: "How can we use our abilities to serve Jehovah?" },
  81:  { category: "CONGREGATION",    question: "How can we show love to those who are discouraged?" },
  82:  { category: "BIBLE",           question: "What can we learn from Jesus\u2019 prayers?" },
  83:  { category: "CHALLENGES",      question: "Why should we avoid allowing disappointment to weaken our faith?" },
  84:  { category: "CONGREGATION",    question: "How can we make the congregation a more encouraging place?" },
  85:  { category: "CHALLENGES",      question: "How can we remain faithful during difficult times?" },
  86:  { category: "FAMILY",          question: "How can parents set a good spiritual example?" },
  87:  { category: "CHRISTIAN LIFE",  question: "Why should we choose our entertainment carefully?" },
  88:  { category: "PERSONAL FAITH",  question: "How can we strengthen our friendship with Jehovah?" },
  89:  { category: "CHRISTIAN LIFE",  question: "Why is humility important in Christian relationships?" },
  90:  { category: "MINISTRY",        question: "How can we improve our personal ministry?" },
  91:  { category: "FAMILY",          question: "How can we show respect to our parents?" },
  92:  { category: "PERSONAL FAITH",  question: "Why should we rely on Jehovah when making decisions?" },
  93:  { category: "FUTURE & HOPE",   question: "How can our future hope affect the way we live today?" },
  94:  { category: "PERSONAL FAITH",  question: "What is prayer?" },
  95:  { category: "BIBLE",           question: "Why should we continue studying the Bible?" },
  96:  { category: "CHALLENGES",      question: "How can we deal with anxiety through spiritual activities?" },
  97:  { category: "PERSONAL FAITH",  question: "What is one spiritual goal you would like to accomplish?" },
  98:  { category: "PERSONAL FAITH",  question: "How can we show that our faith is genuine?" },
  99:  { category: "CHRISTIAN LIFE",  question: "Why is love such an important Christian quality?" },
  100: { category: "PERSONAL FAITH",  question: "What is one thing you can do this week to strengthen your friendship with Jehovah?" }
};
const TOTAL_QUESTIONS = 100;

/* ---------- 2. CATEGORY ACCENT MAP ---------- */
/* Subtle per-category accent used only for the popup badge/border.
   The user's selected 5-color theme remains the primary visual system;
   these are blended in lightly, not full theme overrides. */
const CATEGORY_ACCENTS = {
  "PERSONAL FAITH":  "#8a6fd6",
  "COUPLES":         "#e0788f",
  "FAMILY":          "#e0956a",
  "CONGREGATION":    "#4caf82",
  "MINISTRY":        "#4a90c9",
  "YOUNG ONES":      "#5fc7a3",
  "BIBLE":           "#cda352",
  "CHRISTIAN LIFE":  "#3fb6b0",
  "CHALLENGES":      "#a3563f",
  "FUTURE & HOPE":   "#e0b93f"
};

/* ---------- 3. STATE & LOCALSTORAGE ---------- */
const STORAGE_KEY = "faithTalkRouletteState";

const state = {
  pool: [],          // numbers still available this game
  used: [],          // numbers used, in order selected
  rotation: 0,        // cumulative wheel rotation in degrees
  theme: "royal",
  mode: "dark",
  sound: true,
  isSpinning: false
};

function shuffledNumbers() {
  const arr = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pool: state.pool,
      used: state.used,
      rotation: state.rotation,
      theme: state.theme,
      mode: state.mode,
      sound: state.sound
    }));
  } catch (e) {
    /* localStorage may be unavailable (private mode); fail silently */
  }
}

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    saved = null;
  }

  const valid = saved &&
    Array.isArray(saved.pool) &&
    Array.isArray(saved.used) &&
    saved.pool.length + saved.used.length === TOTAL_QUESTIONS;

  if (valid) {
    state.pool = saved.pool;
    state.used = saved.used;
    state.rotation = typeof saved.rotation === "number" ? saved.rotation : 0;
    state.theme = saved.theme || "royal";
    state.mode = saved.mode || "dark";
    state.sound = typeof saved.sound === "boolean" ? saved.sound : true;
  } else {
    state.pool = shuffledNumbers();
    state.used = [];
    state.rotation = 0;
  }
}

function startNewGame() {
  state.pool = shuffledNumbers();
  state.used = [];
  state.rotation = 0;
  saveState();
}

/* ---------- 4. THEME / MODE / SOUND TOGGLES ---------- */
const bodyEl = document.body;

function applyTheme(theme) {
  state.theme = theme;
  bodyEl.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-swatch").forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.themeChoice === theme ? "true" : "false");
  });
  saveState();
}

function applyMode(mode) {
  state.mode = mode;
  bodyEl.setAttribute("data-mode", mode);
  document.getElementById("mode-toggle").setAttribute("aria-pressed", mode === "light" ? "true" : "false");
  saveState();
}

function applySound(on) {
  state.sound = on;
  document.getElementById("sound-toggle").setAttribute("aria-pressed", String(on));
  saveState();
}

function initThemeControls() {
  document.querySelectorAll(".theme-swatch").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.themeChoice));
  });

  document.getElementById("mode-toggle").addEventListener("click", () => {
    applyMode(state.mode === "dark" ? "light" : "dark");
  });

  document.getElementById("sound-toggle").addEventListener("click", () => {
    applySound(!state.sound);
  });
}

/* ---------- 5. WHEEL CONSTRUCTION ---------- */
const WHEEL_CX = 300;
const WHEEL_CY = 300;
const WHEEL_R = 292;
const LABEL_R = 250;

// Convert an angle measured clockwise from the top (12 o'clock) into an
// {x,y} point on the circle of the given radius, centered at (cx,cy).
function pointOnCircle(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: WHEEL_CX + radius * Math.sin(rad),
    y: WHEEL_CY - radius * Math.cos(rad)
  };
}

// Build all 100 wheel segments + number labels once, computed from geometry
// rather than hand-placed, since manually authoring 100 pieces isn't practical.
function buildWheel() {
  const svg = document.getElementById("wheel-svg");
  const segmentAngle = 360 / TOTAL_QUESTIONS;
  let markup = "";

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const number = i + 1;
    const startAngle = i * segmentAngle;
    const endAngle = (i + 1) * segmentAngle;
    const centerAngle = startAngle + segmentAngle / 2;

    const p1 = pointOnCircle(startAngle, WHEEL_R);
    const p2 = pointOnCircle(endAngle, WHEEL_R);
    const fillVar = i % 2 === 0 ? "var(--wheel-a)" : "var(--wheel-b)";
    const decadeMark = number % 10 === 0;

    markup += `<path class="seg-arc${decadeMark ? " seg-decade" : ""}" data-number="${number}"
      d="M ${WHEEL_CX} ${WHEEL_CY} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${WHEEL_R} ${WHEEL_R} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z"
      style="fill:${fillVar};${decadeMark ? "stroke:var(--accent);stroke-width:1.1;" : ""}" />`;

    // Flip labels in the bottom half so every number reads upright at rest.
    const flip = centerAngle > 90 && centerAngle < 270;
    const labelPoint = pointOnCircle(centerAngle, LABEL_R);
    const fontSize = number >= 100 ? 10 : 11.5;

    markup += `<g transform="rotate(${centerAngle} ${WHEEL_CX} ${WHEEL_CY})">
      <text data-number="${number}" class="seg-label" x="${WHEEL_CX}" y="${WHEEL_CY - LABEL_R}"
        font-size="${fontSize}"
        ${flip ? `transform="rotate(180 ${WHEEL_CX} ${WHEEL_CY - LABEL_R})"` : ""}>${number}</text>
    </g>`;
  }

  svg.innerHTML = markup;
}

// Grey out numbers that have already been used, so the wheel visually
// reflects the shrinking pool (selection itself is still handled in JS).
function refreshWheelUsedState() {
  const usedSet = new Set(state.used);
  document.querySelectorAll('.seg-label').forEach(label => {
    const n = Number(label.dataset.number);
    label.style.opacity = usedSet.has(n) ? "0.28" : "1";
  });
  document.querySelectorAll('.seg-arc').forEach(seg => {
    const n = Number(seg.dataset.number);
    seg.style.opacity = usedSet.has(n) ? "0.5" : "1";
  });
}

function setWheelRotation(deg, animated) {
  const svg = document.getElementById("wheel-svg");
  svg.classList.toggle("spinning-el", animated);
  svg.style.transform = `rotate(${deg}deg)`;
}

/* ---------- 6. SPIN LOGIC ---------- */
const SPIN_DURATION_MS = 4600;
const segmentAngleFor = () => 360 / TOTAL_QUESTIONS;

function pickRandomFromPool() {
  const idx = Math.floor(Math.random() * state.pool.length);
  const number = state.pool[idx];
  state.pool.splice(idx, 1);
  return number;
}

function rotationToLand(number) {
  const segAngle = segmentAngleFor();
  const centerAngle = (number - 1) * segAngle + segAngle / 2; // clockwise from top
  // We want (centerAngle + finalRotation) mod 360 === 0 so the segment sits at the pointer.
  const targetMod = ((360 - centerAngle) % 360 + 360) % 360;
  const currentMod = ((state.rotation % 360) + 360) % 360;
  let delta = targetMod - currentMod;
  delta = ((delta % 360) + 360) % 360;

  const extraFullTurns = 7 + Math.floor(Math.random() * 3); // 7–9 full spins
  return state.rotation + extraFullTurns * 360 + delta;
}

function spin() {
  if (state.isSpinning || state.pool.length === 0) return;

  state.isSpinning = true;
  const spinBtn = document.getElementById("spin-btn");
  spinBtn.disabled = true;
  spinBtn.classList.add("is-spinning");

  const selected = pickRandomFromPool();
  const newRotation = rotationToLand(selected);
  state.rotation = newRotation;

  document.getElementById("wheel-hub-number").textContent = "";
  setWheelRotation(newRotation, true);
  startTickSound(SPIN_DURATION_MS);

  window.setTimeout(() => {
    finishSpin(selected);
  }, SPIN_DURATION_MS + 60);
}

function finishSpin(number) {
  state.isSpinning = false;
  state.used.push(number);
  saveState();

  const hub = document.getElementById("wheel-hub");
  const hubNumber = document.getElementById("wheel-hub-number");
  hubNumber.textContent = number;
  hub.classList.remove("pulse");
  void hub.offsetWidth; // restart animation
  hub.classList.add("pulse");

  refreshWheelUsedState();
  updateRemainingUI();
  updateHistoryUI();
  playResultSound();
  openQuestionModal(number);
}

/* ---------- 7. SOUND ENGINE (Web Audio API, no external files) ---------- */
let audioCtx = null;
let tickTimerActive = false;

function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTick() {
  if (!state.sound) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 720;
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

function playResultSound() {
  if (!state.sound) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25]; // soft two-note chime (C5, E5)
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const startTime = ctx.currentTime + i * 0.11;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.09, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.55);
  });
}

// Ticks slow down over the spin duration to mimic a decelerating wheel.
function startTickSound(durationMs) {
  if (!state.sound) return;
  getAudioCtx();
  tickTimerActive = true;
  const totalTicks = 42;
  let i = 0;

  function next() {
    if (!tickTimerActive || i >= totalTicks) {
      tickTimerActive = false;
      return;
    }
    const t = i / totalTicks;
    const delay = 35 + Math.pow(t, 2.2) * 190; // accelerating delay = decelerating wheel
    window.setTimeout(() => {
      if (!tickTimerActive) return;
      playTick();
      i++;
      next();
    }, delay);
  }
  next();
  window.setTimeout(() => { tickTimerActive = false; }, durationMs);
}

/* ---------- 8. MODAL LOGIC ---------- */
const modalBackdrop = document.getElementById("modal-backdrop");
const modalCard = document.getElementById("modal-card");
const completeBackdrop = document.getElementById("complete-backdrop");
const confirmBackdrop = document.getElementById("confirm-backdrop");

function openQuestionModal(number) {
  const data = QUESTIONS[number];
  const accent = CATEGORY_ACCENTS[data.category] || "var(--accent)";

  document.getElementById("modal-category").textContent = data.category;
  document.getElementById("modal-question-number").textContent = `QUESTION ${number}`;
  document.getElementById("modal-question-text").textContent = data.question;
  modalCard.style.setProperty("--cat-accent", accent);

  modalBackdrop.hidden = false;
  window.requestAnimationFrame(() => modalCard.focus());
  document.addEventListener("keydown", handleEscapeKey);
}

function closeQuestionModal() {
  modalBackdrop.hidden = true;
  document.removeEventListener("keydown", handleEscapeKey);

  if (state.pool.length === 0) {
    window.setTimeout(openCompletionModal, 200);
  } else {
    document.getElementById("spin-btn").disabled = false;
    document.getElementById("spin-btn").classList.remove("is-spinning");
  }
}

function handleEscapeKey(e) {
  if (e.key === "Escape") closeQuestionModal();
}

function openCompletionModal() {
  completeBackdrop.hidden = false;
}

function openConfirmModal() {
  confirmBackdrop.hidden = false;
}

function closeConfirmModal() {
  confirmBackdrop.hidden = true;
}

function performReset() {
  startNewGame();
  refreshWheelUsedState();
  updateRemainingUI();
  updateHistoryUI();
  document.getElementById("wheel-hub-number").textContent = "?";
  setWheelRotation(0, false);
  closeConfirmModal();
  completeBackdrop.hidden = true;
  const spinBtn = document.getElementById("spin-btn");
  spinBtn.disabled = false;
  spinBtn.classList.remove("is-spinning");
}

function initModalControls() {
  document.getElementById("modal-close").addEventListener("click", closeQuestionModal);
  document.getElementById("modal-close-btn").addEventListener("click", closeQuestionModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeQuestionModal();
  });

  document.getElementById("reset-btn").addEventListener("click", openConfirmModal);
  document.getElementById("confirm-cancel").addEventListener("click", closeConfirmModal);
  document.getElementById("confirm-ok").addEventListener("click", performReset);
  confirmBackdrop.addEventListener("click", (e) => {
    if (e.target === confirmBackdrop) closeConfirmModal();
  });
}

/* ---------- 9. HISTORY / REMAINING COUNTER ---------- */
function updateRemainingUI() {
  const remaining = state.pool.length;
  document.getElementById("remaining-text").innerHTML =
    `REMAINING: <strong>${remaining} / ${TOTAL_QUESTIONS}</strong>`;
}

function updateHistoryUI() {
  const wrap = document.getElementById("history-wrap");
  const list = document.getElementById("history-list");

  if (state.used.length === 0) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;

  // Most recent first, numbers only — never questions.
  const chips = [...state.used].reverse().map(n => `<span class="history-chip">${n}</span>`).join("");
  list.innerHTML = chips;
}

/* ---------- 10. INIT ---------- */
function init() {
  loadState();

  applyTheme(state.theme);
  applyMode(state.mode);
  applySound(state.sound);

  buildWheel();
  refreshWheelUsedState();
  setWheelRotation(state.rotation, false);

  const hubNumber = document.getElementById("wheel-hub-number");
  hubNumber.textContent = state.used.length ? state.used[state.used.length - 1] : "?";

  updateRemainingUI();
  updateHistoryUI();

  initThemeControls();
  initModalControls();

  document.getElementById("spin-btn").addEventListener("click", spin);

  // If a restored game was already complete, show the completion state.
  if (state.pool.length === 0 && state.used.length === TOTAL_QUESTIONS) {
    window.setTimeout(openCompletionModal, 400);
  }
}

document.addEventListener("DOMContentLoaded", init);
