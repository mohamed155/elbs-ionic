// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, Input } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'product',
  templateUrl: 'product.html'
})
export class ProductComponent {

  @Input('data') p;//product data
  @Input('type') type;
  // @Output() someEvent = new EventEmitter();
  constructor(
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events
  ) {
    events.subscribe('wishListUpdate', (id, value) => {
      if (this.p.products_id == id) this.p.isLiked = value
    });

  }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.p.products_price);
    var p2 = parseInt(this.p.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }

  showProductDetail() {
    this.navCtrl.push(ProductDetailPage, { data: this.p });
    if (this.type != 'recent') this.shared.addToRecent(this.p);
  }

  checkProductNew() {
    var pDate = new Date(this.p.products_date_added);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }

  addToCart() { this.shared.addToCart(this.p, []); }

  isInCart() {
    var found = false;

    for (let value of this.shared.cartProducts) {
      if (value.products_id == this.p.products_id) { found = true; }
    }

    if (found == true) return true;
    else return false;
  }
  removeRecent() {
    this.shared.removeRecent(this.p);
  }

  clickWishList() {

    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = this.modalCtrl.create(LoginPage);
      modal.present();
    }
    else {
      if (this.p.isLiked == '0') { this.addWishList(); }
      else this.removeWishList();
    }
  }
  addWishList() {
    this.shared.addWishList(this.p);
  }
  removeWishList() {
    this.shared.removeWishList(this.p);
  }


  ngOnChanges() {

  }

  ngOnInit() {

  }
}
