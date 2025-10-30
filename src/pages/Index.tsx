import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Experience } from "@/types";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ExperienceCard from "@/components/ExperienceCard";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Experience[];
    },
  });

  const filteredExperiences = experiences?.filter((exp) =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Explore Experiences</h1>
            <p className="text-lg text-muted-foreground">
              Discover and book amazing adventures across India
            </p>
          </div>
          
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[380px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExperiences?.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}

        {!isLoading && filteredExperiences?.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No experiences found. Try a different search term.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
