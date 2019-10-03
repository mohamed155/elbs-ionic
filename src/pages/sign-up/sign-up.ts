// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
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
    customers_picture: ''
  };
  image;
  errorMessage = '';
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public platform: Platform,
    private camera: Camera
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
    }
    this.platform.ready().then(() => {

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.image = 'data:image/jpeg;base64,' + imageData;
        // console.log(base64Image);

      }, (err) => { });
    });
  }
  signUp() {
    this.loading.show();
    this.errorMessage = '';
    this.formData.customers_picture = this.image;
    this.http.post(this.config.url + 'processRegistration', this.formData).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        //this.config.customerData = data.data[0];
        this.viewCtrl.dismiss();
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
