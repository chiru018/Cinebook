import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Home, Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        {/* 404 */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-[#30B0D0]/20 blur-[60px] rounded-full" />
          <h1 className="relative font-display text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
            404
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-white/40 max-w-sm mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <Button className="bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-semibold px-6 py-5 rounded-xl">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/movies">
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 px-6 py-5 rounded-xl"
            >
              <Film className="w-4 h-4 mr-2" />
              Browse Movies
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
