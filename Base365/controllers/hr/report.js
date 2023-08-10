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

// báo cáo nhân sự
exports.report = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let depId = Number(req.body.depId);
        let from_date = req.body.from_date;
        let to_date = req.body.to_date;

        let searchItem = {
            idQLC: 1,
            userName: 1,
            birthday: '$inForPerson.account.birthday',
            gender: '$inForPerson.account.gender',
            dep: '$dep.dep_name',
            group: '$group.gr_name',
            chucvu: '$inForPerson.employee.position_id',
            married: '$inForPerson.account.married',
            team: '$team.team_name',
            emailContact: 1,
            phone: 1,
            start_working_time: '$inForPerson.employee.start_working_time',
            'quit.ep_id': 1,
            'quit.current_position': 1,
            'quit.created_at': 1
        };
        // tạo conditions
        let conditions = {};
        let subConditions = {};

        // điều kiện tìm kiếm 
        if (depId) conditions['inForPerson.employee.dep_id'] = depId;
        if (from_date) conditions['inForPerson.employee.start_working_time'] = { $gte: new Date(from_date).getTime() / 1000 }
        if (to_date) conditions['inForPerson.employee.start_working_time'] = { $lte: new Date(to_date).getTime() / 1000 }
        if (from_date && to_date)
            conditions['inForPerson.employee.start_working_time'] = {
                $gte: new Date(from_date).getTime() / 1000,
                $lte: new Date(to_date).getTime() / 1000
            }

        conditions['inForPerson.employee.com_id'] = comId;
        conditions['inForPerson.employee.ep_status'] = "Active";
        conditions.type = 2;
        // tổng số nhân viên thuộc công ty
        let countEmployee = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'QLC_Deparments',
                    localField: 'inForPerson.employee.dep_id',
                    foreignField: 'dep_id',
                    as: 'dep'
                }
            },
            { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'QLC_Teams',
                    localField: 'inForPerson.employee.team_id',
                    foreignField: 'team_id',
                    as: 'team'
                }
            },
            { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'QLC_Groups',
                    localField: 'inForPerson.employee.group_id',
                    foreignField: 'gr_id',
                    as: 'group'
                }
            },
            { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
            { $project: searchItem }
        ])


        // tìm kiếm điều kiện là nhân viên nam
        conditions['inForPerson.account.gender'] = 1;
        let countEmployeeNam = await Users.countDocuments(conditions)

        // tìm kiếm với điều kiện là nhân viên nữ
        conditions['inForPerson.account.gender'] = 2;
        let countEmployeeNu = await Users.countDocuments(conditions)

        // xoá điều kiện 
        conditions = {};
        subConditions = {};

        // điều kiện tìm kiếm
        if (depId) conditions['inForPerson.employee.dep_id'] = depId;
        if (from_date) subConditions['Appoints.created_at'] = { $gte: new Date(from_date) }
        if (to_date) subConditions['Appoints.created_at'] = { $lte: new Date(to_date) }
        if (from_date && to_date)
            subConditions['Appoints.created_at'] = { $gte: new Date(from_date), $lte: new Date(to_date) }

        conditions['inForPerson.account.gender'] = 1;
        conditions['inForPerson.employee.com_id'] = comId;
        conditions['inForPerson.employee.ep_status'] = "Active";
        conditions.type = 2;
        // tìm kiếm nhân viên được bổ nhiệm là nam
        let dataBoNhiemNam = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_Appoints',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'Appoints'
                }
            },
            { $unwind: "$Appoints" },
            { $match: subConditions },
        ])
        // tìm kiếm với nhân viên được bổ nhiệm là nữ
        conditions['inForPerson.account.gender'] = 2;
        let dataBoNhiemNu = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_Appoints',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'Appoints'
                }
            },
            { $unwind: "$Appoints" },
            { $match: subConditions },

        ])

        // tìm kiếm nhân viên được bổ nhiệm
        delete conditions['inForPerson.account.gender']
        let dataBoNhiem = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_Appoints',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'Appoints'
                }
            },
            { $unwind: "$Appoints" },
            { $match: subConditions },
            { $project: searchItem }
        ])

        // xoá điều kiện 
        conditions = {};
        subConditions = {};

        // điều kiện tìm kiếm
        if (depId) conditions['inForPerson.employee.dep_id'] = depId;
        if (from_date) subConditions['resign.created_at'] = { $gte: new Date(from_date) }
        if (to_date) subConditions['resign.created_at'] = { $lte: new Date(to_date) }
        if (from_date && to_date)
            subConditions['resign.created_at'] = { $gte: new Date(from_date), $lte: new Date(to_date) }

        conditions['inForPerson.employee.com_id'] = 0;
        conditions['inForPerson.employee.ep_status'] = "Deny";
        subConditions['resign.type'] = 1;
        conditions.type = { $ne: 2 };
        subConditions['resign.com_id'] = comId;
        // số lượng nhân viên giảm biên chế
        let giamBienChe = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_Resigns',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'resign'
                }
            },
            { $unwind: "$resign" },
            { $match: subConditions },

        ])

        subConditions['resign.type'] = 2;
        // số lượng nhân viên nghỉ việc
        let nghiViec = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_Resigns',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'resign'
                }
            },
            { $unwind: "$resign" },
            { $match: subConditions },

        ])

        // tổng số lượng nhân viên nghỉ việc
        delete subConditions['resign.type']
        let countDataNghiViec = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_Resigns',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'resign'
                }
            },
            { $unwind: "$resign" },
            { $match: subConditions },
            { $project: searchItem }
        ])


        // xoá điều kiện 
        conditions = {};
        subConditions = {};
        // tăng giảm lương
        if (from_date) conditions.sb_time_up = { $gte: new Date(from_date) }
        if (to_date) conditions.sb_time_up = { $lte: new Date(to_date) }
        if (from_date && to_date)
            conditions.sb_time_up = { $gte: new Date(from_date), $lte: new Date(to_date) }
        let dataLuong = await Salarys.find({ sb_id_com: comId, sb_first: { $ne: 1 } }).sort({ sb_time_up: -1 });
        let tangLuong = 0;
        let giamLuong = 0;
        let arr = [];
        if (dataLuong.length !== 0) {
            for (let i = 0; i < dataLuong.length; i++) {

                conditions.sb_id_user = dataLuong[i].sb_id_user;
                conditions.sb_time_up = { $lt: new Date(dataLuong[i].sb_time_up) }
                checkTangGiam = await Salarys.findOne(conditions).lean()

                if (checkTangGiam) {
                    let tangGiam = dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic
                    checkTangGiam.tangGiam = tangGiam
                    if (dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic > 0) {
                        tangLuong++;
                        arr.push(checkTangGiam)
                    } else if (dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic < 0) {
                        giamLuong++;
                        arr.push(checkTangGiam)
                    }
                }
            }
        }
        let tangGiamLuong = 0;
        if (tangLuong !== 0) tangGiamLuong = tangLuong;
        if (giamLuong !== 0) tangGiamLuong = giamLuong;
        if (tangLuong !== 0 && giamLuong !== 0) tangGiamLuong = tangLuong + giamLuong;

        // xoá điều kiện 
        conditions = {};
        subConditions = {};

        // điều kiện tìm kiếm
        if (depId) subConditions['TranferJobs.dep_id'] = depId;
        if (from_date) subConditions['TranferJobs.created_at'] = { $gte: new Date(from_date) }
        if (to_date) subConditions['TranferJobs.created_at'] = { $lte: new Date(to_date) }
        if (from_date && to_date)
            subConditions['TranferJobs.created_at'] = { $gte: new Date(from_date), $lte: new Date(to_date) }

        conditions['inForPerson.employee.com_id'] = comId;
        conditions['inForPerson.employee.ep_status'] = "Active";
        conditions.type = 2;
        // Luân chuyển công tác
        let countDataLuanChuyen = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_TranferJobs',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'TranferJobs'
                }
            },
            { $unwind: "$TranferJobs" },
            { $match: subConditions },
        ])

        // nhân viên nam luân chuyển
        conditions['inForPerson.account.gender'] = 1
        let countDataLuanChuyenNam = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_TranferJobs',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'TranferJobs'
                }
            },
            { $unwind: "$TranferJobs" },
            { $match: subConditions },
        ])

        // nhân viên nữ luân chuyển
        conditions['inForPerson.account.gender'] = 2
        let countDataLuanChuyenNu = await Users.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: 'HR_TranferJobs',
                    localField: 'idQLC',
                    foreignField: 'ep_id',
                    as: 'TranferJobs'
                }
            },
            { $unwind: "$TranferJobs" },
            { $match: subConditions },
        ])


        let data = {};

        data.Employee = countEmployee.length;
        data.countEmployee = countEmployee;
        data.EmployeeNam = countEmployeeNam;
        data.EmployeeNu = countEmployeeNu;

        data.tongNghiViec = countDataNghiViec.length;
        data.giamBienChe = giamBienChe.length
        data.nghiViec = nghiViec.length

        data.boNhiem = dataBoNhiem.length
        data.boNhiemNam = dataBoNhiemNam.length
        data.boNhiemNu = dataBoNhiemNu.length

        data.tangGiamLuong = tangGiamLuong;
        data.tangLuong = tangLuong;
        data.giamLuong = giamLuong;

        data.luanChuyen = countDataLuanChuyen.length
        data.luanChuyenNam = countDataLuanChuyenNam.length
        data.luanChuyenNu = countDataLuanChuyenNu.length
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: report.js:637 ~ exports.report= ~ error:", error)
        return functions.setError(res, error)
    }
}

