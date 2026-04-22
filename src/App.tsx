import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAdmin } from "@/components/RequireAdmin";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Login from "./pages/Login.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminSteps from "./pages/admin/AdminSteps.tsx";
import AdminFaqs from "./pages/admin/AdminFaqs.tsx";
import AdminData from "./pages/admin/AdminData.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminSubmissions from "./pages/admin/AdminSubmissions.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-login" element={<Auth />} />
            <Route path="/admin" element={<RequireAdmin><AdminOverview /></RequireAdmin>} />
            <Route path="/admin/steps" element={<RequireAdmin><AdminSteps /></RequireAdmin>} />
            <Route path="/admin/faqs" element={<RequireAdmin><AdminFaqs /></RequireAdmin>} />
            <Route path="/admin/data" element={<RequireAdmin><AdminData /></RequireAdmin>} />
            <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
            <Route path="/admin/submissions" element={<RequireAdmin><AdminSubmissions /></RequireAdmin>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
