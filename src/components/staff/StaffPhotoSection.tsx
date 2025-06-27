
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import FileUpload from '@/components/ui/file-upload';

interface StaffPhotoSectionProps {
  photoUrl: string | null;
  fullName: string;
  onPhotoSelect: (file: File) => void;
  onPhotoRemove: () => void;
}

const StaffPhotoSection = ({ photoUrl, fullName, onPhotoSelect, onPhotoRemove }: StaffPhotoSectionProps) => {
  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Foto de Perfil</h3>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32 border-4 border-gray-200 shadow-lg">
            <AvatarImage 
              src={photoUrl || undefined} 
              alt="Foto de perfil"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold">
              {fullName ? getInitials(fullName) : <User className="h-12 w-12" />}
            </AvatarFallback>
          </Avatar>
          
          <FileUpload
            onFileSelect={onPhotoSelect}
            onFileRemove={onPhotoRemove}
            currentImage={photoUrl || undefined}
            accept="image/*"
            maxSize={5}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default StaffPhotoSection;
