import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { TrendingUp } from "lucide-react";

type Props = {
  calorieGoal: number;
};

function getWeekDates() {
  const today = new Date();
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-[#4CAF50]">{payload[0].value} kcal</p>
    </div>
  );
}

export default function WeeklyChart({ calorieGoal }: Props) {
  const weekDates = getWeekDates();
  const startDate = weekDates[0];
  const endDate = weekDates[6];

  const stats = useQuery(api.meals.getWeeklyStats, { startDate, endDate });

  if (stats === undefined) {
    return <Skeleton className="h-48 w-full rounded-2xl" />;
  }

  const statsMap = new Map(stats.map((s) => [s.date, s]));

  const chartData = weekDates.map((date) => {
    const dayData = statsMap.get(date);
    const dayOfWeek = new Date(date + "T12:00:00").getDay();
    return {
      date,
      day: DAY_LABELS[dayOfWeek],
      calories: dayData?.calories ?? 0,
      isToday: date === endDate,
    };
  });

  const avgCalories = Math.round(
    chartData.filter((d) => d.calories > 0).reduce((s, d) => s + d.calories, 0) /
      Math.max(chartData.filter((d) => d.calories > 0).length, 1),
  );

  const daysLogged = chartData.filter((d) => d.calories > 0).length;

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
          <h2 className="font-semibold text-foreground">Weekly Overview</h2>
        </div>
        <span className="text-xs text-muted-foreground">{daysLogged}/7 days logged</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Avg: {avgCalories} kcal/day</p>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} barSize={28} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", radius: 8 }} />
          <ReferenceLine
            y={calorieGoal}
            stroke="#4CAF50"
            strokeDasharray="4 3"
            strokeOpacity={0.5}
          />
          <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.isToday
                    ? "#FF9800"
                    : entry.calories >= calorieGoal
                      ? "#4CAF50"
                      : entry.calories > 0
                        ? "#4CAF5080"
                        : "var(--muted)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#FF9800]" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#4CAF50]" />
          <span>Goal met</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#4CAF5080]" />
          <span>Under goal</span>
        </div>
      </div>
    </div>
  );
}
