import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { writeAuditLog } from "@/lib/audit-logger";

export const Route = createFileRoute("/access-denied")({
  head: () => ({
    meta: [
      { title: "Access Denied — ORL CMS" },
      { name: "robots", content: "noindex" }
    ]
  }),
  component: AccessDenied
});

function AccessDenied() {
  const { reason } = Route.useSearch() as { reason?: string };

  const handleLogout = async () => {
    if (!supabase) return;
    try {
      // Log logout action
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        writeAuditLog("Logout (Access Denied Exit)", "auth", session.user.id, `User logged out after being denied access: ${session.user.email}`);
      }
      
      await supabase.auth.signOut();
      toast.success("Successfully logged out.");
      window.location.href = "/login";
    } catch (e: any) {
      toast.error(e.message || "Failed to log out");
    }
  };

  const getMessageDetails = () => {
    switch (reason) {
      case "disabled":
        return {
          title: "Account Disabled",
          description: "Your administrator access has been set to inactive. Please contact a Super Administrator to re-enable your account.",
        };
      case "unauthorized":
      default:
        return {
          title: "Access Denied",
          description: "You are not authorized to access the ORL CMS. Only approved email addresses listed by NITTTR administrators are allowed.",
        };
    }
  };

  const details = getMessageDetails();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-slate-100 px-4 select-none font-sans">
      <div className="max-w-md w-full text-center bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Shield Icon */}
        <div className="mx-auto h-16 w-16 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center justify-center text-red-500">
          <ShieldAlert className="h-9 w-9 animate-pulse" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">{details.title}</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">{details.description}</p>
        </div>

        {/* Buttons */}
        <div className="pt-4 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Log Out / Change Account
          </button>
          
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition"
          >
            <ArrowLeft className="h-4 w-4 text-teal-500" /> Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
