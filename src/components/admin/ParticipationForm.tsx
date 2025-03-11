
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Equipe, Tournoi, addParticipation } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ParticipationFormProps {
  equipes: Equipe[];
  tournois: Tournoi[];
  onSuccess: () => void;
}

const ParticipationForm = ({ equipes, tournois, onSuccess }: ParticipationFormProps) => {
  const [equipeId, setEquipeId] = useState<string>("");
  const [tournoiId, setTournoiId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipeId || !tournoiId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une équipe et un tournoi.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await addParticipation(parseInt(equipeId), parseInt(tournoiId));
      setEquipeId("");
      setTournoiId("");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la participation :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la participation.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Équipe *</label>
        <Select
          value={equipeId}
          onValueChange={setEquipeId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une équipe" />
          </SelectTrigger>
          <SelectContent>
            {equipes.map((equipe) => (
              <SelectItem key={equipe.ID_equipe} value={equipe.ID_equipe.toString()}>
                {equipe.Nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium block mb-1">Tournoi *</label>
        <Select
          value={tournoiId}
          onValueChange={setTournoiId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un tournoi" />
          </SelectTrigger>
          <SelectContent>
            {tournois.map((tournoi) => (
              <SelectItem key={tournoi.ID_tournoi} value={tournoi.ID_tournoi.toString()}>
                {tournoi.Nom_tournoi}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Ajouter la participation
      </Button>
    </form>
  );
};

export default ParticipationForm;
