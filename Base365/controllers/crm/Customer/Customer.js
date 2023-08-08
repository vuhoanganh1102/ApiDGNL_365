
const CustomerContact = require('../../../models/crm/Customer/contact_customer')
const Customer = require('../../../models/crm/Customer/customer')
const functions = require("../../../services/functions");
const customerService = require('../../../services/CRM/CRMservice')
const User = require('../../../models/Users')
const ConnectApi = require('../../../models/crm/connnect_api_config')
const HistoryEditCustomer = require('../../../models/crm/history/history_edit_customer')
const ShareCustomer = require('../../../models/crm/tbl_share_customer')
const NhomKH = require('../../../models/crm/Customer/customer_group')

// hàm thêm mới khách hang
exports.addCustomer = async (req, res) => {
  try {
    let {
      email, name, stand_name, phone_number, cit_id, district_id, ward, address, ship_invoice_address,
      cmnd_ccnd_number,
      cmnd_ccnd_address,
      cmnd_ccnd_time,
      user_handing_over_work,
      resoure,
      description,
      tax_code,
      group_id,
      status,
      business_areas,
      category,
      business_type,
      classify,
      bill_city,
      bil_district,
      bill_ward,
      bill_address,
      bill_area_code,
      bill_invoice_address,
      bill_invoice_address_email,
      ship_city,
      ship_area,
      bank_id,
      bank_account,
      revenue,
      size,
      rank,
      website,
      number_of_day_owed,
      gender,
      deb_limit,
      share_all,
      is_input,
      is_delete,
      id_cus_from,
      cus_from,
      link,
      content
    } = req.body;
    let type = req.body
    let comId = '';
    let empId = '';
    let logo = req.files.logo;
    let createDate = new Date();
    let linkDL = '';
    if (!type || ![1, 2].includes(type)) {
      type = 2;
    }
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      comId = req.user.data.com_id;
      empId = req.user.data.idQLC
      if (logo) {
        const imageValidationResult = await customerService.validateImage(logo);
        if (imageValidationResult === true) {
          await customerService.uploadFileCRM(cus_id, logo);
          linkDL = customerService.createLinkFileCRM(cus_id, logo.name);
        }
      }
      const validationResult = customerService.validateCustomerInput(name, comId);
      if (validationResult === true) {
        let maxID = await customerService.getMaxIDCRM(Customer);
        let cus_id = 0;
        if (maxID) {
          cus_id = Number(maxID) + 1;
        }
        if (type == 2) {
          // với yêu cầu là khach hàng cá nhân
          let createCustomer = new Customer({
            cus_id: cus_id,
            email: email,
            name: name,
            stand_name: stand_name,
            phone_number: phone_number,
            cit_id: cit_id,
            logo: linkDL,
            district_id: district_id,
            ward: ward,
            address: address,
            ship_invoice_address: ship_invoice_address,
            cmnd_ccnd_number: cmnd_ccnd_number,
            cmnd_ccnd_address: cmnd_ccnd_address,
            cmnd_ccnd_time: cmnd_ccnd_time,
            resoure: resoure,
            description: description,
            tax_code: tax_code,
            group_id: group_id,
            status: status,
            business_areas: business_areas,
            category: category,
            business_type: business_type,
            classify: classify,
            bill_city: bill_city,
            bil_district: bil_district,
            bill_ward: bill_ward,
            bill_address: bill_address,
            bill_area_code: bill_area_code,
            bill_invoice_address: bill_invoice_address,
            bill_invoice_address_email: bill_invoice_address_email,
            company_id: comId,
            user_create_id: empId,
            ship_city: ship_city,
            ship_area: ship_area,
            bank_id: bank_id,
            bank_account: bank_account,
            revenue: revenue,
            rank: rank,
            website: website,
            number_of_day_owed: number_of_day_owed,
            gender: gender,
            deb_limit: deb_limit,
            share_all: share_all,
            type: type,
            is_input: is_input,
            is_delete: is_delete,
            created_at: createDate,
            id_cus_from: id_cus_from,
            cus_from: cus_from,
            link: link
          });
          let saveCS = await createCustomer.save();
          if (typeof content === 'undefined' && content.trim() !== '') {
            return functions.success(res, 'get data success', { saveCS });
          } else {
            let maxID = await customerService.getMaxIDConnectApi(HistoryEditCustomer);
            let id = 0;
            if (maxID) {
              id = Number(maxID) + 1;
            }
            let newHT = new HistoryEditCustomer({
              id: id,
              customer_id: cus_id,
              content: content,
              created_at: createHtime

            })
            let savehis = await newHT.save();
            return functions.success(res, 'get data success', { saveCS, savehis });
          }
        }
        if (type == 1) {
          // với yêu cầu là khach hàng doanh nghiệp
          let createCustomer = new Customer({
            cus_id: cus_id,
            email: email,
            name: name,
            stand_name: stand_name,
            phone_number: phone_number,
            cit_id: cit_id,
            logo: linkDL,
            district_id: district_id,
            ward: ward,
            address: address,
            ship_invoice_address: ship_invoice_address,
            resoure: resoure,
            description: description,
            tax_code: tax_code,
            group_id: group_id,
            status: status,
            business_areas: business_areas,
            category: category,
            business_type: business_type,
            classify: classify,
            bill_city: bill_city,
            bil_district: bil_district,
            bill_ward: bill_ward,
            bill_address: bill_address,
            bill_area_code: bill_area_code,
            bill_invoice_address: bill_invoice_address,
            bill_invoice_address_email: bill_invoice_address_email,
            company_id: comId,
            user_create_id: empId,
            ship_city: ship_city,
            ship_area: ship_area,
            bank_id: bank_id,
            bank_account: bank_account,
            revenue: revenue,
            size: size,
            user_handing_over_work,
            rank: rank,
            website: website,
            number_of_day_owed: number_of_day_owed,
            deb_limit: deb_limit,
            share_all: share_all,
            type: type,
            is_input: is_input,
            is_delete: is_delete,
            created_at: createDate,
            id_cus_from: id_cus_from,
            cus_from: cus_from,
            link: link
          });
          let saveCS = await createCustomer.save();
          if (typeof content === 'undefined' && content.trim() !== '') {
            return functions.success(res, 'get data success', { saveCS });
          } else {
            let maxID = await customerService.getMaxIDConnectApi(HistoryEditCustomer);
            let id = 0;
            if (maxID) {
              id = Number(maxID) + 1;
            }
            let newHT = new HistoryEditCustomer({
              id: id,
              customer_id: cus_id,
              content: content,
              created_at: createHtime

            })
            let savehis = await newHT.save();
            return functions.success(res, 'get data success', { saveCS, savehis });
          }
        }
        else {
          res.status(400).json({ message: 'khong hop le' })
        }
      }
    } else {
      return functions.setError(res, 'bạn không có quyền', 400)
    }

  } catch (error) {
    return functions.setError(res, error)
  }
};

