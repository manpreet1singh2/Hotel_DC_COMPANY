import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Star, Users, Award, MapPin, Heart, Shield, Leaf, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us | Hotel DC Company",
  description: "Discover the story, values, and team behind Hotel DC Company — a symbol of luxury hospitality since 1985.",
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="/luxury-hotel-lobby.jpg"
          alt="Hotel DC Company Lobby"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">About Hotel DC Company</h1>
          <p className="text-white/80 max-w-xl text-base">
            A legacy of excellence, elegance, and exceptional hospitality since 1985.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "1985", label: "Founded" },
            { value: "50+", label: "Luxury Rooms" },
            { value: "10K+", label: "Happy Guests" },
            { value: "15+", label: "Awards Won" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our History</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Four Decades of Excellence</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 1985, Hotel DC Company has been a symbol of elegance and world-class hospitality for over
              four decades. What began as a boutique property in the heart of Madrid has grown into one of the
              most sought-after luxury destinations for discerning travellers worldwide.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every detail — from our hand-picked furnishings to our award-winning cuisine — reflects our
              unwavering commitment to making each guest feel truly at home in the lap of luxury.
            </p>
          </div>
          <div className="relative h-72 rounded-2xl overflow-hidden shadow-xl">
            <Image src="/luxury-suite-living-room.jpg" alt="Hotel DC Lobby" fill className="object-cover" />
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gray-50 rounded-2xl p-10 text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-5">Redefining Luxury Hospitality</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Our mission is to deliver unforgettable experiences by combining impeccable five-star service, lavish
            amenities, and an atmosphere that celebrates the richness of our city. We strive to exceed expectations
            at every touchpoint — from the moment of booking to the moment of departure.
          </p>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">What Drives Us</p>
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: Star, title: "Excellence", desc: "We set the highest standards in everything we do — from room prep to guest interactions." },
              { Icon: Heart, title: "Genuine Care", desc: "Every guest is treated like family. Your comfort is our top priority, always." },
              { Icon: Leaf, title: "Sustainability", desc: "We are committed to eco-friendly practices that protect the environment for future generations." },
              { Icon: Lightbulb, title: "Innovation", desc: "We continuously evolve, embracing new ideas and technology to enhance your experience." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">The People</p>
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Leadership</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { name: "Carlos Ramírez", role: "General Manager", initials: "CR", color: "bg-blue-100 text-blue-700" },
              { name: "Laura Martínez", role: "Head of Guest Relations", initials: "LM", color: "bg-rose-100 text-rose-700" },
              { name: "Sofía Moreno", role: "Executive Chef", initials: "SM", color: "bg-amber-100 text-amber-700" },
            ].map((m) => (
              <div key={m.name} className="text-center">
                <div className={`w-20 h-20 ${m.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold`}>
                  {m.initials}
                </div>
                <h3 className="font-semibold text-gray-900">{m.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="bg-gray-900 text-white rounded-2xl p-10">
          <div className="text-center mb-8">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">Recognition</p>
            <h2 className="text-3xl font-bold">Awards & Accolades</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { Icon: Award, title: "5-Star Rating", body: "Consistently rated five stars by leading hospitality associations worldwide." },
              { Icon: Users, title: "Guest Favourite", body: "Voted #1 hotel in Madrid by travellers for three consecutive years." },
              { Icon: Shield, title: "Safety Certified", body: "Certified by the International Hotel Safety & Hygiene Council." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <Award className="h-8 w-8 text-yellow-400 mb-3" />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience the DC Difference?</h2>
          <p className="text-gray-600 mb-6">Book your stay today and discover why thousands of guests keep coming back.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/booking/select-room">Book Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
