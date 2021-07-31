const sql = require("./db.js");
// constructor
const Coupon = function (coupon) {
  this.coupon_id = coupon.coupon_id;
  this.code  = coupon.code,
  this.type = coupon.type;
  this.amount = coupon.amount;
  this.start_date = coupon.start_date,
  this.end_date = coupon.end_date
}

Coupon.createCoupon = (newCoupon, result) => {

  sql.query(`Select coupon_id from coupon where type = '${newCoupon.type}' and code = '${newCoupon.code}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("checked coupon: ", res[0]);
    if (res[0] != undefined) {
      console.log({ coupon_id: "0" })
      result(null, { coupon_id: "0" });
      return;
    } else {
      sql.query("INSERT INTO `coupon` SET ?", newCoupon, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created coupon: ", { coupon_id: res.insertId, ...newCoupon });
        result(null, { coupon_id: res.insertId, ...newCoupon });

      });
    }
  })
};

Coupon.getCoupons = (result) => {
  
  sql.query(`select coupon_id,
  code, type, amount,
  DATE_FORMAT(start_date,"%Y-%m-%d") as start_date,
  DATE_FORMAT(end_date,"%Y-%m-%d") as end_date
  from coupon where end_date > CURDATE()`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Company Coupons: ", res);
    result(null, res);
  });
};

Coupon.getCouponbyId = (coupon_id, result) => {
  sql.query(`select coupon_id,
  code, type, amount,
  DATE_FORMAT(start_date,"%Y-%m-%d") as start_date,
  DATE_FORMAT(end_date,"%Y-%m-%d") as end_date from coupon where coupon_id=${coupon_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("coupon by id: ", res[0]);
    result(null, res[0]);
  });
};

Coupon.updateCoupon = (coupon_id, code, type, amount, start_date, end_date, result) => {
  sql.query(`Select coupon_id from coupon where code = '${code}' and type = '${type}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("checked coupon: ", res[0]);
    if (res[0] == undefined || res[0].coupon_id == coupon_id) {
      sql.query(
        'UPDATE `coupon` SET `code`=?, `type`=?, `amount`=?, `start_date`=?, `end_date`=? WHERE coupon_id = ?', [code, type, amount, start_date, end_date, coupon_id],
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }

          if (res.affectedRows == 0) {
            // not found company with the id
            result({ kind: "not_found" }, null);
            return;
          }

          console.log("updated coupon: ", { coupon_id: coupon_id });
          result(null, { coupon_id: coupon_id });
        }
      );

    } else {
      console.log({ coupon_id: "0" })
      result(null, { coupon_id: "0" });
      return;
    }
  })
};

Coupon.removeCoupon = (coupon_id, result) => {
  sql.query("DELETE FROM `coupon` WHERE coupon_id = ?", coupon_id, (err, res) => {
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

    console.log("deleted coupon with coupon_id: ", coupon_id);
    result(null, res);
  });
};


module.exports = Coupon;