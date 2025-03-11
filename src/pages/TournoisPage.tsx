
import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import TournoiCard from "@/components/tournois/TournoiCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tournoi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { getTournois } from "@/services/api";
import { Loader2, Search, CalendarRange, MapPin } from "lucide-react";

const TournoisPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date_desc");
  const itemsPerPage = 6;

  const { data: tournois, isLoading } = useQuery({
    queryKey: ["tournois"],
    queryFn: getTournois,
  });

  // Filtrage et tri des tournois
  const filteredTournois = tournois?.filter(tournoi => 
    tournoi.Nom_tournoi.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tournoi.Lieu.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTournois = filteredTournois ? [...filteredTournois].sort((a, b) => {
    switch(sortBy) {
      case "date_asc":
        return new Date(a.Date_debut).getTime() - new Date(b.Date_debut).getTime();
      case "date_desc":
        return new Date(b.Date_debut).getTime() - new Date(a.Date_debut).getTime();
      case "name_asc":
        return a.Nom_tournoi.localeCompare(b.Nom_tournoi);
      case "name_desc":
        return b.Nom_tournoi.localeCompare(a.Nom_tournoi);
      default:
        return 0;
    }
  }) : [];

  // Pagination
  const totalPages = sortedTournois ? Math.ceil(sortedTournois.length / itemsPerPage) : 0;
  const paginatedTournois = sortedTournois?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Générer les numéros de page pour la pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-bold highlight-text">Tournois Esport</h1>
            <p className="text-muted-foreground">
              Explorez les tournois esport passés, présents et futurs
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un tournoi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (récent → ancien)</SelectItem>
                <SelectItem value="date_asc">Date (ancien → récent)</SelectItem>
                <SelectItem value="name_asc">Nom (A → Z)</SelectItem>
                <SelectItem value="name_desc">Nom (Z → A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : paginatedTournois && paginatedTournois.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTournois.map((tournoi: Tournoi) => (
                  <Link to={`/tournois/${tournoi.ID_tournoi}`} key={tournoi.ID_tournoi} className="block transition-transform duration-200 hover:scale-[1.02]">
                    <TournoiCard tournoi={tournoi} />
                  </Link>
                ))}
              </div>

              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => setCurrentPage(number)}
                        isActive={currentPage === number}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <p className="text-muted-foreground mb-4">Aucun tournoi trouvé.</p>
              <Button onClick={() => setSearchQuery("")}>Réinitialiser la recherche</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TournoisPage;
