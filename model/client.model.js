const sql = require("./db.js");
// constructor
const Client = function (client) {
  this.client_id = client.client_id;
  this.custom_field = client.custom_field;
  this.client_entity_name = client.client_entity_name;
  this.address = client.address;
  this.phone_number = client.phone_number;
  this.location = client.location;
  this.company_id = client.company_id;
  this.approved = client.approved,
  this.created_by = client.created_by
};

Client.createClient = (newClient, result) => {
  sql.query(`Select client_id from client where phone_number = '${newClient.phone_number}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("checked client: ", res[0]);
    if (JSON.stringify(res[0]) != undefined) {
      result(null, { client_id: res[0].client_id });
      return;
    } else {
      sql.query("INSERT INTO client SET ?", newClient, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created Client: ", { client_id: res.insertId, ...newClient });
        result(null, { id: res.insertId, ...newClient });
        
      });
    }
  });

};

Client.getAllClient = (result) => {
  sql.query(`SELECT c.*, co.company_entity_name, u.full_name FROM client c LEFT OUTER JOIN company co ON c.company_id = co.company_id 
  LEFT OUTER JOIN user u ON c.created_by = u.user_id
  `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Clients: ", res);
    result(null, res);
  });
};

Client.getAllClientById = (company_id, result) => {
  sql.query(`SELECT c.*, u.full_name FROM client c LEFT OUTER JOIN user u ON c.created_by = u.user_id where c.company_id IN (${company_id})`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Clients: ", res);
    result(null, res);
  });
};


Client.getClientProfileById = (client_id, result) => {
  sql.query(`SELECT c.client_entity_name, c.custom_field, c.address, c.phone_number, c.company_id, c.location, c.approved, c.created_by, co.company_entity_name 
  FROM client c LEFT OUTER JOIN company co ON c.company_id = co.company_id where c.client_id=${client_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Clients: ", res[0]);
    result(null, res[0]);
  });
};

Client.updateClientById = (client_id, client, result) => {

  sql.query(
    "UPDATE client SET client_entity_name=?, custom_field = ?, address = ?, phone_number = ?, location = ?, company_id = ?, approved = ?, created_by = ? WHERE client_id = ?",
    [client.client_entity_name, client.custom_field, client.address, client.phone_number, client.location, client.company_id, client.approved, client.created_by, client_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Client with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Client: ", { client_id: client_id, ...client });
      result(null, { client_id: client_id, ...client });
    }
  );

};

Client.removeClient = (client_id, result) => {
  sql.query("DELETE FROM client WHERE client_id = ?", client_id, (err, res) => {
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

    console.log("deleted Client with Client_id: ", client_id);
    result(null, res);
  });
};

Client.removeAllClient = result => {
  sql.query("DELETE FROM client", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} client`);
    sql.query("DELETE FROM sales_client", (err, res) => {
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
    });
    // result(null, res);
  });
};

module.exports = Client;