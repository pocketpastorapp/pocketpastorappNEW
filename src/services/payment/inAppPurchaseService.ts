import { Capacitor } from '@capacitor/core';
import { BillingPlugin } from 'capacitor-billing';
import { PRODUCT_IDS, CREDIT_PACKAGES, getCurrencyFromLocale, CURRENCY_BY_REGION, type Product, type Purchase, type PaymentError } from '@/types/payment-types';

class InAppPurchaseService {
  private initialized = false;
  private productList: Product[] = [];

  /**
   * Initialize the in-app purchase service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const platform = Capacitor.getPlatform();

    // Only initialize on mobile platforms
    if (platform !== 'ios' && platform !== 'android') {
      console.warn('In-app purchases only available on iOS and Android');
      return;
    }

    try {
      // Platform-specific initialization
      if (platform === 'android') {
        await this.initializeAndroid();
      } else if (platform === 'ios') {
        await this.initializeIOS();
      }

      this.initialized = true;
      console.log('In-App Purchase service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize In-App Purchase:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Initialize for Android
   * Note: Google Play automatically returns prices in the currency
   * based on the user's device region, not the app language
   */
  private async initializeAndroid(): Promise<void> {
    try {
      // Get the device's currency based on its locale/region setting
      const currencyCode = getCurrencyFromLocale();

      // Query product details for Android
      const productIds = Object.values(PRODUCT_IDS);

      for (const productId of productIds) {
        const result = await BillingPlugin.querySkuDetails({
          product: productId,
          type: 'inapp',
        });

        try {
          const productData = JSON.parse(result.value);
          // Google Play returns the price in the device's region currency
          // The currencyCode in the data is based on the user's app store region
          this.productList.push({
            id: productId,
            title: productData.title || productId,
            description: productData.description || '',
            price: productData.price || '$0.00',
            currency: productData.currency_code || currencyCode,
            currencyCode: productData.currency_code || currencyCode,
            credits: CREDIT_PACKAGES[productId]?.credits || 0,
          });
        } catch (parseError) {
          console.error(`Failed to parse product data for ${productId}:`, parseError);
        }
      }
    } catch (error) {
      console.error('Android initialization error:', error);
      // Continue with offline mode
    }
  }

  /**
   * Initialize for iOS
   * Note: Apple App Store automatically returns prices in the currency
   * based on the user's device region, not the app language
   */
  private async initializeIOS(): Promise<void> {
    try {
      // Get the device's currency based on its locale/region setting
      const currencyCode = getCurrencyFromLocale();

      // iOS initialization - products are configured in app store
      // The actual prices will come from App Store Connect based on the user's region
      const productIds = Object.values(PRODUCT_IDS);

      for (const productId of productIds) {
        const packageConfig = CREDIT_PACKAGES[productId];
        if (packageConfig) {
          this.productList.push({
            id: productId,
            title: `${packageConfig.credits} Credits`,
            description: packageConfig.description,
            // Show USD price as reference; actual price will be in user's region currency
            price: `$${packageConfig.priceUSD.toFixed(2)}`,
            currency: currencyCode,
            currencyCode: currencyCode,
            credits: packageConfig.credits,
          });
        }
      }
    } catch (error) {
      console.error('iOS initialization error:', error);
      // Continue with configuration-based products
    }
  }

  /**
   * Get list of available products
   */
  getProducts(): Product[] {
    return this.productList;
  }

  /**
   * Get a specific product by ID
   */
  getProduct(productId: string): Product | undefined {
    return this.productList.find((p) => p.id === productId);
  }

  /**
   * Initiate a purchase
   */
  async purchase(productId: string): Promise<Purchase> {
    if (!this.initialized) {
      throw {
        code: 'NOT_INITIALIZED',
        message: 'In-App Purchase service not initialized',
      };
    }

    // Validate product exists
    const product = this.getProduct(productId);
    if (!product) {
      throw {
        code: 'INVALID_PRODUCT',
        message: `Product ${productId} not found`,
      };
    }

    const platform = Capacitor.getPlatform();

    try {
      if (platform === 'android') {
        return await this.purchaseAndroid(productId);
      } else if (platform === 'ios') {
        return await this.purchaseIOS(productId);
      } else {
        throw {
          code: 'UNSUPPORTED_PLATFORM',
          message: 'In-app purchases not supported on this platform',
        };
      }
    } catch (error) {
      console.error('Purchase error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Purchase on Android
   */
  private async purchaseAndroid(productId: string): Promise<Purchase> {
    try {
      const result = await BillingPlugin.launchBillingFlow({
        product: productId,
        type: 'inapp',
      });

      // Parse the purchase response
      const purchaseData = JSON.parse(result.value);

      return {
        productId,
        transactionId: purchaseData.purchaseToken || purchaseData.orderId || `txn_${Date.now()}`,
        receipt: result.value,
        purchaseTime: purchaseData.purchaseTime || Date.now(),
        purchaseState: purchaseData.purchaseState || 'purchased',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Purchase on iOS
   */
  private async purchaseIOS(productId: string): Promise<Purchase> {
    // iOS implementation would use native StoreKit
    // For web, this is simulated
    return {
      productId,
      transactionId: `ios_txn_${Date.now()}`,
      receipt: `ios_receipt_${productId}_${Date.now()}`,
      purchaseTime: Date.now(),
      purchaseState: 'purchased',
    };
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<Purchase[]> {
    if (!this.initialized) {
      throw {
        code: 'NOT_INITIALIZED',
        message: 'In-App Purchase service not initialized',
      };
    }

    // Note: Actual restore purchases would require native platform integration
    // This is a placeholder implementation
    console.log('Restore purchases - implement platform-specific logic');
    return [];
  }

  /**
   * Get credits for a product
   */
  getCreditsForProduct(productId: string): number {
    const packageConfig = CREDIT_PACKAGES[productId];
    return packageConfig?.credits || 0;
  }

  /**
   * Verify receipt with backend
   */
  async verifyReceipt(receipt: string, productId: string, transactionId: string): Promise<boolean> {
    try {
      // This will be implemented with backend Supabase function
      const response = await fetch('/api/payment/verify-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receipt,
          productId,
          transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Receipt verification failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.verified === true;
    } catch (error) {
      console.error('Receipt verification error:', error);
      return false;
    }
  }

  /**
   * Handle errors and convert to PaymentError
   */
  private handleError(error: any): PaymentError {
    if (error.code && error.message) {
      return error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Handle specific error cases
    if (errorMessage.includes('cancel') || errorMessage.includes('user')) {
      return {
        code: 'USER_CANCELLED',
        message: 'Purchase cancelled by user',
        originalError: error instanceof Error ? error : undefined,
      };
    }

    if (errorMessage.includes('network')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error - please check your connection',
        originalError: error instanceof Error ? error : undefined,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: errorMessage,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  /**
   * Check if in-app purchases are available
   */
  isAvailable(): boolean {
    const platform = Capacitor.getPlatform();
    return platform === 'ios' || platform === 'android';
  }
}

// Export singleton instance
export const inAppPurchaseService = new InAppPurchaseService();
