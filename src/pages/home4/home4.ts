// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, Content } from 'ionic-angular';
import { SubCategoriesPage } from '../sub-categories/sub-categories';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-home4',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'home4.html',
})

export class Home4Page {
  @ViewChild(Content) content: Content;
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    translate: TranslateService) {
  }
  openSubCategories(parent) {
    this.navCtrl.push(SubCategoriesPage, { 'parent': parent });
  }
  ngAfterViewChecked() {
    this.content.resize();
  }
  openProducts(value) {
    this.navCtrl.push(ProductsPage, { sortOrder: value });
  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  // ionViewWillEnter() {
  //   if (this.config.admob == 1) this.shared.showAd();
  // }
}
