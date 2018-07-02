import { Component, Renderer } from '@angular/core';
import { Platform, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  private PincodeChallengeHandler: any

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, renderer: Renderer, public appCtrl: App, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // register mfp init function after plugin loaded 
    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      console.log('--> MobileFirst API plugin init complete');
      this.MFPInitComplete();
    });
  }

  // MFP Init complete function
  MFPInitComplete() {
    console.log('--> MFPInitComplete function called');
    this.registerChallengeHandler();  // register a ChallengeHandler callback for PinCodeAttempts security check
  }

  registerChallengeHandler() {
    this.PincodeChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("PinCodeAttempts");
    this.PincodeChallengeHandler.handleChallenge = ((challenge: any) => {
      console.log('--> PincodeChallengeHandler.handleChallenge called');
      this.displayLoginChallenge(challenge);
    });
  }

  displayLoginChallenge(response) {
    if (response.errorMsg) {
      var msg = response.errorMsg + ' <br> Remaining attempts: ' + response.remainingAttempts;
      console.log('--> displayLoginChallenge ERROR: ' + msg);
    }
    let prompt = this.alertCtrl.create({
      title: 'MFP Gateway',
      message: msg,
      inputs: [
        {
          name: 'pin',
          placeholder: 'please enter the pincode',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('PincodeChallengeHandler: Cancel clicked');
            this.PincodeChallengeHandler.Cancel();
            prompt.dismiss();
            return false 
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log('PincodeChallengeHandler', data.username);
            this.PincodeChallengeHandler.submitChallengeAnswer(data);
          }
        }
      ]
    });
    prompt.present();
  }

}