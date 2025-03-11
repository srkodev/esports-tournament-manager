
import { useState, useRef } from "react";
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
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/services/uploadService";

interface EquipeFormProps {
  onSuccess: () => void;
  equipeToEdit?: Equipe;
  onCancel?: () => void;
}

const equipeSchema = z.object({
  Nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  Pays: z.string().min(2, "Le pays doit contenir au moins 2 caractères"),
  Jeux_principaux: z.string(),
  Date_creation: z.string(),
  Logo: z.string(),
  Site_web: z.string().url("URL invalide").or(z.literal(""))
});

type EquipeFormValues = z.infer<typeof equipeSchema>;

const EquipeForm = ({ onSuccess, equipeToEdit, onCancel }: EquipeFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(equipeToEdit?.Logo || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const filePath = await uploadImage(file);
      if (filePath) {
        form.setValue("Logo", filePath);
        setLogoPreview(filePath);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload du logo:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader le logo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const onSubmit = async (data: EquipeFormValues) => {
    setIsLoading(true);
    
    try {
      if (equipeToEdit) {
        await updateEquipe(equipeToEdit.ID_equipe, data);
      } else {
        await createEquipe({
          Nom: data.Nom,
          Pays: data.Pays,
          Jeux_principaux: data.Jeux_principaux,
          Date_creation: data.Date_creation,
          Logo: data.Logo,
          Site_web: data.Site_web
        });
      }
      
      onSuccess();
      
      if (!equipeToEdit) {
        form.reset(defaultValues);
        setLogoPreview(null);
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
              <FormLabel>Logo</FormLabel>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                  />
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {logoPreview ? "Changer le logo" : "Uploader un logo"}
                  </Button>
                  
                  <FormControl>
                    <Input 
                      placeholder="Ou URL du logo" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        setLogoPreview(e.target.value);
                      }}
                    />
                  </FormControl>
                </div>
                
                {logoPreview && (
                  <div className="border rounded-md p-2 w-32 h-32 flex items-center justify-center overflow-hidden">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="max-w-full max-h-full object-contain"
                      onError={() => {
                        setLogoPreview(null);
                        toast({
                          title: "Erreur",
                          description: "Impossible de charger l'image",
                          variant: "destructive"
                        });
                      }}
                    />
                  </div>
                )}
              </div>
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
        
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {equipeToEdit ? "Mettre à jour" : "Créer l'équipe"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EquipeForm;
