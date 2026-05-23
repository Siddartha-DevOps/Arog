import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import DateNav from "./_components/DateNav.tsx";
import CalorieProgress from "./_components/CalorieProgress.tsx";
import MealList from "./_components/MealList.tsx";
import WaterTracker from "./_components/WaterTracker.tsx";
import WeeklyChart from "./_components/WeeklyChart.tsx";
import MacroPieChart from "./_components/MacroPieChart.tsx";
import DailySummaryCard from "./_components/DailySummaryCard.tsx";
import StreakStats from "./_components/StreakStats.tsx";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import { Flame, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardInner() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [refreshKey, setRefreshKey] = useState(0);

  const user = useQuery(api.users.getCurrentUser, {});
  const meals = useQuery(api.meals.getMealsForDate, { date });
  const water = useQuery(api.water.getWaterForDate, { date });

  if (user === undefined || meals === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user) { navigate("/"); return null; }
  if (!user.onboardingCompleted) { navigate("/onboarding"); return null; }

  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = meals.reduce((s, m) => s + m.fat, 0);
  const calorieGoal = user.calorieGoal ?? 2000;
  const streak = user.currentStreak ?? 0;
  const waterGlasses = water?.glasses ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar: greeting + date nav */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {date === today
                ? `Hi, ${user.name?.split(" ")[0] ?? "there"} 👋`
                : "Meal History"}
            </p>
          </div>
          <DateNav date={date} onDateChange={setDate} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Streak banner */}
        {streak >= 2 && (
          <Link
            to="/achievements"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FF9800]/10 to-[#FFC107]/10 border border-[#FF9800]/20 cursor-pointer hover:border-[#FF9800]/40 transition-colors"
          >
            <Flame className="w-5 h-5 text-[#FF9800]" />
            <span className="text-sm font-semibold text-foreground flex-1">
              🔥 {streak}-Day Streak! Keep it up!
            </span>
            <Trophy className="w-4 h-4 text-[#FFC107]" />
          </Link>
        )}

        {/* Greeting text */}
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {date === today ? "Today's Nutrition" : "Meal History"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {date === today
              ? "Here's your nutrition overview"
              : new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
                  weekday: "long", month: "long", day: "numeric",
                })}
          </p>
        </div>

        {/* Calorie ring */}
        <CalorieProgress
          consumed={totalCalories}
          goal={calorieGoal}
          protein={totalProtein}
          carbs={totalCarbs}
          fat={totalFat}
        />

        {/* Macro pie + daily goals side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MacroPieChart
            protein={totalProtein}
            carbs={totalCarbs}
            fat={totalFat}
            calories={totalCalories}
          />
          <DailySummaryCard
            user={user as Doc<"users">}
            calories={totalCalories}
            waterGlasses={waterGlasses}
            mealsCount={meals.length}
          />
        </div>

        {/* Water tracker */}
        <WaterTracker date={date} key={`water-${refreshKey}`} />

        {/* Weekly chart */}
        <WeeklyChart calorieGoal={calorieGoal} />

        {/* Progress rings */}
        <StreakStats
          streak={user.currentStreak ?? 0}
          longestStreak={user.longestStreak ?? 0}
          totalLogs={user.totalLogsAllTime ?? 0}
          greenMeals={user.totalGreenMeals ?? 0}
        />

        {/* Meal list */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Meals Logged</h2>
          <MealList key={refreshKey} meals={meals} />
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center">
          <Skeleton className="h-96 w-full max-w-3xl mx-4" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <DashboardInner />
      </Authenticated>
    </>
  );
}
