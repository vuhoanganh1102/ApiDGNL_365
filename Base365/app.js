var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser')
var cors = require('cors');
// var logger = require('morgan');
var mongoose = require('mongoose')

var AppTimviec = express();
var AppRaonhanh = express();
var AppVanthu = express();
var AppCRM = express();
var AppQLC = express();
var AppHR = express();
var AppTinhluong = express();

function configureApp(app) {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    // app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static("../storage"));
    app.use(cors());

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
configureApp(AppTimviec);
var timviecRouter = require('./routes/timviec');
var toolAddDataRouter = require('./routes/tools');
var dataRouter = require('./routes/data');

AppTimviec.use("/api/timviec", timviecRouter);
AppTimviec.use('/api/tool', toolAddDataRouter);
AppTimviec.use('/api/getData', dataRouter);
errorApp(AppTimviec)

// Cấu hình AppRaonhanh
configureApp(AppRaonhanh);
var raonhanhRouter = require('./routes/raonhanh');
var raonhanhtool = require('./routes/raonhanh365/tools');
AppRaonhanh.use("/api/raonhanh", raonhanhRouter);
AppRaonhanh.use("/api/tool", raonhanhtool);
errorApp(AppRaonhanh);

// Cấu hình appVanthu
configureApp(AppVanthu);
var vanthuRouter = require('./routes/vanthu')
AppVanthu.use("/api", vanthuRouter);
errorApp(AppVanthu);

// Cấu hình AppQLC
configureApp(AppQLC);
var qlcRouter = require('./routes/qlc');
var ToolQLC = require('./routes/qlc/Tools');
AppQLC.use("/api/qlc", qlcRouter);
AppQLC.use("/api/tool", ToolQLC);
errorApp(AppQLC)

// Cấu hình AppHR
configureApp(AppHR);
var hrRouter = require('./routes/hr');
AppHR.use("/api/hr", hrRouter);
errorApp(AppHR);

// Cấu hình AppCRM
configureApp(AppCRM);
var CrmRouter = require('./routes/crm');
AppCRM.use("/api/crm", CrmRouter);
errorApp(AppCRM);

// Cấu hình AppTinhluongs
configureApp(AppTinhluong);
var tinhluongRouter = require('./routes/tinhluong');
AppTinhluong.use("/api/tinhluong", tinhluongRouter);
errorApp(AppTinhluong)

const DB_URL = 'mongodb://localhost:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));

// Quản lý chung
AppQLC.listen(3000, () => {
    console.log(`QLC app is running on port 3000`);
});

AppTimviec.listen(3001, () => {
    console.log("Timviec365 app is running on port 3001")
});

// Raonhanh
AppRaonhanh.listen(3004, () => {
    console.log(`Raonhanh app is running on port 3004`);
});

// Van thu
AppVanthu.listen(3005, () => {
    console.log(`Vanthu app is running on port 3005`);
});

// Quản trị nhân sự
AppHR.listen(3006, () => {
    console.log(`HR app is running on port 3006`);
});

// Quản trị crm
AppCRM.listen(3007, () => {
    console.log(`CRM app is running on port 3007`);
});

// Tính lương 
AppTinhluong.listen(3010, () => {
    console.log(`Tinh luong app is running on port 3010`);
});