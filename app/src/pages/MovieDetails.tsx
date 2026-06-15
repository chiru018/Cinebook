import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Star,
  Clock,
  Calendar,
  Globe,
  User,
  Ticket,
  Heart,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";

function ReviewForm({ movieId }: { movieId: number }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = trpc.useUtils();

  const createReview = trpc.review.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      utils.review.list.invalidate({ movieId });
    },
    onError: (err) => {
      toast.error(`Failed to submit review: ${err.message}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    createReview.mutate({
      movieId,
      rating: rating * 2, // scale 1-5 stars to 2-10 rating
      comment: comment.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4 max-w-xl">
      <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
        Write a Review
      </h3>
      
      {/* Star Rating */}
      <div className="space-y-1">
        <label className="text-xs text-white/40 block">Rating</label>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setRating(i + 1)}
              className="text-amber-400 focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  i < rating ? "fill-current" : "opacity-30"
                }`}
              />
            </button>
          ))}
          <span className="text-xs text-white/50 ml-2">{rating * 2}/10</span>
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-1">
        <label className="text-xs text-white/40 block">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about the movie..."
          rows={3}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#30B0D0]/50"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-semibold text-xs py-2.5 px-4 rounded-lg shadow-md"
      >
        Submit Review
      </Button>
    </form>
  );
}

export default function MovieDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: movie, isLoading } = trpc.movie.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: reviews } = trpc.review.list.useQuery(
    { movieId: movie?.id || 0 },
    { enabled: !!movie?.id }
  );

  const { data: isSaved } = trpc.savedMovie.check.useQuery(
    { movieId: movie?.id || 0 },
    { enabled: !!movie?.id && isAuthenticated }
  );

  const utils = trpc.useUtils();
  const toggleSaved = trpc.savedMovie.toggle.useMutation({
    onSuccess: () => {
      utils.savedMovie.check.invalidate();
      toast.success(
        isSaved ? "Removed from saved" : "Added to saved"
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#30B0D0]/30 border-t-[#30B0D0] rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white/50">Movie not found</p>
          <Link to="/movies" className="text-[#30B0D0] mt-2 inline-block">
            Browse all movies
          </Link>
        </div>
      </div>
    );
  }

  let cast: string[] = [];
  if (movie.cast) {
    if (Array.isArray(movie.cast)) {
      cast = movie.cast;
    } else if (typeof movie.cast === "string") {
      try {
        cast = JSON.parse(movie.cast);
      } catch (e) {
        console.error("Failed to parse cast JSON:", e);
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={movie.bannerUrl || movie.posterUrl || ""}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A0F] via-[#050A0F]/60 to-[#050A0F]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050A0F]/80 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 sm:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg text-white/70 hover:text-white hover:bg-black/60 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 -mt-32 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="w-56 sm:w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                <img
                  src={movie.posterUrl || ""}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              {/* Title & Actions */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      movie.status === "now_showing"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-[#30B0D0]/20 text-[#30B0D0] border border-[#30B0D0]/30"
                    }`}
                  >
                    {movie.status === "now_showing"
                      ? "Now Showing"
                      : "Coming Soon"}
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
                    {movie.genre}
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {movie.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-white/50 flex-wrap">
                  {movie.imdbRating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold">
                        {movie.imdbRating}
                      </span>
                      /10
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {movie.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {movie.releaseDate instanceof Date ? movie.releaseDate.toLocaleDateString() : String(movie.releaseDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {movie.language}
                  </span>
                  <span className="px-2 py-0.5 border border-white/10 rounded text-xs">
                    {movie.rating}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/60 leading-relaxed max-w-2xl">
                {movie.description}
              </p>

              {/* Synopsis */}
              {movie.synopsis && (
                <div className="glass-card p-5 space-y-2">
                  <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                    Synopsis
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>
              )}

              {/* Director */}
              {movie.director && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#30B0D0]" />
                  <span className="text-sm text-white/40">Director:</span>
                  <span className="text-sm text-white font-medium">
                    {movie.director}
                  </span>
                </div>
              )}

              {/* Cast */}
              {cast.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                    Cast
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cast.map((actor) => (
                      <span
                        key={actor}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {movie.status === "now_showing" && (
                  <Link to={`/booking/${movie.id}`}>
                    <Button className="bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-semibold px-8 py-6 text-base rounded-xl shadow-[0_0_20px_rgba(48,176,208,0.3)] hover:shadow-[0_0_30px_rgba(48,176,208,0.5)] transition-all">
                      <Ticket className="w-5 h-5 mr-2" />
                      Book Tickets
                    </Button>
                  </Link>
                )}
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    onClick={() => toggleSaved.mutate({ movieId: movie.id })}
                    className={`border-white/20 px-6 py-6 rounded-xl transition-all ${
                      isSaved
                        ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                        : "text-white hover:bg-white/5"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${isSaved ? "fill-current" : ""}`}
                    />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 space-y-8">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#30B0D0]" />
              Reviews {reviews && reviews.length > 0 ? `(${reviews.length})` : ""}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Form */}
              <div className="lg:col-span-1 space-y-4">
                {isAuthenticated ? (
                  <ReviewForm movieId={movie.id} />
                ) : (
                  <div className="glass-card p-5 text-center">
                    <p className="text-sm text-white/50">
                      Want to share your review?
                    </p>
                    <Link to="/login" className="mt-3 inline-block">
                      <Button className="bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-semibold text-xs py-2 px-4 rounded-lg">
                        Sign In to Review
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Column: List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews && reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.slice(0, 6).map((review) => (
                      <div
                        key={review.id}
                        className="glass-card p-5 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#30B0D0]/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#30B0D0]">
                              {(review.userName || "A").charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {review.userName || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating / 2
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-white/20"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-white/50 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center text-white/30 italic text-sm">
                    No reviews yet. Be the first to write one!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
