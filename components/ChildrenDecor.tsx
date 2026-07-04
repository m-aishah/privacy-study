export function ChildrenDecor() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg
        className="absolute top-8 left-[-40px] w-40 h-auto opacity-70 animate-drift"
        viewBox="0 0 100 60"
        fill="none"
      >
        <ellipse cx="30" cy="30" rx="28" ry="18" fill="#FFFFFF" />
        <ellipse cx="55" cy="22" rx="22" ry="16" fill="#FFFFFF" />
        <ellipse cx="70" cy="34" rx="20" ry="14" fill="#FFFFFF" />
      </svg>

      <svg
        className="absolute top-16 right-[-20px] w-28 h-auto opacity-60 animate-drift"
        style={{ animationDelay: "2s" }}
        viewBox="0 0 100 60"
        fill="none"
      >
        <ellipse cx="30" cy="30" rx="28" ry="18" fill="#FFFFFF" />
        <ellipse cx="55" cy="22" rx="22" ry="16" fill="#FFFFFF" />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "6vh", minHeight: "36px" }}
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0 30 Q 20 0 40 30 T 80 30 T 120 30 T 160 30 T 200 30 T 240 30 T 280 30 T 320 30 T 360 30 T 400 30 T 440 30 T 480 30 T 520 30 T 560 30 T 600 30 T 640 30 T 680 30 T 720 30 T 760 30 T 800 30 T 840 30 T 880 30 T 920 30 T 960 30 T 1000 30 T 1040 30 T 1080 30 T 1120 30 T 1160 30 T 1200 30 V60 H0 Z"
          fill="#00B4D8"
          opacity="0.25"
        />
      </svg>
    </div>
  );
}
