
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { PaymentStatus as PaymentStatusType } from "@/hooks/usePaymentVerification";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentStatusProps {
  status: PaymentStatusType;
}

const PaymentStatus = ({ status }: PaymentStatusProps) => {
  if (!status) return null;

  return (
    <div className="max-w-md w-full mx-auto my-12">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center p-4">
            {status === "processing" && (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
                <p className="text-muted-foreground">
                  Please wait while we verify your payment with Stripe.
                  This process usually takes a few seconds.
                </p>
              </>
            )}
            
            {status === "success" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground">
                  Your payment has been processed successfully.
                  The credits have been added to your account.
                </p>
              </>
            )}
            
            {status === "error" && (
              <>
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Error</h2>
                <p className="text-muted-foreground">
                  There was an issue processing your payment.
                  Please try again or contact support if the problem persists.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatus;
