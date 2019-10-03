// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

//import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http } from '@angular/http';
import { ConfigProvider } from '../config/config';

export function createTranslateLoader(http: Http, config: ConfigProvider) {
  
  return new TranslateHttpLoader(http, 'http://demo0.ionicecommerce.com/'+'appLabels3?lang=',"");
 
}