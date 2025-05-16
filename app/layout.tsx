import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { NextAuthProvider } from "./session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IoT Platform",
  description: "A comprehensive IoT management platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          <Providers>{children}</Providers>
        </NextAuthProvider>
      </body>
    </html>
  )
}
