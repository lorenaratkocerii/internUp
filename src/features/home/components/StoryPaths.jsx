const threads = [
  { d: 'M40 590V500H90V430H60V340H130V250H170V180H200V170', color: 'stroke-navy', start: 'fill-navy', x: 40 },
  { d: 'M150 590V520H110V440H170V360H140V280H190V210H200V170', color: 'stroke-terracotta', start: 'fill-terracotta', x: 150 },
  { d: 'M250 590V510H300V420H240V330H270V240H220V200H200V170', color: 'stroke-olive', start: 'fill-olive', x: 250 },
  { d: 'M360 590V490H320V400H350V300H290V220H230V170H200', color: 'stroke-mauve', start: 'fill-mauve', x: 360 },
];

const closedDoors = [
  { d: 'M60 430H18', x: 18, y: 430, at: 0.375 },
  { d: 'M170 360H214', x: 214, y: 360, at: 0.54 },
  { d: 'M300 420H372', x: 372, y: 420, at: 0.35 },
  { d: 'M290 300H246', x: 246, y: 300, at: 0.66 },
];

const clamp = (value) => Math.min(1, Math.max(0, value));

export function StoryPaths({ progress, className = '' }) {
  const threadsDrawn = clamp(progress / 0.72);
  const trunkDrawn = clamp((progress - 0.72) / 0.2);
  const logoVisible = progress >= 0.92;

  return (
    <svg viewBox="0 0 400 600" fill="none" aria-hidden="true" className={className}>
      {closedDoors.map(({ d, x, y, at }) => (
        <g
          key={d}
          strokeWidth="2"
          className={`stroke-charcoal/45 transition-opacity duration-500 ${threadsDrawn >= at ? 'opacity-100' : 'opacity-0'}`}
        >
          <path d={d} strokeDasharray="4 5" />
          <path d={`M${x - 6} ${y - 6}l12 12m0-12l-12 12`} />
        </g>
      ))}

      {threads.map(({ d, color }) => (
        <path
          key={d}
          d={d}
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - threadsDrawn}
          strokeWidth="4"
          className={color}
        />
      ))}

      <path
        d="M200 172V70"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - trunkDrawn}
        strokeWidth="14"
        className="stroke-charcoal"
      />

      <g
        className={`origin-[200px_70px] transition-transform duration-500 ease-out ${logoVisible ? 'scale-y-100' : 'scale-y-0'}`}
      >
        <rect x="176" y="48" width="14" height="22" className="fill-terracotta" />
        <rect x="193" y="30" width="14" height="40" className="fill-charcoal" />
        <rect x="210" y="10" width="14" height="60" className="fill-charcoal" />
      </g>

      {threads.map(({ x, start }) => (
        <rect key={x} x={x - 9} y="582" width="18" height="18" className={start} />
      ))}
    </svg>
  );
}
