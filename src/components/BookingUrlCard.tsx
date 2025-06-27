
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink, Check, Link2 } from "lucide-react";
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
        title: "Enlace copiado",
        description: "La URL se ha copiado al portapapeles",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el enlace",
        variant: "destructive",
      });
    }
  };

  const openBookingPage = () => {
    window.open(bookingUrl, '_blank');
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Link2 className="h-4 w-4 text-blue-600" />
          </div>
          Enlace de reservas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Comparte este enlace para que tus clientes puedan hacer reservas online
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={bookingUrl}
                readOnly
                className="pr-20 bg-gray-50 border-gray-200 text-sm font-mono text-gray-700 focus:bg-white transition-colors"
                onClick={(e) => e.currentTarget.select()}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </Button>
                <Button
                  onClick={openBookingPage}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <ExternalLink className="h-3 w-3 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar enlace
                </>
              )}
            </Button>
            <Button
              onClick={openBookingPage}
              variant="outline"
              size="sm"
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir página
            </Button>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
            Puedes compartir este enlace en redes sociales, WhatsApp o tu sitio web
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingUrlCard;
