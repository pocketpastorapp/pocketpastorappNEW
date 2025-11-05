import { supabase } from '@/integrations/supabase/client';
import { PRODUCT_IDS } from '@/types/payment-types';

/**
 * Verify purchase receipt and award credits
 * This function should be called after a successful purchase
 */
export async function verifyAndAwardCredits(
  userId: string,
  receipt: string,
  productId: string,
  transactionId: string,
  platform: 'ios' | 'android'
): Promise<{ success: boolean; creditsAwarded: number; error?: string }> {
  try {
    // First check if this purchase has already been processed
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id, credits_purchased')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('transaction_id', transactionId)
      .single();

    if (existingPurchase) {
      console.log('Purchase already processed');
      return {
        success: true,
        creditsAwarded: existingPurchase.credits_purchased,
      };
    }

    // Determine credits for the product
    const credits = getCreditsForProduct(productId);
    if (credits === 0) {
      return {
        success: false,
        creditsAwarded: 0,
        error: 'Invalid product ID',
      };
    }

    // In a real implementation, you would verify the receipt with:
    // - Apple App Store Server API for iOS
    // - Google Play Billing Library for Android
    // For now, we'll assume the receipt is valid (you should implement proper verification)

    // TODO: Implement real receipt verification:
    // 1. For iOS: Call Apple's App Store Server API to validate receipt
    // 2. For Android: Call Google Play's billing API to validate purchase token
    // 3. Check that the product ID matches
    // 4. Check that the purchase is not expired or refunded
    // 5. Check that the transaction ID is not already redeemed

    // Create purchase record
    const { error: insertError } = await supabase.from('purchases').insert({
      user_id: userId,
      product_id: productId,
      transaction_id: transactionId,
      receipt_data: receipt,
      credits_purchased: credits,
      status: 'completed',
      platform: platform,
    });

    if (insertError) {
      console.error('Error inserting purchase record:', insertError);
      return {
        success: false,
        creditsAwarded: 0,
        error: insertError.message,
      };
    }

    // Award credits to user
    const { error: creditError } = await supabase.rpc('add_credits', {
      user_id: userId,
      amount: credits,
    });

    if (creditError) {
      console.error('Error awarding credits:', creditError);
      return {
        success: false,
        creditsAwarded: 0,
        error: creditError.message,
      };
    }

    return {
      success: true,
      creditsAwarded: credits,
    };
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return {
      success: false,
      creditsAwarded: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
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
 * Verify Apple receipt using App Store Server API
 * This should be called from a backend function (not the client)
 */
export async function verifyAppleReceipt(
  receipt: string,
  productId: string
): Promise<{ valid: boolean; transactionId?: string }> {
  // This should be implemented on the backend using Apple's App Store Server API
  // The client should never have direct access to verify receipts
  // Instead, the backend should validate using Apple's official endpoints:
  // https://api.storekit.itunes.apple.com/inApps/v1/transactions/lookup/<originalTransactionId>

  console.log('Apple receipt verification should be done on backend');
  console.log('Product ID:', productId);

  // Placeholder implementation
  return {
    valid: true,
    transactionId: receipt.substring(0, 20),
  };
}

/**
 * Verify Google receipt using Google Play Billing API
 * This should be called from a backend function (not the client)
 */
export async function verifyGoogleReceipt(
  purchaseToken: string,
  packageName: string,
  productId: string
): Promise<{ valid: boolean; transactionId?: string }> {
  // This should be implemented on the backend using Google's Play Billing Library
  // The client should never have direct access to verify receipts
  // Instead, the backend should validate using Google's API:
  // https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{packageName}/purchases/products/{productId}/tokens/{token}

  console.log('Google receipt verification should be done on backend');
  console.log('Package:', packageName, 'Product:', productId);

  // Placeholder implementation
  return {
    valid: true,
    transactionId: purchaseToken.substring(0, 20),
  };
}
