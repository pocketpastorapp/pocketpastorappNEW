
import { supabase } from '@/integrations/supabase/client';
import { generateAudioFilename, checkAudioExists, storeAudio } from './cachingService';
import { SpeechGenerationResult } from './speechTypes';
import { defaultVoice } from './voiceOptions';

// Call Google Cloud TTS through our Supabase Edge Function
export const generateSpeech = async (
  text: string, 
  messageId: string, 
  voiceId = defaultVoice.id
): Promise<SpeechGenerationResult> => {
  try {
    // Remove scripture references in brackets for cleaner speech
    const cleanText = text.replace(/\[([\w\s\d:,-]+)\]/g, "");
    
    // Check if we have cached audio for this message
    const filename = generateAudioFilename(messageId);
    const cachedUrl = await checkAudioExists(filename);
    
    if (cachedUrl) {
      console.log("Using cached audio file:", cachedUrl);
      // Fetch the audio file to get its buffer
      const response = await fetch(cachedUrl);
      const buffer = await response.arrayBuffer();
      
      return { url: cachedUrl, buffer };
    }
    
    console.log(`Generating speech for: "${cleanText.substring(0, 30)}..."`, `using voice: ${voiceId}`);
    
    const response = await supabase.functions.invoke('google-tts', {
      body: { 
        text: cleanText,
        messageId
      }
    });
    
    if (response.error) {
      console.error("Error generating speech:", response.error);
      throw new Error(response.error.message || "Failed to generate speech");
    }
    
    // Convert the base64 string to ArrayBuffer and create a Blob URL for immediate playback
    const binaryString = atob(response.data.audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes.buffer], { type: 'audio/mp3' });
    const objectUrl = URL.createObjectURL(blob);

    // Store the audio in Supabase Storage in the background for future reuse
    // Do not await to avoid delaying playback
    storeAudio(response.data.audioContent, filename)
      .then((audioUrl) => {
        if (audioUrl) {
          console.log('Audio cached to:', audioUrl);
        } else {
          console.warn('Audio caching returned null URL');
        }
      })
      .catch((err) => {
        console.error('Background audio store failed:', err);
      });
    
    return { url: objectUrl, buffer: bytes.buffer };
  } catch (error) {
    console.error("Error in generateSpeech:", error);
    throw error;
  }
};

// Prefetch and cache speech without affecting current playback
export const prefetchSpeech = async (
  text: string,
  messageId: string
): Promise<void> => {
  try {
    const cleanText = text.replace(/\[([\w\s\d:,-]+)\]/g, "");
    const filename = generateAudioFilename(messageId);

    // Skip if already cached
    const cached = await checkAudioExists(filename);
    if (cached) return;

    const response = await supabase.functions.invoke('google-tts', {
      body: {
        text: cleanText,
        messageId,
      },
    });

    if (response.error) {
      console.error('Error prefetching speech:', response.error);
      return;
    }

    const audioUrl = await storeAudio(response.data.audioContent, filename);
    if (audioUrl) {
      console.log('Prefetched audio cached at:', audioUrl);
    }
  } catch (err) {
    console.error('Prefetch speech failed:', err);
  }
};
