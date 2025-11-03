
import { useState, useEffect } from "react";
import { ChatMessage } from "@/types/chat-types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export const useFavorites = (user: User | null) => {
  const [favorites, setFavorites] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);

  // Load favorites from database or localStorage
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      
      if (user) {
        // Load favorites from Supabase if user is authenticated
        try {
          const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_favorite', true)
            .order('timestamp', { ascending: false });
          
          if (error) {
            console.error("Error fetching favorites:", error);
            toast.error("Failed to load favorites");
          } else if (data) {
            setFavorites(data.map(msg => ({
              id: msg.id,
              content: msg.content,
              sender: msg.sender as "user" | "bot",
              timestamp: msg.timestamp,
              isFavorite: true
            })));
          }
        } catch (error) {
          console.error("Error in loadFavorites:", error);
        }
      } else {
        // Load favorites from localStorage for non-authenticated users
        const storedFavorites = JSON.parse(localStorage.getItem("pocketPastorFavorites") || "[]");
        setFavorites(storedFavorites);
      }
      
      setIsLoading(false);
    };
    
    loadFavorites();
  }, [user]);

  // Function to remove a favorite
  const removeFavorite = async (id: string) => {
    // Remove from UI
    const updatedFavorites = favorites.filter(message => message.id !== id);
    setFavorites(updatedFavorites);
    setSelectedMessage(null); // Close modal if open
    
    if (user) {
      // Update in Supabase if user is authenticated
      try {
        const { error } = await supabase
          .from('chat_messages')
          .update({ is_favorite: false })
          .eq('id', id);
        
        if (error) {
          console.error("Error removing favorite:", error);
          toast.error("Failed to remove favorite");
          // Revert UI change if save failed
          setFavorites(favorites);
          return;
        }
      } catch (error) {
        console.error("Error in removeFavorite:", error);
        // Revert UI change if save failed
        setFavorites(favorites);
        return;
      }
    } else {
      // Update localStorage for non-authenticated users
      localStorage.setItem("pocketPastorFavorites", JSON.stringify(updatedFavorites));
    }
    
    toast.success("Removed from favorites");
  };

  return {
    favorites,
    isLoading,
    selectedMessage,
    setSelectedMessage,
    removeFavorite
  };
};
