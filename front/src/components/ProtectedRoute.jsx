import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas connecté, redirigez vers la page de connexion
    return <Navigate to="/login" />;
  }
  // Si tout est bon, affichez le composant enfant
  return children;
};

export default ProtectedRoute;
