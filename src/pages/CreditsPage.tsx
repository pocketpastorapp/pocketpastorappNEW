
import { Coins } from "lucide-react";
import Layout from "@/components/Layout";
import { useCredits } from "@/hooks/useCredits";
import CreditsCard from "@/components/credits/CreditsCard";
import CreditActions from "@/components/credits/CreditActions";
import CreditsPageSkeleton, { CreditsPageError } from "@/components/credits/CreditsPageSkeleton";

const CreditsPage = () => {
  const { credits, isLoading, useCredit, addCredits, addCreditsFromAd, refreshCredits } = useCredits();

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
              onPurchaseClick={() => {}}
              refreshCredits={refreshCredits}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default CreditsPage;
