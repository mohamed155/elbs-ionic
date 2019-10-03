// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { NewsDetailPage } from '../news-detail/news-detail';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { Http } from '@angular/http';
import { Toast } from '@ionic-native/toast';



@Component({
  selector: 'page-news-list',
  templateUrl: 'news-list.html',
})
export class NewsListPage {
  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  name;
  id;
  page = 0;
  posts = new Array;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private toast: Toast,
    public config: ConfigProvider,
    public loading: LoadingProvider, ) {

    this.name = this.navParams.get('name');
    this.id = this.navParams.get('id');
    this.getPosts();
  }
  showPostDetail(post) {
    this.loading.autoHide(500);
    this.navCtrl.push(NewsDetailPage, { 'post': post });
  };
  //============================================================================================  
  //getting list of posts
  getPosts() {
    var data: { [k: string]: any } = {};
    data.language_id = this.config.langId;
    data.page_number = this.page;
    data.categories_id = this.id;
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


}
