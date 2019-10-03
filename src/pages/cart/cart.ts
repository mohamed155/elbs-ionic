// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, Events, ModalController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Toast } from '@ionic-native/toast';
import { ProductDetailPage } from '../product-detail/product-detail';
import { LoadingProvider } from '../../providers/loading/loading';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { ShippingAddressPage } from '../shipping-address/shipping-address';
import { trigger, style, animate, transition } from '@angular/animations';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-cart',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'cart.html',
})
export class CartPage {
  total: any;

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public http: Http,
    public loading: LoadingProvider,
    public toast: Toast,
    private storage: Storage,
    public events: Events,
    public modalCtrl: ModalController,
  ) {
  }
  totalPrice() {
    var price = 0;
    for (let value of this.shared.cartProducts) {
      var pp = value.final_price * value.customers_basket_quantity;
      price = price + pp;
    }
    this.total = price;
  };
  getSingleProductDetail(id) {
    this.loading.show();

    var data: { [k: string]: any } = {};
    if (this.shared.customerData != null)
      data.customers_id = this.shared.customerData.customers_id;
    else
      data.customers_id = null;
    data.products_id = id;
    data.language_id = this.config.langId;
    this.http.post(this.config.url + 'getAllProducts', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        this.navCtrl.push(ProductDetailPage, { data: data.product_data[0] });
      }
    });
  }
  removeCart(id) {
    this.shared.removeCart(id);
    this.totalPrice();
  }
  qunatityPlus = function (q) {
    this.toast.show(`Product Quantity is Limited!`, 'short', 'center');
    q.customers_basket_quantity++;
    q.subtotal = q.final_price * q.customers_basket_quantity;
    q.total = q.subtotal;
    if (q.customers_basket_quantity > q.quantity) {
      q.customers_basket_quantity--;
      this.toast.show(`Product Quantity is Limited!`, 'short', 'center');
    }
    this.totalPrice();
    this.shared.cartTotalItems();
    this.storage.set('cartProducts', this.shared.cartProducts);
  }
  //function decreasing the quantity
  qunatityMinus = function (q) {
    if (q.customers_basket_quantity == 1) {
      return 0;
    }
    q.customers_basket_quantity--;
    q.subtotal = q.final_price * q.customers_basket_quantity;
    q.total = q.subtotal;
    this.totalPrice();

    this.shared.cartTotalItems();
    this.storage.set('cartProducts', this.shared.cartProducts);
  }
  ionViewDidLoad() {
    this.totalPrice()
  }
  proceedToCheckOut() {

    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = this.modalCtrl.create(LoginPage);
      modal.present();
    }
    else {
      this.navCtrl.push(ShippingAddressPage);
    }
  }
  openProductsPage() {
    this.navCtrl.push(ProductsPage, { sortOrder: 'newest' });
  }
  ionViewDidLeave() {
   // this.storage.set('cartProducts', this.shared.cartProducts);
  }
  ionViewWillEnter() {
    if (this.config.admob == 1) this.shared.showAd();
  }

}
