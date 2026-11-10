/**
 * mylocalon mark — a location pin ("local") with a power symbol ("on").
 * `id` keeps gradient ids unique when several logos render on one page.
 */
export function Logo({ size = 24, id = "ml" }: { size?: number; id?: string }) {
  const pin = "M32 59.5C30.6 59.5 12.5 41.8 12.5 26.5a19.5 19.5 0 0 1 39 0C51.5 41.8 33.4 59.5 32 59.5Z";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <defs>
        <linearGradient id={`${id}-g`} x1="12" y1="7" x2="52" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6d5dfc" />
          <stop offset="1" stopColor="#22b8f0" />
        </linearGradient>
        <radialGradient id={`${id}-s`} cx="22" cy="14" r="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={pin} fill={`url(#${id}-g)`} />
      <path d={pin} fill={`url(#${id}-s)`} />
      <path d="M37.3 19.9a9.2 9.2 0 1 1-10.6 0M32 15.5v10" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}

/** The wordmark: "mylocal" + gradient "on". */
export function Wordmark() {
  return (
    <span className="wordmark">
      mylocal<span className="wordmark-on">on</span>
    </span>
  );
}
