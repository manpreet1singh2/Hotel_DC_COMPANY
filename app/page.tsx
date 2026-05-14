import Link from "next/link"
import Image from "next/image"
import { Users, MapPin, Star, Utensils, Shield, Clock } from "lucide-react"
import FeaturedRooms from "@/components/featured-rooms"
import HeroSection from "@/components/hero-section"
import { Button } from "@/components/ui/button"
import FeaturedServices from "@/components/featured-services"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Stats Bar */}
      <div className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "50+", label: "Luxury Rooms" },
              { value: "15+", label: "Years of Excellence" },
              { value: "10K+", label: "Happy Guests" },
              { value: "5★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-yellow-400">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Rooms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Our Accommodations</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Rooms & Suites</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Each room is thoughtfully designed for your comfort and relaxation.
          </p>
        </div>
        <FeaturedRooms />
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/rooms">View All Rooms</Link>
          </Button>
        </div>
      </section>

      {/* Luxury Experience Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative h-80 lg:h-auto min-h-[400px]">
              <Image
                src="/luxury-suite-living-room.jpg"
                alt="Luxury Suite Experience"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-white p-10 flex flex-col justify-center">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">The DC Experience</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Redefining Luxury Hospitality</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At Hotel DC Company, we believe every stay should be extraordinary. Our commitment to excellence
                is reflected in every detail — from elegant décor to the personalized service we offer each guest.
              </p>
              <div className="grid grid-cols-2 gap-5 mb-8">
                {[
                  { Icon: Star, title: "5-Star Service", desc: "24/7 personalized attention" },
                  { Icon: MapPin, title: "Prime Location", desc: "In the heart of the city" },
                  { Icon: Utensils, title: "Fine Dining", desc: "International award-winning chefs" },
                  { Icon: Users, title: "Special Events", desc: "Versatile venues for all occasions" },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="self-start">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">World-Class Services</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            From fine dining to spa treatments, every amenity is crafted for your pleasure.
          </p>
        </div>
        <FeaturedServices />
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold">The Hotel DC Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: MapPin,
                title: "Prime Location",
                desc: "Situated in the heart of the city, with easy access to attractions, shops, and restaurants.",
              },
              {
                Icon: Shield,
                title: "Luxury Experience",
                desc: "Enjoy premium amenities and personalized service for an unforgettable stay.",
              },
              {
                Icon: Clock,
                title: "24/7 Dedicated Staff",
                desc: "Our professional team is available around the clock to ensure your comfort.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Guest Reviews</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Guests Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "María García",
              location: "Madrid, Spain",
              review: "An unforgettable experience. The rooms are spacious and elegant, the staff is extremely attentive, and the location is perfect.",
              initials: "MG",
            },
            {
              name: "Carlos Rodríguez",
              location: "Barcelona, Spain",
              review: "The hotel's restaurant offers one of the best gastronomic experiences I've ever had. I will definitely return on my next visit.",
              initials: "CR",
            },
            {
              name: "Ana Martínez",
              location: "Valencia, Spain",
              review: "The spa facilities are exceptional. I felt completely rejuvenated after my treatment. The staff is professional and very kind.",
              initials: "AM",
            },
          ].map((t) => (
            <div key={t.name} className="bg-white border border-gray-100 p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-5 italic leading-relaxed">"{t.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{t.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for an Extraordinary Stay?</h2>
          <p className="text-white/80 text-lg mb-8">Book your room today and receive complimentary breakfast for two.</p>
          <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 rounded-full">
            <Link href="/booking/select-room">Reserve Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
