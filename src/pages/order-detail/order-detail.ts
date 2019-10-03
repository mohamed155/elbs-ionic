// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { AlertProvider } from '../../providers/alert/alert';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Http } from '@angular/http';
import { ProductDetailPage } from '../product-detail/product-detail';


@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  order: { [k: string]: any } = {};;
  constructor(
    public navCtrl: NavController,
    public config: ConfigProvider,
    public navParams: NavParams,
    public http: Http,
    public shared: SharedDataProvider,
    public alert: AlertProvider,
    public loading: LoadingProvider) {
    this.order = this.navParams.get('data');
    //console.log(this.order);
  }
  getSingleProductDetail(id) {
    this.loading.show();

    var data: { [k: string]: any } = {};
    if (this.shared.customerData != null)
      data.customers_id = this.shared.customerData.customers_id;
    else
      data.customers_id = null;
    data.products_id = id;
    data.language_id = this.config.langId;
    this.http.post(this.config.url + 'getAllProducts', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        this.navCtrl.push(ProductDetailPage, { data: data.product_data[0] });
      }
    });
  }
  ionViewDidLoad() {
    this.order = this.navParams.get('data');
  }

}
