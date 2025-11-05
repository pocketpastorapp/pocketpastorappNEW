
import { Coins } from "lucide-react";
import Layout from "@/components/Layout";
import { useCredits } from "@/hooks/useCredits";
import CreditsCard from "@/components/credits/CreditsCard";
import CreditPackages from "@/components/credits/CreditPackages";
import CreditsPageSkeleton, { CreditsPageError } from "@/components/credits/CreditsPageSkeleton";

const CreditsPage = () => {
  const { credits, isLoading, refreshCredits } = useCredits();

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
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Buy More Credits</h2>
              <CreditPackages onPurchaseSuccess={refreshCredits} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CreditsPage;
