
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Define credit packages with live price IDs (update these with your actual live price IDs from Stripe)
const creditPackages = [
  { id: "small", priceId: "price_1SBOGVEfi4ZAkuQrMySWQBA3", credits: 20, name: "Small Package" }, // $1.99
  { id: "medium", priceId: "price_1SBOHEEfi4ZAkuQrsgTxswpr", credits: 80, name: "Medium Package" }, // $6.99
  { id: "large", priceId: "price_1SBOIzEfi4ZAkuQrLhJnAbrw", credits: 180, name: "Large Package" }, // $14.99
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user from auth header token
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { packageId } = await req.json();
    
    // Find selected package
    const selectedPackage = creditPackages.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      return new Response(
        JSON.stringify({ error: "Invalid package selected" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create checkout session
    console.log(`Creating checkout session for user ${user.id}, package ${packageId}`);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPackage.priceId, // Use the specific price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/credits?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/credits?canceled=true`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        credits: selectedPackage.credits,
        package_id: selectedPackage.id,
      },
    });

    console.log(`Created checkout session: ${session.id}`);
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error creating checkout session: ${errorMessage}`);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
