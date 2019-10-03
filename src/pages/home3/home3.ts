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
import { ProductsPage } from '../products/products';
import { NavController, Content } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home3',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms', style({ opacity: 1}))
        ]),
        transition(':leave', [
          style({ opacity: 1}),
          animate('700ms', style({opacity: 0}))
        ])
      ]
    )
  ], 
  templateUrl: 'home3.html',
})

export class Home3Page {
  @ViewChild(Content) content: Content;
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    translate: TranslateService) {
  }
  openProducts(value){
    this.navCtrl.push(ProductsPage, { sortOrder: value });
  }
  ngAfterViewChecked(){
    this.content.resize(); 
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
