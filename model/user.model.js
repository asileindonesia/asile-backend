const sql = require("./db.js");
const md5 = require('md5');
// constructor
const User = function (user) {
  this.email = user.email;
  this.full_name = user.full_name;
  this.password = user.password;
  this.phone_number = user.phone_number;
  this.company_id = user.company_id;
  this.isAdmin = user.isAdmin;
  this.isActive = user.isActive;
  this.sales_target = user.sales_target;
  this.allow_so = user.allow_so;
};

User.create = (newUser, result) => {
  sql.query(`Select user_id from user where email = '${newUser.email}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked user: ", res[0]);
    if (JSON.stringify(res[0]) != undefined) {
      result(null, res[0]);
      return;
    } else {
      sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created user: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
      });
    }
  });

};

User.check = (email, result) => {
  console.log(email);

  sql.query(`Select * from user where email = '${email}' and isActive=1 `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked user: ", { user_id: res });
    result(null, res[0]);
  });
};

User.login = (email, password, result) => {
  console.log(email, password);

  sql.query(`Select * from user where email = '${email}' and password = '${md5(password)}' `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked user: ", { user_id: res[0] });
    if (res[0] == null) {
      result(null, { user_id: 0 })
    } else {
      result(null, res[0]);
    }

  });
};

User.findById = (company_id, result) => {
  sql.query(`SELECT * FROM user WHERE isAdmin = 0 and company_id IN (${company_id})`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res);
    result(null, res);
  });
};

User.getIDbyName = (full_name, result) => {
  sql.query(`SELECT user_id FROM user WHERE full_name = '${full_name}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res);
    result(null, res);
  });
};

User.findInfoById = (user_id, result) => {
  sql.query(`SELECT u.*, c.company_entity_name FROM user u LEFT OUTER JOIN company c
  ON c.company_id IN (u.company_id)
  WHERE user_id = ${user_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res);
    result(null, res);
  });
};

User.getAll = (isAdmin, result) => {
  sql.query(`SELECT u.*, c.company_entity_name FROM user u LEFT OUTER JOIN company c
	ON c.company_id = u.company_id WHERE isAdmin=${isAdmin} and isSuperAdmin=0`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE user SET full_name=?, email = ?, phone_number = ?, company_id = ?, isAdmin = ?, isActive = ?, sales_target = ?, allow_so = ? WHERE user_id = ?",
    [user.full_name, user.email, user.phone_number, user.company_id, user.isAdmin, user.isActive, user.sales_target, user.allow_so, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated User: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.updateSalesTarget = (user_id, sales_target, result) => {
  sql.query(
    "UPDATE user SET sales_target=? WHERE user_id = ?",
    [sales_target, user_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated User: ", { id: user_id});
      result(null, { id: user_id });
    }
  );
};

User.settingSalesTarget = (company_id, sales_target, result) => {
  sql.query(
    "UPDATE user SET sales_target=? WHERE user.company_id IN (?)",
    [sales_target, company_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      sql.query(
        "UPDATE company SET sales_target=? WHERE company_id IN (?)",
        [sales_target, company_id],
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }

          if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
          }

          console.log("updated User: ", { company_id: company_id });
          result(null, { company_id: company_id });
        }
      );
    }
  );
};

User.resetPassword = (email, password, result) => {
  sql.query(
    "UPDATE user SET password = ?, isActive = 0 WHERE email = ?",
    [password, email],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("reset password: ", { id: email, password });
      result(null, { email: email, password });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM user WHERE user_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted User with id: ", id);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} user`);
    result(null, res);
  });
};

module.exports = User;