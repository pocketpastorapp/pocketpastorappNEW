
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import PasswordResetSection from "@/components/auth/PasswordResetSection";
import { usePasswordReset } from "@/hooks/usePasswordReset";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const { isResettingPassword, resetEmailSent, handlePasswordReset, resetPasswordResetState } = usePasswordReset();
  
  const getEmailRef = useRef<(() => string) | undefined>();
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password, values.rememberMe);
      // Reset failed attempts on successful login
      setFailedAttempts(0);
      setShowPasswordReset(false);
      resetPasswordResetState();
      // Navigation happens in the auth context
    } catch (error) {
      // Increment failed attempts on login error
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= 5) {
        setShowPasswordReset(true);
      }
      
      console.error("Login error:", error);
    }
  };

  const handlePasswordResetClick = () => {
    const email = getEmailRef.current?.() || "";
    handlePasswordReset(email);
    setShowPasswordReset(false);
    setFailedAttempts(0);
  };
  
  return (
    <Layout showFooter={true}>
      <div className="flex justify-center items-center min-h-[calc(100vh-14rem)]">
        <Card className="w-full max-w-md">
          <LoginHeader />
          <CardContent className="space-y-4">
            <LoginForm 
              isLoading={isLoading}
              onSubmit={onSubmit}
              getEmailValue={getEmailRef}
            />

            <PasswordResetSection
              showPasswordReset={showPasswordReset}
              resetEmailSent={resetEmailSent}
              isResettingPassword={isResettingPassword}
              failedAttempts={failedAttempts}
              onPasswordReset={handlePasswordResetClick}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="underline-offset-4 hover:underline" style={{ color: "#184482" }}>
                Create one
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
