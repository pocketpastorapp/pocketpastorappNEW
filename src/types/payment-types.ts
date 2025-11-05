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

// Currency to language mapping
export const CURRENCY_BY_LANGUAGE: Record<string, string> = {
  'en': 'USD',
  'es': 'EUR',
  'pt': 'EUR',
  'fr': 'EUR',
  'ar': 'SAR',
  'hi': 'INR',
  'zh': 'CNY',
  'ja': 'JPY',
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
