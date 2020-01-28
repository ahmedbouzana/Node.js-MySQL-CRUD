const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "bookdb",
  multipleStatements: true
});

mysqlConnection.connect(err => {
  if (!err) console.log("DB connection succeded.");
  else
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});

app.listen(3000, () =>
  console.log("Express server is runnig at port no : 3000")
);

//Get all actes
app.get("/actes", (req, res) => {
  mysqlConnection.query("SELECT * FROM acte", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

//Get an actes
app.get("/actes/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM acte WHERE ActeID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Delete an actes
app.delete("/actes/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM acte WHERE ActeID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Deleted successfully.");
      else console.log(err);
    }
  );
});

//Insert an actes
app.post("/actes", (req, res) => {
  let acte = req.body;
  var sql =
    "SET @_ActeID = ?;SET @_ActeNom = ?;SET @_ActeValeur = ?;SET @_ActeCommentaire = ?; \
    CALL ActeAddOrEdit(@_ActeID,@_ActeNom,@_ActeValeur,@_ActeCommentaire);";
  mysqlConnection.query(
    sql,
    [acte._ActeID, acte._ActeNom, acte._ActeValeur, acte._ActeCommentaire],
    (err, rows, fields) => {
      if (!err) {
        rows.forEach(element => {
          if (element.constructor == Array) {
            res.send("Inserted acte id : " + element[0].ActeID);
          }
        });
        res.send("Inserted acte");
      } else console.log(err);
    }
  );
});

//Update an actes
app.put("/actes", (req, res) => {
  let acte = req.body;
  var sql =
    "SET @_ActeID = ?;SET @_ActeNom = ?;SET @_ActeValeur = ?;SET @_ActeCommentaire = ?; \
  CALL ActeAddOrEdit(@_ActeID,@_ActeNom,@_ActeValeur,@_ActeCommentaire);";
  mysqlConnection.query(
    sql,
    [acte._ActeID, acte._ActeNom, acte._ActeValeur, acte._ActeCommentaire],
    (err, rows, fields) => {
      if (!err) res.send("Updated successfully");
      else console.log(err);
    }
  );
});
