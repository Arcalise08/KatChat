# Kat Chat
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

# Install
Clone git repository with
```
https://github.com/Arcalise08/KatChat.git
```
Install project dependencies with: 
```
npm i 
```

Expo cli is also required for this project:
```
npm i -g expo-cli
```
Before starting make sure you plug up your firestore credentials in the App.js file:
```
      const firebaseConfig = {
          apiKey: 
          authDomain: 
          databaseURL: 
          projectId: 
          storageBucket:
          messagingSenderId:
          appId: 
          measurementId:
      };
```

Firebase will give you the credentials needed for it.
# IMPORTANT: 
Make collections in the firebase database for **contacts** and **messages**


![Firebase Collection](https://i.imgur.com/x34vHOO.png)

and make sure to allow for **Anonymous** sign in.(You can do that from the firebase console)

![Firebase Collection](https://i.imgur.com/1OYKHc3.png)

# Test 
### tested on
* android studio
* expo client
* expo webserver

For all test cases you only need to type 
```
expo start
```
It should open a webpage with all options. I personally dont recommend using the webserver. Expo works best on a real phone.

Creating a new AVD emulator on android studio also works well. 

### Android Studio
* Start Android studio
* Click **Tools**
* Click **AVD Manager**
* Click **Create Virtual Device**
* Follow the prompt to create a new device then start it and go back to the expo dev kit and click **Run on Android Device/Emulator**

### Expo Client
* Download expo client from your devices app store.
* Start the app and click **Scan QR Code**
* Use your devices camera to scan the QR code displayed on expos dev kit.
* Sometimes it requires several tries for this to work appropriately. if it doesnt work on the first try just open your devices activity bar and you should see expos tab. Click the refresh button to try again.

Any issues or bugs can be reported here or to the author directly. 
[Arcalise08](https://github.com/Arcalise08)
