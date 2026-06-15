import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ChevronLeft,
  Loader2,
} from "lucide-react";

const CONVENIENCE_FEE = 2.0;

export default function SeatSelection() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: show, isLoading: showLoading } = trpc.show.byId.useQuery(
    { id: Number(showId) },
    { enabled: !!showId }
  );

  const { data: seats, isLoading: seatsLoading } = trpc.seat.byShow.useQuery(
    { showId: Number(showId) },
    { enabled: !!showId }
  );

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Group seats by row and section
  const seatLayout = useMemo(() => {
    if (!seats) return {};

    const bySection: Record<
      string,
      Record<string, typeof seats>
    > = {};

    for (const seat of seats) {
      const section = seat.section;
      const row = seat.rowLabel;
      if (!bySection[section]) bySection[section] = {};
      if (!bySection[section][row]) bySection[section][row] = [];
      bySection[section][row].push(seat);
    }

    // Sort rows and columns
    for (const section of Object.keys(bySection)) {
      for (const row of Object.keys(bySection[section])) {
        bySection[section][row].sort((a, b) => a.colNum - b.colNum);
      }
    }

    return bySection;
  }, [seats]);

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      }
      if (prev.length >= 10) {
        toast.error("Maximum 10 seats allowed");
        return prev;
      }
      return [...prev, seatNumber];
    });
  };

  // Calculate pricing
  const seatPricing = useMemo(() => {
    if (!seats || selectedSeats.length === 0) return { silver: 0, gold: 0, premium: 0, total: 0 };

    let silver = 0;
    let gold = 0;
    let premium = 0;

    for (const seatNum of selectedSeats) {
      const seat = seats.find((s) => s.seatNumber === seatNum);
      if (seat) {
        const price =
          seat.section === "premium"
            ? Number(show?.pricePremium || 0)
            : seat.section === "gold"
            ? Number(show?.priceGold || 0)
            : Number(show?.priceSilver || 0);

        if (seat.section === "premium") premium += price;
        else if (seat.section === "gold") gold += price;
        else silver += price;
      }
    }

    return {
      silver,
      gold,
      premium,
      total: silver + gold + premium + CONVENIENCE_FEE,
    };
  }, [seats, selectedSeats, show]);

  // Section colors
  const sectionColors: Record<string, { border: string; label: string }> = {
    silver: { border: "border-gray-400", label: "text-gray-400" },
    gold: { border: "border-amber-400", label: "text-amber-400" },
    premium: { border: "border-[#30B0D0]", label: "text-[#30B0D0]" },
  };

  if (showLoading || seatsLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#30B0D0]" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-white/50">Show not found</p>
      </div>
    );
  }

  const handleProceed = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book tickets.");
      navigate("/login");
      return;
    }

    // Store booking data in session storage for checkout
    const bookingData = {
      showId: show.id,
      movieId: show.movieId,
      theaterId: show.theaterId,
      seatNumbers: selectedSeats,
      totalAmount: seatPricing.total,
      convenienceFee: CONVENIENCE_FEE,
      showDetails: {
        movieTitle: show.movieTitle,
        moviePoster: show.moviePoster,
        theaterName: show.theaterName,
        theaterCity: show.theaterCity,
        showDate: show.showDate,
        showTime: show.showTime,
        format: show.format,
        screenName: show.screenName,
      },
      pricing: seatPricing,
    };
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-right">
            <h1 className="font-display text-lg font-bold text-white">
              {show.movieTitle}
            </h1>
            <p className="text-xs text-white/40">
              {show.theaterName} · {show.showDate instanceof Date ? show.showDate.toLocaleDateString() : String(show.showDate)} · {show.showTime} · {show.format}
            </p>
          </div>
        </div>

        {/* Screen */}
        <div className="flex justify-center py-6">
          <div className="w-full max-w-xl">
            <div className="h-2 bg-gradient-to-r from-transparent via-[#30B0D0]/40 to-transparent rounded-full shadow-[0_0_20px_rgba(48,176,208,0.3)]" />
            <p className="text-center text-xs text-white/30 mt-2 uppercase tracking-widest">
              Screen
            </p>
          </div>
        </div>

        {/* Seat Legend */}
        <div className="flex items-center justify-center gap-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/8 border border-white/15" />
            <span className="text-xs text-white/50">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#30B0D0] border border-[#30B0D0] shadow-[0_0_8px_rgba(48,176,208,0.4)]" />
            <span className="text-xs text-white/50">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/8 border border-white/15 opacity-40" />
            <span className="text-xs text-white/50">Booked</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="space-y-8">
          {["premium", "gold", "silver"].map((section) => {
            const rows = seatLayout[section];
            if (!rows) return null;

            return (
              <div key={section} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-px flex-1 ${
                      section === "premium"
                        ? "bg-[#30B0D0]/30"
                        : section === "gold"
                        ? "bg-amber-400/30"
                        : "bg-gray-400/30"
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      sectionColors[section].label
                    }`}
                  >
                    {section} · $
                    {section === "premium"
                      ? show.pricePremium
                      : section === "gold"
                      ? show.priceGold
                      : show.priceSilver}
                  </span>
                  <div
                    className={`h-px flex-1 ${
                      section === "premium"
                        ? "bg-[#30B0D0]/30"
                        : section === "gold"
                        ? "bg-amber-400/30"
                        : "bg-gray-400/30"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  {Object.entries(rows).map(([rowLabel, rowSeats]) => (
                    <div
                      key={rowLabel}
                      className="flex items-center gap-2 justify-center"
                    >
                      <span className="w-6 text-xs text-white/30 font-medium text-right">
                        {rowLabel}
                      </span>
                      <div className="flex gap-1.5">
                        {rowSeats.map((seat) => (
                          <button
                            key={seat.seatNumber}
                            onClick={() =>
                              seat.status === "available" &&
                              toggleSeat(seat.seatNumber)
                            }
                            disabled={seat.status === "booked"}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[9px] font-medium transition-all flex items-center justify-center ${
                              seat.status === "booked"
                                ? "seat-booked cursor-not-allowed"
                                : selectedSeats.includes(seat.seatNumber)
                                ? "seat-selected text-[#050A0F] font-bold"
                                : "seat-available text-white/40 hover:text-white"
                            }`}
                            title={`${seat.seatNumber} (${seat.section})`}
                          >
                            {seat.colNum}
                          </button>
                        ))}
                      </div>
                      <span className="w-6 text-xs text-white/30 font-medium">
                        {rowLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Summary Bar */}
        {selectedSeats.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#050A0F]/95 backdrop-blur-xl border-t border-white/10 z-40">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-white/50">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-white/30">
                  {selectedSeats.join(", ")}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  {seatPricing.silver > 0 && (
                    <span>Silver: ${seatPricing.silver.toFixed(2)}</span>
                  )}
                  {seatPricing.gold > 0 && (
                    <span>Gold: ${seatPricing.gold.toFixed(2)}</span>
                  )}
                  {seatPricing.premium > 0 && (
                    <span>Premium: ${seatPricing.premium.toFixed(2)}</span>
                  )}
                  <span>Fee: ${CONVENIENCE_FEE.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    ${seatPricing.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-white/30">Total</p>
                </div>
                <Button
                  onClick={handleProceed}
                  className="bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-bold px-8 py-5 rounded-xl shadow-[0_0_20px_rgba(48,176,208,0.3)]"
                >
                  Proceed
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
