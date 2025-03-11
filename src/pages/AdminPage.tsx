
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Trophy, Link as LinkIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getEquipes, getTournois, getParticipations, Equipe, Tournoi, Participation } from "@/services/api";
import EquipeForm from "@/components/admin/EquipeForm";
import TournoiForm from "@/components/admin/TournoiForm";
import ParticipationForm from "@/components/admin/ParticipationForm";

const AdminPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEquipeForm, setShowEquipeForm] = useState(false);
  const [showTournoiForm, setShowTournoiForm] = useState(false);
  const [showParticipationForm, setShowParticipationForm] = useState(false);

  // Récupération des données
  const { data: equipes, isLoading: isLoadingEquipes } = useQuery({
    queryKey: ["equipes"],
    queryFn: getEquipes,
  });

  const { data: tournois, isLoading: isLoadingTournois } = useQuery({
    queryKey: ["tournois"],
    queryFn: getTournois,
  });

  const { data: participations, isLoading: isLoadingParticipations } = useQuery({
    queryKey: ["participations"],
    queryFn: () => getParticipations(),
  });

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
                  <Button onClick={() => setShowEquipeForm(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une équipe
                  </Button>
                </CardHeader>
                <CardContent>
                  {showEquipeForm && (
                    <>
                      <EquipeForm onCancel={() => setShowEquipeForm(false)} />
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
                        {filteredEquipes?.map((equipe: Equipe) => (
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
                                <Button variant="outline" size="sm">Modifier</Button>
                                <Button variant="outline" size="sm" className="text-destructive">Supprimer</Button>
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
                  <Button onClick={() => setShowTournoiForm(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un tournoi
                  </Button>
                </CardHeader>
                <CardContent>
                  {showTournoiForm && (
                    <>
                      <TournoiForm onCancel={() => setShowTournoiForm(false)} />
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
                        {filteredTournois?.map((tournoi: Tournoi) => (
                          <tr key={tournoi.ID_tournoi} className="border-b">
                            <td className="py-3 px-4 font-medium">{tournoi.Nom_tournoi}</td>
                            <td className="py-3 px-4">{tournoi.Lieu}</td>
                            <td className="py-3 px-4">{new Date(tournoi.Date_debut).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{new Date(tournoi.Date_fin).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">Modifier</Button>
                                <Button variant="outline" size="sm" className="text-destructive">Supprimer</Button>
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
                      <ParticipationForm onCancel={() => setShowParticipationForm(false)} />
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
                        {participations?.map((participation: Participation) => (
                          <tr key={participation.ID_participation} className="border-b">
                            <td className="py-3 px-4 font-medium">
                              {participation.Equipe?.Nom || `Équipe #${participation.ID_equipe}`}
                            </td>
                            <td className="py-3 px-4">
                              {participation.Tournoi?.Nom_tournoi || `Tournoi #${participation.ID_tournoi}`}
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="outline" size="sm" className="text-destructive">
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
    </MainLayout>
  );
};

export default AdminPage;
