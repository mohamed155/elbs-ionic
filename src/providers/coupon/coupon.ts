// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Injectable } from '@angular/core';
import { SharedDataProvider } from '../shared-data/shared-data';
import { AlertProvider } from '../alert/alert';


@Injectable()
export class CouponProvider {

  constructor(
    public shared: SharedDataProvider,
    public alert: AlertProvider, ) {
  }
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< All below services are used for coupon >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //========================================================================================================
  //=============================== service to calculate line items total ==============================
  lineItemTotalService = function (lineItems) {
    var total = 0;
    for (let value of lineItems) {

      // console.log(value);
      var subtotal = parseFloat(value.total);
      total = total + subtotal;
    }

    return total;
  }
  //========================================================================================================
  //=============================== service to calculate line items total ==============================
  checkOnSaleService = function (lineItems, coupon) {
    if (coupon.exclude_sale_items == 0 || coupon.exclude_sale_items == '')
      return false;

    let found = false;

    lineItems.some(function (value, index) {
      if (value.on_sale == true)
        found = true;
    });

    if (found && coupon.discount_type == 'fixed_cart')
      return true;
    else if (found && coupon.discount_type == 'percent')
      return true;
    else
      return false;
  }

  //========================================================================================================
  //=============================== service to calculate line items total ==============================
  emailCheckService = function (emailList) {

    if (emailList.length == 0) return false;

    var found = false;
    for (let value of emailList) {

      if (value == this.shared.customerData.customers_email_address) {
        found = true;
        return true;
      }
    }
    return found;

  }
  //========================================================================================================
  //=============================== service to calculate line items total ==============================

  checkCategoriesService = function (value, coupon) {
    if (coupon.product_categories.length == 0 && coupon.excluded_product_categories.length == 0)
      return true;

    var categoryId = value.categories_id;
    var found = 0;
    for (let y of coupon.product_categories) {
      /// console.log("product_categories x = " + x.id + " y=" + y);
      if (categoryId == y) { found++; }
    }

    if (coupon.product_categories.length == 0) {
      found++;
    }

    var found2 = 0;
    //for excluded categries
    for (let y of coupon.excluded_product_categories) {
      // console.log("excluded_product_categories x = " + x.id + " y=" + y);
      if (categoryId == y) { found2++; }
    }
    //  console.log('found ' + found + ' found2 ' + found2);

    if (found != 0 && found2 == 0)
      return true;
    else
      return false;
  }

  //========================================================================================================
  //=============================== service to calculate line items total ==============================

  couponApplyOnProductService = function (value, coupon) {
    if (coupon.product_ids.length == 0 && coupon.exclude_product_ids.length == 0)
      return true;

    var id = value.products_id;
    var found = 0;
    //checking in allowed products
    for (let value of coupon.product_ids) {
      //  console.log("id = " + id + "vid" + vId + " value =" + value);
      if (id == value) {
        found++;
        return true;
      }
    }
    if (coupon.product_ids.length == 0) {
      found++;
    }

    var found2 = 0;
    //checking in excluded products
    for (let value of coupon.exclude_product_ids) {
      if (id == value) {
        found2++;
        return true;
      }
    }
    // console.log('found ' + found + ' found2 ' + found2);
    if (found != 0 && found2 == 0) {
      return true;
    }
    else
      return false;
  }

  //========================================================================================================
  //=============================== service to calculate line items total ==============================

  checkAlreadyAppliedService = function (coupon, couponLines) {
    if (couponLines.length == 0) return false;
    var found = false;
    for (let value of couponLines) {

      if (value.code == coupon.code)
        found = true;
    }
    return found;
  }

  //========================================================================================================
  //=============================== service to calculate line items total ==============================

