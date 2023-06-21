var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var authJwt = require('./middleware/authJwt');
const { router } = require("express/lib/application");

var vanthu = require('./routes/vanthu')
var timviec = require('./routes/timviec')
var qlc = require('./routes/qlc')
var hr = require('./routes/hr')
var raonhanh = require('./routes/raonhanh')
var CRMroute = require('./routes/crm/CRMroutes')

//tool
var toolVT = require('./routes/vanthu/RoutertoolVT')
var toolAddDataRouter = require('./routes/tools');
var raonhanhtool = require('./routes/raonhanh365/tools');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../Storage')));
app.use('/api', CRMroute)
app.use("/api", vanthu)
app.use("/api/timviec", timviec)
app.use("/api/hr", hr)
app.use("/api/qlc", qlc)
app.use("/api/raonhanh", raonhanh)

app.use('/api/tool', toolAddDataRouter);
app.use("/api/tool", raonhanhtool)

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


// timviec365 -> api-base365
const DB_URL = 'mongodb://127.0.0.1/api-base365'; // timviec365 -> api-base365
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));

// app.listen(3004, () => {
//     console.log("Connected to databse");
//     console.log("Backend is running on http://localhost:3004")
// })
// app.listen(3005, () => {
//     console.log("Connected to databse");
//     console.log("Backend is running on http://localhost:3005")
// })
module.exports = app;