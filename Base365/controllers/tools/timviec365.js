const fnc = require('../../services/functions');
const CV = require('../../models/Timviec365/CV/CV');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New')
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');
const Linh_Vuc = require('../../models/Timviec365/UserOnSite/Company/CategoryCompany')
const KeyWord = require('../../models/Timviec365/UserOnSite/Company/Keywords');

const CategoryBlog = require('../../models/Timviec365/Blog/Category')
const Blog = require('../../models/Timviec365/Blog/Posts')
const Users = require('../../models/Users')
const PointCompany = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany')
const PointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed')
const NgangDon = require('../../models/Timviec365/CV/ApplicationCategory')
const NgangThu = require('../../models/Timviec365/CV/LetterCategory')
const CategoryJob = require('../../models/Timviec365/CategoryJob');
const CVCate = require('../../models/Timviec365/CV/CVCategory');
const CVLang = require('../../models/Timviec365/CV/CVLang');
const CVUV = require('../../models/Timviec365/CV/CVUV');
const Application = require('../../models/Timviec365/CV/Application');
const ApplicationUV = require('../../models/Timviec365/CV/ApplicationUV');
const Letter = require('../../models/Timviec365/CV/Letter');
const LetterUV = require('../../models/Timviec365/CV/LetterUV');
const Resume = require('../../models/Timviec365/CV/Resume');
const ResumeUV = require('../../models/Timviec365/CV/ResumeUV');
const CVDesign = require('../../models/Timviec365/CV/CVDesign');
const CVGroup = require('../../models/Timviec365/CV/CVGroup');
const PriceList = require('../../models/Timviec365/PriceList/PriceList');
const CVSection = require('../../models/Timviec365/CV/CVSection');
const ApplyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const UserSavePost = require('../../models/Timviec365/UserOnSite/Candicate/UserSavePost');

