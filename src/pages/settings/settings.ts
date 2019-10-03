// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LanguagePage } from '../language/language';
import { ConfigProvider } from '../../providers/config/config';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermServicesPage } from '../term-services/term-services';
import { RefundPolicyPage } from '../refund-policy/refund-policy';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { LoginPage } from '../login/login';
import { MyAccountPage } from '../my-account/my-account';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';



@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  setting: { [k: string]: any } = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public config: ConfigProvider,
    private storage: Storage,
    public loading: LoadingProvider,
    public http: Http,
    private localNotifications: LocalNotifications,
    public events: Events,
    public shared: SharedDataProvider,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public plt: Platform,
    private appVersion: AppVersion
  ) {

  }


  turnOnOffNotification(value) {
    if (this.setting.localNotification == false) {
      this.localNotifications.cancel(1).then((result) => {
      });
    }
    else {
      this.localNotifications.schedule({
        id: 1,
        title: this.config.notifTitle,
        text: this.config.notifText,
        every: this.config.notifDuration,
      });
    }

    this.updateSetting();
  }

  updateSetting() {
    console.log(this.setting);
    this.storage.set('setting', this.setting);
  }
  openLoginPage() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
  logOut() {
    this.shared.logOut();
  }
  openPage(page) {
    if (page == 'myAccount') this.navCtrl.push(MyAccountPage);
  }
  openSite() {
    this.loading.autoHide(2000);
    this.iab.create(this.config.siteUrl, "blank");
  }
  //============================================================================================
  //turning on off local  notification
  onOffPushNotification() {
    this.storage.get('registrationId').then((registrationId) => {
      var data: { [k: string]: any } = {};
      data.device_id = registrationId;
      if (this.setting.notification == false) data.is_notify = 0;
      else data.is_notify = 1;
      this.http.post(this.config.url + 'notify_me', data).map(res => res.json()).subscribe(data => {
        if (data.success == 1) {

          this.updateSetting();
        }
      }, function (response) {
        console.log(response);
      });
    });
  };
  hideShowFooterMenu() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }
  hideShowCartButton() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }
  showModal(value) {
    this.loading.autoHide(1000);
    if (value == 'privacyPolicy') {
      let modal = this.modalCtrl.create(PrivacyPolicyPage);
      modal.present();
    }
    else if (value == 'termServices') {
      let modal = this.modalCtrl.create(TermServicesPage);
      modal.present();
    }
    else if (value == 'language') {
      let modal = this.modalCtrl.create(LanguagePage);
      modal.present();
    }
    else {
      let modal = this.modalCtrl.create(RefundPolicyPage);
      modal.present();
    }
  }
  ionViewDidLoad() {
    this.storage.get('setting').then((val) => {
      if (val != null || val != undefined) {
        this.setting = val;

      }
      else {
        this.setting.localNotification = true;
        this.setting.notification = true;
        this.setting.cartButton = true;
        this.setting.footer = true;
      }
    });
  }

  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  rateUs() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.iab.create(this.config.packgeName.toString(), "_system");
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
      });
    }
  }
  share() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.socialSharing.share(
        this.config.packgeName.toString(),
        this.config.appName,
        this.config.packgeName.toString(),
        this.config.packgeName.toString()
      ).then(() => {
      }).catch(() => {

      });
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          this.config.appName,
          this.config.appName,
          "",
          "https://play.google.com/store/apps/details?id=" + val
        ).then(() => {

        }).catch(() => {
        });
      });
    }
  }
  showAd() {
    this.loading.autoHide(2000);
    this.events.publish('showAd');
  }
}
