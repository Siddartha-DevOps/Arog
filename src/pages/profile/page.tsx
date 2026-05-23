import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.ts";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Pencil,
  Check,
  X,
  LogOut,
  Flame,
  UtensilsCrossed,
  Leaf,
  Target,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import { cn } from "@/lib/utils.ts";

// ─── Constants ────────────────────────────────────────────────────────────────

const DIET_OPTIONS = [
  { value: "veg", label: "Vegetarian", desc: "Plant-based only", emoji: "🥗" },
  { value: "nonveg", label: "Non-Vegetarian", desc: "Includes meat & fish", emoji: "🍗" },
  { value: "both", label: "Flexitarian", desc: "No restrictions", emoji: "🍱" },
] as const;

const HEALTH_GOALS = [
  { value: "weight_loss", label: "Weight Loss", emoji: "⚖️" },
  { value: "muscle_gain", label: "Muscle Gain", emoji: "💪" },
  { value: "diabetes_friendly", label: "Diabetes Friendly", emoji: "🩺" },
  { value: "heart_health", label: "Heart Health", emoji: "❤️" },
  { value: "maintenance", label: "Maintenance", emoji: "🎯" },
  { value: "general_wellness", label: "General Wellness", emoji: "🌿" },
] as const;

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

type DietPref = "veg" | "nonveg" | "both";
type HealthGoal =
  | "weight_loss"
  | "muscle_gain"
  | "diabetes_friendly"
  | "heart_health"
  | "maintenance"
  | "general_wellness";
type Gender = "male" | "female" | "other";

// ─── Editable row ─────────────────────────────────────────────────────────────

type EditableRowProps = {
  label: string;
  displayValue: string;
  icon: React.ReactNode;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
};

