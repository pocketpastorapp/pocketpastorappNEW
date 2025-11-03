
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This endpoint processes Stripe's webhook events
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  
  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!stripeSecret || !stripeWebhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2023-10-16",
    });
    
    // Initialize Supabase client with service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.warn("No Stripe signature found in request");
      return new Response(
        JSON.stringify({ error: "No Stripe signature found" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Get the raw request body
    const body = await req.text();
    
    // Construct the event using the async method
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`⚠️ Webhook signature verification failed: ${errorMessage}`);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${errorMessage}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Successfully constructed event
    console.log(`✅ Success! Webhook received: ${event.type}`);
    
    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(`Processing completed checkout session: ${session.id}`);
      
      // Check if checkout_session_id already exists in purchases table to prevent duplicates
      const { data: existingPurchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("checkout_session_id", session.id)
        .maybeSingle();
      
      if (existingPurchase) {
        console.log(`Purchase for session ${session.id} already processed`);
        return new Response(
          JSON.stringify({ received: true, status: "already processed" }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Extract user_id and credits from session metadata
      const { user_id, credits, package_id } = session.metadata;
      
      if (!user_id || !credits) {
        console.error("Missing user_id or credits in session metadata");
        return new Response(
          JSON.stringify({ error: "Invalid session metadata" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Add purchase record
      const { error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          user_id,
          credits_purchased: parseInt(credits),
          amount_usd: session.amount_total / 100, // Convert cents to dollars
          checkout_session_id: session.id,
          status: "completed",
        });
        
      if (purchaseError) {
        console.error(`Error recording purchase: ${purchaseError.message}`);
        return new Response(
          JSON.stringify({ error: `Database error: ${purchaseError.message}` }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Call the increment-credits function to update the user's credits
      const incrementResponse = await fetch(
        `${supabaseUrl}/functions/v1/increment-credits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            userId: user_id,
            credits: parseInt(credits),
          }),
        }
      );
      
      if (!incrementResponse.ok) {
        const errorData = await incrementResponse.json();
        console.error(`Error incrementing credits: ${JSON.stringify(errorData)}`);
        return new Response(
          JSON.stringify({ error: `Failed to increment credits: ${errorData.error}` }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      console.log(`Successfully processed payment for session ${session.id}`);
      return new Response(
        JSON.stringify({ received: true, status: "success" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Return a response to acknowledge receipt of the event
    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error processing webhook: ${errorMessage}`);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
