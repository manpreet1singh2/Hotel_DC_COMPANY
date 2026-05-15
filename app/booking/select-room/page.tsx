import type { Metadata } from "next"
import RoomSelectorCinema from "@/components/room-selector-cinema"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Select Your Room | Hotel DC Company",
  description: "Choose your ideal room for a perfect stay at Hotel DC Company.",
}

export default function SelectRoomPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">Step 1 of 3</p>
          <h1 className="text-4xl font-bold mb-2">Select Your Room</h1>
          <p className="text-gray-400">Choose from our curated selection of luxury rooms and suites.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <RoomSelectorCinema />
        </div>
        <div className="mt-8 flex justify-between">
          <Link href="/rooms">
            <Button variant="outline">← Back to Rooms</Button>
          </Link>
          <Link href="/booking">
            <Button>Continue to Booking →</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
