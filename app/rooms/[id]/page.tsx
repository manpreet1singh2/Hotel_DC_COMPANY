import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Users, Wifi, Coffee, Tv, Bath, Check, ArrowLeft, Star, Shield } from "lucide-react"
import { getRoomById } from "@/lib/api"
import BookingForm from "@/components/booking-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const getRoomImage = (room: any): string => {
  if (room.image && !room.image.includes("placeholder")) return room.image
  const tipo = room.tipo || room.name || ""
  if (tipo.includes("Suite") || tipo.includes("suite")) return "/luxury-suite-bedroom.jpg"
  if (tipo.includes("Doble") || tipo.includes("Deluxe")) return "/deluxe-room-bedroom.jpg"
  if (tipo.includes("Familiar") || tipo.includes("Family")) return "/family-suite-bedroom.jpg"
  return "/standard-room-bedroom.jpg"
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const room = await getRoomById(params.id)
    return {
      title: `${room.name} | Hotel DC Company`,
      description: room.description || `Luxury ${room.tipo} room at Hotel DC Company.`,
    }
  } catch {
    return { title: "Room Details | Hotel DC Company" }
  }
}

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  let room: any = null
  try {
    room = await getRoomById(params.id)
  } catch {
    room = null
  }

  // Fallback room data for static IDs
  if (!room) {
    const fallbacks: Record<string, any> = {
      "f1": { id: "f1", name: "Standard Single Room", tipo: "Sencilla", precio: 150, price: 150, capacity: 1, capacidad: 1, isAvailable: true, amenities: ["WiFi", "TV", "Air Conditioning"], description: "A comfortable, well-appointed single room perfect for solo travellers. Features a plush single bed, work desk, flat-screen TV, and high-speed WiFi." },
      "f2": { id: "f2", name: "Deluxe Double Room", tipo: "Doble", precio: 220, price: 220, capacity: 2, capacidad: 2, isAvailable: true, amenities: ["WiFi", "TV", "Minibar", "Air Conditioning"], description: "Spacious double room with elegant décor, two plush beds, a minibar, and stunning city views. Ideal for couples or business travellers." },
      "f3": { id: "f3", name: "Presidential Suite", tipo: "Suite", precio: 450, price: 450, capacity: 4, capacidad: 4, isAvailable: true, amenities: ["WiFi", "TV", "Jacuzzi", "Balcony", "Minibar"], description: "Our flagship suite boasts a private living area, panoramic balcony, private jacuzzi, and bespoke concierge service. The ultimate luxury experience." },
      "f4": { id: "f4", name: "Family Suite", tipo: "Suite", precio: 380, price: 380, capacity: 6, capacidad: 6, isAvailable: true, amenities: ["WiFi", "TV", "Kitchen", "Air Conditioning"], description: "Generously sized family suite with multiple bedrooms, a fully equipped kitchen, and kid-friendly amenities for an unforgettable family holiday." },
      "f5": { id: "f5", name: "Deluxe King Room", tipo: "Doble", precio: 260, price: 260, capacity: 2, capacidad: 2, isAvailable: false, amenities: ["WiFi", "King Bed", "Minibar", "Air Conditioning"], description: "A sophisticated king room featuring premium linen, marble bathroom, and an elegant minibar. Perfect for a romantic getaway." },
      "f6": { id: "f6", name: "Luxury Suite", tipo: "Suite", precio: 550, price: 550, capacity: 3, capacidad: 3, isAvailable: true, amenities: ["WiFi", "Jacuzzi", "Living Room", "Balcony"], description: "An opulent suite with a private jacuzzi, expansive living room, and private balcony overlooking the city skyline." },
    }
    room = fallbacks[params.id] || fallbacks["f1"]
  }

  const roomImage = getRoomImage(room)
  const price = room.price ?? room.precio ?? 0
  const capacity = room.capacity ?? room.capacidad ?? 2
  const available = room.isAvailable ?? room.estado === "Disponible"
  const amenities = room.amenities ?? (room.servicios_incluidos ? room.servicios_incluidos.split(", ") : [])

  const features = [
    { name: "Free High-Speed WiFi", icon: Wifi },
    { name: "Premium Coffee Maker", icon: Coffee },
    { name: '55" Smart TV', icon: Tv },
    { name: "Luxury Bathroom", icon: Bath },
    { name: "Air Conditioning", icon: Check },
    { name: "In-Room Safe", icon: Shield },
    { name: "Stocked Minibar", icon: Check },
    { name: "24h Room Service", icon: Check },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to All Rooms
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline">{room.tipo}</Badge>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {available ? "Available" : "Currently Occupied"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                <span className="text-sm text-gray-500 ml-1">5-Star Luxury</span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image src={roomImage} alt={room.name} fill className="object-cover" priority />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-5">
              <div className="flex items-center text-gray-600 gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">Up to <strong>{capacity}</strong> guests</span>
              </div>
              <div className="flex items-center text-gray-600 gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm">Available year-round</span>
              </div>
            </div>

            {/* Description & Amenities */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Room Description</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {room.description || `Experience the finest in luxury accommodation with our ${room.name}. Every detail has been thoughtfully curated to ensure your stay is extraordinary.`}
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">Included Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenities.length > 0
                  ? amenities.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-primary shrink-0" /> {a}
                    </div>
                  ))
                  : features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <f.icon className="h-4 w-4 text-primary shrink-0" /> {f.name}
                    </div>
                  ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Check-in & Check-out</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex justify-between">
                      <span>Check-in:</span>
                      <span className="font-medium">3:00 PM – 11:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Check-out:</span>
                      <span className="font-medium">By 12:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Early check-in:</span>
                      <span className="font-medium">Upon request</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Cancellation Policy</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Free cancellation up to 48 hours before arrival. After that, the first night will be charged.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-3">House Rules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {["No pets allowed", "Non-smoking room", "Credit cards accepted"].map((r) => (
                    <div key={r} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-primary shrink-0" /> {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-3xl font-bold text-gray-900">${price.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">/ night</span>
              </div>
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
                <span className="text-xs text-gray-500 ml-1">5-Star</span>
              </div>

              {available ? (
                <BookingForm roomId={room.id} price={price} />
              ) : (
                <div className="text-center py-6">
                  <p className="text-red-500 font-medium mb-4">This room is currently occupied</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/rooms">View Available Rooms</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
