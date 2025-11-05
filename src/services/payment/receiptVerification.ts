import { supabase } from '@/integrations/supabase/client';
import { PRODUCT_IDS } from '@/types/payment-types';

/**
 * Verify purchase receipt and award credits
 * SECURITY: This function calls a Supabase Edge Function that performs server-side
 * receipt validation with Apple App Store Server API or Google Play Billing API
 */
export async function verifyAndAwardCredits(
  userId: string,
  receipt: string,
  productId: string,
  transactionId: string,
  platform: 'ios' | 'android'
): Promise<{ success: boolean; creditsAwarded: number; error?: string }> {
  try {
    // Validate inputs
    if (!userId || !receipt || !productId || !transactionId) {
      return {
        success: false,
        creditsAwarded: 0,
        error: 'Missing required purchase data',
      };
    }

    // Validate product ID exists
    const credits = getCreditsForProduct(productId);
    if (credits === 0) {
      return {
        success: false,
        creditsAwarded: 0,
        error: 'Invalid product ID',
      };
    }

    // Check for duplicate purchases to prevent replay attacks
    const { data: existingPurchase, error: queryError } = await supabase
      .from('purchases')
      .select('id, credits_purchased, status')
      .eq('user_id', userId)
      .eq('transaction_id', transactionId)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      // PGRST116 = not found, which is expected for new purchases
      return {
        success: false,
        creditsAwarded: 0,
        error: 'Database error checking for duplicate purchase',
      };
    }

    if (existingPurchase) {
      // Duplicate purchase detected - return existing credits
      if (existingPurchase.status === 'completed') {
        return {
          success: true,
          creditsAwarded: existingPurchase.credits_purchased,
        };
      }
      // If in pending state, don't process again
      return {
        success: false,
        creditsAwarded: 0,
        error: 'Purchase is still being processed',
      };
    }

    // Call Supabase Edge Function for server-side receipt verification
    // IMPORTANT: This must validate the receipt with the actual app store
    const { data: verificationResult, error: verifyError } = await supabase.functions.invoke(
      'verify-app-store-receipt',
      {
        body: {
          receipt,
          productId,
          transactionId,
          platform,
          userId,
        },
      }
    );

    if (verifyError) {
      console.error('Receipt verification error:', verifyError);
      return {
        success: false,
        creditsAwarded: 0,
        error: 'Failed to verify receipt with app store',
      };
    }

    if (!verificationResult?.valid) {
      return {
        success: false,
        creditsAwarded: 0,
        error: verificationResult?.error || 'Receipt validation failed',
      };
    }

    // Create purchase record with 'verified' status
    const { error: insertError } = await supabase.from('purchases').insert({
      user_id: userId,
      product_id: productId,
      transaction_id: transactionId,
      receipt_data: receipt,
      credits_purchased: credits,
      status: 'verified',
      platform: platform,
      verified_at: new Date().toISOString(),
    });

    if (insertError) {
      return {
        success: false,
        creditsAwarded: 0,
        error: 'Failed to record purchase',
      };
    }

    // Award credits to user
    const { error: creditError } = await supabase.rpc('add_credits', {
      user_id: userId,
      amount: credits,
    });

    if (creditError) {
      // Mark purchase as failed to credit
      await supabase
        .from('purchases')
        .update({ status: 'failed' })
        .eq('transaction_id', transactionId);

      return {
        success: false,
        creditsAwarded: 0,
        error: 'Failed to award credits',
      };
    }

    // Update purchase status to completed
    await supabase
      .from('purchases')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('transaction_id', transactionId);

    return {
      success: true,
      creditsAwarded: credits,
    };
  } catch (error) {
    return {
      success: false,
      creditsAwarded: 0,
      error: error instanceof Error ? error.message : 'Unknown error during purchase verification',
    };
  }
}

/**
 * Get credit amount for a product ID
 */
function getCreditsForProduct(productId: string): number {
  const creditMap: Record<string, number> = {
    [PRODUCT_IDS.CREDITS_5]: 5,
    [PRODUCT_IDS.CREDITS_30]: 30,
    [PRODUCT_IDS.CREDITS_75]: 75,
    [PRODUCT_IDS.CREDITS_150]: 150,
    [PRODUCT_IDS.CREDITS_300]: 300,
  };

  return creditMap[productId] || 0;
}

/**
 * IMPLEMENTATION GUIDE FOR SUPABASE EDGE FUNCTION: verify-app-store-receipt
 *
 * This Edge Function MUST be created in your Supabase project to handle server-side
 * receipt verification. The client code above calls this function.
 *
 * FILE: supabase/functions/verify-app-store-receipt/index.ts
 *
 * REQUIRED IMPLEMENTATION:
 *
 * 1. APPLE APP STORE VERIFICATION:
 *    - Use Apple's App Store Server API (StoreKit 2)
 *    - Endpoint: https://api.storekit.itunes.apple.com/inApps/v1/transactions/lookup/{originalTransactionId}
 *    - Set up authentication with Apple's JWT (requires private key from App Store Connect)
 *    - Validate: productId, transactionId, bundle ID, and purchase date
 *    - Check: Receipt is not revoked, subscription is active (if applicable)
 *
 * 2. GOOGLE PLAY VERIFICATION:
 *    - Use Google Play Developer API
 *    - Endpoint: https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{packageName}/purchases/products/{productId}/tokens/{token}
 *    - Set up authentication with Google Service Account JSON
 *    - Validate: productId, purchaseToken, packageName
 *    - Check: Purchase state is 'Purchased', not 'Pending' or 'Canceled'
 *
 * 3. SECURITY CHECKS:
 *    - Verify userId matches authenticated user (from JWT)
 *    - Check transaction_id is not already in database
 *    - Validate receipt is not expired
 *    - Log all verification attempts for audit trail
 *    - Use HTTPS only, no sensitive data in logs
 *
 * EXAMPLE STRUCTURE:
 * ```
 * export const verify = async (req: Request) => {
 *   const { receipt, productId, transactionId, platform, userId } = await req.json()
 *
 *   if (platform === 'ios') {
 *     return verifyAppleReceipt(receipt, productId, transactionId, userId)
 *   } else if (platform === 'android') {
 *     return verifyGoogleReceipt(receipt, productId, transactionId, userId)
 *   }
 * }
 * ```
 *
 * CRITICAL: DO NOT accept receipt verification without calling official app store APIs.
 * Without this, users can claim unlimited free credits.
 */
