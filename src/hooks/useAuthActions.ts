
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { EmailService } from "@/services/emailService";
import { securityLogger, validateEmail, sanitizeInput } from "@/utils/securityUtils";

export const useAuthActions = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    
    // Enhanced input validation
    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }
    
    // Log login attempt
    securityLogger.logEvent({
      type: 'login_attempt',
      email: sanitizedEmail
    });

    // Check if user is rate limited
    if (securityLogger.isRateLimited(sanitizedEmail)) {
      toast.error("Too many failed login attempts. Please try again in 15 minutes.");
      setIsLoading(false);
      return;
    }

    // Check for suspicious activity
    if (securityLogger.detectSuspiciousActivity(sanitizedEmail)) {
      toast.error("Suspicious activity detected. Please try again later.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Clear any existing session before attempting login
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      
      if (error) {
        // Log failed login
        securityLogger.logEvent({
          type: 'login_failure',
          email: sanitizedEmail,
          details: { error: error.message.substring(0, 100) }
        });
        
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please check your email and click the confirmation link before logging in.");
        } else if (error.message.includes("Too many requests")) {
          toast.error("Too many login attempts. Please wait before trying again.");
        } else {
          toast.error("Login failed. Please try again.");
        }
        throw error;
      }

      // Log successful login
      securityLogger.logEvent({
        type: 'login_success',
        email: sanitizedEmail
      });

      // Clear any previous failed attempts for this user
      securityLogger.clearUserEvents(sanitizedEmail);

      toast.success("Welcome back!");
      
      // Get intended destination from location state or default to chat
      const from = location.state?.from?.pathname || '/chat';
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, gender?: string) => {
    setIsLoading(true);
    
    // Enhanced input validation
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    
    if (!validateEmail(sanitizedEmail)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!sanitizedName || sanitizedName.length < 2 || sanitizedName.length > 100) {
      toast.error("Name must be between 2 and 100 characters.");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 12) {
      toast.error("Password must be at least 12 characters for better security.");
      setIsLoading(false);
      return;
    }
    
    // Log registration attempt
    securityLogger.logEvent({
      type: 'registration_attempt',
      email: sanitizedEmail
    });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            name: sanitizedName,
            gender: gender
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Please try logging in instead.");
        } else if (error.message.includes("Password should be")) {
          toast.error("Password does not meet security requirements. Please choose a stronger password.");
        } else if (error.message.includes("Signup is disabled")) {
          toast.error("New registrations are temporarily disabled. Please try again later.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
        throw error;
      }

      // Log successful registration
      securityLogger.logEvent({
        type: 'registration_success',
        email: sanitizedEmail
      });

      // Send welcome email
      if (data.user) {
        try {
          await EmailService.sendWelcomeEmail(sanitizedEmail, sanitizedName);
          console.log("Welcome email sent successfully");
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't fail registration if email fails
        }
      }

      toast.success("Account created successfully! Check your email for a welcome message.");
      navigate('/chat');
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Log logout
      securityLogger.logEvent({
        type: 'logout'
      });

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Clear security events and activity tracking
      localStorage.removeItem('pocket-pastor-security-events');
      localStorage.removeItem('pocket-pastor-last-activity');
      
      toast.info("You've been logged out");
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    login,
    register,
    logout
  };
};
