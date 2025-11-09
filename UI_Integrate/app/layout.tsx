import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Lora } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["700", "800", "900"],
})

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "EcoSnap - Your Carbon Footprint Calculator",
  description:
    "Measure and reduce your environmental impact by analyzing receipts and bills with AI-powered carbon footprint analysis.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${lora.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
