
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import EquipeCard from "@/components/equipes/EquipeCard";
import { Equipe } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { getEquipes } from "@/services/api";
import { Loader2 } from "lucide-react";

const EquipesPage = () => {
  const { data: equipes, isLoading } = useQuery({
    queryKey: ["equipes"],
    queryFn: getEquipes,
  });

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-bold highlight-text">Équipes Esport</h1>
            <p className="text-muted-foreground">
              Découvrez les meilleures équipes professionnelles d'esport du monde entier
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipes?.map((equipe: Equipe) => (
                <EquipeCard key={equipe.ID_equipe} equipe={equipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default EquipesPage;
