import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    "appId": "com.sudiomary.ExpenseIncomeBook",
    "appName": "ExpenseBook",
    "bundledWebRuntime": false,
    "webDir": "www",
    "plugins": {
      "SplashScreen": {
        "launchShowDuration": 0
      },
      "GoogleAuth": {
        "scopes": [
          "profile",
          "email"
        ],
        "serverClientId": "782264422963-ju5hg0iurfcbrarfp4b512qhonft7sad.apps.googleusercontent.com",
        "forceCodeForRefreshToken": true
    },
    "cordova": {}
  }
};

export default config;