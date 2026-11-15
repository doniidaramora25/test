const canvas = document.getElementById("gearCanvas");
const ctx = canvas.getContext("2d");

const TEETH = 12;
const SPOKES = 8;
const ROOT_RADIUS = 165;
const TIP_RADIUS = 205;

// Membuat koordinat profil gigi secara simetris.
function createGearPoints(cx, cy) {
  const points = [];
  const toothAngle = (Math.PI * 2) / TEETH;
  const profile = [
    [-0.50, ROOT_RADIUS],
    [-0.32, ROOT_RADIUS],
    [-0.22, TIP_RADIUS],
    [ 0.22, TIP_RADIUS],
    [ 0.32, ROOT_RADIUS],
    [ 0.50, ROOT_RADIUS]
  ];

  for (let i = 0; i < TEETH; i++) {
    const centerAngle = i * toothAngle;

    for (const [offset, radius] of profile) {
      const angle = centerAngle + offset * toothAngle;
      points.push({
        x: cx + Math.cos(angle) * radius,
        y: cy - Math.sin(angle) * radius
      });
    }
  }
  return points;
}

// Menggambar badan utama roda gigi.
function drawGearBody(cx, cy) {
  const points = createGearPoints(cx, cy);

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();

  const metal = ctx.createLinearGradient(cx - 190, cy - 190, cx + 190, cy + 190);
  metal.addColorStop(0, "#cbd5e1");
  metal.addColorStop(0.48, "#64748b");
  metal.addColorStop(1, "#334155");

  ctx.fillStyle = metal;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#e2e8f0";
  ctx.stroke();
}

// Menggambar lingkaran konsentris.
function drawCircle(cx, cy, radius, fill, stroke = "#cbd5e1", lineWidth = 3) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

// Menggambar delapan ruji penghubung poros dan badan roda.
function drawSpokes(cx, cy) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#cbd5e1";

  for (let i = 0; i < SPOKES; i++) {
    const angle = (Math.PI * 2 * i) / SPOKES;
    const innerRadius = 43;
    const outerRadius = 112;

    ctx.beginPath();
    ctx.moveTo(
      cx + Math.cos(angle) * innerRadius,
      cy + Math.sin(angle) * innerRadius
    );
    ctx.lineTo(
      cx + Math.cos(angle) * outerRadius,
      cy + Math.sin(angle) * outerRadius
    );
    ctx.stroke();
  }
  ctx.restore();
}

// Menggambar poros tengah berbentuk lingkaran pejal.
function drawHub(cx, cy) {
  const hubGradient = ctx.createRadialGradient(cx - 12, cy - 14, 4, cx, cy, 43);
  hubGradient.addColorStop(0, "#7dd3fc");
  hubGradient.addColorStop(1, "#0284c7");
  drawCircle(cx, cy, 43, hubGradient, "#f8fafc", 5);
  drawCircle(cx, cy, 13, "#0f172a", "#bae6fd", 3);
}

// Mengatur ukuran kanvas dan menggambar seluruh komponen.
function renderGear() {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = Math.min(620, Math.max(360, width * 0.72));

  canvas.style.height = height + "px";
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min((width - 34) / 430, (height - 34) / 430, 1);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);

  drawGearBody(cx, cy);
  drawCircle(cx, cy, 150, "#334155", "#e2e8f0", 4);
  drawCircle(cx, cy, 132, "#1e293b", "#94a3b8", 3);
  drawSpokes(cx, cy);
  drawHub(cx, cy);

  ctx.restore();
}

window.addEventListener("resize", renderGear);
renderGear();