export interface CreditPackage {
  id: string;
  credits: number;
  priceUSD: number;
  description: string;
  savings?: string; // e.g., "Save 20%" for larger packs
  popular?: boolean; // Mark popular option
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  currencyCode: string;
  credits: number;
}

export interface Purchase {
  productId: string;
  transactionId: string;
  receipt: string;
  purchaseTime: number;
  purchaseState?: string;
}

export interface PaymentError {
  code: string;
  message: string;
  originalError?: Error;
}

export interface PurchaseResult {
  success: boolean;
  productId: string;
  credits: number;
  error?: PaymentError;
}

/**
 * Get the user's currency code based on their device locale
 * This uses the Intl API to determine currency from the device's locale,
 * which is determined by the app store region, not the app language setting
 */
export function getCurrencyFromLocale(): string {
  try {
    // Get the device's locale
    const locale = navigator.language || 'en-US';

    // Use Intl.NumberFormat to get the currency for this locale
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD', // dummy currency to extract the locale's currency
    });

    // Get the currency code from the formatter
    const parts = formatter.formatToParts(1);
    const currencyPart = parts.find((part) => part.type === 'currency');

    // If we can get the currency from the locale's formatter, use it
    if (currencyPart) {
      return currencyPart.value;
    }
  } catch (error) {
    console.error('Error detecting currency from locale:', error);
  }

  // Default to USD if detection fails
  return 'USD';
}

/**
 * Map of locale patterns to their primary currency codes
 * Used as a fallback if Intl API detection doesn't work
 */
export const CURRENCY_BY_REGION: Record<string, string> = {
  'en-US': 'USD',
  'en-GB': 'GBP',
  'en-AU': 'AUD',
  'en-CA': 'CAD',
  'es-ES': 'EUR',
  'es-MX': 'MXN',
  'es-AR': 'ARS',
  'pt-PT': 'EUR',
  'pt-BR': 'BRL',
  'fr-FR': 'EUR',
  'fr-CA': 'CAD',
  'de-DE': 'EUR',
  'it-IT': 'EUR',
  'ar-SA': 'SAR',
  'ar-AE': 'AED',
  'ar-EG': 'EGP',
  'hi-IN': 'INR',
  'zh-CN': 'CNY',
  'zh-TW': 'TWD',
  'ja-JP': 'JPY',
  'ko-KR': 'KRW',
  'th-TH': 'THB',
  'vi-VN': 'VND',
  'id-ID': 'IDR',
  'pl-PL': 'PLN',
  'ru-RU': 'RUB',
};

// Product IDs for all platforms
export const PRODUCT_IDS = {
  CREDITS_5: 'com.pocketpastor.credits_5',
  CREDITS_30: 'com.pocketpastor.credits_30',
  CREDITS_75: 'com.pocketpastor.credits_75',
  CREDITS_150: 'com.pocketpastor.credits_150',
  CREDITS_300: 'com.pocketpastor.credits_300',
};

// Credit packages configuration
export const CREDIT_PACKAGES: Record<string, CreditPackage> = {
  [PRODUCT_IDS.CREDITS_5]: {
    id: PRODUCT_IDS.CREDITS_5,
    credits: 5,
    priceUSD: 0.99,
    description: 'Small pack for testing',
  },
  [PRODUCT_IDS.CREDITS_30]: {
    id: PRODUCT_IDS.CREDITS_30,
    credits: 30,
    priceUSD: 4.99,
    description: 'Great for regular use',
    popular: true,
  },
  [PRODUCT_IDS.CREDITS_75]: {
    id: PRODUCT_IDS.CREDITS_75,
    credits: 75,
    priceUSD: 9.99,
    description: 'Good value',
    savings: 'Save 33%',
  },
  [PRODUCT_IDS.CREDITS_150]: {
    id: PRODUCT_IDS.CREDITS_150,
    credits: 150,
    priceUSD: 19.99,
    description: 'Best for heavy users',
    savings: 'Save 40%',
  },
  [PRODUCT_IDS.CREDITS_300]: {
    id: PRODUCT_IDS.CREDITS_300,
    credits: 300,
    priceUSD: 39.99,
    description: 'Maximum savings',
    savings: 'Save 50%',
    popular: true,
  },
};
