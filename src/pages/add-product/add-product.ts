import {Component} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController, ModalController,
  NavController,
  NavParams,
  Platform,
  ToastController,
  ViewController
} from 'ionic-angular';
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {Http} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {NgForm} from "@angular/forms";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {TranslateService} from "@ngx-translate/core";
import {Home3Page} from "../home3/home3";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {AlertProvider} from "../../providers/alert/alert";
import {LoadingProvider} from "../../providers/loading/loading";
import {Storage} from "@ionic/storage";

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

  colors = [];
  sizes = [];

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
              public alertCtrl: AlertController,
              public alert: AlertProvider,
              public loading: LoadingProvider,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public storage: Storage,
              public actionSheetCtrl: ActionSheetController,
              public imagePicker: ImagePicker,
  ) {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.get(config.url + 'getLanguages').map(res => res.json()).subscribe(data => {
      loader.dismiss();
      this.languages = data.languages;
    });
  }

  updateColors(value, event) {
    if (event.checked) {
      this.colors.push(value);
    } else {
      this.colors = this.colors.filter(item => item != value);
    }
    console.log(this.colors);
  }

  updateSizes(value, event) {
    if (event.checked) {
      this.sizes.push(value);
    } else {
      this.sizes = this.sizes.filter(item => item != value);
    }
    console.log(this.sizes);
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
    };
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

  handleProductPicClick() {
    this.actionSheetCtrl.create({
      title: 'Upload your profile picture',
      buttons: [
        {
          text: 'Take a photo with camera',
          handler: () => {
            const loader = this.loadingCtrl.create();
            loader.present();
            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              allowEdit: true,
              targetWidth: 100,
              targetHeight: 100,
              saveToPhotoAlbum: false,
              correctOrientation: true
            };
            this.camera.getPicture(options).then((imageData) => {
              this.products_image = 'data:image/jpeg;base64,' + imageData;
              loader.dismiss();
            }, (err) => {
              this.alertCtrl.create({
                title: 'Error',
                message: 'Could not take photo from camera'
              }).present();
              loader.dismiss();
            });
          }
        },
        {
          text: 'Choose an image from gallery',
          handler: () => {
            const loader = this.loadingCtrl.create();
            loader.present();
            const options: ImagePickerOptions = {
              maximumImagesCount: 1,
              quality: 100,
              outputType: 1
            };
            this.imagePicker.getPictures(options).then((results) => {
              this.products_image = 'data:image/jpeg;base64,' + results[0];
              loader.dismiss();
            }, (err) => {
              this.alertCtrl.create({
                title: 'Error',
                message: 'Could not take photo from gallery'
              }).present();
              loader.dismiss();
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    }).present();
  }

  onSubmit(form: NgForm) {
    const loader = this.loadingCtrl.create();
    loader.present();
    var data = form.value;
    console.log(form.value);
    data.customers_id = this.shared.customerData.customers_id;
    data.products_image = this.products_image;
    data.tags = this.tags;
    data.products_image = this.products_image;

    this.http.post(this.config.url + 'vendors/products', data)
      .map(res => res.json())
      .subscribe(data => {
        loader.dismiss();
        if (data.products_id) {
          let message;
          this.colors.map(item => {
            this.http.post(this.config.url + 'vendors/products/addNewProductAttribute', {
              products_options_id: this.shared.productColorOptions[0].products_options_id,
              products_id: data.products_id,
              products_options_values_id: item
            }).map(res => res.json())
              .subscribe(data => console.log(data));
          });
          this.sizes.map(item => {
            this.http.post(this.config.url + 'vendors/products/addNewProductAttribute', {
              products_options_id: this.shared.productSizeOptions[0].products_options_id,
              products_id: data.products_id,
              products_options_values_id: item
            }).map(res => res.json())
              .subscribe(data => console.log(data));
          });
          this.translate.get('Product added successfully').subscribe(value => {
            message = value;
            this.toastCtrl.create({message, duration: 2000}).present();
            this.navCtrl.setRoot(Home3Page);
          });
        } else {
          this.translate.get('Addition failure').subscribe(value => this.productAddFailedTitle = value);
          this.translate.get('Failed to add this product')
            .subscribe(value => this.productAddFailedTitle = value);
          this.translate.get('Ok').subscribe(value => this.okTxt = value);
          this.alertCtrl.create({
            title: this.productAddFailedTitle,
            message: this.productAddFailedMsg,
            buttons: [this.okTxt]
          }).present();
        }
      }, (err) => {
        loader.dismiss();
        this.alertCtrl.create({
          title: 'Server error',
          message: 'message' + err.message
        }).present();
      });
  }


}
