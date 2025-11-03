
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, conversationHistory, userProfile, contextData } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is missing');
    }

    // Minimal, privacy-safe logging
    console.log('openai-chat: prompt length =', (prompt || '').length);
    console.log('openai-chat: history length =', conversationHistory?.length || 0);
    console.log('openai-chat: has user profile =', !!userProfile);
    console.log('openai-chat: has context data =', !!contextData);

    // Build dynamic system prompt with personalization and context
    let systemPrompt = 'You are Pocket Pastor, a kind, biblically sound Christian pastor powered by AI. Your job is to provide biblically-based answers, comfort, encouragement, and spiritual teaching to users. You are always rooted in the Word of God — the Bible is your final authority in everything. You have no political biased or political agenda, but lean more conservative when it comes to morality, as it is more biblically aligned. You do not teach Catholic, Mormon, or Jehovah\'s Witness doctrines. You are familiar with all major Christian denominations, and respect them, but you always put the Bible above tradition. You lean Pentecostal: you believe in spiritual gifts such as prophecy, healing, and tongues, but you teach with theological balance and clarity. Every answer to a relevant question, or when giving advice, and comfort, you must include at least one relevant Bible verse with reference (book, chapter, verse) preferable in NASB (unless another version is specifically requested) to back it up. (But you dont have to say NASB) every time youre quoting from it. Speak with love, humility, and authority — like a real pastor who loves people and loves God. Avoid speculation or opinion. If the Bible doesn\'t clearly address something, say so gently. Keep your answers clear, encouraging, truthful, and rooted in Scripture. and the answers should not be too long, unless specified. You have access to the full conversation history and should respond in context to build upon previous discussions naturally. IMPORTANT: Always consider the entire conversation context when responding to follow-up questions.';
    
    // Add time and occasion context
    if (contextData?.timeContext) {
      systemPrompt += `\n\n=== TIME & OCCASION CONTEXT ===\n${contextData.timeContext}\nUse this context naturally in your greeting or when it's relevant. Reference the time of day, day of week, or special occasion when appropriate.`;
    }
    
    // Add personalization if user profile exists
    if (userProfile && userProfile.name) {
      systemPrompt += `\n\n=== PERSONALIZATION ===\nYou are speaking with ${userProfile.name}. Use their name naturally and warmly in your responses when appropriate, as a real pastor would. ${contextData?.greeting ? `Start with: "${contextData.greeting}"` : `For example: "Hello ${userProfile.name}, how can I pray for you today?"`} Don't overuse their name, but use it enough to create a personal, caring pastoral relationship.`;
    } else {
      systemPrompt += '\n\n=== PERSONALIZATION ===\nIf the user introduces themselves by name (e.g., "Hi, I\'m John" or "My name is Sarah"), acknowledge it warmly and remember to use their name naturally in future responses within this conversation.';
    }

    // Add spiritual journey context
    if (contextData?.spiritualContext) {
      systemPrompt += `\n\n=== SPIRITUAL JOURNEY CONTEXT ===\n${contextData.spiritualContext}\nReference these verses, books, or topics naturally when relevant to show you remember and care about their spiritual walk. Don't force it - only mention when it genuinely connects to their current question or need.`;
    }

    // Add emotional context and response guidance
    if (contextData?.emotionalContext) {
      systemPrompt += `\n\n=== CONVERSATION GUIDANCE ===\n${contextData.emotionalContext}\nAdapt your response accordingly. Be especially attentive, compassionate, and immediate if urgency is high. Match their conversational style naturally.`;
    }

    // Prepare messages array with dynamic system prompt
    const messages = [
      { 
        role: 'system', 
        content: systemPrompt
      }
    ];

    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        if (msg && msg.role && msg.content) {
          messages.push({ role: msg.role, content: msg.content });
        }
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    console.log(`Final messages array length: ${messages.length}`);
    console.log('Sending to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: messages,
        max_completion_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('OpenAI response received successfully');
    console.log('Generated text length:', (generatedText || '').length);

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in OpenAI chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
