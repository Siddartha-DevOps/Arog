import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated } from "convex/react";
import Navbar from "./landing/_components/Navbar.tsx";
import Hero from "./landing/_components/Hero.tsx";
import Features from "./landing/_components/Feature.tsx";
import HowItWorks from "./landing/_components/HowItWorks.tsx";
import NutritionShowcase from "./landing/_components/NutritionShowcase.tsx";
import DietPreference from "./landing/_components/DietPreference.tsx";
import Testimonials from "./landing/_components/Testimonials.tsx";
import CTA from "./landing/_components/CTA.tsx";
import Footer from "./landing/_components/Footer.tsx";

function AuthRedirect() {
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser, {});

  useEffect(() => {
    if (user === undefined) return; // loading
    if (user && !user.onboardingCompleted) {
      navigate("/onboarding", { replace: true });
    } else if (user && user.onboardingCompleted) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return null;
}

export default function Index() {
  return (
    <div className="min-h-screen">
      <Authenticated>
        <AuthRedirect />
      </Authenticated>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <NutritionShowcase />
      <DietPreference />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