function EditableRow({
  label,
  displayValue,
  icon,
  editing,
  onEdit,
  onCancel,
  onSave,
  saving,
  children,
}: EditableRowProps) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            {!editing && (
              <p className="text-sm font-medium text-foreground capitalize truncate">{displayValue}</p>
            )}
          </div>
        </div>
        {!editing ? (
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onSave}
              disabled={saving}
              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden mt-3 ml-11"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main inner component ─────────────────────────────────────────────────────

function ProfileInner() {
  const navigate = useNavigate();
  const { signout } = useAuth();
  const updateProfile = useMutation(api.users.updateProfile);

  const user = useQuery(api.users.getCurrentUser, {});

  // Editing state per field
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Local field values
  const [draftName, setDraftName] = useState("");
  const [draftDiet, setDraftDiet] = useState<DietPref>("both");
  const [draftGoal, setDraftGoal] = useState<HealthGoal>("general_wellness");
  const [draftGender, setDraftGender] = useState<Gender>("other");
  const [draftCalories, setDraftCalories] = useState("2000");

  if (user === undefined) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user) { navigate("/"); return null; }
  if (!user.onboardingCompleted) { navigate("/onboarding"); return null; }

  const initials = (user.name ?? "U")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const startEdit = (field: string) => {
    // Populate drafts with current values
    setDraftName(user.name ?? "");
    setDraftDiet((user.dietPreference as DietPref) ?? "both");
    setDraftGoal((user.healthGoal as HealthGoal) ?? "general_wellness");
    setDraftGender((user.gender as Gender) ?? "other");
    setDraftCalories(String(user.calorieGoal ?? 2000));
    setEditing(field);
  };

  const cancelEdit = () => setEditing(null);

  const save = async (field: string) => {
    setSaving(true);
    try {
      const patch: Parameters<typeof updateProfile>[0] = {};
      if (field === "name") patch.name = draftName.trim() || undefined;
      if (field === "diet") patch.dietPreference = draftDiet;
      if (field === "goal") patch.healthGoal = draftGoal;
      if (field === "gender") patch.gender = draftGender;
      if (field === "calories") {
        const n = parseInt(draftCalories, 10);
        if (!isNaN(n) && n > 0) patch.calorieGoal = n;
        else { toast.error("Enter a valid calorie number"); setSaving(false); return; }
      }
      await updateProfile(patch);
      toast.success("Saved!");
      setEditing(null);
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const dietLabel = DIET_OPTIONS.find((d) => d.value === user.dietPreference)?.label ?? "—";
  const goalLabel = HEALTH_GOALS.find((g) => g.value === user.healthGoal)?.label ?? "—";

  const memberSince = new Date(user._creationTime).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-foreground">Profile & Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Avatar + name + email */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 pt-2 pb-2"
        >
          {/* Avatar ring */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-4 border-primary/20 flex items-center justify-center text-primary font-bold text-3xl font-serif select-none">
              {initials || <User className="w-10 h-10" />}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#4CAF50] border-2 border-background flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-serif font-bold text-foreground">{user.name ?? "Your Profile"}</h2>
            {user.email && <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>}
            <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Current Streak", value: `${user.currentStreak ?? 0}`, unit: "days", color: "#FF9800", icon: <Flame className="w-4 h-4" /> },
            { label: "Total Meals", value: String(user.totalLogsAllTime ?? 0), unit: "logged", color: "#4CAF50", icon: <UtensilsCrossed className="w-4 h-4" /> },
            { label: "Healthy Meals", value: String(user.totalGreenMeals ?? 0), unit: "green", color: "#2196F3", icon: <Leaf className="w-4 h-4" /> },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-1" style={{ color: s.color }}>{s.icon}</div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{s.unit}</p>
            </div>
          ))}
        </motion.div>

        {/* Settings card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border"
        >
          <div className="px-5 py-3 bg-muted/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Info</p>
          </div>

          {/* Name */}
          <EditableRow
            label="Display Name"
            displayValue={user.name ?? "—"}
            icon={<User className="w-4 h-4" />}
            editing={editing === "name"}
            onEdit={() => startEdit("name")}
            onCancel={cancelEdit}
            onSave={() => save("name")}
            saving={saving}
          >
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your name"
              className="h-9 text-sm"
              autoFocus
            />
          </EditableRow>

          {/* Gender */}
          <EditableRow
            label="Gender"
            displayValue={user.gender ?? "—"}
            icon={<User className="w-4 h-4" />}
            editing={editing === "gender"}
            onEdit={() => startEdit("gender")}
            onCancel={cancelEdit}
            onSave={() => save("gender")}
            saving={saving}
          >
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setDraftGender(g.value)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer",
                    draftGender === g.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </EditableRow>
        </motion.div>

        {/* Nutrition settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
          className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border"
        >
          <div className="px-5 py-3 bg-muted/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nutrition Preferences</p>
          </div>

          {/* Diet preference */}
          <EditableRow
            label="Diet Type"
            displayValue={dietLabel}
            icon={<Leaf className="w-4 h-4" />}
            editing={editing === "diet"}
            onEdit={() => startEdit("diet")}
            onCancel={cancelEdit}
            onSave={() => save("diet")}
            saving={saving}
          >
            <div className="space-y-1.5">
              {DIET_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDraftDiet(d.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-colors cursor-pointer",
                    draftDiet === d.value
                      ? "bg-primary/10 border-primary text-foreground"
                      : "bg-muted border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="text-base">{d.emoji}</span>
                  <div className="text-left">
                    <p className="font-medium">{d.label}</p>
                    <p className="text-xs opacity-70">{d.desc}</p>
                  </div>
                  {draftDiet === d.value && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </EditableRow>

          {/* Health goal */}
          <EditableRow
            label="Health Goal"
            displayValue={goalLabel}
            icon={<Target className="w-4 h-4" />}
            editing={editing === "goal"}
            onEdit={() => startEdit("goal")}
            onCancel={cancelEdit}
            onSave={() => save("goal")}
            saving={saving}
          >
            <Select value={draftGoal} onValueChange={(v) => setDraftGoal(v as HealthGoal)}>
              <SelectTrigger className="cursor-pointer h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HEALTH_GOALS.map((g) => (
                  <SelectItem key={g.value} value={g.value} className="cursor-pointer">
                    {g.emoji} {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EditableRow>

          {/* Calorie goal */}
          <EditableRow
            label="Daily Calorie Goal"
            displayValue={user.calorieGoal ? `${user.calorieGoal} kcal` : "—"}
            icon={<Flame className="w-4 h-4" />}
            editing={editing === "calories"}
            onEdit={() => startEdit("calories")}
            onCancel={cancelEdit}
            onSave={() => save("calories")}
            saving={saving}
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={draftCalories}
                onChange={(e) => setDraftCalories(e.target.value)}
                placeholder="e.g. 2000"
                className="h-9 text-sm"
                min={500}
                max={6000}
                autoFocus
              />
              <span className="text-sm text-muted-foreground shrink-0">kcal/day</span>
            </div>
          </EditableRow>
        </motion.div>

        {/* Account actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
          className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border"
        >
          <div className="px-5 py-3 bg-muted/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
          </div>

          <button
            onClick={() => navigate("/onboarding")}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Re-do Onboarding</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => signout()}
            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-sm font-medium text-red-500">Sign Out</span>
          </button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground pb-4">
          Arog v2 · Your health, your data 🌿
        </p>
      </main>
    </div>
  );
}

export default function Profile() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center">
          <Skeleton className="h-96 w-full max-w-lg mx-4" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <ProfileInner />
      </Authenticated>
    </>
  );
}
