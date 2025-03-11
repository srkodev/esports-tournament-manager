
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Equipe, getEquipes } from "@/services/api";
import EquipeCard from "@/components/equipes/EquipeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, TrophyIcon, UsersIcon, Calendar, Search } from "lucide-react";

const Index = () => {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadEquipes = async () => {
      try {
        const data = await getEquipes();
        setEquipes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des équipes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEquipes();
  }, []);
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-esport-purple/30 to-esport-blue/30 pointer-events-none" />
        <div 
          className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 relative bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1920')",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in highlight-text">
              Gestion de Tournois Esport
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up">
              Votre plateforme complète pour suivre, organiser et participer à des tournois esport.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              <Link to="/tournois">
                <Button size="lg" className="bg-esport-purple hover:bg-esport-purple/90">
                  <TrophyIcon className="mr-2 h-5 w-5" /> Voir les tournois
                </Button>
              </Link>
              <Link to="/recherche">
                <Button size="lg" variant="outline">
                  <Search className="mr-2 h-5 w-5" /> Rechercher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 highlight-text">
            Notre Plateforme
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-esport-purple/20 rounded-full flex items-center justify-center mb-4">
                <TrophyIcon className="h-6 w-6 text-esport-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tournois</h3>
              <p className="text-muted-foreground">
                Suivez les tournois esport du monde entier, consultez les résultats et les dates à venir.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-esport-blue/20 rounded-full flex items-center justify-center mb-4">
                <UsersIcon className="h-6 w-6 text-esport-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Équipes</h3>
              <p className="text-muted-foreground">
                Découvrez les meilleures équipes esport, leurs performances et leurs informations.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-esport-purple/20 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-esport-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Calendrier</h3>
              <p className="text-muted-foreground">
                Ne manquez aucun événement grâce au calendrier complet des compétitions à venir.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Équipes Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold highlight-text">
              Équipes Esport
            </h2>
            <Link to="/recherche?tab=equipes">
              <Button variant="outline">
                Voir toutes les équipes
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipes.slice(0, 6).map((equipe) => (
                <EquipeCard key={equipe.ID_equipe} equipe={equipe} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-esport-purple to-esport-blue rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à participer?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Accédez à l'interface d'administration pour gérer vos équipes et tournois.
            </p>
            <Link to="/admin">
              <Button size="lg" variant="secondary" className="bg-white text-esport-purple hover:bg-white/90">
                Espace Administration
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
