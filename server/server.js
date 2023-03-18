const express = require("express");
const socket = require('socket.io');
const cors = require("cors");
const moment = require('moment');
const betController = require("./app/controllers/bet.controller.js");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// require('./setupProxy.js');

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome!" });
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;
const io = socket(app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
}));

app.get('/api/bets', betController.findAll);

app.post('/api/bets', async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const bet = {
    date_placed: moment(new Date(req.body.date_placed)).format(),
    sport: req.body.sport,
    description: req.body.description,
    win_amount: req.body.win_amount,
    group: req.body.group,
    website: req.body.website,
    user: req.body.user
  };

  let isExist = false;
  try {
    isExist = await betController.checkDB(bet);
  } catch (error) {
    console.log(error)
  }

  if (!isExist) {
    io.emit('new bet', { bet: bet, isNew: true });
    betController.create(bet, res);
  } else {
    // io.emit('bet', { bet: bet, isNew: false });
    res.send({
      status: true,
      message: "The bet is already Exist!"
    });
  }
});
