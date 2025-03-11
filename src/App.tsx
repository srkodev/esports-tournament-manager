
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EquipesPage from "./pages/EquipesPage";
import RecherchePage from "./pages/RecherchePage";
import AdminPage from "./pages/AdminPage";
import TournoisPage from "./pages/TournoisPage";
import TournoiDetailPage from "./pages/TournoiDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/equipes" element={<EquipesPage />} />
          <Route path="/tournois" element={<TournoisPage />} />
          <Route path="/tournois/:id" element={<TournoiDetailPage />} />
          <Route path="/recherche" element={<RecherchePage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
