
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, folder: string = 'services'): Promise<string | null> => {
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // Determinar el bucket basado en la carpeta
      const bucketName = folder === 'staff' ? 'staff-photos' : 'service-images';
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error al subir imagen",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (url: string, folder: string = 'services'): Promise<boolean> => {
    try {
      // Extract path from URL - handle both old and new URL formats
      const urlParts = url.split('/');
      let path = '';
      
      // Find the part after 'object/public' or 'object/sign'
      const objectIndex = urlParts.findIndex(part => part === 'object');
      if (objectIndex !== -1 && objectIndex + 2 < urlParts.length) {
        // Get everything after 'object/public/' or 'object/sign/'
        path = urlParts.slice(objectIndex + 2).join('/');
      } else {
        // Fallback: get the filename only
        path = urlParts[urlParts.length - 1];
      }
      
      // Determinar el bucket basado en la carpeta
      const bucketName = folder === 'staff' ? 'staff-photos' : 'service-images';
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) {
        console.error('Error deleting image:', error);
        // Don't throw error for delete operations, just log it
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error al eliminar imagen",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading
  };
};
