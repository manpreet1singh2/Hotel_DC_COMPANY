"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Utensils, Dumbbell, SpadeIcon as Spa, Wifi, Car, Coffee, Users, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getServices } from "@/lib/api"
import type { Service } from "@/lib/types"

const categoryIcons: Record<string, any> = {
  Alimentación: Utensils, Food: Utensils,
  Bienestar: Spa, Wellness: Spa, Spa: Spa,
  Transporte: Car, Transport: Car,
  Limpieza: Coffee, Housekeeping: Coffee,
  Comunicaciones: Wifi, WiFi: Wifi,
  Recreación: Dumbbell, Fitness: Dumbbell,
  Otros: Users, Other: Users,
}

const FALLBACK_SERVICES = [
  { id: "s1", name: "Fine Dining Restaurant", category: "Food", price: 80, description: "Savour world-class cuisine crafted by our award-winning chef. A gastronomic journey through international flavours." },
  { id: "s2", name: "Luxury Spa & Wellness", category: "Spa", price: 120, description: "Indulge in our full-service spa with massages, facials, hydrotherapy, and holistic treatments for total rejuvenation." },
  { id: "s3", name: "Airport Transfer", category: "Transport", price: 45, description: "Premium door-to-door airport transfers in our luxury fleet. Punctual, comfortable, and hassle-free." },
  { id: "s4", name: "Fitness Centre", category: "Fitness", price: 0, description: "State-of-the-art gym with the latest equipment, personal trainers, and yoga classes available daily." },
  { id: "s5", name: "High-Speed WiFi", category: "WiFi", price: 0, description: "Complimentary gigabit WiFi throughout the hotel — in your room, lobby, pool area, and conference rooms." },
  { id: "s6", name: "Concierge Service", category: "Other", price: 0, description: "Our dedicated concierge team is available 24/7 to handle any request — tickets, reservations, and more." },
  { id: "s7", name: "Rooftop Bar", category: "Food", price: 30, description: "Enjoy signature cocktails and light bites with panoramic city views from our stunning rooftop bar." },
  { id: "s8", name: "Housekeeping", category: "Housekeeping", price: 0, description: "Daily housekeeping with premium amenities replenished. Evening turndown service available upon request." },
  { id: "s9", name: "Business Centre", category: "Other", price: 20, description: "Fully equipped business centre with meeting rooms, high-speed internet, and audiovisual equipment." },
]

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getServices()
        setServices(data && data.length > 0 ? data : FALLBACK_SERVICES)
      } catch {
        setServices(FALLBACK_SERVICES)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Exclusive Services</h1>
          <p className="text-gray-400 max-w-xl">
            From world-class dining to bespoke wellness treatments — every service is designed to make your stay extraordinary.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => {
            const IconComponent = categoryIcons[service.category] || Users
            const isFree = !service.price || service.price === 0
            return (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-40 bg-gradient-to-br from-primary/5 to-primary/15 flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary bg-white/70 px-3 py-0.5 rounded-full">
                    {service.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{service.name}</h3>
                    <span className={`text-sm font-bold ml-3 shrink-0 ${isFree ? "text-green-600" : "text-gray-900"}`}>
                      {isFree ? "Free" : `$${service.price}`}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/booking/select-room">
                      Book This Service <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Special Packages */}
        <div className="bg-gray-900 text-white rounded-2xl p-10 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-3">Exclusive Offers</p>
              <h2 className="text-3xl font-bold mb-4">Special Packages</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Discover our curated packages combining luxury accommodation with exclusive experiences.
                From romantic getaways to family adventures — there's something for every occasion.
              </p>
              <Button asChild className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold">
                <Link href="/booking/select-room">Explore Packages</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Romantic Escape", desc: "Suite + Spa + Candlelit Dinner", price: "$680" },
                { label: "Family Fun", desc: "Family Suite + Activities", price: "$490" },
                { label: "Business Pro", desc: "Room + Meeting Room + Transfers", price: "$350" },
                { label: "Wellness Retreat", desc: "Suite + Daily Spa + Yoga", price: "$720" },
              ].map((pkg) => (
                <div key={pkg.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-yellow-400 font-bold text-sm mb-1">{pkg.price}</div>
                  <div className="font-semibold text-sm mb-1">{pkg.label}</div>
                  <div className="text-gray-400 text-xs">{pkg.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why our services */}
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">The DC Standard</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Everything we offer is held to an uncompromising five-star standard.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { Icon: Star, title: "Award-Winning Quality", desc: "Our services have been recognized by leading hospitality associations worldwide." },
            { Icon: Users, title: "Personalised for You", desc: "Every service can be customised to your preferences and dietary or lifestyle needs." },
            { Icon: Coffee, title: "Available 24/7", desc: "Room service, concierge, and reception are available around the clock, every day." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-primary rounded-2xl py-14 px-4 text-white">
          <h2 className="text-3xl font-bold mb-3">Need a Personalised Experience?</h2>
          <p className="text-white/80 mb-7 max-w-xl mx-auto">
            Our concierge team is available 24/7 for any special requests, arrangements, or bespoke packages.
          </p>
          <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 rounded-full">
            <Link href="/contact">Contact Our Concierge</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
