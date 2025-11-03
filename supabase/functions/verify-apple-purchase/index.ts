import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Credit amounts for each product ID
const PRODUCT_CREDITS = {
  "com.pocketpastor.credits.small": 30,
  "com.pocketpastor.credits.medium": 150,
  "com.pocketpastor.credits.large": 500,
};

const PRODUCT_PRICES = {
  "com.pocketpastor.credits.small": 2.99,
  "com.pocketpastor.credits.medium": 9.99,
  "com.pocketpastor.credits.large": 29.99,
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

    const { transactionId, receiptData, productId } = await req.json();

    if (!transactionId || !receiptData || !productId) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing transactionId, receiptData, or productId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Verifying Apple purchase for user ${user.id}, transaction: ${transactionId}, product: ${productId}`);

    // Check for duplicate transaction
    const { data: existingPurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("checkout_session_id", transactionId)
      .single();

    if (existingPurchase) {
      console.log(`Duplicate transaction detected: ${transactionId}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Purchase already processed",
          duplicate: true 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify receipt with Apple
    // Use sandbox for testing, production for live
    const appleVerifyUrl = "https://buy.itunes.apple.com/verifyReceipt";
    const appleSandboxUrl = "https://sandbox.itunes.apple.com/verifyReceipt";

    // Try production first
    let appleResponse = await fetch(appleVerifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "receipt-data": receiptData,
        "password": Deno.env.get("APPLE_SHARED_SECRET") || "", // Set this in Supabase secrets
        "exclude-old-transactions": true,
      }),
    });

    let verificationResult = await appleResponse.json();

    // If status is 21007, receipt is from sandbox - retry with sandbox URL
    if (verificationResult.status === 21007) {
      console.log("Receipt is from sandbox, retrying with sandbox URL");
      appleResponse = await fetch(appleSandboxUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "receipt-data": receiptData,
          "password": Deno.env.get("APPLE_SHARED_SECRET") || "",
          "exclude-old-transactions": true,
        }),
      });
      verificationResult = await appleResponse.json();
    }

    if (verificationResult.status !== 0) {
      console.error("Apple receipt verification failed:", verificationResult);
      return new Response(
        JSON.stringify({ 
          error: "Receipt verification failed", 
          appleStatus: verificationResult.status 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify transaction ID matches
    const transactions = verificationResult.receipt?.in_app || [];
    const transaction = transactions.find((t: any) => t.transaction_id === transactionId);

    if (!transaction) {
      console.error("Transaction ID not found in receipt");
      return new Response(
        JSON.stringify({ error: "Transaction not found in receipt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify product ID matches
    if (transaction.product_id !== productId) {
      console.error(`Product ID mismatch: expected ${productId}, got ${transaction.product_id}`);
      return new Response(
        JSON.stringify({ error: "Product ID mismatch" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const credits = PRODUCT_CREDITS[productId as keyof typeof PRODUCT_CREDITS];
    const price = PRODUCT_PRICES[productId as keyof typeof PRODUCT_PRICES];

    if (!credits || !price) {
      console.error(`Unknown product ID: ${productId}`);
      return new Response(
        JSON.stringify({ error: "Unknown product ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert purchase record
    const { error: insertError } = await supabase
      .from("purchases")
      .insert({
        user_id: user.id,
        checkout_session_id: transactionId,
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
    console.error("Error in verify-apple-purchase:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
