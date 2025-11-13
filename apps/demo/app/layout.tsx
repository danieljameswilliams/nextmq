import type { Metadata } from "next"
import { NextMQRootClientEventBridge, NextMQClientProvider } from "nextmq"
import { processor } from "./processors"

export const metadata: Metadata = {
  title: "NextMQ",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <NextMQRootClientEventBridge />

        <NextMQClientProvider processor={processor}>
          {children}
        </NextMQClientProvider>
      </body>
    </html>
  )
}
