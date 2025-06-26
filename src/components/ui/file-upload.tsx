
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  currentImage?: string;
  accept?: string;
  className?: string;
  maxSize?: number; // in MB
}

const FileUpload = ({ 
  onFileSelect, 
  onFileRemove, 
  currentImage, 
  accept = "image/*", 
  className,
  maxSize = 5 
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`El archivo es muy grande. Máximo ${maxSize}MB.`);
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    
    onFileSelect(file);
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
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Imagen del servicio"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onFileRemove}
            >
              <X className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50",
            dragActive && "border-blue-400 bg-blue-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Image className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Haz clic para subir o arrastra una imagen
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP hasta {maxSize}MB
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar archivo
            </Button>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
