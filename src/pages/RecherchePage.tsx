
import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import EquipeCard from "@/components/equipes/EquipeCard";
import TournoiCard from "@/components/tournois/TournoiCard";
import { getEquipes, getTournois, Equipe, Tournoi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const RecherchePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("equipes");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJeux, setSelectedJeux] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  // Récupération des données
  const { data: equipes, isLoading: isLoadingEquipes } = useQuery({
    queryKey: ["equipes"],
    queryFn: getEquipes,
  });

  const { data: tournois, isLoading: isLoadingTournois } = useQuery({
    queryKey: ["tournois"],
    queryFn: getTournois,
  });

  // Liste des jeux uniques pour les filtres
  const [jeuxUniques, setJeuxUniques] = useState<string[]>([]);
  // Liste des années uniques pour les filtres
  const [yearsUniques, setYearsUniques] = useState<string[]>([]);

  useEffect(() => {
    if (equipes) {
      // Extraction des jeux uniques à partir des équipes
      const jeux = new Set<string>();
      equipes.forEach(equipe => {
        const jeuxArray = equipe.Jeux_principaux.split(',').map(jeu => jeu.trim());
        jeuxArray.forEach(jeu => jeux.add(jeu));
      });
      setJeuxUniques(Array.from(jeux));
    }

    if (tournois) {
      // Extraction des années uniques à partir des tournois
      const years = new Set<string>();
      tournois.forEach(tournoi => {
        const year = new Date(tournoi.Date_debut).getFullYear().toString();
        years.add(year);
      });
      setYearsUniques(Array.from(years).sort());
    }
  }, [equipes, tournois]);

  // Gestion des filtres
  const toggleJeuFilter = (jeu: string) => {
    setSelectedJeux(prev => 
      prev.includes(jeu) 
        ? prev.filter(item => item !== jeu) 
        : [...prev, jeu]
    );
  };

  const toggleYearFilter = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(item => item !== year) 
        : [...prev, year]
    );
  };

  // Filtrage des résultats basé sur la recherche et les filtres
  const filteredEquipes = equipes?.filter(equipe => {
    // Filtrage par texte de recherche
    const matchesSearch = 
      equipe.Nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipe.Pays.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipe.Jeux_principaux.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrage par jeux
    const matchesJeux = selectedJeux.length === 0 || 
      selectedJeux.some(jeu => equipe.Jeux_principaux.toLowerCase().includes(jeu.toLowerCase()));
    
    return matchesSearch && matchesJeux;
  });

  const filteredTournois = tournois?.filter(tournoi => {
    // Filtrage par texte de recherche
    const matchesSearch = 
      tournoi.Nom_tournoi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournoi.Lieu.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrage par année
    const tournoisYear = new Date(tournoi.Date_debut).getFullYear().toString();
    const matchesYear = selectedYears.length === 0 || selectedYears.includes(tournoisYear);
    
    return matchesSearch && matchesYear;
  });

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
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>

          {showFilters && (
            <Card className="bg-muted/40">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Filtrer par jeu</p>
                    <div className="flex flex-wrap gap-2">
                      {jeuxUniques.map(jeu => (
                        <Badge 
                          key={jeu} 
                          variant={selectedJeux.includes(jeu) ? "default" : "outline"} 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => toggleJeuFilter(jeu)}
                        >
                          {jeu}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Filtrer par année</p>
                    <div className="flex flex-wrap gap-2">
                      {yearsUniques.map(year => (
                        <Badge 
                          key={year} 
                          variant={selectedYears.includes(year) ? "default" : "outline"} 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => toggleYearFilter(year)}
                        >
                          {year}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
