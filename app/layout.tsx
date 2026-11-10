import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { ConfirmHost, Toaster } from "./_site/ui";
import { AUTHORS, SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "mylocalon — Open-source localhost tunnels with HTTPS", template: "%s" },
  description: SITE.shortDescription,
  applicationName: SITE.name,
  metadataBase: new URL(process.env["BASE_URL"] ?? "https://mylocalon.com"),
  authors: AUTHORS.map((a) => ({ name: a.name, url: a.linkedin })),
  creator: AUTHORS.map((a) => a.name).join(", "),
  publisher: SITE.name,
  category: "technology",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
  openGraph: { siteName: SITE.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // paint edge-to-edge; content pads with env(safe-area-inset-*)
  interactiveWidget: "resizes-content",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#09090f" },
  ],
};

// Applies the saved theme before first paint (no light/dark flash).
const THEME_SCRIPT = `try{var t=localStorage.getItem("ml-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {children}
        <Toaster />
        <ConfirmHost />
      </body>
    </html>
  );
}
