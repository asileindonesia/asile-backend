const sql = require("./db.js");
// constructor
const Item = function (item) {
  this.item_name = item.item_name;
  this.category_id = item.category_id;
  this.company_id = item.company_id;
  this.unit_price = item.unit_price;
  this.unit = item.unit;
  this.tag = item.tag
}

Item.createItem = (newitem, result) => {

  sql.query("INSERT INTO `item` SET ?", newitem, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created item: ", { item_id: res.insertId, ...newitem });
    result(null, { id: res.insertId, ...newitem });

  });

};

Item.getItemsbyCompanyId = (company_id, result) => {
  sql.query(`select i.*, c.company_entity_name, g.category_name from item i LEFT JOIN company c ON i.company_id=c.company_id LEFT JOIN category g ON i.category_id=g.category_id where i.company_id IN (${company_id})`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Company items: ", res);
    result(null, res);
  });
};

Item.getItemsbyGroupId = (category_id, result) => {
  sql.query(`select i.*, c.company_entity_name, g.category_name from item i LEFT JOIN company c ON i.company_id=c.company_id LEFT JOIN category g ON i.category_id=g.category_id where i.category_id=${category_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Company items: ", res);
    result(null, res);
  });
};

Item.getItembyId = (item_id, result) => {
  sql.query(`select i.*, c.company_entity_name, g.category_name from item i LEFT JOIN company c ON i.company_id=c.company_id LEFT JOIN category g ON i.category_id=g.category_id where item_id=${item_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Item by id: ", res[0]);
    result(null, res[0]);
  });
};

Item.getUnit = (unit,result) => {
  sql.query(`select unit_name from unit`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Units: ", res);
    result(null, res);
  });
};

Item.updateItem = (item_id, item_name, company_id, unit_price, unit, category_id, tag, result) => {
  sql.query(
    'UPDATE `item` SET `item_name`=?, `company_id`=?, `unit_price`=?, `unit`=?, `category_id`=?, `tag`=? WHERE item_id = ?', [item_name, company_id, unit_price, unit, category_id, tag, item_id],
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

      console.log("updated item: ", { item_id: item_id });
      result(null, { item_id: item_id});
    }
  );
};

Item.removeItem = (item_id, result) => {
  sql.query("DELETE FROM `item` WHERE item_id = ?", item_id, (err, res) => {
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

    console.log("deleted item with item_id: ", item_id);
    result(null, res);
  });
};


module.exports = Item;