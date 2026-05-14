import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Linkedin, Clock } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-2 text-yellow-400">Hotel DC Company</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Five-star luxury hospitality in the heart of the city. Where every stay becomes an unforgettable memory.
            </p>
            <div className="flex space-x-3">
              {[
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 bg-white/5 hover:bg-yellow-400 hover:text-black rounded-lg flex items-center justify-center text-gray-400 transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { name: "Home", href: "/" },
                { name: "Rooms & Suites", href: "/rooms" },
                { name: "Services", href: "/services" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Book Now", href: "/booking/select-room" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-5">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">
                  Av. Gran Vía 28, <br />
                  28013 Madrid, Spain
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-yellow-400 shrink-0" />
                <a href="tel:+34912345678" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  +34 (91) 234-5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-yellow-400 shrink-0" />
                <a href="mailto:info@hoteldccompany.com" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  info@hoteldccompany.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">
                  Reception: 24/7<br />
                  Check-in: 3:00 PM<br />
                  Check-out: 12:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-5">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Subscribe for exclusive offers, seasonal packages, and hotel news.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:border-yellow-400 transition-colors"
              />
              <button
                type="button"
                className="w-full px-4 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg text-sm hover:bg-yellow-300 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm text-center">
            &copy; {currentYear} Hotel DC Company. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
