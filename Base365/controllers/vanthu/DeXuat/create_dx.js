const De_Xuat = require('../../../models/Vanthu/de_xuat');
const functions = require('../../../services/vanthu');
// const multer = require('multer');
const path = require('path');
const thongBao = require('../../../models/Vanthu365/tl_thong_bao');
const ThongBao = require("../../../models/Vanthu365/tl_thong_bao")
const DeXuat = require("../../../models/Vanthu/de_xuat");
const User = require('../../../models/Users');
const SettingD = require('../../../models/Vanthu/setting_dx');
const fnc = require('../../../services/qlc/functions')
const { log } = require('console');

//đề xuất xin nghỉ ok
exports.de_xuat_xin_nghi = async(req, res) => {
        try {
            let {
                name_dx,
                kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
                id_user_duyet,
                id_user_theo_doi,
                type_time,
                noi_dung,
                loai_np,
                ly_do
            } = req.body;
            let id_user = "";
            let com_id = "";
            let name_user = "";
            if (req.user.data.type == 2) {
                id_user = req.user.data.idQLC
                com_id = req.user.data.com_id
                name_user = req.user.data.userName
            } else {
                return functions.setError(res, 'không có quyền truy cập', 400);
            }

            ;
            let link_download = [];
            if (req.files.fileKem) {
                let file_kem = req.files.fileKem
                let listFile = [];
                if (Array.isArray(file_kem)) {
                    // Người dùng gửi nhiều file hoặc một file duy nhất
                    file_kem.forEach(file => {
                        functions.uploadFileVanThu(id_user, file);
                        listFile.push(file.name);
                    });
                } else {
                    // Người dùng chỉ gửi một file
                    functions.uploadFileVanThu(id_user, file_kem);
                    listFile.push(file_kem.name);
                }
                link_download = listFile

            }
            if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
                return functions.setError(res, 'không thể thực thi', 400);
            } else {
                let listLyDo = JSON.parse(noi_dung).nghi_phep
                const data = []; // Mảng chứa thông tin của từng ngày nghỉ

                for (let i = 0; i < listLyDo.length; i++) {
                    let bd_nghi = listLyDo[i][0];
                    let kt_nghi = listLyDo[i][1];
                    let ca_nghi = listLyDo[i][2];
                    if (bd_nghi && kt_nghi) {
                        let dates = await functions.getDatesFromRange(bd_nghi, kt_nghi);
                        dates.forEach((date) => {
                            let formattedDate = functions.formatDate(date);
                            data.push({ ca_nghi, bd_nghi: formattedDate, kt_nghi: formattedDate });
                        });
                    } else if (bd_nghi) {

                        let formattedDate = functions.formatDate(bd_nghi);
                        data.push({ ca_nghi, bd_nghi: formattedDate, kt_nghi: formattedDate });
                    }
                }
                let maxID = 0;
                const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
                if (de_xuat) {
                    maxID = de_xuat._id;
                }
                const new_de_xuat = new De_Xuat({
                    _id: (maxID + 1),
                    name_dx: name_dx,
                    type_dx: 1,
                    noi_dung: {
                        nghi_phep: {
                            nd: data,
                            loai_np: loai_np,
                            ly_do: ly_do
                        }
                    },
                    type_time: type_time,
                    name_user: name_user,
                    id_user: id_user,
                    com_id: com_id,
                    id_user_duyet: id_user_duyet,
                    id_user_theo_doi: id_user_theo_doi,
                    file_kem: link_download.map(file => ({ file })),
                    kieu_duyet: 0,
                    time_create: Math.floor(Date.now() / 1000),
                });

                let saveDX = await new_de_xuat.save();
                let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
                functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link, saveDX.file_kem);
                // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem

                const tb = await ThongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;

                let idTB = 0;
                if (tb) {
                    idTB = Number(tb._id) + 1;
                }
                // Tiếp tục tạo các bản ghi mới với idTB mới tăng dần
                const id_user_nhan_arr = id_user_duyet.split(',');
                let createTBs = [];

                for (let i = 0; i < id_user_nhan_arr.length; i++) {
                    const id_user_nhan = parseInt(id_user_nhan_arr[i]);
                    let createTB = new ThongBao({
                        _id: idTB + i,
                        id_user: id_user,
                        id_user_nhan: id_user_nhan,
                        id_van_ban: saveDX._id,
                        type: 2,
                        view: 0,
                        created_date: Math.floor(Date.now() / 1000)
                    });

                    createTBs.push(createTB);
                }

                // Chèn các bản ghi mới vào collection ThongBao
                let saveCreateTb = await ThongBao.insertMany(createTBs);
                return functions.success(res, 'get data success', { saveDX, saveCreateTb });
            };
        } catch (e) {
            console.log(e)
            return functions.setError(res, e.message)
        }
}

