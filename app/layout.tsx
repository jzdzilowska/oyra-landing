import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oyra-materials.phia-4091.chatgpt.site"),
  title: "Oyra — Material sourcing software",
  description: "Oyra helps architects and interior designers compare materials, suppliers, prices, and alternatives. Bring your finish schedule and request a demo.",
  openGraph: { title: "Oyra — Material sourcing software", description: "Compare materials and supplier quotes with Oyra. Request a demo for your studio.", images: [{ url: "/images/declan-sun-staircase.jpg", alt: "Curved timber staircase photographed by Declan Sun" }], type: "website" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
