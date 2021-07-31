const Category = require("../model/category.model.js");
// Create and Save a new client
exports.createCategory = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  // Create a Client
  const category = new Category({
    category_name: req.body.category_name,
    unit: req.body.unit,
    amount: req.body.amount
  });

  // Save client in the database
  Category.createCategory(category, (err, data) => {
    console.log(category);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the client."
      });
    else res.send(data);
  });
};

exports.getCategory = (req, res) => {
  Category.getCategory((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getCategorybyId = (req, res) => {
  Category.getCategorybyId(req.body.category_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.updateCategory = (req, res) => {
  Category.updateCategory(req.body.category_id, req.body.category_name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.settingCategory = (req, res) => {
  Category.settingCategory(req.body.category_id, req.body.unit, req.body.amount, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.removeCategory = (req, res) => {
  Category.removeCategory(req.body.category_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send({ message: `User was deleted successfully!` });
  });
};
