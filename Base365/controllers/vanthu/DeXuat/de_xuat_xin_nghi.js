const De_Xuat = require('../../../models/Vanthu/de_xuat');
const functions = require('../../../services/vanThu');
//const Cate_Dx = require('../../../models/Vanthu/cate_de_xuat');
// const multer = require('multer');



// const storageFile = (destination) => {
//     return multer.diskStorage({
//         destination: function (req, file, cb) {
//             let userDestination = " "
//             if (req.user) {
//                 const userId = req.user.data._id; // Lấy id người dùng từ request
//                 userDestination = `${destination}/${userId}`; // Tạo đường dẫn đến thư mục của người dùng
//                 if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
//                     fs.mkdirSync(userDestination, { recursive: true });
//                 }
//             } else {
//                 userDestination = destination
//             }
//             cb(null, userDestination);
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//             cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
//         },
//         fileFilter: function (req, file, cb) {
//             const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'video/quicktime'];
//             if (allowedTypes.includes(file.mimetype)) {
//                 cb(null, true);
//             } else {
//                 cb(new Error('Only .jpeg, .png, .mp4, .webm and .mov format allowed!'));
//             }
//         }
//     })
// };


// exports.uploadFileDeXuat = multer({ storage: storageFile('../Storage/VanThuLuuTru') })

exports.de_xuat_xin_nghi = async (req, res) => {
    let {
        name_dx,
        type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        // file_kem,
        ly_do,

        bd_nghi,
        kt_nghi,
        loai_np,
        type_time,
        ca_nghi,
    } = req.body;


    let file_kem = req.files.fileKem;
    console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);



    if (!name_dx || !type_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
        return res.status(404).json("bad request ");

    } else {


        if (bd_nghi) {

        }
        let maxID = 0;
        const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
        //   console.log(de_xuat);
        if (de_xuat) {
            maxID = de_xuat._id;
        }

        //console.log("mx : " + maxID);
        const new_de_xuat = new De_Xuat({
            _id: (maxID + 1),
            name_dx: name_dx,
            type_dx: type_dx,
            noi_dung: {
                nghi_phep: {
                    ly_do: ly_do,
                    bd_nghi: bd_nghi,
                    kt_nghi: kt_nghi,
                    loai_np: loai_np,
                    ca_nghi: ca_nghi,
                }

            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            //   file_kem: file_kem,
            kieu_duyet: 0,
            type_duyet: 0,
            type_time: type_time,
            time_start_out: " ",
            time_create: new Date(),
            time_tiep_nhan: null,
            time_duyet: null,
            active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            del_type: 1,//1-active , 2 --delete
        })


        await new_de_xuat.save();


    }
    return res.status(200).json("success ");

}

