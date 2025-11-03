import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
interface SessionHeaderProps {
  title: string;
  onBack: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}
const SessionHeader = ({
  title,
  onBack,
  onDelete,
  isDeleting
}: SessionHeaderProps) => {
  return <div className="fixed top-16 left-0 right-0 z-20 bg-background pb-4 pt-2 border-b">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" onClick={onBack} className="mr-3 rounded-full aspect-square p-0 h-10 w-10 flex items-center justify-center" title="Back to History">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to History</span>
          </Button>
          <h1 className="text-xl font-bold line-clamp-1">{title}</h1>
        </div>
        
        <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full aspect-square p-0 h-10 w-10 flex items-center justify-center" onClick={onDelete} disabled={isDeleting} title="Delete conversation">
          {isDeleting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Trash2 className="h-4 w-4" />}
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>;
};
export default SessionHeader;