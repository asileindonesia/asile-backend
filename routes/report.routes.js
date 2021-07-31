
module.exports = app => {
// var express = require('express');
// var app = express();
const Report = require("../controllers/report.controller.js");

app.post("/getSalesTargetbyCompanyID", Report.getSalesTargetbyCompanyID);

app.post("/getCategorySalesTarget", Report.getCategorySalesTarget);

app.post('/getCurrentSalesbyCompanyID', Report.getCurrentSalesbyCompanyID);

app.post('/getCurrentSalesbyCategoryID', Report.getCurrentSalesbyCategoryID);

app.post('/getUsersTargetbyCompanyID', Report.getUsersTargetbyCompanyID);

app.post('/getItemCategoryTarget', Report.getItemCategoryTarget);

};