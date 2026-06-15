import { Link } from "react-router";
import { Star, Clock, Calendar } from "lucide-react";
import type { Movie } from "@db/schema";

interface MovieCardProps {
  movie: Movie;
  size?: "sm" | "md" | "lg";
}

export default function MovieCard({ movie, size = "md" }: MovieCardProps) {
  const sizeClasses = {
    sm: "w-32 sm:w-40",
    md: "w-44 sm:w-52",
    lg: "w-56 sm:w-64",
  };

  return (
    <Link
      to={`/movies/${movie.slug}`}
      className={`group block ${sizeClasses[size]} flex-shrink-0`}
    >
      <div className="movie-card-hover rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl || "/images/movies/nebula.jpg"}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050A0F] via-transparent to-transparent opacity-60" />

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                movie.status === "now_showing"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : movie.status === "coming_soon"
                  ? "bg-[#30B0D0]/20 text-[#30B0D0] border border-[#30B0D0]/30"
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}
            >
              {movie.status === "now_showing"
                ? "Now Showing"
                : movie.status === "coming_soon"
                ? "Coming Soon"
                : "Ended"}
            </span>
          </div>

          {/* Rating */}
          {movie.imdbRating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white">
                {movie.imdbRating}
              </span>
            </div>
          )}

          {/* Genre Badge - bottom */}
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded text-[10px] text-white/80">
              {movie.genre}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <h3 className="font-display text-sm font-semibold text-white truncate group-hover:text-[#30B0D0] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-white/40">
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3" />
              {movie.duration}m
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3" />
              {movie.language}
            </span>
          </div>
          {movie.rating && (
            <span className="inline-block px-1.5 py-0.5 border border-white/10 rounded text-[10px] text-white/50">
              {movie.rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
