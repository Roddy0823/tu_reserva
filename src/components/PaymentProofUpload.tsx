
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { usePaymentProofUpload } from "@/hooks/usePaymentProofUpload";

interface PaymentProofUploadProps {
  appointmentId: string;
  bankAccountDetails?: string;
  serviceName: string;
  servicePrice: number;
}

const PaymentProofUpload = ({ 
  appointmentId, 
  bankAccountDetails, 
  serviceName, 
  servicePrice 
}: PaymentProofUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadPaymentProof, isUploading } = usePaymentProofUpload();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadPaymentProof({ appointmentId, file: selectedFile });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Subir Comprobante de Pago</CardTitle>
        <CardDescription>
          Servicio: {serviceName} - ${servicePrice}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bankAccountDetails && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Datos para transferencia:</h4>
            <pre className="text-sm text-blue-800 whitespace-pre-wrap">{bankAccountDetails}</pre>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="payment-proof">Comprobante de pago</Label>
          <Input
            id="payment-proof"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Subiendo..." : "Subir Comprobante"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentProofUpload;
