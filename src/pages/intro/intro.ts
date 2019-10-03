// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { Home2Page } from '../home2/home2';
import { Home3Page } from '../home3/home3';
import { Home4Page } from '../home4/home4';
import { Home5Page } from '../home5/home5';
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  public slides = [
    { image: "assets/intro/1.gif", title: "Home Page", icon: "home", description: "" },
    { image: "assets/intro/2.gif", title: "Category Page", icon: "cart", description: "" },
    { image: "assets/intro/3.gif", title: "Shop Page", icon: "share", description: "" },
    { image: "assets/intro/4.gif", title: "Cart Page", icon: "md-list-box", description: "" },
    { image: "assets/intro/5.gif", title: "Order Page", icon: "md-list-box", description: "" }
  ];

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,) {
    this.slides
  }
  openHomePage() {
    if (this.config.homePage == 1) { this.navCtrl.setRoot(HomePage); }
    if (this.config.homePage == 2) { this.navCtrl.setRoot(Home2Page); }
    if (this.config.homePage == 3) { this.navCtrl.setRoot(Home3Page); }
    if (this.config.homePage == 4) { this.navCtrl.setRoot(Home4Page); }
    if (this.config.homePage == 5) { this.navCtrl.setRoot(Home5Page); }
  }
}
