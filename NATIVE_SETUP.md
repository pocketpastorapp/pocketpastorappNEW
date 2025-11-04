# Native iOS and Android Setup

Your Pocket Pastor app is now configured to run natively on iOS and Android using Capacitor.

## Prerequisites

### For iOS Development
- macOS with Xcode installed
- Xcode Command Line Tools: `xcode-select --install`
- CocoaPods: `sudo gem install cocoapods`

### For Android Development
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK) 11 or newer

## Project Structure

```
pocketpastorappNEW/
├── ios/                    # iOS native project
├── android/                # Android native project
├── src/                    # React source code
├── dist/                   # Build output (created on build)
└── capacitor.config.ts     # Capacitor configuration
```

## Available Scripts

### Build and Sync
```bash
# Build web assets and sync all platforms
npm run cap:sync

# Build and sync iOS only
npm run cap:sync:ios

# Build and sync Android only
npm run cap:sync:android
```

### Open Native IDEs
```bash
# Open in Xcode
npm run cap:open:ios

# Open in Android Studio
npm run cap:open:android
```

### Complete Workflow (Build + Sync + Open)
```bash
# iOS
npm run cap:run:ios

# Android
npm run cap:run:android
```

## Running on iOS

1. Build and sync the iOS platform:
   ```bash
   npm run cap:sync:ios
   ```

2. Open in Xcode:
   ```bash
   npm run cap:open:ios
   ```

3. In Xcode:
   - Select your development team in Signing & Capabilities
   - Choose a simulator or connected device
   - Press the Run button (⌘R)

### iOS Simulator
- To run on simulator, select any iOS simulator from the device menu
- No developer account needed for simulator testing

### iOS Device
- Requires Apple Developer account (free or paid)
- Connect your device via USB
- Trust the computer on your device when prompted
- Select your device in Xcode and run

## Running on Android

1. Build and sync the Android platform:
   ```bash
   npm run cap:sync:android
   ```

2. Open in Android Studio:
   ```bash
   npm run cap:open:android
   ```

3. In Android Studio:
   - Wait for Gradle sync to complete
   - Choose an emulator or connected device
   - Click the Run button (▶)

### Android Emulator
- Create an emulator in Android Studio's AVD Manager if needed
- Select the emulator and click Run

### Android Device
- Enable Developer Options on your device
- Enable USB Debugging
- Connect via USB
- Accept the debugging prompt on your device
- Select your device in Android Studio and run

## Installed Capacitor Plugins

Your app includes these native plugins:

- **@capacitor/app** - App lifecycle events and back button handling
- **@capacitor/status-bar** - Status bar styling and color
- **@capacitor/splash-screen** - Native splash screen
- **@capacitor/keyboard** - Keyboard behavior and visibility
- **@capacitor/haptics** - Haptic feedback support

## Configuration

The app is configured in [capacitor.config.ts](capacitor.config.ts):

- **App ID**: `com.pocketpastor.app`
- **App Name**: Pocket Pastor
- **Web Directory**: `dist`
- **Splash Screen**: 2 second duration, blue background (#184482)
- **Status Bar**: Dark style with blue background
- **Keyboard**: Dark style, resizes body

## Development Workflow

1. Make changes to your React code in `src/`
2. Build the web assets: `npm run build`
3. Sync with native platforms: `npx cap sync`
4. Open and run in Xcode or Android Studio

### Quick Iteration
For faster development, you can use live reload:

1. Start the dev server: `npm run dev`
2. Update `capacitor.config.ts` to add:
   ```typescript
   server: {
     url: 'http://YOUR_LOCAL_IP:8080',
     cleartext: true
   }
   ```
3. Sync and run the app
4. Changes will reflect automatically (except native code changes)

**Remember to remove the server config before production builds!**

## Troubleshooting

### iOS Issues
- **Build failures**: Clean build folder in Xcode (⇧⌘K) and rebuild
- **Pod install errors**: Run `cd ios/App && pod install --repo-update`
- **Code signing**: Ensure you've selected a development team in Xcode

### Android Issues
- **Gradle sync fails**: Check that Android SDK is properly installed
- **Build errors**: File → Invalidate Caches / Restart in Android Studio
- **Device not detected**: Check USB debugging is enabled

### General Issues
- **White screen**: Check browser console in Safari/Chrome DevTools
- **Old content showing**: Run `npm run cap:sync` to copy latest build
- **Plugin not working**: Ensure plugin is installed and synced

## App Store Submission

### iOS App Store
1. Configure app in App Store Connect
2. Update version and build number in Xcode
3. Archive the app (Product → Archive)
4. Upload to App Store Connect
5. Submit for review

### Google Play Store
1. Create app in Google Play Console
2. Generate a signed APK/Bundle in Android Studio
3. Upload to Play Console
4. Complete store listing
5. Submit for review

## Native Customization

### App Icons
- **iOS**: Replace icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- **Android**: Replace icons in `android/app/src/main/res/mipmap-*/`

### Splash Screen
- **iOS**: Update `ios/App/App/Assets.xcassets/Splash.imageset/`
- **Android**: Update `android/app/src/main/res/drawable/`

### App Name
- Update in `capacitor.config.ts`
- Run `npx cap sync` to apply changes

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Developer Documentation](https://developer.apple.com/documentation/)
- [Android Developer Documentation](https://developer.android.com/docs)
