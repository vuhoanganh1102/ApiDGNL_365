const Users = require('../../models/Users');
const Appoint = require('../../models/hr/personalChange/Appoint');
const QuitJobNew = require('../../models/hr/personalChange/QuitJobNew');
const TranferJob = require('../../models/hr/personalChange/TranferJob');
const functions = require('../../services/functions');
const RecruitmentNews = require('../../models/hr/RecruitmentNews')
const hr = require('../../services/hr/hrService');
const Candidates = require('../../models/hr/Candidates');
const GetJob = require('../../models/hr/GetJob');
const QuitJob = require('../../models/hr/personalChange/QuitJob');
const Salarys = require('../../models/Tinhluong/Tinhluong365SalaryBasic');
const Deparment = require('../../models/qlc/Deparment');
const Resign = require('../../models/hr/personalChange/Resign');
exports.report = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let depId = req.body.depId || null;
        let from_date = req.body.from_date || null;
        let to_date = req.body.to_date || null;
        let chartNghiViec = req.body.nghiViec || null;
        let condition = {};
        if (depId) condition['inForPerson.employee.dep_id'] = depId;

        // điều kiện tìm kiếm nhân viên với id công ty
        condition['inForPerson.employee.com_id'] = comId;

        // tổng số nhân viên thuộc công ty
        let countEmployee = await Users.countDocuments(condition)

        // tìm kiếm điều kiện là nhân viên nam
        condition['inForPerson.account.gender'] = 1;
        let countEmployeeNam = await Users.countDocuments(condition)

        // tìm kiếm với điều kiện là nhân viên nữ
        condition['inForPerson.account.gender'] = 2;
        let countEmployeeNu = await Users.countDocuments(condition)


        if (from_date) condition.created_at = { $gte: new Date(from_date) }
        if (to_date) condition.created_at = { $lte: new Date(to_date) }
        if (from_date && to_date) condition.created_at = { $gte: new Date(from_date), $lte: new Date(to_date) }


        // tìm kiếm nhân viên được bổ nhiệm là nam
        condition['inForPerson.account.gender'] = 1;
        let dataBoNhiemNam = await Users.aggregate([
            { $match: condition },
            {
                $lookup: {
                    from: 'HR_Appoints',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'Appoints'
                }
            },
            { $unwind: "$Appoints" },
            {
                $count: 'SL'
            }
        ])

        // tìm kiếm với nhân viên được bổ nhiệm là nữ
        condition['inForPerson.account.gender'] = 2;
        let dataBoNhiemNu = await Users.aggregate([
            { $match: condition },
            {
                $lookup: {
                    from: 'HR_Appoints',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'Appoints'
                }
            },
            { $unwind: "$Appoints" },
            { $count: 'SL' }
        ])
        // tìm kiếm nhân viên được bổ nhiệm
        delete condition['inForPerson.account.gender']
        let dataBoNhiem = await Users.aggregate([
            { $match: condition },
            {
                $lookup: {
                    from: 'HR_Appoints',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'Appoints'
                }
            },
            { $unwind: "$Appoints" },
            { $count: 'SL' }
        ])

        // Tỷ lệ nhân viên nghỉ việc
        delete condition['inForPerson.employee.com_id']
        condition.com_id = comId

        // tìm kiếm nhân viên nghỉ việc
        condition.type = 2
        let nghiViec = await Resign.countDocuments(condition)

        // tìm kiếm nhân viên giảm biên chế
        condition.type = 1
        let giamBienChe = await Resign.countDocuments(condition)
        let countDataNghiViec = giamBienChe + nghiViec;



        // tăng giảm lương
        delete condition.type
        delete condition.com_id

        let dataLuong = await Salarys.find({ sb_id_com: comId }).sort({ sb_time_up: -1 });
        let tangLuong = 0;
        let giamLuong = 0;
        let arr = [];
        if (dataLuong.length !== 0) {
            for (let i = 0; i < dataLuong.length; i++) {
                condition.sb_id_user = dataLuong[i].sb_id_user;
                condition.sb_time_up = { $lt: dataLuong[i].sb_time_up }

                checkTangGiam = await Salarys.findOne(condition)

                if (checkTangGiam && dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic > 0) {
                    tangLuong++;
                } else if (checkTangGiam && dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic < 0) {
                    giamLuong++;
                }
                if (checkTangGiam) {
                    let tangGiam = dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic
                    checkTangGiam.tangGiam = tangGiam
                    arr.push(checkTangGiam)
                }
            }
        }
        let tangGiamLuong = 0;
        if (tangLuong !== 0) tangGiamLuong = tangLuong;
        if (giamLuong !== 0) tangGiamLuong = giamLuong;
        if (tangLuong !== 0 && giamLuong !== 0) tangGiamLuong = tangLuong + giamLuong;

        delete condition.sb_id_user
        delete condition.sb_time_up

        condition['inForPerson.employee.com_id'] = comId

        // Luân chuyển công tác
        let countDataLuanChuyen = await Users.aggregate([{
            $match: condition
        },
        {
            $lookup: {
                from: 'HR_TranferJobs',
                localField: 'idQLC',
                foreignField: 'ep_id',
                as: 'TranferJobs'
            }
        },
        { $unwind: "$TranferJobs" },
        {
            $count: 'SL'
        }
        ])
        // nhân viên nam luân chuyển
        condition['inForPerson.account.gender'] = 1
        let countDataLuanChuyenNam = await Users.aggregate([{
            $match: condition
        },
        {
            $lookup: {
                from: 'HR_TranferJobs',
                localField: 'idQLC',
                foreignField: 'ep_id',
                as: 'TranferJobs'
            }
        },
        { $unwind: "$TranferJobs" },
        {
            $count: 'SL'
        }
        ])
        // nhân viên nữ luân chuyển
        condition['inForPerson.account.gender'] = 2
        let countDataLuanChuyenNu = await Users.aggregate([{
            $match: condition
        },
        {
            $lookup: {
                from: 'HR_TranferJobs',
                localField: 'idQLC',
                foreignField: 'ep_id',
                as: 'TranferJobs'
            }
        },
        { $unwind: "$TranferJobs" },
        {
            $count: 'SL'
        }
        ])
        //  Tổng số tin
        let tongSoTinTuyenDung = await RecruitmentNews.countDocuments({ isDelete: 0, comId })

        // // Tổng số hồ sơ
        let tongSoHoSo = await Candidates.countDocuments({ isDelete: 0, comId }, { id: 1 })

        // Tổng số ứng viên cần tuyển
        let tongSoUngVienCanTuyen = await RecruitmentNews.aggregate([{
            $match: { isDelete: 0, comId }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$number" }
            }
        }
        ])
        // Số ứng viên đến phỏng vấn
        let tongSoUngVienDenPhongVan = await Candidates.aggregate([{
            $match: { comId }
        },
        {
            $lookup: {
                from: 'HR_ScheduleInterviews',
                localField: 'id',
                foreignField: 'canId',
                as: 'lichPv'
            }
        },
        {
            $match: { 'lichPv.isSwitch': 0 }
        },
        {
            $count: 'SL'
        }
        ])
        // Số ứng viên qua phỏng vấn
        let tongSoUngVienQuaPhongVan = await Candidates.aggregate([{
            $match: { comId }
        },
        {
            $lookup: {
                from: 'HR_GetJobs',
                localField: 'id',
                foreignField: 'canId',
                as: 'getJob'
            }
        },
        {
            $match: { 'getJob.isSwitch': 0 }
        },
        {
            $count: 'SL'
        }
        ])
        // Số ứng viên nhận việc, thử việc
        let tongSoUngVienHuyNhanViec = await Candidates.aggregate([{
            $match: { comId, isDelete: 0 }
        },
        {
            $lookup: {
                from: 'HR_CancelJobs',
                localField: 'id',
                foreignField: 'canId',
                as: 'CancelJobs'
            }
        },
        {
            $match: { 'CancelJobs.isSwitch': 0 }
        },
        {
            $count: 'SL'
        }
        ])
        // Báo cáo chi tiết theo tin tuyển dụng
        let query = await RecruitmentNews.find({ comId });
        let mangThongTin = [];
        if (query.length !== 0) {
            for (let i = 0; i < query.length; i++) {
                let tongSoUngVien = await Candidates.countDocuments({ comId, recruitmentNewsId: query[i].id })
                let tongSoUngVienDenPhongVan = await Candidates.aggregate([{
                    $match: { comId, 'lichPv.isSwitch': 0, recruitmentNewsId: query[i].id }
                },
                {
                    $lookup: {
                        from: 'HR_ScheduleInterviews',
                        localField: 'id',
                        foreignField: 'canId',
                        as: 'lichPv'
                    }
                },
                {
                    $match: { 'lichPv.isSwitch': 0 }
                },
                {
                    $count: 'SL'
                }
                ])
                let tongSoUngVienNhanViec = await Candidates.aggregate([{
                    $match: { comId, recruitmentNewsId: query[i].id }
                },
                {
                    $lookup: {
                        from: 'HR_GetJobs',
                        localField: 'id',
                        foreignField: 'canId',
                        as: 'getJob'
                    }
                },
                {
                    $match: { 'getJob.isSwitch': 0 }
                },
                {
                    $count: 'SL'
                }
                ])
                let tongSoUngVienHuy = await Candidates.aggregate([{
                    $match: { comId, isDelete: 0, recruitmentNewsId: query[i].id }
                },
                {
                    $lookup: {
                        from: 'HR_CancelJobs',
                        localField: 'id',
                        foreignField: 'canId',
                        as: 'CancelJobs'
                    }
                },
                {
                    $match: { 'CancelJobs.isSwitch': 0 }
                },
                {
                    $count: 'SL'
                }
                ])
                let thongTin = {};
                thongTin.id = query[i].id;
                thongTin.tongSoUngVien = tongSoUngVien;
                if (tongSoUngVienDenPhongVan.length !== 0) {
                    thongTin.tongSoUngVienDenPhongVan = tongSoUngVienDenPhongVan[0].SL;
                } else {
                    thongTin.tongSoUngVienDenPhongVan = 0
                }
                if (tongSoUngVienNhanViec.length !== 0) {
                    thongTin.tongSoUngVienNhanViec = tongSoUngVienNhanViec[0].SL;
                } else {
                    thongTin.tongSoUngVienNhanViec = 0
                }
                if (tongSoUngVienHuy.length !== 0) {
                    thongTin.tongSoUngVienHuy = tongSoUngVienHuy[0].SL;
                } else {
                    thongTin.tongSoUngVienHuy = 0
                }
                mangThongTin.push(thongTin)
            }
        }
        // Thống kê xếp hạng nhân viên tuyển dụng
        let thongKeNhanVienTuyenDung = await RecruitmentNews.aggregate([{
            $match: { comId }
        },
        {
            $group: {
                _id: "$hrName",
                total: { $sum: 1 },
            }
        },
        ])
        if (thongKeNhanVienTuyenDung.length !== 0) {
            for (let i = 0; i < thongKeNhanVienTuyenDung.length; i++) {
                let nameHr = await Users.findOne({ 'inForPerson.employee.com_id': comId, 'idQLC': thongKeNhanVienTuyenDung[i]._id }, { userName: 1 })
                if (nameHr)
                    thongKeNhanVienTuyenDung[i].nameHr = nameHr.userName;
            }
        }

        //Báo cáo chi tiết theo nhân viên giới thiệu ứng viên và tiền thưởng trực tiếp
        let gioiThieuUngVien = await Candidates.aggregate([{
            $match: { comId }
        },
        {
            $group: {
                _id: "$userRecommend",
                total: { $sum: 1 },
            }
        },
        ])
        if (gioiThieuUngVien.length !== 0) {
            for (let i = 0; i < gioiThieuUngVien.length; i++) {
                let nameHr = await Users.findOne({ 'inForPerson.employee.com_id': comId, 'idQLC': gioiThieuUngVien[i]._id }, { userName: 1, })
                if (nameHr)
                    gioiThieuUngVien[i].nameHr = nameHr.userName;

            }
        }
        let phongBan = await Deparment.find({ com_id: comId }, { _id: 1, dep_name: 1 })
        condition['inForPerson.employee.com_id'] = comId;
        let searchItem = { idQLC: 1, userName: 1, 'inForPerson.account': 1, emailContact: 1, phone: 1, 'inForPerson.employee': 1, };
        delete condition['inForPerson.account.gender'] 
        let chartEmployee = await Users.find(condition, searchItem);
        let conditionNghiViec = {}
        if (chartNghiViec) {
            conditionNghiViec['quit.type'] = chartNghiViec
        }
        let chartNghiViecnon = await Users.aggregate([{
            $match: condition
        },
        {
            $lookup: {
                from: 'HR_Resigns',
                localField: 'idQLC',
                foreignField: 'ep_id',
                as: 'quit'
            }
        },
        {
            $match: conditionNghiViec
        },
        {
            $project: { 'quit.ep_id': 1, 'quit.current_position': 1, 'quit.created_at': 1, idQLC: 1, userName: 1, 'inForPerson.account': 1, emailContact: 1, phone: 1, 'inForPerson.employee': 1 }
        },
        ])

        //Biểu đồ thống kê bổ nhiệm, quy hoạch
        let chartBoNhiem = await Users.aggregate([
            {
                $match: condition
            },
            {
                $lookup: {
                    from: 'HR_Appoints',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'Appoints'
                }
            },
            { $unwind: "$Appoints" },
            {
                $project: searchItem
            }
        ])

        let chartLuanChuyen = await Users.aggregate([
            {
                $match: condition
            },
            {
                $lookup: {
                    from: 'HR_TranferJobs',
                    localField: 'inForPerson.employee.com_id',
                    foreignField: 'com_id',
                    as: 'TranferJobs'
                }
            },
            { $unwind: "$TranferJobs" },

            {
                $project: searchItem
            }
        ])
        let data = {};
        data.phongBan = phongBan;
        data.Employee = countEmployee;
        data.EmployeeNam = countEmployeeNam;
        data.EmployeeNu = countEmployeeNu;
        data.tongSoNghiViec = countDataNghiViec;
        data.giamBienChe = giamBienChe;
        data.nghiViec = nghiViec;
        if (dataBoNhiem.length !== 0) {
            data.boNhiem = dataBoNhiem[0].SL;
        } else {
            data.boNhiem = 0;
        }
        if (dataBoNhiemNam.length !== 0) {
            data.boNhiemNam = dataBoNhiemNam[0].SL;
        } else {
            data.boNhiemNam = 0
        }
        if (dataBoNhiemNu.length !== 0) {
            data.boNhiemNu = dataBoNhiemNu[0].SL;
        } else {
            data.boNhiemNu = 0
        }


        data.tangGiamLuong = tangGiamLuong;
        data.tangLuong = tangLuong;
        data.giamLuong = giamLuong;

        data.luanChuyen = countDataLuanChuyen;
        data.luanChuyenNam = countDataLuanChuyenNam;
        data.luanChuyenNu = countDataLuanChuyenNu;

        if (countDataLuanChuyen.length !== 0) {
            data.luanChuyen = countDataLuanChuyen[0].SL;
        } else {
            data.luanChuyen = 0;
        }
        if (countDataLuanChuyenNam.length !== 0) {
            data.luanChuyenNam = countDataLuanChuyenNam[0].SL;
        } else {
            data.luanChuyenNam = 0
        }
        if (countDataLuanChuyenNu.length !== 0) {
            data.luanChuyenNu = countDataLuanChuyenNu[0].SL;
        } else {
            data.luanChuyenNu = 0
        }

        data.tongSoTinTuyenDung = tongSoTinTuyenDung;
        data.tongSoHoSo = tongSoHoSo;
        if (tongSoUngVienCanTuyen.length !== 0) {
            data.tongSoUngVienCanTuyen = tongSoUngVienCanTuyen[0].total;
        } else {
            data.tongSoUngVienCanTuyen = 0
        }

        if (tongSoUngVienDenPhongVan.length !== 0) {
            data.tongSoUngVienDenPhongVan = tongSoUngVienDenPhongVan[0].SL;
        } else {
            data.tongSoUngVienDenPhongVan = 0
        }
        if (tongSoUngVienQuaPhongVan.length !== 0) {
            data.tongSoUngVienQuaPhongVan = tongSoUngVienQuaPhongVan[0].SL;
        } else {
            data.tongSoUngVienQuaPhongVan = 0
        }
        if (tongSoUngVienHuyNhanViec.length !== 0) {
            data.tongSoUngVienHuyNhanViec = tongSoUngVienHuyNhanViec[0].SL;
        } else {
            data.tongSoUngVienHuyNhanViec = 0
        }
        data.mangThongTin = mangThongTin;
        data.thongKeNhanVienTuyenDung = thongKeNhanVienTuyenDung;
        data.gioiThieuUngVien = gioiThieuUngVien;


        data.chartEmployee = chartEmployee;
        data.chartNghiViec = chartNghiViecnon;
        data.chartBoNhiem = chartBoNhiem;
        data.chartLuanChuyen = chartLuanChuyen;
        data.chartTangGiamLuong = arr;
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: report.js:147 ~ exports.report= ~ error:", error)
        return functions.setError(res, error)
    }
}
exports.reportChart = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let depId = req.body.depId || null;
        let page = req.body.page || 1;
        let link = req.body.link;
        let gender = Number(req.body.gender);
        let positionId = Number(req.body.positionId);
        let groupId = Number(req.body.group_id);
        let teamId = Number(req.body.team_id);
        let birhday = req.body.birhday;
        let married = Number(req.body.married);
        let seniority = Number(req.body.seniority);
        let old = Number(req.body.old);


        let limit = 10;
        let skip = (page - 1) * limit;
        let searchItem = { idQLC: 1, userName: 1, 'inForPerson.account': 1, emailContact: 1, phone: 1, 'inForPerson.employee': 1, };
        let condition = {};
        let data = {};


        condition['inForPerson.employee.com_id'] = comId;
        if (gender) condition['inForPerson.account.gender'] = gender;
        if (depId) condition['inForPerson.employee.dep_id'] = depId;
        if (positionId) condition['inForPerson.employee.position_id'] = positionId;
        if (groupId) condition['inForPerson.employee.group_id'] = groupId;
        if (teamId) condition['inForPerson.employee.team_id'] = teamId;
        if (birhday) condition['inForPerson.account.birthday'] = { $regex: `.*${birhday}*.` };
        if (married) condition['inForPerson.account.married'] = married;
        if (depId) condition['inForPerson.employee.dep_id'] = depId;
        if (seniority) condition['inForPerson.account.experience'] = seniority;

        //if(old === 1) condition['inForPerson.account.birthday'] = getYear() - inForPerson.account.birthday;

        if (link === 'bieu-do-danh-sach-nhan-vien.html') {
            data = await Users.find(condition, searchItem, { skip }, { limit });
            return functions.success(res, 'get data success', { data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-nghi-viec.html') {
            data = await Users.aggregate([
                { $match: condition },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'HR_Resigns',
                        localField: 'idQLC',
                        foreignField: 'ep_id',
                        as: 'HR_Resigns'
                    }
                },
                { $unwind: '$HR_Resigns' },
                { $project: searchItem },

            ])
            return functions.success(res, 'get data success', { data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-bo-nhiem.html') {
            data = await Users.aggregate([
                { $match: condition },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'HR_Appoints',
                        localField: 'idQLC',
                        foreignField: 'ep_id',
                        as: 'HR_Appoints'
                    }
                },
                { $unwind: '$HR_Appoints' },
                { $project: searchItem },

            ])
            return functions.success(res, 'get data success', { data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-chuyen-cong-tac.html') {
            data = await Users.aggregate([
                { $match: condition },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'HR_TranferJobs',
                        localField: 'idQLC',
                        foreignField: 'ep_id',
                        as: 'HR_TranferJobs'
                    }
                },
                { $unwind: '$HR_TranferJobs' },
                { $project: searchItem },

            ])
            return functions.success(res, 'get data success', { data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-tang-giam-luong.html') {
            data = await Users.aggregate([
                { $match: condition },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'Tinhluong365SalaryBasic',
                        localField: 'idQLC',
                        foreignField: 'sb_id_user',
                        as: 'HR_Salarys'
                    }
                },
                { $unwind: '$HR_Salarys' },
                { $project: searchItem },

            ])
        } else if (link === 'bieu-do-danh-sach-nhan-vien-theo-tham-nien-cong-tac.html') {
            let tuoi = 0;
            let list = [];

            let check = await Users.aggregate([
                { $match: condition },
                { $skip: skip },
                { $limit: limit },
                { $project: searchItem },

            ])
            for (let i = 0; i < check.length; i++) {
                let sinhnhat = new Date(check[i].inForPerson.account.birthday).getFullYear()
                let namhientai = new Date().getFullYear();
                tuoi = namhientai - sinhnhat;
                if (old === 1 && tuoi < 30) {
                    list.push(check[i])
                } else if (old === 2 && tuoi > 30 && tuoi < 44) {
                    list.push(check[i])
                } else if (old === 3 && tuoi > 45 && tuoi < 59) {
                    list.push(check[i])
                } else if (old === 4 && tuoi > 60) {
                    list.push(check[i])
                }
            }
            data = list
            return functions.success(res, 'get data success', { data })
        }
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(error)
    }
}