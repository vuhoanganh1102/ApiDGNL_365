var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var authJwt = require('./middleware/authJwt');




var candidateRouter = require('./routes/timviec/candidate');
var companyRouter = require('./routes/timviec/company');
var cvRouter = require('./routes/timviec/cv');
var newTV365Router = require('./routes/timviec/newTV365');

// rao nhanh
var newRN365Router = require('./routes/raonhanh365/new');
var blogRaoNhanh365Router = require('./routes/raonhanh365/blog');
var orderRaoNhanh = require('./routes/raonhanh365/order');
var userRaoNhanh = require('./routes/raonhanh365/user');
var companyRaoNhanh365Router = require('./routes/raonhanh365/company');
var cartRaoNhanh365Router = require('./routes/raonhanh365/cart');
var priceListRaoNhanh365Router = require('./routes/raonhanh365/priceList');
var adminRaonhanh365 = require('./routes/raonhanh365/admin');


//---------HR------------------------
var recruitment = require('./routes/hr/recruitmentRoute');
var trainingRoute = require('./routes/hr/trainingRoute');
var settingRoute = require('./routes/hr/settingRoute');
var administrationRoute = require('./routes/hr/administrationRoute');
var welfare = require('./routes/hr/welfareRoute');
var organizationalStructure = require('./routes/hr/organizationalStructure');

var recruitment = require('./routes/hr/recruitmentRoute');
var trainingRoute = require('./routes/hr/trainingRoute');
var settingRoute = require('./routes/hr/settingRoute');
var managerEmployeeRoute = require('./routes/hr/managerEmployeeRoute');
var personalChangeRoute = require('./routes/hr/personalChangeRoute');

//tim viec 
//tim viec 

var priceListRouter = require('./routes/timviec/priceList');
var trangVangRouter = require('./routes/timviec/trangVang');
var soSanhLuongRouter = require('./routes/timviec/ssl');
var mail365Router = require('./routes/timviec/mail365');
var adminRouter = require('./routes/timviec/admin');
var blogRouter = require('./routes/timviec/blog')

// Quản lý chung
var deparmentRouter = require('./routes/qlc/deparment')
var teamRouter = require('./routes/qlc/team');
var groupRouter = require('./routes/qlc/group');
var shiftRouter = require('./routes/qlc/shift');
var calendarRouter = require('./routes/qlc/calendar');
var childCompanyRouter = require('./routes/qlc/childCompany')
var managerUser = require('./routes/qlc/managerUser')
var employeeRoutes = require('./routes/qlc/employee.routes');
var individualRoutes = require('./routes/qlc/individual.routes');

// var manageUserRouter = require('./routes/qlc/manageUser')

// crm_import
var groupCustomerRouter = require('./routes/crm/groupCustomer')


//
var toolAddDataRouter = require('./routes/tools');

var donRouter = require('./routes/timviec/don');
var thuRouter = require('./routes/timviec/thu');
var syllRouter = require('./routes/timviec/syll');

var toolVT = require('./routes/vanthu/RoutertoolVT')


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

// app.use('/api/timviec/priceList', priceListRouter);
app.use('/api/timviec/trangVang', trangVangRouter);
app.use('/api/timviec/ssl', soSanhLuongRouter);
app.use('/api/timviec/mail365', mail365Router);

// api rao nhanh
app.use('/api/raonhanh/new', newRN365Router);
app.use('/api/raonhanh/blog', blogRaoNhanh365Router)
app.use('/api/raonhanh/orderRaoNhanh', orderRaoNhanh)
app.use('/api/raonhanh/userRaoNhanh', userRaoNhanh)
app.use('/api/raonhanh/com', companyRaoNhanh365Router);
app.use('/api/raonhanh/cart', cartRaoNhanh365Router);
app.use('/api/raonhanh/priceList', priceListRaoNhanh365Router);
app.use('/api/raonhanh/admin', adminRaonhanh365);


// api hr
app.use('/api/hr/administration', administrationRoute);
app.use('/api/hr/welfare', welfare);
app.use('/api/hr/organizationalStructure', organizationalStructure)
app.use('/api/hr/recruitment', recruitment)
app.use('/api/hr/training', trainingRoute);
app.use('/api/hr/setting', settingRoute);
app.use('/api/hr/managerEmployee', managerEmployeeRoute);
app.use('/api/hr/personalChange', personalChangeRoute);




// API quản lí chung
app.use('/api/qlc/deparment', deparmentRouter);
app.use('/api/qlc/team', teamRouter);
app.use("/api/qlc/group", [authJwt.checkToken, authJwt.isCompany], groupRouter);
// app.use('/api/qlc/childCompany', childCompanyRouter)
// app.use('/api/qlc/managerUser', managerUser)
app.use('/api/qlc/employee', employeeRoutes);
app.use('/api/qlc/individual', individualRoutes);

// app.use('/api/qlc/childCompany', childCompanyRouter);


//API quẩn lý ca làm việc
app.use("/api/qlc/shift", shiftRouter);
app.use("/api/calendar", calendarRouter);


//API văn thu
app.use("/api/tool", toolVT)

app.use("/api/crm/customer/group", groupCustomerRouter);

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