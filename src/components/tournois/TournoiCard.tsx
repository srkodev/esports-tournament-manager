
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tournoi } from "@/services/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MapPin, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TournoiCardProps {
  tournoi: Tournoi;
}

const TournoiCard = ({ tournoi }: TournoiCardProps) => {
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
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:shadow-primary/20 group">
      <CardHeader className="p-0 overflow-hidden h-48 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
        <img 
          src={tournoi.Image_affiche} 
          alt={`Affiche de ${tournoi.Nom_tournoi}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400/4b5563/e2e8f0?text=Tournoi";
          }}
        />
        <div className="absolute top-4 right-4 z-20">
          <Badge variant={statusColor === "blue" ? "secondary" : statusColor === "green" ? "default" : "outline"}>
            {status}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h3 className="text-xl font-bold tracking-tight">{tournoi.Nom_tournoi}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>
            Du {dateDebut} au {dateFin}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{tournoi.Lieu}</span>
        </div>
        {tournoi.ID_equipe_vainqueur && tournoi.Vainqueur && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Vainqueur: <span className="font-medium">{tournoi.Vainqueur.Nom}</span></span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Link to={`/tournois/${tournoi.ID_tournoi}`} className="w-full">
          <Button variant="outline" className="w-full">
            Voir les détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TournoiCard;
