import { supabase } from "@/integrations/supabase/client";

/**
 * Service to detect when users introduce themselves and update their profile
 */

// Common patterns for name introductions
const NAME_PATTERNS = [
  /(?:my name is|i'm|im|i am|call me|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  /^([A-Z][a-z]+)(?:\s+here)?[.,!]?\s*$/i, // Simple "John here" or just "John"
];

/**
 * Extract a name from a user message if they're introducing themselves
 */
export const extractNameFromMessage = (message: string): string | null => {
  const trimmed = message.trim();
  
  for (const pattern of NAME_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      // Extract and clean the name
      const name = match[1].trim();
      
      // Basic validation: should be 2-50 characters, letters and spaces only
      if (name.length >= 2 && name.length <= 50 && /^[A-Za-z\s]+$/.test(name)) {
        return name;
      }
    }
  }
  
  return null;
};

/**
 * Update user profile with extracted name
 */
export const updateUserNameIfDetected = async (
  message: string,
  userId: string,
  currentName?: string
): Promise<boolean> => {
  // Don't extract if user already has a name
  if (currentName) {
    return false;
  }
  
  const extractedName = extractNameFromMessage(message);
  
  if (!extractedName) {
    return false;
  }
  
  console.log(`Detected name introduction: "${extractedName}"`);
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ name: extractedName })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user name:', error);
      return false;
    }
    
    console.log(`Successfully updated user profile with name: ${extractedName}`);
    return true;
  } catch (error) {
    console.error('Error updating user name:', error);
    return false;
  }
};
