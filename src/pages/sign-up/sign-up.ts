import {Component} from '@angular/core';
import {
  ViewController,
  ModalController,
  AlertController,
  LoadingController,
  ActionSheetController
} from 'ionic-angular';
import {LoadingProvider} from '../../providers/loading/loading';
import {ConfigProvider} from '../../providers/config/config';
import {Http} from '@angular/http';
import {SharedDataProvider} from '../../providers/shared-data/shared-data';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Platform} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {Storage} from '@ionic/storage';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import {SelectCountryPage} from "../select-country/select-country";

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  formData = {
    customers_firstname: '',
    customers_lastname: '',
    customers_email_address: '',
    customers_password: '',
    customers_telephone: '',
    customers_picture: '',
    type: false,
    vendor_logo: '',
    vendor_name: '',
    vendor_address: '',
    vendor_phone: '',
    vendor_facebook: '',
    vendor_instagram: '',
    vendor_online: false,
    governorate_id: ''
  };
  image;
  vendor_logo;
  errorMessage = '';

  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public platform: Platform,
    private camera: Camera,
    private alertCtrl: AlertController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public imagePicker: ImagePicker,
  ) {
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
        this.image = 'data:image/jpeg;base64,' + imageData;
        // console.log(base64Image);

      }, (err) => {
      });
    });
  }

  handleProfilePicClick() {
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
              this.image = 'data:image/jpeg;base64,' + imageData;
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
              this.image = 'data:image/jpeg;base64,' + results[0];
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

  selectCountryPage() {
    let modal = this.modalCtrl.create(SelectCountryPage, { page: 'editShipping' });
    modal.present();
  }

  handleVendorPicClick() {
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
              this.vendor_logo = 'data:image/jpeg;base64,' + imageData;
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
              console.log(results);
              this.vendor_logo = 'data:image/jpeg;base64,' + results[0];
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

  openCameraVendor() {
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
        this.vendor_logo = 'data:image/jpeg;base64,' + imageData;
        // console.log(base64Image);

      }, (err) => {
      });
    });
  }

  signUp() {
    this.loading.show();
    this.errorMessage = '';
    this.formData.customers_picture = this.image;
    this.formData.vendor_logo = this.vendor_logo;
    this.formData.governorate_id = this.shared.tempdata.entry_country_id;
    this.http.post(this.config.url + 'processRegistration', this.formData).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        // if (data.data[0].isActive == 0) {
        this.alertCtrl.create({
          title: "Email verification",
          message: "Please verify your email sent within 1 hour later then Login",
          buttons: ["Ok"]
        }).present();
        this.http.post(this.config.url + 'points/increase', {
          point_id: data.data[0].points.id,
          count: this.shared.registerPoints
        })
          .map(res => res.json())
          .subscribe(data => {
            this.shared.customerData.points = data;
            this.storage.set('customerData', this.shared.customerData);
          });
        this.viewCtrl.dismiss();
        return;
        // }
        // this.shared.login(data.data[0]);
        // //this.config.customerData = data.data[0];
        // this.viewCtrl.dismiss();
      }
      if (data.success == 0) {
        this.errorMessage = data.message;
      }
    });
  }

  openPrivacyPolicyPage() {
    let modal = this.modalCtrl.create('PrivacyPolicyPage');
    modal.present();
  }

  openTermServicesPage() {
    let modal = this.modalCtrl.create('TermServicesPage');
    modal.present();
  }

  openRefundPolicyPage() {
    let modal = this.modalCtrl.create('RefundPolicyPage');
    modal.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SignUpPage');
  // }
}
