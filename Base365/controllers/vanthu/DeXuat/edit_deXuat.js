const De_Xuat = require('../../../models/Vanthu/de_xuat');
const setting_dx = require('../../../models/Vanthu/setting_dx');
const his_handle = require('../../../models/Vanthu/history_handling_dx');
const axios = require('axios');
const Users = require('../../../models/Users');
const CrontabQuitJobs = require("../../../models/hr/CrontabQuitJobs");
//hàm khôi phục 
exports.edit_del_type = async (req, res) => {
    try {
        let id = req.body.id;
        console.log(id);
        let del_type = req.body.delType;

        let page = Number(req.body.page) ? Number(req.body.page) : 1;
        let pageSize = Number(req.body.pageSize) ? Number(req.body.pageSize) : 10;
        const skip = (page - 1) * pageSize;

        console.log(del_type);
        if (!isNaN(id)) {
            let de_xuat = await De_Xuat.findOne({ _id: id }).skip(skip).limit(pageSize);

            if (de_xuat) {
                await De_Xuat.findByIdAndUpdate({ _id: id }, {
                    del_type: del_type
                });
                return res.status(200).json('update del_type thanh cong');
            } else {
                return res.status(200).json("doi tuong khong ton tai");
            }
        } else {
            return res.status(404).json("id phai la 1 so Number");
        }
    } catch (error) {
        console.error('Failed ', error);
        res.status(500).json({ error: 'Failed ' });
    }
}

