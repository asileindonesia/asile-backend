
module.exports = app => {
// var express = require('express');
// var app = express();
const Discount = require("../controllers/discount.controller.js");

// Get getOrder
app.post("/createDiscount", Discount.createDiscount);

app.post('/getDiscountsbyItemId', Discount.getDiscountsbyItemId);

app.post('/getDiscountsbyId', Discount.getDiscountbyId);

app.post('/updateDiscount', Discount.updateDiscount);

app.post('/removeDiscount', Discount.removeDiscount);

};