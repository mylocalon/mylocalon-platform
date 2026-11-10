import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mylocalon",
  description: "Your localhost, on the internet: public HTTPS URLs for local apps.",
  metadataBase: new URL(process.env["BASE_URL"] ?? "https://mylocalon.com"),
  openGraph: { siteName: "mylocalon", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
