const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// routes modules
const indexRouter = require('../routes/index');
const userRouter = require('../routes/users');

module.exports = async ({ app, db }) => {
    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');

    // cors
    app.use(cors());

    // logger
    app.use(logger('dev'));

    // content type
    app.use(express.json());

    // cookies
    app.use(cookieParser());

    // public folders
    app.use(express.static(path.join(__dirname, '../public')));

    // make DB available globally
    app.use((req, res, next) => {
        req.db = db;
        next();
    })

    // API
    app.use('/', indexRouter);
    app.use('/users', userRouter);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        next(createError(404));
    });

    // error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        console.error(err);
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    // Return the express app
    return app;
}
