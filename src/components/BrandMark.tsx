/* ClauseCompass brand mark — replace with final logo asset when ready.
   The mark combines a compass rose with a document/scales motif.
   Works at 24px, 32px, and 48px on dark backgrounds.
   To swap: replace the SVG paths below with the final brand SVG. */

interface BrandMarkProps {
  size?: number;
}

export default function BrandMark({ size = 32 }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ClauseCompass"
      role="img"
    >
      {/* Outer ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="url(#cc-ring-grad)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Inner glow fill */}
      <circle cx="16" cy="16" r="12" fill="url(#cc-fill-grad)" />

      {/* Compass cardinal arms — N/S/E/W subtle cross */}
      <line x1="16" y1="5"  x2="16" y2="11" stroke="#20F29C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="16" y1="21" x2="16" y2="27" stroke="#16C784" strokeWidth="1"   strokeLinecap="round" opacity="0.35" />
      <line x1="5"  y1="16" x2="11" y2="16" stroke="#16C784" strokeWidth="1"   strokeLinecap="round" opacity="0.35" />
      <line x1="21" y1="16" x2="27" y2="16" stroke="#16C784" strokeWidth="1"   strokeLinecap="round" opacity="0.35" />

      {/* Scales beam — horizontal bar */}
      <line x1="10" y1="16" x2="22" y2="16" stroke="#DAF1DE" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />

      {/* Scales left pan */}
      <path
        d="M10 16 L8 20 Q10 22 12 20 Z"
        fill="none"
        stroke="url(#cc-left-grad)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Scales right pan */}
      <path
        d="M22 16 L20 20 Q22 22 24 20 Z"
        fill="none"
        stroke="url(#cc-right-grad)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Centre pivot dot */}
      <circle cx="16" cy="16" r="1.8" fill="#20F29C" />
      <circle cx="16" cy="16" r="0.9" fill="#031314" />

      {/* North point diamond */}
      <polygon
        points="16,4 17.2,7.5 16,9 14.8,7.5"
        fill="url(#cc-north-grad)"
        opacity="0.95"
      />

      <defs>
        <linearGradient id="cc-ring-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#20F29C" />
          <stop offset="100%" stopColor="#0BDA51" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="cc-fill-grad" cx="50%" cy="35%" r="55%">
          <stop offset="0%"   stopColor="#163832" />
          <stop offset="100%" stopColor="#051F20" />
        </radialGradient>
        <linearGradient id="cc-left-grad" x1="8" y1="16" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#20F29C" />
          <stop offset="100%" stopColor="#16C784" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cc-right-grad" x1="20" y1="16" x2="24" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#9FE2BF" />
          <stop offset="100%" stopColor="#16C784" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cc-north-grad" x1="16" y1="4" x2="16" y2="9" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#20F29C" />
          <stop offset="100%" stopColor="#16C784" />
        </linearGradient>
      </defs>
    </svg>
  );
}
