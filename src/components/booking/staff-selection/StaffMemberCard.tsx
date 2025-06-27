
import { StaffMember, Service } from '@/types/database';
import { User, ArrowLeft } from 'lucide-react';

interface StaffMemberCardProps {
  staff: StaffMember;
  service: Service;
  onSelect: (staff: StaffMember) => void;
}

const StaffMemberCard = ({ staff, service, onSelect }: StaffMemberCardProps) => {
  return (
    <div
      className="border border-slate-200 rounded-lg p-4 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer group"
      onClick={() => onSelect(staff)}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 transition-all">
          {staff.photo_url ? (
            <img 
              src={staff.photo_url} 
              alt={staff.full_name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <User className="h-7 w-7 text-slate-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{staff.full_name}</h3>
          {staff.email && (
            <p className="text-slate-600 text-sm">{staff.email}</p>
          )}
          <p className="text-xs text-green-600 mt-1 font-medium">
            ✓ Especialista certificado en {service.name}
          </p>
        </div>
        <div className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowLeft className="h-5 w-5 rotate-180" />
        </div>
      </div>
    </div>
  );
};

export default StaffMemberCard;
