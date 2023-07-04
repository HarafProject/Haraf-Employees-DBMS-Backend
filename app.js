const winston = require("winston");
const express = require("express");
const app = express();
const authRouter = require('./routes/auth');
require('dotenv').config();

require("./startup/logging")();
require("./startup/cors.js")(app);
require("./startup/routes")(app);
require("./startup/db")();
// require("./startup/validation")();

//Body Parser
app.use(express.json());

//Middlewares
app.use('/api/auth', authRouter);


const port = process.env.PORT;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
