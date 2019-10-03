// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Http } from '@angular/http';

import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';

@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {
  private languages: any;
  selectedLanguage;
  translate;
  prviousLanguageId;

  constructor(
    public viewCtrl: ViewController,
    public http: Http,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    translateService: TranslateService,
    public loading: LoadingProvider
  ) {
      this.prviousLanguageId = localStorage.langId;
    //getting all languages
    this.loading.show();
    this.http.get(config.url + 'getLanguages').map(res => res.json()).subscribe(data => {
      this.loading.hide();
      this.translate = translateService;
      this.languages = data.languages;
      for (let data of this.languages) {
        if (data.languages_id == this.prviousLanguageId) {
          this.selectedLanguage = data;
        }
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  updateLanguage(lang) {

    if (lang != undefined && this.prviousLanguageId != lang.languages_id) {
      this.loading.show();
      //this.translate.use(lang.languages_id);
      localStorage.langId=lang.languages_id;
      localStorage.direction=lang.direction;
      //this.storage.set('langId', lang.languages_id);
      this.shared.emptyCart();
      this.shared.emptyRecentViewed();
      setTimeout(() => {
        window.location.reload();
      }, 900);

    }
    //this.

  }
}
