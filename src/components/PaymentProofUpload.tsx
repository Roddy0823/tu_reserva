
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { usePaymentProofUpload } from "@/hooks/usePaymentProofUpload";
import { useToast } from "@/hooks/use-toast";

interface PaymentProofUploadProps {
  appointmentId: string;
  bankAccountDetails?: string;
  serviceName: string;
  servicePrice: number;
  onSuccess?: () => void;
}

const PaymentProofUpload = ({ 
  appointmentId, 
  bankAccountDetails, 
  serviceName, 
  servicePrice,
  onSuccess
}: PaymentProofUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { uploadPaymentProof, isUploading } = usePaymentProofUpload();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Archivo muy grande",
          description: "El archivo debe ser menor a 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo debe ser menor a 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadPaymentProof({ appointmentId, file: selectedFile }, {
        onSuccess: () => {
          setUploadSuccess(true);
          onSuccess?.();
        }
      });
    }
  };

  if (uploadSuccess) {
    return (
      <div className="text-center space-y-4 py-8">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
        <h3 className="text-lg font-semibold text-green-900">¡Comprobante Enviado!</h3>
        <p className="text-green-700">
          Tu comprobante se ha enviado correctamente y está siendo revisado por nuestro equipo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bank Details */}
      {bankAccountDetails && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-900 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Datos para Transferencia
            </CardTitle>
            <CardDescription className="text-blue-700">
              Realiza la transferencia por ${servicePrice.toLocaleString()} COP para {serviceName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
              <pre className="text-sm text-blue-900 whitespace-pre-wrap font-mono">
                {bankAccountDetails}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Subir Comprobante</CardTitle>
          <CardDescription>
            Sube una imagen clara de tu comprobante de transferencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-all
              ${dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : selectedFile 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="space-y-2 sm:space-y-3">
              {selectedFile ? (
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-green-600 mx-auto" />
              ) : (
                <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-slate-400 mx-auto" />
              )}
              
              <div>
                {selectedFile ? (
                  <div>
                    <p className="font-medium text-green-900 text-sm sm:text-base break-all">{selectedFile.name}</p>
                    <p className="text-xs sm:text-sm text-green-700">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-700 font-medium text-sm sm:text-base">
                      <span className="hidden sm:inline">Arrastra tu comprobante aquí o </span>
                      <span className="sm:hidden">Selecciona tu comprobante o </span>
                      haz clic para seleccionar
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      PNG, JPG, WEBP hasta 5MB
                    </p>
                  </div>
                )}
              </div>
              
              {!selectedFile && (
                <Button type="button" variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Seleccionar Archivo
                </Button>
              )}
            </div>
          </div>

          <Input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload Button */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-auto"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-xs sm:text-sm">Subiendo...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Enviar Comprobante</span>
                </div>
              )}
            </Button>
            
            {selectedFile && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
                className="sm:flex-none text-sm sm:text-base h-10 sm:h-auto"
              >
                Cambiar
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              Una vez enviado el comprobante, nuestro equipo lo revisará y confirmará tu cita. 
              Recibirás una notificación por email cuando sea aprobado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProofUpload;
