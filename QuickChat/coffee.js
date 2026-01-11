/* ============================
   DIGITAL COFFEE MACHINE
   By Shaurya – QuickChat
============================ */

let machine = null;
let cup = null;
let cupWrap = null;
let brewing = false;
let steamInterval = null;

// Sounds
const drinkSound = new Audio("drink.mp3");
const elevatorMusic = new Audio("smoothjazz.mp3");
elevatorMusic.loop = true;
const dingSound = new Audio("ding.mp3");
dingSound.volume = 0.5;

/* ============================
   PIXEL ANIMATIONS
============================ */
const style = document.createElement("style");
style.textContent = `
@keyframes brewShake {
  0% { transform: translate(0,0); }
  25% { transform: translate(2px,0); }
  50% { transform: translate(-2px,0); }
  75% { transform: translate(2px,0); }
  100% { transform: translate(0,0); }
}
@keyframes blink { 50% { opacity: 0; } }
@keyframes cupBounce {
  0% { transform: translateY(0); }
  25% { transform: translateY(-5px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
}
/* Swirling steam animation */
@keyframes steamSwirl {
  0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 0.9; }
  25% { transform: translate(-5px,-15px) rotate(15deg) scale(1.1); opacity: 0.8; }
  50% { transform: translate(5px,-30px) rotate(-10deg) scale(1.2); opacity: 0.7; }
  75% { transform: translate(-3px,-45px) rotate(5deg) scale(1.3); opacity: 0.5; }
  100% { transform: translate(0,-60px) rotate(0deg) scale(1.4); opacity: 0; }
}
`;
document.head.appendChild(style);

/* ============================
   /coffee COMMAND
============================ */
window.startCoffee = function () {
  spawnMachine();
  showCoffeeToast();

  if (elevatorMusic.paused) {
    elevatorMusic.volume = 0.35;
    elevatorMusic.currentTime = 0;
    elevatorMusic.play();
  }
};

/* ============================
   SPAWN MACHINE
============================ */
function spawnMachine() {
  if (machine) return;

  machine = document.createElement("img");
  machine.src = "coffee-machine.png";
  Object.assign(machine.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    width: "180px",
    imageRendering: "pixelated",
    cursor: "pointer",
    zIndex: 9999
  });

  machine.onclick = brewCoffee;
  document.body.appendChild(machine);
}

/* ============================
   BREW COFFEE
============================ */
function brewCoffee() {
  if (brewing) return;
  brewing = true;

  // Show progress bar
  const progress = document.createElement("div");
  Object.assign(progress.style, {
    position: "fixed",
    right: "20px",
    bottom: "210px",
    width: "180px",
    height: "8px",
    border: "2px solid #fff",
    background: "#000",
    zIndex: 10001
  });
  const progressFill = document.createElement("div");
  Object.assign(progressFill.style, {
    width: "0%",
    height: "100%",
    background: "#fff",
    imageRendering: "pixelated"
  });
  progress.appendChild(progressFill);
  document.body.appendChild(progress);

  const msg = document.createElement("div");
  msg.textContent = "Brewing pixels...";
  Object.assign(msg.style, {
    position: "fixed",
    right: "20px",
    top: "20px",
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "14px",
    color: "#fff",
    background: "rgba(0,0,0,0.8)",
    padding: "8px 12px",
    border: "3px solid white",
    zIndex: 10000,
    animation: "blink 1s steps(2) infinite"
  });
  document.body.appendChild(msg);

  machine.style.animation = "brewShake 0.4s steps(2) infinite";

  // Progress bar animation
  let elapsed = 0;
  const total = 10000; // 10 seconds
  const interval = setInterval(() => {
    elapsed += 100;
    progressFill.style.width = `${(elapsed / total) * 100}%`;
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    msg.textContent = "Coffee ready! Click machine ☕";
    msg.style.animation = "none";
    brewing = false;
    machine.style.animation = "none";
    machine.onclick = showCup;

    dingSound.currentTime = 0;
    dingSound.play();

    setTimeout(() => {
      msg.remove();
      progress.remove();
    }, 6000);
  }, total);
}

/* ============================
   DISPENSE CUP
============================ */
function showCup() {
  if (cupWrap) return;

  cupWrap = document.createElement("div");
  Object.assign(cupWrap.style, {
    position: "fixed",
    right: "20px",
    top: "60px",
    width: "90px",
    height: "90px",
    zIndex: 9999,
    pointerEvents: "auto"
  });

  cup = document.createElement("img");
  cup.src = "coffee-cup.png";
  Object.assign(cup.style, {
    width: "100%",
    imageRendering: "pixelated",
    cursor: "pointer",
    display: "block"
  });

  cupWrap.appendChild(cup);
  document.body.appendChild(cupWrap);

  // Steam layer above cup
  const steamLayer = document.createElement("div");
  Object.assign(steamLayer.style, {
    position: "absolute",
    left: "50%",
    bottom: "72%", // steam starts near cup liquid
    transform: "translateX(-50%)",
    pointerEvents: "none",
    width: "0px",
    height: "0px"
  });
  cupWrap.appendChild(steamLayer);

  // Spawn swirling steam
  steamInterval = setInterval(() => {
    const s = document.createElement("div");
    s.textContent = "☁";
    Object.assign(s.style, {
      position: "absolute",
      left: `${(Math.random() * 20) - 10}px`,
      bottom: "0px",
      fontSize: "18px",
      opacity: 0.9,
      animation: "steamSwirl 2s linear forwards"
    });
    steamLayer.appendChild(s);
    setTimeout(() => s.remove(), 2000);
  }, 350);

  // Cup click – drink coffee with bounce
  cupWrap.onclick = () => {
    drinkSound.play();
    cup.style.animation = "cupBounce 0.5s ease";
    setTimeout(() => {
      cupWrap.remove();
      clearInterval(steamInterval);
      cupWrap = null;
      cup = null;
      machine.onclick = brewCoffee;
    }, 500);
  };
}

/* ============================
   TOAST
============================ */
function showCoffeeToast() {
  const t = document.createElement("div");
  t.textContent = "☕ Coffee machine online";
  Object.assign(t.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#161b29",
    padding: "10px 20px",
    borderRadius: "20px",
    zIndex: 10000,
    fontFamily: "'Press Start 2P', monospace",
    color: "#fff"
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
