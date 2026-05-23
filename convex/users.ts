import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const updateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: identity.name,
        email: identity.email,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name,
      email: identity.email,
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ message: "Not authenticated", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ message: "User not found", code: "NOT_FOUND" });

    // Only patch fields that were provided
    const patch: Partial<typeof args> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.dietPreference !== undefined) patch.dietPreference = args.dietPreference;
    if (args.gender !== undefined) patch.gender = args.gender;
    if (args.healthGoal !== undefined) patch.healthGoal = args.healthGoal;
    if (args.calorieGoal !== undefined) patch.calorieGoal = args.calorieGoal;

    await ctx.db.patch(user._id, patch);
    return user._id;
  },
});

export const saveOnboarding = mutation({
  args: {
    dietPreference: v.union(v.literal("veg"), v.literal("nonveg"), v.literal("both")),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    healthGoal: v.union(
      v.literal("weight_loss"),
      v.literal("muscle_gain"),
      v.literal("diabetes_friendly"),
      v.literal("heart_health"),
      v.literal("maintenance"),
      v.literal("general_wellness"),
    ),
    calorieGoal: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: "Not authenticated", code: "UNAUTHENTICATED" });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError({ message: "User not found", code: "NOT_FOUND" });
    }

    await ctx.db.patch(user._id, {
      ...args,
      onboardingCompleted: true,
    });

    return user._id;
  },
});
