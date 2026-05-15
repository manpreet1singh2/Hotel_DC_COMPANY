"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, ChevronDown } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] md:h-[90vh] lg:h-screen overflow-hidden">
      <Image
        src="/luxury-hotel-lobby.jpg"
        alt="Hotel DC Company - Luxury Lobby"
        fill
        className="object-cover absolute z-0"
        priority
      />
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        {/* Star rating badge */}
        <div className="flex items-center gap-1 mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-2 text-sm font-medium text-white/90">5-Star Luxury Experience</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
          Welcome to{" "}
          <span className="text-yellow-400">Hotel DC Company</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl text-white/85 leading-relaxed drop-shadow">
          Experience unforgettable luxury in the heart of the city. Discover our exclusive rooms,
          world-class dining, and exceptional services.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full text-base shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Link href="/rooms">Explore Rooms</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-105"
          >
            <Link href="/booking/select-room">Book Now</Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-7 w-7 text-white/60" />
        </div>
      </div>
    </section>
  )
}
