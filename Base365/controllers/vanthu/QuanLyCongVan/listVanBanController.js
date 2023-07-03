const functions = require('../../../services/functions');
const tbl_qly_congvan = require('../../../models/Vanthu365/tbl_qly_congvan');
const vanthu = require('../../../services/vanthu.js');
// danh sách văn bản đến
exports.getListVanBanDen = async (req, res, next) => {
    try {
        // khai báo biến
        let key = req.body.key;
        if (key) {
            key = key.toUpperCase();
        }
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let book = req.body.book;
        let dayStart = req.body.dayStart;
        let dayEnd = req.body.dayEnd;
        let comId = req.comId || 1763;
        //tạo phân trang
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        // khai báo điều kiện, đầu ra
        let data = {};
        let conditions = {};
        if (key) {
            conditions = {
                $or: [
                    { cv_name: { $regex: key } },
                    { cv_so: { $regex: key } }
                ]
            }
        }
        if (dayStart) conditions.cv_date = { $gte: new Date(dayStart) }
        if (dayEnd) conditions.cv_date = { $gte: new Date(dayEnd) }
        if (book) conditions.cv_id_book = book
        conditions.cv_usc_id = comId;
        conditions.cv_type_loai = 1;
        conditions.cv_type_xoa = 0;
        conditions.cv_type_hd = 0;
        let db_qr = await tbl_qly_congvan.find(conditions).sort({ cv_date: -1 }).skip(skip).limit(limit)
        let count = await tbl_qly_congvan.countDocuments(conditions)
        data.count = count;
        data.db_qr = db_qr;
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: listVanBanController.js:27 ~ exports.getListVanBanDen= ~ error:", error)
        return functions.setError(res, error)
    }
};

// tạo mới danh sách văn bản đến
exports.createListIncomingText = async (req, res, next) => {
    try {
        let comId = req.comId || 1763;
        let name_vbden = req.body.name_vbden;
        let type_vbden = req.body.type_vbden;
        let so_vbden = req.body.so_vbden;
        let type_gui_vbden = Number(req.body.type_gui_vbden);
        let noi_gui_vbden = Number(req.body.noi_gui_vbden);
        let text_gui_vbden = req.body.text_gui_vbden;
        let user_gui_vbden = req.body.user_gui_vbden;
        let text_user_gui_vbden = req.body.text_user_gui_vbden;
        let date_nhan = req.body.date_nhan;
        let use_nhan_vbden = Number(req.body.use_nhan_vbden);
        let use_luu_vbden = Number(req.body.use_luu_vbden);
        let book_vb = Number(req.body.book_vb);
        let trich_yeu_vbden = req.body.trich_yeu_vbden;
        let ghi_chu_vbden = req.body.ghi_chu_vbden;
        let file = req.files;
        let cv_file = [];
        let cv_time_create = new Date();
        if (file && file.file.length > 0) {
            for (let i = 0; i < file.file.length; i++) {
                let checkUpload = await vanthu.VT_UploadFile('tailieu', comId, file.file[i], ['.docx', '.pdf', '.pptx', '.jpg', '.png', '.jpeg'])
                if (checkUpload === false) {
                    return functions.setError(res, 'upload failed', 400)
                }
                let name = await vanthu.createLinkFileVanthu(comId, file.file[i].name)
                cv_file.push({ file: name })
            }
        } else if (file) {
            let checkUpload = await vanthu.VT_UploadFile('tailieu', comId, file.file, ['.docx', '.pdf', '.pptx', '.jpg', '.png', '.jpeg'])
            if (checkUpload === false) {
                return functions.setError(res, 'upload failed', 400)
            }
            let name = await vanthu.createLinkFileVanthu(comId, file.file.name)
            cv_file.push({ file: name })
        }
        if (await !functions.checkNumber(type_gui_vbden) || await !functions.checkNumber(noi_gui_vbden) ||
            await !functions.checkNumber(use_nhan_vbden) || await !functions.checkNumber(use_luu_vbden)
            || await !functions.checkNumber(book_vb)) {
            return functions.setError(res, 'invalid number', 400)
        }
        let _id = await vanthu.getMaxID(tbl_qly_congvan)
        if (name_vbden && type_vbden && so_vbden && type_gui_vbden && text_gui_vbden && noi_gui_vbden
            && book_vb && date_nhan && text_user_gui_vbden && use_luu_vbden && use_nhan_vbden) {
            await tbl_qly_congvan.create({
                _id,
                cv_name: name_vbden,
                cv_kieu: type_vbden,
                cv_so: so_vbden,
                cv_type_soan: type_gui_vbden,
                cv_soan_ngoai: text_gui_vbden,
                cv_phong_soan: noi_gui_vbden,
                cv_user_soan: user_gui_vbden,
                cv_id_book: book_vb,
                cv_date: date_nhan,
                cv_name_soan: text_user_gui_vbden,
                cv_user_save: use_luu_vbden,
                cv_type_nhan: 1,
                cv_nhan_noibo: use_nhan_vbden,
                cv_file: cv_file,
                cv_trich_yeu: trich_yeu_vbden,
                cv_ghi_chu: ghi_chu_vbden,
                cv_type_loai: 1,
                cv_usc_id: comId,
                cv_time_created: cv_time_create
            })
        } else {
            return functions.setError(res, 'missing data', 400)
        }
        return functions.success(res, 'add successfully')
    } catch (err) {
        console.error(err)
        return functions.setError(res, err)
    }
};