//đề xuất bổ nhiệm 
exports.de_xuat_xin_bo_nhiem = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            thanhviendc_bn,
            name_ph_bn,
            chucvu_hientai,
            chucvu_dx_bn,
            phong_ban_moi,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }

        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile

        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 7,
                noi_dung: {
                    bo_nhiem: {
                        ly_do: ly_do,
                        thanhviendc_bn: thanhviendc_bn,
                        name_ph_bn: name_ph_bn,
                        chucvu_hientai: chucvu_hientai,
                        chucvu_dx_bn: chucvu_dx_bn,
                        phong_ban_moi: phong_ban_moi
                    }
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                kieu_duyet: 0,
                time_create: Math.floor(Date.now() / 1000),
            })


            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "dề xuất bổ nhệm ", link, saveDX.file_kem);
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000),
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

//đề xuất cấp phát tài sản
exports.de_xuat_xin_cap_phat_tai_san = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            danh_sach_tai_san,
            so_luong_tai_san,


        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }

        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile

        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);

        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 4,
                noi_dung: {
                    cap_phat_tai_san: {
                        ly_do: ly_do,
                        danh_sach_tai_san: danh_sach_tai_san,
                        so_luong_tai_san: so_luong_tai_san,
                    }
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                kieu_duyet: 0,
                time_create: Math.floor(Date.now() / 1000),

            })
            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link, saveDX.file_kem);
            // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');
            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);
                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000),
                });
                createTBs.push(createTB);
            }
            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

//đề xuất đổi ca 
exports.de_xuat_doi_ca = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            ngay_can_doi,
            ca_can_doi,
            ngay_muon_doi,
            ca_muon_doi,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }

        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile

        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 2,
                noi_dung: {
                    doi_ca: {
                        ngay_can_doi: ngay_can_doi,
                        ca_can_doi: ca_can_doi,
                        ngay_muon_doi: ngay_muon_doi,
                        ca_muon_doi: ca_muon_doi,
                        ly_do: ly_do
                    }
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                kieu_duyet: 0,
                time_create: Math.floor(Date.now() / 1000),

            })


            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link, saveDX.file_kem);
            // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');
            let createTBs = []; // Mảng chứa các đối tượng ThongBao
            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000),
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

//đề xuất luân chuyển công tác 
exports.de_xuat_luan_chuyen_cong_tac = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            cv_nguoi_lc,
            pb_nguoi_lc,
            noi_cong_tac,
            noi_chuyen_den,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }

        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 8,
                noi_dung: {
                    luan_chuyen_cong_tac: {
                        cv_nguoi_lc: cv_nguoi_lc,
                        pb_nguoi_lc: pb_nguoi_lc,
                        ly_do: ly_do,
                        noi_cong_tac: noi_cong_tac,
                        noi_chuyen_den: noi_chuyen_den
                    }

                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                time_create: Math.floor(Date.now() / 1000),
            })
            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link, saveDX.file_kem);
            // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000),
                });

                createTBs.push(createTB);
            }
            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

//đề xuất tăng lương 
exports.de_xuat_tang_luong = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            mucluong_ht,
            mucluong_tang,
            date_tang_luong,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }

        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);

        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 6,
                noi_dung: {
                    tang_luong: {
                        mucluong_ht: mucluong_ht,
                        mucluong_tang: mucluong_tang,
                        date_tang_luong: date_tang_luong,
                        ly_do: ly_do
                    }
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                kieu_duyet: kieu_duyet,
                type_time: 0,
                time_create: Math.floor(Date.now() / 1000),
            })


            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link, saveDX.file_kem);
            // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000)
                });
                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

//đè xuất tham gia dự ấn 
exports.de_xuat_tham_gia_du_an = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            cv_nguoi_da,
            pb_nguoi_da,
            dx_da,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);

        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;

            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 9,
                noi_dung: {
                    tham_gia_du_an: {
                        ly_do: ly_do,
                        cv_nguoi_da: cv_nguoi_da,
                        pb_nguoi_da: pb_nguoi_da,
                        dx_da: dx_da,
                    }

                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                kieu_duyet: 0,
                type_duyet: 0,
                time_create: Math.floor(Date.now() / 1000),
            })
            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link, saveDX.file_kem);
            // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);
                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000)
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

