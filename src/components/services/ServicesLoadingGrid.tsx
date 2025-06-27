
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ServicesLoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServicesLoadingGrid;
