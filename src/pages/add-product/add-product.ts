import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {Http} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";

@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {

  languages: any = [];
  category_id: any;
  subcategories: any = [];
  disableSubCategories = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public shared: SharedDataProvider,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: ConfigProvider
  ) {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.get(config.url + 'getLanguages').map(res => res.json()).subscribe(data => {
      loader.dismiss();
      this.languages = data.languages;
    });
  }

  onChangeCategory() {
    if (this.category_id) this.disableSubCategories = false;
    this.subcategories = this.shared.subCategories.filter(item => item.parent_id == this.category_id);
  }


}
