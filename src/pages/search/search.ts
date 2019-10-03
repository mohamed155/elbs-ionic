// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import { AlertProvider } from '../../providers/alert/alert';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ProductsPage } from '../products/products';
import { CartPage } from '../cart/cart';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  search;
  searchResult = [];
  showCategories = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public alert: AlertProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
  ) {
  }

  onChangeKeyword = function (e) {
    //console.log(this.search);
    // if (search != undefined) {
    //rchResult = [];
    //  }
  }
  getSearchData = function () {

    if (this.search != undefined) {
      if (this.search == null || this.search == '') {
        this.alert.show("Please enter something ");
        return 0;
      }
    }
    else {
      this.alert.show("Please enter something ");
      return 0;
    }
    this.loading.show();
    this.http.post(this.config.url + 'getSearchData', { 'searchValue': this.search }).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        this.searchResult = data.product_data;
        this.showCategories = false;
      }
      if (data.success == 0) {
        this.alert.show(data.message);
      }
    });
  };

  openProducts(id, name) {
    this.navCtrl.push(ProductsPage, { id: id, name: name, sortOrder: 'newest' });
  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
}
