// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { ThankYouPage } from '../thank-you/thank-you';
import { Stripe } from '@ionic-native/stripe';
import { CouponProvider } from '../../providers/coupon/coupon';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';


declare var braintree;


@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  @ViewChild(Content) content: Content;

  c;
  orderDetail = {};//include shipping address, billing address,  shipping methods.
  products = [];
  couponArray = [];
  couponApplied = 0;
  tokenFromServer = null;
  discount = 0;
  productsTotal = 0;
  totalAmountWithDisocunt = 0;
  nonce = '';
  stripeCard = {
    number: '',
    expMonth: 1,
    expYear: 2020,
    cvc: ''
  };

  paymentMethods = [];
  paypalClientId = "";
  paypalEnviroment = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public loading: LoadingProvider,
    public alert: AlertProvider,
    public couponProvider: CouponProvider,
    private payPal: PayPal,
    public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    private stripe: Stripe) {
    // shared.orderDetails.payment_method = 'cash_on_delivery';
  }

  //============================================================================================  
  //placing order
  addOrder = function (nonce) {
    this.loading.autoHide(5000);
    this.orderDetail.customers_id = this.shared.customerData.customers_id;
    this.orderDetail.customers_name = this.shared.orderDetails.delivery_firstname + " " + this.shared.orderDetails.delivery_lastname;
    this.orderDetail.delivery_name = this.shared.orderDetails.billing_firstname + " " + this.shared.orderDetails.billing_lastname;
    this.orderDetail.customers_email_address = this.shared.customerData.customers_email_address;
    this.orderDetail.customers_telephone = this.shared.customerData.customers_telephone;
    this.orderDetail.delivery_suburb = this.shared.orderDetails.delivery_state
    this.orderDetail.customers_suburb = this.shared.orderDetails.customers_state;
    this.orderDetail.customers_address_format_id = '1';
    this.orderDetail.delivery_address_format_id = '1';
    this.orderDetail.products = this.products;
    this.orderDetail.is_coupon_applied = this.couponApplied;
    this.orderDetail.coupons = this.couponArray;
    this.orderDetail.coupon_amount = this.discount;
    this.orderDetail.totalPrice = this.totalAmountWithDisocunt;
    this.orderDetail.nonce = nonce;
    this.orderDetail.language_id = this.config.langId;
    var data = this.orderDetail;
    this.http.post(this.config.url + 'addToOrder', data).map(res => res.json()).subscribe(data => {
      //this.loading.hide();
      if (data.success == 1) {
        this.shared.emptyCart();
        this.products = [];
        this.orderDetail = {};
        this.shared.orderDetails = {};
        this.navCtrl.setRoot(ThankYouPage);
      }
      if (data.success == 0) { this.alert.show(data.message); }
    }, err => {

      this.translate.get("Server Error").subscribe((res) => {
        this.alert.show(res + " " + err.status);
      });

    });
  };
  initializePaymentMethods() {
    // this.loading.show();
    var data: { [k: string]: any } = {};
    data.language_id = this.config.langId;
    this.http.post(this.config.url + 'getPaymentMethods', data).map(res => res.json()).subscribe(data => {
      //  this.loading.hide();
      if (data.success == 1) {
        this.paymentMethods = data.data;
        for (let a of data.data) {
          if (a.method == "braintree_card" && a.active == '1') { this.getToken(); }
          if (a.method == "braintree_paypal" && a.active == '1') { this.getToken(); }

          if (a.method == "paypal" && a.active == '1') {
            this.paypalClientId = a.public_key;
            if (a.environment == "Test") this.paypalEnviroment = "PayPalEnvironmentSandbox";
            else this.paypalEnviroment = "PayPalEnvironmentProduction"

          }
          if (a.method == "stripe" && a.active == '1') { this.stripe.setPublishableKey(a.public_key); }
        }
      }
    },
      err => {
        this.translate.get("getPaymentMethods Server Error").subscribe((res) => {
          this.alert.show(res + " " + err.status);
        });
      });
  }

  stripePayment() {
    // this.loading.show();
    this.stripe.createCardToken(this.stripeCard)
      .then(token => {
        // this.loading.hide();
        //this.nonce = token.id
        this.addOrder(token.id);
      })
      .catch(error => {
        //this.loading.hide();
        this.alert.show(error)
      });
  }

  //============================================================================================  
  //CAlculate Discount total
  calculateDiscount = function () {
    var subTotal = 0;
    var total = 0;
    for (let value of this.products) {
      subTotal += parseFloat(value.subtotal);
      total += value.total;
    }
    this.productsTotal = subTotal;
    this.discount = (subTotal - total);
  };

  //============================================================================================  
  //CAlculate all total
  calculateTotal = function () {
    let a = 0;
    for (let value of this.products) {
      // console.log(value);
      var subtotal = parseFloat(value.total);
      a = a + subtotal;
    }

    let b = parseFloat(this.orderDetail.total_tax.toString());
    let c = parseFloat(this.orderDetail.shipping_cost.toString());
    this.totalAmountWithDisocunt = parseFloat((parseFloat(a.toString()) + b + c).toString());
    // console.log(" all total " + $scope.totalAmountWithDisocunt);
    // console.log("shipping_tax " + $scope.orderDetail.shipping_tax);
    // console.log(" shipping_cost " + $scope.orderDetail.shipping_cost);
    this.calculateDiscount();
  };

  //============================================================================================  
  //delete Coupon
  deleteCoupon = function (code) {

    this.couponArray.forEach((value, index) => {
      if (value.code == code) { this.couponArray.splice(index, 1); return true; }
    });


    this.products = (JSON.parse(JSON.stringify(this.shared.cartProducts)));
    this.orderDetail.shipping_cost = this.shared.orderDetails.shipping_cost;

    this.couponArray.forEach((value) => {
      //checking for free shipping
      if (value.free_shipping == true) {
        this.orderDetail.shippingName = 'free shipping';
        this.orderDetail.shippingCost = 0;
      }
      this.products = this.couponProvider.apply(value, this.products);
    });
    this.calculateTotal();
    if (this.couponArray.length == 0) {
      this.couponApplied = 0;
    }
  };
  //========================================================================================

  //============================================================================================   
  //getting getMostLikedProducts from the server
  getCoupon = function (code) {
    if (code == '' || code == null) {
      this.alert.show('Please enter coupon code!');
      return 0;
    }
    this.loading.show();
    var data = { 'code': code };
    this.http.post(this.config.url + 'getCoupon', data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      if (data.success == 1) {
        let coupon = data.data[0]
        // console.log($scope.coupon)
        this.applyCouponCart(coupon);
      }
      if (data.success == 0) {
        this.alert.show(data.message);
      }
    }, error => {
      this.loading.hide();
      console.log(error);
    });

  };

  //============================================================================================  
  //applying coupon on the cart
  applyCouponCart = function (coupon) {
    //checking the coupon is valid or not

    if (this.couponProvider.validateCouponService(coupon, this.products, this.couponArray) == false) {
      return 0;
    } else {
      if (coupon.individual_use == 1) {
        this.products = (JSON.parse(JSON.stringify(this.shared.cartProducts)));
        this.couponArray = [];
        this.orderDetail.shipping_cost = this.shared.orderDetails.shipping_cost;
        console.log('individual_use');
      }
      var v: { [k: string]: any } = {};
      v.code = coupon.code;
      v.amount = coupon.amount;
      v.product_ids = coupon.product_ids;
      v.exclude_product_ids = coupon.exclude_product_ids;
      v.product_categories = coupon.product_categories;
      v.excluded_product_categories = coupon.excluded_product_categories;
      v.discount = coupon.amount;
      v.individual_use = coupon.individual_use;
      v.free_shipping = coupon.free_shipping;
      v.discount_type = coupon.discount_type;
      //   v.limit_usage_to_x_items = coupon.limit_usage_to_x_items;
      //  v.usage_limit = coupon.usage_limit;
      // v.used_by = coupon.used_by ;
      // v.usage_limit_per_user = coupon.usage_limit_per_user ;
      // v.exclude_sale_items = coupon.exclude_sale_items;
      this.couponArray.push(v);
    }


    //checking for free shipping
    if (coupon.free_shipping == 1) {
      // $scope.orderDetail.shippingName = 'free shipping';
      this.orderDetail.shipping_cost = 0;
      //  console.log('free_shipping');
    }
    //applying coupon service
    this.products = this.couponProvider.apply(coupon, this.products);
    if (this.couponArray.length != 0) {
      this.couponApplied = 1;
    }
    this.calculateTotal();
  };

  paypalPayment() {
    this.loading.autoHide(2000);
    this.payPal.init({
      PayPalEnvironmentProduction: this.paypalClientId,
      PayPalEnvironmentSandbox: this.paypalClientId
    }).then(() => {
      // this.loading.hide();
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender(this.paypalEnviroment, new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        //this.loading.show();
        let payment = new PayPalPayment(this.totalAmountWithDisocunt.toString(), this.config.paypalCurrencySymbol, 'cart Payment', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          // Successfully paid
          //  alert(JSON.stringify(res));
          //this.nonce = res.response.id;
          this.addOrder(res);
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          console.log('Error or render dialog closed without being successful');
          this.alert.show('Error or render dialog closed without being successful');
        });
      }, () => {
        console.log('Error in configuration');
        this.alert.show('Error in configuration');
      });
    }, () => {
      console.log('Error in configuration');
      this.alert.show('Error in initialization, maybe PayPal isnt supported or something else');
    });
  }

  couponslist() {
    // + '<li>Cart Percentage <span>(cp9989)</a><p>{{"A percentage discount for the entire cart"|translate}}</p></li>'
    //   + '<li>Cart Fixed <span>(cf9999)</span> <p>{{"A fixed total discount for the entire cart"|translate}}</p></li>'
    //   + '<li>Product Fixed <span>(pf8787)</span></a><p>{{"A fixed total discount for selected products only"|translate}}</p></li>'
    //   + '<li>Product Percentage <span>(pp2233)</span><p>{{"A percentage discount for selected products only"|translate}}</p></li>'
    //   + '</ul>';
    // this.translate.get(array).subscribe((res) => { });
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Demo Coupons',
      buttons: [
        {
          icon: 'arrow-round-forward',
          text: 'Cart Percentage (cp9989). A percentage discount for selected products only',
          handler: () => {
            this.c = 'cp9989';
          }
        }, {
          icon: 'arrow-round-forward',
          text: 'Product Fixed (pf8787). A fixed total discount for selected products only',
          handler: () => {
            this.c = 'pf8787';
          }
        },
        {
          icon: 'arrow-round-forward',
          text: 'Cart Fixed (cf9999). A fixed total discount for the entire cart',
          handler: () => {
            this.c = 'cf9999';
          }
        },
        {
          icon: 'arrow-round-forward',
          text: 'Product Percentage (pp2233). A percentage discount for selected products only',
          handler: () => {
            this.c = 'pp2233';
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }
  //============================================================================================  
  //getting token from server
  getToken = function () {
    this.loading.autoHide(2000);
    this.http.get(this.config.url + 'generateBraintreeToken').map(res => res.json()).subscribe(data => {
      // this.loading.hide();
      if (data.success == 1) {
        if (this.tokenFromServer == null) {
          this.tokenFromServer = data.token;
          this.braintreePaypal(this.tokenFromServer);
          this.braintreeCreditCard(this.tokenFromServer);
        }
      }
      if (data.success == 0) {

      }
    }, error => {
      // this.loading.hide();
      if (this.paymentBraintree) {
        this.translate.get("Server Error").subscribe((res) => {
          this.alert.show(res + " " + error.status + " Braintree Token");
        });
      }

    });
  };
  //================================================================================
  // braintree paypal method
  braintreePaypal = function (clientToken) {
    this.loading.autoHide(2000);
    var nonce = 0;
    var promise = new Promise((resolve, reject) => {
      braintree.setup(clientToken, "custom", {
        paypal: {
          container: "paypal-container",
          displayName: "Shop"
        },
        onReady: function () {

          // $(document).find('#braintree-paypal-button').attr('href', 'javascript:void(0)');
        },
        onPaymentMethodReceived: function (obj) {
          //   console.log(obj.nonce);
          // this.nonce = obj.nonce;
          nonce = obj.nonce;
          resolve();
        }
      });


    });

    promise.then(
      (data) => {
        // console.log(nonce);
        this.addOrder(nonce);
      },
      (err) => { console.log(err); }
    );

  };
  //================================================================================
  // braintree creditcard method
  braintreeCreditCard = function (clientToken) {
    // this.loading.autoHide(2000);
    var nonce = 0;
    var promise = new Promise((resolve, reject) => {

      var braintreeForm = document.querySelector('#braintree-form');
      var braintreeSubmit = document.querySelector('button[id="braintreesubmit"]');
      braintree.client.create({
        authorization: clientToken
      }, function (clientErr, clientInstance) {
        if (clientErr) { }

        braintree.hostedFields.create({
          client: clientInstance,
          styles: {

          },
          fields: {
            number: {
              selector: '#card-number',
              placeholder: '4111 1111 1111 1111'
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123'
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: '10/2019'
            }
          }
        }, function (hostedFieldsErr, hostedFieldsInstance) {
          if (hostedFieldsErr) {
            // Handle error in Hosted Fields creation
            //alert("hostedFieldsErr" + hostedFieldsErr);
            document.getElementById('error-message').innerHTML = "hostedFieldsErr" + hostedFieldsErr;
            console.log("hostedFieldsErr" + hostedFieldsErr);
            return;
          }

          braintreeSubmit.removeAttribute('disabled');
          braintreeForm.addEventListener('submit', function (event) {
            document.getElementById('error-message').innerHTML = null;
            event.preventDefault();
            hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
              if (tokenizeErr) {
                //alert('Error : ' + JSON.stringify(tokenizeErr.message));
                // Handle error in Hosted Fields tokenization
                document.getElementById('error-message').innerHTML = tokenizeErr.message;
                return 0;
              }
              // Put `payload.nonce` into the `payment-method-nonce` input, and then
              // submit the form. Alternatively, you could send the nonce to your server
              // with AJAX.

              // document.querySelector('input[name="payment-method-nonce"]').value = payload.nonce;
              // this.nonce = payload.nonce;
              // this.addOrder(payload.nonce);
              nonce = payload.nonce;
              resolve();
              //  console.log(payload.nonce);

            });
          }, false);
        });
      });

    });
    promise.then(
      (data) => { //console.log(nonce); 
        this.addOrder(nonce);
      },
      (err) => { console.log(err); }
    );
  }
  scrollToBottom() {

    setTimeout(() => {
      this.content.scrollToBottom();
      console.log("botton");
    }, 300);

  }
  ngOnInit() {
    this.orderDetail = (JSON.parse(JSON.stringify(this.shared.orderDetails)));
    this.products = (JSON.parse(JSON.stringify(this.shared.cartProducts)));

    this.calculateTotal();
    this.initializePaymentMethods();

  }
  openHomePage() {
    this.navCtrl.popToRoot();
  }
}
