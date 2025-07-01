
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const StaffLoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="flex flex-wrap gap-1">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StaffLoadingGrid;
