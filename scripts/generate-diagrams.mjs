// Usage: node scripts/generate-diagrams.mjs public/images/projects
// Engraved technical plates for the project galleries. Facts are taken from the repos.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = process.argv[2];
const INK = "#1d1915";
const SOFT = "#5a5045";
const BURG = "#7a1f2b";
const PAPER = "#ece4d3";
const PAPER_L = "#f6f1e7";
const W = 1600;
const H = 1000;
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "Consolas, Menlo, 'Courier New', monospace";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const r1 = (n) => Math.round(n * 10) / 10;

function frame(inner, title, subtitle) {
  const hatch = [];
  for (let y = 40; y < H - 40; y += 7) hatch.push(`M40 ${y}H${W - 40}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker>
<marker id="arrb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${BURG}"/></marker>
<pattern id="hx" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="${INK}" stroke-opacity="0.35"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="${PAPER}"/>
<path d="${hatch.join("")}" stroke="${INK}" stroke-opacity="0.04"/>
<rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="1.5"/>
<rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="${INK}" stroke-opacity="0.25"/>
${inner}
<g font-family="${SERIF}" fill="${INK}">
<text x="64" y="${H - 58}" font-size="20" letter-spacing="5" fill-opacity="0.75">${esc(subtitle.toUpperCase())}</text>
<text x="${W - 64}" y="${H - 58}" font-size="22" font-style="italic" text-anchor="end" fill-opacity="0.75">${esc(title)}</text>
</g>
</svg>`;
}

const text = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.mono ? MONO : SERIF}" font-size="${o.size ?? 18}"${o.anchor ? ` text-anchor="${o.anchor}"` : ""}${o.italic ? ` font-style="italic"` : ""}${o.ls ? ` letter-spacing="${o.ls}"` : ""} fill="${o.fill ?? INK}"${o.op ? ` fill-opacity="${o.op}"` : ""}${o.weight ? ` font-weight="${o.weight}"` : ""}>${esc(s)}</text>`;

