type Props = {
  consumed: number;
  goal: number;
  protein: number;
  carbs: number;
  fat: number;
};

function MacroBar({
  label,
  grams,
  color,
}: {
  label: string;
  grams: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-12">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ backgroundColor: color, width: `${Math.min((grams / 100) * 100, 100)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-foreground w-10 text-right">{grams}g</span>
    </div>
  );
}

export default function CalorieProgress({ consumed, goal, protein, carbs, fat }: Props) {
  const pct = Math.min((consumed / Math.max(goal, 1)) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const isOver = consumed > goal;

  // Arc math
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const progressColor = pct > 100 ? "#F44336" : pct > 75 ? "#FF9800" : "#4CAF50";

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
      {/* Circular progress */}
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="128" height="128" viewBox="0 0 128 128">
            {/* Track */}
            <circle
              cx="64" cy="64" r={r}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="10"
            />
            {/* Progress */}
            <circle
              cx="64" cy="64" r={r}
              fill="none"
              stroke={progressColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              strokeDashoffset={circ * 0.25}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{consumed}</span>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <div>
            <p className="text-sm text-muted-foreground">Daily Goal</p>
            <p className="text-xl font-bold text-foreground">{goal} kcal</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {isOver ? "Over by" : "Remaining"}
            </p>
            <p
              className="text-lg font-semibold"
              style={{ color: isOver ? "#F44336" : "#4CAF50" }}
            >
              {isOver ? `+${consumed - goal}` : remaining} kcal
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{Math.round(pct)}%</span>
          <span>{goal}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: progressColor }}
          />
        </div>
      </div>

      {/* Macros */}
      <div className="space-y-2 pt-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Macros Today</p>
        <MacroBar label="Protein" grams={protein} color="#2196F3" />
        <MacroBar label="Carbs" grams={carbs} color="#FF9800" />
        <MacroBar label="Fat" grams={fat} color="#4CAF50" />
      </div>
    </div>
  );
}
