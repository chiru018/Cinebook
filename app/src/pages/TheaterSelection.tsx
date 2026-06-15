import { useState } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  Calendar,
  MapPin,
  Clock,
  Monitor,
  ChevronRight,
  Ticket,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TheaterSelection() {
  const { movieId } = useParams<{ movieId: string }>();
  const days = getNextDays();
  const [selectedDate, setSelectedDate] = useState(days[0].date);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedShow, setSelectedShow] = useState<number | null>(null);

  const { data: movie } = trpc.movie.byId.useQuery(
    { id: Number(movieId) },
    { enabled: !!movieId }
  );

  const { data: cities } = trpc.theater.cities.useQuery();

  const { data: shows, isLoading } = trpc.show.list.useQuery({
    movieId: Number(movieId),
    date: selectedDate,
    city: selectedCity || undefined,
  });

  // Group shows by theater
  const showsByTheater = shows?.reduce((acc, show) => {
    const key = show.theaterId;
    if (!acc[key]) {
      acc[key] = {
        theaterName: show.theaterName,
        theaterCity: show.theaterCity,
        shows: [],
      };
    }
    acc[key].shows.push(show);
    return acc;
  }, {} as Record<number, { theaterName: string; theaterCity: string; shows: typeof shows }>);

  if (!movie) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#30B0D0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Movie Header */}
        <div className="flex items-center gap-4">
          <img
            src={movie.posterUrl || ""}
            alt={movie.title}
            className="w-16 h-24 rounded-lg object-cover"
          />
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              {movie.title}
            </h1>
            <p className="text-sm text-white/50">
              {movie.genre} · {movie.duration}m · {movie.language}
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="space-y-3">
          <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Select Date
          </h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {days.map((day) => (
              <button
                key={day.date}
                onClick={() => {
                  setSelectedDate(day.date);
                  setSelectedShow(null);
                }}
                className={`flex flex-col items-center px-4 py-3 rounded-xl border transition-all min-w-[72px] ${
                  selectedDate === day.date
                    ? "bg-white text-[#050A0F] border-white font-bold"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-[10px] uppercase">{day.dayName}</span>
                <span className="text-xl font-bold">{day.dayNum}</span>
                <span className="text-[10px]">{day.month}</span>
              </button>
            ))}
          </div>
        </div>

        {/* City Filter */}
        {cities && cities.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Select City
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCity("");
                  setSelectedShow(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedCity === ""
                    ? "bg-[#30B0D0]/20 text-[#30B0D0] border-[#30B0D0]/30"
                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                }`}
              >
                All Cities
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setSelectedShow(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    selectedCity === city
                      ? "bg-[#30B0D0]/20 text-[#30B0D0] border-[#30B0D0]/30"
                      : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Shows by Theater */}
        <div className="space-y-4">
          <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
            <Ticket className="w-4 h-4" /> Available Shows
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#30B0D0]" />
            </div>
          ) : !showsByTheater || Object.keys(showsByTheater).length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-white/40 text-lg">No shows available</p>
              <p className="text-white/20 text-sm mt-1">
                Try selecting a different date or city
              </p>
            </div>
          ) : (
            Object.entries(showsByTheater).map(([theaterId, theater]) => (
              <div
                key={theaterId}
                className="glass-card p-5 space-y-4"
              >
                {/* Theater Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      {theater.theaterName}
                    </h3>
                    <p className="text-sm text-white/40 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {theater.theaterCity}
                    </p>
                  </div>
                </div>

                {/* Show Times */}
                <div className="flex flex-wrap gap-2">
                  {theater.shows.map((show) => (
                    <button
                      key={show.id}
                      onClick={() => setSelectedShow(show.id)}
                      className={`relative px-4 py-3 rounded-xl border transition-all text-left min-w-[100px] ${
                        selectedShow === show.id
                          ? "bg-[#30B0D0]/20 border-[#30B0D0] text-[#30B0D0] shadow-[0_0_15px_rgba(48,176,208,0.2)]"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {show.showTime}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] mt-1 opacity-70">
                        <Monitor className="w-3 h-3" />
                        {show.format}
                      </div>
                      <div className="text-[10px] mt-1 opacity-50">
                        ${show.priceSilver} - ${show.pricePremium}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Continue Button */}
        {selectedShow && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40">
            <Link to={`/seats/${selectedShow}`}>
              <Button className="bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-bold px-10 py-6 text-lg rounded-2xl shadow-[0_0_40px_rgba(48,176,208,0.4)] hover:shadow-[0_0_50px_rgba(48,176,208,0.6)] transition-all">
                Select Seats
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function getNextDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days;
}
