import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInAppPurchase } from '@/hooks/useInAppPurchase';
import { CREDIT_PACKAGES, PRODUCT_IDS } from '@/types/payment-types';
import { AlertCircle, Zap } from 'lucide-react';

interface CreditPackagesProps {
  onPurchaseSuccess?: () => void;
}

const CreditPackages = ({ onPurchaseSuccess }: CreditPackagesProps) => {
  const { products, isLoading, isPurchasing, error, purchase, clearError, isAvailable } =
    useInAppPurchase();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Get packages in order of ID
  const packageList = [
    PRODUCT_IDS.CREDITS_5,
    PRODUCT_IDS.CREDITS_30,
    PRODUCT_IDS.CREDITS_75,
    PRODUCT_IDS.CREDITS_150,
    PRODUCT_IDS.CREDITS_300,
  ];

  const handlePurchase = async (productId: string) => {
    try {
      setSelectedPackage(productId);
      await purchase(productId);
      onPurchaseSuccess?.();
      setSelectedPackage(null);
    } catch (err) {
      // Error is handled by the hook and shown in UI
      setSelectedPackage(null);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-secondary rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Show unavailable message on non-mobile
  if (!isAvailable) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
            <AlertCircle size={20} />
            Not Available on Web
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-800 dark:text-amber-200">
          In-app purchases are only available on iOS and Android. Download our mobile app to buy credits!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                {error.code === 'USER_CANCELLED' ? 'Purchase Cancelled' : 'Purchase Failed'}
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error.message}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Credit Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packageList.map((productId, index) => {
          const packageConfig = CREDIT_PACKAGES[productId];
          const product = products.find((p) => p.id === productId);

          // If no packageConfig, skip this item
          if (!packageConfig) return null;

          // Use product data if available, otherwise use fallback from config
          const displayPrice = product?.price || `$${packageConfig.priceUSD.toFixed(2)}`;
          const displayCurrency = product?.currency || 'USD';

          const isPopular = packageConfig.popular;
          const isPurchasingThisProduct = selectedPackage === productId && isPurchasing;

          return (
            <motion.div
              key={productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              <Card
                className={`h-full transition-all ${
                  isPopular ? 'border-blue-200 dark:border-blue-800 ring-2 ring-blue-200 dark:ring-blue-800' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                        {packageConfig.credits}
                      </CardTitle>
                      <CardDescription>Credits</CardDescription>
                    </div>
                    <Zap className="text-yellow-500" size={24} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Price */}
                  <div>
                    <p className="text-3xl font-bold">{displayPrice}</p>
                    <p className="text-xs text-muted-foreground">{displayCurrency}</p>
                  </div>

                  {/* Savings Badge */}
                  {packageConfig.savings && (
                    <div className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs font-semibold px-3 py-1 rounded-full">
                      {packageConfig.savings}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{packageConfig.description}</p>

                  {/* Purchase Button */}
                  <Button
                    onClick={() => handlePurchase(productId)}
                    disabled={isPurchasing}
                    variant={isPopular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {isPurchasingThisProduct ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Message */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 Credits are used for chat interactions with Pocket Pastor. Each message costs 1 credit from your free
            daily credits first, then your purchased credits.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditPackages;
