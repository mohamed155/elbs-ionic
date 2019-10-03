// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { SubCategories3Page } from '../sub-categories3/sub-categories3';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';



@Component({
  selector: 'page-categories3',
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
  templateUrl: 'categories3.html',
})
export class Categories3Page {

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider
  ) {

  }
  openSubCategories(parent) {
    this.navCtrl.push(SubCategories3Page, { 'parent': parent });
  }
  openCart() {
    this.navCtrl.push(CartPage);
}
openSearch() {
    this.navCtrl.push(SearchPage);
}
ionViewWillEnter() {
  if (this.config.admob == 1) this.shared.showAd();
}
}

