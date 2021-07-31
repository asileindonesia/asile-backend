
module.exports = app => {
// var express = require('express');
// var app = express();
const Promotion = require("../controllers/promotion.controller.js");

// Get getOrder
app.post("/createPromotion", Promotion.createPromotion);

app.post('/getPromotionsbyCompanyId', Promotion.getPromotionsbyCompanyId);

app.post('/getPromotionsbyId', Promotion.getPromotionbyId);

app.post('/updatePromotion', Promotion.updatePromotion);

app.post('/removePromotion', Promotion.removePromotion);

};