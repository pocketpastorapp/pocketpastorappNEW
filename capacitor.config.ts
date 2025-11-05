import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pocketpastor.app',
  appName: 'Pocket Pastor',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
    },
    StatusBar: {
      style: 'Light',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'light',
      resizeOnFullScreen: true,
    },
    InAppBilling: {
      // Product IDs for iOS and Android in-app purchases
      productIds: [
        'com.pocketpastor.credits_5',
        'com.pocketpastor.credits_30',
        'com.pocketpastor.credits_75',
        'com.pocketpastor.credits_150',
        'com.pocketpastor.credits_300',
      ],
    },
  },
  ios: {
    contentInset: 'automatic',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
