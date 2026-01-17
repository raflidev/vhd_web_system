import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valvular Heart Disease | Silent Damage, Deadly Impact",
  description:
    "Valvular Heart Disease (VHD) is one of the leading contributors to cardiovascular mortality worldwide. Discover AI-driven detection technology that can save lives.",
  keywords: [
    "Valvular Heart Disease",
    "VHD",
    "Heart Health",
    "Cardiovascular",
    "AI Detection",
    "Deep Learning",
    "Medical Technology",
    "Heart Valves",
    "Phonocardiogram",
    "PCG Signals",
  ],
  authors: [{ name: "VHD Research Team" }],
  openGraph: {
    title: "Valvular Heart Disease | Silent Damage, Deadly Impact",
    description:
      "Discover how AI-driven technology is revolutionizing early detection of Valvular Heart Disease.",
    type: "website",
    locale: "en_US",
    siteName: "VHD Detection System",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valvular Heart Disease | Silent Damage, Deadly Impact",
    description:
      "Discover how AI-driven technology is revolutionizing early detection of Valvular Heart Disease.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
