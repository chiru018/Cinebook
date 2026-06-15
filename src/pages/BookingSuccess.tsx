import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  CheckCircle,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Monitor,
  Armchair,
  Home,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingData {
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
  seatNumbers: string[];
  totalAmount: number;
}

export default function BookingSuccess() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingId] = useState(
    () => `CB-${Date.now().toString(36).toUpperCase()}`
  );

  useEffect(() => {
    const data = sessionStorage.getItem("bookingData");
    if (data) {
      setBookingData(JSON.parse(data));
    }
  }, []);

  if (!bookingData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-white/50">No booking data found</p>
        <Link to="/movies" className="text-[#30B0D0] ml-2">
          Browse movies
        </Link>
      </div>
    );
  }

  const { showDetails, seatNumbers, totalAmount } = bookingData;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Success Animation */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-black text-white">
            Booking Confirmed!
          </h1>
          <p className="text-white/50">
            Your tickets have been booked successfully. Enjoy the show!
          </p>
        </div>

        {/* Digital Ticket */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
          {/* Ticket Pattern */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#30B0D0] via-[#64FF5E] to-[#DA70D6]" />

          <div className="p-6 space-y-5">
            {/* Booking ID */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30 uppercase tracking-wider">
                Booking ID
              </span>
              <span className="font-mono text-sm text-[#30B0D0] font-bold">
                {bookingId}
              </span>
            </div>

            {/* Movie Info */}
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
                  {showDetails.theaterName}
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

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/10" />
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050A0F]" />
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050A0F]" />
            </div>

            {/* Seats & QR */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-white/30 uppercase tracking-wider flex items-center gap-1">
                  <Armchair className="w-3 h-3" /> Seats
                </p>
                <p className="text-lg font-bold text-white">
                  {seatNumbers.join(", ")}
                </p>
                <p className="text-xs text-white/30">
                  Total: ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                <QrCode className="w-14 h-14 text-[#050A0F]" />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="h-2 bg-gradient-to-r from-[#30B0D0] via-[#64FF5E] to-[#DA70D6]" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/5 py-5 rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/profile" className="flex-1">
            <Button className="w-full bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-semibold py-5 rounded-xl">
              <Ticket className="w-4 h-4 mr-2" />
              View My Tickets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
