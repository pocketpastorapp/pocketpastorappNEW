
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SaveIcon, X } from "lucide-react";
import { toast } from "sonner";

interface NoteFormProps {
  onSaveNote: (content: string, title?: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const NoteForm = ({ onSaveNote, onCancel, isLoading }: NoteFormProps) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    await onSaveNote(content, title.trim() || undefined);
    setContent("");
    setTitle("");
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-medium"
        disabled={isLoading}
      />
      <Textarea
        placeholder="Type your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-none"
        disabled={isLoading}
      />
      <div className="flex space-x-2">
        <Button 
          onClick={handleSubmit}
          className="gap-2"
          style={{ backgroundColor: "#184482" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <SaveIcon className="h-4 w-4" />
          )}
          Save
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="gap-2"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
};
