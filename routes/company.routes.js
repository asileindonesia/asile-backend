
module.exports = app => {
// var express = require('express');
// var app = express();
const Company = require("../controllers/company.controller.js");

// Get Company
app.post("/getCompany", Company.findAllCompany);

// Get Company by id
app.post("/getCompanyById", Company.findCompanyByID);


//Add New Company
app.post("/addCompany", Company.createCompany);

//Delete Company
app.post("/deleteCompany", Company.deleteCompany);

//Update Company
app.post("/updateCompany", Company.updateCompany);


};