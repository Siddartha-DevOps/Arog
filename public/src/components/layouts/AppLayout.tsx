import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trophy, User, Leaf, Plus } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated } from "convex/react";
import GlobalMealLogModal from "./GlobalMealLogModal.tsx";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/achievements", icon: Trophy, label: "Achievements" },
  { to: "/profile", icon: User, label: "Profile" },
] as const;

function SidebarNav({ onLogMeal }: { onLogMeal: () => void }) {
  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-border bg-background shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Leaf className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-serif font-bold text-xl text-foreground">Arog</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "")} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Log Meal CTA */}
      <div className="px-3 pb-6">
        <button
          onClick={onLogMeal}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF9800] hover:bg-[#FF9800]/90 text-white font-semibold text-sm transition-colors cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          Log Meal
        </button>
      </div>
    </aside>
  );
}

function BottomNav({ onLogMeal }: { onLogMeal: () => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 h-16 safe-area-inset-bottom">
      {/* Dashboard */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          cn(
            "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer",
            isActive ? "text-primary" : "text-muted-foreground",
          )
        }
      >
        {({ isActive }) => (
          <>
            <LayoutDashboard className={cn("w-5 h-5", isActive && "text-primary")} />
            <span>Home</span>
          </>
        )}
      </NavLink>

      {/* Log Meal FAB */}
      <button
        onClick={onLogMeal}
        className="flex flex-col items-center justify-center w-14 h-14 -mt-5 rounded-full bg-[#FF9800] text-white shadow-lg cursor-pointer hover:bg-[#FF9800]/90 transition-colors border-4 border-background"
        aria-label="Log Meal"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Achievements */}
      <NavLink
        to="/achievements"
        className={({ isActive }) =>
          cn(
            "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer",
            isActive ? "text-[#FFC107]" : "text-muted-foreground",
          )
        }
      >
        {({ isActive }) => (
          <>
            <Trophy className={cn("w-5 h-5", isActive && "text-[#FFC107]")} />
            <span>Awards</span>
          </>
        )}
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer",
            isActive ? "text-primary" : "text-muted-foreground",
          )
        }
      >
        {({ isActive }) => (
          <>
            <User className={cn("w-5 h-5", isActive && "text-primary")} />
            <span>Profile</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}

function AppLayoutInner() {
  const [logOpen, setLogOpen] = useState(false);
  const user = useQuery(api.users.getCurrentUser, {});
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav onLogMeal={() => setLogOpen(true)} />

      {/* Main content */}
      <div className="flex-1 min-w-0 pb-16 md:pb-0">
        <Outlet />
      </div>

      <BottomNav onLogMeal={() => setLogOpen(true)} />

      {/* Global meal log modal — always logs to today */}
      {user && (
        <GlobalMealLogModal
          open={logOpen}
          onClose={() => setLogOpen(false)}
          date={today}
          user={user}
        />
      )}
    </div>
  );
}

export default function AppLayout() {
  return (
    <Authenticated>
      <AppLayoutInner />
    </Authenticated>
  );
}
