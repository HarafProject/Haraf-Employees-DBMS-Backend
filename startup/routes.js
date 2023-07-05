const express = require('express');
const authRouter = require('../routes/auth');
const employeeRouter = require("../routes/employee");
const indexRouter = require("../routes/index")
const locationRouter = require("../routes/location")
const error = require("../middleware/error");

module.exports = function (app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/api/location', locationRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/supervisor',employeeRouter);
    app.use("/", indexRouter)
    app.use(error);
}