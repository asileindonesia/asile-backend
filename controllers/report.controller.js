const Report = require("../model/report.model.js");

exports.getSalesTargetbyCompanyID = (req, res) => {
  Report.getSalesTargetbyCompanyID(req.body.company_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getCategorySalesTarget = (req, res) => {
  Report.getCategorySalesTarget(req.body.category_id, req.body.type, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getCurrentSalesbyCompanyID = (req, res) => {
  Report.getCurrentSalesbyCompanyID(req.body.company_id, req.body.start_date, req.body.end_date, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getCurrentSalesbyCategoryID = (req, res) => {
  Report.getCurrentSalesbyCategoryID(req.body.category_id, req.body.start_date, req.body.end_date, req.body.type, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getUsersTargetbyCompanyID = (req, res) => {
  Report.getUsersTargetbyCompanyID(req.body.company_id, req.body.start_date, req.body.end_date, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

exports.getItemCategoryTarget = (req, res) => {
  Report.getItemCategoryTarget(req.body.start_date, req.body.end_date, req.body.type, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clients."
      });
    else res.send(data);
  });
};

