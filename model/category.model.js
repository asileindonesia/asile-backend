const sql = require("./db.js");
// constructor
const Category = function (category) {
  this.category_id = category.category_id;
  this.category_name = category.category_name;
}

Category.createCategory = (newCategory, result) => {

  sql.query(`SELECT category_id FROM category WHERE category_name = '${newCategory.category_name}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked Category: ", res[0]);
    if (res[0] != undefined) {
      console.log({ category_id: "0" })
      result(null, { category_id: "0" });
      return;
    } else {
      sql.query("INSERT INTO `category` SET ?", newCategory, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created Category: ", { category_id: res.insertId, ...newCategory });
        result(null, { category_id: res.insertId, ...newCategory });

      });
    }
  });


};

Category.getCategory = (result) => {
  sql.query(`select * from category `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("Category: ", res);
    result(null, res);
  });
};

Category.getCategorybyId = (category_id, result) => {
  sql.query(`select * from category where category_id=${category_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Category: ", res);
    result(null, res);
  });
};

Category.updateCategory = (category_id, category_name, result) => {
  sql.query(`SELECT category_id FROM category  WHERE  category_name = '${category_name}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked Category: ", res[0]);
    if (res[0] != undefined) {
      console.log({ category_id: "0" })
      result(null, { category_id: "0" });
      return;
    } else {
      console.log("infor====>", category_id, category_name)
      sql.query(
        'UPDATE `category` SET `category_name`=? WHERE category_id = ?', [category_name, category_id],
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

          console.log("updated Category: ", { category_id: category_id });
          result(null, { category_id: category_id });
        }
      );
    }
  });
};

Category.settingCategory = (category_id, unit, amount, result) => {
  sql.query(
    'UPDATE `category` SET `unit`=?, `amount`=? WHERE category_id = ?', [unit, amount, category_id],
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

      console.log("updated Category: ", { category_id: category_id });
      result(null, { category_id: category_id });
    }
  );
};

Category.removeCategory = (category_id, result) => {
  sql.query("DELETE FROM `category` WHERE category_id = ?", category_id, (err, res) => {
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

    console.log("deleted Category with category_id: ", category_id);
    result(null, res);
  });
};


module.exports = Category;