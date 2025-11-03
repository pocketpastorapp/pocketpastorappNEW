
import { supabase } from '@/integrations/supabase/client';

// Generate a unique filename for the audio file
export const generateAudioFilename = (messageId: string): string => {
  return `message_${messageId}.mp3`;
};

// Check if audio file exists in storage and return a signed URL if so
export const checkAudioExists = async (filename: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('audio_cache')
      .createSignedUrl(filename, 60 * 15); // 15 minutes

    if (error) {
      console.log('Audio not found or cannot create signed URL:', error.message);
      return null;
    }

    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error checking audio existence:', error);
    return null;
  }
};

// Store audio in Supabase storage
export const storeAudio = async (audioBase64: string, filename: string): Promise<string | null> => {
  try {
    // Convert base64 to Blob
    const binaryString = atob(audioBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes.buffer], { type: 'audio/mp3' });
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('audio_cache')
      .upload(filename, blob, {
        contentType: 'audio/mp3',
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error("Error storing audio:", error);
      return null;
    }
    
    // Create a signed URL for the uploaded file
    const { data: signed } = await supabase
      .storage
      .from('audio_cache')
      .createSignedUrl(filename, 60 * 60); // 1 hour
    
    return signed?.signedUrl || null;
  } catch (error) {
    console.error("Error storing audio:", error);
    return null;
  }
};
