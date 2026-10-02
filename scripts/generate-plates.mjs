// Usage: node scripts/generate-plates.mjs public/images
// Generates the engraved placeholder plates in /public/images.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = process.argv[2];
const INK = "#1d1915";
const BURG = "#7a1f2b";
const GOLD = "#9c7f45";
const PAPER = "#ece4d3";
const PAPER_L = "#f6f1e7";
const W = 1600;
const H = 1000;
const f = (n) => Math.round(n * 10) / 10;

function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function frame(inner, { title }) {
  const hatch = [];
  for (let y = 40; y < H - 40; y += 7) hatch.push(`M40 ${y}H${W - 40}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="${PAPER}"/>
<path d="${hatch.join("")}" stroke="${INK}" stroke-opacity="0.045" stroke-width="1"/>
<rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="1.5"/>
<rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="${INK}" stroke-opacity="0.25" stroke-width="1"/>
${inner}
<g font-family="Georgia, 'Times New Roman', serif" fill="${INK}" fill-opacity="0.7">
<text x="${W - 64}" y="${H - 60}" font-size="22" font-style="italic" text-anchor="end">${title}</text>
</g>
</svg>`;
}

/* ---------- Inventory: isometric shelving ---------- */
function inventory() {
  const r = rng(7);
  const c = Math.cos(Math.PI / 6);
  const s = 0.5;
  const ox = 800;
  const oy = 420;
  const U = 40;
  const P = (x, y, z) => [ox + (x - y) * c * U, oy + (x + y) * s * U - z * U];
  const poly = (pts, fill, extra = "") =>
    `<path d="M${pts.map((p) => p.map(f).join(" ")).join("L")}Z" fill="${fill}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round" ${extra}/>`;
  const out = [];
  out.push(`<defs><pattern id="h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(60)"><path d="M0 0V6" stroke="${INK}" stroke-opacity="0.55" stroke-width="1"/></pattern>
<pattern id="hb" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(60)"><rect width="5" height="5" fill="${BURG}"/><path d="M0 0V5" stroke="#2a0a0f" stroke-opacity="0.5" stroke-width="1"/></pattern></defs>`);
  // floor grid
  const g = [];
  for (let i = -2; i <= 12; i++) {
    const a = P(i, -2, 0), b = P(i, 12, 0), d = P(-2, i, 0), e = P(12, i, 0);
    g.push(`M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}M${f(d[0])} ${f(d[1])}L${f(e[0])} ${f(e[1])}`);
  }
  out.push(`<path d="${g.join("")}" stroke="${INK}" stroke-opacity="0.13" stroke-width="1"/>`);
  const box = (x, y, z, w, d, h, accent) => {
    const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    const left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    const right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)];
    out.push(poly(left, accent ? BURG : PAPER_L));
    out.push(poly(right, accent ? "url(#hb)" : "url(#h)"));
    out.push(poly(top, accent ? "#9a3443" : "#fbf8f1"));
  };
  // racks: draw back-to-front
  const racks = [[0, 0], [0, 4], [0, 8]];
  for (const [rx, ry] of racks.slice().reverse()) {
    for (let level = 0; level < 4; level++) {
      const z = level * 1.6;
      // shelf plank
      box(rx, ry, z, 9, 2, 0.12, false);
      for (let k = 0; k < 4; k++) {
        if (r() < 0.22) continue;
        const w = 1.3 + r() * 0.5;
        const h = 0.7 + r() * 0.6;
        box(rx + 0.3 + k * 2.2, ry + 0.25, z + 0.12, w, 1.4, h, r() < 0.12);
      }
    }
    // uprights
    for (const ux of [0, 9]) for (const uy of [0, 2]) {
      const a = P(rx + ux, ry + uy, 0), b = P(rx + ux, ry + uy, 6.4);
      out.push(`<path d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}" stroke="${INK}" stroke-width="2"/>`);
    }
  }
  // ledger tag
  out.push(`<g transform="translate(1190 720)"><rect width="300" height="120" fill="${PAPER_L}" stroke="${INK}" stroke-width="1.2"/>
<path d="M18 46H282M18 82H282" stroke="${INK}" stroke-opacity="0.3"/>
<g font-family="Georgia, serif" fill="${INK}"><text x="18" y="34" font-size="17" letter-spacing="3">STOCK LEDGER</text>
<text x="18" y="70" font-size="16" font-style="italic" fill-opacity="0.75">item · location · qty</text>
<text x="18" y="106" font-size="16" fill="${BURG}">in · out · on hand</text></g></g>`);
  return frame(out.join("\n"), { plate: "I", title: "Franchise System" });
}

