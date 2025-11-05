import { useState, useEffect, useCallback } from 'react';
import { inAppPurchaseService } from '@/services/payment/inAppPurchaseService';
import { useCredits } from './useCredits';
import type { Product, PaymentError, Purchase } from '@/types/payment-types';

interface UseInAppPurchaseReturn {
  products: Product[];
  isLoading: boolean;
  isInitialized: boolean;
  isPurchasing: boolean;
  error: PaymentError | null;
  purchase: (productId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  clearError: () => void;
  isAvailable: boolean;
}

export const useInAppPurchase = (): UseInAppPurchaseReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);
  const { addCredits } = useCredits();

  // Initialize service on mount
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Only initialize if available on platform
        if (!inAppPurchaseService.isAvailable()) {
          setIsInitialized(false);
          setIsLoading(false);
          return;
        }

        await inAppPurchaseService.initialize();
        const productList = inAppPurchaseService.getProducts();
        setProducts(productList);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize IAP:', err);
        setError(err as PaymentError);
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, []);

  /**
   * Handle purchase flow
   */
  const purchase = useCallback(
    async (productId: string) => {
      try {
        setIsPurchasing(true);
        setError(null);

        // Step 1: Initiate purchase
        const purchaseData = await inAppPurchaseService.purchase(productId);
        console.log('Purchase initiated:', purchaseData);

        // Step 2: Verify receipt with backend
        const isVerified = await inAppPurchaseService.verifyReceipt(
          purchaseData.receipt,
          productId,
          purchaseData.transactionId
        );

        if (!isVerified) {
          throw {
            code: 'VERIFICATION_FAILED',
            message: 'Purchase verification failed. Please try again.',
          };
        }

        // Step 3: Award credits
        const credits = inAppPurchaseService.getCreditsForProduct(productId);
        await addCredits(credits);

        console.log(`Successfully purchased ${credits} credits`);
      } catch (err) {
        console.error('Purchase failed:', err);
        setError(err as PaymentError);
        throw err;
      } finally {
        setIsPurchasing(false);
      }
    },
    [addCredits]
  );

  /**
   * Handle restore purchases
   */
  const restorePurchases = useCallback(async () => {
    try {
      setIsPurchasing(true);
      setError(null);

      const purchases = await inAppPurchaseService.restorePurchases();

      if (purchases.length === 0) {
        setError({
          code: 'NO_PURCHASES',
          message: 'No previous purchases found to restore',
        });
        return;
      }

      // Verify each purchase and award credits
      for (const purchase of purchases) {
        const isVerified = await inAppPurchaseService.verifyReceipt(
          purchase.receipt,
          purchase.productId,
          purchase.transactionId
        );

        if (isVerified) {
          const credits = inAppPurchaseService.getCreditsForProduct(purchase.productId);
          if (credits > 0) {
            await addCredits(credits);
          }
        }
      }

      console.log(`Restored ${purchases.length} purchase(es)`);
    } catch (err) {
      console.error('Restore purchases failed:', err);
      setError(err as PaymentError);
    } finally {
      setIsPurchasing(false);
    }
  }, [addCredits]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    products,
    isLoading,
    isInitialized,
    isPurchasing,
    error,
    purchase,
    restorePurchases,
    clearError,
    isAvailable: inAppPurchaseService.isAvailable(),
  };
};
