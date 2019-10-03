// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { OrderDetailPage } from '../order-detail/order-detail';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';


@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html',
})
export class MyOrdersPage {
  orders = new Array;
  httpRunning = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    translate: TranslateService,
    public alert: AlertProvider,
    public loading: LoadingProvider
  ) {
  }
  getOrders() {
    this.httpRunning = true;
    this.orders = [];
    this.loading.show();
    var data: { [k: string]: any } = {};
    data.customers_id = this.shared.customerData.customers_id;
    data.language_id = this.config.langId;
    this.http.post(this.config.url + 'getOrders', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      this.httpRunning = false;
      //$rootScope.address=response.data.data;
      if (data.success == 1) {
        this.orders = [];
        this.orders = data.data;
      }
      // $scope.$broadcast('scroll.refreshComplete');
    },
      function (response) {
        this.loading.hide();
        this.alert.show("Server Error while Loading Orders");
        console.log(response);
      });
  };

  showOrderDetail(order) {

    this.navCtrl.push(OrderDetailPage, { 'data': order });

  }
  ionViewDidLoad() {
    this.httpRunning = true;
    this.getOrders();
  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}
