
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { ChatProvider } from "@/context/chat-context";
import { DEFAULT_BUBBLE_COLORS } from "./components/chat/ChatSettings";
import { Suspense, useEffect, lazy } from "react";
import { preventZoomOnInput } from "@/utils/mobileUtils";
import ErrorBoundary from "@/components/ErrorBoundary";
import ChatErrorBoundary from "@/components/ChatErrorBoundary";
import BibleErrorBoundary from "@/components/BibleErrorBoundary";
import { PageSkeleton } from "@/components/skeletons/PageSkeleton";
import ProductionErrorBoundary from "@/components/ProductionErrorBoundary";
import Analytics from "@/components/Analytics";
import DisclaimerModal from "@/components/DisclaimerModal";
import { useDisclaimerModal } from "@/hooks/useDisclaimerModal";
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const FavoriteDetailPage = lazy(() => import("./pages/FavoriteDetailPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const SessionDetailPage = lazy(() => import("./pages/SessionDetailPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AccountSettingsPage = lazy(() => import("./pages/AccountSettingsPage"));
const CreditsPage = lazy(() => import("./pages/CreditsPage"));
const BiblePage = lazy(() => import("./pages/BiblePage"));
const BibleReadPage = lazy(() => import("./pages/BibleReadPage"));
const BibleSearchPage = lazy(() => import("./pages/BibleSearchPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
import ProtectedRoute from "./components/ProtectedRoute";

// Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppContent = () => {
  const { showModal, handleAcceptDisclaimer } = useDisclaimerModal();

  return (
    <>
      <Analytics />
      <Toaster />
      <Sonner />
      <DisclaimerModal 
        isOpen={showModal} 
        onAccept={handleAcceptDisclaimer} 
      />
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<PageSkeleton />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<PageSkeleton />}>
            <LoginPage />
          </Suspense>
        } />
        <Route path="/register" element={
          <Suspense fallback={<PageSkeleton />}>
            <RegisterPage />
          </Suspense>
        } />
        <Route path="/reset-password" element={
          <Suspense fallback={<PageSkeleton />}>
            <ResetPasswordPage />
          </Suspense>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <ChatErrorBoundary>
                <ChatProvider>
                  <ChatPage bubbleColors={DEFAULT_BUBBLE_COLORS} />
                </ChatProvider>
              </ChatErrorBoundary>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/chatbot" element={
          <ProtectedRoute>
            <Navigate to="/chat" replace />
          </ProtectedRoute>
        } />
        <Route path="/bible" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <BibleErrorBoundary>
                <BiblePage />
              </BibleErrorBoundary>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/bible/read" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <BibleErrorBoundary>
                <BibleReadPage />
              </BibleErrorBoundary>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/bible/search" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <BibleErrorBoundary>
                <BibleSearchPage />
              </BibleErrorBoundary>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <FavoritesPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/favorites/:messageId" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <FavoriteDetailPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <HistoryPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/history/:sessionId" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <SessionDetailPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <SettingsPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/account-settings" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <AccountSettingsPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/credits" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <CreditsPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/privacy-policy" element={
          <Suspense fallback={<PageSkeleton />}>
            <PrivacyPolicyPage />
          </Suspense>
        } />
        <Route path="/terms-of-service" element={
          <Suspense fallback={<PageSkeleton />}>
            <TermsOfServicePage />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<PageSkeleton />}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<PageSkeleton />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </>
  );
};

const App = () => {
  useEffect(() => {
    // Mobile optimizations
    preventZoomOnInput();
    
    // Add CSS custom properties for safe area insets
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --safe-area-inset-top: env(safe-area-inset-top);
        --safe-area-inset-bottom: env(safe-area-inset-bottom);
        --safe-area-inset-left: env(safe-area-inset-left);
        --safe-area-inset-right: env(safe-area-inset-right);
      }
      
      body {
        padding-top: var(--safe-area-inset-top);
        padding-bottom: var(--safe-area-inset-bottom);
        padding-left: var(--safe-area-inset-left);
        padding-right: var(--safe-area-inset-right);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ProductionErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="pocket-pastor-theme">
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
                <AppContent />
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ProductionErrorBoundary>
  );
};

export default App;
