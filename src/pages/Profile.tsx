import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Ticket,
  Heart,
  Calendar,
  MapPin,
  Monitor,
  Armchair,
  Loader2,
  LogOut,
  Shield,
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const { data: bookings, isLoading: bookingsLoading } =
    trpc.booking.list.useQuery(undefined, { enabled: isAuthenticated });

  const { data: savedMovies } = trpc.savedMovie.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#30B0D0]" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const upcomingBookings =
    bookings?.filter((b) => b.status === "confirmed") || [];

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#30B0D0] to-[#1a7a94] flex items-center justify-center text-2xl font-bold text-white">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display text-2xl font-bold text-white">
                {user.name || "User"}
              </h1>
              <p className="text-sm text-white/40 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-[#30B0D0]/10 border border-[#30B0D0]/20 rounded-full text-xs text-[#30B0D0]">
                  {upcomingBookings.length} Bookings
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50">
                  {(savedMovies?.length || 0)} Saved
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400 flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" /> Admin
                  </Link>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#30B0D0]" />
            My Tickets
          </h2>

          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#30B0D0]" />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Ticket className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/40">No bookings yet</p>
              <Link
                to="/movies"
                className="text-[#30B0D0] text-sm mt-2 inline-block"
              >
                Browse movies
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="glass-card p-4 hover:border-[#30B0D0]/20 transition-all"
                >
                  <div className="flex gap-4">
                    <img
                      src={booking.moviePoster || ""}
                      alt={booking.movieTitle}
                      className="w-16 h-22 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-lg font-semibold text-white">
                          {booking.movieTitle}
                        </h3>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400 uppercase">
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.theaterName}, {booking.theaterCity}
                      </p>
                      <p className="text-xs text-white/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {booking.showDate instanceof Date ? booking.showDate.toLocaleDateString() : String(booking.showDate)} · {booking.showTime}
                      </p>
                      <p className="text-xs text-white/40 flex items-center gap-1">
                        <Monitor className="w-3 h-3" />
                        {booking.format} · {booking.screenName}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Armchair className="w-3 h-3" />
                          {(() => {
                            const seats = booking.seatNumbers;
                            if (Array.isArray(seats)) return seats.join(", ");
                            if (typeof seats === "string") {
                              try {
                                return (JSON.parse(seats) as string[]).join(", ");
                              } catch {
                                return String(seats);
                              }
                            }
                            return "";
                          })()}
                        </span>
                        <span className="text-xs text-[#30B0D0] font-semibold ml-auto">
                          ${Number(booking.totalAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Movies */}
        {savedMovies && savedMovies.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Saved Movies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {savedMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.slug}`}
                  className="group"
                >
                  <div className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-[#30B0D0]/30 transition-all">
                    <img
                      src={movie.posterUrl || ""}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-2">
                      <p className="text-sm font-medium text-white truncate group-hover:text-[#30B0D0] transition-colors">
                        {movie.title}
                      </p>
                      <p className="text-[10px] text-white/30">
                        {movie.genre}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
