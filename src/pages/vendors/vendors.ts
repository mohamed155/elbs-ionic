import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {ConfigProvider} from "../../providers/config/config";
import {CartPage} from "../cart/cart";
import {VendorPage} from "../vendor/vendor";

@Component({
  selector: 'page-vendors',
  templateUrl: 'vendors.html',
})
export class VendorsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public shared: SharedDataProvider,
              public config: ConfigProvider
  ) {

  }

  openCart() {
    this.navCtrl.push(CartPage);
  }

  openVendor(vendor) {
    this.navCtrl.push(VendorPage, {vendor});
  }

}
