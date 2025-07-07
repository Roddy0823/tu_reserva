
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const StaffLoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="card-elevated bg-card border-border/50 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-muted rounded-full loading-shimmer" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-muted rounded loading-shimmer w-3/4" />
                  <div className="h-4 bg-muted/70 rounded loading-shimmer w-1/2" />
                </div>
              </div>
              <div className="h-6 bg-muted rounded-full loading-shimmer w-16" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="h-4 bg-muted/70 rounded loading-shimmer w-2/3" />
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-muted rounded loading-shimmer w-20" />
                <div className="h-6 bg-muted rounded loading-shimmer w-24" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-border/30">
              <div className="h-9 bg-muted rounded loading-shimmer w-16" />
              <div className="h-9 bg-muted rounded loading-shimmer w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StaffLoadingGrid;
