"use client"

import type { Metadata } from "next"
import { useState } from "react"
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-gray-400 max-w-xl">
            We're here to help with any questions, special requests, or booking assistance. Reach out — our team responds within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                Icon: Phone, title: "Phone",
                lines: ["+34 (91) 234-5678", "+34 (91) 234-5679"],
                links: ["tel:+34912345678", "tel:+34912345679"],
              },
              {
                Icon: Mail, title: "Email",
                lines: ["info@hoteldccompany.com", "reservations@hoteldccompany.com"],
                links: ["mailto:info@hoteldccompany.com", "mailto:reservations@hoteldccompany.com"],
              },
              {
                Icon: MapPin, title: "Address",
                lines: ["Av. Gran Vía 28", "28013 Madrid, Spain"],
                links: [],
              },
              {
                Icon: Clock, title: "Reception Hours",
                lines: ["24 hours / 7 days", "Check-in: 3:00 PM  |  Check-out: 12:00 PM"],
                links: [],
              },
            ].map(({ Icon, title, lines, links }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  {lines.map((line, i) => (
                    links[i] ? (
                      <a key={i} href={links[i]} className="block text-sm text-gray-600 hover:text-primary transition-colors">
                        {line}
                      </a>
                    ) : (
                      <p key={i} className="text-sm text-gray-600">{line}</p>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }) }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="John Smith" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <select
                      id="subject" name="subject" required value={form.subject} onChange={handleChange}
                      className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select a topic...</option>
                      <option value="reservation">Room Reservation</option>
                      <option value="booking-issue">Booking Issue</option>
                      <option value="services">Services & Amenities</option>
                      <option value="events">Events & Conferences</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <textarea
                      id="message" name="message" rows={5} required value={form.message} onChange={handleChange}
                      placeholder="How can we help you?"
                      className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : "Send Message"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
