// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermServicesPage } from '../term-services/term-services';
import { RefundPolicyPage } from '../refund-policy/refund-policy';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public config: ConfigProvider,
    public navParams: NavParams,
    public loading: LoadingProvider,
    public iab: InAppBrowser,
    translate: TranslateService) {
  }
  showModal(value) {
    if (value == 'privacyPolicy') {
      let modal = this.modalCtrl.create(PrivacyPolicyPage);
      modal.present();
    }
    else if (value == 'termServices') {
      let modal = this.modalCtrl.create(TermServicesPage);
      modal.present();
    }
    else {
      let modal = this.modalCtrl.create(RefundPolicyPage);
      modal.present();
    }
  }
  openSite(){
    this.loading.autoHide(2000);
    this.iab.create(this.config.siteUrl,"blank");
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
