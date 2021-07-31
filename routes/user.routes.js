
module.exports = app => {
// var express = require('express');
// var app = express();
const User = require("../controllers/user.controller.js");

// Signup a new User
app.post("/signup", User.create);

// Check user
app.post("/login", User.login);

//ResetPassword
app.post("/resetPassword", User.resetPassword);

// Get All User (For Super Admin)
app.post("/getUser", User.findAll);

// Get User by Company Id (For Admin)
app.post("/getUserById", User.findById);

//Get User info by id (For User)
app.post("/getUserInfoById", User.findInfoById);

//Add New User
app.post("/addUser", User.create);

//Delete User
app.post("/deleteUser", User.delete);

//Update User
app.post("/updateUser", User.update);

app.post("/updateSalesTarget", User.updateSalesTarget);

app.post("/settingSalesTarget", User.settingSalesTarget);

// Get user_id from full_name
app.post("/getIDbyName", User.getIDbyName);

};