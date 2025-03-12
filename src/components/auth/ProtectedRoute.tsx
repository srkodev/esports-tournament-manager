
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      console.warn("Tentative d'accès à une route protégée sans authentification:", location.pathname);
    }
  }, [location.pathname]);

  if (!isAuthenticated()) {
    // Rediriger vers la page de login si non authentifié
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
