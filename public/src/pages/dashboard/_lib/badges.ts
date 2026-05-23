export type BadgeId =
  | "first_log"
  | "streak_3"
  | "streak_7"
  | "streak_14"
  | "streak_30"
  | "logs_10"
  | "logs_50"
  | "logs_100"
  | "green_5"
  | "green_20"
  | "longest_streak_7"
  | "longest_streak_30";

export type Badge = {
  id: BadgeId;
  emoji: string;
  title: string;
  description: string;
  color: string; // tailwind bg class
  borderColor: string;
};

export const ALL_BADGES: Badge[] = [
  {
    id: "first_log",
    emoji: "🥗",
    title: "First Bite",
    description: "Log your very first meal",
    color: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-400",
  },
  {
    id: "streak_3",
    emoji: "🔥",
    title: "On Fire",
    description: "Log meals 3 days in a row",
    color: "bg-orange-100 dark:bg-orange-900/30",
    borderColor: "border-orange-400",
  },
  {
    id: "streak_7",
    emoji: "🏅",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    borderColor: "border-yellow-400",
  },
  {
    id: "streak_14",
    emoji: "⚡",
    title: "Fortnight Force",
    description: "Maintain a 14-day streak",
    color: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-400",
  },
  {
    id: "streak_30",
    emoji: "👑",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    color: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-400",
  },
  {
    id: "logs_10",
    emoji: "📝",
    title: "Consistent Logger",
    description: "Log 10 meals total",
    color: "bg-teal-100 dark:bg-teal-900/30",
    borderColor: "border-teal-400",
  },
  {
    id: "logs_50",
    emoji: "📊",
    title: "Data Driven",
    description: "Log 50 meals total",
    color: "bg-indigo-100 dark:bg-indigo-900/30",
    borderColor: "border-indigo-400",
  },
  {
    id: "logs_100",
    emoji: "🎯",
    title: "Century Club",
    description: "Log 100 meals total",
    color: "bg-rose-100 dark:bg-rose-900/30",
    borderColor: "border-rose-400",
  },
  {
    id: "green_5",
    emoji: "🥦",
    title: "Health Starter",
    description: "Log 5 green-score meals",
    color: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-400",
  },
  {
    id: "green_20",
    emoji: "🌿",
    title: "Nutrition Hero",
    description: "Log 20 green-score meals",
    color: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-500",
  },
  {
    id: "longest_streak_7",
    emoji: "🏆",
    title: "Streak Champion",
    description: "Achieve a 7-day personal best streak",
    color: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-400",
  },
  {
    id: "longest_streak_30",
    emoji: "💎",
    title: "Diamond Habit",
    description: "Achieve a 30-day personal best streak",
    color: "bg-cyan-100 dark:bg-cyan-900/30",
    borderColor: "border-cyan-400",
  },
];

export function computeEarnedBadges(stats: {
  totalLogsAllTime: number;
  currentStreak: number;
  longestStreak: number;
  totalGreenMeals: number;
}): BadgeId[] {
  const earned: BadgeId[] = [];
  const { totalLogsAllTime: logs, currentStreak, longestStreak, totalGreenMeals: green } = stats;

  if (logs >= 1) earned.push("first_log");
  if (currentStreak >= 3) earned.push("streak_3");
  if (currentStreak >= 7) earned.push("streak_7");
  if (currentStreak >= 14) earned.push("streak_14");
  if (currentStreak >= 30) earned.push("streak_30");
  if (logs >= 10) earned.push("logs_10");
  if (logs >= 50) earned.push("logs_50");
  if (logs >= 100) earned.push("logs_100");
  if (green >= 5) earned.push("green_5");
  if (green >= 20) earned.push("green_20");
  if (longestStreak >= 7) earned.push("longest_streak_7");
  if (longestStreak >= 30) earned.push("longest_streak_30");

  return earned;
}

export type BadgeProgressItem = {
  badge: Badge;
  earned: boolean;
  progress: number; // 0-100
  progressLabel: string;
};

export function getBadgeProgress(
  stats: {
    totalLogsAllTime: number;
    currentStreak: number;
    longestStreak: number;
    totalGreenMeals: number;
  },
  earnedIds: BadgeId[],
): BadgeProgressItem[] {
  const { totalLogsAllTime: logs, currentStreak, longestStreak, totalGreenMeals: green } = stats;

  const thresholds: Record<BadgeId, { current: number; target: number }> = {
    first_log: { current: Math.min(logs, 1), target: 1 },
    streak_3: { current: Math.min(currentStreak, 3), target: 3 },
    streak_7: { current: Math.min(currentStreak, 7), target: 7 },
    streak_14: { current: Math.min(currentStreak, 14), target: 14 },
    streak_30: { current: Math.min(currentStreak, 30), target: 30 },
    logs_10: { current: Math.min(logs, 10), target: 10 },
    logs_50: { current: Math.min(logs, 50), target: 50 },
    logs_100: { current: Math.min(logs, 100), target: 100 },
    green_5: { current: Math.min(green, 5), target: 5 },
    green_20: { current: Math.min(green, 20), target: 20 },
    longest_streak_7: { current: Math.min(longestStreak, 7), target: 7 },
    longest_streak_30: { current: Math.min(longestStreak, 30), target: 30 },
  };

  return ALL_BADGES.map((badge) => {
    const earned = earnedIds.includes(badge.id);
    const { current, target } = thresholds[badge.id];
    const progress = Math.round((current / target) * 100);
    const progressLabel = `${current} / ${target}`;
    return { badge, earned, progress, progressLabel };
  });
}
