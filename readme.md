# Sharely
(ANDROID ONLY)

This app is intended to be used with Reddit only. it converts the long reddit links to just the image, video or GIF URL 


### How to use

- 'browsing reddit' 
- click share button on a media post
- select "sharely" as the app to share the link too
- sharely will open, and copy the media url to the clipboard, present a toast message saying if it was successful and close.
- paste your url without having a big ugly reddit link! 


### Developer commands
adb devices
npm run android



cd android
./gradlew bundleRelease
./gradlew bundleRelease --build-cache
./gradlew assembleRelease --build-cache
