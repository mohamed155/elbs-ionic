import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController} from "ionic-angular";
import {NgForm} from "@angular/forms";
import {Http} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {SharedDataProvider} from "../../providers/shared-data/shared-data";

@Component({
  selector: 'page-cancel-order',
  templateUrl: 'cancel-order.html'
})
export class CancelOrderPage {

  orders = [];

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public alertCtrl: AlertController
  ) {
    const loader = this.loadingCtrl.create();
    loader.present();
    var data: { [k: string]: any } = {};
    data.customers_id = this.shared.customerData.customers_id;
    data.language_id = this.config.langId;
    this.http.post(this.config.url + 'getOrders', data).map(res => res.json()).subscribe(data => {
        if (data.success == 1) {
          this.orders = [];
          this.orders = data.data;
          loader.dismiss();
        }
      },
      function (response) {
        // this.alert.show("Server Error while Loading Orders");
        console.log(response);
        loader.dismiss();
        alertCtrl.create({
          title: "Server Error",
          message: "Server Error while Loading Orders",
          buttons: ['Ok']
        }).present();
      });
  }

  onSubmit(form: NgForm) {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.post(this.config.url + 'supports/add', {
      ...form.value,
      customer_id: this.shared.customerData.customers_id
    }).map(res => res.json())
      .subscribe(data => {
        loader.dismiss();
        if (data.id) {
          this.alertCtrl.create({
            title: "Success",
            message: "Your message has been submitted",
            buttons: ['Ok']
          }).present();
          this.navCtrl.pop();
        } else {
          this.alertCtrl.create({
            title: "Failed",
            message: "Your message has not been submitted",
            buttons: ['Ok']
          }).present();
        }
      }, err => {
        loader.dismiss();
        this.alertCtrl.create({
          title: "Server Error",
          message: "Server Error while Loading Orders",
          buttons: ['Ok']
        }).present();
      })
  }

}
