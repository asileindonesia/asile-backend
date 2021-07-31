
module.exports = app => {
// var express = require('express');
// var app = express();
const Coupon = require("../controllers/coupon.controller.js");

// Get getOrder
app.post("/createCoupon", Coupon.createCoupon);

app.post('/getCoupons', Coupon.getCoupons);

app.post('/getCouponsbyId', Coupon.getCouponbyId);

app.post('/updateCoupon', Coupon.updateCoupon);

app.post('/removeCoupon', Coupon.removeCoupon);

};