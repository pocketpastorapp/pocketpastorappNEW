
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";

interface CreditPackage {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  color: string;
}

interface CreditPackageCardProps {
  pkg: CreditPackage;
  isLoading: string | null;
  isMobile: boolean;
  onPurchase: (packageId: string) => void;
}

export function CreditPackageCard({ pkg, isLoading, isMobile, onPurchase }: CreditPackageCardProps) {
  if (isMobile) {
    return (
      <Card className={`overflow-hidden border ${pkg.color}`}>
        <div className="flex items-center p-3">
          <div className="flex-1">
            <h3 className="font-semibold text-base">{pkg.name}</h3>
            <p className="text-xs text-muted-foreground">{pkg.description}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold">{pkg.price}</span>
              <span className="text-xs text-muted-foreground">
                ({pkg.credits} credits)
              </span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onPurchase(pkg.id)}
            disabled={!!isLoading}
            className="bg-[#1D6AD7] hover:bg-[#1D6AD7]/90"
          >
            {isLoading === pkg.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Buy"
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden border ${pkg.color}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{pkg.name}</CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">{pkg.price}</div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{pkg.credits}</span> credits
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-[#1D6AD7] hover:bg-[#1D6AD7]/90" 
          onClick={() => onPurchase(pkg.id)}
          disabled={!!isLoading}
        >
          {isLoading === pkg.id ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            <><CreditCard className="mr-2 h-4 w-4" /> Buy Now</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
