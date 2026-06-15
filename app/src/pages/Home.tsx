import { useRef } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import MovieCard from "@/components/MovieCard";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
  Ticket,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: featuredMovies } = trpc.movie.featured.useQuery();
  const { data: nowShowing } = trpc.movie.nowShowing.useQuery();
  const { data: comingSoon } = trpc.movie.comingSoon.useQuery();

  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const nowScrollRef = useRef<HTMLDivElement>(null);
  const comingScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const heroMovie = featuredMovies?.[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero/hero-banner.jpg"
            alt="Cinematic hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050A0F] via-[#050A0F]/80 to-[#050A0F]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050A0F] via-transparent to-[#050A0F]/60" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#30B0D0]/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-6rem)]">
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#30B0D0]/20 border border-[#30B0D0]/30 rounded-full text-xs font-semibold text-[#30B0D0] uppercase tracking-wider">
                Now Booking
              </span>
              <span className="flex items-center gap-1 text-xs text-white/50">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {heroMovie?.imdbRating || "8.5"} Rating
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight">
              Experience
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#30B0D0] to-[#64FF5E]">
                Cinema Magic
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-white/60 max-w-lg leading-relaxed">
              Book tickets for the latest blockbusters at premium theaters near
              you. Your next great movie experience starts here.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/movies">
                <Button className="bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-semibold px-8 py-6 text-base rounded-xl shadow-[0_0_30px_rgba(48,176,208,0.3)] hover:shadow-[0_0_40px_rgba(48,176,208,0.5)] transition-all">
                  <Ticket className="w-5 h-5 mr-2" />
                  Book Tickets
                </Button>
              </Link>
              <Link to={`/movies/${heroMovie?.slug || "nebula"}`}>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl backdrop-blur-sm"
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  Movies
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  Theaters
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-white">1M+</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  Bookings
                </p>
              </div>
            </div>
          </div>

          {/* Featured Movie Card - Right Side */}
          {heroMovie && (
            <div className="hidden lg:flex lg:col-span-5 justify-end">
              <Link to={`/movies/${heroMovie.slug}`}>
                <div className="relative w-72 rounded-2xl overflow-hidden shadow-2xl shadow-[#30B0D0]/10 border border-white/10 group">
                  <img
                    src={heroMovie.posterUrl || ""}
                    alt={heroMovie.title}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050A0F] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs text-[#30B0D0] font-semibold uppercase tracking-wider mb-1">
                      Featured
                    </p>
                    <h3 className="font-display text-xl font-bold text-white">
                      {heroMovie.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                      {heroMovie.genre} · {heroMovie.duration}m
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Movies */}
      {featuredMovies && featuredMovies.length > 0 && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#30B0D0]" />
                <h2 className="font-display text-2xl font-bold text-white">
                  Featured Films
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll(featuredScrollRef, "left")}
                  className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-[#30B0D0]/50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(featuredScrollRef, "right")}
                  className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-[#30B0D0]/50 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={featuredScrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
            >
              {featuredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="lg" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Now Showing */}
      {nowShowing && nowShowing.length > 0 && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-emerald-400" />
                <h2 className="font-display text-2xl font-bold text-white">
                  Now Showing
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/movies?status=now_showing"
                  className="text-sm text-[#30B0D0] hover:text-[#30B0D0]/80 flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scroll(nowScrollRef, "left")}
                  className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-[#30B0D0]/50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(nowScrollRef, "right")}
                  className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-[#30B0D0]/50 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={nowScrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
            >
              {nowShowing.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="md" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon */}
      {comingSoon && comingSoon.length > 0 && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[#DA70D6]" />
                <h2 className="font-display text-2xl font-bold text-white">
                  Coming Soon
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/movies?status=coming_soon"
                  className="text-sm text-[#30B0D0] hover:text-[#30B0D0]/80 flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scroll(comingScrollRef, "left")}
                  className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-[#30B0D0]/50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(comingScrollRef, "right")}
                  className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-[#30B0D0]/50 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={comingScrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
            >
              {comingSoon.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="md" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#30B0D0]/10 via-[#64FF5E]/5 to-[#DA70D6]/10" />
        <div className="absolute inset-0 bg-[url('/images/hero/hero-banner.jpg')] opacity-10 bg-cover bg-center" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Ready for Your Next
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#30B0D0] to-[#64FF5E]">
              Movie Experience?
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Join millions of movie lovers. Book tickets, discover new films, and
            never miss a premiere.
          </p>
          <Link to="/movies">
            <Button className="mt-4 bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-semibold px-10 py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(48,176,208,0.3)] hover:shadow-[0_0_50px_rgba(48,176,208,0.5)] transition-all">
              <Ticket className="w-5 h-5 mr-2" />
              Explore All Movies
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
