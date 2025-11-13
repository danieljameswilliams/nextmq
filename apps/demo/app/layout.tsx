import type { Metadata } from "next"
import { NextMQRootClientEventBridge } from "nextmq"
import NextMQWrapper from "./NextMQWrapper"

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

        <NextMQWrapper>{children}</NextMQWrapper>
      </body>
    </html>
  )
}
