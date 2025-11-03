
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  disclaimer_accepted: boolean;
  gender: string | null;
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Fetch profile data if user is logged in
        if (currentSession?.user) {
          // Using setTimeout to avoid potential deadlocks with Supabase client
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession ? "Session exists" : "No session");
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        console.log("Profile fetched:", data);
        setProfile(data);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const updateDisclaimerAcceptance = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ disclaimer_accepted: true })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating disclaimer acceptance:", error);
        throw error;
      }

      // Update local profile state
      setProfile(prev => prev ? { ...prev, disclaimer_accepted: true } : null);
      return true;
    } catch (error) {
      console.error("Failed to update disclaimer acceptance:", error);
      return false;
    }
  };

  return {
    user,
    profile,
    session,
    isLoading,
    setIsLoading,
    updateDisclaimerAcceptance,
  };
};
