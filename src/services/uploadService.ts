
import { toast } from "@/hooks/use-toast";

export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload/upload.php", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur pendant l'upload");
    }

    const data = await response.json();
    return data.file_path;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    toast({
      title: "Erreur",
      description: error instanceof Error ? error.message : "Impossible d'uploader l'image",
      variant: "destructive",
    });
    return null;
  }
};
