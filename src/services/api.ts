
import { toast } from "@/hooks/use-toast";

// Types pour notre application
export interface Equipe {
  ID_equipe: number;
  Nom: string;
  Pays: string;
  Jeux_principaux: string;
  Date_creation: string;
  Logo: string;
  Site_web: string;
}

export interface Tournoi {
  ID_tournoi: number;
  Nom_tournoi: string;
  Date_debut: string;
  Date_fin: string;
  Lieu: string;
  Image_affiche: string;
  ID_equipe_vainqueur: number | null;
  Nom_vainqueur?: string;
  Vainqueur?: Equipe;
}

export interface Participation {
  ID_participation: number;
  ID_equipe: number;
  ID_tournoi: number;
  Nom_equipe?: string;
  Nom_tournoi?: string;
  Equipe?: Equipe;
  Tournoi?: Tournoi;
}

// URL de base de l'API
const API_BASE_URL = "/api";

// Gestion des erreurs
const handleApiError = (error: any, message: string) => {
  console.error(`Erreur API: ${message}`, error);
  toast({
    title: "Erreur",
    description: message,
    variant: "destructive"
  });
  throw error;
};

// API Equipes
export const getEquipes = async (): Promise<Equipe[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipes/read.php`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, "Impossible de récupérer les équipes");
  }
};

export const getEquipe = async (id: number): Promise<Equipe | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipes/read_one.php?id=${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, "Impossible de récupérer les détails de l'équipe");
  }
};

export const createEquipe = async (equipe: Omit<Equipe, "ID_equipe">): Promise<Equipe> => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipes/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equipe)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    toast({
      title: "Équipe créée",
      description: `L'équipe ${equipe.Nom} a été créée avec succès.`
    });
    
    // Comme l'API ne retourne pas l'équipe créée, nous refetchons les équipes
    const equipes = await getEquipes();
    return equipes.find(e => e.Nom === equipe.Nom) as Equipe;
  } catch (error) {
    return handleApiError(error, "Impossible de créer l'équipe");
  }
};

export const updateEquipe = async (id: number, equipe: Partial<Equipe>): Promise<Equipe | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipes/update.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...equipe, ID_equipe: id })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    toast({
      title: "Équipe mise à jour",
      description: `L'équipe a été mise à jour avec succès.`
    });
    
    // Comme l'API ne retourne pas l'équipe mise à jour, nous la récupérons
    return await getEquipe(id);
  } catch (error) {
    return handleApiError(error, "Impossible de mettre à jour l'équipe");
  }
};

export const deleteEquipe = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipes/delete.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID_equipe: id })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    toast({
      title: "Équipe supprimée",
      description: "L'équipe a été supprimée avec succès."
    });
    
    return true;
  } catch (error) {
    handleApiError(error, "Impossible de supprimer l'équipe");
    return false;
  }
};

// API Tournois
export const getTournois = async (): Promise<Tournoi[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournois/read.php`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, "Impossible de récupérer les tournois");
  }
};

export const getTournoiWithVainqueur = async (id: number): Promise<Tournoi | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournois/read_one.php?id=${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    const tournoi = await response.json();
    
    if (tournoi.ID_equipe_vainqueur) {
      const vainqueur = await getEquipe(tournoi.ID_equipe_vainqueur);
      if (vainqueur) {
        return { ...tournoi, Vainqueur: vainqueur };
      }
    }
    
    return tournoi;
  } catch (error) {
    return handleApiError(error, "Impossible de récupérer les détails du tournoi");
  }
};

export const createTournoi = async (tournoi: Omit<Tournoi, "ID_tournoi">): Promise<Tournoi> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournois/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tournoi)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    toast({
      title: "Tournoi créé",
      description: `Le tournoi ${tournoi.Nom_tournoi} a été créé avec succès.`
    });
    
    // Comme l'API ne retourne pas le tournoi créé, nous refetchons les tournois
    const tournois = await getTournois();
    return tournois.find(t => t.Nom_tournoi === tournoi.Nom_tournoi) as Tournoi;
  } catch (error) {
    return handleApiError(error, "Impossible de créer le tournoi");
  }
};

export const updateTournoi = async (id: number, tournoi: Partial<Tournoi>): Promise<Tournoi | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournois/update.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...tournoi, ID_tournoi: id })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    toast({
      title: "Tournoi mis à jour",
      description: `Le tournoi a été mis à jour avec succès.`
    });
    
    // Comme l'API ne retourne pas le tournoi mis à jour, nous le récupérons
    return await getTournoiWithVainqueur(id);
  } catch (error) {
    return handleApiError(error, "Impossible de mettre à jour le tournoi");
  }
};

export const deleteTournoi = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournois/delete.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID_tournoi: id })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    toast({
      title: "Tournoi supprimé",
      description: "Le tournoi a été supprimé avec succès."
    });
    
    return true;
  } catch (error) {
    handleApiError(error, "Impossible de supprimer le tournoi");
    return false;
  }
};

// API Participations
export const getParticipations = async (tournoi_id?: number): Promise<Participation[]> => {
  try {
    let url = `${API_BASE_URL}/participations/read.php`;
    if (tournoi_id) {
      url = `${API_BASE_URL}/participations/read_by_tournoi.php?tournoi_id=${tournoi_id}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    const participations = await response.json();
    
    // Enrichir les données avec les détails des équipes et tournois
    const result = [];
    for (const participation of participations) {
      let enrichedParticipation = { ...participation };
      
      if (!participation.Equipe && participation.ID_equipe) {
        try {
          const equipe = await getEquipe(participation.ID_equipe);
          if (equipe) {
            enrichedParticipation.Equipe = equipe;
          }
        } catch (e) {
          console.warn("Impossible de récupérer l'équipe pour la participation", e);
        }
      }
      
      if (!participation.Tournoi && participation.ID_tournoi) {
        try {
          const tournoi = await getTournoiWithVainqueur(participation.ID_tournoi);
          if (tournoi) {
            enrichedParticipation.Tournoi = tournoi;
          }
        } catch (e) {
          console.warn("Impossible de récupérer le tournoi pour la participation", e);
        }
      }
      
      result.push(enrichedParticipation);
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, "Impossible de récupérer les participations");
  }
};

