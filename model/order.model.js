const sql = require("./db.js");
// constructor
const Order = function (order) {
  this.user_id = order.user_id;
  this.client_id = order.client_id;
  this.order_items = order.order_items;
  this.promotions = order.promotions;
  this.tax = order.tax;
  this.shipping_cost = order.shipping_cost;
  this.net_total = order.net_total,
  this.order_date = order.order_date,
  this.order_method = order.order_method,
  this.due_date = order.due_date,
  this.notes = order.notes,
  this.client_signature = order.client_signature,
  this.user_signature = order.user_signature,
  this.upload_picture = order.upload_picture,
  this.custom_field = order.custom_field,
  this.location = order.location,
  this.status = order.status
};

Order.createOrder = (newOrder, result) => {

  sql.query("INSERT INTO salesorder SET ?", newOrder, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Order: ", { order_id: res.insertId, ...newOrder });
    result(null, { id: res.insertId, ...newOrder });

  });

};

Order.getPendingOrders = (result) => {
  sql.query(`select s.*, 
  DATE_FORMAT(s.order_date,"%Y-%m-%d %H:%i:%s") as order_date,
  DATE_FORMAT(s.due_date,"%Y-%m-%d %H:%i:%s") as due_date,
  u.full_name, c.client_entity_name, co.company_entity_name from salesorder s 
  LEFT JOIN user u ON s.user_id=u.user_id 
  LEFT JOIN client c ON s.client_id=c.client_id
  LEFT JOIN company co ON u.company_id=co.company_id
  where status=0 order by s.due_date asc`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Pending Orders: ", res);
    result(null, res);
  });
};

Order.getNotPendingOrders = (result) => {
  sql.query(`select s.*, 
  DATE_FORMAT(s.order_date,"%Y-%m-%d %H:%i:%s") as order_date,
  DATE_FORMAT(s.due_date,"%Y-%m-%d %H:%i:%s") as due_date,
  u.full_name, c.client_entity_name, co.company_entity_name from salesorder s 
  LEFT JOIN user u ON s.user_id=u.user_id 
  LEFT JOIN client c ON s.client_id=c.client_id
  LEFT JOIN company co ON u.company_id=co.company_id
  where status!=0  order by s.due_date asc`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Not Pending Orders: ", res);
    result(null, res);
  });
};

Order.getOrdersbyUserId = (user_id, result) => {
  sql.query(`select * from salesorder where user_id = ${user_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("User Orders: ", res);
    result(null, res);
  });
};

Order.setStatus = (order_id, status, result) => {
  sql.query(
    'UPDATE salesorder SET `status`=? WHERE order_id = ?', [status, order_id],
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

      console.log("updated Order: ", { order_id: order_id, status: status });
      result(null, { order_id: order_id, status: status });
    }
  );
};

Order.removeOrder = (order_id, result) => {
  sql.query("DELETE FROM salesorder WHERE order_id = ?", order_id, (err, res) => {
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

    console.log("deleted Order with Order_id: ", order_id);
    result(null, res);
  });
};


module.exports = Order;