/* ---------- Yggdrasil: branching tree of nodes ---------- */
function yggdrasil() {
  const r = rng(42);
  const lines = [];
  const nodes = [];
  const grow = (x, y, ang, len, depth, dir) => {
    const x2 = x + Math.cos(ang) * len;
    const y2 = y + Math.sin(ang) * len * dir;
    const cx = x + Math.cos(ang + (r() - 0.5) * 0.6) * len * 0.5;
    const cy = y + Math.sin(ang + (r() - 0.5) * 0.6) * len * 0.5 * dir;
    lines.push({ d: `M${f(x)} ${f(y)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`, w: Math.max(0.8, depth * 1.25), dir });
    if (depth <= 1 || len < 18) {
      nodes.push([x2, y2, dir]);
      return;
    }
    const n = depth > 5 ? 2 : r() < 0.35 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const spread = 0.42 + r() * 0.25;
      const a = ang + (i - (n - 1) / 2) * spread * 1.4 + (r() - 0.5) * 0.2;
      grow(x2, y2, a, len * (0.7 + r() * 0.1), depth - 1, dir);
    }
  };
  const cx = 800, ground = 640;
  // concentric rings
  const rings = [];
  for (let i = 1; i <= 9; i++) rings.push(`<circle cx="${cx}" cy="${ground - 160}" r="${i * 46}" fill="none" stroke="${INK}" stroke-opacity="${0.04 + i * 0.008}"/>`);
  grow(cx, ground, -Math.PI / 2, 150, 8, 1);
  grow(cx, ground, Math.PI / 2, 70, 5, 1);
  for (const a of [Math.PI / 2 - 0.9, Math.PI / 2 + 0.9]) grow(cx, ground, a, 60, 4, 1);
  const paths = lines
    .map((l) => `<path d="${l.d}" fill="none" stroke="${INK}" stroke-opacity="${l.dir > 0 ? 0.85 : 0.5}" stroke-width="${f(l.w)}" stroke-linecap="round"/>`)
    .join("");
  // connect some sibling tips with faint arcs (the "network")
  const tips = nodes.filter((n) => n[1] < ground).sort((a, b) => a[0] - b[0]);
  const net = [];
  for (let i = 0; i < tips.length - 1; i++) {
    if (r() < 0.55) {
      const [x1, y1] = tips[i], [x2, y2] = tips[i + 1];
      net.push(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`);
    }
  }
  const dots = nodes
    .map(([x, y], i) => {
      const accent = y < ground && i % 7 === 3;
      return `<circle cx="${f(x)}" cy="${f(y)}" r="${accent ? 7 : 4.5}" fill="${accent ? BURG : PAPER_L}" stroke="${INK}" stroke-width="1.3"/>`;
    })
    .join("");
  const groundLine = `<path d="M180 ${ground}H1420" stroke="${INK}" stroke-opacity="0.5"/><path d="M180 ${ground + 8}H1420" stroke="${INK}" stroke-opacity="0.18"/>`;
  return frame(
    rings.join("") + groundLine + `<path d="${net.join("")}" stroke="${GOLD}" stroke-opacity="0.7" stroke-dasharray="3 5"/>` + paths + dots,
    { plate: "II", title: "Yggdrasil" },
  );
}

/* ---------- Self storage: locker wall ---------- */
function storage() {
  const out = [];
  const cols = 8, rows = 4, x0 = 250, y0 = 110, cw = 120, ch = 150, gap = 16;
  out.push(`<defs><pattern id="d" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke="${INK}" stroke-opacity="0.5"/></pattern></defs>`);
  out.push(`<rect x="${x0 - 30}" y="${y0 - 30}" width="${cols * (cw + gap) - gap + 60}" height="${rows * (ch + gap) - gap + 60}" fill="${PAPER_L}" stroke="${INK}" stroke-width="2"/>`);
  let n = 1;
  for (let rI = 0; rI < rows; rI++)
    for (let c = 0; c < cols; c++, n++) {
      const x = x0 + c * (cw + gap), y = y0 + rI * (ch + gap);
      const open = rI === 1 && c === 5;
      if (open) {
        out.push(`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${INK}" fill-opacity="0.85"/>`);
        out.push(`<path d="M${x} ${y}L${x - 46} ${y + 14}V${y + ch + 14}L${x} ${y + ch}Z" fill="${BURG}" stroke="${INK}" stroke-width="1.5"/>`);
        continue;
      }
      out.push(`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${PAPER_L}" stroke="${INK}" stroke-width="1.4"/>`);
      out.push(`<rect x="${x + cw - 10}" y="${y + 4}" width="6" height="${ch - 8}" fill="url(#d)"/>`);
      for (let v = 0; v < 4; v++) out.push(`<path d="M${x + 22} ${y + 20 + v * 9}H${x + cw - 30}" stroke="${INK}" stroke-opacity="0.45"/>`);
      out.push(`<rect x="${x + 22}" y="${y + 70}" width="44" height="24" fill="none" stroke="${INK}" stroke-opacity="0.7"/>`);
      out.push(`<text x="${x + 44}" y="${y + 88}" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="${INK}">${String(n).padStart(3, "0")}</text>`);
      out.push(`<circle cx="${x + cw - 28}" cy="${y + ch / 2 + 20}" r="5" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
    }
  // key
  out.push(`<g transform="translate(1110 892) rotate(-6)" stroke="${INK}" stroke-width="2" fill="${PAPER_L}">
<circle cx="0" cy="0" r="34"/><circle cx="0" cy="0" r="12" fill="${PAPER}"/>
<path d="M34 0H210M170 0V22M190 0V16M210 0V26" fill="none"/></g>
<g transform="translate(1110 892) rotate(-6)"><text x="60" y="-12" font-family="Georgia, serif" font-style="italic" font-size="18" fill="${BURG}">bearer token</text></g>`);
  return frame(out.join("\n"), { plate: "III", title: "Self Storage" });
}

/* ---------- Game: tile map ---------- */
function game() {
  const r = rng(99);
  const out = [];
  const T = 56, cols = 22, rows = 13, x0 = (W - cols * T) / 2, y0 = 120;
  out.push(`<defs><pattern id="w" width="14" height="10" patternUnits="userSpaceOnUse"><path d="M0 6Q3.5 2 7 6T14 6" fill="none" stroke="${INK}" stroke-opacity="0.45"/></pattern>
<pattern id="x" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="${INK}" stroke-opacity="0.6"/></pattern></defs>`);
  // terrain via smooth-ish noise
  const hval = (c, rr) => Math.sin(c * 0.45 + 1.3) + Math.cos(rr * 0.6 - 0.4) + Math.sin((c + rr) * 0.3) * 0.8 + (r() - 0.5) * 0.5;
  for (let rr = 0; rr < rows; rr++)
    for (let c = 0; c < cols; c++) {
      const v = hval(c, rr);
      const x = x0 + c * T, y = y0 + rr * T;
      if (v < -0.9) out.push(`<rect x="${x}" y="${y}" width="${T}" height="${T}" fill="url(#w)"/>`);
      else if (v > 1.5) out.push(`<rect x="${x + 3}" y="${y + 3}" width="${T - 6}" height="${T - 6}" fill="url(#x)" stroke="${INK}" stroke-opacity="0.7"/>`);
      else if (v > 1.0 && r() < 0.5)
        out.push(`<path d="M${x + T / 2} ${y + 10}L${x + T - 12} ${y + T - 10}H${x + 12}Z" fill="${PAPER_L}" stroke="${INK}" stroke-width="1.3"/>`);
    }
  // grid
  const g = [];
  for (let c = 0; c <= cols; c++) g.push(`M${x0 + c * T} ${y0}V${y0 + rows * T}`);
  for (let rr = 0; rr <= rows; rr++) g.push(`M${x0} ${y0 + rr * T}H${x0 + cols * T}`);
  out.push(`<path d="${g.join("")}" stroke="${INK}" stroke-opacity="0.18"/>`);
  out.push(`<rect x="${x0}" y="${y0}" width="${cols * T}" height="${rows * T}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  // path
  const pts = [[1, 11], [4, 11], [4, 8], [8, 8], [8, 4], [12, 4], [12, 9], [16, 9], [16, 3], [20, 3]];
  const d = pts.map(([c, rr], i) => `${i ? "L" : "M"}${x0 + c * T + T / 2} ${y0 + rr * T + T / 2}`).join("");
  out.push(`<path d="${d}" fill="none" stroke="${BURG}" stroke-width="3" stroke-dasharray="10 8" stroke-linejoin="round"/>`);
  // start figure
  const [sx, sy] = [x0 + 1 * T + T / 2, y0 + 11 * T + T / 2];
  out.push(`<g stroke="${INK}" stroke-width="2" fill="${PAPER_L}"><circle cx="${sx}" cy="${sy - 14}" r="7"/><path d="M${sx} ${sy - 7}V${sy + 8}M${sx - 9} ${sy}H${sx + 9}M${sx} ${sy + 8}L${sx - 7} ${sy + 18}M${sx} ${sy + 8}L${sx + 7} ${sy + 18}" fill="none"/></g>`);
  // goal flag
  const [gx, gy] = [x0 + 20 * T + T / 2, y0 + 3 * T + T / 2];
  out.push(`<path d="M${gx - 8} ${gy + 20}V${gy - 22}" stroke="${INK}" stroke-width="2.5"/><path d="M${gx - 8} ${gy - 22}L${gx + 18} ${gy - 13}L${gx - 8} ${gy - 4}Z" fill="${BURG}" stroke="${INK}" stroke-width="1.5"/>`);
  return frame(out.join("\n"), { plate: "IV", title: "Game Studies" });
}

/* ---------- Portrait plate (monogram cameo) ---------- */
function portrait() {
  const w = 600, h = 750;
  const hatch = [];
  for (let y = 0; y < h; y += 5) hatch.push(`M0 ${y}H${w}`);
  const rings = [];
  for (let i = 0; i < 26; i++) rings.push(`<ellipse cx="300" cy="360" rx="${150 + i * 3}" ry="${200 + i * 3}" fill="none" stroke="${INK}" stroke-opacity="${0.5 - i * 0.017}" stroke-width="0.8"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><clipPath id="o"><ellipse cx="300" cy="360" rx="150" ry="200"/></clipPath></defs>
<rect width="${w}" height="${h}" fill="${PAPER}"/>
<path d="${hatch.join("")}" stroke="${INK}" stroke-opacity="0.12"/>
${rings.join("")}
<ellipse cx="300" cy="360" rx="150" ry="200" fill="${PAPER_L}" stroke="${INK}" stroke-width="2"/>
<g clip-path="url(#o)"><path d="${Array.from({ length: 60 }, (_, i) => `M${150 + i * 10} 560L${150 + i * 10 - 200} 160`).join("")}" stroke="${BURG}" stroke-opacity="0.08"/></g>
<text x="300" y="400" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="120" fill="${INK}">Ng</text>
<path d="M230 432H370" stroke="${BURG}" stroke-width="2"/>
<text x="300" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="18" letter-spacing="8" fill="${INK}" fill-opacity="0.7">T · Á · N</text>
<text x="300" y="${h - 40}" text-anchor="middle" font-family="Georgia, serif" font-size="16" letter-spacing="6" fill="${INK}" fill-opacity="0.55">PORTRAIT — FORTHCOMING</text>
</svg>`;
}

writeFileSync(join(OUT, "projects/inventory.svg"), inventory());
writeFileSync(join(OUT, "projects/yggdrasil.svg"), yggdrasil());
writeFileSync(join(OUT, "projects/storage.svg"), storage());
writeFileSync(join(OUT, "projects/game.svg"), game());
writeFileSync(join(OUT, "profile/portrait.svg"), portrait());
console.log("plates written");
