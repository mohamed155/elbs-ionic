// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { NavController, NavParams } from 'ionic-angular';
import { ProductsPage } from '../../pages/products/products';
import { Http } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';

@Component({
  selector: 'banners',
  templateUrl: 'banners.html'
})
export class BannersComponent {

  constructor(
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public loading: LoadingProvider,
  ) {

  }
  //===============================================================================================
  //on click image banners
  bannerClick = function (image) {
    //  console.log(image);
    if (image.type == 'category') {
      this.navCtrl.push(ProductsPage, { id: parseInt(image.url) });
    }
    else if (image.type == 'product') {
      this.getSingleProductDetail(parseInt(image.url));
    }
    else {
      this.navCtrl.push(ProductsPage, { sortOrder: image.type });
    }
  }
  //===============================================================================================
  //getting single product data
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

}
