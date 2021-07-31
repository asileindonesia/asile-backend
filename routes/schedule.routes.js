
module.exports = app => {
    // var express = require('express');
    // var app = express();
    const Schedule = require("../controllers/schedule.controller.js");
    const NewSchedule = require("../controllers/schedule.controller.js");

    // Create new Schedule(For User)
    app.post("/createNewSchedule", NewSchedule.createNewSchedule);

    // Get All Schedule(For Super Admin)
    app.post("/getSchedule", Schedule.findAllSchedule);

    // Get Report by user_id
    app.post("/getReport", Schedule.getReport);

    // Get Schedule by user_id(company_id)
    app.post("/getScheduleByCompanyId", Schedule.findScheduleByCompanyId);

    // Get Schedule by user_id(company_id)
    app.post("/getScheduleByUserId", Schedule.findScheduleByUserId);

    app.post("/getCheckinScheduleByUserId", Schedule.findCheckinScheduleByUserId);

    app.post("/getCheckoutScheduleByUserId", Schedule.findCheckoutScheduleByUserId);

    //Delete Schedule
    app.post("/deleteSchedule", Schedule.deleteSchedule);

    //Checkin Schedule
    app.post("/checkin", Schedule.checkin);

    //Checkout Schedule
    app.post("/checkout", Schedule.checkout);

};