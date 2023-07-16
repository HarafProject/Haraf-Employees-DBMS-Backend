const express = require('express');
const adminRouter = require("../routes/admin")
const supervisorRouter = require("../routes/supervisor")
const authRouter = require('../routes/auth');
const superAdminRouter = require('../routes/superadmin');
const indexRouter = require("../routes/index")
const locationRouter = require("../routes/location")
const error = require("../middleware/error");

module.exports = function (app) {

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/api/admin', adminRouter);
  app.use('/api/superadmin',superAdminRouter)
  app.use('/api/supervisor', supervisorRouter);
  app.use('/api/location', locationRouter);
  app.use('/api/auth', authRouter);
  app.use("/", indexRouter)
  app.use(error);
}