exports.showKH = async (req, res) => {
  try {
    let { page, perPage } = req.body;

    if (req.user.data.type !== 1) {
      return functions.setError(res, 'Không có quyền truy cập', 400);
    }

    const com_id = req.user.data.com_id;
    const matchQuery = {
      company_id: com_id,
      is_delete: 0
    };

    page = parseInt(page) || 1;
    perPage = parseInt(perPage) || 10;
    const startIndex = (page - 1) * perPage;

    let pipeline = [
      {
        $match: matchQuery,
      },
      { $sort: { cus_id: -1 } }, // Sắp xếp kết quả theo cus_id giảm dần
      {
        $lookup: {
          from: 'CRM_customer_group',
          localField: 'group_id',
          foreignField: 'gr_id',
          as: 'ten_nhom',
        },
      },
      {
        $lookup: {
          from: 'Users',
          let: {
            user_create_id: '$user_create_id',
            emp_id: '$emp_id',
            user_handing_over_work: '$user_handing_over_work',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$idQLC', '$$user_create_id'] },
                    { $ne: ['$type', 0] },
                  ],
                },
              },
            },
          ],
          as: 'nguoi_tao',
        },
      },
      {
        $lookup: {
          from: 'Users',
          let: {
            emp_id: '$emp_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$idQLC', '$$emp_id'] },
                    { $ne: ['$type', 0] },
                  ],
                },
              },
            },
          ],
          as: 'nguoi_phu_trach',
        },
      },
      {
        $lookup: {
          from: 'Users',
          let: {
            user_handing_over_work: '$user_handing_over_work',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$user_handing_over_work'] },
                    { $ne: ['$type', 0] },
                  ],
                },
              },
            },
          ],
          as: 'nguoi_ban_giao',
        },
      },
      {
        $group: {
          _id: '$cus_id',
          ma_kh: { $first: '$cus_id' },
          ten_khach_hang: { $first: '$name' },
          dien_thoai: { $first: '$phone_number' },
          email: { $first: '$email' },
          nhom_khach_hang: { $first: '$ten_nhom.gr_name' },
          nguoi_tao: { $first: '$nguoi_tao.userName' },
          nguoi_phu_trach: { $first: '$nguoi_phu_trach.userName' },
          nguoi_ban_giao: { $first: '$nguoi_ban_giao.userName' },
        },
      },
    ];

    // Phân trang
    pipeline.push(
      { $skip: startIndex },
      { $limit: perPage }
    );

    let listKh = await Customer.aggregate(pipeline);

    const totalTsCount = await Customer.countDocuments(matchQuery);
    const totalPages = Math.ceil(totalTsCount / perPage);
    const hasNextPage = startIndex + perPage < totalTsCount;

    return functions.success(res, 'Lấy dữ liệu thành công', { listKh, totalTsCount, totalPages, hasNextPage });
  } catch (e) {
    console.log(e);
    return functions.setError(res, e.message);
  }
};




