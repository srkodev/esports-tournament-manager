
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { 
  getEquipes, 
  getTournois, 
  getParticipations, 
  Equipe, 
  Tournoi, 
  Participation,
  deleteEquipe,
  deleteTournoi,
  removeParticipation
} from "@/services/api";
import { toast } from "@/hooks/use-toast";
import EquipeForm from "@/components/admin/EquipeForm";
import TournoiForm from "@/components/admin/TournoiForm";
import ParticipationForm from "@/components/admin/ParticipationForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEquipeForm, setShowEquipeForm] = useState(false);
  const [showTournoiForm, setShowTournoiForm] = useState(false);
  const [showParticipationForm, setShowParticipationForm] = useState(false);
  
  // States for editing
  const [equipeToEdit, setEquipeToEdit] = useState<Equipe | undefined>(undefined);
  const [tournoiToEdit, setTournoiToEdit] = useState<Tournoi | undefined>(undefined);
  
  // States for deletion confirmations
  const [deleteEquipeId, setDeleteEquipeId] = useState<number | null>(null);
  const [deleteTournoiId, setDeleteTournoiId] = useState<number | null>(null);
  const [deleteParticipationId, setDeleteParticipationId] = useState<number | null>(null);

  // Récupération des données
  const { data: equipes, isLoading: isLoadingEquipes, refetch: refetchEquipes } = useQuery({
    queryKey: ["equipes"],
    queryFn: getEquipes,
  });

  const { data: tournois, isLoading: isLoadingTournois, refetch: refetchTournois } = useQuery({
    queryKey: ["tournois"],
    queryFn: getTournois,
  });

  const { data: participations, isLoading: isLoadingParticipations, refetch: refetchParticipations } = useQuery({
    queryKey: ["participations"],
    queryFn: () => getParticipations(),
  });

  // Fonctions de succès pour rafraîchir les données
  const onEquipeSuccess = () => {
    setShowEquipeForm(false);
    setEquipeToEdit(undefined);
    refetchEquipes();
  };

  const onTournoiSuccess = () => {
    setShowTournoiForm(false);
    setTournoiToEdit(undefined);
    refetchTournois();
  };

  const onParticipationSuccess = () => {
    setShowParticipationForm(false);
    refetchParticipations();
  };
  
  // Fonctions d'édition
  const handleEditEquipe = (equipe: Equipe) => {
    setEquipeToEdit(equipe);
    setShowEquipeForm(true);
  };
  
  const handleEditTournoi = (tournoi: Tournoi) => {
    setTournoiToEdit(tournoi);
    setShowTournoiForm(true);
  };
  
  // Fonctions de suppression
  const handleDeleteEquipe = async (id: number) => {
    try {
      await deleteEquipe(id);
      refetchEquipes();
      refetchParticipations(); // Refresh participations as they depend on equipes
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipe :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'équipe.",
        variant: "destructive"
      });
    } finally {
      setDeleteEquipeId(null);
    }
  };
  
  const handleDeleteTournoi = async (id: number) => {
    try {
      await deleteTournoi(id);
      refetchTournois();
      refetchParticipations(); // Refresh participations as they depend on tournois
    } catch (error) {
      console.error("Erreur lors de la suppression du tournoi :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du tournoi.",
        variant: "destructive"
      });
    } finally {
      setDeleteTournoiId(null);
    }
  };
  
  const handleDeleteParticipation = async (id: number) => {
    try {
      await removeParticipation(id);
      refetchParticipations();
    } catch (error) {
      console.error("Erreur lors de la suppression de la participation :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la participation.",
        variant: "destructive"
      });
    } finally {
      setDeleteParticipationId(null);
    }
  };

  // Filtrage des résultats basé sur la recherche
  const filteredEquipes = equipes?.filter(equipe => 
    equipe.Nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTournois = tournois?.filter(tournoi => 
    tournoi.Nom_tournoi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold highlight-text">Administration</h1>
              <p className="text-muted-foreground mt-2">
                Gérez les équipes, les tournois et les participations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="equipes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="equipes">Équipes</TabsTrigger>
              <TabsTrigger value="tournois">Tournois</TabsTrigger>
              <TabsTrigger value="participations">Participations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="equipes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des équipes</CardTitle>
                    <CardDescription>
                      Ajoutez, modifiez ou supprimez des équipes
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEquipeToEdit(undefined);
                    setShowEquipeForm(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une équipe
                  </Button>
                </CardHeader>
                <CardContent>
                  {showEquipeForm && (
                    <>
                      <EquipeForm 
                        onSuccess={onEquipeSuccess} 
                        onCancel={() => {
                          setShowEquipeForm(false);
                          setEquipeToEdit(undefined);
                        }} 
                        equipeToEdit={equipeToEdit}
                      />
                      <Separator className="my-6" />
                    </>
                  )}
                  
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Logo</th>
                          <th className="py-3 px-4 text-left font-medium">Nom</th>
                          <th className="py-3 px-4 text-left font-medium">Pays</th>
                          <th className="py-3 px-4 text-left font-medium">Jeux</th>
                          <th className="py-3 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEquipes?.map((equipe) => (
                          <tr key={equipe.ID_equipe} className="border-b">
                            <td className="py-3 px-4">
                              <div className="h-10 w-10 overflow-hidden rounded-full">
                                <img 
                                  src={equipe.Logo} 
                                  alt={equipe.Nom}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/200x200/4b5563/e2e8f0?text=Logo";
                                  }}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">{equipe.Nom}</td>
                            <td className="py-3 px-4">{equipe.Pays}</td>
                            <td className="py-3 px-4">{equipe.Jeux_principaux}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditEquipe(equipe)}
                                >
                                  Modifier
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive"
                                  onClick={() => setDeleteEquipeId(equipe.ID_equipe)}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tournois">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des tournois</CardTitle>
                    <CardDescription>
                      Ajoutez, modifiez ou supprimez des tournois
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setTournoiToEdit(undefined);
                    setShowTournoiForm(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un tournoi
                  </Button>
                </CardHeader>
                <CardContent>
                  {showTournoiForm && (
                    <>
                      <TournoiForm 
                        onSuccess={onTournoiSuccess} 
                        onCancel={() => {
                          setShowTournoiForm(false);
                          setTournoiToEdit(undefined);
                        }}
                        equipes={equipes || []}
                        tournoiToEdit={tournoiToEdit}
                      />
                      <Separator className="my-6" />
                    </>
                  )}
                  
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Nom</th>
                          <th className="py-3 px-4 text-left font-medium">Lieu</th>
                          <th className="py-3 px-4 text-left font-medium">Date début</th>
                          <th className="py-3 px-4 text-left font-medium">Date fin</th>
                          <th className="py-3 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTournois?.map((tournoi) => (
                          <tr key={tournoi.ID_tournoi} className="border-b">
                            <td className="py-3 px-4 font-medium">{tournoi.Nom_tournoi}</td>
                            <td className="py-3 px-4">{tournoi.Lieu}</td>
                            <td className="py-3 px-4">{new Date(tournoi.Date_debut).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{new Date(tournoi.Date_fin).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditTournoi(tournoi)}
                                >
                                  Modifier
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive"
                                  onClick={() => setDeleteTournoiId(tournoi.ID_tournoi)}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="participations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des participations</CardTitle>
                    <CardDescription>
                      Associez des équipes à des tournois
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowParticipationForm(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une participation
                  </Button>
                </CardHeader>
                <CardContent>
                  {showParticipationForm && (
                    <>
                      <ParticipationForm 
                        onSuccess={onParticipationSuccess}
                        onCancel={() => setShowParticipationForm(false)}
                      />
                      <Separator className="my-6" />
                    </>
                  )}
                  
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Équipe</th>
                          <th className="py-3 px-4 text-left font-medium">Tournoi</th>
                          <th className="py-3 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participations?.map((participation) => (
                          <tr key={participation.ID_participation} className="border-b">
                            <td className="py-3 px-4 font-medium">
                              {participation.Equipe?.Nom || `Équipe #${participation.ID_equipe}`}
                            </td>
                            <td className="py-3 px-4">
                              {participation.Tournoi?.Nom_tournoi || `Tournoi #${participation.ID_tournoi}`}
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive"
                                onClick={() => setDeleteParticipationId(participation.ID_participation)}
                              >
                                Supprimer
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Dialogues de confirmation de suppression */}
      <AlertDialog open={deleteEquipeId !== null} onOpenChange={(open) => !open && setDeleteEquipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va définitivement supprimer cette équipe ainsi que toutes ses participations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteEquipeId && handleDeleteEquipe(deleteEquipeId)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={deleteTournoiId !== null} onOpenChange={(open) => !open && setDeleteTournoiId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va définitivement supprimer ce tournoi ainsi que toutes ses participations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTournoiId && handleDeleteTournoi(deleteTournoiId)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={deleteParticipationId !== null} onOpenChange={(open) => !open && setDeleteParticipationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va supprimer l'association entre cette équipe et ce tournoi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteParticipationId && handleDeleteParticipation(deleteParticipationId)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AdminPage;
