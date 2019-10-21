// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {ConfigProvider} from '../../providers/config/config';
import {Http} from '@angular/http';
import {LoadingProvider} from '../../providers/loading/loading';
import {SharedDataProvider} from '../../providers/shared-data/shared-data';


@Component({
  selector: 'page-select-zones',
  templateUrl: 'select-zones.html',
})
export class SelectZonesPage {

  searchQuery: string = '';
  items;
  zones = new Array;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              public config: ConfigProvider,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public loading: LoadingProvider,
              public shared: SharedDataProvider,) {

    loading.show();
    let page = this.navParams.get('page');
    let id = this.navParams.get('id');
    var data = page == 'editShipping' ? {governorate_id: id} : shared.orderDetails.delivery_country_id
      ? {governorate_id: shared.orderDetails.delivery_country_id}
      : {governorate_id: shared.tempdata.entry_country_id};
    http.post(this.config.url + 'governorates/show/areas', data).map(res => res.json()).subscribe(data => {
      loading.hide();
      this.items = this.zones = data.areas;
    });
  }

  initializeItems() {
    this.items = this.zones
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectZone(c) {
    if (this.navParams.get('page') == 'shipping') {
      if (c == 'other') {
        //  console.log(c);
        this.shared.orderDetails.delivery_zone = 'other';
        this.shared.orderDetails.delivery_state = 'other';
        this.shared.orderDetails.tax_zone_id = null;
      } else {
        this.shared.orderDetails.delivery_zone = c.name;
        this.shared.orderDetails.delivery_state = c.name;
        this.shared.orderDetails.tax_zone_id = c.id;
      }
    } else if (this.navParams.get('page') == 'editShipping') {
      if (c == 'other') {
        this.shared.tempdata.entry_zone = 'other';
        this.shared.tempdata.entry_zone_id = 0;
      } else {
        this.shared.tempdata.entry_zone = c.name;
        this.shared.tempdata.entry_zone_id = c.id;
      }
    } else {
      if (c == 'other') {
        this.shared.orderDetails.billing_zone = 'other';
        this.shared.orderDetails.billing_state = 'other';
      } else {
        this.shared.orderDetails.billing_zone = c.name;
        this.shared.orderDetails.billing_state = c.name;
      }
    }
    this.dismiss();
  }
}
