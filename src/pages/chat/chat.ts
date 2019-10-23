import {Component} from "@angular/core";
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {ConfigProvider} from "../../providers/config/config";
import {Http} from "@angular/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  customers_id = '';
  messages = [];
  receiver:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public loadingCtrl: LoadingController,
    public http: Http,
    public alertCtrl: AlertController
  ) {
    this.customers_id = this.navParams.get('customer_id');
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.get(`${config.url}chats/show?sender=${shared.customerData.customers_id}&receiver=${this.customers_id}`)
      .map(res => res.json())
      .subscribe(data => {
        this.messages = data.message;
        this.receiver = data.receiver;
        loader.dismiss();
      }, () => {
        this.alertCtrl.create({
          title: "Server Error",
          message: "Can not connect to server",
          buttons: ['Ok']
        }).present();
      });
  }

  send(form: NgForm) {
    this.http.post(`${this.config.url}chats?sender=${this.shared.customerData.customers_id}&receiver=${this.receiver.customers_id}&body=${form.value.msg}`, {})
      .map(res => res.json())
      .subscribe(data => {
        this.messages = [data, ...this.messages];
        form.reset();
      });
  }

}
