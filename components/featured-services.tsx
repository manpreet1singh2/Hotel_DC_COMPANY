"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Utensils, SpadeIcon as Spa, Dumbbell, Wifi, Car, Coffee, Users, ArrowRight } from "lucide-react"
import { getFeaturedServices } from "@/lib/api"

const categoryIcons: Record<string, any> = {
  Alimentación: Utensils, Food: Utensils,
  Bienestar: Spa, Wellness: Spa, Spa: Spa,
  Transporte: Car, Transport: Car,
  Limpieza: Coffee, Housekeeping: Coffee,
  Comunicaciones: Wifi, WiFi: Wifi,
  Recreación: Dumbbell, Fitness: Dumbbell,
  Otros: Users, Other: Users,
}

const FALLBACK = [
  { id: "1", name: "Fine Dining Restaurant", category: "Food", price: 80, description: "Award-winning international cuisine crafted by our executive chef in an elegant atmosphere." },
  { id: "2", name: "Luxury Spa & Wellness", category: "Spa", price: 120, description: "Full-service spa offering massages, facials, hydrotherapy, and holistic treatments." },
  { id: "3", name: "Airport Transfer", category: "Transport", price: 45, description: "Premium door-to-door transfers in our luxury fleet — punctual and stress-free." },
]

export default function FeaturedServices() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFeaturedServices()
        setServices(data && data.length > 0 ? data : FALLBACK)
      } catch {
        setServices(FALLBACK)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {services.map((service) => {
        const Icon = categoryIcons[service.category] || Users
        const isFree = !service.price || service.price === 0
        return (
          <div key={service.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className={`font-bold text-base ${isFree ? "text-green-600" : "text-gray-900"}`}>
                {isFree ? "Complimentary" : `From $${service.price}`}
              </span>
              <Link href="/services" className="text-primary hover:underline flex items-center text-sm font-medium">
                Learn more <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
