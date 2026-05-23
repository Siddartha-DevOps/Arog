import { motion } from "motion/react";
import { ArrowRight, Camera, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Authenticated, Unauthenticated } from "convex/react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge.tsx";

const stats = [
  { value: "50K+", label: "Indian dishes" },
  { value: "98%", label: "Accuracy" },
  { value: "10K+", label: "Active users" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/8 via-background to-[#FF9800]/8" />
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF9800]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#2196F3]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20 hover:bg-[#4CAF50]/15 text-sm px-3 py-1">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              AI-Powered Nutrition for India
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-6xl font-serif font-bold text-foreground leading-tight text-balance"
          >
            Track your{" "}
            <span className="text-[#4CAF50]">health</span>{" "}
            the{" "}
            <span className="text-[#FF9800]">Indian</span>{" "}
            way
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            Snap a photo or type "2 roti, dal fry" — Arog instantly calculates calories,
            macros, and nutrition for your favourite Indian meals. Powered by AI, built for Bharat.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <Authenticated>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#FF9800] hover:bg-[#FF9800]/90 text-white font-semibold shadow-lg shadow-[#FF9800]/25 cursor-pointer"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Authenticated>
            <Unauthenticated>
              <div className="flex flex-wrap gap-3">
                <SignInButton />
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-semibold cursor-pointer"
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  See How It Works
                </Button>
              </div>
            </Unauthenticated>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-6 pt-2"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold font-serif text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — visual mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="hidden lg:flex justify-center items-center"
        >
          <div className="relative w-80">
            {/* Phone mockup */}
            <div className="bg-foreground rounded-[2.5rem] p-2 shadow-2xl shadow-foreground/20">
              <div className="bg-background rounded-[2rem] overflow-hidden">
                {/* Status bar */}
                <div className="bg-[#4CAF50] px-6 pt-8 pb-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/80 text-xs font-medium">Good morning 👋</span>
                    <div className="w-6 h-6 rounded-full bg-white/20" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Today's Calories</h3>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-white text-4xl font-bold">1,240</span>
                    <span className="text-white/60 text-sm mb-1">/ 2,000 kcal</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-[62%]" />
                  </div>
                </div>

                {/* Macros */}
                <div className="px-4 py-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "Protein", val: "48g", color: "#2196F3" },
                    { label: "Carbs", val: "142g", color: "#FF9800" },
                    { label: "Fat", val: "38g", color: "#4CAF50" },
                  ].map((m) => (
                    <div key={m.label} className="bg-muted rounded-xl p-2.5 text-center">
                      <div className="text-sm font-bold text-foreground">{m.val}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Meal log */}
                <div className="px-4 pb-4 space-y-2">
                  {[
                    { meal: "Dal Tadka + 3 Roti", cal: "480 kcal", status: "green" },
                    { meal: "Paneer Bhurji", cal: "320 kcal", status: "yellow" },
                    { meal: "Masala Chai", cal: "55 kcal", status: "green" },
                  ].map((item) => (
                    <div key={item.meal} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === "green" ? "bg-[#4CAF50]" : "bg-[#FFC107]"
                        }`} />
                        <span className="text-xs font-medium text-foreground truncate max-w-[110px]">{item.meal}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.cal}</span>
                    </div>
                  ))}
                </div>

                {/* Streak badge */}
                <div className="mx-4 mb-4 bg-gradient-to-r from-[#FF9800]/10 to-[#FFC107]/10 border border-[#FF9800]/20 rounded-xl p-3 flex items-center gap-3">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <div className="text-xs font-bold text-foreground">7-Day Streak!</div>
                    <div className="text-[10px] text-muted-foreground">Keep it up, champ!</div>
                  </div>
                  <Star className="w-4 h-4 text-[#FFC107] ml-auto" />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-16 bg-white dark:bg-card rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-border"
            >
              <div className="w-8 h-8 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#4CAF50]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-foreground">AI Scan</div>
                <div className="text-[10px] text-[#4CAF50]">Instant macros</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -left-6 bottom-24 bg-white dark:bg-card rounded-2xl shadow-xl p-3 border border-border"
            >
              <div className="text-[11px] font-bold text-foreground">🏆 New Badge!</div>
              <div className="text-[10px] text-[#FFC107] mt-0.5">Protein King</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
