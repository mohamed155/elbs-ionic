// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {ConfigProvider} from '../../providers/config/config';
import {SharedDataProvider} from '../../providers/shared-data/shared-data';
import {SocialSharing} from '@ionic-native/social-sharing';
import {LoginPage} from '../login/login';
import {LoadingProvider} from '../../providers/loading/loading';
import {Http} from "@angular/http";
import {NgForm} from "@angular/forms";
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  Arr = Array;

  public product;

  attributes = [];
  selectAttribute = true;
  discount_price;
  product_price;
  reviews = [];

  vendor = null;

  userRate = '0';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public http: Http,
    public loaderCtrl: LoadingController,
    private socialSharing: SocialSharing,
    private storage: Storage) {

    this.product = navParams.get('data');
    console.log(this.product);
    this.discount_price = this.product.discount_price;
    this.product_price = this.product.products_price;

    if (this.product.attributes != null && this.product.attributes != undefined && this.product.attributes.length != 0) {
      //this.selectAttribute = this.product.attributes[0].values[0];
      // console.log(this.selectAttribute);
      this.product.attributes.forEach((value, index) => {

        var att = {
          products_options_id: value.option.id,
          products_options: value.option.name,
          products_options_values_id: value.values[0].id,
          options_values_price: value.values[0].price,
          price_prefix: value.values[0].price_prefix,
          products_options_values: value.values[0].value,
          name: value.values[0].value + ' ' + value.values[0].price_prefix + value.values[0].price + " " + this.config.currency
        };

        this.attributes.push(att);
      });
      //console.log(this.attributes);
    }

    const loader = this.loaderCtrl.create();
    loader.present();
    const requests = [];
    const prodRateReq = this.http.get(config.url + `products/getRate?product_id=${this.product.products_id}`);
    requests.push(prodRateReq);
    prodRateReq.map(res => res.json())
      .subscribe(data => this.reviews = data.rates == 'no rates found' ? [] : data.rates);
    if (this.product.vendor_id !== '0') {
      const prodVendorReq = this.http.post(config.url + `vendors/${this.product.vendor_id}`, {
        language_id: config.langId
      });
      requests.push(prodVendorReq);
      prodVendorReq.map(res => res.json())
        .subscribe(data => this.vendor = data.vendor);
    }
    Promise.all(requests).then(() => {loader.dismiss();console.log(this.reviews, 'length ', this.reviews.length)});
  }

  addToCartProduct() {
    this.loading.autoHide(500);
    // console.log(this.product);
    this.shared.addToCart(this.product, this.attributes);
    this.navCtrl.pop();
  }

  //============================================================================================
  //function adding attibute into array
  fillAttributes = function (val, optionID) {

    //console.log(val);
    //  console.log(this.attributes);
    this.attributes.forEach((value, index) => {
      if (optionID == value.products_options_id) {
        value.products_options_values_id = val.id;
        value.options_values_price = val.price;
        value.price_prefix = val.price_prefix;
        value.products_options_values = val.value;
        value.name = val.value
      }
    });

    // console.log($scope.attributes);
    //calculating total price
    // this.calculatingTotalPrice();
  };
  //============================================================================================
  //calculating total price
  calculatingTotalPrice = function () {
    var price = parseFloat(this.product.products_price.toString());
    if (this.product.discount_price != null || this.product.discount_price != undefined)
      price = this.product.discount_price;
    var totalPrice = this.shared.calculateFinalPriceService(this.attributes) + parseFloat(price.toString());

    if (this.product.discount_price != null || this.product.discount_price != undefined)
      this.discount_price = totalPrice;
    else
      this.product_price = totalPrice;
    //  console.log(totalPrice);
  };

  checkProductNew() {
    var pDate = new Date(this.product.products_date_added);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.product.products_price);
    var p2 = parseInt(this.product.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) {
      rtn = "";
    }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) {
      rtn = ""
    }
    rtn = result + '%';
    return rtn;
  }

  share() {
    this.loading.autoHide(1000);
    // Share via email
    this.socialSharing.share(
      this.product.products_description,
      this.product.products_name,
      this.config.url + this.product.products_image,
      this.product.products_url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });

  }

  clickWishList() {

    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = this.modalCtrl.create(LoginPage);
      modal.present();
    } else {
      if (this.product.isLiked == '0') {
        this.addWishList();
      } else this.removeWishList();
    }
  }

  addWishList() {
    this.shared.addWishList(this.product);
  }

  removeWishList() {
    this.shared.removeWishList(this.product);
  }

  writeReview(form: NgForm) {
    const loader = this.loaderCtrl.create();
    loader.present();
    this.http.post(this.config.url + 'rates', {
      review: form.value.review,
      customer_id: this.shared.customerData.customers_id,
      rate: this.userRate,
      type: 1,
      item_id: this.product.products_id
    }).map(res => res.json())
      .subscribe(data => {
        this.http.get(this.config.url + `products/getRate?product_id=${this.product.products_id}`)
          .map(res => res.json())
          .subscribe(data => {
            this.reviews = data.rates;
            this.http.post(this.config.url + 'points/increase', {
              point_id: this.shared.customerData.points.id,
              count: this.shared.reviewPoints
            })
              .map(res => res.json())
              .subscribe(data => {
                this.shared.customerData.points = data;
                this.storage.set('customerData', this.shared.customerData);
                loader.dismiss();
              });
          })
      });
  }

  toInt(value: string) {
    return parseInt(value);
  }


}
