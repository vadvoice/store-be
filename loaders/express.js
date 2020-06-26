const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const { appConfig } = require('../config');

// routes modules
const indexRouter = require('../routes/index');
const userRouter = require('../routes/users');
const productRouter = require('../routes/products');
const adminRouter = require('../routes/admin');
const authRouter = require('../routes/auth');
const paymentRouter = require('../routes/payment');
const orderRouter = require('../routes/order');
const statsRouter = require('../routes/stats');
const feedbackRouter = require('../routes/feedback');

module.exports = async ({ app, db }) => {
    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');

    // parse application/x-www-form-urlencoded 
    // app.use(bodyParser.urlencoded({ extended: true }))

    // cors
    app.use(cors({
        credentials: true,
        origin: appConfig.origin
    }));

    // logger
    app.use(logger('dev'));

    // content type
    app.use(express.json());

    // cookies
    app.use(cookieParser());

    // public folders
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../uploads')));

    // make DB available globally
    app.use((req, res, next) => {
        req.db = db;
        next();
    })

    // API
    app.use('/', indexRouter);
    app.use('/api/users', userRouter);
    app.use('/api/products', productRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/payments', paymentRouter);
    app.use('/api/orders', orderRouter);
    app.use('/api/stats', statsRouter);
    app.use('/api/feedback', feedbackRouter);

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
