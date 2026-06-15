import { useState } from "react";
import { useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import MovieCard from "@/components/MovieCard";
import { Search, SlidersHorizontal, X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const GENRES = [
  "All",
  "Sci-Fi",
  "Action",
  "Romance",
  "Horror",
  "Fantasy",
  "Comedy",
  "Thriller",
  "Animation",
  "Drama",
  "Musical",
];

const LANGUAGES = ["All", "English", "Hindi", "Spanish", "French", "Japanese"];

export default function Movies() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || ""
  );
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.movie.list.useQuery({
    status: (selectedStatus as "now_showing" | "coming_soon" | undefined) || undefined,
    genre: selectedGenre !== "All" ? selectedGenre : undefined,
    language: selectedLanguage !== "All" ? selectedLanguage : undefined,
    search: search || undefined,
    page,
    limit: 12,
  });

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedGenre("All");
    setSelectedLanguage("All");
    setSelectedStatus("");
    setPage(1);
  };

  const hasFilters =
    search || selectedGenre !== "All" || selectedLanguage !== "All" || selectedStatus;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-[#30B0D0]" />
            <h1 className="font-display text-3xl font-bold text-white">
              {selectedStatus === "now_showing"
                ? "Now Showing"
                : selectedStatus === "coming_soon"
                ? "Coming Soon"
                : "All Movies"}
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies by title..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#30B0D0]/50 focus:ring-1 focus:ring-[#30B0D0]/30 transition-all"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-white/10 text-white hover:bg-white/5 px-4 ${
                showFilters ? "border-[#30B0D0]/50 text-[#30B0D0]" : ""
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="glass-card p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
              {/* Status Tabs */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All", value: "" },
                    { label: "Now Showing", value: "now_showing" },
                    { label: "Coming Soon", value: "coming_soon" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setSelectedStatus(tab.value);
                        setPage(1);
                      }}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedStatus === tab.value
                          ? "bg-[#30B0D0]/20 text-[#30B0D0] border border-[#30B0D0]/30"
                          : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                  Genre
                </p>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        setSelectedGenre(genre);
                        setPage(1);
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        selectedGenre === genre
                          ? "bg-[#30B0D0]/20 text-[#30B0D0] border border-[#30B0D0]/30"
                          : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                  Language
                </p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setPage(1);
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        selectedLanguage === lang
                          ? "bg-[#30B0D0]/20 text-[#30B0D0] border border-[#30B0D0]/30"
                          : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {data && (
          <p className="text-sm text-white/40 mb-6">
            Showing {data.movies.length} of {data.total} movies
          </p>
        )}

        {/* Movie Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : data?.movies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No movies found</p>
            <p className="text-white/20 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data?.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} size="md" />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-white/10 text-white hover:bg-white/5 disabled:opacity-30"
            >
              Previous
            </Button>
            <span className="text-sm text-white/50 px-4">
              Page {page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="border-white/10 text-white hover:bg-white/5 disabled:opacity-30"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
