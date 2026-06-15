import { Link } from "react-router";
import { Film, Mail, MapPin, Phone, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#050A0F] border-t border-white/5">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1520]/50 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#30B0D0] to-[#1a7a94] flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Cine<span className="text-[#30B0D0]">Book</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Your premium destination for movie tickets. Experience cinema like
              never before with seamless booking and exclusive premieres.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Now Showing", href: "/movies?status=now_showing" },
                { label: "Coming Soon", href: "/movies?status=coming_soon" },
                { label: "All Movies", href: "/movies" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/50 hover:text-[#30B0D0] transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              {["FAQ", "Terms of Service", "Privacy Policy", "Contact Us"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-white/50 hover:text-[#30B0D0] transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="w-4 h-4 text-[#30B0D0]" />
                support@cinebook.com
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="w-4 h-4 text-[#30B0D0]" />
                +1 (800) CINEMAX
              </li>
              <li className="flex items-start gap-2 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-[#30B0D0] mt-0.5" />
                123 Broadway Ave, New York, NY
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} CineBook. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Crafted with passion for cinema lovers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