// chi tiết báo cáo nhân sự
exports.reportDetail = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;

        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let link = req.body.link;
        let depId = Number(req.body.depId);
        let gender = Number(req.body.gender);
        let positionId = Number(req.body.positionId);
        let groupId = Number(req.body.group_id);
        let teamId = Number(req.body.team_id);
        let birthday = req.body.birthday;
        let married = Number(req.body.married);
        let seniority = Number(req.body.seniority);
        let old = Number(req.body.old);
        let from_date = req.body.from_date;
        let to_date = req.body.to_date;
        let type = Number(req.body.type);

        let limit = pageSize;
        let skip = (page - 1) * limit;
        let searchItem = {
            idQLC: 1,
            userName: 1,
            birthday: '$inForPerson.account.birthday',
            gender: '$inForPerson.account.gender',
            dep: '$dep.dep_name',
            group: '$group.gr_name',
            chucvu: '$inForPerson.employee.position_id',
            married: '$inForPerson.account.married',
            team: '$team.team_name',
            emailContact: 1,
            phone: 1,
            start_working_time: '$inForPerson.employee.start_working_time',
            'quit.ep_id': 1,
            'quit.current_position': 1,
            'quit.created_at': 1,
            luongmoi: '$HR_Salarys.sb_salary_basic',
            sb_id_user: '$HR_Salarys.sb_id_user',
            sb_time_up: '$HR_Salarys.sb_time_up',
            sb_quyetdinh: '$HR_Salarys.sb_quyetdinh',
            address: 1,
            experience: '$inForPerson.account.experience',
            
        };
        let conditions = {};
        let data = {};
        let subConditions = {};

        conditions['inForPerson.employee.com_id'] = comId;
        conditions['inForPerson.employee.ep_status'] = 'Active';
        if (gender) conditions['inForPerson.account.gender'] = gender;
        if (depId) conditions['inForPerson.employee.dep_id'] = depId;
        if (positionId) conditions['inForPerson.employee.position_id'] = positionId;
        if (groupId) conditions['inForPerson.employee.group_id'] = groupId;
        if (teamId) conditions['inForPerson.employee.team_id'] = teamId;
        if (birthday) conditions['inForPerson.account.birthday'] = { $regex: `.*${birthday}*.` };
        if (married) conditions['inForPerson.account.married'] = married;
        if (depId) conditions['inForPerson.employee.dep_id'] = depId;
        if (seniority) conditions['inForPerson.account.experience'] = seniority;

        if (birthday) {
            var dauNam = new Date(birthday, 1, 1).getTime() / 1000;
            var cuoiNam = new Date(birthday, 12, 31).getTime() / 1000;
            conditions['inForPerson.account.birthday'] = {
                $gt: dauNam,
                $lt: cuoiNam
            };
        }
        conditions.type = 2
        if (link === 'bieu-do-danh-sach-nhan-vien.html') {
            data = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'QLC_Deparments',
                        localField: 'inForPerson.employee.dep_id',
                        foreignField: 'dep_id',
                        as: 'dep'
                    }
                },
                { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Teams',
                        localField: 'inForPerson.employee.team_id',
                        foreignField: 'team_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Groups',
                        localField: 'inForPerson.employee.group_id',
                        foreignField: 'gr_id',
                        as: 'group'
                    }
                },
                { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }
            ])
            let soluong = data.length;
            let total = await Users.countDocuments(conditions)
            for(let i = 0; i < data.length; i++){
                data[i].chucvu = hr.positionNames[data[i].chucvu]
            }
            return functions.success(res, 'get data success', { total, soluong, data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-nghi-viec.html') {
            conditions['inForPerson.employee.com_id'] = 0;
            conditions['inForPerson.employee.ep_status'] = 'Deny'
            subConditions['resign.com_id'] = comId;
            conditions.type = { $ne: 2 }
            if (type) subConditions['resign.type'] = type;
            data = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'HR_Resigns',
                        localField: 'idQLC',
                        foreignField: 'ep_id',
                        as: 'resign'
                    }
                },
                { $unwind: "$resign" },
                { $match: subConditions },
                {
                    $lookup: {
                        from: 'QLC_Deparments',
                        localField: 'inForPerson.employee.dep_id',
                        foreignField: 'dep_id',
                        as: 'dep'
                    }
                },
                { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Teams',
                        localField: 'inForPerson.employee.team_id',
                        foreignField: 'team_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Groups',
                        localField: 'inForPerson.employee.group_id',
                        foreignField: 'gr_id',
                        as: 'group'
                    }
                },
                { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }
            ])
            let soluong = data.length
            let total = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'HR_Resigns',
                        localField: 'idQLC',
                        foreignField: 'ep_id',
                        as: 'resign'
                    }
                },
                { $unwind: "$resign" },
                { $match: subConditions },]);
            total = total.length;
            for(let i = 0; i < data.length; i++){
                data[i].chucvu = hr.positionNames[data[i].chucvu]
            }
            return functions.success(res, 'get data success', { total, soluong, data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-bo-nhiem.html') {
            data = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit },
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
                    $lookup: {
                        from: 'QLC_Deparments',
                        localField: 'inForPerson.employee.dep_id',
                        foreignField: 'dep_id',
                        as: 'dep'
                    }
                },
                { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Teams',
                        localField: 'inForPerson.employee.team_id',
                        foreignField: 'team_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Groups',
                        localField: 'inForPerson.employee.group_id',
                        foreignField: 'gr_id',
                        as: 'group'
                    }
                },
                { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }

            ])
            let total = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'HR_Appoints',
                        localField: 'idQLC',
                        foreignField: 'ep_id',
                        as: 'Appoints'
                    }
                },
                { $unwind: "$Appoints" },]);
            let soluong = data.length
            total = total.length
            for(let i = 0; i < data.length; i++){
                data[i].chucvu = hr.positionNames[data[i].chucvu]
            }
            return functions.success(res, 'get data success', { total, soluong, data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-chuyen-cong-tac.html') {
            data = await Users.aggregate([
                { $match: conditions },
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
                {
                    $lookup: {
                        from: 'QLC_Deparments',
                        localField: 'inForPerson.employee.dep_id',
                        foreignField: 'dep_id',
                        as: 'dep'
                    }
                },
                { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Teams',
                        localField: 'inForPerson.employee.team_id',
                        foreignField: 'team_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Groups',
                        localField: 'inForPerson.employee.group_id',
                        foreignField: 'gr_id',
                        as: 'group'
                    }
                },
                { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }

            ]);
            let total = await Users.aggregate([
                { $match: conditions },
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
                { $unwind: '$HR_TranferJobs' }]);
            total = total.length;
            let soluong = data.length
            for(let i = 0; i < data.length; i++){
                data[i].chucvu = hr.positionNames[data[i].chucvu]
            }
            return functions.success(res, 'get data success', { total, soluong, data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-tang-giam-luong.html') {
            if (from_date) subConditions['HR_Salarys.sb_time_up'] = { $gte: new Date(from_date) }
            if (to_date) subConditions['HR_Salarys.sb_time_up'] = { $lte: new Date(to_date) }
            if (from_date && to_date)
                subConditions['HR_Salarys.sb_time_up'] = { $gte: new Date(from_date), $lte: new Date(to_date) }
            let idnv = Number(req.body.idnv);
            if(idnv) conditions.idQLC = idnv;
            data = await Users.aggregate([
                { $match: conditions },
                {
                    $lookup: {
                        from: 'Tinhluong365SalaryBasic',
                        localField: 'idQLC',
                        foreignField: 'sb_id_user',
                        as: 'HR_Salarys'
                    }
                },
                { $unwind: '$HR_Salarys' },
                { $match: subConditions },
                { $match: { 'HR_Salarys.sb_first': { $ne: 1 }, 'HR_Salarys.sb_id_com': comId } },
                { $sort: { 'HR_Salarys.sb_time_up': -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'QLC_Deparments',
                        localField: 'inForPerson.employee.dep_id',
                        foreignField: 'dep_id',
                        as: 'dep'
                    }
                },
                { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Teams',
                        localField: 'inForPerson.employee.team_id',
                        foreignField: 'team_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Groups',
                        localField: 'inForPerson.employee.group_id',
                        foreignField: 'gr_id',
                        as: 'group'
                    }
                },
                { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }
            ])
            let subData = [];
            for (let i = 0; i < data.length; i++) {
                let element = data[i];
                conditions = {};
                conditions.sb_id_user = element.sb_id_user;
                conditions.sb_time_up = { $lt: new Date(element.sb_time_up) }
                let luongcu = await Salarys.findOne(conditions).sort({sb_time_up:-1}).lean();
                if (luongcu && type === 1) {
                    if (luongcu.sb_salary_basic > element.luongmoi) {
                        element.giamLuong = luongcu.sb_salary_basic - element.luongmoi;
                        element.tangLuong = 0;
                        element.luonghientai = luongcu.sb_salary_basic
                        subData.push(element);
                    }
                } else if (luongcu && type === 2) {
                    if (luongcu.sb_salary_basic < element.luongmoi) {
                        element.tangLuong = element.luongmoi - luongcu.sb_salary_basic;
                        element.luonghientai = luongcu.sb_salary_basic
                        element.giamLuong = 0;
                        subData.push(element);
                    }
                } else if (luongcu && !type) {
                    if (luongcu.sb_salary_basic > element.luongmoi) {
                        element.giamLuong = luongcu.sb_salary_basic - element.luongmoi;
                        element.luonghientai = luongcu.sb_salary_basic
                        element.tangLuong = 0;
                        subData.push(element);

                    } else if (luongcu.sb_salary_basic < element.luongmoi) {
                        element.tangLuong = element.luongmoi - luongcu.sb_salary_basic;
                        element.luonghientai = luongcu.sb_salary_basic
                        element.giamLuong = 0;
                        subData.push(element);
                    }
                }
            }
            let soluong = subData.length
            conditions = {
                'inForPerson.employee.com_id': comId,
                'inForPerson.employee.ep_status': 'Active',
                type: 2
            }
            if(idnv) conditions.idQLC = idnv;
            let dataLuong = await Users.aggregate([
                { $match: conditions },
                {
                    $lookup: {
                        from: 'Tinhluong365SalaryBasic',
                        localField: 'idQLC',
                        foreignField: 'sb_id_user',
                        as: 'HR_Salarys'
                    }
                },
                { $unwind: '$HR_Salarys' },
                { $match: subConditions },
                { $match: { 'HR_Salarys.sb_first': { $ne: 1 }, 'HR_Salarys.sb_id_com': comId } },
                { $sort: { 'HR_Salarys.sb_time_up': -1 } },
                { $project: searchItem }]);
            let tangLuong = 0;
            let giamLuong = 0;
            if (dataLuong.length !== 0) {
                for (let i = 0; i < dataLuong.length; i++) {
                    let element = dataLuong[i];
                    conditions = {};
                    conditions.sb_id_user = element.sb_id_user;
                    conditions.sb_time_up = { $lt: new Date(element.sb_time_up) }
                    checkTangGiam = await Salarys.findOne(conditions).lean()


                    if (checkTangGiam) {
                        if (type === 2) {
                            if (element.luongmoi > checkTangGiam.sb_salary_basic) {

                                tangLuong++;
                            }
                        } else if (type === 1) {
                            if (element.luongmoi < checkTangGiam.sb_salary_basic) {
                                giamLuong++;
                            }
                        } else if (!type) {
                            if (element.luongmoi > checkTangGiam.sb_salary_basic) {
                                tangLuong++;

                            } else if (element.luongmoi < checkTangGiam.sb_salary_basic) {
                                giamLuong++;
                            }
                        }
                    }
                }
            }
            let tangGiamLuong = 0;
            if (tangLuong !== 0) tangGiamLuong = tangLuong;
            if (giamLuong !== 0) tangGiamLuong = giamLuong;
            if (tangLuong !== 0 && giamLuong !== 0) tangGiamLuong = tangLuong + giamLuong;
            for(let i = 0; i < subData.length; i++){
                subData[i].chucvu = hr.positionNames[data[i].chucvu]
            }
            return functions.success(res, 'get data success', { tongsoluong: tangGiamLuong, soluong, data: subData })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-theo-do-tuoi.html') {
            let tuoi = 0;
            let list = [];

            let check = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'QLC_Deparments',
                        localField: 'inForPerson.employee.dep_id',
                        foreignField: 'dep_id',
                        as: 'dep'
                    }
                },
                { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Teams',
                        localField: 'inForPerson.employee.team_id',
                        foreignField: 'team_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Groups',
                        localField: 'inForPerson.employee.group_id',
                        foreignField: 'gr_id',
                        as: 'group'
                    }
                },
                { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }

            ]);
            for (let i = 0; i < check.length; i++) {
                let element = check[i];
                let sinhnhat = new Date(element.birthday * 1000).getFullYear()
                let namhientai = new Date().getFullYear();
                tuoi = namhientai - sinhnhat;
                if (old === 1 && tuoi < 30) {
                    list.push(element)
                } else if (old === 2 && tuoi > 30 && tuoi < 44) {
                    list.push(element)
                } else if (old === 3 && tuoi > 45 && tuoi < 59) {
                    list.push(element)
                } else if (old === 4 && tuoi > 60) {
                    list.push(element)
                } else if (!old) {
                    list.push(element)
                }
            }
            let soluong = list.length
            let tongsoluong = await Users.aggregate([
                { $match: conditions },
                { $project: searchItem }
            ]);
            let listTotal = [];
            for (let i = 0; i < tongsoluong.length; i++) {
                let element = tongsoluong[i];
                let sinhnhat = new Date(element.birthday * 1000).getFullYear()
                let namhientai = new Date().getFullYear();
                tuoi = namhientai - sinhnhat;
                if (old === 1 && tuoi < 30) {
                    listTotal.push(element)
                } else if (old === 2 && tuoi > 30 && tuoi < 44) {
                    listTotal.push(element)
                } else if (old === 3 && tuoi > 45 && tuoi < 59) {
                    listTotal.push(element)
                } else if (old === 4 && tuoi > 60) {
                    listTotal.push(element)
                } else if (!old) {
                    listTotal.push(element)
                }
            }
            tongsoluong = listTotal.length
            for(let i = 0; i < list.length; i++){
                list[i].chucvu = hr.positionNames[list[i].chucvu]
            }
            return functions.success(res, 'get data success', { tongsoluong, soluong, data: list })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-theo-tham-nien-cong-tac.html') {
            if (type === 1)
                conditions['inForPerson.employee.start_working_time'] = { $gt: new Date().getTime() / 1000 - 3 * 30 * 24 * 60 * 60 }
            if (type === 2)
                conditions['inForPerson.employee.start_working_time'] = {
                    $lte: new Date().getTime() / 1000 - 3 * 30 * 24 * 60 * 60,
                    $gt: new Date().getTime() / 1000 - 365 * 24 * 60 * 60
                }
            if (type === 3)
                conditions['inForPerson.employee.start_working_time'] = {
                    $lte: new Date().getTime() / 1000 - 365 * 24 * 60 * 60,
                    $gt: new Date().getTime() / 1000 - 3 * 365 * 24 * 60 * 60
                }
            if (type === 4)
                conditions['inForPerson.employee.start_working_time'] = {
                    $lte: new Date().getTime() / 1000 - 3 * 365 * 24 * 60 * 60,
                    $gt: new Date().getTime() / 1000 - 5 * 365 * 24 * 60 * 60
                }
            if (type === 5)
                conditions['inForPerson.employee.start_working_time'] = { $lte: new Date().getTime() / 1000 - 5 * 365 * 24 * 60 * 60 }
            let data = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'QLC_Deparments',
                        localField: 'inForPerson.employee.dep_id',
                        foreignField: 'dep_id',
                        as: 'dep'
                    }
                },
                { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Teams',
                        localField: 'inForPerson.employee.team_id',
                        foreignField: 'team_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Groups',
                        localField: 'inForPerson.employee.group_id',
                        foreignField: 'gr_id',
                        as: 'group'
                    }
                },
                { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }

            ]);
            let datatotal = await Users.countDocuments(conditions);
            let soluong = data.length
            let tongsoluong = datatotal
            for(let i = 0; i < data.length; i++){
                data[i].chucvu = hr.positionNames[data[i].chucvu]
            }
            return functions.success(res, 'get data success', { tongsoluong, soluong, data })
        } else if (link === 'bieu-do-danh-sach-nhan-vien-theo-chuc-vu.html') {
            if (type === 1) conditions['inForPerson.employee.position_id'] = 1;
            if (type === 2) conditions['inForPerson.employee.position_id'] = 9;
            if (type === 3) conditions['inForPerson.employee.position_id'] = 2;
            if (type === 4) conditions['inForPerson.employee.position_id'] = 3;

            let data = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'QLC_Deparments',
                        localField: 'inForPerson.employee.dep_id',
                        foreignField: 'dep_id',
                        as: 'dep'
                    }
                },
                { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Teams',
                        localField: 'inForPerson.employee.team_id',
                        foreignField: 'team_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'QLC_Groups',
                        localField: 'inForPerson.employee.group_id',
                        foreignField: 'gr_id',
                        as: 'group'
                    }
                },
                { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }
            ]);

            let datatotal = await Users.aggregate([
                { $match: conditions },
                { $skip: skip },
                { $limit: limit }]);
            let tongsoluong = datatotal.length
            let soluong = data.length
            for(let i = 0; i < data.length; i++){
                data[i].chucvu = hr.positionNames[data[i].chucvu]
            }
            return functions.success(res, 'get data success', { tongsoluong, soluong, data })
        }
    } catch (error) {
        console.log("🚀 ~ file: report.js:985 ~ exports.reportChart= ~ error:", error)
        return functions.setError(res, error.message)
    }
}

