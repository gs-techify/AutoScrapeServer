const sql = require("./db.js");

// constructor
const Bet = function(newBet) {
  this.date_placed = newBet.date_placed;
  this.sport = newBet.sport;
  this.description = newBet.description;
  this.win_amount = newBet.win_amount;
  this.website = newBet.website;
  this.user = newBet.user;
};

Bet.create = (newBet, result) => {
  sql.query("INSERT INTO bets SET ?", newBet, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    
    result(null, { id: res.insertId, ...newBet });
  });
};

Bet.findById = (id, result) => {
  sql.query(`SELECT * FROM bets WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found bet: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Bet with the id
    result({ kind: "not_found" }, null);
  });
};

Bet.getAll = (result) => {
  let query = "SELECT `date_placed`, `sport`, `description`, `win_amount`, `website`, `user` FROM bets";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    
    result(null, res);
  });
};

Bet.getAllPublished = result => {
  sql.query("SELECT * FROM bets WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("bets: ", res);
    result(null, res);
  });
};

Bet.updateById = (id, bet, result) => {
  sql.query(
    "UPDATE bets SET title = ?, description = ?, published = ? WHERE id = ?",
    [bet.title, bet.description, bet.published, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Bet with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated bet: ", { id: id, ...bet });
      result(null, { id: id, ...bet });
    }
  );
};

Bet.remove = (id, result) => {
  sql.query("DELETE FROM bets WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Bet with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted bet with id: ", id);
    result(null, res);
  });
};

Bet.removeAll = result => {
  sql.query("DELETE FROM bets", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} bets`);
    result(null, res);
  });
};

module.exports = Bet;
