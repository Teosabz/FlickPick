import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-[2/3] w-full bg-white/20 animate-pulse" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4 bg-white/20 animate-pulse" />
              <Skeleton className="h-3 w-1/2 bg-white/20 animate-pulse" />
              <Skeleton className="h-3 w-full bg-white/20 animate-pulse" />
              <Skeleton className="h-3 w-2/3 bg-white/20 animate-pulse" />
              <Skeleton className="h-8 w-full mt-2 bg-white/20 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}