
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { useNotes } from "@/hooks/useNotes";
import { NoteForm } from "./NoteForm";
import { NoteList } from "./NoteList";
import { EditNoteDialog } from "./EditNoteDialog";
import { Note } from "@/types/note-types";
import ErrorBoundary from "@/components/ErrorBoundary";

const NotepadSectionContent = () => {
  console.log("NotepadSection rendering...");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { theme } = useTheme();
  const { notes, isLoading, saveNote, updateNote, deleteNote, formatDate } = useNotes();

  console.log("NotepadSection state:", { notesCount: notes?.length, isLoading });

  const handleSaveNote = async (content: string, title?: string) => {
    try {
      console.log("Saving note:", { content, title });
      await saveNote(content, title);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleEditNote = (note: Note) => {
    console.log("Editing note:", note.id);
    setEditingNote(note);
  };

  const handleUpdateNote = async (id: string, content: string, title?: string) => {
    try {
      console.log("Updating note:", { id, content, title });
      await updateNote(id, content, title);
      setEditingNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCancelEdit = () => {
    console.log("Canceling edit");
    setIsEditing(false);
  };

  const handleCloseEditDialog = () => {
    console.log("Closing edit dialog");
    setEditingNote(null);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <span className="mr-2">📝</span> Your Notepad
          <span className="ml-auto text-xs text-muted-foreground">
            {notes?.length || 0}/20 notes
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <NoteForm 
            onSaveNote={handleSaveNote}
            onCancel={handleCancelEdit}
            isLoading={isLoading}
          />
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="w-full"
            disabled={isLoading}
          >
            + Add Note
          </Button>
        )}

        <NoteList
          notes={notes || []}
          onDeleteNote={deleteNote}
          onEditNote={handleEditNote}
          isLoading={isLoading}
          formatDate={formatDate}
          theme={theme}
        />

        <EditNoteDialog 
          note={editingNote}
          isOpen={!!editingNote}
          onClose={handleCloseEditDialog}
          onSave={handleUpdateNote}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export const NotepadSection = () => {
  return (
    <ErrorBoundary>
      <NotepadSectionContent />
    </ErrorBoundary>
  );
};
