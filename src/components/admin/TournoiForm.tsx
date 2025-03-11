
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Equipe, Tournoi, createTournoi, updateTournoi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface TournoiFormProps {
  onSuccess: () => void;
  tournoiToEdit?: Tournoi;
  equipes: Equipe[];
  onCancel?: () => void; // Added to match AdminPage usage
}

const tournoiSchema = z.object({
  Nom_tournoi: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  Date_debut: z.string(),
  Date_fin: z.string(),
  Lieu: z.string().min(2, "Le lieu doit contenir au moins 2 caractères"),
  Image_affiche: z.string().url("URL invalide").or(z.literal("")),
  ID_equipe_vainqueur: z.string().or(z.literal("null"))
}).refine(data => {
  const dateDebut = new Date(data.Date_debut);
  const dateFin = new Date(data.Date_fin);
  return dateFin >= dateDebut;
}, {
  message: "La date de fin doit être après la date de début",
  path: ["Date_fin"]
});

type TournoiFormValues = z.infer<typeof tournoiSchema>;

const TournoiForm = ({ onSuccess, tournoiToEdit, equipes, onCancel }: TournoiFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const defaultValues: Partial<TournoiFormValues> = {
    Nom_tournoi: tournoiToEdit?.Nom_tournoi || "",
    Date_debut: tournoiToEdit?.Date_debut || new Date().toISOString().split("T")[0],
    Date_fin: tournoiToEdit?.Date_fin || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    Lieu: tournoiToEdit?.Lieu || "",
    Image_affiche: tournoiToEdit?.Image_affiche || "",
    ID_equipe_vainqueur: tournoiToEdit?.ID_equipe_vainqueur?.toString() || "null"
  };
  
  const form = useForm<TournoiFormValues>({
    resolver: zodResolver(tournoiSchema),
    defaultValues
  });
  
  const onSubmit = async (data: TournoiFormValues) => {
    setIsLoading(true);
    
    try {
      const formattedData = {
        Nom_tournoi: data.Nom_tournoi,
        Date_debut: data.Date_debut,
        Date_fin: data.Date_fin,
        Lieu: data.Lieu,
        Image_affiche: data.Image_affiche,
        ID_equipe_vainqueur: data.ID_equipe_vainqueur === "null" ? null : parseInt(data.ID_equipe_vainqueur)
      };
      
      if (tournoiToEdit) {
        await updateTournoi(tournoiToEdit.ID_tournoi, formattedData);
      } else {
        await createTournoi(formattedData);
      }
      
      onSuccess();
      
      if (!tournoiToEdit) {
        form.reset(defaultValues);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="Nom_tournoi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du tournoi *</FormLabel>
              <FormControl>
                <Input placeholder="ESL One Paris 2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="Date_debut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Date_fin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="Lieu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu *</FormLabel>
              <FormControl>
                <Input placeholder="Paris, France" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Image_affiche"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'affiche</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/affiche.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ID_equipe_vainqueur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Équipe vainqueur</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'équipe vainqueur" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">Aucun vainqueur</SelectItem>
                  {equipes.map((equipe) => (
                    <SelectItem key={equipe.ID_equipe} value={equipe.ID_equipe.toString()}>
                      {equipe.Nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tournoiToEdit ? "Mettre à jour" : "Créer le tournoi"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TournoiForm;
