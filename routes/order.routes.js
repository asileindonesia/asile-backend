
module.exports = app => {
// var express = require('express');
// var app = express();
const Order = require("../controllers/order.controller.js");

// Get getOrder
app.post("/getReview", Order.getPendingOrders);

app.post('/getHistory', Order.getNotPendingOrders);

app.post('/getOrderbyUserId', Order.getOrdersbyUserId);

app.post('/createOrder', Order.createOrder);

app.post('/setStatus', Order.setStatus);

app.post('/removeOrder', Order.removeOrder);

};