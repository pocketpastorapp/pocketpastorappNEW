import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    }
  });

  useEffect(() => {
    const checkTokens = async () => {
      try {
        // Check for error parameters first
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.log("Error in URL:", error, errorDescription);
          toast.error("Reset link has expired or is invalid. Please request a new password reset.");
          navigate('/login');
          return;
        }

        // Check for tokens in URL parameters (Supabase magic link format)
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        
        console.log("URL params:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        if (type === 'recovery' && accessToken && refreshToken) {
          console.log("Setting session with tokens from URL");
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error("Error setting session:", error);
            toast.error("Invalid or expired reset link");
            navigate('/login');
            return;
          }
          
          console.log("Session set successfully:", data);
          setIsValidToken(true);
        } else {
          // Check if user is already authenticated (in case they're already logged in)
          const { data: { session } } = await supabase.auth.getSession();
          console.log("Current session:", session);
          
          if (session) {
            setIsValidToken(true);
          } else {
            console.log("No valid session or tokens found");
            toast.error("Invalid or expired reset link. Please request a new password reset.");
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Error checking tokens:", error);
        toast.error("Something went wrong. Please try again.");
        navigate('/login');
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkTokens();
  }, [searchParams, navigate]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-14rem)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Verifying your reset link...
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isValidToken) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-14rem)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Invalid Reset Link</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                This password reset link is invalid or has expired.
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full mt-4"
                style={{ backgroundColor: "#184482" }}
              >
                Return to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-14rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Reset Your Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          {...field}
                          className="focus-visible:ring-pastor-navy"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          {...field}
                          className="focus-visible:ring-pastor-navy"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  style={{ backgroundColor: "#184482" }}
                >
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
