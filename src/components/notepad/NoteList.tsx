
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/types/note-types";
import { NoteCard } from "./NoteCard";

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: string) => Promise<void>;
  onEditNote: (note: Note) => void;
  isLoading: boolean;
  formatDate: (date: Date) => string;
  theme: string | undefined;
}

export const NoteList = ({ 
  notes, 
  onDeleteNote, 
  onEditNote,
  isLoading, 
  formatDate, 
  theme 
}: NoteListProps) => {
  if (isLoading && notes.length === 0) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  if (notes.length === 0) {
    return null;
  }

  return (
    <ScrollArea className={`h-[300px] p-1 ${theme === "dark" ? "custom-scrollbar-dark" : "custom-scrollbar-light"}`}>
      <div className="space-y-2">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={onDeleteNote}
            onEdit={onEditNote}
            formatDate={formatDate}
            theme={theme}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
