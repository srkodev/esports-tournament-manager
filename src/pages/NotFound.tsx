import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-600 px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-9xl font-extrabold text-white mb-4 animate-pulse">404</h1>
        <p className="text-2xl md:text-3xl font-semibold text-gray-200 mb-6">
          Oups ! La page que vous recherchez n'existe pas.
        </p>
        <p className="text-lg text-gray-300 mb-8">
          Il semble que vous ayez pris un mauvais chemin. Retournez à l'accueil pour retrouver votre route.
        </p>
        <Link 
          to="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
