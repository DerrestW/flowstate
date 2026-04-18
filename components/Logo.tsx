import React from "react";

interface LogoProps {
  size?: number;
  variant?: "full" | "mark" | "nav";
  className?: string;
}

export function FlowStateLogo({ size = 40, variant = "full", className }: LogoProps) {
  const id = `grad_${Math.random().toString(36).slice(2, 8)}`;

  const Mark = () => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`${id}_orb`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="55%" stopColor="#8B3CF7" />
          <stop offset="100%" stopColor="#FF6B2B" />
        </linearGradient>
        <linearGradient id={`${id}_wave1`} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64B5F6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2196F3" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`${id}_wave2`} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#8B3CF7" />
        </linearGradient>
        <linearGradient id={`${id}_wave3`} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6B2B" />
          <stop offset="100%" stopColor="#FFB347" stopOpacity="0.8" />
        </linearGradient>
        <clipPath id={`${id}_clip`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" stroke={`url(#${id}_orb)`} strokeWidth="4" fill="none" opacity="0.8" />
      {/* Wave paths clipped to circle */}
      <g clipPath={`url(#${id}_clip)`}>
        {/* Wave 1 - top blue */}
        <path
          d="M 4 35 C 20 25, 30 45, 50 35 C 70 25, 80 45, 96 35 L 96 22 C 80 32, 70 12, 50 22 C 30 32, 20 12, 4 22 Z"
          fill={`url(#${id}_wave1)`}
        />
        {/* Wave 2 - mid blue/purple */}
        <path
          d="M 4 50 C 20 40, 30 60, 50 50 C 70 40, 80 60, 96 50 L 96 37 C 80 47, 70 27, 50 37 C 30 47, 20 27, 4 37 Z"
          fill={`url(#${id}_wave2)`}
        />
        {/* Wave 3 - bottom orange */}
        <path
          d="M 4 65 C 20 55, 30 75, 50 65 C 70 55, 80 75, 96 65 L 96 52 C 80 62, 70 42, 50 52 C 30 62, 20 42, 4 52 Z"
          fill={`url(#${id}_wave3)`}
        />
      </g>
    </svg>
  );

  if (variant === "mark") return <Mark />;

  if (variant === "nav") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Mark />
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
          <div style={{
            fontSize: 22, fontWeight: 900, fontStyle: "italic", letterSpacing: 1,
            background: "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>FLOWSTATE</div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: "rgba(248,246,242,0.45)", fontStyle: "normal" }}>EXPERIENCES</div>
        </div>
      </div>
    );
  }

  // Full hero variant
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Mark />
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
        <div style={{
          fontSize: size * 0.7, fontWeight: 900, fontStyle: "italic", letterSpacing: 2,
          background: "linear-gradient(90deg, #2196F3 0%, #8B3CF7 50%, #FF6B2B 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>FLOWSTATE</div>
        <div style={{ fontSize: size * 0.22, fontWeight: 600, letterSpacing: "0.25em", color: "rgba(248,246,242,0.5)", marginTop: 2 }}>EXPERIENCES</div>
      </div>
    </div>
  );
}
