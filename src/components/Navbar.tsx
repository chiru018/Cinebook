import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  Film,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Ticket,
  Shield,

} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const isHome = location.pathname === "/";

  const navLinks = [
    { label: "Movies", href: "/movies" },
    { label: "Now Showing", href: "/movies?status=now_showing" },
    { label: "Coming Soon", href: "/movies?status=coming_soon" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome
          ? "bg-transparent"
          : "bg-[#050A0F]/90 backdrop-blur-xl border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#30B0D0] to-[#1a7a94] flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(48,176,208,0.4)] transition-shadow">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Cine<span className="text-[#30B0D0]">Book</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    autoFocus
                    className="w-48 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#30B0D0]"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="p-2 text-white/60 hover:text-[#30B0D0] rounded-lg hover:bg-white/5 transition-all"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || ""}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white/60" />
                  )}
                  <span className="text-sm text-white/80 hidden lg:block">
                    {user?.name || "User"}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-white/60 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-[#30B0D0]/20 border border-[#30B0D0]/40 text-[#30B0D0] rounded-lg hover:bg-[#30B0D0]/30 transition-all text-sm font-medium"
              >
                <Ticket className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white/60 hover:text-white"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050A0F]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      <Shield className="w-4 h-4" /> Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 rounded-lg w-full"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#30B0D0] hover:bg-white/5 rounded-lg"
                >
                  <Ticket className="w-4 h-4" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
