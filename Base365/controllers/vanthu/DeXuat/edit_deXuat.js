const De_Xuat = require('../../../models/Vanthu/de_xuat');
const setting_dx = require('../../../models/Vanthu/setting_dx');
const His_Handle = require('../../../models/Vanthu/history_handling_dx');
const QuitJob = require('../../../models/hr/personalChange/QuitJob');
const CalendarWorkEmployee = require('../../../models/qlc/CalendarWorkEmployee');
const Calendar = require('../../../models/qlc/Cycle')
const ThuongPhat = require('../../../models/Vanthu/tb_thuong_phat');
const HoaHong = require('../../../models/Vanthu/tb_rose')
const User = require('../../../models/Users');
const functions = require('../../../services/vanthu')

const axios = require('axios');



//ham duyet



exports.edit_active = async (req, res) => {
  try {
    const { _id, type, id_user, ngaybatdau_tv, id_ep, shift_id, ly_do } = req.body;
    const timeNow = new Date();
    let com_id = '';
    if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
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
      else if (type == 5) {

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
        let chekUser = await User.findOne({ idQLC: ep_id }).select('inForPerson.employee.position_id  inForPerson.employee.dep_id')
        const createQJ = new QuitJob({
          id: await functions.getMaxIDQJ(QuitJob) + 1,
          ep_id: ep_id,
          com_id: com_id,
          current_position: chekUser.inForPerson.employee.position_id,
          current_dep_id: chekUser.inForPerson.employee.dep_id,
          shift_id: shift_id,
          created_at: ngaybatdau_tv,
          note: ly_do,
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
        const nd = historyDuyet.noi_dung.tang_ca;

        let month_apply = 0;
        if (new Date(nd.time_tc).getMonth() + 1 < 10) {
          month_apply = new Date(nd.time_tc).getFullYear() + '-0' + (new Date(nd.time_tc).getMonth() + 1) + '-01';
        } else {
          month_apply = new Date(nd.time_tc).getFullYear() + '-' + (new Date(nd.time_tc).getMonth() + 1) + '-01';
        }


        const checkcalaendar = await CalendarWorkEmployee.findOne({
          idQLC: historyDuyet.id_user
        }).select('cy_id')


        let checkCalendaremp = await Calendar.findOne({ cy_id: checkcalaendar.cy_id, apply_month: month_apply })

        if (checkCalendaremp) {
          var items_tc = JSON.parse(checkCalendaremp.cy_detail)
        }
        for(let i = 0; i < items_tc.length ; i++){
           if(new Date(nd.time_tc).getTime() == new Date(items_tc[i].date).getTime())
           {
              var data_item_tc = items_tc[i]
           }
        }
        let shift_olds = data_item_tc.shift_id.split(',');
        if(shift_olds.length > 1)
        {
          if(shift_olds.includes(nd.shift_id))
          {
            shift_olds =[...nd.shift_id]
          }
        }
        
        let checkConvert = nd.time_tc
        let timeDate = await functions.covert(checkConvert)
        let shift_new = '{"date" : "' + timeDate + '","shift_id": "' + shift_olds + '"}';
        let covect  = JSON.stringify(items_tc);
        let arrCycle = covect.replace(JSON.stringify(data_item_tc[0]), JSON.stringify(shift_new));
        let name = `Lịch làm việc ${historyDuyet.name_user} Tháng ${new Date(nd.time_tc).toISOString().slice(0, 7)}`;
        const updatedCalendarawait = await Calendar.findOneAndUpdate(
          { cy_id: checkCalendaremp.cy_id },
          {
            $set: {
              com_id: checkCalendaremp.com_id,
              cy_name: name,
              month_apply: month_apply,
              cy_detail : arrCycle,
            }
          },
          { new: true }
        );
        if (updatedCalendarawait) {
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
          return res.status(200).json({ message: `Đề xuất tăng ca đã được duyệt` });
        } else {
          return res.status(200).json({ message: 'Thông tin truyền lên không đầy đủ, vui lòng thử lại!' });
        }
      }//đề xuất thưởng phạt
      else if (type == 19){
        let id_eptp = '';
        const ndtp = check.noi_dung.thuong_phat
        if(ndtp.type == 1) {
          id_eptp = check.id_user;
        }else{
          id_eptp = ndtp.nguoi_tp
        }
         const createTP = new ThuongPhat({
          pay_id: await functions.getMaxIDtp(ThuongPhat) + 1,
          pay_id_user: check.id_user,
          pay_id_com: check.com_id,
          pay_price : ndtp.so_tien_tp,
          pay_status: ndtp.type_tp,
          pay_case : ndtp.ly_do,
          pay_day : ndtp.time_tp
        });
        let savetp = await createTP.save();
        if(createTP){
          await De_Xuat.findOneAndUpdate(
            { _id: _id },
            {
              $set: {
                active: 1,
              }
            },
            { new: true }
          );
        }
        return functions.success(res, 'save data success', { savetp});
      }// //đề xuất hoa hồng
      else if (type == 20){
        let id_ephh  = check.id_user
        const ndhh = check.noi_dung.hoa_hong;
        const createhh = new HoaHong({
          ro_id : await functions.getMaxIDrose(HoaHong) + 1,
          ro_id_user: id_ephh,
          ro_id_com: check.com_id,
          ro_time : ndhh.time_hh,
          ro_time_end: ndhh.item_mdt_date,
          ro_note : ndhh.ly_do,
          ro_time_created : timeNow
        });
        let savehh = await createhh.save();
        if(createhh){
          await De_Xuat.findOneAndUpdate(
            { _id: _id },
            {
              $set: {
                active: 1,
              }
            },
            { new: true }
          );
        }
        return functions.success(res, 'save data success', { savehh});
      }
    } else {
      return res.status(404).json({ error: 'Không tìm thấy đề xuất' });
    }
  } catch (error) {
    console.error('Failed ', error);
    return res.status(500).json({ error: 'Failed ' });
  }
};

