import type { Metadata } from "next"
import BookingSteps from "@/components/booking-steps"

export const metadata: Metadata = {
  title: "Book Your Stay | Hotel DC Company",
  description: "Reserve your luxury room at Hotel DC Company. Easy, secure online booking.",
}

export default function BookingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">Reservations</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Book Your Stay</h1>
          <p className="text-gray-400 max-w-xl">
            Secure your perfect room in a few easy steps. Best rate guaranteed when booking direct.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <BookingSteps />
      </div>
    </div>
  )
}
