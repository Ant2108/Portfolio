type IconProps = { className?: string };

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 12" fill="none" aria-hidden className={className} width="24" height="12">
      <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 24" fill="none" aria-hidden className={className} width="12" height="24">
      <path d="M6 0v22M1 17l5 5 5-5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

/** The crossed-line ornament used on filled labels (borrowed from the reference's HUD bars). */
export function Ornament({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 14" fill="none" aria-hidden className={className} width="28" height="14">
      <path d="M0 7h6M22 7h6M6 1l16 12M6 13L22 1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
