const Order = require("../model/order.model.js");
// Create and Save a new client
exports.createOrder = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  // Create a Client
  const order = new Order({
    user_id: req.body.user_id,
    client_id: req.body.client_id,
    order_items: req.body.order_items,
    promotions: req.body.promotions,
    tax: req.body.tax,
    shipping_cost: req.body.shipping_cost,
    net_total: req.body.net_total,
    order_date: req.body.order_date,
    order_method: req.body.order_method,
    notes: req.body.notes,
    client_signature: req.body.client_signature,
    user_signature: req.body.user_signature,
    upload_picture: req.body.upload_picture,
    custom_field: req.body.custom_field,
    location: req.body.location,
    status: req.body.status
  });

  // Save client in the database
  Order.createOrder(order, (err, data) => {
    console.log(order);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the client."
      });
    else res.send(data);
  });
};

exports.getPendingOrders = (req, res) => {
  Order.getPendingOrders((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getNotPendingOrders = (req, res) => {
  Order.getNotPendingOrders((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getOrdersbyUserId = (req, res) => {
  Order.getOrdersbyUserId(req.body.user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.setStatus = (req, res) => {
  Order.setStatus(req.body.order_id, req.body.status, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.removeOrder = (req, res) => {
  Order.removeOrder(req.body.order_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send({ message: `User was deleted successfully!` });
  });
};

