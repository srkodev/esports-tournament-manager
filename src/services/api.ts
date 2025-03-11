
// Ceci est une implémentation simulée des API - à remplacer par des appels réels à votre backend PHP
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
  Vainqueur?: Equipe;
}

export interface Participation {
  ID_participation: number;
  ID_equipe: number;
  ID_tournoi: number;
  Equipe?: Equipe;
  Tournoi?: Tournoi;
}

// Données mock pour simulation
const equipesData: Equipe[] = [
  {
    ID_equipe: 1,
    Nom: "Team Liquid",
    Pays: "Pays-Bas",
    Jeux_principaux: "CS:GO, Dota 2, LoL",
    Date_creation: "2000-01-01",
    Logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Team_liquid_logo.svg",
    Site_web: "https://www.teamliquid.com/"
  },
  {
    ID_equipe: 2,
    Nom: "G2 Esports",
    Pays: "Allemagne",
    Jeux_principaux: "LoL, CS:GO, Valorant",
    Date_creation: "2013-11-24",
    Logo: "https://upload.wikimedia.org/wikipedia/en/1/14/G2_Esports_logo.svg",
    Site_web: "https://g2esports.com/"
  },
  {
    ID_equipe: 3,
    Nom: "Fnatic",
    Pays: "Royaume-Uni",
    Jeux_principaux: "LoL, CS:GO, Dota 2",
    Date_creation: "2004-07-23",
    Logo: "https://upload.wikimedia.org/wikipedia/en/4/43/Fnatic_logo.svg",
    Site_web: "https://fnatic.com/"
  },
  {
    ID_equipe: 4,
    Nom: "T1",
    Pays: "Corée du Sud",
    Jeux_principaux: "LoL, Valorant, Dota 2",
    Date_creation: "2002-12-13",
    Logo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/T1_logo.svg",
    Site_web: "https://t1.gg/"
  },
  {
    ID_equipe: 5,
    Nom: "Cloud9",
    Pays: "États-Unis",
    Jeux_principaux: "LoL, CS:GO, Valorant",
    Date_creation: "2013-01-01",
    Logo: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Cloud9_logo.svg",
    Site_web: "https://cloud9.gg/"
  },
  {
    ID_equipe: 6,
    Nom: "Vitality",
    Pays: "France",
    Jeux_principaux: "CS:GO, LoL, Rocket League",
    Date_creation: "2015-08-11",
    Logo: "https://upload.wikimedia.org/wikipedia/en/f/f8/Team_Vitality_logo.svg",
    Site_web: "https://vitality.gg/"
  }
];

const tournoisData: Tournoi[] = [
  {
    ID_tournoi: 1,
    Nom_tournoi: "The International 2023",
    Date_debut: "2023-10-12",
    Date_fin: "2023-10-29",
    Lieu: "Seattle, USA",
    Image_affiche: "https://images.unsplash.com/photo-1519326338892-1ea8d91e88b9?q=80&w=600&auto=format&fit=crop",
    ID_equipe_vainqueur: 1
  },
  {
    ID_tournoi: 2,
    Nom_tournoi: "ESL One Stockholm 2023",
    Date_debut: "2023-05-20",
    Date_fin: "2023-05-30",
    Lieu: "Stockholm, Suède",
    Image_affiche: "https://images.unsplash.com/photo-1548876052-235674028537?q=80&w=600&auto=format&fit=crop",
    ID_equipe_vainqueur: 3
  },
  {
    ID_tournoi: 3,
    Nom_tournoi: "IEM Katowice 2024",
    Date_debut: "2024-02-03",
    Date_fin: "2024-02-11",
    Lieu: "Katowice, Pologne",
    Image_affiche: "https://images.unsplash.com/photo-1521335629791-ce9d0e738be9?q=80&w=600&auto=format&fit=crop",
    ID_equipe_vainqueur: 2
  },
  {
    ID_tournoi: 4,
    Nom_tournoi: "LoL World Championship 2023",
    Date_debut: "2023-10-02",
    Date_fin: "2023-11-19",
    Lieu: "Corée du Sud",
    Image_affiche: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    ID_equipe_vainqueur: 4
  },
  {
    ID_tournoi: 5,
    Nom_tournoi: "BLAST Premier: Fall Finals 2023",
    Date_debut: "2023-11-22",
    Date_fin: "2023-11-26",
    Lieu: "Copenhague, Danemark",
    Image_affiche: "https://images.unsplash.com/photo-1560253414-f65d1f5a1a37?q=80&w=600&auto=format&fit=crop",
    ID_equipe_vainqueur: 5
  },
  {
    ID_tournoi: 6,
    Nom_tournoi: "Valorant Champions 2023",
    Date_debut: "2023-08-06",
    Date_fin: "2023-08-26",
    Lieu: "Los Angeles, USA",
    Image_affiche: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
    ID_equipe_vainqueur: 6
  },
  {
    ID_tournoi: 7,
    Nom_tournoi: "DreamHack Dallas 2024",
    Date_debut: "2024-05-31",
    Date_fin: "2024-06-02",
    Lieu: "Dallas, USA",
    Image_affiche: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?q=80&w=600&auto=format&fit=crop",
    ID_equipe_vainqueur: null
  },
  {
    ID_tournoi: 8,
    Nom_tournoi: "ESL Pro League Season 17",
    Date_debut: "2023-02-22",
    Date_fin: "2023-03-26",
    Lieu: "Malte",
    Image_affiche: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=600&auto=format&fit=crop",
    ID_equipe_vainqueur: 1
  }
];

