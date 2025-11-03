
import { Skeleton } from "@/components/ui/skeleton";

export const BibleNavigationSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="flex gap-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
    <Skeleton className="h-6 w-32" />
  </div>
);

export const BibleContentSkeleton = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-6 w-48 mb-6" />
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-6" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const BibleSearchSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-10 w-full mb-6" />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </div>
);
