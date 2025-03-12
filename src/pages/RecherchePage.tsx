
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import EquipeCard from "@/components/equipes/EquipeCard";
import TournoiCard from "@/components/tournois/TournoiCard";
import { getEquipes, getTournois, Equipe, Tournoi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const RecherchePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("equipes");

  // Récupération des données
  const { data: equipes, isLoading: isLoadingEquipes } = useQuery({
    queryKey: ["equipes"],
    queryFn: getEquipes,
  });

  const { data: tournois, isLoading: isLoadingTournois } = useQuery({
    queryKey: ["tournois"],
    queryFn: getTournois,
  });

  // Filtrage des résultats basé sur la recherche
  const filteredEquipes = equipes?.filter(equipe => 
    equipe.Nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipe.Pays.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipe.Jeux_principaux.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTournois = tournois?.filter(tournoi => 
    tournoi.Nom_tournoi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournoi.Lieu.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold highlight-text">Recherche</h1>
            <p className="text-muted-foreground mt-2">
              Recherchez parmi les équipes et les tournois
            </p>
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

          <Tabs 
            defaultValue="equipes" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="equipes">Équipes</TabsTrigger>
              <TabsTrigger value="tournois">Tournois</TabsTrigger>
            </TabsList>
            <TabsContent value="equipes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredEquipes?.map((equipe: Equipe) => (
                  <EquipeCard key={equipe.ID_equipe} equipe={equipe} />
                ))}
                {filteredEquipes?.length === 0 && (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">Aucune équipe trouvée pour cette recherche</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tournois">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredTournois?.map((tournoi: Tournoi) => (
                  <TournoiCard key={tournoi.ID_tournoi} tournoi={tournoi} />
                ))}
                {filteredTournois?.length === 0 && (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">Aucun tournoi trouvé pour cette recherche</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default RecherchePage;