exports.edit_active = async (req, res) => {

    let id_dx = Number(req.body.id_dx);

    let type = req.body.type;


    let ep_id = req.user.data.idQLC;
    let status = 0;
    if (req.user.data.type == 1) {
        status = 1;

    } else if (req.user.data.type == 2) {
        status = 2;
    }



    let link = req.body.link;
    let id_uct = req.body.id_uct || null;
    let ngay_bd_tv = req.body.ngay_bd_tv || null;// kieu Number
    let ca_dbdnghi = req.body.ca_dbdnghi || null;// kieu Number

    try {

        let qr_check = await De_Xuat.findOne({ _id: id_dx });
        let com_id = qr_check.com_id;
        if (qr_check) {
            if (type == 1) {
                //duyet de xuat 
                let maxID_Hishandle = 0;
                let hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } });
                if (hisHandle) {
                    maxID_Hishandle = hisHandle._id;
                }

                let db_history = new his_handle({
                    _id: maxID_Hishandle + 1,
                    id_dx: id_dx,
                    id_user: ep_id,
                    type_handling: 2,
                    time: new Date()
                });
                await db_history.save();

                if (qr_check.kieu_duyet == 0) {

                    let db_duyet = await De_Xuat.findOneAndUpdate({ _id: id_dx }, { type_duyet: 5, time_duyet: new Date().getTime() });
                } else {
                    let qr_list_duyet = await his_handle.find({ id_dx: id_dx, type_handling: 2 });
                    let list_duyet = '';

                    qr_list_duyet.map((item, index) => {


                        if (index == 0) {
                            list_duyet = item.id_user;

                        } else {
                            list_duyet = list_duyet + "," + item.id_user;
                        }
                    });
                    let arr_duyet = list_duyet.split(',');
                    let arr_duyet1 = qr_check.id_user_duyet;
                    arr_duyet1 = arr_duyet1.split(',');
                    arr_duyet.sort();
                    arr_duyet1.sort();

                    if (JSON.stringify(arr_duyet) === JSON.stringify(arr_duyet1)) {
                        let db_duyet = await De_Xuat.findOneAndUpdate({ _id: id_dx }, { type_duyet: 5, time_duyet: new Date().getTime() });
                    }
                    let db_ifdx = await De_Xuat.findOne({ _id: id_dx });
                    const info_dx = {
                        EmployeeId: db_ifdx.id_user,
                        SenderId: ep_id,
                        CompanyId: db_ifdx.com_id,
                        Message: db_ifdx.name_dx,
                        ListFollower: db_ifdx.id_user_theo_doi,
                        Status: db_ifdx.name_cate_dx,
                        Link: link
                    }
                    await axios.post('http://43.239.223.142:9000/api/V2/Notification/NotificationOfferSent', info_dx)
                        .then(() => console.log("call api sucess"))
                        .catch((error) => { console.log("Error: " + error) });

                }
                return res.status(200).json({ data: [], message: ' duyet thanh cong ' });

            } else if (type == 2) {
                //tu choi 
                let db_duyet = await De_Xuat.findOneAndUpdate({ _id: id_dx }, { type_duyet: 3, time_duyet: new Date().getTime() })
                let maxID_Hishandle = 0;
                let hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } });
                if (hisHandle) {
                    maxID_Hishandle = hisHandle._id;
                }

                let db_history = new his_handle({
                    _id: maxID_Hishandle + 1,
                    id_dx: id_dx,
                    id_user: ep_id,
                    type_handling: 3,
                    time: new Date()
                });
                await db_history.save();
                let db_ifdx = await De_Xuat.findOne({ _id: id_dx });
                const info_dx = {
                    EmployeeId: db_ifdx.id_user,
                    SenderId: ep_id,
                    CompanyId: db_ifdx.com_id,
                    Message: db_ifdx.name_dx,
                    ListFollower: `[${db_ifdx.id_user_theo_doi}]`,
                    Status: db_ifdx.name_cate_dx,
                    Link: link,
                    type: 1

                }

                await axios.post('http://43.239.223.142:9000/api/V2/Notification/NotificationOfferSent', info_dx)
                    .then(() => console.log("call api sucess"))
                    .catch((error) => { console.log("Error: " + error) });
                return res.status(200).json({ data: [], message: ' tu choi  thanh cong ' });
            } else if (type == 3) {
                // bắt buộc đi làm

                let db_duyet = await De_Xuat.findOneAndUpdate({ _id: id_dx }, { type_duyet: 6, time_duyet: new Date().getTime(), })
                return res.status(200).json({ data: [], message: ' ba buoc di lam thanh cong ' });
            } else if (type == 4) {
                // duyệt chuyển tiếp
                if (isNan(id_uct)) {
                    return res.status(404).json({ message: ' id nguoi chuyen tiep phai la 1 so' });
                }
                let user_td = qr_check.id_user_theo_doi + ',' + id_uct;
                let db_duyet = await De_Xuat.findOneAndUpdate({ _id: id_dx }, { id_user_duyet: id_uct, id_user_theo_doi: user_td, });
                let maxID_Hishandle = 0;
                let hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } });
                if (hisHandle) {
                    maxID_Hishandle = hisHandle._id;
                }


                let db_history = await new his_handle({
                    _id: maxID_Hishandle + 1,
                    id_dx: id_dx,
                    id_user: user_td,
                    type_handling: 2,
                    time: new Date()
                });
                await db_history.save();


                return res.status(200).json({ data: [], message: ' duyet chuyen tiep thanh cong ' });
            }
            else if (type == 5) {
                // thoi viec
                if (isNaN(ngay_bd_tv) || isNaN(ca_dbdnghi)) {
                    return res.status(404).json({ message: "ngay bat dau va ca_dbdnghi thoi viec phai la 1 so " });
                }

                let db_duyet = await De_Xuat.findOneAndUpdate({ _id: id_dx }, { type_duyet: 5, time_duyet: new Date().getTime(), time_start_out: ngay_bd_tv, active: 1 });
                let maxID_Hishandle = 0;
                let hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } });
                if (hisHandle) {
                    maxID_Hishandle = hisHandle._id;
                }
                let db_history = new his_handle({
                    _id: maxID_Hishandle + 1,
                    id_dx: id_dx,
                    id_user: ep_id,
                    type_handling: 2,
                    time: new Date()
                });
                await db_history.save();

                let nv = await Users.findOne({ idQLC: qr_check.id_user });
                console.log("nv: " + nv);
                // let data_update = {
                //     epID: qr_check.id_user,
                //     comId: com_id,
                //     currentPosition: nv.inForPerson.employee.position_id,
                //     currentDepId: nv.inForPerson.employee.dep_id,
                //     createdAt: ngay_bd_tv,
                //     shiftId: ca_dbdnghi,
                //     decisionId: 0,
                //     note: '',
                //     type: 2,

                // };

                if (ngay_bd_tv < new Date().getTime()) {
                    // Kết nối api thông báo chat365
                    let db_ifdx = await De_Xuat.findOne({ _id: id_dx });
                    let nv = await Users.findOne({ idQLC: qr_check.id_user });
                    let data = {
                        SenderId: ep_id,
                        Status: status,
                        EmployeeId: db_ifdx.id_user,
                        ListReceive: `[${qr_check.id_user}]`,
                        NewCompanyId: com_id,
                        Message: db_ifdx.name_dx,
                        Position: nv.inForPerson.employee.position_id,
                        Department: nv.inForPerson.employee.dep_id,
                        CreateAt: ngay_bd_tv,
                        type: 'QuitJob',
                        CompanyId: com_id,
                        //  NewCompanyName: nv.userName
                    };
                    await axios.post('https://mess.timviec365.vn/Notification/NotificationPersonnelChange', data)
                        .then(() => console.log("sucess"))
                        .catch((error) => console.log("Error: " + error));

                } else {
                    let checkCron = await CrontabQuitJobs.find({ epID: qr_check.id_user, comId: com_id });
                    if (checkCron.length > 0) {
                        return res.status(200).json({ mesage: "Nhân viên đã được xét chờ nghỉ việc" });
                    } else {
                        let data_update = new CrontabQuitJobs({
                            epID: qr_check.id_user,
                            comId: com_id,
                            currentPosition: nv.inForPerson.employee.position_id,
                            currentDepId: nv.inForPerson.employee.dep_id,
                            createdAt: ngay_bd_tv,
                            shiftId: ca_dbdnghi,
                            decisionId: 0,
                            note: '',
                            type: 2,

                        });
                        // let insert_cron = new CrontabQuitJobs();
                        // insert_cron = data_update;
                        await data_update.save();
                        return res.status(200).json({ data: data_update, message: "Thêm mới nhân viên chờ xét nghỉ việc thành công" })
                    }

                }
                return res.status(200).json({ data: db_duyet, message: "de xuat thoi viec thanh cong " });
            } else if (type == 6) {
                //tiep nhan 
                let db_duyet = await De_Xuat.findOneAndUpdate({ _id: id_dx, }, { type_duyet: 7, time_tiep_nhan: new Date().getTime() });
                let maxID_Hishandle = 0;
                let hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } });
                if (hisHandle) {
                    maxID_Hishandle = hisHandle._id;
                }
                let db_history = new his_handle({
                    _id: maxID_Hishandle + 1,
                    id_dx: id_dx,
                    id_user: ep_id,
                    type_handling: 1,
                    time: new Date()
                });
                await db_history.save();
                return res.status(200).json({ message: 'tiep nhan thanh cong ' });


            } else if (type == 7) {
                console.log(ep_id);

                //tang ca 

                let id_ep = qr_check.id_user;
                let month_apply = qr_check.noi_dung.tang_ca.time_tc.getMonth() + 1;
                if (id_ep != '') {
                    // kiem tra xem nv co ton tai ko
                    let com_exit = await Users.find({ idQLC: id_ep });
                    if (com_exit.length == 0) {

                    }
                }




                return res.status(200).json({ data: [], message: "  de xuat tang ca thanh cong " });
            }
        } else {
            return res.status(200).json({ message: 'khong co du lieu cho de xuat nay' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}