import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController} from 'ionic-angular';

import {SharedDataProvider} from '../../providers/shared-data/shared-data';
import {ConfigProvider} from '../../providers/config/config';
import {NgForm} from "@angular/forms";
import {Http} from "@angular/http";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-invitation',
  templateUrl: 'invitation.html',
})
export class InvitationPage {

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public loadingCtrl: LoadingController,
    public http: Http,
    public alertCtrl: AlertController,
    private storage: Storage,
  ) {

  }

  onSubmit(form: NgForm) {
    const loader = this.loadingCtrl.create();
    loader.present();
    const code = form.value.code;
    this.http.get(this.config.url + `invitation/getUserByCode?user=${code}`)
      .map(res => res.json())
      .subscribe(data => {
          loader.dismiss();
          if (data.customers_id) {
            const req1 = this.http.post(this.config.url + 'points/increase', {
              point_id: this.shared.customerData.points.id,
              count: this.shared.referPoints
            });
            const req2 = this.http.post(this.config.url + 'points/increase', {
              point_id: data.points.id,
              count: this.shared.referPoints
            });
            req1.map(res => res.json())
              .subscribe(data => {
                this.shared.customerData.points = data;
                this.storage.set('customerData', this.shared.customerData);
              });
            Promise.all([req1, req2]).then(() => {
              this.alertCtrl.create({
                title: 'Congratulations',
                message: `You have got ${this.shared.referPoints} Points`,
                buttons: ['Ok']
              }).present();
              this.navCtrl.pop();
            });
          } else {
            this.alertCtrl.create({
              title: 'Something went wrong',
              message: "you did not receive your reward",
              buttons: ['Ok']
            }).present();
          }
        },
        (err) => {
          loader.dismiss();
          this.alertCtrl.create({
            title: 'Something went wrong',
            message: "you did not receive your reward, check your network",
            buttons: ['Ok']
          }).present();
        });
  }

}