// exports.showKH = async (req, res) => {
//   try {
//     let { page, perPage,name, phone_number, status, resoure, user_edit_id, time_s, time_e, group_id, group_pins_id } = req.body
//     if (req.user.data.type == 1 || req.user.data.type == 2) {
//       com_id = req.user.data.com_id;
//       console.log(com_id)
//     } else {
//       return functions.setError(res, 'không có quyền truy cập', 400);
//     }
//     let matchQuery = {
//       company_id : com_id,
//       is_delete : 0
//     };
     
//     // if (name) {
//     //   matchQuery.name = { $regex: name, $options: "i" };
//     // }
//     // if (phone_number) {
//     //   query.phone_number = { $regex: phone_number, $options: "i" };
//     // }
//     // if (status) {
//     //   query.status = status;
//     // }
//     // if (resoure) {
//     //   query.resoure = resoure;
//     // }
//     // if (user_edit_id) {
//     //   query.user_edit_id = user_edit_id;
//     // }
//     // if (group_id) {
//     //   query.group_id = group_id;
//     // }
//     // if (group_pins_id) {
//     //   query.group_pins_id = group_pins_id;
//     // }

//     // // Thêm các điều kiện tìm kiếm theo thuộc tính được gửi qua req.body
//     // Object.keys(req.body).forEach(key => {
//     //   if (req.body[key] && !['page', 'userId', 'name', 'phone_number', 'status', 'resoure', 'user_edit_id', 'time_s', 'time_e', 'group_id', 'group_pins_id'].includes(key)) {
//     //     query[key] = req.body[key];
//     //   }
//     // });
//     // if (time_s && time_e) {
//     //   if (time_s > time_e) {
//     //     return functions.setError(res, 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc.', 400);
//     //   }
//     //   query.created_at = { $gte: time_s, $lte: time_e };
//     // }

//     if (req.user.data.type == 1) {
//       // trường hợp là công ty
//       com_id = req.user.data.com_id
//       page = parseInt(page) || 1; // Trang hiện tại (mặc định là trang 1)
//       perPage = parseInt(perPage) || 10; // Số lượng bản ghi trên mỗi trang (mặc định là 10)
//        const startIndex = (page - 1) * perPage;
//     const endIndex = page * perPage;

