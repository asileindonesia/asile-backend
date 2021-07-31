const User = require("../model/user.model.js");
const md5 = require('md5'); 
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const user = new User({
    full_name: req.body.full_name,
    password: md5(req.body.password),
    email: req.body.email,
    phone_number: req.body.phone_number,
    company_id: req.body.company_id,
    isAdmin: req.body.isAdmin,
    isActive: req.body.isActive,
    sales_target: req.body.sales_target,
    allow_so: req.body.allow_so
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

//Check user
exports.login = (req, res) => {
  // Validate request
  if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Save User in the database
    User.login(req.body.email, req.body.password, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      else res.send(data);
    });
  };
  

//Check user
exports.check = (req, res) => {
// Validate request
if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Save User in the database
  User.check(req.body.email, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    User.getAll(req.body.isAdmin, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Users."
          });
        else res.send(data);
      });
};

// Find a single User with a UserId
exports.findById = (req, res) => {
  User.findById(req.body.company_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    else res.send(data);
  });
};

// Get ID from user name
exports.getIDbyName = (req, res) => {
  User.getIDbyName(req.body.full_name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    else res.send(data);
  });
};

// Find a single User with a UserId
exports.findInfoById = (req, res) => {
  User.findInfoById(req.body.user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    else res.send(data);
  });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const user = new User({
    full_name: req.body.full_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    company_id: req.body.company_id,
    isAdmin: req.body.isAdmin,
    isActive: req.body.isActive,
    sales_target: req.body.sales_target,
    allow_so: req.body.allow_so
  });

  User.updateById(
    req.body.user_id,
    user,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.user_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.params.user_id
          });
        }
      } else res.send(data);
    }
  );
};

exports.updateSalesTarget = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.body)
  User.updateSalesTarget(
    req.body.user_id,
    req.body.sales_target,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id"
          });
        }
      } else res.send(data);
    }
  );
};

exports.settingSalesTarget = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  User.settingSalesTarget(
    req.body.company_id, req.body.sales_target,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id .`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id "
          });
        }
      } else res.send(data);
    }
  );
};

// Reset Password
exports.resetPassword = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  User.resetPassword(
    req.body.email,
    md5(req.body.password),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with email ${req.params.email}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with email " + req.params.email
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
    User.remove(req.body.user_id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.user_id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete User with id " + req.params.user_id
            });
          }
        } else res.send({ message: `User was deleted successfully!` });
      });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Users."
          });
        else res.send({ message: `All Users were deleted successfully!` });
    });
};