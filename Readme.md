1.  Execute below command
Install node 22 LTS
2. 
npm install -g react-native-cli

3.
npm install -g expo-cli

4. npx create-expo-app@latest ShopkeeperApp

expo 52.0.44

5. cd ShopKepperApp

npm install

6. npm start

7.(Optional first time) npm run reset-project


-------------------------------------------------------------
Setting up styling

npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context


npx tailwindcss init


update tailwind.config.js as per tailwindcss documenation
https://www.nativewind.dev/getting-started/installation

create global.css file   (import tailwind presets here)
create babel.config.js   (old broswer javascript compiler)

npx expo customize metro.config.js 

override metro.config.js from documentaiotn nativewind

create nativewind-env.d.ts  add below liine. this will prevent error messages getting in repo. This will enable typescript to recongize tailwind CSS classes 
/// <reference types="nativewind/types" />

Update metro.config.js file to point to correct globals.css path 
-----------------------
close all files openn terminal 
npx expo start --clear


Installed exetension such as 
 ES7+ React/Redux/React-Native snippets
 intellisense for tailwind css
 

 npm install @react-native-picker/picker
 @react-native-community/checkbox

 
 npm install react-native-draggable-flatlist

 ------------------------------------
 For authentication 
 Go to the Firebase Console.
Create a new project.
Enable Authentication in the Firebase Console.
Add Google as a sign-in provider (optional).
Add your app's configuration to your project.

 npm install firebase

npm install @react-native-async-storage/async-storage


# npm install qrcode
# npm install --save-dev @types/qrcode

npm install react-native-qrcode-svg


TODO List
| Priority | Task                                                          | ETA       |
| -------- | ------------------------------------------------------------- | --------- |
| 1        | Cloud Function: generate QR code                              | 2–3 hrs   |
| 2        | Shopkeeper app: call QR function                              | 1.5–2 hrs |
| 3        | Shopkeeper app: set form fields per counter                   | 3–4 hrs   |
| 4        | Shopkeeper app: set number of people per counter              | 1–1.5 hrs |
| 5        | Shopkeeper app: add MPIN for core settings modification       | 1.5–2 hrs |
| 6        | Customer form app (new repo) – dynamic form                   | 6–8 hrs   |
| 7        | Shopkeeper app: show queue + actions (done, move, drag, etc.) | 5–7 hrs   |
| 8        | (Optional) Announce next name via Text-to-Speech              | 1–1.5 hrs |
