
import { Skeleton } from "@/components/ui/skeleton";

export const ChatMessageSkeleton = () => (
  <div className="mb-4">
    <div className="flex items-start gap-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  </div>
);

export const ChatListSkeleton = () => (
  <div className="space-y-4 p-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <ChatMessageSkeleton key={i} />
    ))}
  </div>
);

export const ChatInputSkeleton = () => (
  <div className="border-t bg-background p-4">
    <div className="flex gap-2">
      <Skeleton className="flex-1 h-10" />
      <Skeleton className="h-10 w-10" />
    </div>
  </div>
);
