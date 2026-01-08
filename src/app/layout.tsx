import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Nansen Times - All The News That's Fit To Track",
  description: "AI-generated crypto news covering whale movements, smart money flows, and onchain events. Powered by Nansen intelligence.",
  openGraph: {
    title: "The Nansen Times",
    description: "AI-generated crypto news covering whale movements and onchain events",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Nansen Times",
    description: "AI-generated crypto news covering whale movements and onchain events",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
