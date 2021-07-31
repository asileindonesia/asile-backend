const sql = require("./db.js");
// constructor
const Discount = function (discount) {
  this.item_id = discount.item_id;
  this.min_quantity = discount.min_quantity;
  this.max_quantity = discount.max_quantity;
  this.amount = discount.amount;
  this.type = discount.type;
}

Discount.createDiscount = (newDiscount, result) => {

  sql.query(`SELECT discount_id FROM discount 
  WHERE 
  (${newDiscount.min_quantity} 
  BETWEEN  min_quantity AND max_quantity
  OR 
  ${newDiscount.max_quantity} 
  BETWEEN min_quantity AND max_quantity)
  AND item_id = ${newDiscount.item_id} 
  AND type = '${newDiscount.type}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked discount: ", res[0]);
    if (res[0] != undefined) {
      console.log({ discount_id: "0" })
      result(null, { discount_id: "0" });
      return;
    } else {
      sql.query("INSERT INTO `discount` SET ?", newDiscount, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created Discount: ", { discount_id: res.insertId, ...newDiscount });
        result(null, { discount_id: res.insertId, ...newDiscount });

      });
    }
  });


};

Discount.getDiscountsbyItemId = (item_id, result) => {
  sql.query(`select * from discount where item_id=${item_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Item Discounts: ", res);
    result(null, res);
  });
};

Discount.getDiscountbyId = (discount_id, result) => {
  sql.query(`select d.*, i.item_name from discount d LEFT JOIN item i ON d.item_id=i.item_id WHERE discount_id=${discount_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Discount by id: ", res[0]);
    result(null, res[0]);
  });
};

Discount.updateDiscount = (discount_id, item_id, min_quantity, max_quantity, amount, type, result) => {
  console.log("checked : ", discount_id);
  sql.query(`SELECT discount_id FROM discount 
  WHERE 
  (${min_quantity} 
  BETWEEN  min_quantity AND max_quantity
  OR 
  ${max_quantity} 
  BETWEEN min_quantity AND max_quantity)
  AND item_id = ${item_id}
  AND type = '${type}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked discount: ", discount_id);
    if (res[0] == undefined || res[0].discount_id == discount_id) {
      sql.query(
        'UPDATE `discount` SET `min_quantity`=?, `max_quantity`=?, `amount`=?, `type`=? WHERE discount_id = ?', [min_quantity, max_quantity, amount, type, discount_id],
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

          console.log("updated Discount: ", { discount_id: discount_id });
          result(null, { discount_id: discount_id });
        }
      );
    } else {
      console.log({ discount_id: "0" })
      result(null, { discount_id: "0" });
      return;
    }
  });
};

Discount.removeDiscount = (discount_id, result) => {
  sql.query("DELETE FROM `discount` WHERE discount_id = ?", discount_id, (err, res) => {
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

    console.log("deleted Discount with Discount_id: ", discount_id);
    result(null, res);
  });
};


module.exports = Discount;