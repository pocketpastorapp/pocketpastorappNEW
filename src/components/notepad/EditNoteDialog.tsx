
import { useEffect, useState } from "react";
import { Note } from "@/types/note-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SaveIcon, X } from "lucide-react";
import { toast } from "sonner";

interface EditNoteDialogProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, content: string, title?: string) => Promise<void>;
  isLoading: boolean;
}

export const EditNoteDialog = ({ note, isOpen, onClose, onSave, isLoading }: EditNoteDialogProps) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  // Update form when note changes
  useEffect(() => {
    if (note) {
      setContent(note.content);
      setTitle(note.title || "");
    }
  }, [note]);

  const handleSubmit = async () => {
    if (!note) return;

    if (!content.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    await onSave(note.id, content, title.trim() || undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-medium focus-visible:ring-pastor-navy"
            disabled={isLoading}
          />
          <Textarea
            placeholder="Type your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none focus-visible:ring-pastor-navy"
            style={{ "--pastor-navy": "#184482" } as React.CSSProperties}
            disabled={isLoading}
          />
          <div className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="gap-2"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
