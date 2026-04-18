import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowState Experiences — City Activation Partner",
  description: "FlowState activates cities — outdoor events, destination marketing, and permanent waterfront experiences. Urban Slide, crawfish festivals, color runs, and more. Based in Houston, TX.",
  metadataBase: new URL("https://cityactivations.com"),
  openGraph: {
    title: "FlowState Experiences — City Activation Partner",
    description: "We bring the crowd, then the experience. Full-funnel city activation: event operations + destination marketing.",
    url: "https://cityactivations.com",
    siteName: "FlowState Experiences",
    images: [{ url: "/img-urban-slide.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowState Experiences",
    description: "City activation partner — events, marketing, waterfront experiences.",
    images: ["/img-urban-slide.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
