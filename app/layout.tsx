import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftImpact OS",
  description: "Campaign data source configuration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
