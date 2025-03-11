
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Equipe } from "@/services/api";
import { Calendar as CalendarIcon, Filter, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterTournois: (filters: TournoiFilters) => void;
  onFilterEquipes: (filters: EquipeFilters) => void;
  equipes: Equipe[];
  activeTab: 'equipes' | 'tournois';
}

export interface TournoiFilters {
  dateDebut?: string;
  dateFin?: string;
  lieu?: string;
  vainqueur?: number;
}

export interface EquipeFilters {
  pays?: string;
  jeu?: string;
}

const SearchFilters = ({ onSearch, onFilterTournois, onFilterEquipes, equipes, activeTab }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres pour les tournois
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
  const [lieu, setLieu] = useState<string>("");
  const [vainqueur, setVainqueur] = useState<number | undefined>(undefined);
  
  // Filtres pour les équipes
  const [pays, setPays] = useState<string>("");
  const [jeu, setJeu] = useState<string>("");
  
  // Récupérer les pays uniques des équipes
  const uniquePays = Array.from(new Set(equipes.map(e => e.Pays)));
  
  // Récupérer les jeux uniques des équipes
  const allJeux = equipes.flatMap(e => e.Jeux_principaux.split(",").map(j => j.trim()));
  const uniqueJeux = Array.from(new Set(allJeux));
  
  const handleSearch = () => {
    onSearch(searchQuery);
    
    if (activeTab === 'tournois') {
      onFilterTournois({
        dateDebut: dateDebut ? format(dateDebut, 'yyyy-MM-dd') : undefined,
        dateFin: dateFin ? format(dateFin, 'yyyy-MM-dd') : undefined,
        lieu,
        vainqueur
      });
    } else {
      onFilterEquipes({
        pays,
        jeu
      });
    }
  };
  
  const resetFilters = () => {
    setDateDebut(undefined);
    setDateFin(undefined);
    setLieu("");
    setVainqueur(undefined);
    setPays("");
    setJeu("");
    
    if (activeTab === 'tournois') {
      onFilterTournois({});
    } else {
      onFilterEquipes({});
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="default"
                onClick={handleSearch}
              >
                Rechercher
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="pt-4 border-t border-border animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Filtres avancés</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Réinitialiser
                </Button>
              </div>
              
              {activeTab === 'tournois' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Date de début</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateDebut ? (
                            format(dateDebut, 'PPP', { locale: fr })
                          ) : (
                            <span>Sélectionner</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateDebut}
                          onSelect={setDateDebut}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Date de fin</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFin ? (
                            format(dateFin, 'PPP', { locale: fr })
                          ) : (
                            <span>Sélectionner</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFin}
                          onSelect={setDateFin}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Lieu</label>
                    <Input
                      placeholder="Pays ou ville"
                      value={lieu}
                      onChange={(e) => setLieu(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Vainqueur</label>
                    <Select
                      value={vainqueur?.toString() || ""}
                      onValueChange={(value) => setVainqueur(value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les équipes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes les équipes</SelectItem>
                        {equipes.map((equipe) => (
                          <SelectItem key={equipe.ID_equipe} value={equipe.ID_equipe.toString()}>
                            {equipe.Nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Pays</label>
                    <Select
                      value={pays}
                      onValueChange={setPays}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les pays</SelectItem>
                        {uniquePays.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Jeu</label>
                    <Select
                      value={jeu}
                      onValueChange={setJeu}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les jeux" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les jeux</SelectItem>
                        {uniqueJeux.map((j) => (
                          <SelectItem key={j} value={j}>
                            {j}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