// biểu đồ báo cáo nhân sự
exports.reportChart = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let depId = Number(req.body.depId);
        let from_date = req.body.from_date;
        let to_date = req.body.to_date;
        let type = Number(req.body.type) || 3;
        //Biểu đồ thống kê số nhân viên mới
        let chartEmployee = [];
        let chartDaketHon = [];
        let chartDocThan = [];
        let chartHocVanTrenDH = [];
        let chartHocVanDH = [];
        let chartHocVanCD = [];
        let chartHocVanTC = [];
        let chartHocVanNghe = [];
        let chartHocVanDuoiTHPT = [];
        let chartDuoi30tuoi = [];
        let chart30den44tuoi = [];
        let chart45den59tuoi = [];
        let chartTren60tuoi = [];
        let songay = hr.thoigian(from_date, to_date, type);
        conditions = {};
        conditions['inForPerson.employee.com_id'] = comId;
        conditions['inForPerson.employee.ep_status'] = "Active";
        if (depId) conditions['inForPerson.employee.dep_id'] = depId;
        for (let i = 0; i < songay; i++) {
            to_date ? to_date = new Date(to_date) : to_date = new Date();

            if (type === 3 && !from_date) from_date = new Date(to_date.getTime() - 15 * 24 * 60 * 60 * 1000)

            let from = 0;
            let to = 0;
            if (type === 3) {
                from = new Date(from_date).getTime() + i * 24 * 60 * 60 * 1000;
                to = from + 24 * 60 * 60 * 1000;
            } else if (type === 2) {
                from = new Date(from_date).getTime() + i * 30 * 24 * 60 * 60 * 1000;
                to = from + 30 * 24 * 60 * 60 * 1000;
            } else {
                from = new Date(from_date).getTime() + i * 365 * 24 * 60 * 60 * 1000;
                to = from + 365 * 24 * 60 * 60 * 1000;
            }

            conditions['inForPerson.employee.start_working_time'] = {
                $gte: new Date(from).getTime() / 1000,
                $lt: new Date(to).getTime() / 1000
            }

            let datachart = await Users.aggregate([
                { $match: conditions },
                {
                    $project: {
                        inForPerson: 1
                    }
                }
            ]);
            chartEmployee.push(datachart.length)

            // Biểu đồ thống kê tình trạng hôn nhân
            let chartDaketHon1 = datachart.filter(item => item.inForPerson.account.married == 1)
            chartDaketHon.push(chartDaketHon1.length);

            // Biểu đồ thống kê tình trạng hôn nhân
            let chartDocThan1 = datachart.filter(item => item.inForPerson.account.married == 2)
            chartDocThan.push(chartDocThan1.length);

            // Biểu đồ thống kê tình độ học vấn

            let chartHocVanTrenDH1 = datachart.filter(item => item.inForPerson.account.education == 1)
            chartHocVanTrenDH.push(chartHocVanTrenDH1.length);


            let chartHocVanDH1 = datachart.filter(item => item.inForPerson.account.education == 2)
            chartHocVanDH.push(chartHocVanDH1.length);


            let chartHocVanCD1 = datachart.filter(item => item.inForPerson.account.education == 3)
            chartHocVanCD.push(chartHocVanCD1.length);


            let chartHocVanTC1 = datachart.filter(item => item.inForPerson.account.education == 4)
            chartHocVanTC.push(chartHocVanTC1.length);


            let chartHocVanNghe1 = datachart.filter(item => item.inForPerson.account.education == 5)
            chartHocVanNghe.push(chartHocVanNghe1.length);

            let chartHocVanDuoiTHPT1 = datachart.filter(item => item.inForPerson.account.education > 5)
            chartHocVanDuoiTHPT.push(chartHocVanDuoiTHPT1.length);

            //Biểu đồ thống kê độ tuổi
            let chartDuoi30tuoi1 = datachart.filter(item =>
                item.inForPerson.account.birthday >= new Date().getTime() / 1000 - 30 * 365 * 24 * 60 * 60)
            chartDuoi30tuoi.push(chartDuoi30tuoi1.length);

            let chart30den44tuoi1 = datachart.filter(item =>
                item.inForPerson.account.birthday <= new Date().getTime() / 1000 - 30 * 365 * 24 * 60 * 60 &&
                item.inForPerson.account.birthday >= new Date().getTime() / 1000 - 44 * 365 * 24 * 60 * 60)
            chart30den44tuoi.push(chart30den44tuoi1.length);

            let chart45den59tuoi1 = datachart.filter(item =>
                item.inForPerson.account.birthday <= new Date().getTime() / 1000 - 45 * 365 * 24 * 60 * 60 &&
                item.inForPerson.account.birthday >= new Date().getTime() / 1000 - 59 * 365 * 24 * 60 * 60)
            chart45den59tuoi.push(chart45den59tuoi1.length);

            let chartTren60tuoi1 = datachart.filter(item =>
                item.inForPerson.account.birthday <= new Date().getTime() / 1000 - 60 * 365 * 24 * 60 * 60)
            chartTren60tuoi.push(chartTren60tuoi1.length);
        }

        // Biểu đồ thống kê nhân viên nghỉ việc / giảm biên chế
        let chartNghiViec = [];
        let chartGiamBienChe = [];
        for (let i = 0; i < songay; i++) {
            to_date ? to_date = new Date(to_date) : to_date = new Date();
            if (type === 3 && !from_date) from_date = new Date(to_date.getTime() - 15 * 24 * 60 * 60 * 1000)
            let from = 0;
            let to = 0;
            if (type === 3) {
                from = new Date(from_date).getTime() + i * 24 * 60 * 60 * 1000;
                to = from + 24 * 60 * 60 * 1000;
            } else if (type === 2) {
                from = new Date(from_date).getTime() + i * 30 * 24 * 60 * 60 * 1000;
                to = from + 30 * 24 * 60 * 60 * 1000;
            } else {
                from = new Date(from_date).getTime() + i * 365 * 24 * 60 * 60 * 1000;
                to = from + 365 * 24 * 60 * 60 * 1000;
            }
            let datachart1 = await Resign.countDocuments({ created_at: { $gte: new Date(from), $lt: new Date(to) }, com_id: comId, type: 1 })
            let datachart2 = await Resign.countDocuments({ created_at: { $gte: new Date(from), $lt: new Date(to) }, com_id: comId, type: 2 })
            chartNghiViec.push(datachart2)
            chartGiamBienChe.push(datachart1)
        }

        //Biểu đồ thống kê bổ nhiệm, quy hoạch
        let chartBoNhiem = [];
        conditions = {};
        subConditions = {};
        if (depId) conditions['inForPerson.employee.dep_id'] = depId;
        conditions['inForPerson.employee.com_id'] = comId;
        conditions['inForPerson.employee.ep_status'] = "Active";
        for (let i = 0; i < songay; i++) {
            to_date ? to_date = new Date(to_date) : to_date = new Date();
            if (type === 3 && !from_date) from_date = new Date(to_date.getTime() - 15 * 24 * 60 * 60 * 1000)
            let from = 0;
            let to = 0;
            if (type === 3) {
                from = new Date(from_date).getTime() + i * 24 * 60 * 60 * 1000;
                to = from + 24 * 60 * 60 * 1000;
            } else if (type === 2) {
                from = new Date(from_date).getTime() + i * 30 * 24 * 60 * 60 * 1000;
                to = from + 30 * 24 * 60 * 60 * 1000;
            } else {
                from = new Date(from_date).getTime() + i * 365 * 24 * 60 * 60 * 1000;
                to = from + 365 * 24 * 60 * 60 * 1000;
            }
            subConditions['Appoints.created_at'] = { $gte: new Date(from), $lt: new Date(to) }
            let data = await Users.aggregate([
                { $match: conditions },
                {
                    $lookup: {
                        from: 'HR_Appoints',
                        localField: 'idQLC',
                        foreignField: 'ep_id',
                        as: 'Appoints'
                    }
                },
                { $unwind: "$Appoints" },
                { $match: subConditions }
            ])
            chartBoNhiem.push(data.length)
        }
        // Biểu đồ thống kê tăng, giảm lương
        let chartTangGiamLuong = [];
        conditions = {};
        subConditions = {};
        for (let i = 0; i < songay; i++) {
            to_date ? to_date = new Date(to_date) : to_date = new Date();
            if (type === 3 && !from_date) from_date = new Date(to_date.getTime() - 15 * 24 * 60 * 60 * 1000)
            let from = 0;
            let to = 0;
            if (type === 3) {
                from = new Date(from_date).getTime() + i * 24 * 60 * 60 * 1000;
                to = from + 24 * 60 * 60 * 1000;
            } else if (type === 2) {
                from = new Date(from_date).getTime() + i * 30 * 24 * 60 * 60 * 1000;
                to = from + 30 * 24 * 60 * 60 * 1000;
            } else {
                from = new Date(from_date).getTime() + i * 365 * 24 * 60 * 60 * 1000;
                to = from + 365 * 24 * 60 * 60 * 1000;
            }

            let dataLuong = await Salarys.find({
                sb_id_com: comId,
                sb_first: { $ne: 1 },
                sb_time_up: {
                    $gte: new Date(from),
                    $lt: new Date(to)
                }
            }).sort({ sb_time_up: -1 });
            let tanggiam = 0;
            if (dataLuong.length !== 0) {
                for (let j = 0; j < dataLuong.length; j++) {
                    conditions.sb_id_user = dataLuong[j].sb_id_user;
                    conditions.sb_time_up = { $lt: dataLuong[j].sb_time_up }
                    checkTangGiam = await Salarys.findOne(conditions).lean()
                    if (checkTangGiam) {
                        if (dataLuong[j].sb_salary_basic != checkTangGiam.sb_salary_basic) {
                            tanggiam++;
                        }
                    }
                }
            }
            chartTangGiamLuong.push(tanggiam);

        }
        // ----------------------------------------------------------------------------------------------------------

        // Biểu đồ thống luân chuyển công tác
        let chartLuanChuyen = [];
        conditions = {};
        subConditions = {};
        if (depId) subConditions['TranferJobs.dep_id'] = depId;
        conditions['inForPerson.employee.com_id'] = comId;
        conditions['inForPerson.employee.ep_status'] = "Active";
        conditions.type = 2;
        for (let i = 0; i < songay; i++) {
            to_date ? to_date = new Date(to_date) : to_date = new Date();
            if (type === 3 && !from_date) from_date = new Date(to_date.getTime() - 15 * 24 * 60 * 60 * 1000)
            let from = 0;
            let to = 0;
            if (type === 3) {
                from = new Date(from_date).getTime() + i * 24 * 60 * 60 * 1000;
                to = from + 24 * 60 * 60 * 1000;
            } else if (type === 2) {
                from = new Date(from_date).getTime() + i * 30 * 24 * 60 * 60 * 1000;
                to = from + 30 * 24 * 60 * 60 * 1000;
            } else {
                from = new Date(from_date).getTime() + i * 365 * 24 * 60 * 60 * 1000;
                to = from + 365 * 24 * 60 * 60 * 1000;
            }
            subConditions['TranferJobs.created_at'] = { $gte: new Date(from), $lt: new Date(to) }
            let data = await Users.aggregate([
                { $match: conditions },
                {
                    $lookup: {
                        from: 'HR_TranferJobs',
                        localField: 'idQLC',
                        foreignField: 'ep_id',
                        as: 'TranferJobs'
                    }
                },
                { $unwind: "$TranferJobs" },
                { $match: subConditions },
            ])

            chartLuanChuyen.push(data.length)
        }
        let data = {};
        data.chartEmployee = chartEmployee;
        data.chartNghiViec = chartNghiViec;
        data.chartGiamBienChe = chartGiamBienChe;
        data.chartBoNhiem = chartBoNhiem;
        data.chartLuanChuyen = chartLuanChuyen;
        // data.chartTangGiamLuong = arr;
        data.chartDaketHon = chartDaketHon;
        data.chartDocThan = chartDocThan;
        data.chartHocVanTrenDH = chartHocVanTrenDH;
        data.chartHocVanDH = chartHocVanDH;
        data.chartHocVanCD = chartHocVanCD;
        data.chartHocVanTC = chartHocVanTC;
        data.chartHocVanNghe = chartHocVanNghe;
        data.chartHocVanDuoiTHPT = chartHocVanDuoiTHPT;
        data.chartDuoi30tuoi = chartDuoi30tuoi;
        data.chart30den44tuoi = chart30den44tuoi;
        data.chart45den59tuoi = chart45den59tuoi;
        data.chartTren60tuoi = chartTren60tuoi;
        data.chartTangGiamLuong = chartTangGiamLuong;
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// báo cáo tuyển dụng
exports.reportRecruitment = async (req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
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
        { $match: { 'lichPv.isSwitch': 0 } },
        { $count: 'SL' }
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
        { $match: { 'getJob.isSwitch': 0 } },
        { $count: 'SL' }
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
        { $match: { 'CancelJobs.isSwitch': 0 } },
        { $count: 'SL' }
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
                { $match: { 'lichPv.isSwitch': 0 } },
                { $count: 'SL' }
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
                { $match: { 'getJob.isSwitch': 0 } },
                { $count: 'SL' }
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
                { $match: { 'CancelJobs.isSwitch': 0 } },
                { $count: 'SL' }
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
        let data = {};
        data.tongSoTinTuyenDung = tongSoTinTuyenDung;
        data.tongSoHoSo = tongSoHoSo;
        tongSoUngVienCanTuyen.length !== 0 ? data.tongSoUngVienCanTuyen = tongSoUngVienCanTuyen[0].total : data.tongSoUngVienCanTuyen = 0
        tongSoUngVienDenPhongVan.length !== 0 ? data.tongSoUngVienDenPhongVan = tongSoUngVienDenPhongVan[0].SL : data.tongSoUngVienDenPhongVan = 0
        tongSoUngVienQuaPhongVan.length !== 0 ? data.tongSoUngVienQuaPhongVan = tongSoUngVienQuaPhongVan[0].SL : data.tongSoUngVienQuaPhongVan = 0
        tongSoUngVienHuyNhanViec.length !== 0 ? data.tongSoUngVienHuyNhanViec = tongSoUngVienHuyNhanViec[0].SL : data.tongSoUngVienHuyNhanViec = 0

        data.mangThongTin = mangThongTin;
        data.thongKeNhanVienTuyenDung = thongKeNhanVienTuyenDung;
        data.gioiThieuUngVien = gioiThieuUngVien;
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}