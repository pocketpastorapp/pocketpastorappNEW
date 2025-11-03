import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, ExternalLink } from "lucide-react";

export const SecurityNotification = () => {
  const handleOpenSupabase = () => {
    window.open('https://supabase.com/dashboard/project/tsgbptmfvyhpfpefdbsn/auth/providers', '_blank');
  };

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">
        Security Enhancement Required
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 space-y-3">
        <p>
          Your account security could be improved by enabling password breach protection. 
          This feature prevents users from using passwords that have been compromised in data breaches.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOpenSupabase}
          className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900"
        >
          Enable in Supabase Dashboard
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
        <p className="text-xs">
          Navigate to: Authentication → Settings → Enable "Leaked Password Protection"
        </p>
      </AlertDescription>
    </Alert>
  );
};