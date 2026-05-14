import { getRooms } from "@/lib/api"
import RoomCard from "./room-card"

export default async function FeaturedRooms() {
  let featuredRooms = []

  try {
    const allRooms = await getRooms()
    featuredRooms = allRooms.slice(0, 3)
  } catch (error) {
    console.error("Failed to load rooms:", error)
  }

  if (featuredRooms.length === 0) {
    // Static fallback cards when no data
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: "f1", name: "Standard Single Room", tipo: "Sencilla", price: 150, precio: 150,
            capacity: 1, capacidad: 1, isAvailable: true, amenities: ["WiFi", "TV", "AC"],
            image: "/standard-room-bedroom.jpg",
          },
          {
            id: "f2", name: "Deluxe Double Room", tipo: "Doble", price: 220, precio: 220,
            capacity: 2, capacidad: 2, isAvailable: true, amenities: ["WiFi", "TV", "Minibar", "AC"],
            image: "/deluxe-room-bedroom.jpg",
          },
          {
            id: "f3", name: "Presidential Suite", tipo: "Suite", price: 450, precio: 450,
            capacity: 4, capacidad: 4, isAvailable: true, amenities: ["WiFi", "Jacuzzi", "Balcony", "TV", "Minibar"],
            image: "/luxury-suite-bedroom.jpg",
          },
        ].map((room: any) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredRooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  )
}