  checkUserUsageService = function (coupon) {
    if (coupon.used_by == '') return false;
    if (coupon.usage_limit == 0 && coupon.usage_limit_per_user == 0) return false;

    if (coupon.usage_limit == 0) { }
    else if (coupon.usage_count >= coupon.usage_limit) return true;
    //console.log($rootScope.customerData);
    var id = this.shared.customerData.customers_email_address;

    if (this.shared.customerData != null)
      var id2 = this.shared.customerData.customers_id;

    var count = 0;
    for (let value of coupon.used_by) {
      if (value == id || value == id2) count++;
    }
    if (count >= coupon.usage_limit_per_user)
      return true;
    else
      return false;
  }

  //========================================================================================================
  //=============================== service to check ==============================


  checkNoItemInCartService = function (lineItems, coupon) {
    var productIds = coupon.product_ids;
    var ExProductIds = coupon.exclude_product_ids;
    var pCategory = coupon.product_categories;
    var ExPCategory = coupon.excluded_product_categories;

    if (productIds.length == 0 && ExProductIds.length == 0 && pCategory.length == 0 && ExPCategory.length == 0)
      return true;
    // var pFound = 0;
    // var ExPfound = 0;
    var result = false;
    //checking in products ids
    if (productIds.length != 0) {
      for (let x of lineItems) {//upper loop
        var id = x.products_id; var vId = -1;
        if (x.variation_id != undefined) vId = x.variation_id;
        for (let y of productIds) { //lower loop 
          if (id == y || vId == y) { result = true; }
        }
      }
    } else { result = true; }

    //checking in excluded products ids
    if (ExProductIds.length != 0) {

      for (let x of lineItems) {//upper loop  
        let id = x.products_id; let vId = -1;
        if (x.variation_id != undefined) vId = x.variation_id;
        for (let y of ExProductIds) {//lower loop  
          if (id == y || vId == y) { result = false; }
        }
      }
    }
    var result2 = false;

    //checking in products categories
    if (pCategory.length != 0) {
      for (let w of lineItems) {//upper loop 
        for (let x of w.categories) {//midddle loop 
          for (let y of pCategory) {//lower loop 
            // console.log("x " + x.id + " y " + y);
            if (x.id == y) { result2 = true; }
          }
        }
      }
    } else { result2 = true; }


    if (ExPCategory.length != 0) {
      for (let w of lineItems) {//upper loop 
        for (let x of w.categories) {//midddle loop 
          for (let y of pCategory) {//lower loop 
            // console.log("x " + x.id + " y " + y);
            if (x.id == y) { result2 = false; }
          }
        }
      }
    }

    //console.log("result " + result + " result2 " + result2);
    if (result == true && result2 == true && coupon.discount_type != 'fixed_cart')
      return true;
    else if (result == true && result2 == true && coupon.discount_type != 'percent')
      return true;
    else if (result == true && result2 == false && coupon.discount_type == 'fixed_product')
      return true;
    else if (result == true && result2 == false && coupon.discount_type == 'percent_product')
      return true;
    else if (result == false && result2 == true && coupon.discount_type == 'percent_product')
      return true;
    else if (result == false && result2 == true && coupon.discount_type == 'fixed_product')
      return true;
    else
      return false;

  }

  //========================================================================================================
  //=============================== service to check the validity of coupon  ==============================
  validateCouponService = function (coupon, lineItems, couponLines) {
    var expDate = new Date(coupon.expiry_date);
    var todayDate = new Date();
    //checking coupon expire or not
    if (expDate <= todayDate && coupon.expiry_date != null) {
      this.alert.show("Sorry Coupon is Expired");
      return false;
    }
    // if cart amount is lower than the coupon minimum limit
    else if (this.lineItemTotalService(lineItems) <= coupon.minimum_amount) {

      this.alert.show("Sorry your Cart total is low than coupon min limit!");
      return false;
    }
    // if cart amount is higher than the coupon minimum limit
    else if (this.lineItemTotalService(lineItems) >= coupon.maximum_amount && coupon.maximum_amount != 0) {
      this.alert.show("Sorry your Cart total is Higher than coupon Max limit!");
      return false;
    }
    else if (this.emailCheckService(coupon.email_restrictions) == true) {
      this.alert.show("Sorry, this coupon is not valid for this email address!");
      return false;
    }
    //============================================================== further checking
    else if (this.checkOnSaleService(lineItems, coupon) == true) {
      this.alert.show("Sorry, this coupon is not valid for sale items.");
      return false;
    }
    else if (this.checkAlreadyAppliedService(coupon, couponLines) == true) {
      this.alert.show("Coupon code already applied!");
      return false;
    }
    else if (couponLines != 0 && couponLines[0].individual_use == 1) {
      this.alert.show('Sorry Individual Use Coupon is already applied any other coupon cannot be applied with it !');
      return false;
    }
    else if (this.checkUserUsageService(coupon) == true) {
      this.alert.show('Coupon usage limit has been reached.');
      return false;
    }
    // else if (checkNoItemInCartService(lineItems, coupon) == false) {
    //   this.alert.show('Sorry, this coupon is not applicable to your cart contents.');
    //   return false;
    // }
    else
      return true;
  }


