// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { SelectCountryPage } from '../select-country/select-country';
import { SelectZonesPage } from '../select-zones/select-zones';
import { BillingAddressPage } from '../billing-address/billing-address';


@Component({
  selector: 'page-shipping-address',
  templateUrl: 'shipping-address.html',
})
export class ShippingAddressPage {


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public loading: LoadingProvider, ) {

    this.loading.show();
    var data: { [k: string]: any } = {};
    data.customers_id = this.shared.customerData.customers_id;
    this.http.post(this.config.url + 'getAllAddress', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        var allShippingAddress = data.data;
        for (let value of allShippingAddress) {
          if (value.default_address != null || allShippingAddress.length == 1) {
            this.shared.orderDetails.tax_zone_id = value.zone_id;
            this.shared.orderDetails.delivery_firstname = value.firstname;
            this.shared.orderDetails.delivery_lastname = value.lastname;
            this.shared.orderDetails.delivery_state = value.state;
            this.shared.orderDetails.delivery_city = value.city;
            this.shared.orderDetails.delivery_postcode = value.postcode;
            this.shared.orderDetails.delivery_zone = value.zone_name;
            this.shared.orderDetails.delivery_country = value.country_name;
            this.shared.orderDetails.delivery_country_id = value.countries_id;
            this.shared.orderDetails.delivery_street_address = value.street;
            //this.shared.orderDetails.delivery_telephone = $rootScope.customerData.customers_telephone;
            // if ($rootScope.zones.length == 0)
          }

        }
      }
      if (data.success == 0) { }
    });
  }
  submit() {
    this.navCtrl.push(BillingAddressPage);
  }
  selectCountryPage() {
    let modal = this.modalCtrl.create(SelectCountryPage, { page: 'shipping' });
    modal.present();
  }
  selectZonePage() {
    let modal = this.modalCtrl.create(SelectZonesPage, { page: 'shipping', id: this.shared.orderDetails.delivery_country_id });
    modal.present();
  }

}
