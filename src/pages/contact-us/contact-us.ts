// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { AlertProvider } from '../../providers/alert/alert';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';

declare var google;

@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  contact = {
    name: '',
    email: '',
    message: ''
  };
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public alert: AlertProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }
  submit() {

    this.loading.show();
    var data = {};
    data = this.contact;
    this.http.post(this.config.url + 'contactUs', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        this.contact.name = '';
        this.contact.email = '';
        this.contact.message = '';
        this.alert.show(data.message);
      }
    }, function (response) {
      this.loading.hide();
      this.alert.show("Error server not reponding");
    });


  };
  loadMap() {

    let latLng = new google.maps.LatLng(this.config.latitude, this.config.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = this.config.address;

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  openCart() {
    this.navCtrl.push(CartPage);
}
openSearch() {
    this.navCtrl.push(SearchPage);
}

}
