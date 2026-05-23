import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { CheckCircle, Leaf } from "lucide-react";

const dishes = [
  {
    name: "Dal Makhani",
    cal: 320,
    protein: "14g",
    carbs: "38g",
    fat: "12g",
    status: "green",
    tag: "High Protein",
    tagColor: "#4CAF50",
    emoji: "🫘",
  },
  {
    name: "Butter Chicken",
    cal: 485,
    protein: "32g",
    carbs: "18g",
    fat: "28g",
    status: "yellow",
    tag: "High Fat",
    tagColor: "#FFC107",
    emoji: "🍗",
  },
  {
    name: "Poha",
    cal: 250,
    protein: "5g",
    carbs: "48g",
    fat: "6g",
    status: "green",
    tag: "Low Cal",
    tagColor: "#4CAF50",
    emoji: "🍚",
  },
  {
    name: "Samosa (2 pcs)",
    cal: 310,
    protein: "6g",
    carbs: "42g",
    fat: "14g",
    status: "red",
    tag: "High Carb",
    tagColor: "#F44336",
    emoji: "🥟",
  },
  {
    name: "Palak Paneer",
    cal: 280,
    protein: "12g",
    carbs: "14g",
    fat: "18g",
    status: "green",
    tag: "Balanced",
    tagColor: "#4CAF50",
    emoji: "🥬",
  },
  {
    name: "Masala Dosa",
    cal: 340,
    protein: "8g",
    carbs: "52g",
    fat: "11g",
    status: "yellow",
    tag: "Moderate",
    tagColor: "#FF9800",
    emoji: "🫓",
  },
];

const statusConfig = {
  green: { label: "Healthy", color: "#4CAF50", bg: "#4CAF50" },
  yellow: { label: "Moderate", color: "#FFC107", bg: "#FFC107" },
  red: { label: "Caution", color: "#F44336", bg: "#F44336" },
};

export default function NutritionShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="nutrition" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#4CAF50] text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Leaf className="w-4 h-4" />
            Indian Food Database
          </div>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Know what's on your thali
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Traffic-light health scores make it easy to understand your meals at a glance.
            Green = healthy. Yellow = moderate. Red = eat less.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dishes.map((dish, index) => {
            const status = statusConfig[dish.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={dish.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{dish.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{dish.name}</h3>
                      <div
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1"
                        style={{ backgroundColor: `${dish.tagColor}15`, color: dish.tagColor }}
                      >
                        {dish.tag}
                      </div>
                    </div>
                  </div>
                  {/* Traffic light */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: status.bg }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>

                {/* Calorie */}
                <div className="text-3xl font-bold text-foreground mb-3">
                  {dish.cal} <span className="text-sm font-normal text-muted-foreground">kcal</span>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Protein", val: dish.protein, color: "#2196F3" },
                    { label: "Carbs", val: dish.carbs, color: "#FF9800" },
                    { label: "Fat", val: dish.fat, color: "#4CAF50" },
                  ].map((macro) => (
                    <div key={macro.label} className="bg-muted rounded-lg p-2 text-center">
                      <div className="text-sm font-semibold" style={{ color: macro.color }}>
                        {macro.val}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{macro.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
