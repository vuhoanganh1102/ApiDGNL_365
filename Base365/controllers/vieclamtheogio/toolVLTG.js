const functions = require('../../services/functions');
const VLTG_JobCategory = require('../../models/ViecLamTheoGio/JobCategory');
const VLTG_CaLamViec = require('../../models/ViecLamTheoGio/CaLamViec');
const VLTG_MenusMulti = require('../../models/ViecLamTheoGio/MenusMulti');
const VLTG_Modules = require('../../models/ViecLamTheoGio/Modules');
const VLTG_NtdSaveUv = require('../../models/ViecLamTheoGio/NtdSaveUv');
const VLTG_NtdXemUv = require('../../models/ViecLamTheoGio/NtdXemUv');
const VLTG_TblCommnet = require('../../models/ViecLamTheoGio/TblComment');
const VLTG_ThongBaoNtd = require('../../models/ViecLamTheoGio/ThongBaoNtd');
const VLTG_ThongBaoUv = require('../../models/ViecLamTheoGio/ThongBaoUv');
const VLTG_UngTuyen = require('../../models/ViecLamTheoGio/UngTuyen');
const VLTG_UvCvmm = require('../../models/ViecLamTheoGio/UvCvmm');


//nganh nghe
exports.job_category = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_JobCategory.findOneAndUpdate({ jc_id: Number(data[i].jc_id) }, {
                        jc_name: data[i].jc_name,
                        jc_title: data[i].jc_title,
                        jc_description: data[i].jc_description,
                        jc_bv: data[i].jc_bv,
                        jc_link: data[i].jc_link,
                        key_tdgy: data[i].key_tdgy,
                        jc_keyword: data[i].jc_keyword,
                        jc_mota: data[i].jc_mota,
                        jc_parent: data[i].jc_parent,
                        jc_order: data[i].jc_order,
                        jc_active: data[i].jc_active,
                        jc_search: data[i].jc_search,
                        jc_type: data[i].jc_type,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

//ca lam viec
exports.list_ca_lamviec = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_CaLamViec.findOneAndUpdate({ ca_id: Number(data[i].ca_id) }, {
                        ca_id_viec: data[i].ca_id_viec,
                        ca_start_time: data[i].ca_start_time,
                        ca_end_time: data[i].ca_end_time,
                        day: data[i].day,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

//
exports.menus_multi = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_MenusMulti.findOneAndUpdate({ mnu_id: Number(data[i].mnu_id) }, {
                        mnu_name: data[i].mnu_name,
                        mnu_name_index: data[i].mnu_name_index,
                        mnu_check: data[i].mnu_check,
                        mnu_link: data[i].mnu_link,
                        mnu_target: data[i].mnu_target,
                        mnu_description: data[i].mnu_description,
                        mnu_data: data[i].mnu_data,
                        admin_id: data[i].admin_id,
                        lang_id: data[i].lang_id,
                        mnu_active: data[i].mnu_active,
                        mnu_follow: data[i].mnu_follow,
                        mnu_type: data[i].mnu_type,
                        mnu_date: data[i].mnu_date,
                        mnu_order: data[i].mnu_order,
                        mnu_parent_id: data[i].mnu_parent_id,
                        mnu_has_child: data[i].mnu_has_child,
                        mnu_background: data[i].mnu_background,
                        mnu_padding_left: data[i].mnu_padding_left,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.modules = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_Modules.findOneAndUpdate({ mod_id: Number(data[i].mod_id) }, {
                        mod_path: data[i].mod_path,
                        mod_listname: data[i].mod_listname,
                        mod_listfile: data[i].mod_listfile,
                        mod_order: data[i].mod_order,
                        mod_help: data[i].mod_help,
                        lang_id: data[i].lang_id,
                        mod_checkloca: data[i].mod_checkloca,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.ntd_save_uv = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_NtdSaveUv.findOneAndUpdate({ id: Number(data[i].id) }, {
                        id_ntd: data[i].id_ntd,
                        id_uv: data[i].id_uv,
                        created_at: data[i].created_at,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.ntd_xem_uv = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_NtdXemUv.findOneAndUpdate({ stt: Number(data[i].stt) }, {
                        id_ntd: data[i].id_ntd,
                        id_uv: data[i].id_uv,
                        ket_qua: data[i].ket_qua,
                        time_created: data[i].time_created,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.tbl_comment = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_TblCommnet.findOneAndUpdate({ cm_id: Number(data[i].cm_id) }, {
                        url_cm: data[i].url_cm,
                        parent_cm_id: data[i].parent_cm_id,
                        comment: data[i].comment,
                        comment_sender_name: data[i].comment_sender_name,
                        ip_cm: data[i].ip_cm,
                        time_cm: data[i].time_cm,
                        reply: data[i].reply,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.thongbao_ntd = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_ThongBaoNtd.findOneAndUpdate({ tb_id: Number(data[i].tb_id) }, {
                        td_uv: data[i].td_uv,
                        td_ntd: data[i].td_ntd,
                        tb_name: data[i].tb_name,
                        tb_avatar: data[i].tb_avatar,
                        created_at: data[i].created_at,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.thongbao_uv = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_ThongBaoUv.findOneAndUpdate({ tb_id: Number(data[i].tb_id) }, {
                        td_uv: data[i].td_uv,
                        td_ntd: data[i].td_ntd,
                        tb_name: data[i].tb_name,
                        tb_avatar: data[i].tb_avatar,
                        created_at: data[i].created_at,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.ungtuyen = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_UngTuyen.findOneAndUpdate({ id_ungtuyen: Number(data[i].id_ungtuyen) }, {
                        td_uv: data[i].td_uv,
                        td_ntd: data[i].td_ntd,
                        id_viec: data[i].id_viec,
                        ca_lam: data[i].ca_lam,
                        gio_lam: data[i].gio_lam,
                        day: data[i].day,
                        ghi_chu: data[i].ghi_chu,
                        status: data[i].status,
                        created_at: data[i].created_at,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};


exports.uv_cvmm = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post(`https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=${page}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await VLTG_UvCvmm.findOneAndUpdate({ id_uv_cvmm: Number(data[i].id_uv_cvmm) }, {
                        cong_viec: data[i].cong_viec,
                        nganh_nghe: data[i].nganh_nghe,
                        dia_diem: data[i].dia_diem,
                        lever: data[i].lever,
                        hinh_thuc: data[i].hinh_thuc,
                        luong: data[i].luong,
                        ky_nang: data[i].ky_nang,
                    }, { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};