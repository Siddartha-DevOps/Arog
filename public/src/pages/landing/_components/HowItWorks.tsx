import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { UserCheck, Camera, BarChart3, Trophy } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserCheck,
    color: "#4CAF50",
    title: "Set Your Profile",
    description:
      "Tell us your diet preference (Veg / Non-Veg / Both), gender, and health goal. Personalization starts on day one.",
  },
  {
    step: "02",
    icon: Camera,
    color: "#FF9800",
    title: "Log Your Meals",
    description:
      "Type a meal description like '2 roti + paneer curry' or describe what you ate. AI handles the rest in seconds.",
  },
  {
    step: "03",
    icon: BarChart3,
    color: "#2196F3",
    title: "See Your Nutrition",
    description:
      "Get instant calorie counts, macros, and a health score (green/yellow/red) for every meal you log.",
  },
  {
    step: "04",
    icon: Trophy,
    color: "#FFC107",
    title: "Earn & Level Up",
    description:
      "Build streaks, earn badges, and watch your health score improve week by week with gamified progress.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#FF9800]/10 text-[#FF9800] text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Camera className="w-4 h-4" />
            Simple 4-step process
          </div>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Healthy habits in 4 easy steps
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No complicated setup. No confusing menus. Just log, learn, and level up.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#4CAF50]/30 via-[#FF9800]/30 to-[#FFC107]/30" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                {/* Icon circle */}
                <div className="relative inline-flex">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                    style={{ backgroundColor: `${step.color}15`, border: `2px solid ${step.color}30` }}
                  >
                    <Icon className="w-9 h-9" style={{ color: step.color }} />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </div>
                </div>

                <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
