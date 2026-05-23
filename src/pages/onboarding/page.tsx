import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { toast } from "sonner";
import { Leaf, Drumstick, ChefHat, User, Users, HelpCircle, TrendingDown, Dumbbell, Heart, Activity, Scale, Smile } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

type DietPref = "veg" | "nonveg" | "both";
type Gender = "male" | "female" | "other";
type HealthGoal = "weight_loss" | "muscle_gain" | "diabetes_friendly" | "heart_health" | "maintenance" | "general_wellness";

type OnboardingState = {
  dietPreference: DietPref | null;
  gender: Gender | null;
  healthGoal: HealthGoal | null;
};

const TOTAL_STEPS = 3;

const dietOptions: { id: DietPref; icon: typeof Leaf; label: string; desc: string; color: string }[] = [
  { id: "veg", icon: Leaf, label: "Vegetarian", desc: "Plant-based only", color: "#4CAF50" },
  { id: "nonveg", icon: Drumstick, label: "Non-Vegetarian", desc: "Includes meat & fish", color: "#FF9800" },
  { id: "both", icon: ChefHat, label: "Both", desc: "No restrictions", color: "#9C27B0" },
];

const genderOptions: { id: Gender; icon: typeof User; label: string; color: string }[] = [
  { id: "male", icon: User, label: "Male", color: "#2196F3" },
  { id: "female", icon: Users, label: "Female", color: "#E91E63" },
  { id: "other", icon: HelpCircle, label: "Prefer not to say", color: "#9E9E9E" },
];

const goalOptions: { id: HealthGoal; icon: typeof TrendingDown; label: string; desc: string; color: string; calories: number }[] = [
  { id: "weight_loss", icon: TrendingDown, label: "Lose Weight", desc: "Calorie deficit plan", color: "#F44336", calories: 1600 },
  { id: "muscle_gain", icon: Dumbbell, label: "Build Muscle", desc: "High protein intake", color: "#2196F3", calories: 2500 },
  { id: "diabetes_friendly", icon: Activity, label: "Diabetes Friendly", desc: "Low GI foods", color: "#FF9800", calories: 1800 },
  { id: "heart_health", icon: Heart, label: "Heart Health", desc: "Low sodium, low fat", color: "#E91E63", calories: 1900 },
  { id: "maintenance", icon: Scale, label: "Maintain Weight", desc: "Stay at current weight", color: "#4CAF50", calories: 2000 },
  { id: "general_wellness", icon: Smile, label: "General Wellness", desc: "Balanced nutrition", color: "#9C27B0", calories: 2000 },
];

const CALORIE_MAP: Record<HealthGoal, number> = {
  weight_loss: 1600,
  muscle_gain: 2500,
  diabetes_friendly: 1800,
  heart_health: 1900,
  maintenance: 2000,
  general_wellness: 2000,
};

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === current ? "2rem" : "0.5rem",
            backgroundColor: i <= current ? "#4CAF50" : "#e5e7eb",
          }}
        />
      ))}
    </div>
  );
}

function OnboardingInner() {
  const navigate = useNavigate();
  const saveOnboarding = useMutation(api.users.saveOnboarding);
  const currentUser = useQuery(api.users.getCurrentUser, {});
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<OnboardingState>({
    dietPreference: null,
    gender: null,
    healthGoal: null,
  });

  // Already onboarded → go to dashboard
  if (currentUser?.onboardingCompleted) {
    navigate("/dashboard");
    return null;
  }

  const canNext =
    (step === 0 && state.dietPreference !== null) ||
    (step === 1 && state.gender !== null) ||
    (step === 2 && state.healthGoal !== null);

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Final submit
    if (!state.dietPreference || !state.gender || !state.healthGoal) return;
    setSaving(true);
    try {
      await saveOnboarding({
        dietPreference: state.dietPreference,
        gender: state.gender,
        healthGoal: state.healthGoal,
        calorieGoal: CALORIE_MAP[state.healthGoal],
      });
      toast.success("Profile saved! Welcome to Arog 🌿");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif font-bold text-lg">Arog</span>
        </div>
        <StepIndicator current={step} total={TOTAL_STEPS} />
        <div className="text-sm text-muted-foreground">
          {step + 1} / {TOTAL_STEPS}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepDiet
                key="diet"
                selected={state.dietPreference}
                onSelect={(v) => setState((s) => ({ ...s, dietPreference: v }))}
              />
            )}
            {step === 1 && (
              <StepGender
                key="gender"
                selected={state.gender}
                onSelect={(v) => setState((s) => ({ ...s, gender: v }))}
              />
            )}
            {step === 2 && (
              <StepGoal
                key="goal"
                selected={state.healthGoal}
                onSelect={(v) => setState((s) => ({ ...s, healthGoal: v }))}
              />
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="cursor-pointer"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canNext || saving}
              className="bg-[#FF9800] hover:bg-[#FF9800]/90 text-white font-semibold px-8 cursor-pointer"
            >
              {saving ? "Saving..." : step === TOTAL_STEPS - 1 ? "Start Tracking 🌿" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDiet({ selected, onSelect }: { selected: DietPref | null; onSelect: (v: DietPref) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🥗</div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">What's your diet preference?</h2>
        <p className="text-muted-foreground">We'll tailor your food database and suggestions accordingly.</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {dietOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(opt.id)}
              className="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left w-full"
              style={{
                borderColor: isSelected ? opt.color : "var(--border)",
                backgroundColor: isSelected ? `${opt.color}10` : "var(--card)",
                boxShadow: isSelected ? `0 4px 20px ${opt.color}25` : undefined,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${opt.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: opt.color }} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{opt.label}</div>
                <div className="text-sm text-muted-foreground">{opt.desc}</div>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: isSelected ? opt.color : "var(--border)",
                  backgroundColor: isSelected ? opt.color : "transparent",
                }}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function StepGender({ selected, onSelect }: { selected: Gender | null; onSelect: (v: Gender) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">👤</div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">What's your gender?</h2>
        <p className="text-muted-foreground">Helps us calculate more accurate calorie and nutrition recommendations.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {genderOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt.id)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
              style={{
                borderColor: isSelected ? opt.color : "var(--border)",
                backgroundColor: isSelected ? `${opt.color}10` : "var(--card)",
                boxShadow: isSelected ? `0 4px 20px ${opt.color}25` : undefined,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${opt.color}20` }}
              >
                <Icon className="w-7 h-7" style={{ color: opt.color }} />
              </div>
              <div className="font-medium text-foreground text-sm text-center">{opt.label}</div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function StepGoal({ selected, onSelect }: { selected: HealthGoal | null; onSelect: (v: HealthGoal) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎯</div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">What's your health goal?</h2>
        <p className="text-muted-foreground">We'll set your daily calorie target and nutrition plan accordingly.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt.id)}
              className="flex items-start gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left"
              style={{
                borderColor: isSelected ? opt.color : "var(--border)",
                backgroundColor: isSelected ? `${opt.color}10` : "var(--card)",
                boxShadow: isSelected ? `0 4px 20px ${opt.color}20` : undefined,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${opt.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: opt.color }} />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">{opt.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                <div className="text-xs font-medium mt-1" style={{ color: opt.color }}>{opt.calories} kcal/day</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Onboarding() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center">
          <Skeleton className="h-96 w-full max-w-xl" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Sign in to get started</h1>
          <p className="text-muted-foreground text-center max-w-sm">
            Create your Arog account to personalize your nutrition journey.
          </p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <OnboardingInner />
      </Authenticated>
    </>
  );
}
