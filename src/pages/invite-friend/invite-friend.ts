import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController} from 'ionic-angular';

import {SharedDataProvider} from '../../providers/shared-data/shared-data';
import {ConfigProvider} from '../../providers/config/config';
import {NgForm} from "@angular/forms";
import {Http} from "@angular/http";

@Component({
  selector: 'page-invite-friend',
  templateUrl: 'invite-friend.html',
})
export class InviteFriendPage {

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public loadingCtrl: LoadingController,
    public http: Http,
    public alertCtrl: AlertController
  ) {

  }

  onSubmit(form: NgForm) {
    const loader = this.loadingCtrl.create();
    loader.present();
    const sentEmail = form.value.to_email;
    this.http.get(this.config.url + `invitation/send/email?customer_id=${this.shared.customerData.customers_id}&to_email=${sentEmail}`)
      .map(res => res.json())
      .subscribe(data => {
        loader.dismiss();
        if (data == 'invitation sent') {
          this.alertCtrl.create({
            title: 'Invitation sent',
            message: "invitation sent successfully",
            buttons: ['Ok']
          }).present();
          this.navCtrl.pop();
        } else {
          this.alertCtrl.create({
            title: 'Invitation failed',
            message: "invitation was not sent",
            buttons: ['Ok']
          }).present();
        }
      },
        (err) => {
          loader.dismiss();
          this.alertCtrl.create({
            title: 'Invitation failed',
            message: "invitation was not sent, Check your network",
            buttons: ['Ok']
          }).present();
        });
  }

}
