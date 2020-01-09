import {Component} from "@angular/core";
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {ActionSheetController, AlertController, LoadingController, NavController, ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";

@Component({
  selector: 'page-edit-vendor',
  templateUrl: 'edit-vendor.html'
})
export class EditVendorPage {
  vendor_logo;

  formData = {
    logo: '',
    name: '',
    address: '',
    phone: '',
    facebook: '',
    instagram: '',
    online: false
  };

  constructor(
    public shared: SharedDataProvider,
    public loadingCtrl: LoadingController,
    public http: Http,
    public config: ConfigProvider,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public actionSheetCtrl: ActionSheetController
  ) {
    // console.log(shared.currentVendor);
    this.formData.name = shared.currentVendor.name;
    this.vendor_logo = this.config.url + shared.currentVendor.logo;
    this.formData.address = shared.currentVendor.address;
    this.formData.facebook = shared.currentVendor.facebook;
    this.formData.instagram = shared.currentVendor.instagram;
    this.formData.phone = shared.currentVendor.phone;
    this.formData.online = shared.currentVendor.online != '0';
  }

  onSumbit() {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.http.post(this.config.url + 'vendors/update/' + this.shared.currentVendor.id,
      {
        ...this.formData,
        logo: this.vendor_logo
      }).map(res => res.json())
      .subscribe(data => {
        loader.dismiss();
        this.shared.currentVendor = data;
        this.navCtrl.pop();
        this.toastCtrl.create({
          message: 'Edit successful',
          duration: 2000
        }).present();
      }, (err) => {
        loader.dismiss();
        this.alertCtrl.create({
          title: 'Error',
          message: err.message
        }).present();
      })
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
}
