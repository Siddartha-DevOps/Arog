import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Doc, Id } from "@/convex/_generated/dataModel.d.ts";

type Props = {
  meals: Doc<"mealLogs">[];
};

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast", emoji: "🌅" },
  { value: "lunch", label: "Lunch", emoji: "☀️" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snacks", label: "Snacks", emoji: "🍎" },
] as const;

const HEALTH_SCORE_CONFIG = {
  green: { label: "Healthy", color: "#4CAF50" },
  yellow: { label: "Moderate", color: "#FFC107" },
  red: { label: "Caution", color: "#F44336" },
};

function MealItem({ meal }: { meal: Doc<"mealLogs"> }) {
  const deleteMeal = useMutation(api.meals.deleteMeal);
  const score = HEALTH_SCORE_CONFIG[meal.healthScore];

  const handleDelete = async () => {
    try {
      await deleteMeal({ mealId: meal._id as Id<"mealLogs"> });
      toast.success("Meal removed");
    } catch {
      toast.error("Failed to delete meal");
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors group">
      <div
        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
        style={{ backgroundColor: score.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground truncate">{meal.description}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-semibold text-foreground">{meal.calories} kcal</span>
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="text-[#2196F3]">{meal.protein}g protein</span>
          <span className="text-[#FF9800]">{meal.carbs}g carbs</span>
          <span className="text-[#4CAF50]">{meal.fat}g fat</span>
        </div>
      </div>
    </div>
  );
}

export default function MealList({ meals }: Props) {
  if (meals.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <div className="text-4xl mb-3">🍽️</div>
        <p className="text-sm">No meals logged yet today.</p>
        <p className="text-xs mt-1">Tap "Log Meal" to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {MEAL_TYPES.map(({ value, label, emoji }) => {
        const mealItems = meals.filter((m) => m.mealType === value);
        if (mealItems.length === 0) return null;

        const totalCal = mealItems.reduce((s, m) => s + m.calories, 0);

        return (
          <div key={value}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <span>{emoji}</span> {label}
              </h3>
              <span className="text-xs text-muted-foreground">{totalCal} kcal</span>
            </div>
            <div className="space-y-2">
              {mealItems.map((meal) => (
                <MealItem key={meal._id} meal={meal} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
