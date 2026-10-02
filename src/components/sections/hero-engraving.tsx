/**
 * An engraved globe wrapped in a network of nodes, drawn in code.
 * Deterministic (seeded), rendered on the server, animated with CSS only.
 */

const W = 1000;
const H = 760;
const CX = 500;
const CY = 330;
const R = 228;
const SPIN = 0.5;
const TILT = 0.38;

type Vec = [number, number, number];
type Pt = { x: number; y: number; front: boolean };

const round = (n: number) => Math.round(n * 10) / 10;

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function project([x, y, z]: Vec): Pt {
  const x1 = x * Math.cos(SPIN) + z * Math.sin(SPIN);
  const z1 = -x * Math.sin(SPIN) + z * Math.cos(SPIN);
  const y2 = y * Math.cos(TILT) - z1 * Math.sin(TILT);
  const z2 = y * Math.sin(TILT) + z1 * Math.cos(TILT);
  return { x: CX + R * x1, y: CY - R * y2, front: z2 >= 0 };
}

const onSphere = (lat: number, lon: number, r = 1): Vec => [
  r * Math.cos(lat) * Math.sin(lon),
  r * Math.sin(lat),
  r * Math.cos(lat) * Math.cos(lon),
];

/** Splits a projected polyline into its front-facing and back-facing halves. */
function split(points: Pt[]) {
  let front = "";
  let back = "";
  points.forEach((p, i) => {
    const prev = points[i - 1];
    const cmd = !prev || prev.front !== p.front ? "M" : "L";
    const seg = `${cmd}${round(p.x)} ${round(p.y)}`;
    if (p.front) front += seg;
    else back += seg;
  });
  return { front, back };
}

const deg = Math.PI / 180;
const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let v = from; v <= to + 1e-9; v += step) out.push(v);
  return out;
};

function build() {
  const rand = seeded(1207);

  // Graticule
  const lats = range(-75, 75, 15).map((lat) => split(range(0, 360, 4).map((lon) => project(onSphere(lat * deg, lon * deg)))));
  const lons = range(0, 345, 15).map((lon) => split(range(-90, 90, 4).map((lat) => project(onSphere(lat * deg, lon * deg)))));

  // Network nodes on the visible face
  const nodes: Vec[] = [];
  while (nodes.length < 20) {
    const v = onSphere(Math.asin(rand() * 1.7 - 0.85), rand() * Math.PI * 2);
    const p = project(v);
    const visible = p.front && Math.hypot(p.x - CX, p.y - CY) < R * 0.94;
    if (visible) nodes.push(v);
  }

  // Connect each node to its two nearest neighbours with lifted great-circle arcs
  const pairs = new Set<string>();
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) }))
      .filter((n) => n.j !== i)
      .sort((m, n) => m.d - n.d)
      .slice(0, 2)
      .forEach(({ j }) => pairs.add([Math.min(i, j), Math.max(i, j)].join("-")));
  });
  const arcs = [...pairs].map((key) => {
    const [i, j] = key.split("-").map(Number);
    const a = nodes[i];
    const b = nodes[j];
    const pts = range(0, 1, 0.05).map((t) => {
      const v: Vec = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      const len = Math.hypot(...v);
      const lift = 1 + 0.16 * Math.sin(Math.PI * t);
      return project([(v[0] / len) * lift, (v[1] / len) * lift, (v[2] / len) * lift]);
    });
    return pts.map((p, k) => `${k ? "L" : "M"}${round(p.x)} ${round(p.y)}`).join("");
  });

  // Orbits
  const orbit = (radius: number, tilt: number) =>
    split(
      range(0, 360, 3).map((t) => {
        const x = radius * Math.cos(t * deg);
        const z = radius * Math.sin(t * deg);
        return project([x * Math.cos(tilt), x * Math.sin(tilt), z]);
      }),
    );

  // Sunburst rays behind the globe
  const rays = range(0, 357.5, 2.5)
    .map((a, i) => {
      const r1 = R * 1.12;
      const r2 = R * (i % 4 === 0 ? 1.95 : i % 2 === 0 ? 1.7 : 1.5);
      const c = Math.cos(a * deg);
      const s = Math.sin(a * deg);
      return `M${round(CX + c * r1)} ${round(CY + s * r1)}L${round(CX + c * r2)} ${round(CY + s * r2)}`;
    })
    .join("");

  return {
    lats,
    lons,
    arcs,
    nodes: nodes.map(project),
    orbits: [orbit(1.42, 0.32), orbit(1.25, -0.55)],
    rays,
  };
}

const art = build();

export function HeroEngraving({ className }: { className?: string }) {
  const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="An ink engraving of a globe wrapped in a network of connected nodes"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="engrave" fill="none" strokeLinecap="round">
        <path d={art.rays} pathLength={1} stroke="var(--ink)" strokeOpacity={0.14} strokeWidth={1} style={d(0)} />
        <circle cx={CX} cy={CY} r={R * 2.02} pathLength={1} stroke="var(--rule-strong)" strokeOpacity={0.6} style={d(0.1)} />
        <circle cx={CX} cy={CY} r={R * 2.06} pathLength={1} stroke="var(--rule-strong)" strokeOpacity={0.35} style={d(0.15)} />

        {art.orbits.map((o, i) => (
          <path key={`ob${i}`} d={o.back} pathLength={1} stroke="var(--gold)" strokeOpacity={0.35} strokeWidth={1} style={d(0.3)} />
        ))}

        <circle cx={CX} cy={CY} r={R} pathLength={1} fill="var(--paper-light)" fillOpacity={0.7} stroke="var(--ink)" strokeWidth={1.6} style={d(0.2)} />

        {art.lats.map((l, i) => (
          <path key={`la${i}`} d={l.front} pathLength={1} stroke="var(--ink)" strokeOpacity={0.55} strokeWidth={0.9} style={d(0.4 + i * 0.05)} />
        ))}
        {art.lons.map((l, i) => (
          <path key={`lo${i}`} d={l.front} pathLength={1} stroke="var(--ink)" strokeOpacity={0.4} strokeWidth={0.8} style={d(0.6 + i * 0.03)} />
        ))}

        {art.arcs.map((a, i) => (
          <path key={`ar${i}`} d={a} pathLength={1} stroke="var(--burgundy)" strokeOpacity={0.85} strokeWidth={1.3} style={d(1.4 + i * 0.04)} />
        ))}

        {art.orbits.map((o, i) => (
          <path key={`of${i}`} d={o.front} pathLength={1} stroke="var(--gold)" strokeWidth={1.2} style={d(1.2 + i * 0.2)} />
        ))}

        {art.nodes.map((n, i) => (
          <circle
            key={`n${i}`}
            cx={round(n.x)}
            cy={round(n.y)}
            r={i % 6 === 0 ? 6 : 3.6}
            pathLength={1}
            fill={i % 6 === 0 ? "var(--burgundy)" : "var(--paper-light)"}
            stroke="var(--ink)"
            strokeWidth={1.2}
            style={d(1.8 + i * 0.03)}
          />
        ))}
      </g>
    </svg>
  );
}
