
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
import { Equipe, createEquipe, updateEquipe } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface EquipeFormProps {
  onSuccess: () => void;
  equipeToEdit?: Equipe;
}

const equipeSchema = z.object({
  Nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  Pays: z.string().min(2, "Le pays doit contenir au moins 2 caractères"),
  Jeux_principaux: z.string(),
  Date_creation: z.string(),
  Logo: z.string().url("URL invalide").or(z.literal("")),
  Site_web: z.string().url("URL invalide").or(z.literal(""))
});

type EquipeFormValues = z.infer<typeof equipeSchema>;

const EquipeForm = ({ onSuccess, equipeToEdit }: EquipeFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const defaultValues: Partial<EquipeFormValues> = {
    Nom: equipeToEdit?.Nom || "",
    Pays: equipeToEdit?.Pays || "",
    Jeux_principaux: equipeToEdit?.Jeux_principaux || "",
    Date_creation: equipeToEdit?.Date_creation || new Date().toISOString().split("T")[0],
    Logo: equipeToEdit?.Logo || "",
    Site_web: equipeToEdit?.Site_web || ""
  };
  
  const form = useForm<EquipeFormValues>({
    resolver: zodResolver(equipeSchema),
    defaultValues
  });
  
  const onSubmit = async (data: EquipeFormValues) => {
    setIsLoading(true);
    
    try {
      if (equipeToEdit) {
        await updateEquipe(equipeToEdit.ID_equipe, data);
      } else {
        await createEquipe(data);
      }
      
      onSuccess();
      
      if (!equipeToEdit) {
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
          name="Nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'équipe *</FormLabel>
              <FormControl>
                <Input placeholder="Team Liquid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Pays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays d'origine *</FormLabel>
              <FormControl>
                <Input placeholder="France" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Jeux_principaux"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jeux principaux</FormLabel>
              <FormControl>
                <Input placeholder="CS:GO, Dota 2, LoL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Date_creation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de création *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL du logo</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Site_web"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site web</FormLabel>
              <FormControl>
                <Input placeholder="https://team-example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {equipeToEdit ? "Mettre à jour" : "Créer l'équipe"}
        </Button>
      </form>
    </Form>
  );
};

export default EquipeForm;