//       let listKh = await Customer.aggregate([
//         {
//           $match: matchQuery,
//         },
//         { $sort: { cus_id: -1 } },
//         {
//           $lookup: {
//             from: 'CRM_customer_group',
//             localField: 'group_id',
//             foreignField: 'gr_id',
//             as: 'ten_nhom',
//           },
//         },
//         {
//           $lookup: {
//             from: 'Users',
//             localField: 'user_create_id',
//             foreignField: 'idQLC',
//             as: 'nguoi_tao',
//           },
//         },
//         {
//           $lookup: {
//             from: 'Users',
//             localField: 'emp_id',
//             foreignField: 'idQLC',
//             as: 'nguoi_phu_trach',
//           },
//         },
//         {
//           $lookup: {
//             from: 'Users',
//             localField: 'user_handing_over_work',
//             foreignField: 'idQLC',
//             as: 'nguoi_ban_giao',
//           },
//         },
//         {
//           $unwind: '$nguoi_tao',
//         },
//         {
//           $unwind: '$nguoi_phu_trach',
//         },
//         {
//           $unwind: '$nguoi_ban_giao',
//         },
//         {
//           $match: {
//             $and: [
//               { 'nguoi_tao.type': { $ne: 0 } },
//               { 'nguoi_phu_trach.type': { $ne: 0 } },
//               { 'nguoi_ban_giao.type': { $ne: 0 } },
//             ],
//           },
//         },
//         {
//           $skip: startIndex, // Bỏ qua kết quả trước startIndex
//         },
//         {
//           $limit: perPage, // Giới hạn số lượng kết quả trả về
//         },
//         {
//           $group: {
//             _id: '$cus_id',
//             ma_kh: { $first: '$cus_id' },
//             ten_khach_hang: { $first: '$name' },
//             dien_thoai: { $first: '$phone_number' },
//             email: { $first: '$email' },
//             nhom_khach_hang: { $first: '$ten_nhom.gr_name' },
//             nguoi_tao :{ $first: '$nguoi_tao.userName'},
//             nguoi_phu_trach : { $first: '$nguoi_phu_trach.userName'},
//             nguoi_ban_giao : { $first: '$nguoi_ban_giao.userName'},
//           },
//         },
//       ]);
//       const totalTsCount = await Customer.countDocuments(matchQuery);

//       // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
//       const totalPages = Math.ceil(totalTsCount / perPage);
//       const hasNextPage = endIndex < totalTsCount;
//       return functions.success(res, 'get data success', { listKh,totalTsCount });
//     }
//     // if (req.user.data.type == 2) {
//     //   // trường hợp là nhân viên
//     //   let userId = req.user.data.idQLC
//     //   const checkUser = await User.findOne({ idQLC: userId });
//     //   if ([1, 2, 9, 3].includes(checkUser.inForPerson.employee.position_id))
//     //   //( là sinh viên thực tập,nhân viên thử việc,nhân viên part time, nhân viên chính thức)
//     //   {
//     //     let id_dataNhanvien = checkUser.idQLC;
//     //     const shareCusNV = await ShareCustomer.find({ receiver_id: id_dataNhanvien });
//     //     const customerIds = shareCusNV.map(item => item.customer_id);
//     //     const checkCus = await Customer.find({
//     //       $or: [
//     //         { emp_id: id_dataNhanvien },
//     //         { cus_id: { $in: customerIds } }
//     //       ],
//     //       ...query // Kết hợp với các điều kiện tìm kiếm khác
//     //     })
//     //     .select('cus_id name phone_number email group_id status description resoure user_create_id emp_id user_handing_over_work updated_at')
//     //     let checkgroup = await NhomKH.find({ gr_id: { $in: showCty.group_id, company_id: com_id } }).select('gr_name')
//     //     if (!checkgroup) {
//     //       checkgroup = ''
//     //     }
//     //     let chekUser1 = await User.find({ idQLC: { $in: checkCus.user_create_id } }).select('userName')
//     //     if (!chekUser1) {
//     //       chekUser1 = ''
//     //     }
//     //     let checkUser2 = await User.find({ idQLC: { $in: checkCus.emp_id } }).select('userName')
//     //     if (!checkUser2) {
//     //       checkUser2 = ''
//     //     }
//     //     let checkUser3 = await User.find({ idQLC: { $in: checkCus.user_handing_over_work } }).select('userName')
//     //     if (!checkUser3) {
//     //       checkUser3 = ''
//     //     }
//     //   }
 
