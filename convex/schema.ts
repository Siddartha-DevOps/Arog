import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    dietPreference: v.optional(v.union(v.literal("veg"), v.literal("nonveg"), v.literal("both"))),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    healthGoal: v.optional(
      v.union(
        v.literal("weight_loss"),
        v.literal("muscle_gain"),
        v.literal("diabetes_friendly"),
        v.literal("heart_health"),
        v.literal("maintenance"),
        v.literal("general_wellness"),
      ),
    ),
    calorieGoal: v.optional(v.number()),
    onboardingCompleted: v.optional(v.boolean()),
    // Gamification
    currentStreak: v.optional(v.number()),
    longestStreak: v.optional(v.number()),
    lastLogDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
    totalLogsAllTime: v.optional(v.number()),
    earnedBadges: v.optional(v.array(v.string())), // badge IDs
    totalGreenMeals: v.optional(v.number()), // lifetime green-score meals
  }).index("by_token", ["tokenIdentifier"]),

  waterLogs: defineTable({
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD
    glasses: v.number(), // total glasses for the day
  })
    .index("by_user_date", ["userId", "date"]),

  mealLogs: defineTable({
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD UTC
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snacks"),
    ),
    description: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    fiber: v.optional(v.number()),
    healthScore: v.union(v.literal("green"), v.literal("yellow"), v.literal("red")),
    aiAnalysis: v.optional(v.string()),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),
});
