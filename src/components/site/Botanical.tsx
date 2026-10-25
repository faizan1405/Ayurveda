/** Hand-drawn style botanical line illustrations (custom SVG, inherit currentColor). */
export function LeafSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 220" fill="none" stroke="currentColor" strokeWidth="1" className={className} aria-hidden>
      <path d="M60 215 C60 160 58 100 62 10" />
      {[30, 60, 90, 120, 150].map((y, i) => (
        <g key={y}>
          <path d={`M61 ${y + 20} C${40 - i} ${y + 10} ${22 - i} ${y - 6} ${18 - i * 2} ${y - 20} C${36} ${y - 14} ${52} ${y} 61 ${y + 20}Z`} />
          <path d={`M61 ${y + 34} C${82 + i} ${y + 24} ${100 + i} ${y + 8} ${104 + i * 2} ${y - 6} C${86} ${y} ${70} ${y + 14} 61 ${y + 34}Z`} />
        </g>
      ))}
    </svg>
  );
}

export function Mandala({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.6" className={className} aria-hidden>
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="70" />
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={i} cx="100" cy="52" rx="10" ry="34" transform={`rotate(${i * 22.5} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="14" />
    </svg>
  );
}

export function LotusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" fill="none" stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <path d="M20 26 C14 20 14 10 20 2 C26 10 26 20 20 26Z" />
      <path d="M20 26 C12 24 6 18 4 10 C12 12 18 18 20 26Z" />
      <path d="M20 26 C28 24 34 18 36 10 C28 12 22 18 20 26Z" />
    </svg>
  );
}
