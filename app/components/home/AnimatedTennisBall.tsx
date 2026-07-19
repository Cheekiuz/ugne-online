import './animated-tennis-ball.css';

type Props = {
  className?: string;
};

export function AnimatedTennisBall({className = ''}: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[1] ${className}`.trim()}
      aria-hidden
    >
      <div className="tennis-ball-track">
        <div className="tennis-ball-bounce size-12 sm:size-[3.25rem]">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
          <circle cx="24" cy="24" r="22" fill="#c8e62e" />
          <circle cx="24" cy="24" r="22" fill="url(#tennis-ball-shine)" />
          <path
            d="M8 24c0-8.8 7.2-16 16-16 4.2 0 8 1.6 10.9 4.3"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M40 24c0 8.8-7.2 16-16 16-4.2 0-8-1.6-10.9-4.3"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <defs>
            <radialGradient id="tennis-ball-shine" cx="0.35" cy="0.3" r="0.65">
              <stop offset="0%" stopColor="#e8f56a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#c8e62e" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        </div>
      </div>
    </div>
  );
}
