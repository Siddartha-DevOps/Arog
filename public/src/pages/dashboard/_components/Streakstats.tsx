import { motion } from "motion/react";
import { Flame } from "lucide-react";

type Props = {
  streak: number;
  longestStreak: number;
  totalLogs: number;
  greenMeals: number;
};

function StatRing({
  value,
  max,
  label,
  sublabel,
  color,
  icon,
}: {
  value: number;
  max: number;
  label: string;
  sublabel: string;
  color: string;
  icon: React.ReactNode;
}) {
  const pct = Math.min(value / max, 1);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle cx="44" cy="44" r={r} fill="none" stroke="currentColor" strokeWidth="7" className="text-border" />
          {/* Progress */}
          <motion.circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        {/* Center icon + value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base">{icon}</span>
          <span className="text-lg font-bold leading-none text-foreground">{value}</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-foreground text-center">{label}</p>
      <p className="text-[10px] text-muted-foreground text-center">{sublabel}</p>
    </div>
  );
}

export default function StreakStats({ streak, longestStreak, totalLogs, greenMeals }: Props) {
  return (
    <div className="bg-gradient-to-br from-[#FF9800]/10 to-[#FFC107]/10 border border-[#FF9800]/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-[#FF9800]" />
        <h3 className="font-semibold text-foreground">Your Progress</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatRing
          value={streak}
          max={Math.max(30, streak)}
          label={`${streak}-Day Streak`}
          sublabel="Current streak"
          color="#FF9800"
          icon={<Flame className="w-4 h-4 text-[#FF9800]" />}
        />
        <StatRing
          value={longestStreak}
          max={Math.max(30, longestStreak)}
          label={`${longestStreak}-Day Best`}
          sublabel="Personal best"
          color="#FFC107"
          icon="🏆"
        />
        <StatRing
          value={totalLogs}
          max={Math.max(100, totalLogs)}
          label={`${totalLogs} Meals`}
          sublabel="Total logged"
          color="#4CAF50"
          icon="📝"
        />
        <StatRing
          value={greenMeals}
          max={Math.max(20, greenMeals)}
          label={`${greenMeals} Green`}
          sublabel="Healthy meals"
          color="#2196F3"
          icon="🥦"
        />
      </div>
    </div>
  );
}
