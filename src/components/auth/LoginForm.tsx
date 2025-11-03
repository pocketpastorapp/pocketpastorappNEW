
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false)
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  isLoading: boolean;
  onSubmit: (values: LoginFormValues) => void;
  getEmailValue: React.MutableRefObject<(() => string) | undefined>;
}

const LoginForm = ({ isLoading, onSubmit, getEmailValue }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  // Load saved email and remember me preference on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('pocket-pastor-email');
    const savedRememberMe = localStorage.getItem('pocket-pastor-remember-me') === 'true';
    
    if (savedEmail && savedRememberMe) {
      form.setValue('email', savedEmail);
      form.setValue('rememberMe', true);
    }
  }, [form]);

  // Expose getValues method to parent component
  React.useEffect(() => {
    if (getEmailValue) {
      getEmailValue.current = () => form.getValues("email");
    }
  }, [getEmailValue, form]);

  const handleSubmit = (values: LoginFormValues) => {
    // Save or remove email based on remember me preference
    if (values.rememberMe) {
      localStorage.setItem('pocket-pastor-email', values.email);
      localStorage.setItem('pocket-pastor-remember-me', 'true');
    } else {
      localStorage.removeItem('pocket-pastor-email');
      localStorage.removeItem('pocket-pastor-remember-me');
    }
    
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  type="email"
                  autoComplete="username email"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...field}
                    className="focus-visible:ring-pastor-navy pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
              <FormControl>
                <Checkbox 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-[#184482] data-[state=checked]:bg-[#184482] data-[state=checked]:border-[#184482]"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  Remember me
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default LoginForm;
