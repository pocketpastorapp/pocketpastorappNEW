
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { enableIOSScrollOptimizations } from './utils/mobileUtils'
import { App as CapacitorApp } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'

// Initialize iOS-specific optimizations
enableIOSScrollOptimizations();

// Initialize Capacitor plugins for native platforms
if (Capacitor.isNativePlatform()) {
  // Set status bar to not overlay content
  StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {
    console.log('StatusBar overlay not available on this platform');
  });
  // Note: StatusBar style is managed by theme-provider based on light/dark mode

  // Handle keyboard behavior
  Keyboard.setAccessoryBarVisible({ isVisible: false }).catch(() => {
    console.log('Keyboard not available on this platform');
  });

  // Hide splash screen after app is loaded
  SplashScreen.hide().catch(() => {
    console.log('SplashScreen not available on this platform');
  });

  // Handle app state changes
  CapacitorApp.addListener('appStateChange', ({ isActive }) => {
    console.log('App state changed. Is active:', isActive);
  });

  // Handle back button on Android
  CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      CapacitorApp.exitApp();
    } else {
      window.history.back();
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
