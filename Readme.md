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