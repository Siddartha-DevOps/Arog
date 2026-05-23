import { motion } from "motion/react";
import { cn } from "@/lib/utils.ts";
import type { BadgeProgressItem } from "../_lib/badges.ts";
import { Lock } from "lucide-react";

type Props = {
  items: BadgeProgressItem[];
};

export default function BadgeGrid({ items }: Props) {
  const earned = items.filter((i) => i.earned);
  const unearned = items.filter((i) => !i.earned);
  const sorted = [...earned, ...unearned];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {sorted.map((item, idx) => (
        <motion.div
          key={item.badge.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.04, duration: 0.3, ease: "easeOut" }}
          className={cn(
            "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
            item.earned
              ? `${item.badge.color} ${item.badge.borderColor}`
              : "bg-muted/40 border-border opacity-60",
          )}
        >
          {/* Emoji */}
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
              item.earned ? "bg-white/60 dark:bg-black/20" : "bg-muted",
            )}
          >
            {item.earned ? (
              <span role="img" aria-label={item.badge.title}>{item.badge.emoji}</span>
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>

          {/* Title */}
          <p className={cn("text-xs font-bold text-center leading-tight", item.earned ? "text-foreground" : "text-muted-foreground")}>
            {item.badge.title}
          </p>

          {/* Description */}
          <p className="text-[10px] text-center text-muted-foreground leading-tight">
            {item.badge.description}
          </p>

          {/* Progress bar (only for unearned) */}
          {!item.earned && (
            <div className="w-full">
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1">{item.progressLabel}</p>
            </div>
          )}

          {/* Earned badge shine */}
          {item.earned && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.2, delay: idx * 0.04 + 0.2 }}
              className="absolute inset-0 rounded-2xl bg-white pointer-events-none"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