const participationsData: Participation[] = [
  { ID_participation: 1, ID_equipe: 1, ID_tournoi: 1 },
  { ID_participation: 2, ID_equipe: 2, ID_tournoi: 1 },
  { ID_participation: 3, ID_equipe: 3, ID_tournoi: 1 },
  { ID_participation: 4, ID_equipe: 1, ID_tournoi: 2 },
  { ID_participation: 5, ID_equipe: 3, ID_tournoi: 2 },
  { ID_participation: 6, ID_equipe: 4, ID_tournoi: 2 },
  { ID_participation: 7, ID_equipe: 2, ID_tournoi: 3 },
  { ID_participation: 8, ID_equipe: 5, ID_tournoi: 3 },
  { ID_participation: 9, ID_equipe: 6, ID_tournoi: 3 },
  { ID_participation: 10, ID_equipe: 4, ID_tournoi: 4 },
  { ID_participation: 11, ID_equipe: 3, ID_tournoi: 4 },
  { ID_participation: 12, ID_equipe: 5, ID_tournoi: 5 },
  { ID_participation: 13, ID_equipe: 1, ID_tournoi: 5 },
  { ID_participation: 14, ID_equipe: 6, ID_tournoi: 6 },
  { ID_participation: 15, ID_equipe: 2, ID_tournoi: 6 },
  { ID_participation: 16, ID_equipe: 1, ID_tournoi: 8 },
  { ID_participation: 17, ID_equipe: 2, ID_tournoi: 8 },
  { ID_participation: 18, ID_equipe: 3, ID_tournoi: 8 }
];

// Simulation du délai API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Equipes
export const getEquipes = async (): Promise<Equipe[]> => {
  await delay(800);
  return [...equipesData];
};

export const getEquipe = async (id: number): Promise<Equipe | undefined> => {
  await delay(500);
  return equipesData.find(e => e.ID_equipe === id);
};

export const createEquipe = async (equipe: Omit<Equipe, "ID_equipe">): Promise<Equipe> => {
  await delay(1000);
  const newEquipe = {
    ...equipe,
    ID_equipe: Math.max(...equipesData.map(e => e.ID_equipe)) + 1
  };
  equipesData.push(newEquipe);
  toast({
    title: "Équipe créée",
    description: `L'équipe ${newEquipe.Nom} a été créée avec succès.`
  });
  return newEquipe;
};

export const updateEquipe = async (id: number, equipe: Partial<Equipe>): Promise<Equipe | undefined> => {
  await delay(1000);
  const index = equipesData.findIndex(e => e.ID_equipe === id);
  if (index !== -1) {
    equipesData[index] = { ...equipesData[index], ...equipe };
    toast({
      title: "Équipe mise à jour",
      description: `L'équipe ${equipesData[index].Nom} a été mise à jour.`
    });
    return equipesData[index];
  }
  return undefined;
};

export const deleteEquipe = async (id: number): Promise<boolean> => {
  await delay(1000);
  const index = equipesData.findIndex(e => e.ID_equipe === id);
  if (index !== -1) {
    const nom = equipesData[index].Nom;
    equipesData.splice(index, 1);
    toast({
      title: "Équipe supprimée",
      description: `L'équipe ${nom} a été supprimée.`
    });
    return true;
  }
  return false;
};

// API Tournois
export const getTournois = async (): Promise<Tournoi[]> => {
  await delay(800);
  return [...tournoisData];
};

export const getTournoiWithVainqueur = async (id: number): Promise<Tournoi | undefined> => {
  await delay(500);
  const tournoi = tournoisData.find(t => t.ID_tournoi === id);
  if (tournoi && tournoi.ID_equipe_vainqueur) {
    const vainqueur = equipesData.find(e => e.ID_equipe === tournoi.ID_equipe_vainqueur);
    if (vainqueur) {
      return { ...tournoi, Vainqueur: vainqueur };
    }
  }
  return tournoi;
};

