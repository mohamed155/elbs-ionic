// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { CategoriesPage } from '../../pages/categories/categories';
//import { ProductsPage } from '../../pages/products/products';
import { NewsPage } from '../../pages/news/news';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
///import { share } from 'rxjs/operator/share';
//import { AboutUsPage } from '../../pages/about-us/about-us';
import { SettingsPage } from '../../pages/settings/settings';
import { ProductsPage } from '../../pages/products/products';
import { ConfigProvider } from '../../providers/config/config';
import { Home2Page } from '../../pages/home2/home2';
import { Home3Page } from '../../pages/home3/home3';
import { Home5Page } from '../../pages/home5/home5';
import { Home4Page } from '../../pages/home4/home4';
import { Categories3Page } from '../../pages/categories3/categories3';
import { Categories2Page } from '../../pages/categories2/categories2';
import { Categories5Page } from '../../pages/categories5/categories5';
import { Categories4Page } from '../../pages/categories4/categories4';
import { Categories6Page } from '../../pages/categories6/categories6';



@Component({
  selector: 'footer',
  templateUrl: 'footer.html'
})
export class FooterComponent {
  segments: any = 'HomePage';
  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
  ) {
    // console.log(shared.selectedFooterPage);
    this.segments = shared.selectedFooterPage;
  }
  openPage(page) {
    this.shared.selectedFooterPage = page;

    if (page == "HomePage") { this.openHomePage(); }
    else if (page == "CategoriesPage") { this.openCategoryPage(); }
    else if (page == "ProductsPage") { this.navCtrl.push(ProductsPage); }
    else if (page == "NewsPage") { this.navCtrl.setRoot(NewsPage); }
    else if (page == "SettingsPage") { this.navCtrl.setRoot(SettingsPage); }
  }
  openHomePage() {
    if (this.config.homePage == 1) { this.navCtrl.setRoot(HomePage); }
    if (this.config.homePage == 2) { this.navCtrl.setRoot(Home2Page); }
    if (this.config.homePage == 3) { this.navCtrl.setRoot(Home3Page); }
    if (this.config.homePage == 4) { this.navCtrl.setRoot(Home4Page); }
    if (this.config.homePage == 5) { this.navCtrl.setRoot(Home5Page); }
  }
  openCategoryPage() {
    if (this.config.categoryPage == 1) { this.navCtrl.setRoot(CategoriesPage); }
    if (this.config.categoryPage == 2) { this.navCtrl.setRoot(Categories2Page); }
    if (this.config.categoryPage == 3) { this.navCtrl.setRoot(Categories3Page); }
    if (this.config.categoryPage == 4) { this.navCtrl.setRoot(Categories4Page); }
    if (this.config.categoryPage == 5) { this.navCtrl.setRoot(Categories5Page); }
    if (this.config.categoryPage == 6) { this.navCtrl.setRoot(Categories6Page); }
  }
}

// events.subscribe('footerPageChange', (value) => {
//   console.log(value);
//   this.segments = value;
// });
// this.events.publish('footerPageChange',page);
