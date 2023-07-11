const winston = require("winston");
const express = require("express");
const morgan = require('morgan');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();

require("./startup/logging")();
app.use(morgan('tiny'));
require("./startup/cors.js")(app);
require("./startup/routes")(app);
require("./startup/db")();
// require("./startup/validation")();


const port = process.env.PORT;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