export const createTournoi = async (tournoi: Omit<Tournoi, "ID_tournoi">): Promise<Tournoi> => {
  await delay(1000);
  const newTournoi = {
    ...tournoi,
    ID_tournoi: Math.max(...tournoisData.map(t => t.ID_tournoi)) + 1
  };
  tournoisData.push(newTournoi);
  toast({
    title: "Tournoi créé",
    description: `Le tournoi ${newTournoi.Nom_tournoi} a été créé avec succès.`
  });
  return newTournoi;
};

export const updateTournoi = async (id: number, tournoi: Partial<Tournoi>): Promise<Tournoi | undefined> => {
  await delay(1000);
  const index = tournoisData.findIndex(t => t.ID_tournoi === id);
  if (index !== -1) {
    tournoisData[index] = { ...tournoisData[index], ...tournoi };
    toast({
      title: "Tournoi mis à jour",
      description: `Le tournoi ${tournoisData[index].Nom_tournoi} a été mis à jour.`
    });
    return tournoisData[index];
  }
  return undefined;
};

export const deleteTournoi = async (id: number): Promise<boolean> => {
  await delay(1000);
  const index = tournoisData.findIndex(t => t.ID_tournoi === id);
  if (index !== -1) {
    const nom = tournoisData[index].Nom_tournoi;
    tournoisData.splice(index, 1);
    toast({
      title: "Tournoi supprimé",
      description: `Le tournoi ${nom} a été supprimé.`
    });
    return true;
  }
  return false;
};

// API Participations
export const getParticipations = async (tournoi_id?: number): Promise<Participation[]> => {
  await delay(800);
  let result = [...participationsData];
  
  if (tournoi_id) {
    result = result.filter(p => p.ID_tournoi === tournoi_id);
  }
  
  return result.map(participation => {
    const equipe = equipesData.find(e => e.ID_equipe === participation.ID_equipe);
    const tournoi = tournoisData.find(t => t.ID_tournoi === participation.ID_tournoi);
    
    return {
      ...participation,
      Equipe: equipe,
      Tournoi: tournoi
    };
  });
};

export const addParticipation = async (equipe_id: number, tournoi_id: number): Promise<Participation | undefined> => {
  await delay(1000);
  
  // Vérifier si la participation existe déjà
  const existingParticipation = participationsData.find(
    p => p.ID_equipe === equipe_id && p.ID_tournoi === tournoi_id
  );
  
  if (existingParticipation) {
    toast({
      title: "Erreur",
      description: "Cette équipe participe déjà à ce tournoi.",
      variant: "destructive"
    });
    return undefined;
  }
  
  const equipe = equipesData.find(e => e.ID_equipe === equipe_id);
  const tournoi = tournoisData.find(t => t.ID_tournoi === tournoi_id);
  
  if (!equipe || !tournoi) {
    toast({
      title: "Erreur",
      description: "Équipe ou tournoi introuvable.",
      variant: "destructive"
    });
    return undefined;
  }
  
  const newParticipation = {
    ID_participation: Math.max(...participationsData.map(p => p.ID_participation)) + 1,
    ID_equipe: equipe_id,
    ID_tournoi: tournoi_id,
    Equipe: equipe,
    Tournoi: tournoi
  };
  
  participationsData.push({
    ID_participation: newParticipation.ID_participation,
    ID_equipe: equipe_id,
    ID_tournoi: tournoi_id
  });
  
  toast({
    title: "Participation ajoutée",
    description: `${equipe.Nom} a été ajouté au tournoi ${tournoi.Nom_tournoi}.`
  });
  
  return newParticipation;
};

export const removeParticipation = async (id: number): Promise<boolean> => {
  await delay(1000);
  const index = participationsData.findIndex(p => p.ID_participation === id);
  
  if (index !== -1) {
    const equipe = equipesData.find(e => e.ID_equipe === participationsData[index].ID_equipe);
    const tournoi = tournoisData.find(t => t.ID_tournoi === participationsData[index].ID_tournoi);
    
    participationsData.splice(index, 1);
    
    if (equipe && tournoi) {
      toast({
        title: "Participation supprimée",
        description: `${equipe.Nom} a été retiré du tournoi ${tournoi.Nom_tournoi}.`
      });
    } else {
      toast({
        title: "Participation supprimée",
        description: "La participation a été supprimée."
      });
    }
    
    return true;
  }
  
  return false;
};

// Fonctions de recherche
export const searchEquipes = async (query: string): Promise<Equipe[]> => {
  await delay(500);
  const lowerQuery = query.toLowerCase();
  return equipesData.filter(
    equipe => 
      equipe.Nom.toLowerCase().includes(lowerQuery) || 
      equipe.Pays.toLowerCase().includes(lowerQuery) ||
      equipe.Jeux_principaux.toLowerCase().includes(lowerQuery)
  );
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
  await delay(500);
  
  const lowerQuery = query.toLowerCase();
  
  return tournoisData.filter(tournoi => {
    // Filtrage par texte
    const matchesQuery = 
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
};
