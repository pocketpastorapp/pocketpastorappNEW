
import { useState } from "react";
import { Coins } from "lucide-react";
import Layout from "@/components/Layout";
import { useCredits } from "@/hooks/useCredits";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import PurchaseCreditsModal from "@/components/PurchaseCreditsModal";
import CreditsCard from "@/components/credits/CreditsCard";
import CreditActions from "@/components/credits/CreditActions";
import PaymentStatus from "@/components/credits/PaymentStatus";
import CreditsPageSkeleton, { CreditsPageError } from "@/components/credits/CreditsPageSkeleton";

const CreditsPage = () => {
  const { credits, isLoading, useCredit, addCredits, addCreditsFromAd, refreshCredits } = useCredits();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const { paymentStatus } = usePaymentVerification(refreshCredits);

  // If payment is being processed or completed, show payment status
  if (paymentStatus === 'success' || paymentStatus === 'processing') {
    return (
      <Layout>
        <PaymentStatus status={paymentStatus} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="h-6 w-6 text-pastor-navy" />
          <h1 className="text-2xl font-bold">Your Credits</h1>
        </div>

        {isLoading ? (
          <CreditsPageSkeleton onRetry={refreshCredits} />
        ) : !credits ? (
          <CreditsPageError onRetry={refreshCredits} />
        ) : (
          <>
            <CreditsCard credits={credits} />
            <CreditActions 
              credits={credits}
              addCredits={addCredits}
              addCreditsFromAd={addCreditsFromAd}
              useCredit={useCredit}
              onPurchaseClick={() => setPurchaseModalOpen(true)}
              refreshCredits={refreshCredits}
            />
          </>
        )}
      </div>
      
      <PurchaseCreditsModal 
        open={purchaseModalOpen} 
        onOpenChange={setPurchaseModalOpen} 
        onSuccess={refreshCredits}
      />
    </Layout>
  );
};

export default CreditsPage;
