
import { Infinity } from "lucide-react";
import { UserCredits } from "@/types/user-credit-types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CreditsCardProps {
  credits: UserCredits;
}

const CreditsCard = ({ credits }: CreditsCardProps) => {
  if (!credits) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {credits.hasUnlimitedCredits ? (
            <>
              <span>Unlimited Credits</span>
              <Infinity className="h-5 w-5" />
            </>
          ) : (
            <>Available Credits</>
          )}
        </CardTitle>
        <CardDescription>
          Your current credit balance and usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {credits.hasUnlimitedCredits ? (
          <div className="text-center py-4">
            <p className="text-lg">You have unlimited credits! Enjoy using all features without restrictions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Free Credits</span>
              <span className="text-4xl font-bold">{credits.freeCredits}</span>
              <span className="text-xs text-muted-foreground mt-1">Daily credits</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Paid Credits</span>
              <span className="text-4xl font-bold">{credits.totalCredits}</span>
              <span className="text-xs text-muted-foreground mt-1">Purchased or earned</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Last free credit refresh: {new Date(credits.lastFreeCreditDate).toLocaleDateString()}</p>
          <p className="mt-1">Free credits refresh daily</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreditsCard;
