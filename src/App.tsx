import { Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import MovieDetails from "@/pages/MovieDetails";
import TheaterSelection from "@/pages/TheaterSelection";
import SeatSelection from "@/pages/SeatSelection";
import Checkout from "@/pages/Checkout";
import BookingSuccess from "@/pages/BookingSuccess";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-[#050A0F] text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:slug" element={<MovieDetails />} />
          <Route path="/booking/:movieId" element={<TheaterSelection />} />
          <Route path="/seats/:showId" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<BookingSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
