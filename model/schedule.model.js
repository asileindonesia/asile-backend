const sql = require("./db.js");


// constructor
const Schedule = function (schedule) {
  this.schedule_id = schedule.schedule_id,
    this.full_name = schedule.full_name,
    this.client_entity_name = schedule.client_entity_name,
    this.user_id = schedule.user_id,
    this.client_id = schedule.client_id,
    this.schedule_datetime = schedule.schedule_datetime,
    this.predicted_time_spent = schedule.predicted_time_spent,
    this.notes = schedule.notes,
    this.upload_picture = schedule.upload_picture,
    this.check_in_datetime = schedule.check_in_datetime,
    this.check_out_datetime = schedule.check_out_datetime,
    this.reason = schedule.reason,
    this.isLate = schedule.isLate,
    this.exceed_time_limit = schedule.exceed_time_limit
};

//create new schedule
Schedule.createNewSchedule = (newSchedule, result) => {
  sql.query(`Select schedule_id from schedule 
  WHERE 
  '${newSchedule.schedule_datetime}' BETWEEN  schedule_datetime AND DATE_ADD(schedule_datetime, INTERVAL predicted_time_spent MINUTE) AND sales_client_id IN (SELECT sales_client_id FROM sales_client WHERE user_id=${newSchedule.user_id})`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked user: ", res[0]);
    if (JSON.stringify(res[0]) != undefined) {
      console.log({ schedule_id: "0" })
      result(null, { schedule_id: "0" });
      return;
    } else {
      sql.query(`INSERT INTO schedule (sales_client_id, schedule_datetime, predicted_time_spent, reason) SELECT sales_client_id, '${newSchedule.schedule_datetime}', ${newSchedule.predicted_time_spent}, '${newSchedule.reason}' FROM sales_client WHERE user_id = ${newSchedule.user_id} and client_id = ${newSchedule.client_id}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created schedule: ", { res });
        result(null, { res });
      });
    }
  });

};

Schedule.getAllSchedule = (result) => {
  sql.query(`SELECT
	s.schedule_id,
	u.full_name,
	c.client_entity_name,
	DATE_FORMAT(s.schedule_datetime,"%Y-%m-%d %H:%i:%s") as schedule_datetime,
	s.predicted_time_spent,
	s.notes,
	s.upload_picture,
	DATE_FORMAT(s.check_in_datetime,"%Y-%m-%d %H:%i:%s") as check_in_datetime,
	DATE_FORMAT(s.check_out_datetime,"%Y-%m-%d %H:%i:%s") as check_out_datetime,
  s.reason,
  s.isLate,
  s.exceed_time_limit,
  co.company_id,
  co.company_entity_name,
  s.signature
FROM
	schedule s
LEFT OUTER JOIN sales_client sc
	ON s.sales_client_id = sc.sales_client_id
LEFT OUTER JOIN user u
	ON u.user_id = sc.user_id
LEFT OUTER JOIN client c
  ON c.client_id = sc.client_id
LEFT OUTER JOIN company co
  ON c.company_id = co.company_id`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Schedules: ", res);
    result(null, res);
  });
};

Schedule.getReport = (user_id, start_date, end_date, result) => {
  let schedule_number = 0
  let success = 0
  let new_client = 0
  sql.query(`SELECT u.full_name, COUNT(u.full_name) AS schedule_number
  FROM schedule s 
 LEFT OUTER JOIN sales_client sc 
 ON s.sales_client_id = sc.sales_client_id
 LEFT OUTER JOIN user u
 ON u.user_id = sc.user_id
 WHERE u.user_id = ${user_id} AND s.schedule_datetime BETWEEN '${start_date}' AND '${end_date}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Schedule_number: ", res[0]);
    schedule_number = res[0].schedule_number
    sql.query(`SELECT u.full_name, COUNT(u.full_name) AS success
  FROM schedule s 
 LEFT OUTER JOIN sales_client sc 
 ON s.sales_client_id = sc.sales_client_id
 LEFT OUTER JOIN user u
 ON u.user_id = sc.user_id
 WHERE u.user_id = ${user_id} AND 
 s.schedule_datetime BETWEEN '${start_date}' AND '${end_date}'
 AND s.check_in_datetime != 0 AND s.check_out_datetime != 0
 `, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("success: ", res[0]);
      success = res[0].success
      // result(null, res[0]);
      sql.query(`SELECT COUNT(*) AS new_client FROM client WHERE created_by = ${user_id}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        console.log("new client: ", res[0]);
        new_client = res[0].new_client

        console.log("=====>", schedule_number, success, new_client)
        result(null, { schedule_number: schedule_number, success: success, new_client: new_client, percentage: schedule_number != 0? success/schedule_number*100: 0 });
      });
    });

    // result(null, res[0]);
  });

};

Schedule.getScheduleByCompanyId = (company_id, result) => {
  sql.query(`SELECT
	s.schedule_id,
	u.full_name,
	c.client_entity_name,
	DATE_FORMAT(s.schedule_datetime,"%Y-%m-%d %H:%i:%s") as schedule_datetime,
	s.predicted_time_spent,
	s.notes,
	s.upload_picture,
	DATE_FORMAT(s.check_in_datetime,"%Y-%m-%d %H:%i:%s") as check_in_datetime,
	DATE_FORMAT(s.check_out_datetime,"%Y-%m-%d %H:%i:%s") as check_out_datetime,
	s.reason,
  s.isLate,
  s.exceed_time_limit,
  s.signature
FROM
	schedule s
LEFT OUTER JOIN sales_client sc
	ON s.sales_client_id = sc.sales_client_id
LEFT OUTER JOIN user u
	ON u.user_id = sc.user_id
LEFT OUTER JOIN client c
  ON c.client_id = sc.client_id
WHERE
	u.company_id IN (${company_id})`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Schedules: ", res);
    result(null, res);
  });
};

Schedule.getScheduleByUserId = (user_id, result) => {
  sql.query(`SELECT
  c.client_id,
  c.client_entity_name,
  DATE_FORMAT(s.schedule_datetime,"%Y-%m-%d %H:%i:%s") as schedule_datetime,
  DATE_FORMAT(s.check_in_datetime,"%Y-%m-%d %H:%i:%s") as check_in_datetime,
  DATE_FORMAT(s.check_out_datetime,"%Y-%m-%d %H:%i:%s") as check_out_datetime
FROM
	schedule s
LEFT OUTER JOIN sales_client sc
	ON s.sales_client_id = sc.sales_client_id
LEFT OUTER JOIN user u
	ON u.user_id = sc.user_id
LEFT OUTER JOIN client c
  ON c.client_id = sc.client_id
WHERE
  u.user_id = ${user_id}
  ORDER BY s.schedule_datetime ASC`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Schedules: ", res);
    result(null, res);
  });
};

Schedule.getCheckinScheduleByUserId = (user_id, result) => {
  sql.query(`SELECT
  c.client_id,
  c.client_entity_name,
  s.schedule_id,
  DATE_FORMAT(s.schedule_datetime,"%Y-%m-%d %H:%i:%s") as schedule_datetime
FROM
	schedule s
LEFT OUTER JOIN sales_client sc
	ON s.sales_client_id = sc.sales_client_id
LEFT OUTER JOIN user u
	ON u.user_id = sc.user_id
LEFT OUTER JOIN client c
  ON c.client_id = sc.client_id
WHERE
  u.user_id = ${user_id} AND s.check_in_datetime='0000-00-00 00:00:00'
  ORDER BY s.schedule_datetime ASC`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Schedules: ", res);
    result(null, res);
  });
};

Schedule.getCheckoutScheduleByUserId = (user_id, result) => {
  sql.query(`SELECT
  c.client_id,
  c.client_entity_name,
  s.schedule_id,
  DATE_FORMAT(s.schedule_datetime,"%Y-%m-%d %H:%i:%s") as schedule_datetime
FROM
	schedule s
LEFT OUTER JOIN sales_client sc
	ON s.sales_client_id = sc.sales_client_id
LEFT OUTER JOIN user u
	ON u.user_id = sc.user_id
LEFT OUTER JOIN client c
  ON c.client_id = sc.client_id
WHERE
  u.user_id = ${user_id} AND s.check_out_datetime='0000-00-00 00:00:00' AND s.check_in_datetime !='0000-00-00 00:00:00'
  ORDER BY s.schedule_datetime ASC`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Schedules: ", res);
    result(null, res);
  });
};

Schedule.removeSchedule = (schedule_id, result) => {
  sql.query("DELETE FROM schedule WHERE schedule_id = ?", schedule_id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Client with the compny_id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Schedule with schedule_id: ", schedule_id);
    result(null, res);
  });
};

Schedule.removeAllSchedule = result => {
  sql.query("DELETE FROM schedule", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} schedule`);
    result(null, res);
  });
};

Schedule.checkin = (schedule_id, check_in_datetime, result) => {
  if (schedule_id == null) {
    return
  }
  let c_datetime = new Date(check_in_datetime)
  //Get Geolocation and check 200m
  sql.query(`SELECT c.* FROM company c  WHERE company_id = (SELECT company_id FROM user WHERE user_id = (SELECT user_id FROM sales_client WHERE sales_client_id = (SELECT sales_client_id FROM schedule WHERE schedule_id = ${schedule_id})))`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    let late_policy = res[0].late_policy
    console.log("Late policy", late_policy)
    sql.query(`SELECT schedule_datetime FROM schedule WHERE schedule_id = ${schedule_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      let schedule_datetime = new Date(res[0].schedule_datetime)

      console.log("Schedule Datetime: ", schedule_datetime);
      console.log(c_datetime.getTime(), schedule_datetime.getTime())
      var diff = (c_datetime.getTime() - schedule_datetime.getTime()) / 1000;

      diff /= (60 * 60)
      console.log(diff)
      let isLate = 0
      if (late_policy > diff) {
        isLate = 0
      } else {
        isLate = 1
      }
      sql.query(`UPDATE schedule SET check_in_datetime='${check_in_datetime}', isLate=${isLate} WHERE schedule_id = ${schedule_id}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        console.log("Schedules: ", res);
        result(null, res);
      });
    });
    // console.log("Company_Rules: ", late_policy);
    // result(null, res);
  });


};


