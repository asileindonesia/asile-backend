const sql = require("./db.js");
const { removeSalesClient } = require("./salesclient.model.js");
// constructor
const Report = function (report) {
  this.company_id = report.company_id;
};

Report.getSalesTargetbyCompanyID = (company_id, result) => {
  sql.query(`SELECT SUM(sales_target) as sales_target FROM company where company_id IN (${company_id})`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Company SalesTarget: ", res[0]);
    result(null, res[0]);
  });
};

Report.getCategorySalesTarget = (category_id, type, result) => {
  if (type == "Unit") {
    if (category_id == '0') {
      sql.query(`SELECT SUM(unit) as sales_target from category`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("Company SalesTarget: ", res[0]);
        result(null, res[0]);
      });
    } else {
      sql.query(`SELECT SUM(unit) as sales_target from category WHERE category_id = ${category_id} `, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("Company SalesTarget: ", res[0]);
        result(null, res[0]);
      });
    }

  } else {
    if (category_id == '0') {
      sql.query(`SELECT SUM(amount) as sales_target from category`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("Company SalesTarget: ", res[0]);
        result(null, res[0]);
      });
    } else {
      sql.query(`SELECT SUM(amount) as sales_target from category WHERE category_id = ${category_id} `, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("Company SalesTarget: ", res[0]);
        result(null, res[0]);
      });
    }
  }

};

Report.getCurrentSalesbyCompanyID = (company_id, start_date, end_date, result) => {
  sql.query(`SELECT SUM(net_total) as current_total FROM salesorder WHERE (user_id IN (SELECT user_id FROM USER WHERE user.company_id IN (${company_id}) )) AND (due_date BETWEEN '${start_date}' AND '${end_date}')`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Company Current Total: ", res[0]);
    result(null, res[0]);
  });
};

Report.getCurrentSalesbyCategoryID = async (category_id, start_date, end_date, type, result) => {
  if (type == "Unit") {
    let quantity = 0
    sql.query(`SELECT order_items FROM salesorder WHERE (due_date BETWEEN '${start_date}' AND '${end_date}') AND STATUS=1`, async (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      const getQuantity0 = (order_item) => {
        return new Promise((resolve, reject) => {
          sql.query(`SELECT SUM(o.quantity) as quantity FROM order_item o LEFT JOIN item i ON o.item_id=i.item_id WHERE o.order_item_id=${order_item}`, (err, res) => {
            if (err) {
              console.log("error: ", err);
              reject(err);
            }
            quantity += res[0].quantity
            console.log("Quantity==>", quantity)
            resolve(quantity);
          });
        })
      }

      const getQuantity1 = (order_item) => {
        return new Promise((resolve, reject) => {
          sql.query(`SELECT SUM(o.quantity) as quantity FROM order_item o LEFT JOIN item i ON o.item_id=i.item_id WHERE o.order_item_id=${order_item} AND i.category_id=${category_id}`, (err, res) => {
            if (err) {
              console.log("error: ", err);
              reject(err)
            }

            console.log("Quantity(not 0): ", res[0]);
            quantity += res[0].quantity
            console.log("Sum(not 0): ", quantity);
            resolve(quantity);
          });
        });
      }

      console.log("Category Current Total: ", res);
      for (let item of res) {
        let order_items = item.order_items?.split(', ')
        for (let order_item of order_items) {
          if (category_id == '0') {
            quantity = await getQuantity0(order_item);
          } else {
            quantity = await getQuantity1(order_item);
          }

        }

      }
      console.log('quantity ==> ', quantity)
      result(null, { quantity: quantity })
    });
  } else {
    if (category_id == '0') {
      sql.query(`SELECT SUM(net_total) AS net_total FROM salesorder WHERE status= 1 AND(due_date BETWEEN '${start_date}' AND '${end_date}')`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        console.log("Company Current Total: ", res[0]);
        result(null, { quantity: res[0].net_total });
      });
    } else {
      sql.query(`SELECT SUM(net_total) AS net_total FROM salesorder WHERE (due_date BETWEEN '${start_date}' AND '${end_date}') AND status= 1 AND (order_items) IN (SELECT o.order_item_id FROM order_item o LEFT JOIN item i ON o.item_id = i.item_id WHERE i.category_id = ${category_id})`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        console.log("Company Current Total: ", res[0]);
        result(null, { quantity: res[0].net_total });
      });
    }

  }
};

