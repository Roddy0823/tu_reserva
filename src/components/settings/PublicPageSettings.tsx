import { useState, useEffect } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Globe, 
  Image as ImageIcon, 
  Instagram, 
  Facebook, 
  Twitter,
  ExternalLink,
  Trash2,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/useImageUpload';

interface PublicPageSettingsProps {
  business: any;
}

const PublicPageSettings = ({ business }: PublicPageSettingsProps) => {
  const { updateBusiness, isUpdating } = useBusiness();
  const { toast } = useToast();
  const { uploadImage, isUploading } = useImageUpload();
  
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    logo_url: '',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    whatsapp_number: '',
  });
  
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

  useEffect(() => {
    if (business) {
      setFormData({
        logo_url: business.logo_url || '',
        instagram_url: business.instagram_url || '',
        facebook_url: business.facebook_url || '',
        twitter_url: business.twitter_url || '',
        whatsapp_number: business.whatsapp_number || '',
      });
      setPortfolioImages(business.portfolio_images || []);
    }
  }, [business]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file, 'business-logos');
      setFormData(prev => ({ ...prev, logo_url: imageUrl }));
      setHasChanges(true);
      toast({
        title: "Logo subido",
        description: "El logo se ha actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al subir logo",
        description: "No se pudo subir la imagen. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handlePortfolioUpload = async (file: File) => {
    if (portfolioImages.length >= 6) {
      toast({
        title: "Límite alcanzado",
        description: "Puedes subir máximo 6 imágenes al portafolio",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageUrl = await uploadImage(file, 'portfolio');
      setPortfolioImages(prev => [...prev, imageUrl]);
      setHasChanges(true);
      toast({
        title: "Imagen agregada",
        description: "La imagen se ha agregado al portafolio",
      });
    } catch (error) {
      toast({
        title: "Error al subir imagen",
        description: "No se pudo subir la imagen. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    updateBusiness({
      ...formData,
      // portfolio_images: portfolioImages // Comentado hasta crear el campo en la BD
    });
    setHasChanges(false);
  };

  const getPublicUrl = () => {
    if (business?.booking_url_slug) {
      return `${window.location.origin}/reservas/${business.booking_url_slug}`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* URL Pública */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            URL Pública de Reservas
          </CardTitle>
          <CardDescription>
            Esta es la dirección donde tus clientes pueden hacer reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <code className="flex-1 text-sm">{getPublicUrl()}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getPublicUrl(), '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Página
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logo del Negocio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo del Negocio
          </CardTitle>
          <CardDescription>
            Imagen que representará tu negocio en la página pública
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.logo_url} alt="Logo del negocio" />
              <AvatarFallback>
                <ImageIcon className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Subir nuevo logo</Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground">
                Formatos: JPG, PNG, WebP. Tamaño recomendado: 200x200px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portafolio de Imágenes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Portafolio de Imágenes
            <Badge variant="secondary">{portfolioImages.length}/6</Badge>
          </CardTitle>
          <CardDescription>
            Galería de imágenes que mostrarán tu trabajo a los clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Portafolio ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePortfolioImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {portfolioImages.length < 6 && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex items-center justify-center">
                <label htmlFor="portfolio-upload" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Agregar Imagen</span>
                  <Input
                    id="portfolio-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePortfolioUpload(file);
                    }}
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            Las imágenes se comprimen automáticamente para optimizar la carga de la página
          </p>
        </CardContent>
      </Card>

      {/* Enlaces a Redes Sociales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Redes Sociales
          </CardTitle>
          <CardDescription>
            Enlaces a tus perfiles sociales que aparecerán en tu página pública
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram_url" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input
                id="instagram_url"
                value={formData.instagram_url}
                onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/tu_usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook_url" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </Label>
              <Input
                id="facebook_url"
                value={formData.facebook_url}
                onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/tu_pagina"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter_url" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter / X
              </Label>
              <Input
                id="twitter_url"
                value={formData.twitter_url}
                onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                placeholder="https://twitter.com/tu_usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp</Label>
              <Input
                id="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!hasChanges || isUpdating}
          className="min-w-32"
        >
          {isUpdating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PublicPageSettings;