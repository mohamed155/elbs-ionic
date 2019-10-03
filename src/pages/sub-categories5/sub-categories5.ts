// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { ProductsPage } from '../products/products';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-sub-categories5',
  templateUrl: 'sub-categories5.html',
})
export class SubCategories5Page {
  parent;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    public config: ConfigProvider) {
    this.parent = navParams.get("parent");
  }
  
  openProducts(id, name) {
    this.navCtrl.push(ProductsPage, { id: id, name: name, sortOrder: 'newest' });
  }
  openCart() {
    this.navCtrl.push(CartPage);
}
openSearch() {
    this.navCtrl.push(SearchPage);
}
}