Schedule.checkout = (schedule_id, check_out_datetime, notes, upload_picture, signature, result) => {

  //Get Geolocation and check 200m
  console.log(schedule_id)
  if (schedule_id == null) {
    return
  }
  let c_datetime = new Date(check_out_datetime)
  //Get Geolocation and check 200m
  sql.query(`SELECT c.* FROM company c  WHERE company_id = (SELECT company_id FROM user WHERE user_id = (SELECT user_id FROM sales_client WHERE sales_client_id = (SELECT sales_client_id FROM schedule WHERE schedule_id = ${schedule_id})))`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    let time_limit_per_schedule = res[0].time_limit_per_schedule
    console.log("time_limit_per_schedule", res)
    sql.query(`SELECT check_in_datetime FROM schedule WHERE schedule_id = ${schedule_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      let check_in_datetime = new Date(res[0].check_in_datetime)

      console.log("check_in_datetime: ", check_in_datetime);
      console.log(c_datetime.getTime(), check_in_datetime.getTime())
      var diff = (c_datetime.getTime() - check_in_datetime.getTime()) / 1000;

      diff /= (60 * 60)
      console.log(diff)
      let exceed_time_limit = 0
      if (time_limit_per_schedule > diff) {
        exceed_time_limit = 0
      } else {
        exceed_time_limit = 1
      }
      sql.query(`UPDATE schedule SET check_out_datetime='${check_out_datetime}', exceed_time_limit=${exceed_time_limit}, notes='${notes}', upload_picture='${upload_picture}', signature='${signature}' WHERE schedule_id = ${schedule_id}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        console.log("Schedules: ", res);
        result(null, res);
      });
    });
    // console.log("Company_Rules: ", late_policy);
    // result(null, res);
  });
};

module.exports = Schedule;