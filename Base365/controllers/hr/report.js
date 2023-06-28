const Users = require('../../models/Users');
const Appoint = require('../../models/hr/personalChange/Appoint');
const QuitJobNew = require('../../models/hr/personalChange/QuitJobNew');
const TranferJob = require('../../models/hr/personalChange/TranferJob');
const functions = require('../../services/functions');
const RecruitmentNews = require('../../models/hr/RecruitmentNews')
const hr = require('../../services/hr/hrService');
const Candidates = require('../../models/hr/Candidates');
exports.report = async (req, res, next) => {
    try {
        let comId = req.comId;
        console.log("🚀 ~ file: report.js:11 ~ exports.report= ~ comId:", comId)
        let depId = req.body.depId || null;
        let from_date = req.body.from_date || null;
        let to_date = req.body.to_date || null;
        let condition = {};
        let searchItem = { idQLC: 1, userName: 1, 'inForPerson.account': 1, emailContact: 1, phone: 1, 'inForPerson.employee': 1, };
        if (depId) condition['inForPerson.employee.dep_id'] = depId;

        condition['inForPerson.employee.com_id'] = comId;

        let countEmployee = await Users.find(condition).count()
        let dataEmployee = await Users.find(condition, searchItem)

        condition['inForPerson.account.gender'] = 1
        let dataNhanVienNam = await Users.find(condition, searchItem)
        let countNhanVienNam = await Users.find(condition).count()

        condition['inForPerson.account.gender'] = 2
        let dataNhanVienNu = await Users.find(condition, searchItem)
        let countNhanVienNu = await Users.find(condition).count()

        if (from_date) condition.created_at = { $gte: new Date(from_date) }
        if (to_date) condition.created_at = { $lte: new Date(to_date) }
        if (from_date && to_date) condition.created_at = { $gte: new Date(from_date), $lte: new Date(to_date) }


        delete condition['inForPerson.employee.com_id']
        condition.com_id = comId;
        let dataBoNhiem = await Appoint.find(condition, searchItem)


        // Tỷ lệ nhân viên nghỉ việc
        let dataNghiViec = await QuitJobNew.find(condition, searchItem)
        delete condition.com_id
        // thieu tang giam luong

        // Luân chuyển công tác
        let dataLuanChuyen = await Users.aggregate([
            {
                $lookup: {
                    from: 'HR_TranferJobs',
                    localField: 'inForPerson.employee.com_id',
                    foreignField: 'com_id',
                    as: 'TranferJobs'
                }
            },
            {
                $match: condition
            },
            {
                $project: searchItem
            }
        ])
        //  Tổng số tin
        let tongSoTinTuyenDung = await RecruitmentNews.find({ isDelete: 0, comId }).count()

        // Tổng số hồ sơ
        let tongSoHoSo = await Candidates.find({ isDelete: 0, comId }).count()

        // Tổng số ứng viên cần tuyển
        let tongSoUngVienCanTuyen = await RecruitmentNews.aggregate([
            {
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
        let tongSoUngVienDenPhongVan  = await Candidates.aggregate([
            {
                $lookup:{
                    from:'HR_ScheduleInterviews',
                    localField:'id',
                    foreignField:'canId',
                    as:'lichPv'
                }
            },
            {
                $match:{comId,'lichPv.isSwitch':0}
            },
            {
                $project:{id}
            }
        ])
        // // Số ứng viên qua phỏng vấn
        // let tongSoUngVienQuaPhongVan = await 









        let data = {};
        let Employee = {};
        Employee.count = countEmployee;
        Employee.data = dataEmployee;
        data.Employee = Employee;

        let Nv = {};
        Nv.count_NhanVienNam = countNhanVienNam;
        Nv.NhanVienNam = dataNhanVienNam;
        Nv.count_NhanVienNu = countNhanVienNu;
        Nv.NhanVienNu = dataNhanVienNu;
        data.gioiTinhNhanVien = Nv;

        data.dataBoNhiem = dataBoNhiem;
        data.dataNghiViec = dataNghiViec;
        data.dataLuanChuyen = dataLuanChuyen;
        data.tongSoTinTuyenDung = tongSoTinTuyenDung;
        data.tongSoHoSo = tongSoHoSo;
        data.tongSoUngVienCanTuyen = tongSoUngVienCanTuyen[0].total;
        data.tongSoUngVienDenPhongVan = tongSoUngVienDenPhongVan;



        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: report.js:15 ~ exports.report= ~ error:", error)
        return functions.setError(res, error)
    }
}