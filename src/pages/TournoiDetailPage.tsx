
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Equipe, Participation, Tournoi, getParticipations, getTournoiWithVainqueur } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft, Globe, Loader2, MapPin, Trophy, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { NotFound } from "./NotFound";

const TournoiDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [tournoi, setTournoi] = useState<Tournoi | null>(null);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadTournoi = async () => {
      if (!id) {
        setError("ID de tournoi non fourni");
        setIsLoading(false);
        return;
      }
      
      try {
        const tournoiId = parseInt(id);
        
        const [tournoiData, participationsData] = await Promise.all([
          getTournoiWithVainqueur(tournoiId),
          getParticipations(tournoiId)
        ]);
        
        if (!tournoiData) {
          setError("Tournoi non trouvé");
        } else {
          setTournoi(tournoiData);
          setParticipations(participationsData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du tournoi:", error);
        setError("Une erreur est survenue lors du chargement du tournoi");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTournoi();
  }, [id]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (error || !tournoi) {
    return <NotFound />;
  }
  
  // Formatage des dates
  const dateDebut = format(new Date(tournoi.Date_debut), 'PPP', { locale: fr });
  const dateFin = format(new Date(tournoi.Date_fin), 'PPP', { locale: fr });
  
  // Déterminer si le tournoi est à venir, en cours ou terminé
  const maintenant = new Date();
  const debut = new Date(tournoi.Date_debut);
  const fin = new Date(tournoi.Date_fin);
  
  let status: "à venir" | "en cours" | "terminé";
  let statusColor: "blue" | "green" | "default";
  
  if (maintenant < debut) {
    status = "à venir";
    statusColor = "blue";
  } else if (maintenant > fin) {
    status = "terminé";
    statusColor = "default";
  } else {
    status = "en cours";
    statusColor = "green";
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/tournois">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" /> Retour aux tournois
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
              <img 
                src={tournoi.Image_affiche} 
                alt={`Affiche de ${tournoi.Nom_tournoi}`}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/1200x400/4b5563/e2e8f0?text=Tournoi";
                }}
              />
              <div className="absolute top-4 right-4 z-20">
                <Badge variant={statusColor === "blue" ? "secondary" : statusColor === "green" ? "default" : "outline"}>
                  {status}
                </Badge>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{tournoi.Nom_tournoi}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>
                    Du {dateDebut} au {dateFin}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>{tournoi.Lieu}</span>
                </div>
              </div>
              
              {tournoi.Vainqueur && (
                <div className="bg-muted/30 rounded-lg p-4 mb-6 border border-border">
                  <div className="flex items-center">
                    <Trophy className="mr-3 h-6 w-6 text-yellow-500" />
                    <div>
                      <h3 className="text-lg font-medium">Vainqueur du tournoi</h3>
                      <p className="text-primary font-bold">{tournoi.Vainqueur.Nom}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> 
                  Équipes participantes
                </h2>
                
                {participations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participations.map((participation) => (
                      participation.Equipe && (
                        <div 
                          key={participation.ID_participation}
                          className="flex items-center p-3 rounded-lg border border-border bg-card"
                        >
                          <div className="w-10 h-10 mr-3 overflow-hidden">
                            <img 
                              src={participation.Equipe.Logo}
                              alt={`Logo de ${participation.Equipe.Nom}`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/80x80/4b5563/e2e8f0?text=Logo";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{participation.Equipe.Nom}</p>
                            <p className="text-sm text-muted-foreground">{participation.Equipe.Pays}</p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune équipe participante pour le moment.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Colonne latérale */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                  <p>{dateDebut} - {dateFin}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Lieu</h3>
                  <p>{tournoi.Lieu}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Équipes</h3>
                  <p>{participations.length} participants</p>
                </div>
                {tournoi.Vainqueur && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Vainqueur</h3>
                      <div className="flex items-center">
                        <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>{tournoi.Vainqueur.Nom}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {tournoi.Vainqueur && (
              <Card>
                <CardHeader>
                  <CardTitle>Équipe vainqueur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 overflow-hidden">
                      <img 
                        src={tournoi.Vainqueur.Logo}
                        alt={`Logo de ${tournoi.Vainqueur.Nom}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/160x160/4b5563/e2e8f0?text=Logo";
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold">{tournoi.Vainqueur.Nom}</h3>
                    <p className="text-muted-foreground">{tournoi.Vainqueur.Pays}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {tournoi.Vainqueur.Jeux_principaux.split(",").map((jeu, index) => (
                      <Badge key={index} variant="secondary" className="bg-muted">
                        {jeu.trim()}
                      </Badge>
                    ))}
                  </div>
                  
                  {tournoi.Vainqueur.Site_web && (
                    <div className="flex justify-center">
                      <a 
                        href={tournoi.Vainqueur.Site_web} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary hover:underline"
                      >
                        <Globe className="mr-1 h-4 w-4" /> Site officiel
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TournoiDetailPage;
