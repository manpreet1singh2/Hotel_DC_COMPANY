import type { Metadata } from "next"
import RoomCard from "@/components/room-card"
import { getRooms } from "@/lib/api"

export const metadata: Metadata = {
  title: "Rooms & Suites | Hotel DC Company",
  description: "Explore our selection of luxury rooms and suites for your perfect stay.",
}

export default async function RoomsPage() {
  let rooms = []
  try {
    rooms = await getRooms()
  } catch (e) {
    rooms = []
  }

  // Fallback rooms if none returned
  if (!rooms || rooms.length === 0) {
    rooms = [
      { id: "f1", name: "Standard Single Room", tipo: "Sencilla", price: 150, precio: 150, capacity: 1, capacidad: 1, isAvailable: true, amenities: ["WiFi", "TV", "AC"], image: "/standard-room-bedroom.jpg" },
      { id: "f2", name: "Deluxe Double Room", tipo: "Doble", price: 220, precio: 220, capacity: 2, capacidad: 2, isAvailable: true, amenities: ["WiFi", "TV", "Minibar", "AC"], image: "/deluxe-room-bedroom.jpg" },
      { id: "f3", name: "Presidential Suite", tipo: "Suite", price: 450, precio: 450, capacity: 4, capacidad: 4, isAvailable: true, amenities: ["WiFi", "Jacuzzi", "Balcony", "TV", "Minibar"], image: "/luxury-suite-bedroom.jpg" },
      { id: "f4", name: "Family Suite", tipo: "Suite", price: 380, precio: 380, capacity: 6, capacidad: 6, isAvailable: true, amenities: ["WiFi", "TV", "Kitchen", "AC"], image: "/family-suite-bedroom.jpg" },
      { id: "f5", name: "Deluxe King Room", tipo: "Doble", price: 260, precio: 260, capacity: 2, capacidad: 2, isAvailable: false, amenities: ["WiFi", "King Bed", "Minibar", "AC"], image: "/deluxe-room-bedroom.jpg" },
      { id: "f6", name: "Luxury Suite", tipo: "Suite", price: 550, precio: 550, capacity: 3, capacidad: 3, isAvailable: true, amenities: ["WiFi", "Jacuzzi", "Living Room", "Balcony"], image: "/luxury-suite-living-room.jpg" },
    ] as any[]
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">Accommodations</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Rooms & Suites</h1>
          <p className="text-gray-400 max-w-xl">
            Each room is crafted for ultimate comfort — from cozy standard rooms to expansive presidential suites.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 text-sm">{rooms.length} rooms available</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room: any) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  )
}
