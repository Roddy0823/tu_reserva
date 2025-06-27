
import { Card, CardContent } from '@/components/ui/card';

const LoadingStaffSelection = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 text-lg">Verificando personal especializado...</p>
      </CardContent>
    </Card>
  );
};

export default LoadingStaffSelection;
