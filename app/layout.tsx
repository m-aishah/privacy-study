import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-adult" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-kids" });

export const metadata: Metadata = {
  title: "PrivacyStudy",
  description: "Privacy-Preserving Video Anonymization for Human-Robot Interaction Research (UNBC)",
  icons: {
    icon: "/images/unbc_favicon_small_logo.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${nunito.variable} font-adult`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
