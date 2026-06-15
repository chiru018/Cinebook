import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CreditCard,
  Loader2,
  Shield,
  CheckCircle,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Monitor,
  Armchair,
} from "lucide-react";

interface BookingData {
  showId: number;
  movieId: number;
  theaterId: number;
  seatNumbers: string[];
  totalAmount: number;
  convenienceFee: number;
  showDetails: {
    movieTitle: string;
    moviePoster: string;
    theaterName: string;
    theaterCity: string;
    showDate: string;
    showTime: string;
    format: string;
    screenName: string;
  };
  pricing: {
    silver: number;
    gold: number;
    premium: number;
    total: number;
  };
}

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createBooking = trpc.booking.create.useMutation({
    onSuccess: () => {
      toast.success("Booking confirmed! Your tickets have been booked.");
      sessionStorage.removeItem("bookingData");
      navigate("/success");
    },
    onError: (error) => {
      toast.error(`Booking failed: ${error.message}`);
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please sign in to complete your booking.");
      navigate("/login");
      return;
    }
    const data = sessionStorage.getItem("bookingData");
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      navigate("/movies");
    }
  }, [isAuthenticated, navigate, toast]);

  const handlePayment = async () => {
    if (!bookingData) return;
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    createBooking.mutate({
      showId: bookingData.showId,
      movieId: bookingData.movieId,
      theaterId: bookingData.theaterId,
      seatNumbers: bookingData.seatNumbers,
      totalAmount: String(bookingData.totalAmount),
      convenienceFee: String(bookingData.convenienceFee),
    });
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#30B0D0]" />
      </div>
    );
  }

  const { showDetails, pricing, seatNumbers, totalAmount, convenienceFee } =
    bookingData;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-white">
            Checkout
          </h1>
          <p className="text-white/40">Review your booking and complete payment</p>
        </div>

        {/* Movie Summary */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex gap-4">
            <img
              src={showDetails.moviePoster}
              alt={showDetails.movieTitle}
              className="w-20 h-28 rounded-lg object-cover"
            />
            <div className="space-y-1.5">
              <h2 className="font-display text-xl font-bold text-white">
                {showDetails.movieTitle}
              </h2>
              <p className="text-sm text-white/50 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {showDetails.theaterName}, {showDetails.theaterCity}
              </p>
              <p className="text-sm text-white/50 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {showDetails.showDate}
              </p>
              <p className="text-sm text-white/50 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {showDetails.showTime}
              </p>
              <p className="text-sm text-white/50 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5" />
                {showDetails.format} · {showDetails.screenName}
              </p>
            </div>
          </div>
        </div>

        {/* Seats */}
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Armchair className="w-4 h-4" /> Selected Seats
          </h3>
          <div className="flex flex-wrap gap-2">
            {seatNumbers.map((seat) => (
              <span
                key={seat}
                className="px-3 py-1.5 bg-[#30B0D0]/10 border border-[#30B0D0]/20 rounded-lg text-sm text-[#30B0D0] font-medium"
              >
                {seat}
              </span>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
            Price Details
          </h3>
          <div className="space-y-2">
            {pricing.silver > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/50">
                  Silver Seats ({seatNumbers.filter((s) => s.match(/^[ABC]/)).length})
                </span>
                <span className="text-white">${pricing.silver.toFixed(2)}</span>
              </div>
            )}
            {pricing.gold > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/50">
                  Gold Seats ({seatNumbers.filter((s) => s.match(/^[DEF]/)).length})
                </span>
                <span className="text-white">${pricing.gold.toFixed(2)}</span>
              </div>
            )}
            {pricing.premium > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/50">
                  Premium Seats ({seatNumbers.filter((s) => s.match(/^[GH]/)).length})
                </span>
                <span className="text-white">
                  ${pricing.premium.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Convenience Fee</span>
              <span className="text-white">${convenienceFee.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="font-semibold text-white">Total Amount</span>
              <span className="font-display text-xl font-bold text-[#30B0D0]">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment Method
          </h3>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#30B0D0] to-[#1a7a94] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Mock Payment (Demo)
                </p>
                <p className="text-xs text-white/40">
                  No real payment will be processed
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/30">
            <Shield className="w-3.5 h-3.5" />
            Your payment information is secure and encrypted
          </div>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-bold py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(48,176,208,0.3)] disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Ticket className="w-5 h-5 mr-2" />
              Pay ${totalAmount.toFixed(2)} & Book
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
