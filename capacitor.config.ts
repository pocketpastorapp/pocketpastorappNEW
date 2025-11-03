import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pocketpastor.app',
  appName: 'Pocket Pastor',
  webDir: 'dist',
  server: {
    url: 'https://1f308cc7-bdfb-4958-ae31-49166bb2794e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
