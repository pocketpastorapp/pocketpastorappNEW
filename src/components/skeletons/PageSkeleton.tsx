
import { Skeleton } from "@/components/ui/skeleton";

export const HeaderSkeleton = () => (
  <div className="border-b bg-background p-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <HeaderSkeleton />
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-8 w-48" />
      <GridSkeleton />
    </div>
  </div>
);
