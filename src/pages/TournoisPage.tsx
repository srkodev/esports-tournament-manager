
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Tournoi, getTournois, getTournoiWithVainqueur } from "@/services/api";
import TournoiCard from "@/components/tournois/TournoiCard";
import { Loader2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const TournoisPage = () => {
  const [tournois, setTournois] = useState<Tournoi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  useEffect(() => {
    const loadTournois = async () => {
      try {
        const data = await getTournois();
        
        // Charger les données de vainqueur pour chaque tournoi
        const tournoisWithVainqueur = await Promise.all(
          data.map(async (tournoi) => {
            if (tournoi.ID_equipe_vainqueur) {
              return await getTournoiWithVainqueur(tournoi.ID_tournoi);
            }
            return tournoi;
          })
        );
        
        setTournois(tournoisWithVainqueur.filter(Boolean) as Tournoi[]);
      } catch (error) {
        console.error("Erreur lors du chargement des tournois:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTournois();
  }, []);
  
  // Calculer les tournois à afficher pour la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTournois = tournois.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(tournois.length / itemsPerPage);
  
  // Générer les numéros de page pour la pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 highlight-text">Tournois Esport</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez les tournois passés, présents et à venir dans le monde de l'esport.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentTournois.map((tournoi) => (
                <TournoiCard key={tournoi.ID_tournoi} tournoi={tournoi} />
              ))}
            </div>
            
            {tournois.length > itemsPerPage && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      isActive={currentPage > 1}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                      <PaginationLink
                        isActive={currentPage === number}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      isActive={currentPage < totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default TournoisPage;
