/* Illustrated images generated as inline SVG (no downloads needed). */

export const scene = (emoji, a, b, w = 800, h = 400) =>
  'data:image/svg+xml,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><circle cx="${w * 0.82}" cy="${h * 0.22}" r="${h * 0.4}" fill="#fff" opacity=".13"/><circle cx="${w * 0.12}" cy="${h * 0.85}" r="${h * 0.32}" fill="#fff" opacity=".1"/><path d="M0 ${h * 0.82}Q${w * 0.25} ${h * 0.62} ${w * 0.5} ${h * 0.8}T${w} ${h * 0.75}V${h}H0z" fill="#000" opacity=".18"/><path d="M0 ${h * 0.9}Q${w * 0.3} ${h * 0.75} ${w * 0.6} ${h * 0.88}T${w} ${h * 0.85}V${h}H0z" fill="#000" opacity=".25"/><text x="${w / 2}" y="${h * 0.62}" font-size="${h * 0.42}" text-anchor="middle">${emoji}</text></svg>`)

/* Deterministic cartoon avatar from a name. */
export const avatar = (name) => {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const skin = ['#f5c9a0', '#e0a878', '#c68642', '#8d5524'][h % 4]
  const hair = ['#2b1b17', '#4a2c1a', '#111', '#6b3f1d'][(h >> 2) % 4]
  const bg = ['#c7d2fe', '#fbcfe8', '#bbf7d0', '#fde68a', '#bae6fd'][(h >> 4) % 5]
  const long = (h >> 6) % 2
  const shirt = ['#5b3df5', '#ff4d7a', '#0ea5e9', '#22d3a6'][h % 4]
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${bg}"/>${long ? `<path d="M24 50Q22 18 50 18T76 50V80H24z" fill="${hair}"/>` : ''}<path d="M12 100Q14 68 50 68T88 100z" fill="${shirt}"/><rect x="43" y="56" width="14" height="14" fill="${skin}"/><circle cx="50" cy="44" r="21" fill="${skin}"/><path d="M29 42Q28 20 50 22T71 42Q64 30 50 30T29 42z" fill="${hair}"/><circle cx="43" cy="46" r="2" fill="#222"/><circle cx="57" cy="46" r="2" fill="#222"/><path d="M43 54Q50 60 57 54" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`)
  )
}
