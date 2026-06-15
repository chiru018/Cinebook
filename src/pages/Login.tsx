import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Ticket, Sparkles, Shield, User } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

function getOAuthUrl() {
  const cinebookAuthUrl = import.meta.env.VITE_CINEBOOK_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${cinebookAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { refresh } = useAuth();

  const mockLoginMutation = trpc.auth.mockLogin.useMutation({
    onSuccess: async (_, variables) => {
      toast.success(`Signed in successfully as Mock ${variables.role === "admin" ? "Admin" : "User"}!`);
      await utils.auth.me.invalidate();
      await refresh();
      if (variables.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
    onError: (err) => {
      toast.error(`Sign in failed: ${err.message}`);
    }
  });

  const handleMockLogin = (role: "user" | "admin") => {
    mockLoginMutation.mutate({ role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050A0F] via-[#0a1520] to-[#050A0F]" />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#30B0D0]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#64FF5E]/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DA70D6]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#30B0D0] to-[#1a7a94] shadow-[0_0_40px_rgba(48,176,208,0.3)] mb-4">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            Cine<span className="text-[#30B0D0]">Book</span>
          </h1>
          <p className="text-white/40 mt-2 text-sm">
            Sign in to book tickets and save your favorite movies
          </p>
        </div>

        {/* Card */}
        <Card className="bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-xl text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#30B0D0]" />
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-[#30B0D0] hover:bg-[#30B0D0]/90 text-[#050A0F] font-semibold py-6 text-base rounded-xl shadow-[0_0_20px_rgba(48,176,208,0.2)] hover:shadow-[0_0_30px_rgba(48,176,208,0.4)] transition-all"
              size="lg"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              <Ticket className="w-5 h-5 mr-2" />
              Sign in with CineBook Auth
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-white/30 text-[10px] uppercase tracking-wider">Or Debug Locally</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 py-5 rounded-xl text-sm font-medium"
                onClick={() => handleMockLogin("user")}
                disabled={mockLoginMutation.isPending}
              >
                <User className="w-4 h-4 mr-1 text-[#30B0D0]" />
                Mock User
              </Button>
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 py-5 rounded-xl text-sm font-medium"
                onClick={() => handleMockLogin("admin")}
                disabled={mockLoginMutation.isPending}
              >
                <Shield className="w-4 h-4 mr-1 text-amber-400" />
                Mock Admin
              </Button>
            </div>

            <p className="text-center text-xs text-white/30 pt-2">
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-white/40 hover:text-[#30B0D0] transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
