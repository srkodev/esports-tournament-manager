
// Service pour gérer l'authentification

/**
 * Vérifie les identifiants de connexion
 * @param username Nom d'utilisateur
 * @param password Mot de passe
 * @returns Promise<boolean> True si l'authentification est réussie
 */
export const verifyLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Encodage pour Basic Auth (username:password en base64)
    const credentials = btoa(`${username}:${password}`);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/verify.php`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`
      },
    });
    
    if (response.ok) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Erreur de vérification d'authentification:", error);
    return false;
  }
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isAdmin") === "true";
};

/**
 * Déconnecte l'utilisateur
 */
export const logout = (): void => {
  localStorage.removeItem("isAdmin");
};
