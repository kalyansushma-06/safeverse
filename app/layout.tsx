import type { Metadata } from "next";
import "./globals.css";
import SOSAlert from "@/components/SOSAlert";

export const metadata: Metadata = {
  title: "SafeVerse — AR Safety Training",
  description:
    "Scenario-based AR industrial safety training and certification."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SOSAlert />
      </body>
    </html>
  );
}