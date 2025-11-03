
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type PaymentStatus = 'success' | 'processing' | 'error' | null;

export const usePaymentVerification = (refreshCreditsCallback: () => void) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verificationAttempted = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    // Only proceed if we have a session ID and haven't attempted verification for this session
    if (!sessionId || verificationAttempted.current || sessionIdRef.current === sessionId) {
      return;
    }

    // Mark this session as being processed
    sessionIdRef.current = sessionId;
    verificationAttempted.current = true;
    
    const verifyPayment = async () => {
      setPaymentStatus('processing');
      
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });
        
        if (error) {
          console.error("Payment verification error:", error);
          setPaymentStatus('error');
          toast.error("Failed to verify your payment");
          return;
        }
        
        if (data.success) {
          setPaymentStatus('success');
          toast.success("Payment successful! Credits added to your account.");
          refreshCreditsCallback();
          
          // Clear URL parameters after successful payment
          navigate('/credits', { replace: true });
        } else {
          // If payment is still processing, wait and try once more
          setTimeout(async () => {
            try {
              const { data: retryData, error: retryError } = await supabase.functions.invoke("verify-payment", {
                body: { session_id: sessionId },
              });
              
              if (retryError) {
                console.error("Payment verification retry error:", retryError);
                setPaymentStatus('error');
                toast.error("Failed to verify your payment");
                return;
              }
              
              if (retryData.success) {
                setPaymentStatus('success');
                toast.success("Payment successful! Credits added to your account.");
                refreshCreditsCallback();
                navigate('/credits', { replace: true });
              } else {
                setPaymentStatus('error');
                toast.error("Payment verification timed out. Please contact support if your payment was processed.");
              }
            } catch (err) {
              console.error("Payment verification retry error:", err);
              setPaymentStatus('error');
              toast.error("An error occurred while verifying your payment");
            }
          }, 3000);
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setPaymentStatus('error');
        toast.error("An error occurred while verifying your payment");
      }
    };

    verifyPayment();
  }, [searchParams, navigate, refreshCreditsCallback]);

  return { paymentStatus };
};
