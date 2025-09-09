let options = [];
let startAngle = 0;
let arc = 0;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

function generateWheel() {
  const input = document.getElementById("choicesInput").value;
  options = input.split(",").map(opt => opt.trim()).filter(opt => opt !== "");
  
  if (options.length < 2) {
    alert("Please enter at least 2 options!");
    return;
  }
  
  arc = Math.PI * 2 / options.length;
  drawWheel();
  document.getElementById("spinBtn").disabled = false;
  document.getElementById("result").innerText = "";
}

function drawWheel() {
  ctx.clearRect(0, 0, 400, 400);
  for (let i = 0; i < options.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = rainbowColor(i);
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angle, angle + arc, false);
    ctx.lineTo(200, 200);
    ctx.fill();
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle + arc / 2);
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Comic Sans MS";
    ctx.fillText(options[i], 100, 5);
    ctx.restore();
  }
  
  // Arrow indicator
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(190, 0);
  ctx.lineTo(210, 0);
  ctx.lineTo(200, 30);
  ctx.closePath();
  ctx.fill();
}

function rainbowColor(i) {
  return `hsl(${(i * 360 / options.length)}, 85%, 55%)`;
}

function spinWheel() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3000 + 4000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = startAngle * 180 / Math.PI + 90;
  const arcd = arc * 180 / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd) % options.length;
  document.getElementById("result").innerText = "🎉 Result: " + options[index];
  launchConfetti();
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

/* ---- Confetti Effect ---- */
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiPieces = [];

function launchConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 100; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 100,
      color: rainbowColor(i),
      tilt: Math.floor(Math.random() * 10) - 10
    });
  }
  requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((c, i) => {
    confettiCtx.beginPath();
    confettiCtx.fillStyle = c.color;
    confettiCtx.fillRect(c.x, c.y, c.r, c.r);
    confettiCtx.closePath();

    c.y += Math.cos(c.d) + 2 + c.r / 2;
    c.x += Math.sin(c.d);

    if (c.y > confettiCanvas.height) {
      confettiPieces[i] = {
        x: Math.random() * confettiCanvas.width,
        y: -10,
        r: c.r,
        d: c.d,
        color: c.color,
        tilt: c.tilt
      };
    }
  });
  requestAnimationFrame(drawConfetti);
}

window.addEventListener("resize", () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
