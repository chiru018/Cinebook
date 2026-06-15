import { useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Shield,
  Users,
  Film,
  Building2,
  Ticket,
  DollarSign,
  TrendingUp,
  Loader2,
  BarChart3,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (!authLoading && isAuthenticated && user?.role !== "admin") {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const { data: stats, isLoading: statsLoading } =
    trpc.analytics.dashboard.useQuery(undefined, {
      enabled: user?.role === "admin",
    });

  const { data: movieStats } = trpc.movie.stats.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: bookingStats } = trpc.booking.stats.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: weeklyRevenue } = trpc.analytics.weeklyRevenue.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const { data: popularMovies } = trpc.analytics.popularMovies.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#30B0D0]" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-[#30B0D0]",
      bg: "bg-[#30B0D0]/10",
      border: "border-[#30B0D0]/20",
    },
    {
      label: "Total Movies",
      value: stats?.totalMovies || 0,
      icon: Film,
      color: "text-[#64FF5E]",
      bg: "bg-[#64FF5E]/10",
      border: "border-[#64FF5E]/20",
    },
    {
      label: "Total Theaters",
      value: stats?.totalTheaters || 0,
      icon: Building2,
      color: "text-[#DA70D6]",
      bg: "bg-[#DA70D6]/10",
      border: "border-[#DA70D6]/20",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: Ticket,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    {
      label: "Confirmed",
      value: bookingStats?.confirmed || 0,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    {
      label: "Revenue",
      value: `$${(bookingStats?.revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/20",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#30B0D0]" />
          <h1 className="font-display text-3xl font-bold text-white">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`glass-card p-4 ${stat.border} hover:${stat.bg} transition-all`}
            >
              <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-display text-2xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Movie Stats */}
        {movieStats && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-[#30B0D0]" />
              Movie Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className="font-display text-3xl font-bold text-white">
                  {movieStats.total}
                </p>
                <p className="text-xs text-white/40 mt-1">Total Movies</p>
              </div>
              <div className="text-center p-4 bg-emerald-500/5 rounded-xl">
                <p className="font-display text-3xl font-bold text-emerald-400">
                  {movieStats.nowShowing}
                </p>
                <p className="text-xs text-white/40 mt-1">Now Showing</p>
              </div>
              <div className="text-center p-4 bg-[#30B0D0]/5 rounded-xl">
                <p className="font-display text-3xl font-bold text-[#30B0D0]">
                  {movieStats.comingSoon}
                </p>
                <p className="text-xs text-white/40 mt-1">Coming Soon</p>
              </div>
              <div className="text-center p-4 bg-amber-400/5 rounded-xl">
                <p className="font-display text-3xl font-bold text-amber-400">
                  {movieStats.featured}
                </p>
                <p className="text-xs text-white/40 mt-1">Featured</p>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Revenue Chart */}
        {weeklyRevenue && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#30B0D0]" />
              Weekly Revenue
            </h2>
            <div className="flex items-end gap-3 h-40">
              {weeklyRevenue.map((week, i) => {
                const maxRev = Math.max(...weeklyRevenue.map((w) => w.revenue));
                const height = (week.revenue / maxRev) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] text-white/40">
                      ${(week.revenue / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#30B0D0]/30 to-[#30B0D0]/60 transition-all hover:from-[#30B0D0]/50 hover:to-[#30B0D0]/80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-white/30">
                      {week.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Popular Movies */}
        {popularMovies && popularMovies.length > 0 && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Popular Movies
            </h2>
            <div className="space-y-2">
              {popularMovies.map((movie, i) => (
                <div
                  key={movie.movieId}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <span className="w-6 text-center text-sm font-bold text-white/30">
                    #{i + 1}
                  </span>
                  <div className="w-10 h-14 rounded bg-white/10 overflow-hidden">
                    <img
                      src={movie.posterUrl || ""}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {movie.title}
                    </p>
                    <p className="text-xs text-white/40">
                      {movie.bookings} bookings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Stats */}
        {bookingStats && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#30B0D0]" />
              Booking Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total", value: bookingStats.total, color: "text-white" },
                { label: "Confirmed", value: bookingStats.confirmed, color: "text-emerald-400" },
                { label: "Pending", value: bookingStats.pending, color: "text-amber-400" },
                { label: "Cancelled", value: bookingStats.cancelled, color: "text-red-400" },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-white/5 rounded-lg">
                  <p className={`font-display text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
