
import { supabase } from "@/integrations/supabase/client";
import { BibleAPIError } from './types';

export class BibleAPIClient {
  async callBibleAPI(endpoint: string, params?: Record<string, string>) {
    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        body: { endpoint, params }
      });

      if (error) {
        // Handle specific error cases based on the API documentation
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          throw new BibleAPIError(
            'Bible API key is missing, invalid, or unauthorized. Please check your API configuration.',
            401
          );
        }
        
        if (error.message.includes('403') || error.message.includes('forbidden')) {
          throw new BibleAPIError(
            'Your API key is not authorized to access this Bible resource.',
            403
          );
        }
        
        if (error.message.includes('404') || error.message.includes('not found')) {
          throw new BibleAPIError(
            'The requested Bible resource was not found.',
            404
          );
        }
        
        if (error.message.includes('400') || error.message.includes('invalid')) {
          throw new BibleAPIError(
            'Invalid request. Please check the Bible version or chapter selection.',
            400
          );
        }

        throw new BibleAPIError(`Bible API error: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof BibleAPIError) {
        throw error;
      }
      
      // Handle network or other unexpected errors
      throw new BibleAPIError(
        'Unable to connect to Bible service. Please check your internet connection and try again.'
      );
    }
  }
}

export const bibleAPIClient = new BibleAPIClient();
