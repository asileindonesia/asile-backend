const Item = require("../model/item.model.js");
// Create and Save a new client
exports.createItem = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  // Create a Client
  const item = new Item({
    item_name: req.body.item_name,
    category_id: req.body.category_id,
    company_id: req.body.company_id,
    unit_price: req.body.unit_price,
    unit: req.body.unit,
    tag: req.body.tag,
    category_id: req.body.category_id
  });

  // Save client in the database
  Item.createItem(item, (err, data) => {
    console.log(item);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the client."
      });
    else res.send(data);
  });
};

exports.getItemsbyCompanyId = (req, res) => {
  Item.getItemsbyCompanyId(req.body.company_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getItemsbyGroupId = (req, res) => {
  Item.getItemsbyGroupId(req.body.category_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getItembyId = (req, res) => {
  Item.getItembyId(req.body.item_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getUnit = (req, res) => {
  Item.getUnit(req, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.updateItem = (req, res) => {
  Item.updateItem(req.body.item_id, req.body.item_name, req.body.company_id, req.body.unit_price, req.body.unit, req.body.category_id, req.body.tag, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.removeItem = (req, res) => {
  Item.removeItem(req.body.item_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send({ message: `User was deleted successfully!` });
  });
};

