const Discount = require("../model/discount.model.js");
// Create and Save a new client
exports.createDiscount = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  // Create a Client
  const discount = new Discount({
    item_id: req.body.item_id,
    min_quantity: req.body.min_quantity,
    max_quantity: req.body.max_quantity,
    amount: req.body.amount,
    type: req.body.type
  });

  // Save client in the database
  Discount.createDiscount(discount, (err, data) => {
    console.log(discount);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the client."
      });
    else res.send(data);
  });
};

exports.getDiscountsbyItemId = (req, res) => {
  Discount.getDiscountsbyItemId(req.body.item_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getDiscountbyId = (req, res) => {
  Discount.getDiscountbyId(req.body.discount_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.updateDiscount = (req, res) => {
  Discount.updateDiscount(req.body.discount_id, req.body.item_id, req.body.min_quantity, req.body.max_quantity, req.body.amount, req.body.type, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.removeDiscount = (req, res) => {
  Discount.removeDiscount(req.body.discount_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send({ message: `User was deleted successfully!` });
  });
};

