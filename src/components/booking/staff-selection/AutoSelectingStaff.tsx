
import { Card, CardContent } from '@/components/ui/card';
import { StaffMember } from '@/types/database';

interface AutoSelectingStaffProps {
  staffMember: StaffMember;
}

const AutoSelectingStaff = ({ staffMember }: AutoSelectingStaffProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Especialista asignado automáticamente
          </h3>
          <p className="text-slate-600 mb-2">
            {staffMember.full_name} está especializado en este servicio
          </p>
          <p className="text-sm text-slate-500">
            Redirigiendo automáticamente...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoSelectingStaff;
