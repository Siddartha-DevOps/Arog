import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Flame } from "lucide-react";

type Props = {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
};

const MACRO_CONFIG = [
  { key: "protein", label: "Protein", color: "#2196F3", cal: 4 },
  { key: "carbs", label: "Carbs", color: "#FF9800", cal: 4 },
  { key: "fat", label: "Fat", color: "#4CAF50", cal: 9 },
];

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
};

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value}g</p>
    </div>
  );
}

export default function MacroPieChart({ protein, carbs, fat, calories }: Props) {
  const total = protein + carbs + fat;

  const data = [
    { name: "Protein", value: protein },
    { name: "Carbs", value: carbs },
    { name: "Fat", value: fat },
  ].filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-[#FF9800]" />
          <h2 className="font-semibold text-foreground">Macro Breakdown</h2>
        </div>
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Log meals to see macros
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-[#FF9800]" />
        <h2 className="font-semibold text-foreground">Macro Breakdown</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Pie */}
        <div className="flex-shrink-0">
          <ResponsiveContainer width={110} height={110}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={MACRO_CONFIG.find((m) => m.label === data[index].name)?.color ?? "#ccc"}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend + values */}
        <div className="flex-1 space-y-2.5">
          {MACRO_CONFIG.map((m) => {
            const grams = m.key === "protein" ? protein : m.key === "carbs" ? carbs : fat;
            const kcal = grams * m.cal;
            const pct = calories > 0 ? Math.round((kcal / calories) * 100) : 0;
            return (
              <div key={m.key} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                <span className="text-xs text-muted-foreground flex-1">{m.label}</span>
                <span className="text-xs font-semibold text-foreground">{grams}g</span>
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${m.color}15`, color: m.color }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