//     //   if ([7,8,14,16,22,21,18,19,17].includes(checkUser.inForPerson.employee.position_id))
//     //   // (phó giám đốc,giám đốc,phó tổng giám đốc,tổng giám đốc,phó tổng giám đốc tập đoàn,
//     //     // tổng giám đốc tập đoàn, phó chủ tịch hội đồng quản trị, chủ tịch hội đồng quản trị,
//     //     // thành viên hội đồng quản trị)
//     //   {
//     //     let id_com = checkUser.inForPerson.employee.com_id;
//     //     const checkCus = await Customer.find({ company_id: id_com, ...query })
//     //       .select('cus_id name phone_number email group_id status description resoure user_create_id emp_id user_handing_over_work updated_at')
//     //       .skip(startIndex)
//     //       .limit(perPage)
//     //     let checkgroup = await NhomKH.find({ gr_id: { $in: showCty.group_id, company_id: com_id } }).select('gr_name')
//     //     if (!checkgroup) {
//     //       checkgroup = ''
//     //     }
//     //     let chekUser1 = await User.find({ idQLC: { $in: checkCus.user_create_id } }).select('userName')
//     //     if (!chekUser1) {
//     //       chekUser1 = ''
//     //     }
//     //     let checkUser2 = await User.find({ idQLC: { $in: checkCus.emp_id } }).select('userName')
//     //     if (!checkUser2) {
//     //       checkUser2 = ''
//     //     }
//     //     let checkUser3 = await User.find({ idQLC: { $in: checkCus.user_handing_over_work } }).select('userName')
//     //     if (!checkUser3) {
//     //       checkUser3 = ''
//     //     }
//     //   }

//     //   if ([20,4,12,13,11.10,5,6].includes(checkUser.inForPerson.employee.position_id))
//     //   //(Nhóm phó, trưởng nhóm,phó tổ trưởng, tổ trưởng,phó ban dự án,trưởng ban dự án
//     // // Phó trưởng phòng,trường phòng)
//     //   {
//     //     let id_com = checkUser.inForPerson.employee.com_id;
//     //     let id_dataNhanvien = checkUser.idQLC;
//     //     let id_pb = checkUser.inForPerson.employee.dep_id;
//     //     const shareCusNV = await ShareCustomer.find({ receiver_id: id_dataNhanvien, dep_id: id_pb });
//     //     const customerIds = shareCusNV.map(item => item.customer_id);
//     //     let checkCB = await User.find({
//     //       "inForPerson.employee.dep_id": id_pb,
//     //       "inForPerson.employee.com_id": id_com,
//     //     })
//     //     .select("idQLC")
//     //     .skip(startIndex)
//     //     .limit(perPage)
//     //     const shareCb = checkCB.map(item => item.idQLC);
//     //     const checkCus = await Customer.find({
//     //       $or: [{ emp_id: { $in: shareCb } }, { cus_id: { $in: customerIds } }],
//     //       ...query // Kết hợp với các điều kiện tìm kiếm khác
//     //     })
//     //     let checkgroup = await NhomKH.find({ gr_id: { $in: showCty.group_id, company_id: com_id } }).select('gr_name')
//     //     if (!checkgroup) {
//     //       checkgroup = ''
//     //     }
//     //     let chekUser1 = await User.find({ idQLC: { $in: checkCus.user_create_id } }).select('userName')
//     //     if (!chekUser1) {
//     //       chekUser1 = ''
//     //     }
//     //     let checkUser2 = await User.find({ idQLC: { $in: checkCus.emp_id } }).select('userName')
//     //     if (!checkUser2) {
//     //       checkUser2 = ''
//     //     }
//     //     let checkUser3 = await User.find({ idQLC: { $in: checkCus.user_handing_over_work } }).select('userName')
//     //     if (!checkUser3) {
//     //       checkUser3 = ''
//     //     }
        
