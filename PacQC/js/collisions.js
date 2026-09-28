// Premier contact de deux trajectoires linéaires par morceaux, temps en secondes.
// On résout le mouvement relatif : un croisement rapide ne peut pas être manqué.
function position(segment, time) {
  const t = segment.end > segment.start ? (time - segment.start) / (segment.end - segment.start) : 0;
  return { x: segment.from.x + (segment.to.x - segment.from.x) * t, y: segment.from.y + (segment.to.y - segment.from.y) * t };
}

export function firstContact(a, b, map, radius) {
  let earliest = Infinity;
  for (const left of a) for (const right of b) {
    const start = Math.max(left.start, right.start), end = Math.min(left.end, right.end);
    if (end < start) continue;
    const p = position(left, start), q = position(right, start);
    const pp = position(left, end), qq = position(right, end);
    const tunnel = left.from.y === map.tunnelRow && left.to.y === map.tunnelRow && right.from.y === map.tunnelRow && right.to.y === map.tunnelRow;
    for (const offset of tunnel ? [-map.width, 0, map.width] : [0]) {
      const x = p.x - q.x + offset, y = p.y - q.y;
      const dx = pp.x - p.x - (qq.x - q.x), dy = pp.y - p.y - (qq.y - q.y);
      const c = x * x + y * y - radius * radius;
      if (c <= 1e-12) { earliest = Math.min(earliest, start); continue; }
      const aa = dx * dx + dy * dy, bb = 2 * (x * dx + y * dy);
      const discriminant = bb * bb - 4 * aa * c;
      if (aa < 1e-20 || discriminant < 0) continue;
      const t = (-bb - Math.sqrt(discriminant)) / (2 * aa);
      if (t >= 0 && t <= 1) earliest = Math.min(earliest, start + t * (end - start));
    }
  }
  return earliest;
}
