
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { Note } from "@/types/note-types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  // Load notes when authentication state changes
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      
      try {
        if (isAuthenticated && user) {
          console.log("Fetching notes for authenticated user:", user.id);
          const { data, error } = await supabase
            .from('user_notes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error("Error fetching notes:", error);
            toast.error("Failed to load your notes");
            setNotes([]);
          } else if (data) {
            console.log("Notes fetched successfully:", data.length);
            const formattedNotes = data.map(note => ({
              id: note.id,
              content: note.content,
              title: note.title || undefined,
              createdAt: new Date(note.created_at)
            }));
            setNotes(formattedNotes);
          }
        } else {
          console.log("Using localStorage for notes (user not authenticated)");
          // Fallback to localStorage for non-authenticated users
          const savedNotes = localStorage.getItem("pocketPastorNotes");
          if (savedNotes) {
            try {
              const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
                ...note,
                createdAt: new Date(note.createdAt)
              }));
              setNotes(parsedNotes);
            } catch (error) {
              console.error("Error parsing saved notes:", error);
              setNotes([]);
            }
          } else {
            setNotes([]);
          }
        }
      } catch (e) {
        console.error("Exception in fetchNotes:", e);
        toast.error("Something went wrong loading your notes");
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user, isAuthenticated]);

  // Save notes to localStorage when they change (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Saving notes to localStorage:", notes.length);
      localStorage.setItem("pocketPastorNotes", JSON.stringify(notes));
    }
  }, [notes, isAuthenticated]);

  const saveNote = async (content: string, title?: string) => {
    if (notes.length >= 20) {
      toast.error("You can only save up to 20 notes");
      return;
    }

    setIsLoading(true);
    
    const noteId = uuidv4();
    const timestamp = new Date();
    
    const newNote: Note = {
      id: noteId,
      content,
      title,
      createdAt: timestamp
    };

    if (isAuthenticated && user) {
      try {
        console.log("Saving note to Supabase for user:", user.id);
        const { error } = await supabase
          .from('user_notes')
          .insert({
            id: noteId,
            user_id: user.id,
            content,
            title
          });

        if (error) {
          console.error("Error saving note:", error);
          toast.error("Failed to save your note");
          setIsLoading(false);
          return;
        }
        
        console.log("Note saved successfully to Supabase");
      } catch (error) {
        console.error("Error in note save:", error);
        toast.error("Failed to save your note");
        setIsLoading(false);
        return;
      }
    } else {
      console.log("Saving note to localStorage only");
    }

    setNotes([newNote, ...notes]);
    setIsLoading(false);
    toast.success("Note saved successfully!");
  };

  const updateNote = async (id: string, content: string, title?: string) => {
    setIsLoading(true);
    
    try {
      if (isAuthenticated && user) {
        console.log("Updating note in Supabase:", id);
        const { error } = await supabase
          .from('user_notes')
          .update({
            content,
            title,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) {
          console.error("Error updating note:", error);
          toast.error("Failed to update your note");
          setIsLoading(false);
          return;
        }
        
        console.log("Note updated successfully in Supabase");
      }

      // Update notes in local state
      const updatedNotes = notes.map(note => 
        note.id === id ? { ...note, content, title, updatedAt: new Date() } : note
      );
      
      setNotes(updatedNotes);
      toast.success("Note updated successfully!");
    } catch (error) {
      console.error("Error in note update:", error);
      toast.error("Failed to update your note");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    setIsLoading(true);
    
    if (isAuthenticated && user) {
      try {
        console.log("Deleting note from Supabase:", id);
        const { error } = await supabase
          .from('user_notes')
          .delete()
          .eq('id', id);

        if (error) {
          console.error("Error deleting note:", error);
          toast.error("Failed to delete your note");
          setIsLoading(false);
          return;
        }
        
        console.log("Note deleted successfully from Supabase");
      } catch (error) {
        console.error("Error in note deletion:", error);
        toast.error("Failed to delete your note");
        setIsLoading(false);
        return;
      }
    }

    setNotes(notes.filter(note => note.id !== id));
    setIsLoading(false);
    toast.success("Note deleted");
  };

  return {
    notes,
    isLoading,
    saveNote,
    updateNote,
    deleteNote,
    formatDate
  };
};
