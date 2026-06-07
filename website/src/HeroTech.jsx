import React from 'react'

// Dark "data-city" motif, Dartmouth palette. A deep 3D skyline of SIX rows that
// recede front→back: FRONT rows are short (foreground), BACK rows are tall — so
// the whole city is visible stepping up toward the horizon. Atmospheric haze
// lightens toward the back on the RIGHT (the lit city); the LEFT stays dark
// silhouette so the headline reads. Tall light-beams + network mesh + a globe
// sit on the right. Deterministic; every bright element is right of `textEdge`.
export default function HeroTech({ variant = 'hero' }) {
  const band = variant === 'band'
  const rnd = (i, s) => {
    const h = Math.sin(i * 12.9898 + s * 4.137) * 43758.5453
    return h - Math.floor(h)
  }
  const textEdge = band ? 78 : 94
  const ROWS = band ? 5 : 6
  const BASE = 98
  const sf = band ? 0.66 : 1
  const mix = (a, b, t) =>
    `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`
  // tone ramps [far/back, near/front] for the lit RIGHT side and the dark LEFT side
  const FRONT = { R: [[48, 92, 68], [9, 27, 18]], L: [[24, 48, 35], [8, 23, 15]] }
  const ROOF = { R: [[68, 122, 94], [22, 58, 40]], L: [[32, 62, 46], [15, 40, 27]] }
  const SIDE = { R: [[30, 64, 46], [6, 19, 12]], L: [[16, 36, 25], [5, 16, 10]] }
  const tone = (set, lit, d) => mix(lit ? set.R[0] : set.L[0], lit ? set.R[1] : set.L[1], d)

  const rows = []
  for (let r = 0; r < ROWS; r += 1) {
    const d = ROWS === 1 ? 0 : r / (ROWS - 1) // 0 = back/far/tall, 1 = front/near/short
    const D = (1 + d * 1.4) * (band ? 0.85 : 1)
    const seed = r + 1
    const bs = []
    let x = -6
    let i = 0
    while (x < 168 && i < 46) {
      i += 1
      const w = 3 + rnd(i, seed) * (2.4 + d * 3)
      const peak = 1 - Math.min(1, Math.abs(x + w / 2 - 120) / 102)
      const spike = d < 0.5 && rnd(i, seed + 2) > 0.8 ? rnd(i, seed + 3) * 16 : 0 // tall towers, back rows
      const h = ((50 - d * 28) + rnd(i, seed + 1) * (16 - d * 8) + peak * (14 - d * 9) + spike) * sf
      bs.push({ x, w, top: BASE - h, cx: x + w / 2, bi: r * 1000 + i })
      x += w + (1.6 - d * 1.0) + rnd(i, seed + 4) * 1.3
    }
    rows.push({ d, D, bs })
  }

  // beams from right-side towers of the taller (back/mid) rows
  const beams = []
  rows.forEach((row) => {
    if (row.d > 0.55) return
    row.bs.forEach((b) => {
      if (b.cx > textEdge && rnd(b.bi, 5) > 0.62 && beams.length < (band ? 6 : 11)) {
        beams.push({
          x: b.cx + row.D / 2,
          base: b.top - row.D * 0.78,
          top: Math.max(6, b.top - (8 + rnd(b.bi, 6) * 12)),
          gold: rnd(b.bi, 7) > 0.7,
          bi: b.bi,
        })
      }
    })
  })

  const nodes = beams.map((bm) => ({ x: bm.x, y: bm.top, gold: bm.gold }))
  for (let k = 0; k < (band ? 2 : 4); k += 1) {
    nodes.push({
      x: textEdge + 6 + rnd(120 + k, 1) * (156 - textEdge - 6),
      y: 6 + rnd(120 + k, 2) * 20,
      gold: rnd(120 + k, 3) > 0.75,
      floating: true,
    })
  }
  const edges = []
  nodes.forEach((a, ai) => {
    nodes
      .map((b, bj) => ({ bj, dd: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((o) => o.bj !== ai)
      .sort((p, q) => p.dd - q.dd)
      .slice(0, 2)
      .forEach((o) => { if (ai < o.bj && o.dd < 30) edges.push([ai, o.bj]) })
  })

  const gcx = 146, gcy = 17, gR = 21
  const lon = [0.8, 0.5, 0.22].map((f) => gR * f)
  const lat = [-0.55, -0.2, 0.2, 0.55].map((s) => ({ y: gcy + s * gR, rx: gR * Math.sqrt(1 - s * s), ry: gR * 0.16 }))
  const trails = Array.from({ length: band ? 3 : 5 }, (_, k) => ({ y: 72 + k * 1.7, gold: k % 2 === 1, k }))
  const f1 = (n) => n.toFixed(1)

  return (
    <svg className="hero-tech" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="ht-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="ht-horizG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34d98a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#34d98a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ht-beamG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#5fe3a4" stopOpacity="0" />
          <stop offset="100%" stopColor="#9ff3c6" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ht-beamGoldG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#d9b24c" stopOpacity="0" />
          <stop offset="100%" stopColor="#f3d893" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <ellipse cx="122" cy="62" rx="66" ry="22" fill="url(#ht-horizG)" />

      <g className="ht-trails">
        {trails.map((t) => (
          <path key={'t' + t.k} d={`M-5 ${f1(t.y)} C 42 ${f1(t.y - 2.5)}, 112 ${f1(t.y + 2.5)}, 165 ${f1(t.y - 1)}`} className={t.gold ? 'ht-trail-g' : 'ht-trail'} />
        ))}
      </g>

      <g className="ht-globe" filter="url(#ht-glow)">
        <circle cx={gcx} cy={gcy} r={gR} className="ht-rim" />
        {lon.map((rx, i) => <ellipse key={'lo' + i} cx={gcx} cy={gcy} rx={f1(rx)} ry={gR} className="ht-arc" />)}
        {lat.map((l, i) => <ellipse key={'la' + i} cx={gcx} cy={f1(l.y)} rx={f1(l.rx)} ry={f1(l.ry)} className="ht-arc" />)}
      </g>

      {/* six receding 3D rows, drawn back(tall) → front(short) */}
      {rows.map((row, ri) => (
        <g key={'R' + ri}>
          {row.bs.map((b) => {
            const xr = b.x + b.w
            const D = row.D
            const DY = D * 0.78
            const lit = b.cx > textEdge
            const bright = lit && row.d < 0.5
            return (
              <g key={'B' + b.bi}>
                <polygon style={{ fill: tone(SIDE, lit, row.d) }} points={`${f1(xr)},${f1(b.top)} ${f1(xr + D)},${f1(b.top - DY)} ${f1(xr + D)},${f1(BASE - DY)} ${f1(xr)},${BASE}`} />
                <polygon style={{ fill: tone(ROOF, lit, row.d) }} points={`${f1(b.x)},${f1(b.top)} ${f1(xr)},${f1(b.top)} ${f1(xr + D)},${f1(b.top - DY)} ${f1(b.x + D)},${f1(b.top - DY)}`} />
                <rect style={{ fill: tone(FRONT, lit, row.d) }} x={f1(b.x)} y={f1(b.top)} width={f1(b.w)} height={f1(BASE - b.top)} />
                {bright && <line className="ht-edge2" x1={f1(b.x + D)} y1={f1(b.top - DY)} x2={f1(xr + D)} y2={f1(b.top - DY)} />}
              </g>
            )
          })}
        </g>
      ))}

      <g className="ht-mesh" filter="url(#ht-glow)">
        {edges.map(([a, b], i) => (
          <line key={'e' + i} x1={f1(nodes[a].x)} y1={f1(nodes[a].y)} x2={f1(nodes[b].x)} y2={f1(nodes[b].y)} className="ht-edge" />
        ))}
      </g>

      <g className="ht-beams" filter="url(#ht-glow)">
        {beams.map((bm) => (
          <g key={'b' + bm.bi}>
            <line x1={f1(bm.x)} y1={f1(bm.base)} x2={f1(bm.x)} y2={f1(bm.top)} className={bm.gold ? 'ht-beam-g' : 'ht-beam'} />
            <circle cx={f1(bm.x)} cy={f1(bm.top)} r={bm.gold ? 1.4 : 1.15} className={bm.gold ? 'ht-dot-g' : 'ht-dot'} />
          </g>
        ))}
        {nodes.filter((n) => n.floating).map((n, i) => (
          <circle key={'fn' + i} cx={f1(n.x)} cy={f1(n.y)} r="1" className={n.gold ? 'ht-dot-g' : 'ht-dot'} />
        ))}
      </g>
    </svg>
  )
}