//     //   }
//     //   const totalRecords = await Customer.countDocuments(query);
//     //   let data = {
//     //     ma_kh: showCty.cus_id,
//     //     ten_khach_hang: showCty.name,
//     //     dien_thoai: showCty.phone_number,
//     //     email: showCty.email,
//     //     nhom_khach_hang: checkgroup.gr_name,
//     //     tinh_trang_khach_hang: showCty.status,
//     //     mo_ta: showCty.description,
//     //     nguon_khach_hang: showCty.resoure,
//     //     nhan_vien_tao: chekUser1.userName,
//     //     nhan_vien_phu_trach: checkUser2.userName,
//     //     nhan_vien_ban_giao: checkUser3.userName,
//     //     ngay_cap_nhat: showCty.updated_at
//     //   }
//     //   return functions.success(res, 'get data success', { data,totalRecords });
//     // } else {
//     //   return functions.setError(res, 'bạn không có quyền', 400)
//     // }
//   } catch (e) {
//     console.log(e)
//     return functions.setError(res, e.message)
//   }
// };


//Xoa khach hang                            
exports.DeleteKH = async (req, res) => {
  try {
    let { cus_id } = req.body;
    if (!cus_id || !Array.isArray(cus_id) || cus_id.length === 0) {
      return res.status(400).json({ success: false, error: 'Mảng cus_id không được bỏ trống' });
    }
    if (!cus_id.every(Number.isInteger)) {
      return res.status(400).json({ success: false, error: 'Tất cả các giá trị trong mảng cus_id phải là số nguyên' });
    }
    const existingCustomers = await Customer.find({ cus_id: { $in: cus_id } });

    if (existingCustomers.length === 0) {
      return res.status(400).json({ success: false, error: 'Khách hàng không tồn tại' });
    }
    const deleteCustomers = existingCustomers.filter(customer => customer.is_delete === 0);
    if (deleteCustomers.length === 0) {
      return res.status(400).json({ success: false, error: 'Tất cả khách hàng đã bị xóa trước đó' });
    }
    await Customer.updateMany({ cus_id: { $in: cus_id } }, { is_delete: 1 });
    return res.status(200).json({ success: true, message: 'Xóa thành công' });
  } catch (e) {
    console.log(e);
    return functions.setError(res, e.message);
  }
};




// thêm mới Api kết nối
exports.addConnectCs = async (req, res) => {
  try {
    let { appID, webhook } = req.body
    let comId = req.user.data.inForPerson.employee.com_id
    let tokenCn = req.headers["authorization"]
    let userID = req.user.idQLC
    let createDate = new Date();

    if (typeof appID === 'undefined') {
      res.status(400).json({ success: false, error: 'appID không được bỏ trống' });
    }
    if (typeof webhook === 'undefined') {
      res.status(400).json({ success: false, error: 'webhook phải là 1 số' });
    }
    let maxID = await customerService.getMaxIDConnectApi(ConnectApi);
    let id = 0;
    if (maxID) {
      id = Number(maxID) + 1;
    }
    let checkCn = await ConnectApi.findOne({ company_id: comId })
    if (checkCn) {
      res.status(400).json({ success: false, error: "Api kết nối đã có không thể tạo mới" });
    } else {
      if (req.user.data.type == 2) {
        let createApi = await new ConnectApi({
          id: id,
          company_id: comId,
          appID: appID,
          webhook: webhook,
          token: tokenCn,
          user_edit_id: comId,
          user_edit_type: 1,
          stt_conn: 1,
          created_at: createDate
        })
        let saveApi = await createApi.save();
        res.status(200).json(saveApi);
      }
      else if (req.user.data.type == 1) {
        let createApi = await new ConnectApi({
          id: id,
          company_id: comId,
          appID: appID,
          webhook: webhook,
          token: tokenCn,
          user_edit_id: userID,
          user_edit_type: 1,
          stt_conn: 1,
          created_at: createDate
        })
        let saveApi = await createApi.save();
        res.status(200).json(saveApi);
      }
    }

  }catch (e) {
    console.log(e);
    return functions.setError(res, e.message);
  }

}