// hàm thêm dữ liệu vào bảng newTV365
exports.toolNewTV365 = async(req, res, next) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api_nodejs/get_list_new.php?page=' + page, {}, "get")
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let cityArray = data[i].new_city.split(",").map(String);
                    let districtArray = data[i].new_qh_id.split(",").map(String);
                    let lvArray = data[i].new_lv.split(",").map(String);
                    const newTV = new NewTV365({
                        _id: data[i].new_id,
                        userID: data[i].usc_id,
                        title: data[i].new_title,
                        newMd5: data[i].new_md5,
                        alias: data[i].new_alias,
                        cateID: data[i].new_cat_id,
                        realCate: data[i].new_real_cate,
                        cityID: cityArray,
                        districtID: districtArray,
                        address: data[i].new_addr,
                        capBac: data[i].new_cap_bac,
                        exp: data[i].new_exp,
                        sex: data[i].new_gioi_tinh,
                        bangCap: data[i].new_bang_cap,
                        hinhThuc: data[i].new_hinh_thuc,
                        doTuoi: data[i].new_do_tuoi,
                        money: data[i].new_money,
                        createTime: new Date(data[i].new_create_time * 1000),
                        updateTime: new Date(data[i].new_update_time * 1000),
                        hanNop: new Date(data[i].new_han_nop * 1000),
                        cateTime: new Date(data[i].new_cate_time * 1000),
                        userRedirect: data[i].new_user_redirect,
                        viewCount: data[i].new_view_count,
                        renew: data[i].new_renew,
                        newDo: data[i].new_do,
                        over: data[i].new_over,
                        newThuc: data[i].new_thuc,
                        newOrder: data[i].new_order,
                        newUt: data[i].new_ut,
                        newHot: data[i].new_hot,
                        newCao: data[i].new_cao,
                        newGhim: data[i].new_ghim,
                        newGap: data[i].new_gap,
                        sendVip: data[i].send_vip,
                        hideAdmin: data[i].new_hide_admin,
                        sendVip: data[i].send_vip,
                        newPoint: data[i].new_point,
                        newMutil: {
                            moTa: data[i].new_mota,
                            yeuCau: data[i].new_yeucau,
                            quyenLoi: data[i].new_quyenloi,
                            hoSo: data[i].new_ho_so,
                            titleSeo: data[i].new_title_seo,
                            desSeo: data[i].new_des_seo,
                            hoaHong: data[i].new_hoahong,
                            tgtv: data[i].new_tgtv,
                            lv: lvArray,
                            baoLuu: data[i].new_ho_so,
                            timeBaoLuu: data[i].time_bao_luu,
                            jobPosting: data[i].no_jobposting,
                            videoType: data[i].new_video_type,
                            videoActive: data[i].new_video_active,
                            images: data[i].new_images,
                        },
                        newMoney: {
                            type: data[i].nm_type,
                            minValue: data[i].nm_min_value,
                            maxValue: data[i].nm_max_value,
                            unit: data[i].nm_unit,
                        }
                    })
                    await newTV.save();

                };
                page += 1;
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công', { data });

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu vào bảng Keyword
exports.toolKeyword = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/get_keyword.php?page=' + page)
            listKey = data;
            if (listKey.length > 0) {
                listKey.forEach(async element => {
                    let keyWord = await fnc.getDatafindOne(KeyWord, { _id: element.key_id })
                    if (keyWord == null) {
                        const decodedStringNdgy = Buffer.from(element.key_ndgy, 'base64').toString('utf-8'); // Giải mã chuỗi
                        const decodedStringTeaser = Buffer.from(element.key_teaser, 'base64').toString('utf-8'); // Giải mã chuỗi
                        const key = new KeyWord({
                            _id: element.key_id,
                            name: element.key_name,
                            lq: element.key_lq,
                            cateID: element.key_cate_id,
                            cityID: element.key_city_id,
                            qhID: element.key_qh_id,
                            cbID: element.key_cb_id,
                            teaser: decodedStringTeaser,
                            type: element.key_type,
                            err: element.key_err,
                            qhKcn: element.key_qh_kcn,
                            cateLq: element.key_cate_lq,
                            title: element.key_tit,
                            description: element.key_desc,
                            keyword: element.key_key,
                            h1: element.key_h1,
                            createTime: new Date(element.key_time * 1000),
                            redirect301: element.key_301,
                            index: element.key_index,
                            baoHam: element.key_bao_ham,
                            tdgy: element.key_tdgy,
                            ndgy: decodedStringNdgy,
                        })
                        await key.save();
                    }
                    return fnc.setError(res, 'trùng _id')

                });
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu vào bảng AdminUser
exports.toolAddAdminUSer = async(req, res, next) => {
    try {

        let data = await fnc.getDataAxios('https://timviec365.vn/api/get_user_admin.php?page=1')

        for (let i = 0; i < data.length; i++) {
            let bophan = 0;
            let stt = 0;
            if (data[i].adm_bophan != 0) {
                const maxIdKD = await AdminUser.findOne({ bophan: 1 }, {}, { sort: { stt: -1 } }) || 0;
                stt = maxIdKD.stt || 0;
                bophan = 1;
            }
            if (data[i].adm_ntd != 0) {
                const maxIdNTD = await AdminUser.findOne({ bophan: 3 }, {}, { sort: { stt: -1 } }) || 0;
                stt = maxIdNTD.stt || 0;
                bophan = 3;

            }
            if (data[i].adm_nhaplieu != 0) {
                bophan = 2;
                const maxIdNL = await AdminUser.findOne({ bophan: 2 }, {}, { sort: { stt: -1 } }) || 0;
                stt = maxIdNL.stt || 0;
            }
            let adminCheck = await fnc.getDatafindOne(AdminUser, { _id: data[i].adm_id })
            if (adminCheck == null) {
                const admin = new AdminUser({
                    _id: data[i].adm_id,
                    loginName: data[i].adm_loginname,
                    password: data[i].adm_password,
                    name: data[i].adm_name,
                    email: data[i].adm_email,
                    author: data[i].adm_author,
                    address: data[i].adm_address,
                    phone: data[i].adm_phone,
                    mobile: data[i].adm_mobile,
                    accesModule: data[i].adm_access_module,
                    accessCategory: data[i].adm_access_category,
                    date: data[i].adm_date,
                    isadmin: data[i].adm_isadmin,
                    active: data[i].adm_active,
                    langID: data[i].lang_id,
                    delete: data[i].adm_delete,
                    allCategory: data[i].adm_all_category,
                    editAll: data[i].adm_edit_all,
                    adminID: data[i].admin_id,
                    bophan: bophan,
                    stt: Number(stt) + 1 || null,
                    empID: data[i].emp_id,

                })
                await admin.save();
            }
            return fnc.setError(res, 'trùng _id')
        }


        return fnc.success(res, 'thêm thành công', data)
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

//hàm thêm dữ liệu của lĩnh vực
exports.toolLV = async(req, res, next) => {
    try {
        let result = true,
            page = 1;
        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/get_trang_vang.php?page=' + page)
            if (data.length > 0) {
                for (i = 0; i < data.length; i++) {
                    const decodedStringConten = Buffer.from(data[i].tag_content, 'base64').toString('utf-8'); // Giải mã chuỗi
                    const decodedStringNdgy = Buffer.from(data[i].tag_ndgy, 'base64').toString('utf-8'); // Giải mã chuỗi
                    let lv = new Linh_Vuc({
                        _id: data[i].id,
                        nameTag: data[i].name_tag,
                        cityTag: data[i].city_tag,
                        cateID: data[i].cate_id,
                        parentID: data[i].parent_id,
                        leverID: data[i].level_id,
                        keywordTag: data[i].keyword_tag,
                        TagContent: decodedStringConten,
                        link301: data[i].link_301,
                        tagVlgy: data[i].tag_vlgy,
                        tagNdgy: decodedStringNdgy,
                        tagIndex: data[i].tag_index,

                    })
                    await lv.save();
                }
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu category blog
exports.toolCategoryBlog = async(req, res, next) => {
    try {
        let data = await fnc.getDataAxios('https://timviec365.vn/api_nodejs/get_list_category_blog.php')
        if (data.length > 0) {
            data.forEach(async element => {
                const category = new CategoryBlog({
                    _id: element.cat_id,
                    name: element.cat_name,
                    adminID: element.admin_id,
                    langID: element.lang_id,
                    title: element.cat_title,
                    keyword: element.cat_keyword,
                    nameRewrite: element.cat_name_rewrite,
                    link: element.cat_link,
                    picture: element.cat_picture,
                    type: element.cat_type,
                    form: element.cat_form,
                    description: element.cat_description,
                    parentID: element.cat_parent_id,
                    hasChild: element.cat_has_child,
                    order: element.cat_order,
                    active: element.cat_active,
                    show: element.cat_show,
                    home: element.cat_home,
                })
                await category.save();

            });
        }
        await fnc.success(res, 'thành công', { data });

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// insert CV
exports.toolCV = async(req, res, next) => {
    try {
        const data = await fnc.getDataAxios('https://timviec365.vn/cv365/api_nodejs/get_tbl_cv.php?page=1', {});
        await data.forEach(async element => {

            const cv = new CV({
                _id: element.id,
                name: element.name,
                alias: element.alias,
                urlAlias: element.url_alias,
                urlCanonical: element.url_canonical,
                image: element.image,
                price: element.price,
                color: element.colors,
                view: element.view,
                favorite: element.love,
                download: element.download,
                vip: element.vip,
                cvIndex: element.cv_index,
                cId: element.cid,
                content: element.content,
                motaCv: element.mota_cv,
                htmlVi: JSON.stringify(element.html_vi),
                htmlEn: JSON.stringify(element.html_en),
                htmlJp: JSON.stringify(element.html_jp),
                htmlCn: JSON.stringify(element.html_cn),
                htmlKr: JSON.stringify(element.html_kr),
                cateId: element.cate_id,
                langId: element.lang_id,
                designId: element.design_id,
                exp: element.exp,
                nhuCau: element.nhucau,
                metaTitle: element.meta_title,
                metaKey: element.meta_key,
                metaDes: element.meta_des,
                thuTu: element.thutu,
                full: element.full,
                status: element.status,
                cvPoint: element.cv_point,
            });
            await CV.create(cv);

        });
        return await fnc.success(res, "Thành công", );
    } catch (err) {
        return fnc.setError(res, err.message);
    };
};

exports.toolCVCategory = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_dm_nganhcv.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const content = Buffer.from(data[i].content, 'base64').toString('utf-8');

                    const cvCate = new CVCate({
                        _id: data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        metaH1: data[i].meta_h1,
                        content,
                        cId: +data[i].cid,
                        metaTitle: data[i].meta_title,
                        metaKey: data[i].meta_key,
                        metaDes: data[i].meta_des,
                        metaTt: data[i].meta_tt,
                        status: +data[i].status,
                    })
                    await CVCate.create(cvCate);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVLang = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_dm_nn_cv.php?page=${page}`, {});
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const content = Buffer.from(data[i].content, 'base64').toString('utf-8');

                    const cvLang = new CVLang({
                        _id: data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        metaH1: data[i].meta_h1,
                        content,
                        metaTitle: data[i].meta_title,
                        metaKey: data[i].meta_key,
                        metaDes: data[i].meta_des,
                        metaTt: data[i].meta_tt,
                        status: +data[i].status,
                    })
                    await CVLang.create(cvLang);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVUV = async(req, res, next) => {
    try {
        let page = 1288;
        let result = true;
        let count = 0;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_cv_ungvien.php?page=${page}`, {});
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html = JSON.stringify(data[i].html);
                    let timeEdit = data[i].time_edit;
                    if (timeEdit == 0) {
                        timeEdit = null;
                    };
                    let timeDelete = data[i].delete_time;
                    if (timeDelete == 0) {
                        timeDelete = null;
                    }
                    const cvUV = new CVUV({
                        _id: +data[i].id,
                        userId: +data[i].uid,
                        cvId: +data[i].cvid,
                        lang: data[i].lang,
                        html,
                        nameImage: data[i].name_img,
                        timeEdit,
                        status: +data[i].status,
                        deleteCv: +data[i].delete_cv,
                        heightCv: +data[i].height_cv,
                        scan: +data[i].scan,
                        state: +data[i].state,
                        cv: +data[i].cv,
                        timeDelete,
                    })
                    count++;
                    await CVUV.create(cvUV);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
            console.log(count);
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolApplication = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_donxinviec.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {

                    const htmlVi = JSON.stringify(data[i].html_vi);
                    const htmlEn = JSON.stringify(data[i].html_en);
                    const htmlCn = JSON.stringify(data[i].html_cn);
                    const htmlJp = JSON.stringify(data[i].html_jp);
                    const htmlKr = JSON.stringify(data[i].html_kr);

                    const application = new Application({
                        _id: +data[i].id,
                        name: data[i].name,
                        nameSub: data[i].name_sub,
                        alias: data[i].alias,
                        image: data[i].image,
                        price: +data[i].price,
                        view: +data[i].view,
                        favourite: +data[i].love,
                        download: +data[i].download,
                        color: data[i].colors,
                        cateId: +data[i].cate_id,
                        exp: +data[i].exp,
                        nhuCau: +data[i].nhucau,
                        tId: +data[i].tid,
                        status: +data[i].status,
                        vip: +data[i].vip,
                        htmlVi,
                        htmlEn,
                        htmlCn,
                        htmlJp,
                        htmlKr,
                    })
                    await Application.create(application);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolApplicationUV = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_don_ungvien.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html = Buffer.from(data[i].html, 'base64').toString('utf-8');

                    const applicationUV = new ApplicationUV({
                        _id: +data[i].id,
                        userId: +data[i].uid,
                        donId: +data[i].tid,
                        status: +data[i].status,
                        lang: data[i].lang,
                        html,
                        nameImg: data[i].name_img,
                    })
                    await ApplicationUV.create(applicationUV);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolResumeUV = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_hoso_ungvien.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html = JSON.stringify(data[i].html);

                    const resumeUV = new ResumeUV({
                        _id: +data[i].id,
                        userId: +data[i].uid,
                        hoSoId: +data[i].tid,
                        status: +data[i].status,
                        lang: data[i].lang,
                        html,
                        nameImg: data[i].name_img,
                    })
                    await ResumeUV.create(resumeUV);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolLetterUV = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_thu_ungvien.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const html = JSON.stringify(data[i].html);

                    const letterUV = new LetterUV({
                        _id: +data[i].id,
                        userId: +data[i].uid,
                        donId: +data[i].tid,
                        status: +data[i].status,
                        lang: data[i].lang,
                        html,
                        nameImg: data[i].name_img,
                    })
                    await LetterUV.create(letterUV);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolLetter = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_donxinviec.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {

                    const htmlVi = JSON.stringify(data[i].html_vi);
                    const htmlEn = JSON.stringify(data[i].html_en);
                    const htmlCn = JSON.stringify(data[i].html_cn);
                    const htmlJp = JSON.stringify(data[i].html_jp);
                    const htmlKr = JSON.stringify(data[i].html_kr);

                    const letter = new Letter({
                        _id: +data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        image: data[i].image,
                        price: +data[i].price,
                        color: data[i].colors,
                        view: +data[i].view,
                        favorite: +data[i].love,
                        download: +data[i].download,
                        vip: +data[i].vip,
                        cateId: +data[i].cate_id,
                        exp: +data[i].exp,
                        nhuCau: +data[i].nhucau,
                        status: +data[i].status,
                        htmlVi,
                        htmlEn,
                        htmlCn,
                        htmlJp,
                        htmlKr,
                    })
                    await Letter.create(letter);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolResume = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_hoso.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {

                    const html = JSON.stringify(data[i].html);

                    const resume = new Resume({
                        _id: +data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        image: data[i].image,
                        price: +data[i].price,
                        color: data[i].colors,
                        view: +data[i].view,
                        favorite: +data[i].love,
                        download: +data[i].download,
                        vip: +data[i].vip,
                        cateId: +data[i].cate_id,
                        status: +data[i].status,
                        html,
                    })
                    await Resume.create(resume);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVDesign = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_dm_thietkecv.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {

                    const content = Buffer.from(data[i].content, 'base64').toString('utf-8');

                    const cvDesign = new CVDesign({
                        _id: +data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        metaH1: data[i].meta_h1,
                        content,
                        metaTitle: data[i].meta_title,
                        metaKey: data[i].meta_key,
                        metaDes: data[i].meta_des,
                        metaTt: data[i].meta_tt,
                        status: +data[i].status,
                    })
                    await CVDesign.create(cvDesign);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVGroup = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_danhmuc_cv.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {



                    const cvGroup = new CVGroup({
                        _id: +data[i].id,
                        name: data[i].name,
                        shortName: data[i].short_name,
                        alias: data[i].alias,
                        image: data[i].image,
                        sapo: data[i].sapo,
                        content: data[i].content,
                        menu: +data[i].menu,
                        sort: +data[i].sort,
                        metaTitle: data[i].meta_title,
                        metaKey: data[i].meta_key,
                        metaDes: data[i].meta_des,
                        status: +data[i].status,

                    })
                    await CVGroup.create(cvGroup);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolPriceList = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/api/get_bang_gia.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {

                    const benefits = Buffer.from(data[i].bg_quyenloi, 'base64').toString('utf-8');
                    let incentive1 = '';
                    let incentive2 = '';
                    let incentive3 = '';
                    if (data[i].bg_uudai1 != '') { incentive1 = Buffer.from(data[i].bg_uudai1, 'base64').toString('utf-8'); }
                    if (data[i].bg_uudai2 != '') { incentive2 = Buffer.from(data[i].bg_uudai2, 'base64').toString('utf-8'); }
                    if (data[i].bg_uudai3 != '') { incentive3 = Buffer.from(data[i].bg_uudai3, 'base64').toString('utf-8'); }

                    const priceList = new PriceList({
                        _id: +data[i].bg_id,
                        week: data[i].bg_tuan,
                        price: data[i].bg_gia,
                        discount: data[i].bg_chiet_khau,

                        totalAmount: data[i].bg_thanh_tien,

                        expiryDate: data[i].bg_handung,
                        the: data[i].bg_the,
                        vat: data[i].bg_vat,

                        benefits,

                        incentive1,
                        incentive2,
                        incentive3,
                        cm1: data[i].bg_cm1,
                        cm2: data[i].bg_cm2,
                        cm3: data[i].bg_cm3,
                        cmLogo: data[i].bg_cm_logo,
                        show: data[i].bg_show,
                        tk: data[i].bg_tk,
                        do: data[i].bg_do,
                        hp: data[i].bg_hp,
                        type: +data[i].bg_type,
                        qlHD: data[i].bg_ql_hd,
                        udHD: data[i].bg_ud_hd,
                        crm: +data[i].api_crm,

                    })
                    await PriceList.create(priceList);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCVSection = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const data = await fnc.getDataAxios(`https://timviec365.vn/cv365/api_nodejs/get_tbl_chuyenmuc.php?page=${page}`, {});

            if (data.length) {
                for (let i = 0; i < data.length; i++) {

                    const content = Buffer.from(data[i].content, 'base64').toString('utf-8');

                    const cvSection = new CVSection({
                        _id: +data[i].id,
                        name: data[i].name,
                        alias: data[i].alias,
                        content,
                        image: data[i].image,
                        parent: +data[i].parent,
                        menu: +data[i].menu,
                        sort: +data[i].sort,
                        metaTitle: data[i].meta_title,
                        metaKey: data[i].meta_key,
                        metaDes: data[i].meta_des,
                        status: +data[i].status,

                    })
                    await CVSection.create(cvSection);

                }
                page++;
                result = true;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};



// hàm thêm dữ liệu vào bảng blog
exports.toolBlog = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/list_blog.php', { page: page })
            let listBlog = data.data.items;
            if (listBlog.length > 0) {
                for (let i = 0; i < listBlog.length; i++) {
                    const blog = new Blog({
                        _id: listBlog[i].new_id,
                        adminID: listBlog[i].admin_id,
                        title: listBlog[i].new_title,
                        mail: listBlog[i].new_mail,
                        titleRewrite: listBlog[i].new_title_rewrite,
                        redirect301: listBlog[i].new_301,
                        canonical: listBlog[i].new_canonical,
                        picture: listBlog[i].new_picture,
                        sapo: listBlog[i].new_teaser,
                        content: listBlog[i].key_type,
                        seoTitle: listBlog[i].new_tt,
                        seoDescription: listBlog[i].new_des,
                        seoKeyword: listBlog[i].new_keyword,
                        urlVideo: listBlog[i].new_video,
                        categoryID: listBlog[i].new_category_id,
                        categoryCB: listBlog[i].new_category_cb,
                        createdAt: new Date(listBlog[i].new_date * 1000),
                        updateAt: new Date(listBlog[i].new_date_last_edit * 1000),
                        adminEdit: listBlog[i].new_admin_edit,
                        order: listBlog[i].new_order,
                        hits: listBlog[i].new_hits,
                        active: listBlog[i].new_active,
                        cateUrl: listBlog[i].new_cate_url,
                        isHot: listBlog[i].new_hot,
                        new: listBlog[i].new_new,
                        view: listBlog[i].new_view,
                        urlLq: listBlog[i].new_url_lq,
                        tagCate: listBlog[i].new_tag_cate,
                        jobKeyword: listBlog[i].new_vl,
                        suggestTitle: listBlog[i].new_tdgy,
                        suggestContent: listBlog[i].new_ndgy,
                        audio: listBlog[i].new_audio,
                    })
                    await blog.save();
                };
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu vào bảng ngành nghề viecj làm
exports.toolCategoryJob = async(req, res, next) => {
    try {

        let data = await fnc.getDataAxios('https://timviec365.vn/api/get_tbl_category.php');
        let listCategory = data;
        if (listCategory.length > 0) {
            for (let i = 0; i < listCategory.length; i++) {
                const category = new CategoryJob({
                    _id: listCategory[i].cat_id,
                    name: listCategory[i].cat_name,
                    title: listCategory[i].cat_title,
                    tags: data[i].cat_tags,
                    description: listCategory[i].cat_description,
                    keyword: data[i].cat_keyword,
                    des: listCategory[i].cat_mota,
                    parentID: listCategory[i].cat_parent_id,
                    count: listCategory[i].cat_count,
                    order: listCategory[i].cat_order,
                    active: listCategory[i].cat_active,
                    hot: listCategory[i].cat_hot,
                })
                await category.save();
            };
        }
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu vào kho ảnh
exports.toolListImg = async(req, res, next) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/get_usc_images.php?page=' + page, {})
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const image_list = data[i].list_img.split(',');
                    const videoList = data[i].list_video.split(',');
                    const resultImg = [];
                    const resultVideo = [];
                    let id_counter = 1;

                    for (let j = 0; j < image_list.length; j++) {
                        const image_name = image_list[i];

                        const image_object = {
                            id: id_counter,
                            name: image_name,
                            type: 1,
                            size: data[i].arr_img[j].size
                        };

                        resultImg.push(image_object);
                        id_counter++;
                    }
                    for (let j = 0; j < videoList.length; j++) {
                        const videoName = videoList[i];

                        const videoObject = {
                            id: id_counter,
                            name: videoName,
                            type: 1,
                            size: data[i].arr_video[j].size
                        };

                        resultVideo.push(videoObject);
                        id_counter++;
                    }

                    await Users.updateOne({ idTimViec365: data[i].usc_id, type: 1 }, {
                        $set: {
                            'inForCompany.comVideos': resultImg,
                            'inForCompany.comImages': resultVideo,
                        }
                    });

                };
                page += 1;
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu vào điểm company
exports.toolPointUse = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/get_tbl_point_used.php?page=' + page)
            listKey = data;
            if (listKey.length > 0) {

                for (let i = 0; i < listKey.length; i++) {
                    let useDay = null;
                    if (listKey[i].used_day != 0) {
                        useDay = new Date(listKey[i].used_day * 1000)
                    }

                    let id = await fnc.getMaxID(PointUsed) || 0;
                    const key = new PointUsed({
                        _id: Number(id) + 1,
                        uscID: listKey[i].usc_id,
                        useID: listKey[i].use_id,
                        point: listKey[i].point,
                        type: listKey[i].type,
                        typeErr: listKey[i].type_err,
                        noteUV: listKey[i].note_uv,
                        usedDay: useDay,
                        returnPoint: listKey[i].return_point,
                        adminID: listKey[i].admin_id,
                        ipUser: listKey[i].ip_user,
                    })
                    await key.save();
                }
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu vào điểm company
exports.toolPoinCompany = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/get_tbl_point_company.php?page=' + page)
            listKey = data;
            if (listKey.length > 0) {

                for (let i = 0; i < listKey.length; i++) {
                    let dayreset = null;
                    let dayreset0 = null;
                    if (listKey[i].day_reset_point != 0) {
                        dayreset = new Date(listKey[i].day_reset_point * 1000)
                    }
                    if (listKey[i].ngay_reset_diem_ve_0 != 0) {
                        dayreset0 = new Date(listKey[i].ngay_reset_diem_ve_0 * 1000)
                    }
                    let id = await fnc.getMaxID(PointCompany) || 0;
                    const key = new PointCompany({
                        _id: Number(id) + 1,
                        uscID: listKey[i].usc_id,
                        point: listKey[i].point,
                        pointCompany: listKey[i].point_usc,
                        reservationPoint: listKey[i].point_bao_luu,
                        note: listKey[i].chu_thich_bao_luu,
                        dateResetPoint: dayreset,
                        dateResetPointToZero: dayreset0,
                    })
                    await key.save();
                }
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu vào ngành đơn 
exports.toolNgangDon = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/cv365/api_nodejs/get_dm_nganhdon.php?page=' + page)
            listKey = data;
            if (listKey.length > 0) {

                for (let i = 0; i < listKey.length; i++) {
                    const decodedStringTeaser = Buffer.from(listKey[i].content, 'base64').toString('utf-8'); // Giải mã chuỗi
                    const key = new NgangDon({
                        _id: listKey[i].id,
                        name: listKey[i].name,
                        alias: listKey[i].alias,
                        metaH1: listKey[i].meta_h1,
                        content: decodedStringTeaser,
                        cId: listKey[i].cid,
                        metaTitle: listKey[i].meta_title,
                        metaKey: listKey[i].meta_key,
                        metaDes: listKey[i].meta_des,
                        metaTt: listKey[i].meta_tt,
                        status: listKey[i].status,
                    })
                    await key.save();
                }
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}


// hàm thêm dữ liệu vào ngành thư 
exports.toolNgangThu = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/cv365/api_nodejs/get_dm_nganhthu.php?page=' + page)
            listKey = data;
            if (listKey.length > 0) {

                for (let i = 0; i < listKey.length; i++) {
                    const decodedStringTeaser = Buffer.from(listKey[i].content, 'base64').toString('utf-8'); // Giải mã chuỗi
                    const key = new NgangThu({
                        _id: listKey[i].id,
                        name: listKey[i].name,
                        alias: listKey[i].alias,
                        metaH1: listKey[i].meta_h1,
                        content: decodedStringTeaser,
                        cId: listKey[i].cid,
                        metaTitle: listKey[i].meta_title,
                        metaKey: listKey[i].meta_key,
                        metaDes: listKey[i].meta_des,
                        metaTt: listKey[i].meta_tt,
                        status: listKey[i].status,
                    })
                    await key.save();
                }
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

// hàm thêm dữ liệu vào bảng ứng viên ứng tuyển (Apply for Job)
exports.toolApplyForJob = async(req, res, next) => {
    try {
        let result = true,
            page = 1;
        let timePV, timeTVS, timeTVE

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/get_nop_ho_so.php?page=' + page)
            listKey = data;
            if (listKey.length > 0) {

                for (let i = 0; i < listKey.length; i++) {
                    if (Number(listKey[i].nhs_time_pv == 0)) {
                        timePV = null
                    } else timePV = new Date(Number(listKey[i].nhs_time_pv) * 1000)

                    if (Number(listKey[i].nhs_time_pv == 0)) {
                        timeTVS = null
                    } else timeTV = new Date(Number(listKey[i].nhs_time_tvs) * 1000)

                    if (Number(listKey[i].nhs_time_pv == 0)) {
                        timeTVE = null
                    } else timeTVE = new Date(Number(listKey[i].nhs_time_tve) * 1000)

                    const key = new ApplyForJob({
                        _id: Number(listKey[i].nhs_id),
                        userID: Number(listKey[i].nhs_use_id),
                        newID: Number(listKey[i].nhs_new_id),
                        time: new Date(Number(listKey[i].nhs_time) * 1000),
                        active: Number(listKey[i].nhs_active),
                        kq: Number(listKey[i].nhs_kq),
                        timePV: timePV,
                        timeTVS: timeTVS,
                        timeTVE: timeTVE,
                        text: listKey[i].nhs_text,
                        cv: listKey[i].nhs_cv,
                        type: Number(listKey[i].check_ut)
                    })
                    await key.save();
                }
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

//hàm thêm dữ liệu vào bảng ứng viên lưu việc làm (UserSavePost)
exports.toolUserSavePost = async(req, res, next) => {
    try {
        let result = true,
            page = 1;

        do {
            let data = await fnc.getDataAxios('https://timviec365.vn/api/get_luu_viec_lam.php?page=' + page)
            listKey = data;
            if (listKey.length > 0) {

                for (let i = 0; i < listKey.length; i++) {
                    const key = new UserSavePost({
                        _id: Number(listKey[i].id),
                        userID: Number(listKey[i].use_id),
                        newID: Number(listKey[i].new_id),
                        saveTime: new Date(Number(listKey[i].save_time) * 1000),
                    })
                    await key.save();
                }
                page++
                console.log(page)
            } else result = false;
        }
        while (result)
        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}