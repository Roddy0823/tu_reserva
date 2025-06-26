
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Business } from "@/types/database";

export const useBusinessBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['business-by-slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('booking_url_slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No business found
        }
        throw error;
      }
      return data as Business;
    },
    enabled: !!slug,
  });
};
