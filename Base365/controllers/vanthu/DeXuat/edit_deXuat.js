const De_Xuat = require('../../../models/Vanthu/de_xuat');
const setting_dx = require('../../../models/Vanthu/setting_dx');
const His_Handle = require('../../../models/Vanthu/history_handling_dx');
const QuitJob = require('../../../models/hr/personalChange/QuitJob');
const CalendarWorkEmployee = require('../../../models/qlc/CalendarWorkEmployee')
const Cyclecalendar = require('../../../models/qlc/Calendar')
const User = require('../../../models/Users');
const functions = require('../../../services/vanthu')
const axios = require('axios');
//hàm khôi phục 
exports.edit_del_type = async (req, res) => {
    try {
        let id = req.body.id;
        let del_type = req.body.delType;

        let page = Number(req.body.page) ? Number(req.body.page) : 1;
        let pageSize = Number(req.body.pageSize) ? Number(req.body.pageSize) : 10;
        const skip = (page - 1) * pageSize;
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


//ham duyet



exports.edit_active = async (req, res) => {
  try {
    const { _id, type, id_user, ngaybatdau_tv, id_ep, ca_dbdnghi, token,shift_id,ly_do } = req.body;
    const timeNow = new Date();
    let com_id = '';
    if(req.user.data.type == 2){
      com_id = req.user.data.inForPerson.employee.com_id
    }else{
      return  functions.setError(res, 'không có quyền truy cập', 400);
    }
    const check = await De_Xuat.findOne({ _id: _id });
    if (check) {
      // Duyệt đề xuất
      if (type == 1) {
        const maxID = await functions.getMaxID(His_Handle);
        let newID = 0;
        if (maxID) {
          newID = Number(maxID) + 1;
        }
        const createHis = new His_Handle({
          _id: newID,
          id_dx: check._id,
          type_handling: 2,
          time: timeNow
        });
        await createHis.save();
        if (check.kieu_duyet == 0) {
          await De_Xuat.findOneAndUpdate(
            { _id: _id },
            {
              $set: {
                type_duyet: 5,
                time_duyet: timeNow
              }
            },
            { new: true }
          );
         return res.status(200).json({ message: 'Đã duyệt đề xuất' });
        } else {
          const historyDuyet = await His_Handle.find({ id_dx: check._id, type_handling: 2 }).sort({ id_his: 1 });
          const listDuyet = historyDuyet.map((item) => item.id_user).join(',');

          const arrDuyet = listDuyet.split(',');
          const arrDuyet1 = check.id_user_duyet.split(',');
          arrDuyet.sort();
          arrDuyet1.sort();

          if (JSON.stringify(arrDuyet) === JSON.stringify(arrDuyet1)) {
            await De_Xuat.findOneAndUpdate(
              { _id: _id },
              {
                $set: {
                  type_duyet: 5,
                  time_duyet: timeNow
                }
              },
              { new: true }
            );
            return res.status(200).json({ message: 'Đã duyệt đề xuất' });
          } else {
           return res.status(200).json({ message: 'Không thể duyệt đề xuất' });
          }
        }
      } else if (type == 2) {
        // Từ chối đề xuất
        await De_Xuat.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              type_duyet: 3,
              time_duyet: timeNow
            }
          },
          { new: true }
        );

        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_dx: check._id,
          type_handling: 3,
          time: timeNow
        });
        await createHis.save();

        const deXuatInfo = await De_Xuat.findOne({ _id: _id });
        const link = `https://vanthu.timviec365.vn/chi-tiet-dx/${replaceTitle(deXuatInfo.name_dx)}-dx${_id}.html`;

        const notificationData = {
          EmployeeId: deXuatInfo.id_user,
          SenderId: id_ep,
          CompanyId: deXuatInfo.com_id,
          Message: deXuatInfo.name_dx,
          ListFollower: `[${deXuatInfo.id_user_theo_doi}]`,
          Status: deXuatInfo.name_cate_dx,
          Link: link,
          type: 1
        };

        await axios.post('https://mess.timviec365.vn/Notification/NotificationOfferSent', notificationData);

       return res.status(200).json({ message: 'Từ chối đề xuất thành công' });
      } else if (type == 3) {
        // Bắt buộc đi làm
        await De_Xuat.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              type_duyet: 6,
              time_duyet: timeNow
            }
          },
          { new: true }
        );

        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_dx: check._id,
          type_handling: 6,
          time: timeNow
        });
        await createHis.save();

        return res.status(200).json({ message: 'Bắt buộc đi làm thành công' });
      } else if (type == 4) {
        // Duyệt chuyển tiếp
        const { id_uct } = req.body;
        const user_td = `${check.id_user_theo_doi},${id_uct}`;

        await De_Xuat.findOneAndUpdate(
          { _id: _id },
          { id_user_duyet: id_uct, id_user_theo_doi: user_td },
          { new: true }
        );

        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_dx: check._id,
          type_handling: 2,
          time: timeNow
        });
        await createHis.save();

        return res.status(200).json({ message: 'Chuyển tiếp đề xuất thành công' });
      } // Thôi việc
      else if (type == 5){
        
        await De_Xuat.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              type_duyet: 5,
              time_duyet: timeNow,
              time_start_out: ngaybatdau_tv,
              active: 1
            }
          },
          { new: true }
        );

        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_dx: check._id,
          type_handling: 2,
          time: timeNow
        });
        await createHis.save();
        let ep_id = check.id_user
        let chekUser = await User.findOne({idQLC : ep_id}).select('inForPerson.employee.position_id  inForPerson.employee.dep_id')
        const createQJ = new QuitJob({
          id : await functions.getMaxIDQJ(QuitJob) + 1,
          ep_id : ep_id,
          com_id : com_id,
          current_position : chekUser.inForPerson.employee.position_id ,
          current_dep_id : chekUser.inForPerson.employee.dep_id,
          shift_id : shift_id,
          created_at : ngaybatdau_tv,
          note : ly_do,
        });
        await createQJ.save();
        return res.status(200).json({ message: 'Thôi việc thành công' });
      } else if (type == 6) {
        // Tiếp nhận
        await De_Xuat.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              type_duyet: 7,
              time_tiep_nhan: timeNow
            }
          },
          { new: true }
        );
        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_dx: check._id,
          type_handling: 1,
          time: timeNow
        });
        await createHis.save();

        return res.status(200).json({ message: 'Tiếp nhận đề xuất thành công' });
      } else if (type == 7) {
        // Tăng ca
        const historyDuyet = await De_Xuat.findOne({ _id: _id })
        const nd = historyDuyet.tang_ca;
        const month_apply = new Date(nd.time_tc).getFullYear() + '-' + (new Date(nd.time_tc).getMonth() + 1) + '-01';
        const checkcalaendar = await CalendarWorkEmployee.findOne({
          idQLC : check.id_user
        })

        

        const shift_new = JSON.stringify({ date: nd.time_tc, shift_id: shift_old });
        const arr_cycle = items_tc.replace(JSON.stringify(data_item_tc), shift_new);

        const name = `Lịch làm việc ${historyDuyet.name_user} Tháng ${new Date(nd.time_tc).getFullYear()}-${new Date(nd.time_tc).getMonth() + 1}`;

        const cycleData = {
          cycle_name: name,
          month_apply: month_apply,
          detail_cycle: arr_cycle,
          id_ep: historyDuyet.id_user,
          id_com: historyDuyet.com_id
        };

        const cycleResponse = await axios.post('https://chamcong.24hpay.vn/service/employee_update_cycle.php', cycleData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (cycleResponse.data.data.message !== '') {
          await De_Xuat.findOneAndUpdate(
            { _id: _id },
            {
              $set: {
                active: 1,
                type_duyet: 5,
                time_duyet: timeNow
              }
            },
            { new: true }
          );

          res.status(200).json({ message: `Đề xuất tăng ca đã được thêm vào ${name}` });
        } else {
          res.status(200).json({ message: 'Thông tin truyền lên không đầy đủ, vui lòng thử lại!' });
        }
      }
    } else {
      res.status(404).json({ error: 'Không tìm thấy đề xuất' });
    }
  } catch (error) {
    console.error('Failed ', error);
    res.status(500).json({ error: 'Failed ' });
  }
};

