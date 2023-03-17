const Bet = require("../models/bet.model.js")

// Check if a new bet is already exist in DB.
exports.checkDB = async (bet) => {
  return new Promise((resolve) => {
    Bet.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving bets."
        });
      else {
        let isExist = data.some(elem =>
          elem.date_placed === bet.date_placed &&
          elem.sport === bet.sport &&
          elem.description === bet.description &&
          elem.win_amount === bet.win_amount &&
          elem.group === bet.group &&
          elem.website === bet.website &&
          elem.user === bet.user
        )
        resolve(isExist);
      }
    });
  })
};

// Create and Save a new Bet
exports.create = async (new_bet, res) => {

  // Create a Bet
  const bet = new Bet(new_bet);

  // Save Bet in the database
  Bet.create(bet, (err, data) => {
    if (err)
      res.status(500).send({
        status: false,
        message:
          err.message || "Some error occurred while creating the Bet."
      });
    else res.send({ status: true });
  });
};

// Retrieve all Bets from the database (with condition).
exports.findAll = (req, res) => {
  Bet.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving bets."
      });
    else res.send(data);
  });
};

// Find a single Bet by Id
exports.findOne = (req, res) => {
  Bet.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Bet with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Bet with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// find all published Bets
exports.findAllPublished = (req, res) => {
  Bet.getAllPublished((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving bets."
      });
    else res.send(data);
  });
};

// Update a Bet identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Bet.updateById(
    req.params.id,
    new Bet(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Bet with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Bet with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Bet with the specified id in the request
exports.delete = (req, res) => {
  Bet.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Bet with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Bet with id " + req.params.id
        });
      }
    } else res.send({ message: `Bet was deleted successfully!` });
  });
};

// Delete all Bets from the database.
exports.deleteAll = (req, res) => {
  Bet.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all bets."
      });
    else res.send({ message: `All Bets were deleted successfully!` });
  });
};
