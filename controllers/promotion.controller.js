const Promotion = require("../model/promotion.model.js");
// Create and Save a new client
exports.createPromotion = (req, res) => {
  // Validate request
  console.log("Started .......")
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  // Create a Client
  const promotion = new Promotion({
    type: req.body.type,
    amount: req.body.amount,
    client_id: req.body.client_id
  });

  // Save client in the database
  Promotion.createPromotion(promotion, (err, data) => {
    console.log(promotion);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the client."
      });
    else res.send(data);
  });
};

exports.getPromotionsbyCompanyId = (req, res) => {
  Promotion.getPromotionsbyCompanyId(req.body.company_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getPromotionbyId = (req, res) => {
  Promotion.getPromotionbyId(req.body.promotion_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.updatePromotion = (req, res) => {
  Promotion.updatePromotion(req.body.promotion_id, req.body.type, req.body.amount, req.body.client_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.removePromotion = (req, res) => {
  Promotion.removePromotion(req.body.promotion_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send({ message: `User was deleted successfully!` });
  });
};

