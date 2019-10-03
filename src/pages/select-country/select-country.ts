// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, Searchbar } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';



@Component({
  selector: 'page-select-country',
  templateUrl: 'select-country.html',
})
export class SelectCountryPage {
  @ViewChild('Searchbar') searchBar: Searchbar;
  searchQuery: string = '';
  items;
  countries = new Array;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider, ) {

    loading.show();
    var data = { type: 'null' };
    http.post(this.config.url + 'getCountries', data).map(res => res.json()).subscribe(data => {
      loading.hide();
      this.items = this.countries = data.data
      setTimeout(() => { this.searchBar.setFocus(); }, 250);
    });
  }

  initializeItems() {
    this.items = this.countries
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.countries_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
  }
  selectCountry(c) {
    if (this.navParams.get('page') == 'shipping') {
      this.shared.orderDetails.delivery_country = c.countries_name;
      this.shared.orderDetails.delivery_country_code = c.countries_id;
      this.shared.orderDetails.delivery_country_id = c.countries_id;
      this.shared.orderDetails.delivery_zone = null;
      this.shared.orderDetails.delivery_state = null;
    }
    else if (this.navParams.get('page') == 'editShipping') {
      this.shared.tempdata.entry_country_id = c.countries_id;
      this.shared.tempdata.entry_country_name = c.countries_name;
      this.shared.tempdata.entry_country_code = c.countries_id;
      this.shared.tempdata.entry_zone = null;
    }
    else {
      this.shared.orderDetails.billing_country = c.countries_name;
      this.shared.orderDetails.billing_country_code = c.countries_id;
      this.shared.orderDetails.billing_country_id = c.countries_id;
      this.shared.orderDetails.billing_zone = null;
      this.shared.orderDetails.billing_state = null;
    }
    this.dismiss();
  }
}
