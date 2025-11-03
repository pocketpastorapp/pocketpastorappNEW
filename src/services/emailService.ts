
import { supabase } from "@/integrations/supabase/client";

export interface EmailData {
  name?: string;
  resetLink?: string;
  title?: string;
  verse?: string;
  reference?: string;
  content?: string;
  reflection?: string;
  appUrl?: string;
}

export type EmailTemplate = 'welcome' | 'password-reset' | 'devotional' | 'verse-of-day' | 'account-deletion';

export class EmailService {
  static async sendEmail(
    to: string, 
    template: EmailTemplate, 
    data: EmailData = {}
  ): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      // Add the current app URL to the data
      const emailData = {
        ...data,
        appUrl: window.location.origin
      };

      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          template,
          data: emailData
        }
      });

      if (error) {
        console.error('Email service error:', error);
        return { success: false, error: error.message };
      }

      return response;
    } catch (error) {
      console.error('Email sending failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async sendWelcomeEmail(to: string, name?: string) {
    return this.sendEmail(to, 'welcome', { name });
  }

  static async sendPasswordResetEmail(to: string, resetLink: string) {
    return this.sendEmail(to, 'password-reset', { resetLink });
  }

  static async sendDevotionalEmail(
    to: string, 
    title: string, 
    content: string, 
    verse?: string, 
    reference?: string
  ) {
    return this.sendEmail(to, 'devotional', { 
      title, 
      content, 
      verse, 
      reference 
    });
  }

  static async sendVerseOfDayEmail(
    to: string, 
    verse: string, 
    reference: string, 
    reflection?: string
  ) {
    return this.sendEmail(to, 'verse-of-day', { 
      verse, 
      reference, 
      reflection 
    });
  }

  static async sendAccountDeletionEmail(to: string, name?: string) {
    return this.sendEmail(to, 'account-deletion', { name });
  }
}
