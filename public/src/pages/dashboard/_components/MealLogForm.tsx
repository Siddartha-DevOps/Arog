import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: "breakfast", label: "Breakfast", emoji: "🌅" },
  { value: "lunch", label: "Lunch", emoji: "☀️" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snacks", label: "Snacks", emoji: "🍎" },
];

const EXAMPLE_MEALS = [
  "2 roti, dal makhani, sabzi",
  "Poha with peanuts and chai",
  "Chicken biryani, raita",
  "Idli sambar, chutney",
  "Paneer tikka, naan",
  "Masala dosa, coconut chutney",
];

type Props = {
  date: string;
  user: Doc<"users">;
  onLogged: () => void;
};

type AnalysisResult = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  healthScore: "green" | "yellow" | "red";
  aiAnalysis: string;
};

const HEALTH_SCORE_CONFIG = {
  green: { label: "Healthy", color: "#4CAF50", bg: "bg-[#4CAF50]" },
  yellow: { label: "Moderate", color: "#FFC107", bg: "bg-[#FFC107]" },
  red: { label: "Caution", color: "#F44336", bg: "bg-[#F44336]" },
};

export default function MealLogForm({ date, user, onLogged }: Props) {
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeMeal = useAction(api.ai.analyzeMeal);
  const logMeal = useMutation(api.meals.logMeal);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const data = await analyzeMeal({
        description: description.trim(),
        dietPreference: user.dietPreference,
      });
      setResult(data as AnalysisResult);
    } catch {
      toast.error("Could not analyze meal. Try a more specific description.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLog = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await logMeal({
        date,
        mealType,
        description: description.trim(),
        ...result,
      });
      toast.success("Meal logged! 🌿");
      setOpen(false);
      setDescription("");
      setResult(null);
      onLogged();
    } catch {
      toast.error("Failed to log meal.");
    } finally {
      setSaving(false);
    }
  };

  const score = result ? HEALTH_SCORE_CONFIG[result.healthScore] : null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-[#FF9800] hover:bg-[#FF9800]/90 text-white font-semibold shadow-md cursor-pointer"
      >
        <Plus className="w-4 h-4 mr-2" />
        Log Meal
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF9800]" />
                  <h2 className="font-semibold text-foreground">Log a Meal</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Meal type */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Meal Type</label>
                  <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEAL_TYPES.map((m) => (
                        <SelectItem key={m.value} value={m.value} className="cursor-pointer">
                          {m.emoji} {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    What did you eat?
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setResult(null);
                    }}
                    placeholder="e.g. 2 roti, dal fry, mixed sabzi, glass of lassi"
                    rows={3}
                    className="resize-none"
                  />
                  {/* Example chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {EXAMPLE_MEALS.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => { setDescription(ex); setResult(null); }}
                        className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/70 rounded-full text-muted-foreground cursor-pointer transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Analysis button */}
                {!result && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={!description.trim() || analyzing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                  >
                    {analyzing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing with AI...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" />Analyze with AI</>
                    )}
                  </Button>
                )}

                {/* Result */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {/* Health score + calories */}
                      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/40">
                        <div>
                          <div className="text-3xl font-bold text-foreground">{result.calories}
                            <span className="text-sm font-normal text-muted-foreground ml-1">kcal</span>
                          </div>
                          {result.aiAnalysis && (
                            <p className="text-xs text-muted-foreground mt-1 max-w-xs">{result.aiAnalysis}</p>
                          )}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${score?.bg}`}
                        >
                          {score?.label}
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Protein", val: result.protein, unit: "g", color: "#2196F3" },
                          { label: "Carbs", val: result.carbs, unit: "g", color: "#FF9800" },
                          { label: "Fat", val: result.fat, unit: "g", color: "#4CAF50" },
                          { label: "Fiber", val: result.fiber, unit: "g", color: "#9C27B0" },
                        ].map((m) => (
                          <div key={m.label} className="bg-muted rounded-xl p-3 text-center">
                            <div className="text-lg font-bold" style={{ color: m.color }}>
                              {m.val}{m.unit}
                            </div>
                            <div className="text-[11px] text-muted-foreground">{m.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="flex-1 cursor-pointer"
                          onClick={() => setResult(null)}
                        >
                          Re-analyze
                        </Button>
                        <Button
                          className="flex-1 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white cursor-pointer"
                          onClick={handleLog}
                          disabled={saving}
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Meal ✓"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
