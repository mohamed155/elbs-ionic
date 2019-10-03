// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { SelectCountryPage } from '../select-country/select-country';
import { SelectZonesPage } from '../select-zones/select-zones';
import { ShippingMethodPage } from '../shipping-method/shipping-method';

@Component({
  selector: 'page-billing-address',
  templateUrl: 'billing-address.html',
})
export class BillingAddressPage {
  defaultAddress = true;
  constructor(
    public navParams: NavParams,
    // public config: ConfigProvider,
    //public http: Http,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    // public loading: LoadingProvider, 
  ) {

    this.setAddress(true);

  }
  setAddress(value) {
    if (value == true) {
      this.shared.orderDetails.billing_firstname = this.shared.orderDetails.delivery_firstname;
      this.shared.orderDetails.billing_lastname = this.shared.orderDetails.delivery_lastname;
      this.shared.orderDetails.billing_state = this.shared.orderDetails.delivery_state;
      this.shared.orderDetails.billing_city = this.shared.orderDetails.delivery_city;
      this.shared.orderDetails.billing_postcode = this.shared.orderDetails.delivery_postcode;
      this.shared.orderDetails.billing_zone = this.shared.orderDetails.delivery_zone;
      this.shared.orderDetails.billing_country = this.shared.orderDetails.delivery_country;
      this.shared.orderDetails.billing_country_id = this.shared.orderDetails.delivery_country_id;
      this.shared.orderDetails.billing_street_address = this.shared.orderDetails.delivery_street_address;
    }
    else {
      this.shared.orderDetails.billing_firstname = '';
      this.shared.orderDetails.billing_lastname = '';
      this.shared.orderDetails.billing_state = '';
      this.shared.orderDetails.billing_city = '';
      this.shared.orderDetails.billing_postcode = '';
      this.shared.orderDetails.billing_zone = '';
      this.shared.orderDetails.billing_country = '';
      this.shared.orderDetails.billing_country_id = '';
      this.shared.orderDetails.billing_street_address = '';
    }
  }
  submit() {
   this.navCtrl.push(ShippingMethodPage);
  }
  selectCountryPage() {
    let modal = this.modalCtrl.create(SelectCountryPage, { page: 'billing' });
    modal.present();
  }
  selectZonePage() {
    let modal = this.modalCtrl.create(SelectZonesPage, { page: 'billing', id: this.shared.orderDetails.billing_country_id });
    modal.present();
  }

}
