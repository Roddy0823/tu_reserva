
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink, Check, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingUrlCardProps {
  businessSlug: string;
}

const BookingUrlCard = ({ businessSlug }: BookingUrlCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const bookingUrl = `${window.location.origin}/reservas/${businessSlug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      toast({
        title: "¡Enlace copiado!",
        description: "La URL de reservas se ha copiado al portapapeles",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el enlace. Puedes seleccionarlo manualmente.",
        variant: "destructive",
      });
    }
  };

  const openBookingPage = () => {
    window.open(bookingUrl, '_blank');
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Enlace de Reservas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">
          Comparte este enlace con tus clientes para que puedan hacer reservas online:
        </p>
        
        <div className="flex gap-2">
          <Input
            value={bookingUrl}
            readOnly
            className="flex-1 bg-white border-blue-200 text-sm"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            onClick={copyToClipboard}
            size="sm"
            className="px-3"
            variant={copied ? "default" : "outline"}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={openBookingPage}
            size="sm"
            variant="outline"
            className="px-3"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Smartphone className="h-3 w-3" />
            <span>Optimizado para móviles</span>
          </div>
          <span>💡 Tip: Comparte en redes sociales, WhatsApp o tu sitio web</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingUrlCard;
