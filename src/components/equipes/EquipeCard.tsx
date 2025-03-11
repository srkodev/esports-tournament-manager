
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Equipe } from "@/services/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ExternalLink } from "lucide-react";

interface EquipeCardProps {
  equipe: Equipe;
}

const EquipeCard = ({ equipe }: EquipeCardProps) => {
  // Traiter les jeux principaux pour les afficher comme des badges
  const jeux = equipe.Jeux_principaux.split(",").map(jeu => jeu.trim());
  
  // Formatage de la date de création
  const dateCreation = format(new Date(equipe.Date_creation), 'PPP', { locale: fr });
  
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:shadow-primary/20 group">
      <CardHeader className="p-0 overflow-hidden h-48 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
        <img 
          src={equipe.Logo} 
          alt={`Logo de ${equipe.Nom}`}
          className="w-full h-full object-contain p-8 bg-muted/20 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400x400/4b5563/e2e8f0?text=Logo";
          }}
        />
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h3 className="text-xl font-bold tracking-tight">{equipe.Nom}</h3>
          <p className="text-muted-foreground">{equipe.Pays}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {jeux.map((jeu, index) => (
            <Badge key={index} variant="secondary" className="bg-muted">
              {jeu}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Fondée le {dateCreation}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <a 
          href={equipe.Site_web} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Site officiel <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
};

export default EquipeCard;
