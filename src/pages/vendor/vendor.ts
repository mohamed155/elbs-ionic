import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  Content,
  InfiniteScroll,
  LoadingController,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {CartPage} from "../cart/cart";
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {LoadingProvider} from "../../providers/loading/loading";
import {TranslateService} from "@ngx-translate/core";
import {Http} from "@angular/http";
import {ChatPage} from "../chat/chat";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html',
})
export class VendorPage {

  vendor: any;
  liked = false;
  products: any = [];
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  scrollTopButton = false;

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;
  //@ViewChild(IonRange) priceRange: IonRange;

  selectedTab = '';
  categoryId = '';
  categoryName = '';
  sortOrder = 'newest';
  sortArray = ['Newest', 'A - Z', 'Z - A', 'Price : high - low', 'Price : low - high', 'Top Seller', 'Special Products', 'Most Liked'];
  page = 0;
  applyFilter = false;
  filters = [];
  selectedFilters = [];
  price = { lower: 0, upper: 500 };
  maxAmount = 500;
  side = "right";
  productView = 'grid';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public config: ConfigProvider,
              public shared: SharedDataProvider,
              public loading: LoadingProvider,
              public translate: TranslateService,
              public http: Http,
              public actionSheet: ActionSheetController,
              public loadingCtrl: LoadingController,
              public storage: Storage
  ) {
    this.vendor = this.navParams.get('vendor');
    if (!this.vendor.likes) this.vendor.likes = 0;
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.post(config.url + 'vendors/' + this.vendor.id, {language_id: config.langId}).map(res => res.json()).subscribe(data => {
      this.products = data.products.original.product_data;
      this.vendor = data.vendor;
      loader.dismiss();
    });
    this.shared.customerData.liked_vendors_array.find((item) => {
      if (item.id == this.vendor.id) this.liked = true;
    });
  }

  openCart() {
    this.navCtrl.push(CartPage);
  }

  getSortProducts(value) {

    if (value == 'Newest') value = 'newest';
    else if (value == 'A - Z') value = 'a to z';
    else if (value == 'Z - A') value = 'z to a';
    else if (value == 'Price : high - low') value = 'high to low';
    else if (value == 'low to high') value = 'low to high';
    else if (value == 'Top Seller') value = 'top seller';
    else if (value == 'Special Products') value = 'special';
    else if (value == 'Most Liked') value = 'most liked';
    else value = value;

    //console.log(value);
    if (value == this.sortOrder) return 0;
    else {
      this.sortOrder = value;
      this.infinite.enable(true);
      this.page = 0;
      // this.getProducts(null);
    }
  }

  openSortBy() {
    var buttonArray = [];
    this.translate.get(this.sortArray).subscribe((res) => {

      for (let key in res) {
        buttonArray.push({ text: res[key], handler: () => { this.getSortProducts(key) } });
      }
      buttonArray.push(
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      );

      var actionSheet = this.actionSheet.create({
        buttons: buttonArray
      });
      actionSheet.present();
    });


  }
  changeLayout() {
    if (this.productView == 'list') this.productView = "grid";
    else this.productView = "list";

    this.scrollToTop();
  }

  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }
  onScroll(e) {
    if (e.scrollTop >= 1200) this.scrollTopButton = true;
    if (e.scrollTop < 1200) this.scrollTopButton = false;
    //else this.scrollTopButton=false;
    //   console.log(e);
  }

  getProducts(infiniteScroll) {

    if (this.page == 0) { this.loading.show(); }
    var data: { [k: string]: any } = {};
    if (this.shared.customerData != null)//in case user is logged in customer id will be send to the server to get user liked products
      data.customers_id = this.shared.customerData.customers_id;
    if (this.applyFilter == true) {
      data.filters = this.selectedFilters;
      data.price = { minPrice: this.price.lower, maxPrice: this.price.upper };
    }
    data.categories_id = this.selectedTab;
    data.page_number = this.page;
    data.type = this.sortOrder;
    data.language_id = this.config.langId;
    this.http.post(this.config.url + 'getAllProducts', data).map(res => res.json()).subscribe(data => {
      // console.log(data.product_data.length + "   " + this.page);
      this.infinite.complete();
      if (this.page == 0) { this.vendor.products = new Array; this.loading.hide(); this.scrollToTop(); }
      if (data.success == 1) {
        this.page++;
        var prod = data.product_data;
        for (let value of prod) {
          this.vendor.products.push(value);
        }
      }
      if (data.success == 1 && data.product_data.length == 0) { this.infinite.enable(false); }
      if (data.success == 0) { this.infinite.enable(false); }

    });

  }

  //changing tab
  changeTab(c) {
    this.applyFilter = false;
    this.infinite.enable(true);
    this.page = 0;
    if (c == '') this.selectedTab = c
    else this.selectedTab = c.id;
    // this.getProducts(null);
    this.getFilters(this.selectedTab);
  }

  //============================================================================================
  // filling filter array for keyword search
  fillFilterArray = function (fValue, fName, keyword) {
    if (fValue._value == true) {
      this.selectedFilters.push({ 'name': fName, 'value': keyword });
    }
    else {
      this.selectedFilters.forEach((value, index) => {
        if (value.value == keyword) {
          this.selectedFilters.splice(index, 1);
        }
      });
    } //console.log(this.selectedFilters);
  };
  //============================================================================================
  //getting countries from server
  getFilters = function (id) {
    var data: { [k: string]: any } = {};
    data.categories_id = id;
    data.language_id = this.config.langId;
    this.http.post(this.config.url + 'getFilters', data).map(res => res.json()).subscribe(data => {
      //  console.log(data);
      if (data.success == 1)
        this.filters = data.filters;
      this.maxAmount = this.price.upper = data.maxPrice;
    });
  };

  applyFilters() {
    this.applyFilter = true;
    this.infinite.enable(true);
    this.page = 0;
    // this.getProducts(null);
  }

  resetFilters() {
    this.getFilters(this.selectedTab);
  }

  removeFilters() {
    this.applyFilter = false;
    this.infinite.enable(true);
    this.page = 0;
    // this.getProducts(null);
    this.getFilters(this.selectedTab);

  }

  likeVendor() {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.post(this.config.url + 'vendors/like_vendor',
      {
        liked_vendor_id: this.vendor.id,
        liked_customers_id: this.shared.customerData.customers_id
      }).map(res => res.json()).subscribe(data => {
        data && (this.liked = true);
        this.vendor.likes += 1;
        this.shared.customerData.liked_vendors_array.push(this.vendor);
        this.storage.set('customerData', this.shared.customerData);
        loader.dismiss();
      });
  }

  unlikeVendor() {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.post(this.config.url + 'vendors/unlike_vendor',
      {
        liked_vendor_id: this.vendor.id,
        liked_customers_id: this.shared.customerData.customers_id
      }).map(res => res.json()).subscribe(data => {
      data && (this.liked = false);
      this.vendor.likes -= 1;
      let idx = -1;
      this.shared.customerData.liked_vendors_array.find((item, index) => {
        if (item.id == this.vendor.id) idx = index;
      });
      if (idx !== -1) {
        this.shared.customerData.liked_vendors_array.splice(idx, 1);
        this.storage.set('customerData', this.shared.customerData);
      }
      loader.dismiss();
    });
  }

  openChat(id) {
    this.navCtrl.push(ChatPage, {customer_id: id});
  }

}
