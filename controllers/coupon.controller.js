const Coupon = require("../model/coupon.model.js");
// Create and Save a new client
exports.createCoupon = (req, res) => {
  // Validate request
  console.log("Started .......")
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Client
  const coupon = new Coupon({
    code: req.body.code,
    type: req.body.type,
    amount: req.body.amount,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  });

  // Save client in the database
  Coupon.createCoupon(coupon, (err, data) => {
    console.log(coupon);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the client."
      });
    else res.send(data);
  });
};

exports.getCoupons = (req, res) => {
  Coupon.getCoupons((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getCouponbyId = (req, res) => {
  Coupon.getCouponbyId(req.body.coupon_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.updateCoupon = (req, res) => {
  Coupon.updateCoupon(req.body.coupon_id, req.body.code, req.body.type, req.body.amount, req.body.start_date, req.body.end_date, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.removeCoupon = (req, res) => {
  Coupon.removeCoupon(req.body.coupon_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send({ message: `User was deleted successfully!` });
  });
};

