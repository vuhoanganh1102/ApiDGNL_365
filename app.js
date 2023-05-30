var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var candidateRouter = require('./routes/timviec/candidate');
var companyRouter = require('./routes/timviec/company');
var cvRouter = require('./routes/timviec/cv');
var newTV365Router = require('./routes/timviec/newTV365');

// rao nhanh
var newRN365Router = require('./routes/raonhanh365/new');
var blogRaoNhanh365Router = require('./routes/raonhanh365/blog')




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
var manageUserRouter = require('./routes/qlc/manageUser')

// crm_import
var groupCustomerRouter = require('./routes/crm/groupCustomer')


var toolAddDataRouter = require('./routes/tools');

var donRouter = require('./routes/timviec/don');
var thuRouter = require('./routes/timviec/thu');
var syllRouter = require('./routes/timviec/syll');


//văn thư
var settingDxVanThu = require('./routes/vanthu/setingdx');
var FeedbackRouter = require('./routes/vanthu/tbl_feedback');
var qlcv_editRouter = require('./routes/vanthu/qlcv_edit');
var qlcv_roleRouter = require('./routes/vanthu/qlcv_Role');
var ql_CongVan = require('./routes/vanthu/quanLiCongVan');
var vb_thay_the = require('./routes/vanthu/VanBanThayThe');
var view = require('./routes/vanthu/view');
var textBook = require('./routes/vanthu/TextBook');
var tlLuuTru = require('./routes/vanthu/tl_LuuTru');
var thongBao = require('./routes/vanthu/thong_bao');
var NguoiDuyetVanBan = require('./routes/vanthu/user_duyet_vb');
var UserModel = require('./routes/vanthu/user_model');
var VanBan = require('./routes/vanthu/van_ban');
var app = express();
// app.listen(3001, () => {
//     console.log("Connected to databse");
//     console.log("Backend is running on http://localhost:3001")
// });

//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//văn thư
app.use('/api/vanthu', settingDxVanThu);
app.use('/api/vanthu', FeedbackRouter);
app.use('/api/vanthu', qlcv_editRouter);
app.use('/api/vanthu', qlcv_roleRouter);
app.use('/api/vanthu', ql_CongVan);
app.use('/api/vanthu', vb_thay_the);
app.use('/api/vanthu', view);
app.use('/api/vanthu', textBook);
app.use('/api/vanthu', tlLuuTru);
app.use('/api/vanthu', thongBao);
app.use('/api/vanthu', NguoiDuyetVanBan);
app.use('/api/vanthu', UserModel);
app.use('/api/vanthu', VanBan);



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../Storage')));


app.use('/api/timviec/candidate', candidateRouter);
app.use('/api/timviec/newTV365', newTV365Router)
app.use('/api/timviec/admin', adminRouter)
app.use('/api/timviec/company', companyRouter)
app.use('/api/timviec/blog', blogRouter)
app.use('/api/timviec/cv', cvRouter);
app.use('/api/timviec/don', donRouter);
app.use('/api/timviec/thu', thuRouter);
app.use('/api/timviec/syll', syllRouter);
app.use('/api/tool', toolAddDataRouter);
app.use('/api/timviec/newTV365', newTV365Router);

app.use('/api/timviec/priceList', priceListRouter);
app.use('/api/timviec/trangVang', trangVangRouter);
app.use('/api/timviec/ssl', soSanhLuongRouter);
app.use('/api/timviec/mail365', mail365Router);

// api rao nhanh
app.use('/api/raonhanh/new', newRN365Router);
app.use('/api/raonhanh/blog', blogRaoNhanh365Router)


// API quản lí chung
app.use('/api/qlc/deparment', deparmentRouter);
app.use('/api/qlc/team', teamRouter);
app.use("/api/qlc/group", groupRouter);
app.use('/api/qlc/childCompany', childCompanyRouter);
app.use('/api/qlc/manageUser', manageUserRouter);


//API quẩn lý ca làm việc
app.use("/api/qlc/shift", shiftRouter);
app.use("/api/calendar", calendarRouter);

app.use("/api/crm/customer/group", groupCustomerRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const DB_URL = 'mongodb://127.0.0.1/api-base365'; // timviec365 -> api-base365
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));

// app.listen(3002, () => {
//     console.log("Connected to databse");
//     console.log("Backend is running on http://localhost:3002")
// })
module.exports = app;