export const addParticipation = async (equipe_id: number, tournoi_id: number): Promise<Participation | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/participations/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ID_equipe: equipe_id, 
        ID_tournoi: tournoi_id 
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    toast({
      title: "Participation ajoutée",
      description: "La participation a été ajoutée avec succès."
    });
    
    // Récupérer les détails pour retourner un objet complet
    const equipe = await getEquipe(equipe_id);
    const tournoi = await getTournoiWithVainqueur(tournoi_id);
    
    // Comme l'API ne retourne pas l'ID, on récupère toutes les participations
    const participations = await getParticipations();
    const newParticipation = participations.find(
      p => p.ID_equipe === equipe_id && p.ID_tournoi === tournoi_id
    );
    
    if (newParticipation) {
      return {
        ...newParticipation,
        Equipe: equipe,
        Tournoi: tournoi
      };
    }
    
    return undefined;
  } catch (error) {
    return handleApiError(error, "Impossible d'ajouter la participation");
  }
};

export const removeParticipation = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/participations/delete.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID_participation: id })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    toast({
      title: "Participation supprimée",
      description: "La participation a été supprimée avec succès."
    });
    
    return true;
  } catch (error) {
    handleApiError(error, "Impossible de supprimer la participation");
    return false;
  }
};

// Fonctions de recherche
export const searchEquipes = async (query: string): Promise<Equipe[]> => {
  // Pour la recherche, nous utilisons le filtrage côté client
  // Dans une implémentation réelle, cette fonction devrait appeler une API de recherche
  try {
    const equipes = await getEquipes();
    if (!query.trim()) return equipes;
    
    const lowerQuery = query.toLowerCase();
    return equipes.filter(
      equipe => 
        equipe.Nom.toLowerCase().includes(lowerQuery) || 
        equipe.Pays.toLowerCase().includes(lowerQuery) ||
        equipe.Jeux_principaux.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    return handleApiError(error, "Erreur lors de la recherche d'équipes");
  }
};

export const searchTournois = async (
  query: string, 
  filters?: { 
    dateDebut?: string; 
    dateFin?: string;
    lieu?: string;
    vainqueur?: number;
  }
): Promise<Tournoi[]> => {
  // Pour la recherche, nous utilisons le filtrage côté client
  // Dans une implémentation réelle, cette fonction devrait appeler une API de recherche
  try {
    const tournois = await getTournois();
    if (!query.trim() && !filters) return tournois;
    
    const lowerQuery = query.toLowerCase();
    
    return tournois.filter(tournoi => {
      // Filtrage par texte
      const matchesQuery = !query.trim() || 
        tournoi.Nom_tournoi.toLowerCase().includes(lowerQuery) || 
        tournoi.Lieu.toLowerCase().includes(lowerQuery);
      
      if (!matchesQuery) return false;
      
      // Filtrage par date de début
      if (filters?.dateDebut && new Date(tournoi.Date_debut) < new Date(filters.dateDebut)) {
        return false;
      }
      
      // Filtrage par date de fin
      if (filters?.dateFin && new Date(tournoi.Date_fin) > new Date(filters.dateFin)) {
        return false;
      }
      
      // Filtrage par lieu
      if (filters?.lieu && !tournoi.Lieu.toLowerCase().includes(filters.lieu.toLowerCase())) {
        return false;
      }
      
      // Filtrage par vainqueur
      if (filters?.vainqueur && tournoi.ID_equipe_vainqueur !== filters.vainqueur) {
        return false;
      }
      
      return true;
    });
  } catch (error) {
    return handleApiError(error, "Erreur lors de la recherche de tournois");
  }
};
