import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { MockAuthProvider } from "@/contexts/MockAuthContext";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deploy Monitor - CI/CD Deployment Tracker",
  description: "Baseball-style deployment monitoring platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <AuthProvider>
            <MockAuthProvider>
              {children}
            </MockAuthProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
