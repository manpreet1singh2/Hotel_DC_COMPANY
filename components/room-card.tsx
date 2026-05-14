"use client"

import Link from "next/link"
import Image from "next/image"
import { Users, Wifi, Coffee, Tv } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Room } from "@/lib/types"

interface RoomCardProps {
  room: Room
}

// Map room type to actual images
const getRoomImage = (room: Room): string => {
  if (room.image && !room.image.includes("placeholder")) return room.image

  const tipo = room.tipo || room.name || ""
  if (tipo.includes("Suite") || tipo.includes("suite")) return "/luxury-suite-bedroom.jpg"
  if (tipo.includes("Doble") || tipo.includes("Deluxe") || tipo.includes("doble")) return "/deluxe-room-bedroom.jpg"
  if (tipo.includes("Familiar") || tipo.includes("familiar") || tipo.includes("Family")) return "/family-suite-bedroom.jpg"
  return "/standard-room-bedroom.jpg"
}

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  "Wi-Fi": Wifi,
  TV: Tv,
  Cafetera: Coffee,
}

export default function RoomCard({ room }: RoomCardProps) {
  const roomImage = getRoomImage(room)
  const price = room.price ?? room.precio ?? 0
  const capacity = room.capacity ?? room.capacidad ?? 2
  const available = room.isAvailable ?? room.estado === "Disponible"
  const amenities = room.amenities ?? (room.servicios_incluidos ? room.servicios_incluidos.split(", ") : [])

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={roomImage}
          alt={room.name || `Room ${room.number}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold ${
            available ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {available ? "Available" : "Occupied"}
        </div>
        {room.tipo && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {room.tipo}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-1 text-gray-900 truncate">
          {room.name || `Room ${room.number}`}
        </h3>

        <div className="flex items-center text-gray-500 mb-3 text-sm">
          <Users className="h-4 w-4 mr-1.5" />
          <span>Up to {capacity} guests</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {amenities.slice(0, 3).map((amenity: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs font-normal">
              {amenity}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>

          <Link
            href={`/rooms/${room.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              available
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            onClick={(e) => !available && e.preventDefault()}
          >
            {available ? "View Details" : "Unavailable"}
          </Link>
        </div>
      </div>
    </div>
  )
}