//đề xuất xin tạm ứng lương
exports.de_xuat_xin_tam_ung = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            type_time,
            tien_tam_ung,
            ngay_tam_ung,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 3,
                noi_dung: {
                    tam_ung: {
                        ly_do: ly_do,
                        tien_tam_ung: tien_tam_ung,
                        ngay_tam_ung: ngay_tam_ung
                    }

                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                kieu_duyet: 0,
                time_create: Math.floor(Date.now() / 1000)
            })


            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link, saveDX.file_kem);
            // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000)
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

//đề xuất thôi việc 
exports.de_xuat_xin_thoi_Viec = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            type_time,
            ngaybatdau_tv,
            ca_bdnghi,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }

        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);

        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 5,
                noi_dung: {
                    thoi_viec: {
                        ly_do: ly_do,
                        ngaybatdau_tv: ngaybatdau_tv,
                        ca_bdnghi: ca_bdnghi,
                    },
                },
                type_time: type_time,
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                kieu_duyet: kieu_duyet,
                time_create: Math.floor(Date.now() / 1000)
            });
            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx' // đường dẫn chi tiết đề xuất
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link, saveDX.file_kem);
            // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000)
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}


exports.lich_lam_viec = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet, // 0-kiểm duyệt lần lượt hay đồng thời 
            id_user_duyet,
            id_user_theo_doi,
            ly_do,
            lich_lam_viec,
            thang_ap_dung,
            ngay_bat_dau,
            ca_lam_viec,
            ngay_lam_viec,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        if (isNaN(id_user) || isNaN(id_user_duyet) || isNaN(id_user_theo_doi)) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = 0;
            const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            if (de_xuat) {
                maxID = de_xuat._id;
            }
            const new_de_xuat = new De_Xuat({
                _id: (maxID + 1),
                name_dx: name_dx,
                type_dx: 18,
                noi_dung: {
                    lich_lam_viec: {
                        ly_do: ly_do,
                        lich_lam_viec: lich_lam_viec,
                        thang_ap_dung: thang_ap_dung,
                        ngay_bat_dau: ngay_bat_dau,
                        ca_la_viec: ca_lam_viec,
                        ngay_lam_viec: ngay_lam_viec,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                kieu_duyet: kieu_duyet,
                time_create: Math.floor(Date.now() / 1000)
            });

            let saveDX = await new_de_xuat.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "Xin nghỉ phép", link);
            // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link,file_kem
            const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            let idTB = 0;
            if (tb) {
                idTB = Number(tb._id) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');
            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);
                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: saveDX._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000)
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { saveDX, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxCong = async(req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            ca_xnc,
            time_vao_ca,
            time_het_ca,
            id_ca_xnc,
            time_xnc,
            ly_do,

        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXC = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 17,
                noi_dung: {
                    xac_nhan_cong: {
                        time_vao_ca: time_vao_ca,
                        time_het_ca: time_het_ca,
                        id_ca_xnc: id_ca_xnc,
                        time_xnc: time_xnc,
                        ca_xnc: ca_xnc,
                        ly_do: ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                time_create: Math.floor(Date.now() / 1000)
            });
            let savedDXC = await createDXC.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", savedDXC.file_kem, link);
            let maxIDTB = await functions.getMaxID(ThongBao);
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = savedDXC.id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXC._id,
                    type: 2,
                    view: 0,
                    created_date: Math.floor(Date.now() / 1000)
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXC, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxCoSoVatChat = async(req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            time_start_out,
            input_csv,
            ly_do,
            type_time,

        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let createDate = Math.floor(Date.now() / 1000)
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {
                _id = Number(maxID) + 1;
            }
            let createDXCSVC = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 14,
                noi_dung: {
                    sua_chua_co_so_vat_chat: {
                        input_csv: input_csv,
                        ly_do: ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                time_start_out: time_start_out,
                time_create: createDate,

            });
            let savedDXCSVC = await createDXCSVC.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", link, savedDXCSVC.file_kem);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXCSVC._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXCSVC, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxDangKiSuDungXe = async(req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            bd_xe,
            end_xe,
            soluong_xe,
            local_di,
            local_den,
            ly_do,
            link

        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let createDate = Math.floor(Date.now() / 1000)
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {
                _id = Number(maxID) + 1;
            }
            let createDXXe = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 13,
                noi_dung: {
                    su_dung_xe_cong: {
                        bd_xe: bd_xe,
                        end_xe: end_xe,
                        soluong_xe: soluong_xe,
                        local_di: local_di,
                        local_den: local_den,
                        ly_do: ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXXe = await createDXXe.save();
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", link, savedDXXe.file_kem);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXXe._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }
            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXXe, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxHoaHong = async(req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            chu_ky,
            type_time,
            item_mdt_date,
            dt_money,
            ly_do,
            name_dt,
            time_hh,
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let createDate = Math.floor(Date.now() / 1000)
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXHH = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 20,
                noi_dung: {
                    hoa_hong: {
                        chu_ky: chu_ky,
                        time_hh: time_hh,
                        item_mdt_date: item_mdt_date,
                        dt_money: dt_money,
                        name_dt: name_dt,
                        ly_do: ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXHH = await createDXHH.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", link, savedDXHH.file_kem);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = savedDXHH.id_user_duyet.split(',');
            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXHH._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXHH, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxKhieuNai = async(req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            ly_do,
            type_time,
            link
        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let createDate = Math.floor(Date.now() / 1000)
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXKN = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 16,
                noi_dung: {
                    khieu_nai: {
                        ly_do: ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXKN = await createDXKN.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", link, savedDXKN.file_kem);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = savedDXKN.id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXKN._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXKN, saveCreateTb });
        };

    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxPhongHop = async(req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            bd_hop,
            type_time,
            end_hop,
            ly_do,
        } = req.body;
        let createDate = Math.floor(Date.now() / 1000)
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXPH = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 12,
                noi_dung: {
                    su_dung_phong_hop: {
                        bd_hop: bd_hop,
                        end_hop: end_hop,
                        ly_do: ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                type_duyet: type_duyet,
                time_create: createDate,

            });

            let savedDXPH = await createDXPH.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", link, savedDXPH.file_kem);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = savedDXPH.id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXPH._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXPH, saveCreateTb });
        };

    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxTangCa = async(req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            ly_do,
            type_time,
            time_tc,
            shift_id,
        } = req.body;
        let createDate = Math.floor(Date.now() / 1000)
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {

            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXTC = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 10,
                noi_dung: {
                    tang_ca: {
                        ly_do: ly_do,
                        time_tc: time_tc,
                        shift_id: shift_id
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXTC = await createDXTC.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", link, savedDXTC.file_kem);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = savedDXTC.id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXTC._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }
            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXTC, saveCreateTb });
        };

    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxThaiSan = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            ngaybatdau_nghi_ts,
            ngayketthuc_nghi_ts,
            ly_do,

        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let createDate = Math.floor(Date.now() / 1000)
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXTS = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 11,
                noi_dung: {
                    nghi_thai_san: {
                        ngaybatdau_nghi_ts: ngaybatdau_nghi_ts,
                        ngayketthuc_nghi_ts: ngayketthuc_nghi_ts,
                        ly_do: ly_do
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXTS = await createDXTS.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", savedDXTS.file_kem, link);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = savedDXTS.id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXTS._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXTS, saveCreateTb });
        };

    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxThanhToan = async(req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            type_time,
            so_tien_tt,
            ly_do,

        } = req.body;
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let createDate = Math.floor(Date.now() / 1000)
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {

            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXTT = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 15,
                noi_dung: {
                    thanh_toan: {
                        so_tien_tt: so_tien_tt,
                        ly_do: ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXTT = await createDXTT.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", link, savedDXTT.file_kem);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = savedDXTT.id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXTT._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXTT, saveCreateTb });
        };

    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.dxThuongPhat = async(req, res) => {
    try {
        let {
            name_dx,
            kieu_duyet,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            type_tp,
            so_tien_tp,
            nguoi_phat_tp,
            id_nguoi_tp,
            time_tp,
            ly_do,

        } = req.body;
        let createDate = Math.floor(Date.now() / 1000)
        let id_user = "";
        let com_id = "";
        let name_user = "";
        if (req.user.data.type == 2) {
            id_user = req.user.data.idQLC
            com_id = req.user.data.com_id
            name_user = req.user.data.userName
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let file_kem = req.files.file_kem;
        if (type_tp == 1) {
            nguoi_tp = id_nguoi_tp;
        } else {
            nguoi_tp = nguoi_phat_tp;
        }
        let link_download = [];
        if (req.files.fileKem) {
            let file_kem = req.files.fileKem
            let listFile = [];
            if (Array.isArray(file_kem)) {
                // Người dùng gửi nhiều file hoặc một file duy nhất
                file_kem.forEach(file => {
                    functions.uploadFileVanThu(id_user, file);
                    listFile.push(file.name);
                });
            } else {
                // Người dùng chỉ gửi một file
                functions.uploadFileVanThu(id_user, file_kem);
                listFile.push(file_kem.name);
            }
            link_download = listFile
        }
        if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
            return functions.setError(res, 'không thể thực thi', 400);
        } else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXTP = new DeXuat({
                _id: _id,
                name_dx: name_dx,
                type_dx: 19,
                noi_dung: {
                    thuong_phat: {
                        so_tien_tp: so_tien_tp,
                        nguoi_tp: nguoi_tp,
                        time_tp: time_tp,
                        type_tp: type_tp,
                        ly_do: ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: link_download.map(file => ({ file })),
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXTP = await createDXTP.save();
            let link = 'https://cdn.timviec365.vn/vanthu/chi_tietdx'
            functions.chat(id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, "đề xuất lịch làm việc", link, savedDXTP.file_kem);
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            const id_user_nhan_arr = savedDXTP.id_user_duyet.split(',');

            let createTBs = []; // Mảng chứa các đối tượng ThongBao

            for (let i = 0; i < id_user_nhan_arr.length; i++) {
                const id_user_nhan = parseInt(id_user_nhan_arr[i]);

                let createTB = new ThongBao({
                    _id: idTB + i, // Sử dụng idTB + i để tạo id duy nhất cho mỗi đối tượng ThongBao
                    id_user: id_user,
                    id_user_nhan: id_user_nhan, // Lưu giá trị từng phần tử của id_user_duyet dưới dạng số
                    id_van_ban: savedDXTP._id,
                    type: 2,
                    view: 0,
                    created_date: createDate
                });

                createTBs.push(createTB);
            }

            // Lưu tất cả các đối tượng ThongBao vào cơ sở dữ liệu
            let saveCreateTb = await ThongBao.insertMany(createTBs)
            return functions.success(res, 'get data success', { savedDXTP, saveCreateTb });
        };
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}

exports.showadd = async(req, res) => {
    try {
        if (req.user.data.type !== 2) {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let checkUserNv = await User.findOne({ idQLC: req.user.data.idQLC }).select('inForPerson');
        if (!checkUserNv || !checkUserNv.inForPerson.employee || checkUserNv.inForPerson.employee.ep_status !== 'Active') {
            return functions.setError(res, 'nhân viên đã nghỉ việc', 400);
        }
        let com_id = req.user.data.com_id;
        let showUserduyet = await SettingD.findOne({ com_id: com_id }).select('list_user');

        if (!showUserduyet) {
            return functions.setError(res, 'Không có bản ghi cài đặt người duyệt', 400);
        }
        let idUserD = showUserduyet.list_user.split(',').map(Number);
        let listUsersDuyet = await User.find({
            idQLC: { $in: idUserD },
            'inForPerson.employee.ep_status': 'Active'
        }).select('idQLC userName avatarUser inForPerson.employee.dep_id inForPerson.employee.position_id').lean();
        let listUsersTheoDoi = await User.find({
            'inForPerson.employee.com_id': com_id,
            'inForPerson.employee.ep_status': 'Active'
        }).select('idQLC userName avatarUser').lean();

        for (let i = 0; i < listUsersDuyet.length; i++) {
            let userDuyet = listUsersDuyet[i];
            let avatar = await fnc.createLinkFileEmpQLC(userDuyet.idQLC, userDuyet.avatarUser);
            if (avatar) {
                userDuyet.avatarUser = avatar;
            }
        }
        for (let i = 0; i < listUsersTheoDoi.length; i++) {
            let userTheoDoi = listUsersTheoDoi[i];
            let avatar = await fnc.createLinkFileEmpQLC(userTheoDoi.idQLC, userTheoDoi.avatarUser);
            if (avatar) {
                userTheoDoi.avatarUser = avatar;
            }
        }


        return await functions.success(res, 'Lấy thành công', { listUsersDuyet, listUsersTheoDoi });
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error.message);
    }
};