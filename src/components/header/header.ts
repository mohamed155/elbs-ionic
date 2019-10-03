// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { CartPage } from '../../pages/cart/cart';
import { SearchPage } from '../../pages/search/search';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'header',
  animations: [
    trigger('shakeCart', [
      state('inactive', style({
        animation: 'shake 0.75s'
      })),
      state('active', style({
        //  animation: 'shake 0.75s'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ],
  templateUrl: 'header.html',

})
export class HeaderComponent {

  @Input('title') title;
  page;
  leftButtons = true;
  openCartPage = true;
  rightButtons = true;
  searchButton = true;
  closeButtonRight = false;
  cartquantity;
  cartShake = 'active'

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public events: Events

  ) {
    // console.log(navCtrl);

    events.subscribe('cartChange', (id, value) => {
      this.cartShake = 'inactive'
      setTimeout(() => {
        this.cartShake = 'active'
      }, 300);
    });

  }
  openCart() {
    if (this.openCartPage)
      this.navCtrl.push(CartPage);
  }
  openSearch() {
    if (this.title != 'Search')
      this.navCtrl.push(SearchPage);
  }
  openHomePage() {
    this.navCtrl.popToRoot();
  }

  ngOnChanges() {
    //console.log(this.navCtrl.getActive());
    this.page = this.title;

    if (this.page == 'My Cart') {
      this.leftButtons = false;
      this.openCartPage = false;
      this.searchButton = false;
    }
    else if (this.page == 'Shipping Address' || this.page == 'Billing Address' || this.page == 'Shipping Method') {
      // console.log("page" + this.page)
      this.leftButtons = false;
      this.searchButton = false;
      this.openCartPage = false;
    }
    else if (this.page == 'Order') {
      // console.log("page = " + this.page)
      this.leftButtons = false;
      this.rightButtons = false;
      this.closeButtonRight = true;
    }
    else if (this.page == 'Search') {
      //console.log("searchButton" + this.searchButton)
      this.leftButtons = false;
      this.searchButton = false;
    }
    else if (this.page == 'Shop') {
      //console.log("searchButton" + this.searchButton)
      this.leftButtons = false;
      this.searchButton = false;
    }
    else {
      this.leftButtons = true;
      this.rightButtons = true;
    }
  }
}
