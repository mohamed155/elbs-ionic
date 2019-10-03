// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild, Input } from '@angular/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import 'rxjs/add/operator/map';
import { LoadingProvider } from '../../providers/loading/loading';
import { InfiniteScroll } from 'ionic-angular';

@Component({
  selector: 'sliding-tabs',
  templateUrl: 'sliding-tabs.html'
})
export class SlidingTabsComponent {
  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  @Input('type') type;//product data
  products = new Array;
  selected = '';
  page = 0;

  constructor(
    public shared: SharedDataProvider,
    public http: Http,
    public config: ConfigProvider,
    public loading: LoadingProvider,
  ) {
  }
  getProducts(infiniteScroll) {

    if (this.page == 0) { this.loading.autoHide(700); }
    var data: { [k: string]: any } = {};
    data.customers_id = null;
    data.categories_id = this.selected;
    data.page_number = this.page;

    // if (d.type != undefined)
    //   data.type = d.type;
    data.language_id = this.config.langId;
    this.http.post(this.config.url + 'getAllProducts', data).map(res => res.json()).subscribe(data => {

      this.infinite.complete();
      if (this.page == 0) {
      this.products = new Array;
        // this.loading.hide();
      }
      if (data.success == 1) {
        this.page++;
        var prod = data.product_data;
        for (let value of prod) {
          this.products.push(value);
        }
      }
      if (data.success == 0) { this.infinite.enable(false); }
    });
    // console.log(this.products.length + "   " + this.page);
  }

  //changing tab
  changeTab(c) {
    this.infinite.enable(true);
    this.page = 0;
    if (c == '') this.selected = c
    else this.selected = c.id;
    this.getProducts(null);
  }


  ngOnInit() {
    this.getProducts(null);
  }

}
