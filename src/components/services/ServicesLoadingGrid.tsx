
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ServicesLoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="card-elevated bg-card border-border/50 overflow-hidden">
          <CardHeader className="pb-4 p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-5 sm:h-6 bg-muted rounded loading-shimmer w-3/4"></div>
              <div className="h-3 sm:h-4 bg-muted/70 rounded loading-shimmer w-1/2"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-muted/70 rounded loading-shimmer w-full"></div>
              <div className="h-3 sm:h-4 bg-muted/70 rounded loading-shimmer w-2/3"></div>
              <div className="h-7 sm:h-8 bg-muted rounded loading-shimmer w-20 sm:w-24"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServicesLoadingGrid;
