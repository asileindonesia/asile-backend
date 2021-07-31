
module.exports = app => {
// var express = require('express');
// var app = express();
const Item = require("../controllers/item.controller.js");

// Get getOrder
app.post("/createItem", Item.createItem);

app.post('/getItemsbyCompanyId', Item.getItemsbyCompanyId);

app.post('/getItemsbyGroupId', Item.getItemsbyGroupId);

app.post('/getItemsbyId', Item.getItembyId);

app.post('/getUnit', Item.getUnit);

app.post('/updateItem', Item.updateItem);

app.post('/removeItem', Item.removeItem);

};