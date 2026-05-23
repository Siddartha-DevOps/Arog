import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Leaf, Smartphone } from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Authenticated, Unauthenticated } from "convex/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] p-10 sm:p-14 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF9800]/20 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4 text-balance">
              Start your health journey today
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Free forever. No credit card required. Install on iOS or Android instantly.
              Track your first meal in under 30 seconds.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Unauthenticated>
                <SignInButton />
              </Unauthenticated>
              <Authenticated>
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-[#4CAF50] hover:bg-white/90 font-semibold shadow-lg cursor-pointer"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Authenticated>
              <div className="flex items-center gap-2 bg-white/10 text-white text-sm px-5 py-2.5 rounded-lg">
                <Smartphone className="w-4 h-4" />
                Installable on iOS & Android
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
              <span>✓ Free to use</span>
              <span>✓ No credit card</span>
              <span>✓ 50K+ Indian dishes</span>
              <span>✓ Privacy first</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
