import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {Http} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {NgForm} from "@angular/forms";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {TranslateService} from "@ngx-translate/core";
import {Home3Page} from "../home3/home3";
import {validateAndRewriteCoreSymbol} from "@angular/compiler-cli/src/ngtsc/imports";

@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {

  products_image;
  languages: any = [];
  category_id: any;
  subcategories: any = [];
  disableSubCategories = true;
  tags;

  productAddFailedTitle: string;
  productAddFailedMsg: string;
  okTxt: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public shared: SharedDataProvider,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: ConfigProvider,
              public camera: Camera,
              public platform: Platform,
              public toastCtrl: ToastController,
              public translate: TranslateService,
              public alertCtrl: AlertController
  ) {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.get(config.url + 'getLanguages').map(res => res.json()).subscribe(data => {
      loader.dismiss();
      this.languages = data.languages;
    });
    this.translate.get('Addition failure').subscribe(value => this.productAddFailedTitle = value);
    this.translate.get('Failed to add this product')
      .subscribe(value => this.productAddFailedTitle = value);
    this.translate.get('Ok').subscribe(value => this.okTxt = value);
  }

  onChangeCategory() {
    if (this.category_id) this.disableSubCategories = false;
    this.subcategories = this.shared.subCategories.filter(item => item.parent_id == this.category_id);
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.platform.ready().then(() => {

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.products_image = 'data:image/jpeg;base64,' + imageData;
        // console.log(base64Image);

      }, (err) => {
      });
    });
  }

  onSubmit(form: NgForm) {
    const loader = this.loadingCtrl.create();
    loader.present();
    console.log({customers_id: this.shared.customerData.customers_id,products_image: this.products_image, tags: this.tags, ...form.value});
    this.http.post(this.config.url + 'vendors/products', {customers_id: this.shared.customerData.customers_id,products_image: this.products_image, tags: this.tags, ...form.value})
      .map(res => res.json())
      .subscribe(data => {
        if (data.products_id) {
          let message;
          this.translate.get('Product added successfully').subscribe(value => {
            message = value;
            this.toastCtrl.create({message, duration: 2000}).present();
            this.navCtrl.setRoot(Home3Page);
          });
        } else {
          this.alertCtrl.create({
            title: this.productAddFailedTitle,
            message: this.productAddFailedMsg,
            buttons: [this.okTxt]
          }).present();
        }
      });
  }


}
