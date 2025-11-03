
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  template: 'welcome' | 'password-reset' | 'devotional' | 'verse-of-day' | 'account-deletion';
  data?: Record<string, any>;
}

const getEmailTemplate = (template: string, data: Record<string, any> = {}) => {
  const baseStyle = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
  `;

  const headerStyle = `
    background: #184482;
    color: white;
    padding: 24px;
    text-align: center;
  `;

  const contentStyle = `
    padding: 32px 24px;
    line-height: 1.6;
    color: #333;
  `;

  const footerStyle = `
    background: #f8f9fa;
    padding: 16px 24px;
    text-align: center;
    font-size: 14px;
    color: #666;
  `;

  switch (template) {
    case 'welcome':
      return {
        subject: 'Welcome to Pocket Pastor! 🙏',
        html: `
          <div style="${baseStyle}">
            <div style="${headerStyle}">
              <h1 style="margin: 0; font-size: 28px;">Welcome to Pocket Pastor</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Your spiritual companion</p>
            </div>
            <div style="${contentStyle}">
              <h2 style="color: #184482;">Hello ${data.name || 'Friend'}! 👋</h2>
              <p>We're thrilled to have you join the Pocket Pastor community. Your spiritual journey just got a whole lot more enriching!</p>
              
              <h3 style="color: #184482;">What you can do with Pocket Pastor:</h3>
              <ul>
                <li><strong>Chat with AI Pastor:</strong> Get biblical guidance and spiritual counseling anytime</li>
                <li><strong>Read the Bible:</strong> Access multiple translations and versions</li>
                <li><strong>Save Favorites:</strong> Bookmark meaningful verses and conversations</li>
                <li><strong>Track History:</strong> Review your spiritual conversations and growth</li>
              </ul>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.appUrl || 'https://your-app-url.com'}/chat" style="background: #184482; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Your First Chat</a>
              </div>
              
              <p>May God bless your journey with us!</p>
            </div>
            <div style="${footerStyle}">
              <p>Pocket Pastor - Your digital spiritual companion</p>
              <p style="margin: 4px 0 0 0;">Bringing faith and wisdom to your daily life</p>
            </div>
          </div>
        `
      };

    case 'password-reset':
      return {
        subject: 'Reset Your Pocket Pastor Password 🔐',
        html: `
          <div style="${baseStyle}">
            <div style="${headerStyle}">
              <h1 style="margin: 0; font-size: 28px;">Password Reset</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Pocket Pastor</p>
            </div>
            <div style="${contentStyle}">
              <h2 style="color: #184482;">Reset Your Password</h2>
              <p>We received a request to reset your Pocket Pastor password. Click the button below to create a new password:</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.resetLink}" style="background: #184482; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
              </div>
              
              <p style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 12px; border-radius: 4px; margin: 16px 0;">
                <strong>Security Note:</strong> This link will expire in 1 hour for your security.
              </p>
              
              <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <p>Blessings,<br>The Pocket Pastor Team</p>
            </div>
            <div style="${footerStyle}">
              <p>Pocket Pastor - Your digital spiritual companion</p>
            </div>
          </div>
        `
      };

    case 'account-deletion':
      return {
        subject: 'Account Deletion Confirmation - Pocket Pastor 🙏',
        html: `
          <div style="${baseStyle}">
            <div style="${headerStyle}">
              <h1 style="margin: 0; font-size: 28px;">Account Deleted</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Pocket Pastor</p>
            </div>
            <div style="${contentStyle}">
              <h2 style="color: #184482;">Goodbye ${data.name || 'Friend'} 💔</h2>
              <p>We're sorry to see you go. Your Pocket Pastor account has been successfully deleted as requested.</p>
              
              <h3 style="color: #184482;">What has been removed:</h3>
              <ul>
                <li>All your chat conversations and spiritual guidance history</li>
                <li>Your favorite verses and biblical bookmarks</li>
                <li>Personal notes and scripture highlights</li>
                <li>Account preferences and customization settings</li>
                <li>Credits and subscription information</li>
              </ul>
              
              <p style="background: #e8f4fd; border: 1px solid #b3d7ff; padding: 12px; border-radius: 4px; margin: 16px 0;">
                <strong>Important:</strong> This action cannot be undone. All your data has been permanently removed from our servers.
              </p>
              
              <p>If you ever decide to return to your spiritual journey with us, you're always welcome to create a new account. We'll be here to support you.</p>
              
              <p>May God continue to bless you on your path, wherever it may lead.</p>
              
              <p>With love and blessings,<br>The Pocket Pastor Team</p>
            </div>
            <div style="${footerStyle}">
              <p>Thank you for being part of our community</p>
              <p style="margin: 4px 0 0 0;">Pocket Pastor - Your digital spiritual companion</p>
            </div>
          </div>
        `
      };

    case 'devotional':
      return {
        subject: `Daily Devotional: ${data.title || 'Spiritual Reflection'} 📖`,
        html: `
          <div style="${baseStyle}">
            <div style="${headerStyle}">
              <h1 style="margin: 0; font-size: 28px;">Daily Devotional</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style="${contentStyle}">
              <h2 style="color: #184482;">${data.title || 'Today\'s Reflection'}</h2>
              
              ${data.verse ? `
                <div style="background: #f8f9fa; border-left: 4px solid #184482; padding: 16px; margin: 24px 0; font-style: italic;">
                  <p style="margin: 0; font-size: 18px;">"${data.verse}"</p>
                  <p style="margin: 8px 0 0 0; font-weight: bold; color: #184482;">${data.reference || ''}</p>
                </div>
              ` : ''}
              
              ${data.content ? `<div>${data.content}</div>` : ''}
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.appUrl || 'https://your-app-url.com'}/chat" style="background: #184482; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reflect & Pray</a>
              </div>
            </div>
            <div style="${footerStyle}">
              <p>Daily devotionals delivered with love</p>
              <p style="margin: 4px 0 0 0;">Pocket Pastor - Your digital spiritual companion</p>
            </div>
          </div>
        `
      };

    case 'verse-of-day':
      return {
        subject: `Verse of the Day: ${data.reference || 'Scripture'} ✨`,
        html: `
          <div style="${baseStyle}">
            <div style="${headerStyle}">
              <h1 style="margin: 0; font-size: 28px;">Verse of the Day</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style="${contentStyle}">
              <div style="background: linear-gradient(135deg, #184482, #2563eb); color: white; padding: 32px; margin: 24px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 20px; line-height: 1.4; font-style: italic;">"${data.verse || 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.'}"</p>
                <p style="margin: 16px 0 0 0; font-weight: bold; font-size: 16px; opacity: 0.9;">${data.reference || 'Jeremiah 29:11'}</p>
              </div>
              
              ${data.reflection ? `
                <h3 style="color: #184482;">Today's Reflection</h3>
                <p>${data.reflection}</p>
              ` : ''}
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.appUrl || 'https://your-app-url.com'}/bible" style="background: #184482; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 8px;">Read More</a>
                <a href="${data.appUrl || 'https://your-app-url.com'}/chat" style="background: white; color: #184482; border: 2px solid #184482; padding: 10px 22px; text-decoration: none; border-radius: 6px; display: inline-block;">Discuss with AI Pastor</a>
              </div>
            </div>
            <div style="${footerStyle}">
              <p>Daily verses to inspire and guide you</p>
              <p style="margin: 4px 0 0 0;">Pocket Pastor - Your digital spiritual companion</p>
            </div>
          </div>
        `
      };

    default:
      throw new Error(`Unknown email template: ${template}`);
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, template, data = {} }: EmailRequest = await req.json();

    // Require authenticated user and ensure recipient matches the caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: authData, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !authData?.user?.email) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (to.toLowerCase() !== authData.user.email.toLowerCase()) {
      return new Response(JSON.stringify({ error: 'Forbidden: recipient mismatch' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Sending ${template} email to authenticated user`);

    const emailTemplate = getEmailTemplate(template, data);


    const emailResponse = await resend.emails.send({
      from: "Pocket Pastor <noreply@pocketpastorapp.com>",
      to: [to],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log("Email sent successfully from pocketpastorapp.com:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
});
