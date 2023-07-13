const De_Xuat = require('../../../models/Vanthu/de_xuat');
const setting_dx = require('../../../models/Vanthu/setting_dx');
const His_Handle = require('../../../models/Vanthu/history_handling_dx');
const QuitJobNew = require('../../../models/hr/personalChange/QuitJobNew')
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
    const { _id, type, id_user, ngay_bd_tv, id_ep, ca_dbdnghi, token } = req.body;
    const timeNow = new Date();

    const check = await De_Xuat.findOne({ _id: _id });
    if (check) {
      if (type == 1) {
        // Duyệt đề xuất
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
          res.status(200).json({ message: 'Đã duyệt đề xuất' });
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
            res.status(200).json({ message: 'Đã duyệt đề xuất' });
          } else {
            res.status(200).json({ message: 'Không thể duyệt đề xuất' });
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

        res.status(200).json({ message: 'Từ chối đề xuất thành công' });
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

        res.status(200).json({ message: 'Bắt buộc đi làm thành công' });
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

        res.status(200).json({ message: 'Chuyển tiếp đề xuất thành công' });
      } else if (type == 5) {
        // Thôi việc
        await De_Xuat.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              type_duyet: 5,
              time_duyet: timeNow,
              time_start_out: ngay_bd_tv,
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

        const data = {
          token: token,
          ep_id: check.id_user,
          time_start: ngay_bd_tv,
          shift_id: ca_dbdnghi
        };

        await axios.post('https://phanmemnhansu.timviec365.vn/quitJob', data);

        res.status(200).json({ message: 'Thôi việc thành công' });
      } else if (type == 6) {
        // Tiếp nhận
        const { ep_id } = req.body;

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

        res.status(200).json({ message: 'Tiếp nhận đề xuất thành công' });
      } else if (type == 7) {
        // Tăng ca
        const historyDuyet = await De_Xuat.findOne({ _id: _id }).populate('id_user');
        const nd = JSON.parse(historyDuyet.noi_dung);
        const month_apply = new Date(nd.time_tc).getFullYear() + '-' + (new Date(nd.time_tc).getMonth() + 1) + '-01';

        const response = await axios.get(`https://chamcong.24hpay.vn/service/detail_cycle.php?id_ep=${historyDuyet.id_user}&month_apply=${month_apply}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const item_tcs = response.data.data.item.cy_detail;
        const items_tc = JSON.stringify(item_tcs);

        const data_item_tc = item_tcs.find((item) => item.date === nd.time_tc);

        let shift_old = '';
        if (data_item_tc) {
          const shift_olds = data_item_tc.shift_id.split(',');
          if (!shift_olds.includes(nd.ca_tang)) {
            shift_olds.push(nd.ca_tang);
          }
          shift_old = shift_olds.join(',');
        } else {
          shift_old = nd.ca_tang;
        }

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

