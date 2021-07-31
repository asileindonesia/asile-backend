const Company = require("../model/company.model.js");
// Create and Save a new Company
exports.createCompany = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  // Create a Company
  const company = new Company({
    company_entity_name: req.body.company_entity_name,
    company_owner_name: req.body.company_owner_name,
    address:req.body.address,
    phone_number:req.body.phone_number,
    notes: req.body.notes,
    upload: req.body.upload,
    time_limit_per_schedule: req.body.time_limit_per_schedule,
    late_policy: req.body.late_policy,
    min_schedule_time: req.body.min_schedule_time,
    max_schedule_time: req.body.max_schedule_time,
    company_info: req.body.company_info
  });
  console.log(company);

  // Save Company in the database
  Company.createCompany(company, (err, data) => {
    console.log(company);
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Company."
      });
    else res.send(data);
  });
};

// Retrieve all Companys from the database.
exports.findAllCompany = (req, res) => {
    Company.getAllCompany((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Companys."
          });
        else res.send(data);
      });
};

exports.findCompanyByUserId = (req, res) => {
  Company.getCompanysByUserId(req.body.user_id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Companys."
        });
      else res.send(data);
    });
};

exports.findCompanyByID = (req, res) => {
  Company.getCompanyByID(req.body.company_id,(err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Companys."
        });
      else res.send(data);
    });
};

// Update a Company identified by the CompanyId in the request
exports.updateCompany = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const company = new Company({
    company_id: req.body.company_id,
    company_entity_name: req.body.company_entity_name,
    company_owner_name: req.body.company_owner_name,
    address: req.body.address,
    phone_number: req.body.phone_number,
    notes: req.body.notes,
    upload: req.body.upload,
    time_limit_per_schedule: req.body.time_limit_per_schedule,
    late_policy: req.body.late_policy,
    min_schedule_time: req.body.min_schedule_time,
    max_schedule_time: req.body.max_schedule_time,
    company_info: req.body.company_info
  });

  Company.updateCompanyById(
    req.body.company_id,
    company,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Company with id ${req.params.company_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Company with id " + req.params.company_id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Company with the specified CompanyId in the request
exports.deleteCompany = (req, res) => {
    Company.removeCompany(req.body.company_id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Company with id ${req.params.company_id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Company with id " + req.params.company_id
            });
          }
        } else res.send({ message: `Company was deleted successfully!` });
      });
};

// Delete all Companys from the database.
exports.deleteAllCompany = (req, res) => {
    Company.removeAllCompany((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Companys."
          });
        else res.send({ message: `All Companys were deleted successfully!` });
    });
};