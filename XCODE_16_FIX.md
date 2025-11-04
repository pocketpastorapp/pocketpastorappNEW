# Xcode 16 Build Fix for Capacitor 7

If you're experiencing build errors in Xcode 16 (version 26.x) with Capacitor 7.x, this is due to stricter module verification in the new Xcode build system.

## The Issue

You may see errors like:
```
error: Clang dependency scanner failure: While building module 'Cordova'
error: 'CDVInvokedUrlCommand.h' file not found with <angled> include
error: Unable to find module dependency: 'Capacitor'
```

## The Fix

The [ios/App/Podfile](ios/App/Podfile) has been updated with a workaround that disables strict module verification for Capacitor pods. This is already applied to your project.

## If Build Still Fails in Xcode

If you still see build errors after opening the project, follow these steps:

### 1. Clean the Build
In Xcode:
- Go to **Product** → **Clean Build Folder** (or press ⇧⌘K)

### 2. Clear Derived Data
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/App-*
```

### 3. Reinstall Pods
```bash
cd ios/App
pod deintegrate
pod install
```

### 4. Rebuild
```bash
cd ../..
npm run cap:sync:ios
```

Then open in Xcode and build again:
```bash
npm run cap:open:ios
```

## Android

Android builds should work without issues. If you encounter problems:

```bash
npm run cap:sync:android
npm run cap:open:android
```

Then in Android Studio:
- File → Invalidate Caches / Restart
- Build → Clean Project
- Build → Rebuild Project

## Alternative: Use Capacitor 6

If Xcode 16 continues to cause issues, you can downgrade to Capacitor 6 which has better compatibility:

```bash
npm uninstall @capacitor/android @capacitor/ios @capacitor/cli @capacitor/core @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/splash-screen @capacitor/status-bar

npm install @capacitor/android@6 @capacitor/ios@6 @capacitor/cli@6 @capacitor/core@6 @capacitor/app@6 @capacitor/haptics@6 @capacitor/keyboard@6 @capacitor/splash-screen@6 @capacitor/status-bar@6

rm -rf ios android
npx cap add ios
npx cap add android
npm run cap:sync
```

Note: You may need to adjust some APIs as Capacitor 6 has slight differences from version 7.

## Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Capacitor GitHub Issues](https://github.com/ionic-team/capacitor/issues)
- [Apple Developer Forums](https://developer.apple.com/forums/)
