module.exports = app => {

  const bets = require("../controllers/bet.controller.js");
  var router = require("express").Router();

  // Create a new Bet
  router.post("/", bets.create);

  // Retrieve all Bets
  router.get("/", bets.findAll);

  // Retrieve all published Bets
  router.get("/published", bets.findAllPublished);

  // Retrieve a single Bet with id
  router.get("/:id", bets.findOne);

  // Update a Bet with id
  router.put("/:id", bets.update);

  // Delete a Bet with id
  router.delete("/:id", bets.delete);

  // Delete all Bets
  router.delete("/", bets.deleteAll);

  app.use('/api/bets', router);
};