Report.getUsersTargetbyCompanyID = (company_id, start_date, end_date, result) => {
  sql.query(`
  SELECT * FROM ((
    SELECT s.user_id, SUM(s.net_total) AS net_total, u.full_name, u.sales_target FROM salesorder s 
    LEFT JOIN user u ON s.user_id=u.user_id 
    WHERE (s.status=1 
    AND 
    s.due_date BETWEEN '${start_date}' AND '${end_date}') 
    AND s.user_id IN (
    SELECT user_id FROM user WHERE company_id IN (${company_id})) 
    GROUP BY s.user_id
    UNION 
    SELECT u.user_id, 0, u.full_name, u.sales_target FROM user u 
    WHERE u.company_id IN (${company_id}))) t 
    GROUP BY t.user_id ORDER BY t.net_total DESC
  `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Company User Total: ", res);
    result(null, res);
  });
};

Report.getItemCategoryTarget = async (start_date, end_date, type, result) => {
  let categoryResult = []
  sql.query(`Select * from category`, async (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    const getResultItem1 = (item) => {
      return new Promise((resolve, reject) => {
        let quantity = 0
        sql.query(`SELECT order_items FROM salesorder WHERE (due_date BETWEEN '${start_date}' AND '${end_date}') AND STATUS=1`, async (err, res) => {
          if (err) {
            console.log("error: ", err);
            reject(err)
          }
          const getQuantity1 = (order_item) => {
            return new Promise((resolve, reject) => {
              sql.query(`SELECT SUM(o.quantity) as quantity FROM order_item o LEFT JOIN item i ON o.item_id=i.item_id WHERE o.order_item_id=${order_item} AND i.category_id=${item.category_id}`, (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  reject(err)
                }

                console.log("Quantity(not 0): ", res[0]);
                quantity += res[0].quantity
                console.log("Sum(not 0): ", quantity);
                resolve(quantity);
              });
            });
          }

          console.log("Category Current Total: ", res);
          for (let item of res) {
            let order_items = item.order_items?.split(', ')
            for (let order_item of order_items) {
              quantity = await getQuantity1(order_item);
            }

          }

          let result_item = {
            full_name: item.category_name,
            unit: item.unit,
            amount: item.amount,
            net_total: quantity
          }
          categoryResult.push(result_item)
          resolve(categoryResult);
        });
      });
    }

    const getResultItem2 = (item) => {
      return new Promise((resolve, reject) => {

        sql.query(`SELECT SUM(net_total) AS net_total FROM salesorder WHERE (due_date BETWEEN '${start_date}' AND '${end_date}') AND status= 1 AND (order_items) IN (SELECT o.order_item_id FROM order_item o LEFT JOIN item i ON o.item_id = i.item_id WHERE i.category_id = ${item.category_id})`, (err, res) => {
          if (err) {
            console.log("error: ", err);
            reject(err)
          }

          // result(null, { quantity: res[0].net_total });
          let result_item = {
            full_name: item.category_name,
            unit: item.unit,
            amount: item.amount,
            net_total: res[0].net_total
          }
          categoryResult.push(result_item)
          resolve(categoryResult)
        });
      });
    }

    for (item of res) {
      if (type == "Unit") {
        categoryResult = await getResultItem1(item)
      } else {
        categoryResult = await getResultItem2(item)
      }
    }
    console.log("Total ===> ", categoryResult)
    result(null, categoryResult)

  });
};

module.exports = Report;