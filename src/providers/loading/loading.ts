// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ConfigProvider } from '../config/config';
import { OneSignal } from '@ionic-native/onesignal';

@Injectable()
export class LoadingProvider {
  loading;
  constructor(
    public loadingCtrl: LoadingController,
    public config: ConfigProvider,
    private oneSignal: OneSignal
  ) {
      
  }

  show() {
    this.loading = this.loadingCtrl.create({
      duration: 10000
    });
    this.loading.present();
  }
  hide() {
    try {
      this.loading.dismiss();
    } catch (error) { }



  }
  autoHide(time) {
    this.loading = this.loadingCtrl.create({
      duration: time
    });
    this.loading.present();
  }
}
