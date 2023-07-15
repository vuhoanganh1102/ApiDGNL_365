const De_Xuat = require('../../../models/Vanthu/de_xuat');
const setting_dx = require('../../../models/Vanthu/setting_dx');
const His_Handle = require('../../../models/Vanthu/history_handling_dx');
const QuitJob = require('../../../models/hr/personalChange/QuitJob');
const User = require('../../../models/Users')
const axios = require('axios');
const vanthu = require('../../../services/vanthu')
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
    const { _id, type, id_user, ngaybatdau_tv, id_ep, ca_dbdnghi, token,shift_id,ly_do,id_uct } = req.body;
    const timeNow = new Date();
    let com_id = '';
    if(req.user.data.type == 2){
      com_id = req.user.data.inForPerson.employee.com_id
    }else{
      return functions.setError(res, 'không có quyền truy cập', 400);
    }                 
    const check = await De_Xuat.findOne({ _id: _id });
    if (check) {
      // Duyệt đề xuất
      if (type == 1) {
       return vanthu.browseProposals(His_Handle,De_Xuat,_id,check)
      }
      // Từ chối đề xuất 
      if (type == 2) {
        return vanthu.refuseProposal(His_Handle,De_Xuat,_id,id_ep,check)
      } 
      // Bắt buộc đi làm
      if (type == 3) {
        return vanthu.compulsoryWork(His_Handle,De_Xuat,_id,check)
      }
      // Duyệt chuyển tiếp
      if (type == 4) {
        return vanthu.forwardBrowsing(His_Handle,De_Xuat,_id,id_uct,check)
      } 
      
      // Thôi việc
      if (type == 5){
        
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
          id : await functions.getMaxID(QuitJobNew) + 1,
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

