const Schedule = require("../model/schedule.model.js");

// Create and Save a new User
exports.createNewSchedule = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
   // Create a newschedule
   const newschedule = new Schedule({
    user_id: req.body.user_id,
    client_id: req.body.client_id,
    schedule_datetime: req.body.schedule_datetime,
    predicted_time_spent: req.body.predicted_time_spent,
    reason: req.body.reason
  });
  console.log(newschedule);
  
  // Save Schedule in the database
  Schedule.createNewSchedule(newschedule, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

// Retrieve all clients from the database.
exports.findAllSchedule = (req, res) => {
    Schedule.getAllSchedule((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Clients."
          });
        else res.send(data);
      });
};

exports.findScheduleByCompanyId = (req, res) => {
  Schedule.getScheduleByCompanyId(req.body.company_id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Clients."
        });
      else res.send(data);
    });
};

exports.findScheduleByUserId = (req, res) => {
  Schedule.getScheduleByUserId(req.body.user_id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Clients."
        });
      else res.send(data);
    });
};

exports.findCheckinScheduleByUserId = (req, res) => {
  Schedule.getCheckinScheduleByUserId(req.body.user_id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Clients."
        });
      else res.send(data);
    });
};

exports.findCheckoutScheduleByUserId = (req, res) => {
  Schedule.getCheckoutScheduleByUserId(req.body.user_id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Clients."
        });
      else res.send(data);
    });
};

exports.getReport = (req, res) => {
  Schedule.getReport(req.body.user_id, req.body.start_date, req.body.end_date, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Clients."
        });
      else res.send(data);
    });
};

exports.checkin = (req, res) => {
  Schedule.checkin(req.body.schedule_id, req.body.check_in_datetime, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Clients."
        });
      else res.send(data);
    });
};

exports.checkout = (req, res) => {
  Schedule.checkout(req.body.schedule_id, req.body.check_out_datetime, req.body.notes, req.body.upload_picture, req.body.signature, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Clients."
        });
      else res.send(data);
    });
};

// Delete a client with the specified clientId in the request
exports.deleteSchedule = (req, res) => {
    Schedule.removeSchedule(req.body.schedule_id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found schedule with schedule_id ${req.params.schedule_id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete schedule with schedule_id " + req.params.schedule_id
            });
          }
        } else res.send({ message: `schedule was deleted successfully!` });
      });
};

// Delete all clients from the database.
exports.deleteAllSchedule = (req, res) => {
    Schedule.removeAllSchedule((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all schedules."
          });
        else res.send({ message: `All schedules were deleted successfully!` });
    });
};