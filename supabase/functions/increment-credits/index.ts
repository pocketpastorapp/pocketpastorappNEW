
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { userId, credits } = await req.json();
    
    if (!userId || !credits) {
      return new Response(
        JSON.stringify({ error: "userId and credits are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get current user credits
    const { data: currentCredits, error: fetchError } = await supabase
      .from("user_credits")
      .select("total_credits")
      .eq("user_id", userId)
      .single();
    
    if (fetchError) {
      return new Response(
        JSON.stringify({ error: `Error fetching credits: ${fetchError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate new total
    const newTotal = (currentCredits?.total_credits || 0) + credits;
    
    // Update user credits
    const { error: updateError } = await supabase
      .from("user_credits")
      .update({ total_credits: newTotal })
      .eq("user_id", userId);
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Error updating credits: ${updateError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, newTotal }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error incrementing credits: ${errorMessage}`);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
