import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, Mail, ChevronRight, Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { writeAuditLog } from "@/lib/audit-logger";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "CMS Login — Ocean Research Laboratory" },
      { name: "description", content: "ORL Content Management System Login Panel" }
    ]
  }),
  component: Login
});

function Login() {
  const { error: errorParam } = Route.useSearch() as { error?: string };

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    if (errorParam === "expired") {
      toast.error("Session Expired: Please log in again.");
    } else if (errorParam === "unauthorized") {
      toast.error("Access Denied: You are not authorized to access the ORL CMS.");
    } else if (errorParam === "disabled") {
      toast.error("Access Denied: Your account is disabled. Please contact the administrator.");
    }
  }, [errorParam]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.warn("Supabase is disabled. Running in offline/mock mode.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authErr) {
        toast.error("Invalid email or password");
        return;
      }

      if (!user) {
        toast.error("Authentication failed. User not found.");
        return;
      }

      // Check authorization in authorized_users table
      // 1. Try checking by auth_user_id first (Strict Identity Linking)
      let { data: authUser, error: queryErr } = await supabase
        .from("authorized_users")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!authUser && !queryErr) {
        // 2. Fallback check by email (First successful authorization)
        const { data: byEmailUser, error: emailErr } = await supabase
          .from("authorized_users")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();

        if (emailErr) {
          queryErr = emailErr;
        } else if (byEmailUser) {
          authUser = byEmailUser;
          // Perform Auth Identity Linking if not linked yet
          if (!byEmailUser.auth_user_id) {
            const { error: linkErr } = await supabase
              .from("authorized_users")
              .update({ auth_user_id: user.id })
              .eq("id", byEmailUser.id);
            
            if (linkErr) {
              console.warn("Failed to link Auth Identity UUID to authorized_users:", linkErr.message);
            } else {
              console.log("Successfully linked Auth Identity UUID for user:", user.email);
              authUser.auth_user_id = user.id;
            }
          }
        }
      }

      if (queryErr || !authUser) {
        toast.error("You are not authorized to access the ORL CMS.");
        await supabase.auth.signOut();
        return;
      }

      if (authUser.status !== "active") {
        toast.error("Account disabled. Please contact the administrator.");
        await supabase.auth.signOut();
        return;
      }

      // Success
      toast.success("Successfully logged in!");
      
      // Log login success
      writeAuditLog("Login Successful", "auth", user.id, `User logged in: ${user.email}`);

      // Redirect to Admin
      setTimeout(() => {
        window.location.href = "/admin";
      }, 800);

    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      toast.warn("Supabase is disabled.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/admin"
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize Google login.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + "/reset-password"
      });

      if (error) throw error;

      toast.success("Recovery email sent! Please check your inbox.");
      
      // Log recovery requested
      writeAuditLog("Password Recovery Requested", "auth", "unauthenticated", `Password recovery email triggered for: ${resetEmail}`);

      setIsForgot(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to send recovery email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-slate-100 px-4 font-sans select-none">
      <div className="max-w-md w-full bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-500 mb-2">
            <Compass className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-white uppercase font-mono">ORL CMS LOGIN</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Ocean Research Laboratory Website Manager</p>
        </div>

        {!isForgot ? (
          <>
            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-40"
            >
              {/* Google Colored Icon */}
              <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            {/* Separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold">OR</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 pl-10 text-white outline-none focus:border-teal-500 transition-all font-semibold font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 pl-10 text-white outline-none focus:border-teal-500 transition-all font-semibold font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-40"
              >
                Login <ChevronRight className="h-4 w-4" />
              </button>
            </form>

            {/* Forgot Link */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsForgot(true)}
                disabled={loading}
                className="text-[10px] text-teal-500 hover:text-teal-400 font-bold uppercase tracking-wider transition cursor-pointer select-none"
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : (
          /* Forgot Password View */
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div className="space-y-2">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">Recover Password</h2>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans normal-case">
                Enter your registered email address. We will send you a standard Supabase password recovery link to access the reset interface.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 pl-10 text-white outline-none focus:border-teal-500 transition-all font-semibold font-sans"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsForgot(false)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-40"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
