
import { Button } from "@/components/ui/button";
import { Note } from "@/types/note-types";
import { MoreHorizontal, Pencil } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => Promise<void>;
  onEdit: (note: Note) => void;
  formatDate: (date: Date) => string;
  theme: string | undefined;
}

export const NoteCard = ({ note, onDelete, onEdit, formatDate, theme }: NoteCardProps) => {
  const { theme: currentTheme } = useTheme();
  
  return (
    <div 
      className={`p-3 rounded-md border relative group ${
        theme === "dark" ? "bg-card hover:bg-muted/50" : "bg-white hover:bg-muted/10"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        {note.title && (
          <h3 className="font-bold text-base pr-5">{note.title}</h3>
        )}
        <div className={`${note.title ? '' : 'ml-auto'}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-36"
              style={currentTheme === "dark" ? { backgroundColor: '#1E1E1E' } : undefined}
            >
              <DropdownMenuItem 
                className="cursor-pointer flex items-center"
                onClick={() => onEdit(note)}
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit note
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => onDelete(note.id)}
              >
                Delete note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <p className="text-sm whitespace-pre-wrap break-words">{note.content}</p>
    </div>
  );
};
