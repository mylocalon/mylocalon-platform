/** mylocalon mark: a local box with a link reaching out. */
export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="logo-mark">
      <rect x="2.5" y="9" width="9" height="9" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M11.5 13.5h4a4 4 0 0 0 4-4V5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 7.5l3-3 3 3" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
