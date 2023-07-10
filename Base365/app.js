var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var appTimviec = express();
var appRaonhanh = express();
var appVanthu = express();
var appCRM = express();
var appQLC = express();
var appHR = express();
var appQLTS = express();

function configureApp(app) {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../Storage')));

    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}

function errorApp(app) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}

// Cấu hình appTimviec
configureApp(appTimviec);
var timviecRouter = require('./routes/timviec');
var toolAddDataRouter = require('./routes/tools');
appTimviec.use("/api/timviec", timviecRouter);
appTimviec.use('/api/tool', toolAddDataRouter);
errorApp(appTimviec)

// Cấu hình appRaonhanh
configureApp(appRaonhanh);
var raonhanhRouter = require('./routes/raonhanh');
var raonhanhtool = require('./routes/raonhanh365/tools');
appRaonhanh.use("/api/raonhanh", raonhanhRouter);
appRaonhanh.use("/api/tool", raonhanhtool)
errorApp(appRaonhanh)

// Cấu hình appVanthu
configureApp(appVanthu);
var vanthuRouter = require('./routes/vanthu')
appVanthu.use("/api", vanthuRouter);
errorApp(appVanthu)

// Cấu hình appCRM
configureApp(appCRM);
var CRMroute = require('./routes/crm/CRMroutes');
appCRM.use("/api", CRMroute);
errorApp(appCRM)

// Cấu hình appQLC
configureApp(appQLC);
var qlcRouter = require('./routes/qlc');
appQLC.use("/api", qlcRouter);
errorApp(appQLC)

// Cấu hình appHR
configureApp(appHR);
var hrRouter = require('./routes/hr');
appHR.use("/api/hr", hrRouter);
errorApp(appHR)

// Cấu hình appQLTS
configureApp(appQLTS);
var qltsRouter = require('./routes/qltsRouter');
appQLTS.use("/api", qltsRouter);
errorApp(appHR)

// timviec365 -> api-base365
const DB_URL = 'mongodb://127.0.0.1/api-base365'; // timviec365 -> api-base365
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));

// Chạy server trên các cổng riêng biệt
//chạy server Timviec
var serverTimviec = appTimviec.listen(3000, () => {
    console.log(`Timviec app is running on port 3000`);
});

serverTimviec.on('error', (error) => {
    console.error('Error occurred while listening on Timviec port:', error);
});

//Raonhanh
var serverRaonhanh = appRaonhanh.listen(3004, () => {
    console.log(`Raonhanh app is running on port 3004`);
});

serverRaonhanh.on('error', (error) => {
    console.error('Error occurred while listening on Raonhanh port:', error);
});

//Van thu
var serverVanthu = appVanthu.listen(3005, () => {
    console.log(`Vanthu app is running on port 3005`);
});

serverVanthu.on('error', (error) => {
    console.error('Error occurred while listening on Vanthu port:', error);
});

//CRM
var serverCRM = appCRM.listen(3006, () => {
    console.log(`CRM app is running on port 3006`);
});

serverCRM.on('error', (error) => {
    console.error('Error occurred while listening on CRM port:', error);
});

//qlc
var serverQlc = appQLC.listen(3003, () => {
    console.log(`QLC app is running on port 3003`);
});

serverQlc.on('error', (error) => {
    console.error('Error occurred while listening on Qlc port:', error);
});

//hr
var serverHR = appHR.listen(3007, () => {
    console.log(`Hr app is running on port 3007`);
});

serverHR.on('error', (error) => {
    console.error('Error occurred while listening on HR port:', error);
});

//qlts
var serverQLTS = appQLTS.listen(3008, () => {
    console.log(`qlts app is running on port 3008`);
});

serverQLTS.on('error', (error) => {
    console.error('Error occurred while listening on QLTS port:', error);
});
