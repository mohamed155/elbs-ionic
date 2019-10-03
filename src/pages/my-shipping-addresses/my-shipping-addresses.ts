// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { EditShippingAddressPage } from '../edit-shipping-address/edit-shipping-address';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-my-shipping-addresses',
  templateUrl: 'my-shipping-addresses.html',
})
export class MyShippingAddressesPage {
  allShippingAddress = new Array;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    translate: TranslateService,
    public modalCtrl: ModalController,
    public alert: AlertProvider,
    public loading: LoadingProvider) {


  }

  getAllAddress() {
    this.loading.show();
    var data = { customers_id: this.shared.customerData.customers_id };
    this.http.post(this.config.url + 'getAllAddress', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        this.allShippingAddress = data.data;
      }
    });
  }

  //============================================================================================  
  // delete shipping address
  deleteAddress = function (id) {
    this.loading.show();
    var data = {
      customers_id: this.shared.customerData.customers_id,
      address_book_id: id
    };
    this.http.post(this.config.url + 'deleteShippingAddress', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        this.getAllAddress();
      }
    }, function (response) {
      this.loading.hide();
      this.alert.show("Error server not reponding");
    });
  };

  //============================================================================================  
  // default shipping address
  defaultAddress = function (id) {
    this.loading.show();
    var data = {
      customers_id: this.shared.customerData.customers_id,
      address_book_id: id
    };
    this.http.post(this.config.url + 'updateDefaultAddress', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        this.getAllAddress();
      }
    }, function (response) {
      this.loading.hide();
      this.alert.show("Error server not reponding");
    });
  };
  openEditShippingPage(data) {
    let modal = this.modalCtrl.create(EditShippingAddressPage, { data: data, type: 'update' });
    modal.present();
    modal.onDidDismiss(() => {
      this.getAllAddress();
    });
  }
  addShippingAddress() {
    let modal = this.modalCtrl.create(EditShippingAddressPage, { type: 'add' });
    modal.onDidDismiss(() => {
      this.getAllAddress();
    });
    modal.present();
  }
  ionViewWillEnter() { this.getAllAddress(); }
  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}
