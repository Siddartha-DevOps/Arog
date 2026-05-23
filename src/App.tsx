import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Onboarding from "./pages/onboarding/page.tsx";
import Dashboard from "./pages/dashboard/page.tsx";
import Achievements from "./pages/achievements/page.tsx";
import Profile from "./pages/profile/page.tsx";
import AppLayout from "./components/layouts/AppLayout.tsx";
import { useServiceWorker } from "@/hooks/use-service-worker.ts";

function AppRoutes() {
  useServiceWorker();
  return (
    <Routes>
      {/* Public / auth routes — no shared layout */}
      <Route path="/" element={<Index />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* App routes — wrapped in sidebar + bottom nav layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DefaultProviders>
  );
}