/* An entity / component card: header band + rows. */
function card(x, y, w, title, rows, { accent = false, mono = true, rowH = 27, sub } = {}) {
  const head = 44;
  const h = head + rows.length * rowH + 14;
  let s = `<rect x="${x + 5}" y="${y + 5}" width="${w}" height="${h}" fill="${INK}" fill-opacity="0.08"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPER_L}" stroke="${INK}" stroke-width="1.5"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${head}" fill="${accent ? BURG : "#e3d9c4"}" stroke="${INK}" stroke-width="1.5"/>`;
  s += text(x + 16, y + 29, title, { size: 19, ls: 1.5, fill: accent ? PAPER_L : INK, weight: 600 });
  if (sub) s += text(x + w - 14, y + 29, sub, { size: 14, italic: true, anchor: "end", fill: accent ? PAPER_L : SOFT });
  rows.forEach((r, i) => {
    const ry = y + head + 24 + i * rowH;
    const [name, type] = Array.isArray(r) ? r : [r, ""];
    s += text(x + 16, ry, name, { mono, size: mono ? 15.5 : 17 });
    if (type) s += text(x + w - 14, ry, type, { mono, size: 14, anchor: "end", fill: SOFT });
  });
  return { svg: s, x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

/* Point where the segment from a box centre towards (tx,ty) leaves the box. */
function edge(b, tx, ty) {
  const dx = tx - b.cx, dy = ty - b.cy;
  const sx = dx === 0 ? Infinity : b.w / 2 / Math.abs(dx);
  const sy = dy === 0 ? Infinity : b.h / 2 / Math.abs(dy);
  const t = Math.min(sx, sy);
  return [b.cx + dx * t, b.cy + dy * t];
}

/* Relation line: crow's foot at the "many" end (a), single bar at the "one" end (b). */
function relation(a, b, { label, one = false } = {}) {
  const [x1, y1] = edge(a, b.cx, b.cy);
  const [x2, y2] = edge(b, a.cx, a.cy);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
  const px = -uy, py = ux;
  let s = `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" stroke="${INK}" stroke-width="1.4"/>`;
  if (one) {
    s += `<path d="M${r1(x1 + ux * 12 + px * 8)} ${r1(y1 + uy * 12 + py * 8)}l${r1(-px * 16)} ${r1(-py * 16)}" stroke="${INK}" stroke-width="1.4"/>`;
  } else {
    const fx = x1 + ux * 16, fy = y1 + uy * 16;
    s += `<path d="M${r1(fx)} ${r1(fy)}L${r1(x1 + px * 9)} ${r1(y1 + py * 9)}M${r1(fx)} ${r1(fy)}L${r1(x1)} ${r1(y1)}M${r1(fx)} ${r1(fy)}L${r1(x1 - px * 9)} ${r1(y1 - py * 9)}" stroke="${INK}" stroke-width="1.4" fill="none"/>`;
  }
  s += `<path d="M${r1(x2 - ux * 12 + px * 8)} ${r1(y2 - uy * 12 + py * 8)}l${r1(-px * 16)} ${r1(-py * 16)}" stroke="${INK}" stroke-width="1.4"/>`;
  if (label) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    s += `<rect x="${r1(mx - label.length * 4.6 - 8)}" y="${r1(my - 13)}" width="${r1(label.length * 9.2 + 16)}" height="24" fill="${PAPER}"/>`;
    s += text(r1(mx), r1(my + 5), label, { size: 15, italic: true, anchor: "middle", fill: SOFT });
  }
  return s;
}

const arrow = (d, { burg = false, dash = false, w = 1.6 } = {}) =>
  `<path d="${d}" fill="none" stroke="${burg ? BURG : INK}" stroke-width="${w}"${dash ? ` stroke-dasharray="7 6"` : ""} marker-end="url(#${burg ? "arrb" : "arr"})"/>`;

function stamp(x, y, label, { burg = false, w } = {}) {
  const width = w ?? label.length * 10.5 + 26;
  return `<rect x="${x}" y="${y}" width="${width}" height="32" fill="${burg ? BURG : PAPER_L}" stroke="${burg ? BURG : INK}" stroke-width="1.2"/>` +
    text(x + width / 2, y + 21.5, label, { mono: true, size: 14, anchor: "middle", fill: burg ? PAPER_L : INK, ls: 1 });
}

/* ------------------------------------------------------------------ */
/* Franchise — data model                                              */
/* ------------------------------------------------------------------ */
function franchiseModel() {
  const C = [90, 610, 1130];
  const cw = 380;
  const supplier = card(C[0], 90, cw, "Supplier", [["name", "String"], ["latitude / longitude", "Decimal"], ["status", "SupplierStatus"]]);
  const supIng = card(C[1], 90, cw, "SupplierIngredient", [["unitPrice", "Decimal"], ["minimumOrderQuantity", "Decimal"], ["stockQuantity", "Decimal"], ["leadTimeDays", "Integer"]]);
  const cart = card(C[2], 90, cw, "Cart", [["warehouse", "1 : 1"], ["items", "CartItem[]"], ["CartItem.quantity", "Decimal"]]);
  const inbound = card(C[0], 375, cw, "InboundOrder", [["status", "InboundOrderStatus"], ["totalAmount", "Decimal"], ["expectedDate / actualDate", ""], ["warehouse", "→ Warehouse"], ["items", "InboundOrderItem[]"]]);
  const ingredient = card(C[1], 375, cw, "Ingredient", [["name / unit", "String"], ["alertThreshold", "Decimal"], ["price", "Decimal"]]);
  const warehouse = card(C[2], 375, cw, "Warehouse", [["code / name", "String"], ["latitude / longitude", "Decimal"], ["status", "WarehouseStatus"]], { accent: true });
  const log = card(C[0], 675, cw, "InventoryLog", [["warehouse", "→ Warehouse"], ["transactionType", "TransactionType"], ["quantityChanged", "Decimal"], ["referenceId", "UUID"]]);
  const inventory = card(C[1], 655, cw, "Inventory", [["quantityAvailable", "Decimal"], ["quantityReserved", "Decimal"], ["lastUpdated", "DateTime"]], { accent: true });
  const outbound = card(C[2], 655, cw, "OutboundOrder", [["destinationFranchiseId", "UUID"], ["status", "OutboundOrderStatus"], ["batchCode", "String"], ["items → Ingredient", "OrderItem[]"]]);

  const lines = [
    relation(supIng, supplier),
    relation(supIng, ingredient),
    relation(cart, supIng, { label: "CartItem" }),
    relation(cart, warehouse, { one: true }),
    relation(inbound, supplier),
    relation(inbound, ingredient, { label: "items" }),
    relation(inventory, ingredient),
    relation(inventory, warehouse),
    relation(log, ingredient),
    relation(outbound, warehouse),
  ];

  const cards = [supplier, supIng, cart, inbound, ingredient, warehouse, log, inventory, outbound].map((c) => c.svg).join("");
  return frame(lines.join("") + cards, "Franchise System", "Fig. 1 — Data model (JPA entities)");
}

/* ------------------------------------------------------------------ */
/* Franchise — stock flow                                              */
/* ------------------------------------------------------------------ */
function franchiseFlow() {
  let s = "";
  // three stations
  const station = (x, title, lines, accent) => {
    s += `<rect x="${x + 6}" y="216" width="300" height="230" fill="${INK}" fill-opacity="0.08"/>`;
    s += `<rect x="${x}" y="210" width="300" height="230" fill="${accent ? BURG : PAPER_L}" stroke="${INK}" stroke-width="1.6"/>`;
    s += text(x + 150, 262, title, { size: 30, anchor: "middle", fill: accent ? PAPER_L : INK });
    s += `<path d="M${x + 40} 282H${x + 260}" stroke="${accent ? PAPER_L : INK}" stroke-opacity="0.4"/>`;
    lines.forEach((l, i) => (s += text(x + 150, 318 + i * 30, l, { mono: true, size: 16, anchor: "middle", fill: accent ? PAPER_L : SOFT })));
  };
  station(110, "Supplier", ["SupplierIngredient", "unit price · stock", "lead time"], false);
  station(650, "Warehouse", ["Inventory", "available | reserved", "low-stock threshold"], true);
  station(1190, "Franchise store", ["external service", "via OpenFeign"], false);

  s += arrow("M418 300H640", { w: 2.2 });
  s += arrow("M958 300H1180", { w: 2.2, burg: true });
  s += text(529, 285, "inbound order", { size: 19, italic: true, anchor: "middle" });
  s += text(1069, 285, "outbound order", { size: 19, italic: true, anchor: "middle", fill: BURG });
  // sync back from the store
  s += arrow("M1180 400H958", { dash: true });
  s += text(1069, 428, "status update → import confirmed", { size: 14.5, italic: true, anchor: "middle", fill: SOFT });

  // status chains
  const chain = (x, y, states, cancel, burg) => {
    let cx = x;
    states.forEach((st, i) => {
      const w = st.length * 10.5 + 26;
      s += stamp(cx, y, st, { burg: burg && i === states.length - 1, w });
      if (i < states.length - 1) s += arrow(`M${cx + w + 4} ${y + 16}H${cx + w + 30}`, { w: 1.3 });
      cx += w + 34;
    });
    s += text(x, y + 62, `or ${cancel}`, { mono: true, size: 14, fill: SOFT });
    return cx;
  };
  s += text(110, 528, "INBOUND ORDER STATUS", { size: 15, ls: 3, fill: SOFT });
  chain(110, 548, ["PENDING", "DELIVERING", "COMPLETED"], "CANCELLED", false);
  s += text(110, 650, "Received quantity is recorded per item — partial deliveries allowed,", { size: 16, italic: true, fill: SOFT });
  s += text(110, 674, "never more than ordered.", { size: 16, italic: true, fill: SOFT });

  s += text(830, 528, "OUTBOUND ORDER STATUS", { size: 15, ls: 3, fill: SOFT });
  chain(830, 548, ["PENDING", "PACKING", "SHIPPING", "DELIVERED"], "CANCELED", true);

  // inventory log ledger
  s += `<path d="M110 730H1490" stroke="${INK}" stroke-width="1.4"/><path d="M110 736H1490" stroke="${INK}" stroke-opacity="0.35"/>`;
  s += text(110, 772, "INVENTORY LOG — transaction types", { size: 15, ls: 3, fill: SOFT });
  let lx = 110;
  for (const t of ["INBOUND", "OUTBOUND", "ADJUSTMENT", "ORDER_DISPATCH"]) {
    const w = t.length * 10.5 + 26;
    s += stamp(lx, 795, t, { w });
    lx += w + 18;
  }
  s += text(lx + 10, 817, "· quantityChanged · referenceId", { mono: true, size: 15, fill: SOFT });
  return frame(s, "Franchise System", "Fig. 2 — How stock moves");
}

/* ------------------------------------------------------------------ */
/* Self Storage — request pipeline                                     */
/* ------------------------------------------------------------------ */
function storagePipeline() {
  let s = "";
  const steps = [
    ["Client", "React 18 · Vite", false],
    ["JwtAuthenticationFilter", "reads Bearer token", true],
    ["SecurityConfig", "public · admin routes", false],
    ["@PreAuthorize", "role check per method", true],
    ["Controller", "Users · FacilityAssignment", false],
    ["Service", "business rules", false],
    ["Repository", "Spring Data JPA", false],
    ["SQL Server", "", false],
  ];
  const x = 120, w = 400, h = 64, gap = 30;
  steps.forEach(([title, sub, accent], i) => {
    const y = 80 + i * (h + gap) - (i > 0 ? 0 : 0);
    const isDb = title === "SQL Server";
    if (isDb) {
      s += `<path d="M${x} ${y + 12}v${h - 12}a${w / 2} 14 0 0 0 ${w} 0v${-(h - 12)}" fill="${PAPER_L}" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${x + w / 2}" cy="${y + 12}" rx="${w / 2}" ry="14" fill="#e3d9c4" stroke="${INK}" stroke-width="1.6"/>`;
      s += text(x + w / 2, y + 52, title, { size: 22, anchor: "middle" });
    } else {
      s += `<rect x="${x + 5}" y="${y + 5}" width="${w}" height="${h}" fill="${INK}" fill-opacity="0.08"/>`;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${accent ? BURG : PAPER_L}" stroke="${INK}" stroke-width="1.5"/>`;
      s += text(x + 20, y + 30, title, { mono: true, size: 19, fill: accent ? PAPER_L : INK, weight: 600 });
      s += text(x + 20, y + 52, sub, { size: 15, italic: true, fill: accent ? PAPER_L : SOFT });
      s += text(x + w - 18, y + 41, String(i + 1).padStart(2, "0"), { size: 16, italic: true, anchor: "end", fill: accent ? PAPER_L : BURG });
    }
    if (i < steps.length - 1) s += arrow(`M${x + w / 2} ${y + h + 2}V${y + h + gap - 4}`, { w: 1.5 });
  });

  // right-hand annotations
  const ax = 640;
  s += `<path d="M${ax - 40} 80V830" stroke="${INK}" stroke-opacity="0.3"/>`;
  s += text(ax, 104, "TOKENS", { size: 15, ls: 3, fill: SOFT });
  s += text(ax, 140, "Access token (JWT, jjwt) sent as Authorization: Bearer …", { size: 18 });
  s += text(ax, 168, "Refresh token stored in the database → POST /api/auth/refresh", { size: 18 });
  s += text(ax, 196, "Passwords hashed with BCrypt before they are stored", { size: 18, italic: true, fill: SOFT });

  s += text(ax, 262, "SIGN-IN ROUTES", { size: 15, ls: 3, fill: SOFT });
  s += stamp(ax, 280, "POST /api/auth/login");
  s += text(ax + 290, 302, "email + password", { size: 17, italic: true, fill: SOFT });
  s += stamp(ax, 326, "/oauth2/** · Google");
  s += text(ax + 290, 348, "GoogleOAuth2SuccessHandler issues the JWT", { size: 17, italic: true, fill: SOFT });

  s += text(ax, 418, "ROLES", { size: 15, ls: 3, fill: SOFT });
  const roles = ["CUSTOMER", "FACILITY_STAFF", "FACILITY_MANAGER", "BUSINESS_MANAGER", "SYSTEM_ADMIN"];
  let ry = 436;
  roles.forEach((r) => {
    s += stamp(ax, ry, r, { burg: r === "SYSTEM_ADMIN", w: 250 });
    ry += 42;
  });
  s += text(ax + 420, 520, "Admin routes and facility", { size: 17, italic: true, fill: SOFT });
  s += text(ax + 420, 544, "assignments are reserved", { size: 17, italic: true, fill: SOFT });
  s += text(ax + 420, 568, "for SYSTEM_ADMIN.", { size: 17, italic: true, fill: SOFT });

  s += text(ax, 688, "ALSO", { size: 15, ls: 3, fill: SOFT });
  s += text(ax, 722, "Bean Validation (@Valid) on request bodies · central GlobalExceptionHandler", { size: 18 });
  s += text(ax, 750, "OpenAPI / Swagger documentation · CORS configured for the frontend", { size: 18 });
  return frame(s, "Self Storage", "Fig. 1 — The path of a request");
}

/* ------------------------------------------------------------------ */
/* Self Storage — account lifecycle                                    */
/* ------------------------------------------------------------------ */
function storageAccounts() {
  let s = "";
  const users = card(640, 330, 320, "Users", [["fullname · email · phone", ""], ["password", "BCrypt"], ["role", "Role"], ["status", "Status"], ["facility", "→ Facility"]], { accent: true });
  const refresh = card(90, 110, 360, "RefreshToken", [["token", "String"], ["expiryDate", "Instant"]]);
  const reset = card(90, 640, 360, "PasswordResetToken", [["token · expiryDate", ""], ["used", "boolean"]]);
  const change = card(1150, 640, 360, "EmailChangeToken", [["newEmail", "String"], ["token · expiryDate", ""], ["used", "boolean"]]);
  const facility = card(1150, 110, 360, "Facility", [["name · address · phone", ""], ["opening / closingTime", "LocalTime"], ["status", "FacilityStatus"]]);
  s += relation(refresh, users);
  s += relation(reset, users, { one: true });
  s += relation(change, users);
  s += relation(users, facility, { label: "assigned to" });
  s += users.svg + refresh.svg + reset.svg + change.svg + facility.svg;

  // flows
  s += text(90, 290, "login / refresh", { size: 17, italic: true, fill: BURG });
  s += text(90, 316, "POST /login → tokens · POST /refresh · POST /logout", { mono: true, size: 14, fill: SOFT });

  s += text(90, 862, "forgot password", { size: 17, italic: true, fill: BURG });
  s += text(90, 888, "/forgot-password → email → /reset-password", { mono: true, size: 14, fill: SOFT });

  s += text(1150, 862, "change email", { size: 17, italic: true, fill: BURG });
  s += text(1150, 888, "PUT /me → email → /confirm-email-change", { mono: true, size: 14, fill: SOFT });

  // the envelope: tokens are delivered by email
  const ex = 712, ey = 690;
  s += `<rect x="${ex}" y="${ey}" width="176" height="112" fill="${PAPER_L}" stroke="${INK}" stroke-width="1.6"/><path d="M${ex} ${ey}l88 62l88 -62" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  s += text(ex + 88, ey + 140, "Spring Mail + Thymeleaf", { size: 16, italic: true, anchor: "middle", fill: SOFT });
  s += text(ex + 88, ey + 162, "HTML templates", { size: 16, italic: true, anchor: "middle", fill: SOFT });
  s += arrow(`M${ex - 6} ${ey + 56}H462`, { dash: true });
  s += arrow(`M${ex + 182} ${ey + 56}H1138`, { dash: true });
  s += text(800, 160, "One account, five roles,", { size: 26, anchor: "middle" });
  s += text(800, 194, "and every token has an expiry.", { size: 26, italic: true, anchor: "middle", fill: BURG });
  return frame(s, "Self Storage", "Fig. 2 — Accounts, tokens and email flows");
}

/* ------------------------------------------------------------------ */
/* Yggdrasil — modules (from the feature list only)                    */
/* ------------------------------------------------------------------ */
function yggdrasilModules() {
  let s = "";
  const cx = 800;
  // trunk & gate
  s += `<path d="M${cx} 820V430" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="${cx - 190}" y="690" width="380" height="96" fill="${BURG}" stroke="${INK}" stroke-width="1.6"/>`;
  s += text(cx, 730, "Authentication", { size: 26, anchor: "middle", fill: PAPER_L });
  s += text(cx, 764, "& authorization — guards every branch", { size: 17, italic: true, anchor: "middle", fill: PAPER_L });
  // roots
  for (const dx of [-160, -80, 0, 80, 160]) s += `<path d="M${cx} 786Q${cx + dx * 0.4} 830 ${cx + dx} 870" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="2"/>`;
  s += text(cx, 905, "Spring Boot · database", { size: 17, italic: true, anchor: "middle", fill: SOFT });

  const branch = (tx, ty, title, sub) => {
    s += `<path d="M${cx} 470Q${(cx + tx) / 2} ${ty + 140} ${tx} ${ty + 70}" fill="none" stroke="${INK}" stroke-width="3"/>`;
    s += `<circle cx="${tx}" cy="${ty}" r="92" fill="${PAPER_L}" stroke="${INK}" stroke-width="1.6"/>`;
    s += `<circle cx="${tx}" cy="${ty}" r="82" fill="none" stroke="${INK}" stroke-opacity="0.3"/>`;
    s += text(tx, ty + 8, title, { size: 26, anchor: "middle" });
    s += text(tx, ty + 34, sub, { size: 15, italic: true, anchor: "middle", fill: SOFT });
  };
  branch(370, 300, "Customers", "management");
  branch(800, 190, "Categories", "management");
  branch(1230, 300, "Products", "& related features");
  s += `<circle cx="${cx}" cy="470" r="10" fill="${BURG}" stroke="${INK}" stroke-width="1.5"/>`;
  return frame(s, "Yggdrasil", "Fig. 1 — Modules of the application");
}

const files = {
  "franchise-model.svg": franchiseModel(),
  "franchise-flow.svg": franchiseFlow(),
  "storage-pipeline.svg": storagePipeline(),
  "storage-accounts.svg": storageAccounts(),
  "yggdrasil-modules.svg": yggdrasilModules(),
};
for (const [name, svg] of Object.entries(files)) writeFileSync(join(OUT, name), svg);
console.log("diagrams written:", Object.keys(files).join(", "));
