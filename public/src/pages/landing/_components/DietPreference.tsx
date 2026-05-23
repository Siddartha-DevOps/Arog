import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Leaf, Drumstick, ChefHat } from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Unauthenticated, Authenticated } from "convex/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

type DietType = "veg" | "nonveg" | "both";

const dietOptions: { id: DietType; icon: typeof Leaf; label: string; desc: string; color: string; gradient: string }[] = [
  {
    id: "veg",
    icon: Leaf,
    label: "Vegetarian",
    desc: "Plant-based Indian cuisine",
    color: "#4CAF50",
    gradient: "from-[#4CAF50]/10 to-[#4CAF50]/5",
  },
  {
    id: "nonveg",
    icon: Drumstick,
    label: "Non-Vegetarian",
    desc: "All foods including meat",
    color: "#FF9800",
    gradient: "from-[#FF9800]/10 to-[#FF9800]/5",
  },
  {
    id: "both",
    icon: ChefHat,
    label: "Both",
    desc: "Everything on the menu",
    color: "#9C27B0",
    gradient: "from-[#4CAF50]/10 to-[#FF9800]/10",
  },
];

export default function DietPreference() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selected, setSelected] = useState<DietType>("veg");

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Your food, your way
          </h2>
          <p className="text-muted-foreground text-lg">
            Arog adapts to your diet preferences and serves personalized Indian nutrition insights.
          </p>
        </motion.div>

        {/* Diet toggles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {dietOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center ${
                  isSelected
                    ? "shadow-lg scale-105"
                    : "border-border bg-card hover:border-muted-foreground/30"
                } bg-gradient-to-br ${opt.gradient}`}
                style={{
                  borderColor: isSelected ? opt.color : undefined,
                  boxShadow: isSelected ? `0 8px 24px ${opt.color}25` : undefined,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${opt.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: opt.color }} />
                </div>
                <div className="font-semibold text-foreground text-sm sm:text-base">{opt.label}</div>
                <div className="text-xs text-muted-foreground mt-1 hidden sm:block">{opt.desc}</div>
                {isSelected && (
                  <motion.div
                    layoutId="selected-diet"
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `0 0 0 2px ${opt.color}` }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Preview card */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 text-center"
        >
          <div className="text-muted-foreground text-sm mb-4">
            Ready to track your{" "}
            <span className="font-semibold" style={{ color: dietOptions.find((d) => d.id === selected)?.color }}>
              {dietOptions.find((d) => d.id === selected)?.label.toLowerCase()}
            </span>{" "}
            diet with AI-powered insights?
          </div>
          <Unauthenticated>
            <div className="flex justify-center">
              <SignInButton />
            </div>
          </Unauthenticated>
          <Authenticated>
            <Link to="/onboarding">
              <Button className="bg-[#FF9800] hover:bg-[#FF9800]/90 text-white font-semibold cursor-pointer">
                Complete Your Profile
              </Button>
            </Link>
          </Authenticated>
        </motion.div>
      </div>
    </section>
  );
}
