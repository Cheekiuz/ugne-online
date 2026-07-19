import './walking-duck.css';

type WalkingDuckProps = {
  className?: string;
};

export function WalkingDuck({className = ''}: WalkingDuckProps) {
  return (
    <div className={`walking-duck shrink-0 ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="walking-duck__svg">
        <g className="walking-duck__body">
          <ellipse cx="24" cy="30" rx="13" ry="9" fill="currentColor" />
          <circle cx="33" cy="20" r="7.5" fill="currentColor" />
          <circle cx="36.5" cy="18" r="1.2" fill="#1a2a22" />
          <path d="M39 20.5 L44 21.5 L39 23.2 Z" fill="#f5b942" />
          <path d="M18 24 C14 22 12 26 14 29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g className="walking-duck__foot--left">
          <path d="M18 37 L16 41 M22 37 L20 41" stroke="#f5b942" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <g className="walking-duck__foot--right">
          <path d="M26 37 L24 41 M30 37 L28 41" stroke="#f5b942" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
