const sql = require("./db.js");
// constructor
const Promotion = function (promotion) {
  this.type = promotion.type;
  this.amount = promotion.amount;
  this.client_id = promotion.client_id
}

Promotion.createPromotion = (newpromotion, result) => {

  sql.query(`Select promotion_id from promotion where type = '${newpromotion.type}' and client_id = ${newpromotion.client_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("checked promotion: ", res[0]);
    if (res[0] != undefined) {
      console.log({ promotion_id: "0" })
      result(null, { promotion_id: "0" });
      return;
    } else {
      sql.query("INSERT INTO `promotion` SET ?", newpromotion, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created promotion: ", { promotion_id: res.insertId, ...newpromotion });
        result(null, { promotion_id: res.insertId, ...newpromotion });

      });
    }
  })
};

Promotion.getPromotionsbyCompanyId = (company_id, result) => {
  sql.query(`select p.*, c.client_entity_name from promotion p, client c where c.company_id IN (${company_id})`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Company promotions: ", res);
    result(null, res);
  });
};

Promotion.getPromotionbyId = (promotion_id, result) => {
  sql.query(`select p.*, c.client_entity_name from promotion p LEFT JOIN client c ON p.client_id=c.client_id where promotion_id=${promotion_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("promotion by id: ", res[0]);
    result(null, res[0]);
  });
};

Promotion.updatePromotion = (promotion_id, type, amount, client_id, result) => {
  sql.query(`Select promotion_id from promotion where type = '${type}' and client_id = ${client_id} and amount=${amount}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("checked promotion: ", res[0]);
    if (res[0] == undefined || res[0].promotion_id == promotion_id) {
      sql.query(
        'UPDATE `promotion` SET `type`=?, `amount`=?, `client_id`=? WHERE promotion_id = ?', [type, amount, client_id, promotion_id],
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

          console.log("updated promotion: ", { promotion_id: promotion_id });
          result(null, { promotion_id: promotion_id });
        }
      );

    } else {
      console.log({ promotion_id: "0" })
      result(null, { promotion_id: "0" });
      return;
    }
  })
};

Promotion.removePromotion = (promotion_id, result) => {
  sql.query("DELETE FROM `promotion` WHERE promotion_id = ?", promotion_id, (err, res) => {
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

    console.log("deleted promotion with promotion_id: ", promotion_id);
    result(null, res);
  });
};


module.exports = Promotion;