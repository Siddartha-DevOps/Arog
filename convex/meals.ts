import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

const mealTypeValidator = v.union(
  v.literal("breakfast"),
  v.literal("lunch"),
  v.literal("dinner"),
  v.literal("snacks"),
);

export const logMeal = mutation({
  args: {
    date: v.string(),
    mealType: mealTypeValidator,
    description: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    fiber: v.optional(v.number()),
    healthScore: v.union(v.literal("green"), v.literal("yellow"), v.literal("red")),
    aiAnalysis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ message: "Not authenticated", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ message: "User not found", code: "NOT_FOUND" });

    const id = await ctx.db.insert("mealLogs", { ...args, userId: user._id });

    // Update streak
    const today = args.date;
    const lastLog = user.lastLogDate;
    let newStreak = user.currentStreak ?? 0;

    if (lastLog !== today) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      newStreak = lastLog === yesterdayStr ? newStreak + 1 : 1;
    }

    const newLongest = Math.max(user.longestStreak ?? 0, newStreak);
    const greenAdd = args.healthScore === "green" ? 1 : 0;

    await ctx.db.patch(user._id, {
      lastLogDate: today,
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalLogsAllTime: (user.totalLogsAllTime ?? 0) + 1,
      totalGreenMeals: (user.totalGreenMeals ?? 0) + greenAdd,
    });

    return id;
  },
});

export const deleteMeal = mutation({
  args: { mealId: v.id("mealLogs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ message: "Not authenticated", code: "UNAUTHENTICATED" });

    const meal = await ctx.db.get(args.mealId);
    if (!meal) throw new ConvexError({ message: "Meal not found", code: "NOT_FOUND" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user || meal.userId !== user._id)
      throw new ConvexError({ message: "Forbidden", code: "FORBIDDEN" });

    await ctx.db.delete(args.mealId);
  },
});

export const getMealsForDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("mealLogs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date),
      )
      .collect();
  },
});

export const getWeeklyStats = query({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return [];

    const meals = await ctx.db
      .query("mealLogs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id)
          .gte("date", args.startDate)
          .lte("date", args.endDate),
      )
      .collect();

    // Group by date
    const byDate: Record<string, { calories: number; protein: number; carbs: number; fat: number; mealCount: number }> = {};
    for (const meal of meals) {
      if (!byDate[meal.date]) {
        byDate[meal.date] = { calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 };
      }
      byDate[meal.date].calories += meal.calories;
      byDate[meal.date].protein += meal.protein;
      byDate[meal.date].carbs += meal.carbs;
      byDate[meal.date].fat += meal.fat;
      byDate[meal.date].mealCount += 1;
    }

    return Object.entries(byDate).map(([date, stats]) => ({ date, ...stats }));
  },
});
