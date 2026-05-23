import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { useNavigate } from "react-router-dom";
import StreakStats from "../dashboard/_components/StreakStats.tsx";
import BadgeGrid from "../dashboard/_components/BadgeGrid.tsx";
import { computeEarnedBadges, getBadgeProgress } from "../dashboard/_lib/badges.ts";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";

function AchievementsInner() {
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser, {});

  if (user === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) { navigate("/"); return null; }
  if (!user.onboardingCompleted) { navigate("/onboarding"); return null; }

  const stats = {
    totalLogsAllTime: user.totalLogsAllTime ?? 0,
    currentStreak: user.currentStreak ?? 0,
    longestStreak: user.longestStreak ?? 0,
    totalGreenMeals: user.totalGreenMeals ?? 0,
  };

  const earnedIds = computeEarnedBadges(stats);
  const badgeItems = getBadgeProgress(stats, earnedIds);
  const earnedCount = earnedIds.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-[#FFC107]" />
          <h1 className="font-semibold text-foreground">Achievements</h1>
          <span className="ml-auto text-xs bg-[#FFC107]/20 text-[#FFC107] font-semibold px-2 py-0.5 rounded-full">
            {earnedCount}/{badgeItems.length}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Progress rings */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <StreakStats
            streak={stats.currentStreak}
            longestStreak={stats.longestStreak}
            totalLogs={stats.totalLogsAllTime}
            greenMeals={stats.totalGreenMeals}
          />
        </motion.div>

        {/* Badge grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <h2 className="font-semibold text-foreground mb-3">Badges</h2>
          <BadgeGrid items={badgeItems} />
        </motion.div>
      </main>
    </div>
  );
}

export default function Achievements() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center">
          <Skeleton className="h-96 w-full max-w-3xl mx-4" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <p className="text-muted-foreground">Please sign in to view achievements.</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <AchievementsInner />
      </Authenticated>
    </>
  );
}
