const De_Xuat = require('../../../models/Vanthu/de_xuat');
const setting_dx = require('../../../models/Vanthu/setting_dx');
const His_Handle = require('../../../models/Vanthu/history_handling_dx');
const QuitJob = require('../../../models/hr/personalChange/QuitJob');
const CalendarWorkEmployee = require('../../../models/qlc/CalendarWorkEmployee');
const Calendar = require('../../../models/qlc/Cycle')
const ThuongPhat = require('../../../models/Tinhluong/Tinhluong365ThuongPhat');
const HoaHong = require('../../../models/Tinhluong/TinhluongRose')
const User = require('../../../models/Users');
const functions = require('../../../services/vanthu')

const axios = require('axios');
const vanthu = require('../../../services/vanthu')




//ham duyet
exports.edit_active = async (req, res) => {
  try {
    const { _id, type, ngaybatdau_tv, id_ep,shift_id,ly_do,id_uct } = req.body;
    const timeNow = new Date();
    let com_id = '';
    let id_user = '';
    if (req.user.data.type == 2) {
      com_id = req.user.data.com_id
      id_user = req.user.data.idQLC
    } else {
      return functions.setError(res, 'bạn phải là tài khoản nhân viên', 400);
    }
    const check = await De_Xuat.findOne({ _id: _id });
    if (check) {
      const userDuyet = check.id_user_duyet;
      // Duyệt đề xuất
      if (type == 1) {
       return vanthu.browseProposals(res,His_Handle,De_Xuat,_id,check,id_user,userDuyet);
      }
      // Từ chối đề xuất 
      if (type == 2) {
        return vanthu.refuseProposal(res,His_Handle,De_Xuat,_id,id_ep,check,id_user)
      } 
      // Bắt buộc đi làm
      if (type == 3) {
        return vanthu.compulsoryWork(res,His_Handle,De_Xuat,_id,check,id_user);
      }
      // Duyệt chuyển tiếp
      if (type == 4) {
        return vanthu.forwardBrowsing(res,His_Handle,De_Xuat,_id,id_uct,check,id_user)
      }   
      // Tiếp nhận
      else if (type == 6) {
        let id_user_duyet = [];
        let history = [];
        if(userDuyet) {
            id_user_duyet = userDuyet.split(',').map(Number);
            for(var i =0; i < id_user_duyet.length; i++) {
                id = id_user_duyet[i];
                const his = await His_Handle.findOne({id_user: id,id_dx: _id}).sort({time:-1})
                history.push({id: id, history: his?.type_handling});
            }
        }
        if (check.kieu_duyet == 0){
          if (history.length > 0){
            // Nếu có bất cứ một người duyệt nào đã duyệt
            if(history.some(his => his.history === 2)){
              await De_Xuat.findOneAndUpdate(
                { _id: _id },
                {
                  $set: {
                    type_duyet: 10,
                    time_tiep_nhan: timeNow
                  }
                },
                { new: true }
              );
              const createHis = new His_Handle({
                _id: await functions.getMaxID(His_Handle) + 1,
                id_user:id_user,
                id_dx: check._id,
                type_handling: 1,
                time: timeNow
              });
              await createHis.save();
              return functions.success(res, 'Chờ lãnh đạo còn lại duyệt');
            }
            // Nếu chưa có một người duyệt nào đã duyệt
            else{
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
                id_user:id_user,
                id_dx: check._id,
                type_handling: 1,
                time: timeNow
              });
              await createHis.save();
              return functions.success(res, 'Đã tiếp nhận đề xuất');
            }
          }
        }
      } 
      // Thôi việc
      if (type == 5){    
        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_user: id_user,
          id_dx: check._id,
          type_handling: 2,
          time: timeNow
        });
        await createHis.save();
        let id_user_duyet = [];
        let history = [];
        if(userDuyet) {
            id_user_duyet = userDuyet.split(',').map(Number);
            for(var i =0; i < id_user_duyet.length; i++) {
                id = id_user_duyet[i];
                const his = await His_Handle.findOne({id_user: id,id_dx: _id}).sort({time:-1})
                history.push({id: id, history: his?.type_handling});
            }
        }
        if (check.kieu_duyet == 0) {
          if (history.length > 0){
              // Nếu tất cả người duyệt đều đã duyệt
              if(history.every(his => his.history === 2)){
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
                let ep_id = check.id_user
                let maxIDTQJ = await functions.getMaxIDQJ(QuitJob)
                    let idTB = 0;
                    if (maxIDTQJ) {
                        idTB = Number(maxIDTQJ) + 1;
                    }
                const createQJ = new QuitJob({
                  id : idTB,
                  ep_id: ep_id,
                  com_id: com_id,
                  created_at: ngaybatdau_tv,
                  note: ly_do,
                });
                await createQJ.save();
                return functions.success(res, 'Thôi việc thành công');
              }
              // Nếu có bất cứ một người nào chưa duyệt
              else{
                  await De_Xuat.findOneAndUpdate(
                      { _id: _id },
                      {
                          $set: {
                              type_duyet: 10,
                              time_duyet: timeNow
                          }
                      },
                      { new: true }
                  );
                  res.status(200).json({ message: 'Chờ lãnh đạo còn lại duyệt' });
              }
          }
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
              return res.status(200).json({ message: 'Không thể duyệt đề xuất' });
          }
        }
      } 
      // Tăng ca
      else if (type == 7) {
        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_user : id_user,
          id_dx: check._id,
          type_handling: 2,
          time: timeNow
        });
        await createHis.save();
        const historyDuyet = await De_Xuat.findOne({ _id: _id })
        const nd = historyDuyet.noi_dung.tang_ca;

        let id_user_duyet = [];
        let history = [];
        if(userDuyet) {
            id_user_duyet = userDuyet.split(',').map(Number);
            for(var i =0; i < id_user_duyet.length; i++) {
                id = id_user_duyet[i];
                const his = await His_Handle.findOne({id_user: id,id_dx: _id}).sort({time:-1})
                history.push({id: id, history: his?.type_handling});
            }
        }
        if (check.kieu_duyet == 0) {
            if (history.length > 0){
                // Nếu tất cả người duyệt đều đã duyệt
                if(history.every(his => his.history === 2)){
                  let month_apply = 0;
                  if (new Date(nd.time_tc).getMonth() + 1 < 10) {
                    month_apply = new Date(nd.time_tc).getFullYear() + '-0' + (new Date(nd.time_tc).getMonth() + 1) + '-01';
                  } else {
                    month_apply = new Date(nd.time_tc).getFullYear() + '-' + (new Date(nd.time_tc).getMonth() + 1) + '-01';
                  }
                  const checkcalaendar = await CalendarWorkEmployee.findOne({
                    idQLC: historyDuyet.id_user
                  }).select('cy_id')
                  let checkCalendaremp = await Calendar.findOne({ 
                    cy_id: checkcalaendar.cy_id,
                     apply_month: month_apply })
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
                    return functions.success(res, 'Đề xuất tăng ca đã được duyệt');
                  } else {
                    return functions.setError(res,'Thông tin truyền lên không đầy đủ, vui lòng thử lại!',400)
                  }
                }
                // Nếu có bất cứ một người nào chưa duyệt
                else{
                    await De_Xuat.findOneAndUpdate(
                        { _id: _id },
                        {
                            $set: {
                                type_duyet: 10,
                                time_duyet: timeNow
                            }
                        },
                        { new: true }
                    );
                    res.status(200).json({ message: 'Chờ lãnh đạo còn lại duyệt' });
                }
            }
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
                return res.status(200).json({ message: 'Không thể duyệt đề xuất' });
            }
        }
      }
      // Thưởng phạt
      else if (type == 19){
        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_user:id_user,
          id_dx: check._id,
          type_handling: 2,
          time: timeNow
        });
        await createHis.save();
        let id_user_duyet = [];
        let history = [];
        if(userDuyet) {
            id_user_duyet = userDuyet.split(',').map(Number);
            for(var i =0; i < id_user_duyet.length; i++) {
                id = id_user_duyet[i];
                const his = await His_Handle.findOne({id_user: id,id_dx: _id}).sort({time:-1})
                history.push({id: id, history: his?.type_handling});
            }
        }
        if (check.kieu_duyet == 0) {
            if (history.length > 0){
                // Nếu tất cả người duyệt đều đã duyệt
                if(history.every(his => his.history === 2)){
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
                          type_duyet: 5,
                          time_duyet: timeNow,
                        }
                      },
                      { new: true }
                    );
                  }
                  return functions.success(res, 'duyệt đề xuất thành công', { savetp});
                }
                // Nếu có bất cứ một người nào chưa duyệt
                else{
                    await De_Xuat.findOneAndUpdate(
                        { _id: _id },
                        {
                            $set: {
                                type_duyet: 10,
                                time_duyet: timeNow
                            }
                        },
                        { new: true }
                    );
                    res.status(200).json({ message: 'Chờ lãnh đạo còn lại duyệt' });
                }
            }
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
                return res.status(200).json({ message: 'Không thể duyệt đề xuất' });
            }
        }
      }
      // Hoa hồng
      else if (type == 20){
        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_user:id_user,
          id_dx: check._id,
          type_handling: 2,
          time: timeNow
        });
        await createHis.save();
        let id_user_duyet = [];
        let history = [];
        if(userDuyet) {
            id_user_duyet = userDuyet.split(',').map(Number);
            for(var i =0; i < id_user_duyet.length; i++) {
                id = id_user_duyet[i];
                const his = await His_Handle.findOne({id_user: id,id_dx: _id}).sort({time:-1})
                history.push({id: id, history: his?.type_handling});
            }
        }
        if (check.kieu_duyet == 0) {
            if (history.length > 0){
                // Nếu tất cả người duyệt đều đã duyệt
                if(history.every(his => his.history === 2)){
                  let id_ephh  = check.id_user
                  const ndhh = check.noi_dung.hoa_hong;
                  let maxID = await functions.getMaxIDrose(HoaHong)
                  if(!maxID){
                    maxID = 0
                  }
                  const createhh = new HoaHong({
                    ro_id : maxID + 1,
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
                          type_duyet: 5,
                          time_duyet: timeNow,
                        }
                      },
                      { new: true }
                    );
                  }
                  return functions.success(res, 'duyệt đề xuất thành công', { savehh});
                }
                // Nếu có bất cứ một người nào chưa duyệt
                else{
                    await De_Xuat.findOneAndUpdate(
                        { _id: _id },
                        {
                            $set: {
                                type_duyet: 10,
                                time_duyet: timeNow
                            }
                        },
                        { new: true }
                    );
                    res.status(200).json({ message: 'Chờ lãnh đạo còn lại duyệt' });
                }
            }
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
                return res.status(200).json({ message: 'Không thể duyệt đề xuất' });
            }
        }
      }
    } else {
      return functions.setError(res, 'Không tìm thấy đề xuất',400);
    }
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};

// duyet de xuat tam ung 
exports.duyet_de_xuat_tam_ung = async (req, res) => {
  try {
    const { _id, id_user_duyet, id_user_theo_doi } = req.body;
    const timeNow = new Date().getTime()/1000;
    // thêm đoạn check phân quyền. 
    const idQLC = req.user.data.idQLC;
    if(idQLC == id_user_duyet){
      const check = await De_Xuat.findOne({ _id: _id }).lean();
      if (check) {
        // set type_duyet = 5
        await De_Xuat.updateOne({ _id: _id },{$set:{
          type_duyet:5,
          id_user_duyet:id_user_duyet,
          id_user_theo_doi:id_user_theo_doi,
          time_duyet:timeNow
        }});
        return res.status(200).json({ 
          message: 'Đã duyệt đề xuất',
          data:await De_Xuat.findOne({ _id: _id }).lean()
        });
      } else {
        return functions.setError(res, 'Không tìm thấy đề xuất',400);
      }
    }
    else{
      return functions.setError(res, 'Người dùng không hợp lệ',400);
    }
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};

