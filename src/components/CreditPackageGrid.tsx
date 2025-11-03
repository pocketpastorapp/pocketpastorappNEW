
import { CreditPackageCard } from "./CreditPackageCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreditPackage {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  color: string;
}

interface CreditPackageGridProps {
  packages: CreditPackage[];
  isLoading: string | null;
  onPurchase: (packageId: string) => void;
}

export function CreditPackageGrid({ packages, isLoading, onPurchase }: CreditPackageGridProps) {
  const isMobile = useIsMobile();

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
      {packages.map((pkg) => (
        <CreditPackageCard
          key={pkg.id}
          pkg={pkg}
          isLoading={isLoading}
          isMobile={isMobile}
          onPurchase={onPurchase}
        />
      ))}
    </div>
  );
}
