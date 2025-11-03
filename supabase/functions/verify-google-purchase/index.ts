import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Credit amounts for each product SKU
const PRODUCT_CREDITS = {
  "pocket_pastor_credits_small": 30,
  "pocket_pastor_credits_medium": 150,
  "pocket_pastor_credits_large": 500,
};

const PRODUCT_PRICES = {
  "pocket_pastor_credits_small": 2.99,
  "pocket_pastor_credits_medium": 9.99,
  "pocket_pastor_credits_large": 29.99,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { purchaseToken, orderId, packageSku } = await req.json();

    if (!purchaseToken || !orderId || !packageSku) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing purchaseToken, orderId, or packageSku" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Verifying Google purchase for user ${user.id}, order: ${orderId}, product: ${packageSku}`);

    // Check for duplicate order
    const { data: existingPurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("checkout_session_id", orderId)
      .single();

    if (existingPurchase) {
      console.log(`Duplicate order detected: ${orderId}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Purchase already processed",
          duplicate: true 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Google Play credentials from environment
    const googleServiceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!googleServiceAccountKey) {
      console.error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Google Play verification not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceAccount = JSON.parse(googleServiceAccountKey);

    // Get OAuth2 access token from Google
    const jwtHeader = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const jwtClaimSet = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/androidpublisher",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };
    const jwtClaimSetEncoded = btoa(JSON.stringify(jwtClaimSet));

    // Note: For production, you'll need to implement proper JWT signing with RS256
    // This is a simplified example - consider using a JWT library
    const jwtUnsigned = `${jwtHeader}.${jwtClaimSetEncoded}`;
    
    // For now, we'll use a simpler verification approach
    // In production, implement full OAuth2 flow with RS256 signing
    
    const packageName = "com.pocketpastor.app";
    
    // Verify purchase with Google Play Developer API
    const googleApiUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${packageSku}/tokens/${purchaseToken}`;

    // Note: This is a placeholder - implement proper OAuth2 token generation
    const accessToken = Deno.env.get("GOOGLE_PLAY_ACCESS_TOKEN");
    
    if (!accessToken) {
      console.error("GOOGLE_PLAY_ACCESS_TOKEN not configured");
      return new Response(
        JSON.stringify({ 
          error: "Google Play verification not fully configured. Please set GOOGLE_PLAY_ACCESS_TOKEN or implement OAuth2 flow." 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const googleResponse = await fetch(googleApiUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!googleResponse.ok) {
      console.error("Google Play verification failed:", await googleResponse.text());
      return new Response(
        JSON.stringify({ error: "Purchase verification failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verificationResult = await googleResponse.json();

    // Check if purchase is valid
    if (verificationResult.purchaseState !== 0) {
      console.error("Purchase is not in purchased state:", verificationResult.purchaseState);
      return new Response(
        JSON.stringify({ error: "Purchase is not valid" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify order ID matches
    if (verificationResult.orderId !== orderId) {
      console.error(`Order ID mismatch: expected ${orderId}, got ${verificationResult.orderId}`);
      return new Response(
        JSON.stringify({ error: "Order ID mismatch" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const credits = PRODUCT_CREDITS[packageSku as keyof typeof PRODUCT_CREDITS];
    const price = PRODUCT_PRICES[packageSku as keyof typeof PRODUCT_PRICES];

    if (!credits || !price) {
      console.error(`Unknown product SKU: ${packageSku}`);
      return new Response(
        JSON.stringify({ error: "Unknown product SKU" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert purchase record
    const { error: insertError } = await supabase
      .from("purchases")
      .insert({
        user_id: user.id,
        checkout_session_id: orderId,
        credits_purchased: credits,
        amount_usd: price,
        status: "completed",
      });

    if (insertError) {
      console.error("Error inserting purchase:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to record purchase" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Purchase recorded: ${credits} credits for $${price}`);

    // Call increment-credits function
    const { data: incrementData, error: incrementError } = await supabase.functions.invoke(
      "increment-credits",
      {
        body: { userId: user.id, credits },
      }
    );

    if (incrementError) {
      console.error("Error incrementing credits:", incrementError);
      return new Response(
        JSON.stringify({ error: "Failed to add credits" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Credits incremented successfully:`, incrementData);

    return new Response(
      JSON.stringify({
        success: true,
        credits,
        newTotal: incrementData.newTotal,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in verify-google-purchase:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
