import { CheckCircle, Circle, Target, Utensils, Droplets, Trophy } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

type Props = {
  user: Doc<"users">;
  calories: number;
  waterGlasses: number;
  mealsCount: number;
};

const GOAL_LABELS: Record<string, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  diabetes_friendly: "Diabetes Friendly",
  heart_health: "Heart Health",
  maintenance: "Maintenance",
  general_wellness: "General Wellness",
};

const DIET_LABELS: Record<string, string> = {
  veg: "🌿 Vegetarian",
  nonveg: "🍗 Non-Vegetarian",
  both: "🍽️ Both",
};

export default function DailySummaryCard({ user, calories, waterGlasses, mealsCount }: Props) {
  const calorieGoal = user.calorieGoal ?? 2000;
  const caloriesOk = calories > 0 && calories <= calorieGoal * 1.05;
  const waterOk = waterGlasses >= 8;
  const mealsOk = mealsCount >= 3;

  const checks = [
    { label: "Calorie goal", done: caloriesOk, icon: Target },
    { label: "3+ meals logged", done: mealsOk, icon: Utensils },
    { label: "8 glasses water", done: waterOk, icon: Droplets },
  ];

  const score = checks.filter((c) => c.done).length;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FFC107]" />
          <h2 className="font-semibold text-foreground">Daily Goals</h2>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: i < score ? "#4CAF50" : "var(--muted)" }}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{score}/3</span>
        </div>
      </div>

      {/* Profile quick-view */}
      <div className="flex flex-wrap gap-2">
        {user.dietPreference && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#4CAF50]/10 text-[#4CAF50]">
            {DIET_LABELS[user.dietPreference]}
          </span>
        )}
        {user.healthGoal && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#FF9800]/10 text-[#FF9800]">
            🎯 {GOAL_LABELS[user.healthGoal]}
          </span>
        )}
      </div>

      {/* Checklist */}
      <div className="space-y-2.5">
        {checks.map(({ label, done, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3">
            {done ? (
              <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
            <span
              className="text-sm"
              style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              {label}
            </span>
            <Icon
              className="w-4 h-4 ml-auto flex-shrink-0"
              style={{ color: done ? "#4CAF50" : "var(--muted-foreground)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
