// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  formData = {
    customers_email_address: '',
  };
  errorMessage = '';
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loading: LoadingProvider,
    public http: Http,
    public config: ConfigProvider,
    public navParams: NavParams) {
  }
  forgetPassword() {
    this.loading.show();
    this.errorMessage = '';
    this.http.post(this.config.url + 'processForgotPassword', this.formData).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {

        this.dismiss();
      }
      if (data.success == 0) {
        this.errorMessage = data.message;
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
