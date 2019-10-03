// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Toast } from '@ionic-native/toast';
import { TranslateService } from '@ngx-translate/core';
import { NewsDetailPage } from '../news-detail/news-detail';
import { NewsListPage } from '../news-list/news-list';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';



@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;
  featuredPosts = new Array;
  segments = 'newest';

  //WordPress intergation
  categories = new Array;
  //page varible
  page = 0;

  //WordPress intergation
  posts = new Array;
  //page varible
  page2 = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    private toast: Toast,
    public shared: SharedDataProvider,
    translate: TranslateService) {

    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.is_feature = 1;
    this.http.post(this.config.url + 'getAllNews', dat).map(res => res.json()).subscribe(data => {
      this.featuredPosts = data.news_data;
    });

    this.getPosts();
    this.getCategories();
  }


  //========================================= tab newest categories ===============================================================================

  getCategories = function () {

    var data: { [k: string]: any } = {};
    data.language_id = this.config.langId;
    data.page_number = this.page2;
    this.http.post(this.config.url + 'allNewsCategories', data).map(res => res.json()).subscribe(data => {

      if (this.page2 == 0) { this.categories = []; }
      if (data.success == 1) {
        this.page2++;
        data.data.forEach((value, index) => {
          this.categories.push(value);
        });
       // console.log(data.data.length);
        this.getCategories();
      }
      if (data.data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled

        if (this.categories.length != 0) {
          this.toast.show(`All Categories Loaded!`, 'short', 'bottom');
        }
      }
    }, function (response) {
      // console.log("Error while loading categories from the server");
      // console.log(response);
    });
  };

  //============================================================================================  
  //getting list of posts
  getPosts() {
    var data: { [k: string]: any } = {};
    data.language_id = this.config.langId;
    data.page_number = this.page;
    this.http.post(this.config.url + 'getAllNews', data).map(res => res.json()).subscribe(data => {

      this.infinite.complete();//stopping infinite scroll loader
      if (this.page == 0) {
        this.posts = []; this.infinite.enable(true);
      }
      if (data.success == 1) {
        this.page++;
        data.news_data.forEach((value, index) => {
          this.posts.push(value);
        });
      }
      if (data.news_data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled

        this.infinite.enable(false);//disabling infinite scroll
        if (this.posts.length != 0) {
          this.toast.show(`All Posts Loaded!`, 'short', 'bottom');
        }
      }
    }, function (response) {
      // console.log("Error while loading posts from the server");
      // console.log(response);
    });
  };

  //============================================================================================  
  //getting list of sub categories from the server
  showPostDetail(post) {
    this.loading.autoHide(500);
    this.navCtrl.push(NewsDetailPage, { 'post': post });
  };
  openPostsPage(name, id) {
    this.loading.autoHide(500);
    this.navCtrl.push(NewsListPage, { 'name':name,'id':id });
  }

  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  ionViewWillEnter() {
    if (this.config.admob == 1) this.shared.showAd();
  }
}
