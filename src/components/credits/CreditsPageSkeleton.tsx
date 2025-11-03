
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonProps {
  onRetry: () => void;
}

const CreditsPageSkeleton = ({ onRetry }: SkeletonProps) => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export const CreditsPageError = ({ onRetry }: SkeletonProps) => {
  return (
    <div className="text-center py-8">
      <p>Unable to load credit information. Please try again later.</p>
      <Button onClick={onRetry} className="mt-4">Retry</Button>
    </div>
  );
};

export default CreditsPageSkeleton;
