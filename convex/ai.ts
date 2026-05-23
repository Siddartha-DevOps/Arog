"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

type MacroResult = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  healthScore: "green" | "yellow" | "red";
  aiAnalysis: string;
};

export const analyzeMeal = action({
  args: {
    description: v.string(),
    dietPreference: v.optional(v.string()),
  },
  handler: async (_ctx, args): Promise<MacroResult> => {
    const openai = new OpenAI({
      baseURL: "https://ai-gateway.hercules.app/v1",
      apiKey: process.env.HERCULES_API_KEY,
    });

    const systemPrompt = `You are a nutrition expert specializing in Indian cuisine. 
Analyze the given meal description and return ONLY a JSON object with these exact fields:
{
  "calories": number (total kcal),
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "fiber": number (grams),
  "healthScore": "green" | "yellow" | "red",
  "aiAnalysis": string (1-2 sentence brief insight about the meal's nutrition)
}

Rules for healthScore:
- "green": balanced meal, high protein, good fiber, moderate calories (<600 kcal)
- "yellow": moderate, slightly high in carbs/fat or calories 600-900 kcal
- "red": very high calorie (>900 kcal), very high fat/sugar, deep-fried items

Be accurate for Indian foods: roti ~120kcal, dal ~180kcal/cup, rice ~200kcal/cup, paneer ~300kcal/100g, etc.
${args.dietPreference ? `User's diet: ${args.dietPreference}` : ""}
Return ONLY valid JSON, no markdown.`;

    try {
      const response = await openai.chat.completions.create({
        model: "openai/gpt-5-mini",
        reasoning_effort: "minimal",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this meal: ${args.description}` },
        ],
      });

      const raw = response.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as MacroResult;

      // Validate and sanitize
      return {
        calories: Math.round(Number(parsed.calories) || 0),
        protein: Math.round(Number(parsed.protein) || 0),
        carbs: Math.round(Number(parsed.carbs) || 0),
        fat: Math.round(Number(parsed.fat) || 0),
        fiber: Math.round(Number(parsed.fiber) || 0),
        healthScore: ["green", "yellow", "red"].includes(parsed.healthScore)
          ? parsed.healthScore
          : "yellow",
        aiAnalysis: parsed.aiAnalysis ?? "",
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`AI Error: ${error.message}`);
      }
      throw new Error("Failed to analyze meal. Please try again.");
    }
  },
});
