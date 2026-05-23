import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Droplets, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

const GOAL = 8;

type Props = { date: string };

export default function WaterTracker({ date }: Props) {
  const log = useQuery(api.water.getWaterForDate, { date });
  const setWater = useMutation(api.water.setWaterGlasses);

  const glasses = log?.glasses ?? 0;

  const update = async (delta: number) => {
    const next = Math.max(0, Math.min(GOAL + 4, glasses + delta));
    try {
      await setWater({ date, glasses: next });
      if (next === GOAL) toast.success("Hydration goal reached! 💧");
    } catch {
      toast.error("Failed to update water intake");
    }
  };

  const pct = Math.min((glasses / GOAL) * 100, 100);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-[#2196F3]" />
          <h2 className="font-semibold text-foreground">Water Intake</h2>
        </div>
        <span className="text-sm text-muted-foreground">{glasses} / {GOAL} glasses</span>
      </div>

      {/* Glass grid */}
      <div className="grid grid-cols-8 gap-1.5 mb-4">
        {Array.from({ length: GOAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => update(i < glasses ? -(glasses - i) : i + 1 - glasses)}
            className="cursor-pointer group"
            title={`${i + 1} glass${i > 0 ? "es" : ""}`}
          >
            <div
              className="w-full aspect-square rounded-lg transition-all duration-200 flex items-end justify-center overflow-hidden"
              style={{
                backgroundColor: i < glasses ? "#2196F315" : "var(--muted)",
                border: `2px solid ${i < glasses ? "#2196F3" : "transparent"}`,
              }}
            >
              <Droplets
                className="w-4 h-4 mb-1 transition-colors"
                style={{ color: i < glasses ? "#2196F3" : "var(--muted-foreground)" }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: "#2196F3" }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => update(-1)}
          disabled={glasses === 0}
          className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4 text-foreground" />
        </button>
        <p className="text-sm text-muted-foreground text-center">
          {glasses >= GOAL
            ? "🎉 Goal reached!"
            : `${GOAL - glasses} more glass${GOAL - glasses > 1 ? "es" : ""} to go`}
        </p>
        <button
          onClick={() => update(1)}
          disabled={glasses >= GOAL + 4}
          className="w-9 h-9 rounded-xl bg-[#2196F3]/10 hover:bg-[#2196F3]/20 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4 text-[#2196F3]" />
        </button>
      </div>
    </div>
  );
}
