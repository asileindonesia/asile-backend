const SalesClient = require("../model/salesclient.model.js");
// Create and Save a new SalesClient
exports.createSalesClient = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  // Create a SalesClient
  const salesclient = new SalesClient({
    user_id: req.body.user_id,
    client_id:req.body.client_id
  });
  console.log(salesclient);

  // Save client in the database
  SalesClient.createSalesClient(salesclient, (err, data) => {
    console.log(salesclient);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the SalesClient."
      });
    else res.send(data);
  });
};

exports.createSalesClientWithCSV = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  // Create a SalesClient
  const salesclient = new SalesClient({
    user_id: req.body.user_id,
    client_id:req.body.client_id
  });
  console.log(salesclient);

  // Save client in the database
  SalesClient.createSalesClientWithCSV(salesclient, (err, data) => {
    console.log(salesclient);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the SalesClient."
      });
    else res.send(data);
  });
};

// Retrieve all SalesClients from the database.
exports.findAllSalesClient = (req, res) => {
    SalesClient.getAllSalesClient((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving SalesClients."
          });
        else res.send(data);
      });
};

exports.findSalesClientById = (req, res) => {
  SalesClient.getSalesClientById(req.body.sales_client_id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving SalesClients."
        });
      else res.send(data);
    });
};

exports.findSalesClientByCompanyId = (req, res) => {
  SalesClient.getSalesClientsByCompanyId(req.body.company_id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving SalesClients."
        });
      else res.send(data);
    });
};

exports.findClientsById = (req, res) => {
  SalesClient.getClientsById(req.body.user_id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving SalesClients."
        });
      else res.send(data);
    });
};

// Update a SalesClient identified by the SalesClientId in the request
exports.updateSalesClient = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const salesclient = new SalesClient({
    sales_client_id:req.body.sales_client_id,
    user_id: req.body.user_id,
    client_id:req.body.client_id
  });

  SalesClient.updateSalesClientById(
    req.body.sales_client_id,
    salesclient,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found SalesClient with id ${req.params.sales_client_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating SalesClient with id " + req.params.sales_client_id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a SalesClient with the specified SalesClientId in the request
exports.deleteSalesClient = (req, res) => {
    SalesClient.removeSalesClient(req.body.sales_client_id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found SalesClient with id ${req.params.sales_client_id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete SalesClient with id " + req.params.sales_client_id
            });
          }
        } else res.send({ message: `SalesClient was deleted successfully!` });
      });
};

// Delete all SalesClients from the database.
exports.deleteAllSalesClient = (req, res) => {
    SalesClient.removeAllSalesClient((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all SalesClients."
          });
        else res.send({ message: `All SalesClients were deleted successfully!` });
    });
};