import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Hotel DC Company | Luxury Hotel & Suites",
  description:
    "Experience five-star luxury at Hotel DC Company. Book premium rooms, suites, fine dining, spa treatments and more. Unforgettable stays in the heart of the city.",
  keywords: "hotel, luxury hotel, hotel DC, suites, spa, fine dining, reservations, 5-star hotel",
  authors: [{ name: "Hotel DC Company" }],
  openGraph: {
    title: "Hotel DC Company | Luxury Hotel & Suites",
    description: "Experience five-star luxury at Hotel DC Company.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}