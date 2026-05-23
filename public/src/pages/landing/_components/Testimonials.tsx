import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Fitness Enthusiast, Mumbai",
    avatar: "PS",
    color: "#4CAF50",
    rating: 5,
    quote:
      "Finally an app that knows the difference between dosa and uttapam! Arog has completely changed how I track my nutrition. Lost 8 kgs in 3 months!",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer, Bengaluru",
    avatar: "RM",
    color: "#FF9800",
    rating: 5,
    quote:
      "The AI meal recognition is insane. I just type '2 chapati, aloo gobi' and boom — instant macros. Way better than manually searching every food item.",
  },
  {
    name: "Ananya Krishnan",
    role: "Nutritionist, Chennai",
    avatar: "AK",
    color: "#2196F3",
    rating: 5,
    quote:
      "I recommend Arog to all my clients now. The Indian food database is incredibly accurate and the gamification keeps them motivated between sessions.",
  },
  {
    name: "Vikram Singh",
    role: "Gym Owner, Delhi",
    avatar: "VS",
    color: "#FFC107",
    rating: 5,
    quote:
      "My members love the streak system. Arog has the best understanding of Indian regional foods I've seen in any nutrition app. Absolutely recommend!",
  },
  {
    name: "Deepa Nair",
    role: "Diabetic Wellness Coach, Kochi",
    avatar: "DN",
    color: "#9C27B0",
    rating: 5,
    quote:
      "The diabetes-friendly goal mode is brilliant. It flags high-GI foods and suggests alternatives. My clients with Type 2 diabetes have seen real results.",
  },
  {
    name: "Arjun Patel",
    role: "College Student, Ahmedabad",
    avatar: "AP",
    color: "#4CAF50",
    rating: 5,
    quote:
      "As a vegetarian, most apps are useless. Arog knows every dal, sabzi, and snack I eat. The gamification makes healthy eating actually fun!",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#FFC107]/10 text-[#FFC107] text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4 fill-[#FFC107]" />
            Loved across India
          </div>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Real results from real users
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of Indians building healthier habits with Arog every day.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 relative hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-muted-foreground/15" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{`"${t.quote}"`}</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
