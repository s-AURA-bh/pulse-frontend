import type { Metadata } from "next";
import "./globals.css";
import { RootChrome } from "@/components/root-chrome";

export const metadata: Metadata = {
  title: {
    default: "Pulse",
    template: "%s · Pulse"
  },
  description: "Pulse - Personal Life Management Platform",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <RootChrome>{children}</RootChrome>
      </body>
    </html>
  );
}
