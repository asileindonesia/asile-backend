
module.exports = app => {
// var express = require('express');
// var app = express();
const Client = require("../controllers/salesclient.controller.js");

// Get SalesClient
app.post("/getSalesClient", Client.findAllSalesClient);

//Add New SalesClient
app.post("/addSalesClient", Client.createSalesClient);

//Add New SalesClient with csv
app.post("/addSalesClientWithCSV", Client.createSalesClientWithCSV);

//Delete SalesClient
app.post("/deleteSalesClient", Client.deleteSalesClient);

//Update SalesClient
app.post("/updateSalesClient", Client.updateSalesClient);

//get Clients
app.post("/getClientsById", Client.findClientsById);

//get sales Client by id
app.post("/getSalesClientById", Client.findSalesClientById);

//get sales Client by company id
app.post("/getSalesClientByCompanyId", Client.findSalesClientByCompanyId);

};