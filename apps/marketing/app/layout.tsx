import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextMQRootClientEventBridge, NextMQClientProvider, NextMQDevTools } from "nextmq";
import processor from "./processors";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NextMQ - Message Queue for Next.js",
  description: "A tiny queue + actions runtime for Next.js. Simple, standard, and tightly coupled with Next.js. CustomEvent + Context + code-splitting friendly.",
  keywords: ["nextjs", "queue", "events", "messages", "CustomEvent", "actions", "react"],
  openGraph: {
    title: "NextMQ - Message Queue for Next.js",
    description: "A tiny queue + actions runtime for Next.js. Simple, standard, and tightly coupled with Next.js.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        <NextMQRootClientEventBridge />
        <NextMQClientProvider processor={processor}>
          {children}
          <NextMQDevTools />
        </NextMQClientProvider>
      </body>
    </html>
  );
}
