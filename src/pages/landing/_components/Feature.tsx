import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import {
  Camera,
  Zap,
  Trophy,
  Shield,
  BarChart3,
  Leaf,
  Heart,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    color: "#FF9800",
    bgColor: "#FF9800",
    title: "AI Meal Recognition",
    description:
      "Snap a photo or describe your meal — Arog's AI instantly identifies Indian dishes and calculates accurate macros.",
  },
  {
    icon: Leaf,
    color: "#4CAF50",
    bgColor: "#4CAF50",
    title: "Indian Food Database",
    description:
      "50,000+ Indian dishes including regional cuisines — from Rajma Chawal to Appam, Biryani to Dhokla.",
  },
  {
    icon: Heart,
    color: "#F44336",
    bgColor: "#F44336",
    title: "Personalized Goals",
    description:
      "Set custom goals for weight loss, muscle gain, diabetes management, or heart health with AI-guided plans.",
  },
  {
    icon: Trophy,
    color: "#FFC107",
    bgColor: "#FFC107",
    title: "Gamified Progress",
    description:
      "Earn badges, maintain streaks, and level up your health journey with daily challenges and rewards.",
  },
  {
    icon: BarChart3,
    color: "#2196F3",
    bgColor: "#2196F3",
    title: "Deep Nutrition Insights",
    description:
      "Weekly reports, trend analysis, and micronutrient tracking — understand your body like never before.",
  },
  {
    icon: Shield,
    color: "#9C27B0",
    bgColor: "#9C27B0",
    title: "Privacy First",
    description:
      "End-to-end encrypted data. No forced card details. Your health data belongs to you, always.",
  },
  {
    icon: Zap,
    color: "#FF9800",
    bgColor: "#FF9800",
    title: "Instant Macro Analysis",
    description:
      "Get calories, protein, carbs, fat, and fiber in under 2 seconds. No manual searching required.",
  },
  {
    icon: Globe,
    color: "#4CAF50",
    bgColor: "#4CAF50",
    title: "Cross-Platform Sync",
    description:
      "Your data syncs seamlessly across web and mobile. Install as a PWA on any iOS or Android device.",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${feature.bgColor}15` }}
      >
        <Icon className="w-6 h-6" style={{ color: feature.color }} />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#4CAF50] text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            Everything you need
          </div>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Built for the way Indians eat
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From dals to dosas, Arog understands your cuisine. Track nutrition, set goals,
            and build lasting habits with AI that gets Indian food right.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
