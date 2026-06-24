import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, Save, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { writeAuditLog } from "@/lib/audit-logger";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — ORL CMS" },
      { name: "robots", content: "noindex" }
    ]
  }),
  component: ResetPassword
});

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    const checkSession = async () => {
      // Allow a brief tick for Supabase Auth to process the token from hash
      await new Promise((resolve) => setTimeout(resolve, 600));
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
      }
      setChecking(false);
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email || "unknown";

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      
      // Log reset action
      writeAuditLog("Password Reset Successful", "auth", session?.user?.id || "unknown", `User reset password: ${email}`);

      // Redirect to Admin panel (or login, but they are already authenticated now)
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);

    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Verifying secure token...</p>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-slate-100 px-4 font-sans">
        <div className="max-w-md w-full text-center bg-slate-955 p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          <div className="mx-auto h-14 w-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
            <KeyRound className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-lg font-black tracking-tight uppercase font-mono text-white">Invalid or Expired Link</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your password reset or invitation token has expired or is invalid. Please request a new recovery email from the login page.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition border border-slate-800"
            >
              <ArrowLeft className="h-4 w-4 text-teal-500" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-slate-100 px-4 font-sans">
      <div className="max-w-md w-full bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white uppercase font-mono">Set New Password</h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">Update security credentials for your ORL CMS account</p>
          </div>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter at least 6 characters..."
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 pr-10 text-white outline-none focus:border-teal-500 transition-all font-semibold font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password..."
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-teal-500 transition-all font-semibold font-mono"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <Save className="h-4 w-4" /> {loading ? "Updating..." : "Save Password & Enter CMS"}
          </button>
        </form>
      </div>
    </div>
  );
}
