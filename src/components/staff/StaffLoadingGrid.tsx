
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const StaffLoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="card-elevated bg-card border-border/50 overflow-hidden">
          <CardHeader className="pb-4 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="h-12 w-12 sm:h-16 sm:w-16 bg-muted rounded-full loading-shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="h-4 sm:h-5 bg-muted rounded loading-shimmer w-3/4" />
                  <div className="h-3 sm:h-4 bg-muted/70 rounded loading-shimmer w-1/2" />
                </div>
              </div>
              <div className="h-5 sm:h-6 bg-muted rounded-full loading-shimmer w-12 sm:w-16 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-muted/70 rounded loading-shimmer w-2/3" />
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <div className="h-5 sm:h-6 bg-muted rounded loading-shimmer w-16 sm:w-20" />
                <div className="h-5 sm:h-6 bg-muted rounded loading-shimmer w-20 sm:w-24" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 sm:pt-4 border-t border-border/30">
              <div className="h-8 sm:h-9 bg-muted rounded loading-shimmer w-14 sm:w-16" />
              <div className="h-8 sm:h-9 bg-muted rounded loading-shimmer w-16 sm:w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StaffLoadingGrid;