  //========================================================================================================
  //=============================== service to apply check coupon ==============================

  apply = function (coupon, lineItems) {

    var productLimit = coupon.limit_usage_to_x_items;
    if (productLimit == 0) productLimit = null;
    var product_qty_flag = 0;
    //fixed cart applying on line items
    if (coupon.discount_type == 'fixed_cart') {
      var cartTotal = parseFloat(this.lineItemTotalService(lineItems));
      var discount = parseFloat((coupon.amount / cartTotal).toString());
      lineItems.forEach((value, index) => {
        var result = value.total - parseFloat((discount * value.total).toString());
        if (result < 0) result = 0;
        value.total = result;
      });

      //console.log('fixed_cart'); //console.log(lineItems);
      return lineItems;

    }
    //percent cart applying on line items
    else if (coupon.discount_type == 'percent') {
      lineItems.forEach((value, index) => {
        var amount = parseFloat(coupon.amount);
        var subtotal = parseFloat(value.subtotal);
        var total = parseFloat(value.total);
        var discount = (subtotal / 100) * amount;
        value.total = parseFloat((total - discount).toString());
        if (value.total < 0) value.total = 0;
      });
      // console.log('percent'); console.log(lineItems);
      return lineItems;
    }
    //fixed product applying on specific line items
    else if (coupon.discount_type == 'fixed_product') {

      var amount = parseFloat(coupon.amount);
      lineItems.forEach((value, index) => {
        if (this.couponApplyOnProductService(value, coupon) && this.checkCategoriesService(value, coupon)) {
          var quantity = value.customers_basket_quantity;
          var total = parseFloat(value.total);
          if (productLimit > 0) {
            for (var l = 1; l <= quantity; l++) {
              if (product_qty_flag < productLimit) {
                total = parseFloat((total - amount).toString())
                product_qty_flag = product_qty_flag + 1;
              }
            }
            value.total = total;
          }
          else {
            value.total = parseFloat((total - (amount * quantity)).toString());

          }
          if (value.total < 0) { value.total = 0; }
        }
      });
      // console.log('fixed_product');
      return lineItems;
    }
    //percent product applying on specific line items
    else if (coupon.discount_type == 'percent_product') {
      let amount = parseFloat(coupon.amount);
      lineItems.forEach((value, index) => {
        if (this.couponApplyOnProductService(value, coupon) && this.checkCategoriesService(value, coupon)) {
          var total = parseFloat(value.total);
          if (productLimit > 0) {
            for (var l = 1; l <= value.customers_basket_quantity; l++) {
              var discount = parseFloat(((value.price / 100) * amount).toString());
              if (product_qty_flag < productLimit) {
                total = parseFloat((total - discount).toString())
                product_qty_flag = product_qty_flag + 1;
              }
            }
            value.total = total;
          } else {
            value.total = parseFloat((total - (total / 100) * amount).toString());
          }

          if (value.total < 0) value.total = 0;
        }
      });

      //console.log('percent_product');
      return lineItems;
    }
    // else return lineItems;
  }


}