// sửa Api kết nối
exports.editConnectCs = async (req, res) => {
  try {
    let { appID, webhook } = req.body
    let comId = req.user.data.inForPerson.employee.com_id
    let tokenCn = req.headers["authorization"]
    let userID = req.user.idQLC;
    let updateDate = new Date();
    if (typeof appID === 'undefined') {
      res.status(400).json({ success: false, error: 'appID không được bỏ trống' });
    }
    if (typeof webhook === 'undefined') {
      res.status(400).json({ success: false, error: 'webhook phải là 1 số' });
    }
    if (req.user.data.type == 2) {
      await customerService.getDatafindOneAndUpdate(ConnectApi, { company_id: comId }, {
        id: id,
        company_id: comId,
        appID: appID,
        webhook: webhook,
        token: tokenCn,
        user_edit_id: comId,
        user_edit_type: 1,
        stt_conn: 1,
        updated_at: updateDate
      })
      return customerService.success(res, "Api edited successfully");
    }
    else if (req.user.data.type == 1) {
      await customerService.getDatafindOneAndUpdate(ConnectApi, { company_id: comId }, {
        id: id,
        company_id: comId,
        appID: appID,
        webhook: webhook,
        token: tokenCn,
        user_edit_id: userID,
        user_edit_type: 1,
        stt_conn: 1,
        updated_at: updateDate
      })
      return customerService.success(res, "Api edited successfully");
    }
    else {
      return res.status(200).json({ error: 'Bạn không có quyền' })
    }
  } catch (error) {
    return customerService.setError(res, error)
  }
}


// hiển thị Api kết nối
exports.ShowConnectCs = async (req, res) => {
  try {
    let comId = req.user.data.inForPerson.employee.com_id
    const check = await ConnectApi.findOne({ company_id: comId })
    return functions.success(res, 'Lấy dữ liệu thành công', { lcheck });
  } catch (error) {
    return functions.setError(res, error)
  }
}



exports.searchSame = async (req, res) => {
  try {
    const {
      limit,
      start,
      choose,
      emp_id,
      com_id,
      slt_name_customer,
      name_customer,
      slt_phone_customer,
      phone_customer,
      slt_tax_code_customer,
      tax_code_customer,
      slt_website_customer,
      website_customer
    } = req.body;

    const select = 'cus_id email name phone_number tax_code website address resoure birthday status description group_id emp_id com_id is_delete type created_at updated_at cus_from user_handing_over_work';

    const query = {
      is_delete: 0,
      com_id: com_id
    };

    if (emp_id !== '') {
      query.emp_id = { $in: emp_id };
    }

    if (choose === 2) {
      query.$or = [];
    }

    if (slt_name_customer && name_customer) {
      const nameCondition = getConditionObject(slt_name_customer, 'name', name_customer);
      if (query.$or) {
        query.$or.push(nameCondition);
      } else {
        query.$or = [nameCondition];
      }
    }

    if (slt_phone_customer && phone_customer) {
      const phoneCondition = getConditionObject(slt_phone_customer, 'phone_number', phone_customer);
      if (query.$or) {
        query.$or.push(phoneCondition);
      } else {
        query.$or = [phoneCondition];
      }
    }

    if (slt_tax_code_customer && tax_code_customer) {
      const taxCodeCondition = getConditionObject(slt_tax_code_customer, 'tax_code', tax_code_customer);
      if (query.$or) {
        query.$or.push(taxCodeCondition);
      } else {
        query.$or = [taxCodeCondition];
      }
    }

    if (slt_website_customer && website_customer) {
      const websiteCondition = getConditionObject(slt_website_customer, 'website', website_customer);
      if (query.$or) {
        query.$or.push(websiteCondition);
      } else {
        query.$or = [websiteCondition];
      }
    }


    if (choose === 2 && (!query.$or || query.$or.length === 0)) {
      query.$or = [{}];
    }

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query).select(select).limit(limit).skip(start).sort({ cus_id: 1 });

    const data = {
      customer: customers,
      total: total
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error('Failed to search customers', error);
    res.status(500).json({ error: 'Failed to search customers' });
  }
};

function getConditionObject(option, field, value) {
  const conditionObj = {};

  switch (option) {
    case 1:
      conditionObj[field] = value;
      break;
    case 2:
      conditionObj[field] = { $ne: value };
      break;
    case 3:
      conditionObj[field] = { $regex: value, $options: 'i' };
      break;
    case 4:
      conditionObj[field] = { $not: { $regex: value, $options: 'i' } };
      break;
  }

  return conditionObj;
}


