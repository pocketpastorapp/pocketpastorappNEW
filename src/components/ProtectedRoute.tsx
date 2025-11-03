
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  // Use an effect to ensure we only redirect after auth has been fully checked
  useEffect(() => {
    if (!isLoading) {
      setHasCheckedAuth(true);
    }
  }, [isLoading]);
  
  // Don't render anything until we've completed the initial auth check
  if (!hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If no user is logged in, redirect to login page
  if (!user) {
    console.log("No user detected, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  console.log("User authenticated, rendering protected content");
  // If user is logged in, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
