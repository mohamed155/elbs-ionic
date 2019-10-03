// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { OrderPage } from '../order/order';


@Component({
  selector: 'page-shipping-method',
  templateUrl: 'shipping-method.html',
})
export class ShippingMethodPage {
  shippingMethod = new Array;
  selectedMethod = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    public http: Http,
    public config: ConfigProvider,
    public loading: LoadingProvider,
  ) {
    this.loading.show();
    var data: { [k: string]: any } = {};
    data.tax_zone_id = this.shared.orderDetails.tax_zone_id;
    // data.shipping_method = this.shared.orderDetails.shipping_method;
    // data.shipping_method = 'upsShipping';
    // data.shipping_method_code = this.shared.orderDetails.shipping_method_code;
    data.state = this.shared.orderDetails.delivery_state;
    data.city = this.shared.orderDetails.delivery_city;
    data.country_id = this.shared.orderDetails.delivery_country_id;
    data.postcode = this.shared.orderDetails.delivery_postcode;
    data.zone = this.shared.orderDetails.delivery_zone;
    data.street_address = this.shared.orderDetails.delivery_street_address;
    data.products_weight = this.calculateWeight();
    data.products_weight_unit = 'g'
    data.products = this.shared.cartProducts;
    data.language_id = config.langId;
    this.http.post(this.config.url + 'getRate', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        var m = data.data.shippingMethods;
        this.shippingMethod = Object.keys(m).map(function (key) { return m[key]; });
        this.shared.orderDetails.total_tax = data.data.tax;
      }
    });
  }
  //================================================================================
  //calcualting products total weight
  calculateWeight = function () {
    var pWeight = 0;
    var totalWeight = 0;
    for (let value of this.shared.cartProducts) {
      pWeight = parseFloat(value.weight);
      if (value.unit == 'kg') {
        pWeight = parseFloat(value.weight) * 1000;
      }
      //  else {
      totalWeight = totalWeight + pWeight
      //   }
      //  console.log(totalWeight);
    }
    return totalWeight;
  };
  setMethod(data) {
    this.selectedMethod = false;
    this.shared.orderDetails.shipping_cost = data.rate;
    this.shared.orderDetails.shipping_method = data.name + '(' + data.shipping_method + ')';
    // console.log(this.shared.orderDetails);
  }
  openOrderPage() {
    this.navCtrl.push(OrderPage);
  }
}
