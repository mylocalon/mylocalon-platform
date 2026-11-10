/** Small line icons (24px grid, currentColor). */
type P = { size?: number; className?: string };
function I({ size = 18, className, d }: P & { d: string[] }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {d.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}
export const IconTunnel = (p: P) => <I {...p} d={["M4 17a8 8 0 0 1 16 0", "M8 17a4 4 0 0 1 8 0", "M12 17v.01", "M3 20h18"]} />;
export const IconGlobe = (p: P) => <I {...p} d={["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M3.6 9h16.8M3.6 15h16.8", "M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"]} />;
export const IconKey = (p: P) => <I {...p} d={["M15 7a4 4 0 1 1-3.5 6L5 19.5V22H2.5v-2.5l7.5-7.5A4 4 0 0 1 15 7Z", "M16 8h.01"]} />;
export const IconFolder = (p: P) => <I {...p} d={["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"]} />;
export const IconBook = (p: P) => <I {...p} d={["M4 19.5V5a2 2 0 0 1 2-2h13v16H6.5A2.5 2.5 0 0 0 4 21.5", "M4 19.5A2.5 2.5 0 0 1 6.5 17H19"]} />;
export const IconCopy = (p: P) => <I {...p} d={["M9 9h10v10H9z", "M5 15V5h10"]} />;
export const IconCheck = (p: P) => <I {...p} d={["M5 12.5l4.5 4.5L19 7.5"]} />;
export const IconX = (p: P) => <I {...p} d={["M6 6l12 12M18 6L6 18"]} />;
export const IconAlert = (p: P) => <I {...p} d={["M12 9v4M12 17h.01", "M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"]} />;
export const IconExternal = (p: P) => <I {...p} d={["M14 4h6v6", "M20 4l-9 9", "M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"]} />;
export const IconSun = (p: P) => <I {...p} d={["M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"]} />;
export const IconMoon = (p: P) => <I {...p} d={["M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"]} />;
export const IconMonitor = (p: P) => <I {...p} d={["M3 5h18v11H3z", "M8 20h8M12 16v4"]} />;
export const IconSearch = (p: P) => <I {...p} d={["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "M20 20l-4-4"]} />;
export const IconLogout = (p: P) => <I {...p} d={["M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3", "M10 17l-5-5 5-5", "M5 12h11"]} />;
export const IconPlus = (p: P) => <I {...p} d={["M12 5v14M5 12h14"]} />;
export const IconArrowRight = (p: P) => <I {...p} d={["M5 12h14", "M13 6l6 6-6 6"]} />;
export const IconShield = (p: P) => <I {...p} d={["M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z", "M9 12l2 2 4-4"]} />;
export const IconLink = (p: P) => <I {...p} d={["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"]} />;
export const IconRefresh = (p: P) => <I {...p} d={["M20 11a8 8 0 1 0-2.3 5.7", "M20 4v7h-7"]} />;
export const IconChart = (p: P) => <I {...p} d={["M4 19V10M10 19V5M16 19v-7M22 19H2"]} />;
export const IconCode = (p: P) => <I {...p} d={["M8 7l-5 5 5 5", "M16 7l5 5-5 5", "M14 4l-4 16"]} />;
export const IconWebhook = (p: P) => <I {...p} d={["M18 16.5a3 3 0 1 0-2.6-4.5H9", "M6 16.5a3 3 0 1 0 3 3V13l3-5", "M12 8a3 3 0 1 0-1-.2"]} />;
export const IconPhone = (p: P) => <I {...p} d={["M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z", "M11 18h2"]} />;
export const IconUsers = (p: P) => <I {...p} d={["M16 19a4 4 0 0 0-8 0", "M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M20 19a3 3 0 0 0-3-3M17 6a2.5 2.5 0 0 1 0 5"]} />;
export const IconLock = (p: P) => <I {...p} d={["M6 11h12v9H6z", "M8.5 11V8a3.5 3.5 0 0 1 7 0v3"]} />;
export const IconStar = (p: P) => <I {...p} d={["M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9Z"]} />;
export function IconGitHub({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function IconLinkedIn({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
