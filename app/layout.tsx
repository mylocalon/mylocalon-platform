import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { ConfirmHost, Toaster } from "./_site/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "mylocalon",
  description: "Your localhost, on the internet: public HTTPS URLs for local apps.",
  metadataBase: new URL(process.env["BASE_URL"] ?? "https://mylocalon.com"),
  openGraph: { siteName: "mylocalon", type: "website" },
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
