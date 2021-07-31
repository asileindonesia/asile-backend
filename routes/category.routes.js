
module.exports = app => {
// var express = require('express');
// var app = express();
const Category = require("../controllers/category.controller.js");

// Get getOrder
app.post("/createCategory", Category.createCategory);

app.post('/getCategory', Category.getCategory);

app.post('/getCategorybyId', Category.getCategorybyId);

app.post('/updateCategory', Category.updateCategory);

app.post('/settingCategory', Category.settingCategory);

app.post('/removeCategory', Category.removeCategory);


};