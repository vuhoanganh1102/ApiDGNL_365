const functions = require("../../services/functions");
const Category = require("../../models/Raonhanh365/Category");
const New = require("../../models/Raonhanh365/New");
const CategoryRaoNhanh365 = require("../../models/Raonhanh365/Category");
const User = require("../../models/Users");
const RN365_AdminUser = require('../../models/Raonhanh365/Admin/AdminUser')
const LoveNews = require("../../models/Raonhanh365/LoveNews");
const Bidding = require("../../models/Raonhanh365/Bidding");
const LikeRN = require("../../models/Raonhanh365/Like");
const ApplyNewsRN = require("../../models/Raonhanh365/ApplyNews");
const raoNhanh = require("../../services/rao nhanh/raoNhanh");
const Comments = require("../../models/Raonhanh365/Comments");
const Evaluate = require("../../models/Raonhanh365/Evaluate");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Users = require("../../models/Users");
const ApplyNews = require("../../models/Raonhanh365/ApplyNews");
const AdminUser = require("../../models/Raonhanh365/Admin/AdminUser");
const NetworkOperator = require("../../models/Raonhanh365/NetworkOperator");
const History = require("../../models/Raonhanh365/History")
const PriceList = require("../../models/Raonhanh365/PriceList")
const PushNewsTime = require('../../models/Raonhanh365/PushNewsTime');
const { default: axios } = require("axios");
const md5 = require("md5");
const CateDetail = require("../../models/Raonhanh365/CateDetail");
dotenv.config();
// đăng tin
exports.postNewMain = async (req, res, next) => {
    try {
        let buySell = 2;
        let type = req.user.data.type;
        if (type === 1) {
            type = 1
        } else {
            type = 0
        }
        let img = req.files.img;
        let video = req.files.video;
        let CV = req.files.CV;
        let diachi = [];
        let userID = req.user.data.idRaoNhanh365;
        let request = req.body;
        let cateID = request.cateID;
        let title = request.title;
        let money = request.money;
        let endvalue = request.endvalue;
        let downPayment = request.downPayment;
        let dc_unit = request.dc_unit;
        let until = request.until;
        let detailCategory = request.detailCategory;
        let name = request.name;
        let phone = request.phone;
        let email = request.email;
        let address = request.address;
        let city = request.city;
        let district = request.district;
        let ward = request.ward;
        let apartmentNumber = request.apartmentNumber;
        let status = request.status;
        let free = request.free;
        let timeSell = request.timeSell;
        let totalSold = request.totalSold;
        let quantityMin = request.quantityMin;
        let quantityMax = request.quantityMax;
        let com_city = request.com_city;
        let com_district = request.com_district;
        let com_ward = request.com_ward;
        let com_address_num = request.com_address_num;
        let timePromotionStart = request.timePromotionStart;
        let timePromotionEnd = request.timePromotionEnd;
        let productType = request.productType;
        let productGroup = request.productGroup;
        let poster = request.poster;
        let description = request.description;
        let hashtag = request.hashtag;
        let order = request.order;
        let the_tich = request.the_tich;
        let warranty = request.warranty;
        let loai_noithat = request.loai_noithat;
        if (address && address.length > 0) {
            for (let i = 0; i < address.length; i++) {
                diachi.push(address[i])
            }
        }
        const _id = await functions.getMaxID(New) + 1
        req.info = {
            _id,
            title,
            userID,
            cateID,
            address: diachi,
            money,
            endvalue,
            downPayment,
            until,
            buySell,
            detailCategory,
            name,
            phone,
            email,
            city,
            district,
            ward,
            apartmentNumber,
            status,
            free,
            timeSell,
            totalSold,
            quantityMin,
            quantityMax,
            com_city,
            com_district,
            com_ward,
            com_address_num,
            timePromotionStart,
            timePromotionEnd,
            productType,
            productGroup,
            poster,
            description,
            hashtag,
            order,
            img,
            video,
            CV,
            the_tich,
            warranty,
            dc_unit,
            type,
            sold: 0
        };
        return next();
    } catch (err) {
        console.error(err);
        return functions.setError(res, err);
    }
};
// đăng tin chung cho tat ca cac tin
exports.postNewsGeneral = async (req, res, next) => {
    try {
        let exists = await Category.find({ _id: req.cateID });
        let fields = req.info;
        if (exists) {
            let request = req.body;

            //cac truong khi dang tin do dien tu
            let fieldsElectroniceDevice = {
                microprocessor: request.microprocessor,
                ram: request.ram,
                hardDrive: request.hardDrive,
                typeHardrive: request.typeHardrive,
                screen: request.screen,
                size: request.size,
                brand: request.brand,
                machineSeries: request.machineSeries,
                warranty: request.warranty,
                device: request.device,
                capacity: request.capacity,
                sdung_sim: request.sdung_sim,
                phien_ban: request.phien_ban,
            };

            //cac truong khi dang tin do xe co
            let fieldsVehicle = {
                hang: request.hang,
                loai_xe: request.loai_xe,
                xuat_xu: request.xuat_xu,
                mau_sac: request.mau_sac,
                kich_co: request.kich_co,
                chat_lieu_khung: request.chat_lieu_khung,
                baohanh: request.baohanh,
                dong_xe: request.dong_xe,
                nam_san_xuat: request.nam_san_xuat,
                dung_tich: request.dung_tich,
                td_bien_soxe: request.td_bien_soxe,
                phien_ban: request.phien_ban,
                hop_so: request.hop_so,
                nhien_lieu: request.nhien_lieu,
                kieu_dang: request.kieu_dang,
                so_cho: request.so_cho,
                trong_tai: request.trong_tai,
                loai_linhphu_kien: request.loai_linhphu_kien,
                so_km_da_di: request.so_km_da_di,
                loai_noithat: request.loai_noithat
            };

            // cac truong khi dang tin bat dong san
            let fieldsRealEstate = {
                ten_toa_nha: request.ten_toa_nha,
                td_macanho: request.td_macanho,
                ten_phan_khu: request.ten_phan_khu,
                td_htmch_rt: request.td_htmch_rt,
                so_pngu: request.so_pngu,
                so_pve_sinh: request.so_pve_sinh,
                tong_so_tang: request.tong_so_tang,
                huong_chinh: request.huong_chinh,
                giay_to_phap_ly: request.giay_to_phap_ly,
                tinh_trang_noi_that: request.tinh_trang_noi_that,
                dac_diem: request.dac_diem,
                dien_tich: request.dien_tich,
                dientichsd: request.dientichsd,
                chieu_dai: request.chieu_dai,
                chieu_rong: request.chieu_rong,
                tinh_trang_bds: request.tinh_trang_bds,
                td_block_thap: request.td_block_thap,
                tang_so: request.tang_so,
                loai_hinh_canho: request.loai_hinh_canho,
                loaihinh_vp: request.loaihinh_vp,
                loai_hinh_dat: request.loai_hinh_dat,
                kv_thanhpho: request.kv_thanhpho,
                kv_thanhpho: request.kv_thanhpho,
                kv_quanhuyen: request.kv_quanhuyen,
                kv_phuongxa: request.kv_phuongxa,
                can_ban_mua: request.can_ban_mua,
                dia_chi: request.dia_chi,
                huong_ban_cong: request.huong_ban_cong,
                cangoc: request.cangoc,
            };
            // cac truong cua ship
            let fieldsShip = {
                product: request.product,
                timeStart: Date(request.timeStart),
                timeEnd: Date(request.timeEnd),
                allDay: request.allDay,
                vehicloType: request.vehicloType,
            };
            //cac truong cua danh muc thu cung
            let fieldsPet = {
                kindOfPet: req.body.kindOfPet,
                age: req.body.age,
                gender: req.body.gender,
                weigth: req.body.weigth,
            };

            let fieldsbeautifull = {
                loai_hinh_sp: req.body.loai_hinh_sp,
                loai_sanpham: req.body.loai_sanpham,
                hang_vattu: req.body.hang_vattu,

            };
            let fieldwareHouse = {
                loai_thiet_bi: req.body.loai_thiet_bi,
                hang: req.body.hang,
                cong_suat: req.body.cong_suat,
                dung_tich: req.body.dung_tich,
                khoiluong: req.body.khoiluong,
                loai_chung: req.body.loai_chung,
                loai_sanpham: req.body.loai_sanpham,

            };

            let noiThatNgoaiThat = {
                chat_lieu: req.body.chat_lieu,
                kich_co: req.body.kich_co,
                hinhdang: req.body.hinhdang,
                brand: req.body.brand,
            }
            //cac truong cua danh muc cong viec
            let fieldsJob = {
                jobType: req.body.jobType,
                jobDetail: req.body.jobDetail,
                jobKind: req.body.jobKind,
                minAge: req.body.minAge,
                maxAge: req.body.maxAge,
                salary: req.body.salary,
                gender: req.body.gender,
                exp: req.body.exp,
                level: req.body.level,
                degree: req.body.degree,
                skill: req.body.skill,
                quantity: req.body.quantity,
                city: req.body.city,
                district: req.body.district,
                ward: req.body.ward,
                addressNumber: req.body.addressNumber,
                payBy: req.body.payBy,
                benefit: req.body.benefit,
                cv: req.body.cv,
                salary_fr: req.body.salary_fr,
                salary_to: req.body.salary_to,
            };
            let fieldsinfoSell = {
                groupType: req.body.groupType,
                classify: req.body.classify,
                loai: req.body.loai,
                numberWarehouses: req.body.numberWarehouses,
                promotionType: req.body.promotionType,
                promotionValue: req.body.promotionValue,
                transport: req.body.transport,
                transportFee: req.body.transportFee,
                productValue: req.body.productValue,
                untilMoney: req.body.untilMoney,
                untilTranpost: req.body.untilTranpost,
                tgian_bd: req.body.tgian_bd,
                tgian_kt: req.body.tgian_kt,
                dia_chi: req.body.dia_chi,
            }
            fields.electroniceDevice = fieldsElectroniceDevice;
            fields.vehicle = fieldsVehicle;
            fields.realEstate = fieldsRealEstate;
            fields.ship = fieldsShip;
            fields.pet = fieldsPet;
            fields.Job = fieldsJob;
            fields.beautifull = fieldsbeautifull;
            fields.wareHouse = fieldwareHouse;
            fields.infoSell = fieldsinfoSell;
            fields.noiThatNgoaiThat = noiThatNgoaiThat;
            req.fields = fields;
            return next();
        }
        return functions.setError(res, "Category not found!", 505);
    } catch (err) {
        console.error(err);
        return functions.setError(res, err);
    }
};
// tạo tin bán
exports.createNews = async (req, res, next) => {
    try {
        let fields = req.fields;
        let linkTitle = await raoNhanh.createLinkTilte(fields.title)
        fields.linkTitle = linkTitle
        let nameCate = await raoNhanh.getNameCate(fields.cateID, 1)
        let folder = await raoNhanh.checkFolderCateRaoNhanh(nameCate)
        let image = [];
        if (fields.img && fields.img.length) {
            for (let i = 0; i < fields.img.length; i++) {
                let img = await raoNhanh.uploadFileRaoNhanh(folder, fields.userID, fields.img[i], ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.pdf'])
                if (img) {
                    image.push({
                        nameImg: img
                    })
                } else {
                    return functions.setError(res, 'upload file failed', 400)
                }
            }
            fields.img = image;
        }
        if (fields.video) {
            let check = await raoNhanh.uploadFileRaoNhanh(folder, fields.userID, fields.video, ['.mp4', '.avi', '.wmv', '.mov'])
            if (check === false) return functions.setError(res, 'upload file failed', 400)

            fields.video = check;
        }
        if (fields.CV && fields.cateID === 119) {
            let check = await raoNhanh.uploadFileRaoNhanh('timviec', fields.userID, fields.CV, ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.pdf', '.jpg', '.docx', '.png'])
            if (check === false) return functions.setError(res, 'upload file failed', 400)
            fields['Job.cv'] = check
        }

        fields.createTime = new Date();

        const news = new New(fields);
        await news.save();
        return functions.success(res, "create news success");
    } catch (err) {
        console.error(err);
        return functions.setError(res, err);
    }
};
//chỉnh sửa tin bán
exports.updateNews = async (req, res, next) => {
    try {
        let idNews = Number(req.body.news_id);
        if (!idNews) return functions.setError(res, "Missing input news_id!", 405);
        let existsNews = await New.findById(idNews);
        let fields = req.fields;
        let linkTitle = await raoNhanh.createLinkTilte(fields.title)
        fields.linkTitle = linkTitle
        let nameCate = await raoNhanh.getNameCate(fields.cateID, 1)
        let folder = await raoNhanh.checkFolderCateRaoNhanh(nameCate)
        let image = [];
        if (fields.img && fields.img.length) {
            for (let i = 0; i < fields.img.length; i++) {
                let img = await raoNhanh.uploadFileRaoNhanh(folder, fields.userID, fields.img[i], ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.pdf'])
                if (img) {
                    image.push({
                        nameImg: img
                    })
                } else {
                    return functions.setError(res, 'upload file failed', 400)
                }
            }
            fields.img = image;
        }
        if (fields.video) {
            let check = await raoNhanh.uploadFileRaoNhanh(folder, fields.userID, fields.video, ['.mp4', '.avi', '.wmv', '.mov'])
            if (check === false) return functions.setError(res, 'upload file failed', 400)

            fields.video = check;
        }
        if (fields.CV && fields.cateID === 119) {
            let check = await raoNhanh.uploadFileRaoNhanh('timviec', fields.userID, fields.CV, ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.pdf', '.jpg', '.docx', '.png'])
            if (check === false) return functions.setError(res, 'upload file failed', 400)
            fields['Job.cv'] = check
        }
        if (existsNews) {
            // xoa truong _id
            delete fields._id;
            await New.findByIdAndUpdate(idNews, fields);
            return functions.success(res, "News edited successfully");
        }
        return functions.setError(res, "News not found!", 505);
    } catch (err) {
        console.error(err);
        return functions.setError(res, err);
    }
};
// ẩn tin
exports.hideNews = async (req, res, next) => {
    try {
        let idNews = Number(req.body.news_id);
        if (!idNews) return functions.setError(res, "Missing input news_id!", 405);
        let existsNews = await New.findOne({ _id: idNews });
        if (existsNews) {
            let active = 0;
            if (existsNews.active == 0) {
                active = 1;
            }
            await New.findByIdAndUpdate(idNews, {
                active: active,
                updateTime: new Date(Date.now()),
            });

            return functions.success(res, "Hide news successfully");
        }
        return functions.setError(res, "News not found!", 505);
    } catch (err) {
        console.error(err);
        return functions.setError(res, err);
    }
};
// ghim tin
exports.pinNews = async (req, res, next) => {
    try {
        let idNews = req.body.id;
        let userID = req.user.data.idRaoNhanh365;
        if (!idNews) return functions.setError(res, "Missing input news_id", 405);
        let {
            type,
            tienthanhtoan,
            so_ngay
        } = req.body;
        let existsNews = await New.findOne({ _id: idNews, userID });
        if (existsNews) {
            let now = new Date();
            let so_ngayg = so_ngay * 7;
            let ngay_kthuc = now.getTime() + 86400 * so_ngay;

            if (type == 1) {
                var fields = {
                    pinHome: 1,
                    numberDayPinning: so_ngayg,
                    timeStartPinning: new Date().getTime() / 1000,
                    dayStartPinning: new Date().getTime() / 1000,
                    dayEndPinning: new Date(ngay_kthuc).getTime() / 1000,
                    moneyPinning: tienthanhtoan,
                };
            } else {
                var fields = {
                    pinCate: 5,
                    numberDayPinning: so_ngay,
                    timeStartPinning: new Date().getTime() / 1000,
                    dayStartPinning: new Date().getTime() / 1000,
                    dayEndPinning: new Date(ngay_kthuc).getTime() / 1000,
                    moneyPinning: tienthanhtoan,
                };
            }
            await New.findByIdAndUpdate(idNews, fields);
            await Users.findOneAndUpdate({ idRaoNhanh365: userID }, {
                $inc: { 'inforRN365.money': -tienthanhtoan }
            })
            let hisID = await functions.getMaxID(History) + 1;
            await History.create({
                _id: hisID,
                userId: userID,
                price: tienthanhtoan,
                priceSuccess: tienthanhtoan,
                time: new Date(),
                type: req.user.data.type,
                content: 'Ghim tin đăng ',
                distinguish: 1
            })
            return functions.success(res, "Pin news successfully");
        }
        return functions.setError(res, "News not found!", 505);
    } catch (err) {
        console.error(err);
        return functions.setError(res, err);
    }
};
// đẩy tin
exports.pushNews = async (req, res, next) => {
    try {
        let idNews = Number(req.body.news_id);
        if (!idNews) return functions.setError(res, "Missing input news_id!", 405);
        let {
            dayStartPinning,
            timeStartPinning,
            numberDayPinning,
            moneyPinning,
            timePinning,
            pushHome,
            timePushNew
        } = req.body;
        let existsNews = await New.find({ _id: idNews });
        if (existsNews) {
            let now = new Date();
            if (!timeStartPinning) timeStartPinning = now;
            if (!dayStartPinning) dayStartPinning = now;
            let fields = {
                timePushNew: timePushNew,
                timePinning: timePinning,
                moneyPinning: moneyPinning,
                numberDayPinning: numberDayPinning,
                timeStartPinning: timeStartPinning,
                dayStartPinning: dayStartPinning,
                pushHome: 1,
                updateTime: now,
            };
            await New.findByIdAndUpdate(idNews, fields);
            return functions.success(res, "Push news successfully");
        }
        return functions.setError(res, "News not found!", 505);
    } catch (err) {
        console.error(err);
        return functions.setError(res, err);
    }
};
// tìm kiếm tin bán
exports.searchSellNews = async (req, res, next) => {
    try {
        if (req.body) {
            if (!req.body.page) {
                return functions.setError(res, "Missing input page", 401);
            }
            if (!req.body.pageSize) {
                return functions.setError(res, "Missing input pageSize", 402);
            }
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let idNews = req.body.idNews;
            let title = req.body.title;
            let description = req.body.description;
            let city = req.body.city;
            let district = req.body.district;
            let ward = req.body.ward;
            let listNews = [];
            let listCondition = {};
            let cateID = Number(req.body.cateID);
            let buySell = Number(req.body.buySell);

            // dua dieu kien vao ob listCondition
            if (idNews) listCondition._id = idNews;
            if (cateID) listCondition.cateID = cateID;
            if (buySell) listCondition.buySell = buySell;
            if (title) listCondition.title = new RegExp(title, "i");
            if (description) listCondition.description = new RegExp(description);
            if (city) listCondition.city = Number(city);
            if (district) listCondition.district = Number(district);
            if (ward) listCondition.ward = Number(ward);

            let fieldsGet = {
                userID: 1,
                title: 1,
                linkTitle: 1,
                money: 1,
                endvalue: 1,
                downPayment: 1,
                until: 1,
                cateID: 1,
                type: 1,
                image: 1,
                video: 1,
                buySell: 1,
                createTime: 1,
                updateTime: 1,
                city: 1,
                district: 1,
            };
            listNews = await functions.pageFindWithFields(
                New,
                listCondition,
                fieldsGet,
                { _id: 1 },
                skip,
                limit
            );
            totalCount = await New.countDocuments(listCondition);
            return functions.success(res, "get buy news success", {
                data: { totalCount, listNews },
            });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (err) {
        console.log(err);
        return functions.setError(res, err);
    }
};
// xoá tin
exports.deleteNews = async (req, res) => {
    try {
        let idNews = req.query.idNews;
        let buySell = 2;
        if (idNews) {
            let news = await functions.getDataDeleteOne(New, {
                _id: idNews,
                buySell: buySell,
            });
            if (news.deletedCount === 1) {
                return functions.success(res, "Delete sell news by id success");
            } else {
                return functions.success(res, "Buy news not found");
            }
        } else {
            if (!(await functions.getMaxID(New))) {
                functions.setError(res, "No news existed", 513);
            } else {
                New.deleteMany({ buySell: buySell })
                    .then(() => functions.success(res, "Delete all news successfully"))
                    .catch((err) => functions.setError(res, err.message, 514));
            }
        }
    } catch (err) {
        console.error(err);
        return functions.setError(res, "Error from server", 500);
    }
};
// trang chủ
exports.getNew = async (req, res, next) => {
    try {
        let userIdRaoNhanh = await raoNhanh.checkTokenUser(req, res, next);
        let searchItem = {
            _id: 1,
            title: 1,
            linkTitle: 1,
            address: 1,
            money: 1,
            createTime: 1,
            cateID: 1,
            pinHome: 1,
            userID: 1,
            img: 1,
            updateTime: 1,
            user: { _id: 1, idRaoNhanh365: 1, phone: 1, isOnline: 1, userName: 1, avatarUser: 1, type: 1, chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1, 'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1 },
            district: 1,
            ward: 1,
            city: 1,
            endvalue: 1,

            until: 1,
            endvalue: 1,
            type: 1,
            free: 1,
            link: 1
        };
        let data = await New.aggregate([
            {
                $sort: { pinHome: -1 },
            },
            {
                $match: { buySell: 2, sold: 0, active: 1 },
            },
            {
                $limit: 50,
            },
            {
                $sort: { createTime: -1, order: -1 }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: 'userID',
                    foreignField: "idRaoNhanh365",
                    as: "user",
                },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $project: searchItem,
            },

        ]);


        for (let i = 0; i < data.length; i++) {
            data[i].link = `https://raonhanh365.vn/${data[i].linkTitle}-c${data[i]._id}.html`;
            data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, 2)
            data[i].islove = 0;
            if (userIdRaoNhanh) {
                let dataLoveNew = await LoveNews.find({ id_user: userIdRaoNhanh });
                for (let j = 0; j < dataLoveNew.length; j++) {
                    if (data[i]._id === dataLoveNew[j].id_new) {
                        data[i].islove = 1;
                    }
                    if (!data[i].islove || data[i].islove !== 1) {
                        data[i].islove = 0;
                    }
                }
            }
        }
        return functions.success(res, "get data success", { data });
    } catch (error) {
        console.error(error);
        return functions.setError(res, error);
    }
};
// tìm kiếm tin
exports.searchNew = async (req, res, next) => {
    try {
        let link = req.body.link;
        let buySell = 1;
        let searchItem = {};
        let {
            search_key,
            cateID,
            brand,
            startvalue,
            wattage,
            microprocessor,
            ram,
            hardDrive,
            typeHardrive,
            screen,
            size,
            Jobcity,
            Jobdistrict,
            Jobward,
            interior,
            device,
            color,
            capacity,
            connectInternet,
            generalType,
            resolution,
            machineSeries,
            engine,
            accessary,
            han_su_dung,
            com_city,
            com_district,
            com_ward,
            com_address_num,
            productType,
            productGroup,
            warranty,
            loai_sanpham,
            money,
            endvalue,
            frameMaterial,
            volume,
            manufacturingYear,
            fuel,
            numberOfSeats,
            gearBox,
            style,
            payload,
            carNumber,
            km,
            origin,
            version,
            statusSell,
            nameApartment,
            numberOfStoreys,
            storey,
            mainDirection,
            balconyDirection,
            legalDocuments,
            statusInterior,
            acreage,
            length,
            width,
            buyingArea,
            kvCity,
            kvDistrict,
            kvWard,
            numberToletRoom,
            numberBedRoom,
            typeOfApartment,
            special,
            statusBDS,
            codeApartment,
            cornerUnit,
            nameArea,
            useArea,
            landType,
            officeType,
            block,
            kindOfPet,
            age,
            gender,
            exp,
            level,
            degree,
            jobType,
            jobDetail,
            jobKind,
            salary,
            benefit,
            skill,
            city,
            district,
            ward,
            payBy,
            phien_ban,
            sdung_sim,
            hang,
            loai_xe,
            xuat_xu,
            mau_sac,
            kich_co,
            chat_lieu_khung,
            baohanh,
            dong_xe,
            nam_san_xuat,
            dung_tich,
            td_bien_soxe,
            kieu_dang,
            hop_so,
            nhien_lieu,
            so_cho,
            trong_tai,
            loai_linhphu_kien,
            so_km_da_di,
            ten_toa_nha,
            td_macanho,
            ten_phan_khu,
            td_htmch_rt,
            so_pngu,
            so_pve_sinh,
            tong_so_tang,
            huong_chinh,
            giay_to_phap_ly,
            tinh_trang_noi_that,
            dac_diem,
            dien_tich,
            dientichsd,
            chieu_dai,
            chieu_rong,
            tinh_trang_bds,
            td_block_thap,
            tang_so,
            loai_hinh_canho,
            loaihinh_vp,
            loai_hinh_dat,
            kv_thanhpho,
            kv_quanhuyen,
            kv_phuongxa,
            product,
            timeStart,
            timeEnd,
            allDay,
            vehicloType,
            loai_hinh_sp,
            hang_vattu,
            loai_thiet_bi,
            cong_suat,
            khoiluong,
            loai_chung,
        } = req.body;
        let page = req.body.page || 1;
        let pageSize = Number(req.body.pageSize) || 50;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        if (link === "tat-ca-tin-dang-ban.html") {
            buySell = 2;
            searchItem = {
                _id: 1,
                title: 1,
                linkTitle: 1,
                address: 1,
                money: 1,
                createTime: 1,
                cateID: 1,
                pinHome: 1,
                userID: 1,
                img: 1,
                updateTime: 1,
                user: { _id: 1, idRaoNhanh365: 1, isOnline: 1, lastActivedAt: 1, time_login: 1, phone: 1, userName: 1, avatarUser: 1, type: 1, chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1, 'inforRN365.store_name': 1 },
                district: 1,
                ward: 1,
                city: 1,
                endvalue: 1,
                islove: '0',
                until: 1,
                endvalue: 1,
                type: 1,
                free: 1,
                viewCount: 1,
                buySell: 1
            };
        } else if (link === "tat-ca-tin-dang-mua.html") {
            buySell = 1;
            searchItem = {
                _id: 1,
                title: 1,
                linkTitle: 1,
                address: 1,
                money: 1,
                createTime: 1,
                cateID: 1,
                pinHome: 1,
                userID: 1,
                img: 1,
                updateTime: 1,
                user: { _id: 1, idRaoNhanh365: 1, isOnline: 1, lastActivedAt: 1, time_login: 1, phone: 1, userName: 1, avatarUser: 1, type: 1, chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1, 'inforRN365.store_name': 1 },
                district: 1,
                ward: 1,
                city: 1,
                endvalue: 1,
                islove: 1,
                until: 1,
                endvalue: 1,
                type: 1,
                free: 1,
                bidding: 1,
                viewCount: 1,
                buySell: 1
            };
        } else {
            searchItem = {
                _id: 1,
                title: 1,
                linkTitle: 1,
                address: 1,
                money: 1,
                createTime: 1,
                cateID: 1,
                pinHome: 1,
                userID: 1,
                img: 1,
                updateTime: 1,
                user: { _id: 1, idRaoNhanh365: 1, isOnline: 1, phone: 1, userName: 1, avatarUser: 1, type: 1, chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1, 'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1 },
                district: 1,
                ward: 1,
                city: 1,
                endvalue: 1,
                islove: 1,
                until: 1,
                type: 1,
                free: 1,
                viewCount: 1,
                buySell: 1
            };
        }
        let condition = { buySell };
        if (search_key) {
            let query = raoNhanh.createLinkTilte(search_key);
            condition.linkTitle = { $regex: `.*${query}.*` };
        }
        if (cateID) condition.cateID = Number(cateID);
        if (brand) condition.brand = Number(brand);
        if (wattage) condition.wattage = Number(wattage);
        if (han_su_dung) condition.han_su_dung = Number(han_su_dung);
        if (city) condition.city = Number(city);
        if (district) condition.district = Number(district);
        if (ward) condition.ward = Number(ward);
        if (com_address_num) condition.com_address_num = Number(com_address_num);
        if (productType) condition.productType = Number(productType);
        if (productGroup) condition.productGroup = Number(productGroup);
        if (baohanh) condition.baohanh = Number(baohanh);
        if (microprocessor)
            condition["electroniceDevice.microprocessor"] = Number(microprocessor);
        if (ram) condition["electroniceDevice.ram"] = Number(ram);
        if (hardDrive) condition["electroniceDevice.hardDrive"] = Number(hardDrive);
        if (typeHardrive)
            condition["electroniceDevice.typeHardrive"] = Number(typeHardrive);
        if (screen) condition["electroniceDevice.screen"] = Number(screen);
        if (size) condition["electroniceDevice.size"] = Number(size);
        if (brand) condition["electroniceDevice.brand"] = Number(brand);
        if (warranty) condition["electroniceDevice.warranty"] = Number(warranty);
        if (device) condition["electroniceDevice.device"] = Number(device);
        if (capacity) condition["electroniceDevice.capacity"] = Number(capacity);
        if (sdung_sim) condition["electroniceDevice.sdung_sim"] = Number(sdung_sim);
        if (phien_ban) condition["electroniceDevice.phien_ban"] = Number(phien_ban);
        if (machineSeries)
            condition["electroniceDevice.machineSeries"] = Number(machineSeries);
        if (hang) condition["vehicle.hang"] = Number(hang);
        if (loai_xe) condition["vehicle.loai_xe"] = Number(loai_xe);
        if (xuat_xu) condition["vehicle.xuat_xu"] = Number(xuat_xu);
        if (mau_sac) condition["vehicle.mau_sac"] = Number(mau_sac);
        if (kich_co) condition["vehicle.kich_co"] = Number(kich_co);
        if (chat_lieu_khung) condition["vehicle.chat_lieu_khung"] = Number(chat_lieu_khung);
        if (baohanh) condition["vehicle.baohanh"] = Number(baohanh);
        if (dong_xe) condition["vehicle.dong_xe"] = Number(dong_xe);
        if (nam_san_xuat) condition["vehicle.nam_san_xuat"] = Number(nam_san_xuat);
        if (dung_tich) condition["vehicle.dung_tich"] = Number(dung_tich);
        if (td_bien_soxe) condition["vehicle.td_bien_soxe"] = Number(td_bien_soxe);
        if (phien_ban) condition["vehicle.phien_ban"] = Number(phien_ban);
        if (hop_so) condition["vehicle.hop_so"] = Number(hop_so);
        if (nhien_lieu) condition["vehicle.nhien_lieu"] = Number(nhien_lieu);
        if (kieu_dang) condition["vehicle.kieu_dang"] = Number(kieu_dang);
        if (so_cho) condition["vehicle.so_cho"] = Number(so_cho);
        if (trong_tai) condition["vehicle.trong_tai"] = Number(trong_tai);
        if (loai_linhphu_kien)
            condition["vehicle.loai_linhphu_kien"] = Number(loai_linhphu_kien);
        if (so_km_da_di) condition["vehicle.so_km_da_di"] = Number(so_km_da_di);
        if (numberOfSeats) condition["vehicle.numberOfSeats"] = Number(numberOfSeats);
        if (ten_toa_nha) condition["realEstate.ten_toa_nha"] = Number(ten_toa_nha);
        if (td_macanho) condition["realEstate.td_macanho"] = Number(td_macanho);
        if (ten_phan_khu)
            condition["realEstate.ten_phan_khu"] = Number(ten_phan_khu);
        if (td_htmch_rt) condition["realEstate.td_htmch_rt"] = Number(td_htmch_rt);
        if (so_pngu) condition["realEstate.so_pngu"] = Number(so_pngu);
        if (so_pve_sinh)
            condition["realEstate.so_pve_sinh"] = Number(so_pve_sinh);
        if (tong_so_tang) condition["realEstate.tong_so_tang"] = Number(tong_so_tang);
        if (huong_chinh) condition["realEstate.huong_chinh"] = Number(huong_chinh);
        if (giay_to_phap_ly) condition["realEstate.giay_to_phap_ly"] = Number(giay_to_phap_ly);
        if (tinh_trang_noi_that) condition["realEstate.tinh_trang_noi_that"] = Number(tinh_trang_noi_that);
        if (dac_diem) condition["realEstate.dac_diem"] = Number(dac_diem);
        if (dien_tich) condition["realEstate.dien_tich"] = Number(dien_tich);
        if (dientichsd) condition["realEstate.dientichsd"] = Number(dientichsd);
        if (chieu_dai) condition["realEstate.chieu_dai"] = Number(chieu_dai);
        if (chieu_rong) condition["realEstate.chieu_rong"] = Number(chieu_rong);
        if (tinh_trang_bds)
            condition["realEstate.tinh_trang_bds"] = Number(tinh_trang_bds);
        if (td_block_thap) condition["realEstate.td_block_thap"] = Number(td_block_thap);
        if (tang_so)
            condition["realEstate.tang_so"] = Number(tang_so);
        if (loai_hinh_canho) condition["realEstate.loai_hinh_canho"] = Number(loai_hinh_canho);
        if (loaihinh_vp) condition["realEstate.loaihinh_vp"] = Number(loaihinh_vp);
        if (loai_hinh_dat) condition["realEstate.loai_hinh_dat"] = Number(loai_hinh_dat);
        if (kv_thanhpho) condition["realEstate.kv_thanhpho"] = Number(kv_thanhpho);
        if (kv_quanhuyen) condition["realEstate.kv_quanhuyen"] = Number(kv_quanhuyen);
        if (kv_phuongxa) condition["realEstate.kv_phuongxa"] = Number(kv_phuongxa);
        if (product) condition["ship.product"] = Number(product);
        if (timeStart) condition["ship.timeStart"] = { $gte: { timeStart } };
        if (timeEnd) condition["ship.timeEnd"] = { $gte: { timeEnd } };
        if (allDay) condition["ship.allDay"] = Number(allDay);
        if (loai_hinh_sp) condition["beautifull.loai_hinh_sp"] = Number(loai_hinh_sp);
        if (loai_sanpham) condition["beautifull.loai_sanpham"] = Number(loai_sanpham);
        if (han_su_dung) condition["beautifull.han_su_dung"] = han_su_dung;
        if (hang_vattu) condition["beautifull.hang_vattu"] = hang_vattu;
        if (loai_thiet_bi) condition["wareHouse.loai_thiet_bi"] = loai_thiet_bi;
        if (hang) condition["wareHouse.hang"] = Number(hang);
        if (cong_suat) condition["wareHouse.cong_suat"] = Number(cong_suat);
        if (hang_vattu) condition["wareHouse.hang_vattu"] = Number(hang_vattu);
        if (dung_tich) condition["wareHouse.dung_tich"] = Number(dung_tich);
        if (khoiluong) condition["wareHouse.khoiluong"] = Number(khoiluong);
        if (loai_chung) condition["wareHouse.loai_chung"] = Number(loai_chung);
        if (loai_sanpham) condition["wareHouse.loai_sanpham"] = Number(loai_sanpham);
        if (block) condition["pet.block"] = Number(block);
        if (kindOfPet) condition["pet.kindOfPet"] = Number(kindOfPet);
        if (age) condition["pet.age"] = Number(age);
        if (gender) condition["pet.gender"] = Number(gender);
        if (jobType) condition["Job.jobType"] = Number(jobType);
        if (jobDetail) condition["Job.jobDetail"] = Number(jobDetail);
        if (jobKind) condition["Job.jobKind"] = Number(jobKind);
        if (salary) condition["Job.salary"] = Number(salary);
        if (gender) condition["Job.gender"] = Number(gender);
        if (exp) condition["Job.exp"] = Number(exp);
        if (level) condition["Job.level"] = Number(level);
        if (degree) condition["Job.degree"] = Number(degree);
        if (skill) condition["Job.skill"] = Number(skill);
        if (Jobcity) condition["Job.city"] = Number(Jobcity);
        if (Jobdistrict) condition["Job.district"] = Number(Jobdistrict);
        if (Jobward) condition["Job.ward"] = Number(Jobward);
        if (payBy) condition["Job.payBy"] = Number(payBy);
        if (benefit) condition["Job.benefit"] = Number(benefit);
        if (startvalue) condition.money = { $gte: Number(startvalue) };
        if (endvalue) condition.money = { $lte: Number(endvalue) };
        if (startvalue && endvalue) condition.money = { $gte: Number(startvalue), $lte: Number(endvalue) };
        condition.userID = { $ne: 0 }
        let data = await New.aggregate([
            { $sort: { pinCate: -1 } },
            { $match: condition },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "Users",
                    foreignField: "idRaoNhanh365",
                    localField: "userID",
                    as: "user",
                },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $project: searchItem }
        ]);
        let userIdRaoNhanh = await raoNhanh.checkTokenUser(req, res, next);
        for (let i = 0; i < data.length; i++) {
            if (data[i].img) {
                data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, data[i].buySell)
                data[i].soluonganh = data[i].img.length
            }
            data[i].islove = 0;
            if (buySell === 1) {
                data[i].link = `https://raonhanh365.vn/${data[i].linkTitle}-ct${data[i]._id}.html`;
            } else {
                data[i].link = `https://raonhanh365.vn/${data[i].linkTitle}-c${data[i]._id}.html`;
            }
            if (userIdRaoNhanh) {
                let dataLoveNew = await LoveNews.find({ id_user: userIdRaoNhanh });
                for (let j = 0; j < dataLoveNew.length; j++) {
                    if (data[i]._id === dataLoveNew[j].id_new) {
                        data[i].islove = 1;
                    }
                    if (!data[i].islove || data[i].islove !== 1) {
                        data[i].islove = 0;
                    }
                }
            }
            let url = data[i].link;
            let ListComment = await Comments.find({ url, parent_id: 0 }, {}, { time: -1 }).lean();
            let ListLike = await LikeRN.find({ forUrlNew: url, commentId: 0, type: { $lt: 8 } }, {}, { type: 1 })
            let ListReplyComment = [];
            let ListLikeComment = [];
            let ListLikeCommentChild = [];
            if (ListComment.length !== 0) {
                for (let i = 0; i < ListComment.length; i++) {
                    ListLikeComment = await LikeRN.find({ forUrlNew: url, type: { $lt: 8 }, commentId: ListComment[i]._id }, {}, { type: 1 })
                    ListReplyComment = await Comments.find({ url, parent_id: ListComment[i]._id }, {}, { time: -1 }).lean();
                    // lấy lượt like của từng trả lời
                    if (ListReplyComment && ListReplyComment.length > 0) {
                        for (let j = 0; j < ListReplyComment.length; j++) {
                            ListLikeCommentChild = await LikeRN.find({ forUrlNew: url, type: { $lt: 8 }, commentId: ListReplyComment[j]._id }, {}, { type: 1 })
                            ListReplyComment[j].ListLikeCommentChild = ListLikeCommentChild
                            ListReplyComment[i].img = process.env.DOMAIN_RAO_NHANH + '/' + ListReplyComment[i].img
                        }
                    }
                    ListComment[i].ListLikeComment = ListLikeComment
                    ListComment[i].ListReplyComment = ListReplyComment
                    if (ListComment[i].img) {
                        ListComment[i].img = process.env.DOMAIN_RAO_NHANH + '/' + ListComment[i].img
                    }
                }
            }
            let soluonglike = await LikeRN.find({ forUrlNew: url, commentId: 0, type: { $lt: 8 } }).count();
            let soluongcomment = await Comments.find({ url }).count();
            data[i].ListLike = ListLike
            data[i].ListComment = ListComment
            data[i].soluonglike = soluonglike
            data[i].soluongcomment = soluongcomment

        }


        const totalCount = await New.countDocuments(condition);

        return functions.success(res, "get data success", {
            totalCount,
            data,
        });
    } catch (error) {
        console.error(error);
        return functions.setError(res, error);
    }
};
// tạo tin mua
exports.createBuyNew = async (req, res) => {
    try {
        // lấy id user từ req
        let userID = req.user.data.idRaoNhanh365;
        let type = req.user.data.type;
        if (type !== 1) {
            type = 0
        }
        // khởi tạo các biến có thể có
        let new_file_dthau = null;

        let new_file_nophs = null;

        let new_file_chidan = null;

        let noidung_chidan = req.body.noidung_chidan || null;
        let active = 1;
        // khai báo và gán giá trị các biến bắt buộc
        let {
            cateID,
            title,
            name,
            city,
            district,
            ward,
            apartmentNumber,
            description,
            status,
            endvalue,
            money,
            until,
            noidung_nhs,
            com_city,
            com_district,
            com_ward,
            com_address_num,
            han_bat_dau,
            han_su_dung,
            tgian_bd,
            tgian_kt,
            donvi_thau,
            phi_duthau,
            phone,
            email,
            new_job_kind
        } = req.body;
        //  tạo mảng img
        let img = [];

        //  lấy giá trị id lớn nhất rồi cộng thêm 1 tạo ra id mới
        var _id = (await functions.getMaxID(New)) + 1;

        // lấy thời gian hiện tại
        let createTime = new Date();

        // khai báo đây là tin mua với giá trị là 1
        let buySell = 1;

        let File = req.files;
        // kiểm tra các điều kiện bắt buộc
        if (
            title &&
            name &&
            money &&
            description &&
            han_su_dung &&
            status &&
            phone &&
            email &&
            tgian_kt && tgian_bd && noidung_nhs
        ) {
            // tạolink title từ title người dùng nhập
            var linkTitle = raoNhanh.createLinkTilte(title);

            //kiểm tra title đã được người dùng tạo chưa
            let checktitle = await New.findOne({ userID, linkTitle });
            if (checktitle) {
                return functions.setError(res, "Vui lòng nhập title khác", 400);
            }
            // kiểm tra tiền nhập vào có phải số không
            else if (
                isNaN(phi_duthau) === true ||
                isNaN(money) === true ||
                isNaN(endvalue) === true
            ) {
                return functions.setError(res, "The input price is not a number", 400);
            }
            // kiểm tra số điện thoại
            else if ((await functions.checkPhoneNumber(phone)) === false) {
                return functions.setError(res, "Invalid phone number", 400);
            }
            // kiểm tra email
            else if ((await functions.checkEmail(email)) === false) {
                return functions.setError(res, "Invalid email", 400);
            }

            if (
                functions.checkDate(han_bat_dau) === true &&
                functions.checkDate(han_su_dung) === true &&
                functions.checkDate(tgian_bd) === true &&
                functions.checkDate(tgian_kt) === true
            ) {
                //  kiểm tra thời gian có nhỏ hơn thời gian hiện tại không
                if (
                    (await functions.checkTime(han_bat_dau)) &&
                    (await functions.checkTime(han_su_dung)) &&
                    (await functions.checkTime(tgian_bd)) &&
                    (await functions.checkTime(tgian_kt))
                ) {
                    //  kiểm tra thời gian nộp hồ sơ và thời gian thông báo có hợp lệ không
                    let date1 = new Date(han_bat_dau);
                    let date2 = new Date(han_su_dung);
                    let date3 = new Date(tgian_bd);
                    let date4 = new Date(tgian_kt);
                    if (date1 > date2 || date3 > date4 || date3 < date2) {
                        return functions.setError(res, "Nhập ngày không hợp lệ", 400);
                    }
                } else {
                    return functions.setError(
                        res,
                        "Ngày nhập vào nhỏ hơn ngày hiện tại",
                        400
                    );
                }
            } else {
                return functions.setError(res, "Invalid date format", 400);
            }

            if (File.Image) {
                if (File.Image.length) {
                    if (File.Image.length > 10)
                        return functions.setError(res, "Gửi quá nhiều ảnh", 400);
                    for (let i = 0; i < File.Image.length; i++) {
                        let image = await raoNhanh.uploadFileRaoNhanh(
                            "avt_tindangmua",
                            userID,
                            File.Image[i],
                            ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.pdf', '.mp3', '.mp4']
                        );
                        if (!image) {
                            return functions.setError(res, 'upload file failed', 400);
                        }
                        img.push({
                            nameImg: image
                        })
                    }
                }
            }
            if (File.new_file_dthau) {
                if (File.new_file_dthau.length)
                    return functions.setError(res, "Gửi quá nhiều file");
                new_file_dthau = await raoNhanh.uploadFileRaoNhanh("avt_tindangmua", userID, File.new_file_dthau, [
                    ".jpg",
                    ".png",
                    ".docx",
                    ".pdf",
                    ".xlsx",
                    ".xls"
                ]);
                if (new_file_dthau === false) return functions.setError(res, 'upload file failed', 400)
            }
            if (File.new_file_nophs) {
                if (File.new_file_nophs.length)
                    return functions.setError(res, "Gửi quá nhiều file");
                new_file_nophs = await raoNhanh.uploadFileRaoNhanh("avt_tindangmua", userID, File.new_file_nophs, [
                    ".jpg",
                    ".png",
                    ".docx",
                    ".pdf",
                    ".xlsx",
                    ".xls"
                ]);
                if (new_file_nophs === false) return functions.setError(res, 'upload file failed', 400)
            }
            if (File.new_file_chidan) {
                if (File.new_file_chidan.length)
                    return functions.setError(res, "Gửi quá nhiều file");
                new_file_chidan = await raoNhanh.uploadFileRaoNhanh("avt_tindangmua", userID, File.new_file_chidan, [
                    ".jpg",
                    ".png",
                    ".docx",
                    ".pdf",
                    ".xlsx",
                    ".xls"
                ]);
                if (new_file_chidan === false) return functions.setError(res, 'upload file failed', 400)
            }
            //lưu dữ liệu vào DB
            var postNew = new New({
                _id,
                userID,
                title, linkTitle, name, city, money, district, ward, apartmentNumber, description,
                status, endvalue, phone,
                email,
                active, createTime, buySell, cateID, until, com_city,
                com_ward, com_address_num
                , com_district, type, img, tgian_bd, tgian_kt
                , bidding: {
                    han_bat_dau, han_su_dung, new_job_kind,
                    new_file_dthau, noidung_nhs, new_file_nophs, noidung_chidan
                    , new_file_chidan, donvi_thau, phi_duthau
                }
            });
            await postNew.save();
            // await New.deleteMany({userID:5})
        } else {
            return functions.setError(res, "missing data", 404);
        }
        return functions.success(res, "post new success", { link: `https://raonhanh365.vn/${linkTitle}-ct${_id}.html` });
    } catch (error) {
        console.error(error);
        return functions.setError(res, error);
    }
};
// sửa tin mua
exports.updateBuyNew = async (req, res, next) => {
    try {
        // lấy id user từ req
        let userID = req.user.data.idRaoNhanh365;
        let type = req.user.data.type;
        let newId = req.body.newId;
        // khởi tạo các biến có thể có
        let new_file_dthau = null;

        let new_file_nophs = null;

        let new_file_chidan = null;

        let noidung_chidan = req.body.noidung_chidan || null;
        // khai báo và gán giá trị các biến bắt buộc
        let {
            cateID,
            title,
            name,
            city,
            district,
            ward,
            apartmentNumber,
            description,
            status,
            endvalue, money,
            until,
            noidung_nhs,
            com_city,
            com_district,
            com_ward,
            com_address_num,
            han_bat_dau,
            han_su_dung,
            tgian_bd,
            tgian_kt,
            donvi_thau,
            phi_duthau,
            phone,
            email,
            new_job_kind
        } = req.body;
        //  tạo mảng img
        let img = [];

        // lấy thời gian hiện tại
        let updateTime = new Date(Date.now());

        // khai báo đây là tin mua với giá trị là 1

        let File = req.files;

        // kiểm tra các điều kiện bắt buộc
        if (
            title &&
            name &&
            city && money &&
            district &&
            ward &&
            apartmentNumber &&
            description &&
            han_su_dung &&
            status &&
            phi_duthau &&
            endvalue &&
            phone &&
            email &&
            tgian_kt && tgian_bd && noidung_nhs
        ) {
            // tạolink title từ title người dùng nhập
            let linkTitle = raoNhanh.createLinkTilte(title);

            //kiểm tra title đã được người dùng tạo chưa
            let checktitle = await New.find({ userID, linkTitle });
            if (checktitle && checktitle.length > 1) {
                return functions.setError(
                    res,
                    "The title already has a previous new word or does not have a keyword that is not allowed",
                    400
                );
            }
            // kiểm tra tiền nhập vào có phải số không
            else if (
                isNaN(phi_duthau) === true ||
                isNaN(money) === true ||
                isNaN(endvalue) === true
            ) {
                return functions.setError(res, "The input price is not a number", 400);
            }
            // kiểm tra số điện thoại
            else if ((await functions.checkPhoneNumber(phone)) === false) {
                return functions.setError(res, "Invalid phone number", 400);
            }
            // kiểm tra email
            else if ((await functions.checkEmail(email)) === false) {
                return functions.setError(res, "Invalid email", 400);
            }

            if (
                functions.checkDate(han_bat_dau) === true &&
                functions.checkDate(han_su_dung) === true &&
                functions.checkDate(tgian_bd) === true &&
                functions.checkDate(tgian_kt) === true
            ) {
                //  kiểm tra thời gian có nhỏ hơn thời gian hiện tại không
                if (
                    (await functions.checkTime(han_bat_dau)) &&
                    (await functions.checkTime(han_su_dung)) &&
                    (await functions.checkTime(tgian_bd)) &&
                    (await functions.checkTime(tgian_kt))
                ) {
                    //  kiểm tra thời gian nộp hồ sơ và thời gian thông báo có hợp lệ không
                    let date1 = new Date(han_bat_dau);
                    let date2 = new Date(han_su_dung);
                    let date3 = new Date(tgian_bd);
                    let date4 = new Date(tgian_kt);
                    if (date1 > date2 || date3 > date4 || date3 < date2) {
                        return functions.setError(res, "Nhập ngày không hợp lệ", 400);
                    }
                } else {
                    return functions.setError(
                        res,
                        "Ngày nhập vào nhỏ hơn ngày hiện tại",
                        400
                    );
                }
            } else {
                return functions.setError(res, "Invalid date format", 400);
            }
            let files_old = await New.findById(newId, {
                img: 1,
                new_file_dthau: 1,
                new_file_nophs: 1,
                new_file_chidan: 1,
            });
            if (File.Image) {
                if (File.Image.length) {
                    if (File.Image.length > 10)
                        return functions.setError(res, "Gửi quá nhiều ảnh", 400);
                    for (let i = 0; i < File.Image.length; i++) {
                        let image = await raoNhanh.uploadFileRaoNhanh(
                            "avt_tindangmua",
                            userID,
                            File.Image[i],
                            ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.pdf', '.mp3', '.mp4']
                        );
                        if (!img) {
                            return functions.setError(res, 'upload file failed', 400);
                        }
                        img.push({
                            nameImg: image
                        })
                    }
                    if (files_old.img) {
                        for (let i = 0; i < files_old.img.length; i++) {
                            raoNhanh.deleteFileRaoNhanh(userID, files_old.img[i].nameImg);
                        }
                    }
                    await New.findByIdAndUpdate(newId, { img })
                }
                if (files_old.img) {
                    for (let i = 0; i < files_old.img.length; i++) {
                        let text = files_old.img[i].nameImg.split("/").reverse()[0];
                        raoNhanh.deleteFileRaoNhanh(userID, text);
                    }
                }
                await New.findByIdAndUpdate(newId, { img })
            }
            if (File.new_file_dthau) {
                if (File.new_file_dthau.length)
                    return functions.setError(res, "Gửi quá nhiều file");
                new_file_dthau = await raoNhanh.uploadFileRaoNhanh("avt_tindangmua", userID, File.new_file_dthau, [
                    ".jpg",
                    ".png",
                    ".docx",
                    ".pdf",
                ]);
                if (new_file_dthau === false) return functions.setError(res, 'sai định dạng file', 400)
                if (files_old.new_file_dthau) {

                    raoNhanh.deleteFileRaoNhanh(userID, files_old.new_file_dthau);
                }
                await New.findByIdAndUpdate(newId, { bidding: { new_file_dthau } })
            }
            if (File.new_file_nophs) {
                if (File.new_file_nophs.length)
                    return functions.setError(res, "Gửi quá nhiều file");
                new_file_nophs = await raoNhanh.uploadFileRaoNhanh(
                    "avt_tindangmua",
                    userID,
                    File.new_file_nophs,
                    [".jpg", ".png", ".docx", ".pdf"]
                );
                if (new_file_nophs === false) return functions.setError(res, 'sai định dạng file', 400)
                if (files_old.new_file_nophs) {
                    let text = files_old.new_file_nophs
                    raoNhanh.deleteFileRaoNhanh(userID, text);
                }
                await New.findByIdAndUpdate(newId, { bidding: { new_file_nophs } })
            }
            if (File.new_file_chidan) {
                if (File.new_file_chidan.length)
                    return functions.setError(res, "Gửi quá nhiều file");
                new_file_chidan = await raoNhanh.uploadFileRaoNhanh(
                    "avt_tindangmua",
                    userID,
                    File.new_file_chidan,
                    [".jpg", ".png", ".docx", ".pdf"]
                );
                if (new_file_chidan === false) return functions.setError(res, 'sai định dạng file', 400)

                if (files_old.new_file_chidan) {
                    let text = files_old.new_file_chidan;
                    raoNhanh.deleteFileRaoNhanh(userID, text);
                }

                await New.updateOne({ _id: newId }, { $set: { 'bidding.new_file_chidan': new_file_chidan } })
            }
            //lưu dữ liệu vào DB
            await New.findByIdAndUpdate(newId, {
                title, linkTitle, name, city, money, district, ward, apartmentNumber, description,
                status, endvalue, phone,
                email,
                updateTime, cateID, until, com_city,
                com_ward, com_address_num
                , com_district, type, tgian_bd, tgian_kt
                ,
                'bidding.han_bat_dau': han_bat_dau,
                'bidding.han_su_dung': han_su_dung,
                'bidding.new_job_kind': new_job_kind,
                'bidding.noidung_nhs': noidung_nhs,
                'bidding.noidung_chidan': noidung_chidan,
                'bidding.donvi_thau': donvi_thau,
                'bidding.phi_duthau': phi_duthau,
            })
        } else {
            return functions.setError(res, "missing data", 404);
        }
        return functions.success(res, "update new success");
    } catch (error) {
        return functions.setError(res, error);
    }
};
// chi tiết tin 
exports.getDetailNew = async (req, res, next) => {
    try {
        let cm_page = req.body.cm_page;
        let cm_limit = 10;
        let cm_start = (cm_page - 1) * cm_limit;
        let typebl = Number(req.body.typebl)
        let userIdRaoNhanh = await raoNhanh.checkTokenUser(req, res, next);
        let linkTitle = req.body.linkTitle;
        if (!linkTitle) {
            return functions.setError(res, "missing data", 400);
        }
        let linkTitlee = linkTitle.replace(".html", "")
        let id = linkTitlee.split("-").reverse()[0];
        let buy = id.match(/[a-zA-Z]+/g)[0];
        let id_new = Number(id.replace(buy, ''));
        let buysell = null;
        let searchitem = null;
        let tintuongtu = [];
        let ListComment = [];
        let ListLike = [];
        if ((await functions.checkNumber(id_new)) === false) {
            return functions.setError(res, "invalid number", 404);
        }
        let check = await New.findById(id_new, { cateID: 1, userID: 1 });
        if (!check) {
            return functions.setError(res, "not found", 404);
        }
        let danhmuc = await raoNhanh.getNameCate(check.cateID, 2)
        let cate_Special = await raoNhanh.getNameCate(check.cateID, 1)
        cate_Special = await raoNhanh.checkNameCateRaoNhanh(cate_Special)
        if (buy === "ct") {
            buysell = 1;
            searchitem = {
                _id: 1,
                title: 1,
                money: 1,
                endvalue: 1,
                city: 1,
                userID: 1,
                img: 1,
                cateID: 1,
                updateTime: 1,
                type: 1,
                active: 1,
                until: 1,
                address: 1,
                ward: 1,
                detailCategory: 1,
                district: 1,
                viewCount: 1,
                apartmentNumber: 1,
                com_city: 1,
                com_district: 1,
                com_ward: 1,
                com_address_num: 1,
                bidding: 1,
                tgian_kt: 1,
                tgian_bd: 1,
                buySell: 1,
                video: 1,
                user: { _id: 1, idRaoNhanh365: 1, phone: 1, isOnline: 1, avatarUser: 1, 'inforRN365.xacThucLienket': 1, createdAt: 1, userName: 1, type: 1, chat365_secret: 1, email: 1, lastActivedAt: 1, time_login: 1 },
            };
        } else if (buy === "c") {
            buysell = 2;
            searchitem = {
                _id: 1,
                title: 1,
                linkTitle: 1,
                free: 1,
                address: 1,
                money: 1,
                createTime: 1,
                cateID: 1,
                pinHome: 1,
                pinCate: 1,
                new_day_tin: 1,
                buySell: 1,
                email: 1,
                tgian_kt: 1,
                tgian_bd: 1,
                phone: 1,
                userID: 1,
                img: 1,
                updateTime: 1,
                user: { _id: 1, idRaoNhanh365: 1, isOnline: 1, phone: 1, avatarUser: 1, userName: 1, type: 1, chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1, 'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1 },
                district: 1,
                ward: 1,
                description: 1,
                city: 1,
                islove: '1',
                until: 1,
                endvalue: 1,
                type: 1,
                detailCategory: 1,
                infoSell: 1,
                timePromotionStart: 1,
                timePromotionEnd: 1,
                quantitySold: 1,
                infoSell: 1,
                viewCount: 1,
                poster: 1,
                sold: 1,
                com_city: 1,
                video: 1,
                district: 1,
                ward: 1,
                com_address_num: 1,
                buySell: 1,
                totalSold: 1,
                quantityMin: 1,
                quantityMax: 1,
                productGroup: 1,
                productType: 1
            };
        } else {
            return functions.setError(res, "not found data", 404);
        }
        if (cate_Special) {
            searchitem[`${cate_Special}`] = 1;
        }

        let data = await New.aggregate([
            { $match: { _id: id_new } },
            {
                $lookup: {
                    from: "Users",
                    localField: "userID",
                    foreignField: "idRaoNhanh365",
                    as: "user",
                },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $match: { buySell: buysell } },
            { $project: searchitem },

        ]);
        let cousao = await Evaluate.find({ blUser: 0, userId: data[0].userID }).count();
        let sumsao = await Evaluate.aggregate([
            {
                $match: {
                    blUser: 0, userId: data[0].userID
                }
            },
            {
                $group:
                {
                    _id: null,
                    count: { $sum: "$stars" }
                }
            }
        ]);
        let thongTinSao = {};
        if (sumsao && sumsao.length !== 0) {
            thongTinSao.cousao = cousao;
            thongTinSao.sumsao = sumsao[0].count;
        }

        if (data[0].video) {
            let nameCate = await raoNhanh.getNameCate(data[0].cateID, 1)
            let folder = await raoNhanh.checkFolderCateRaoNhanh(nameCate)
            data[0].video = process.env.DOMAIN_RAO_NHANH + `/pictures/${folder}/` + data[0].video
        }

        data[0].thongTinSao = thongTinSao
        tintuongtu = await New.aggregate([
            { $match: { cateID: check.cateID, active: 1, sold: 0, _id: { $ne: id_new } } },
            { $limit: 6 },
            {
                $lookup: {
                    from: 'Users',
                    foreignField: 'idRaoNhanh365',
                    localField: 'userID',
                    as: 'user'
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    linkTitle: 1,
                    free: 1,
                    address: 1,
                    money: 1,
                    createTime: 1,
                    cateID: 1,
                    pinHome: 1,
                    userID: 1,
                    img: 1,
                    updateTime: 1,
                    user: { _id: 1, avatarUser: 1, phone: 1, userName: 1, type: 1, chat365_secret: 1, 'inforRN365.xacThucLienket': 1, email: 1, 'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1 },
                    district: 1,
                    ward: 1,
                    city: 1,
                    dia_chi: 1,
                    islove: 1,
                    until: 1,
                    endvalue: 1,
                    active: 1,
                    type: 1,
                    sold: 1,
                    createTime: 1,
                    free: 1,
                    buySell: 1
                }
            }
        ]);
        for (let i = 0; i < tintuongtu.length; i++) {

            if (tintuongtu[i].img) {
                tintuongtu[i].img = await raoNhanh.getLinkFile(tintuongtu[i].img, tintuongtu[i].cateID, tintuongtu[i].buySell)
                tintuongtu[i].soluonganh = tintuongtu[i].img.length;
            }
        }
        let url = linkTitle;
        if (typebl = 2) {
            ListComment = await Comments.find({ url, parent_id: 0 }, {}, { time: -1 }, { cm_start }, { cm_limit }).lean();
        } else {
            ListComment = await Comments.find({ url, parent_id: 0 }, {}, { time: 1 }, { cm_start }, { cm_limit }).lean();
        }
        ListLike = await LikeRN.find({ forUrlNew: url, commentId: 0, type: { $lt: 8 } }, {}, { type: 1 })
        let ListReplyComment = [];
        let ListLikeComment = [];
        let ListLikeCommentChild = [];
        if (ListComment.length !== 0) {
            for (let i = 0; i < ListComment.length; i++) {
                ListLikeComment = await LikeRN.find({ forUrlNew: url, type: { $lt: 8 }, commentId: ListComment[i]._id }, {}, { type: 1 })
                ListReplyComment = await Comments.find({ url, parent_id: ListComment[i]._id }, {}, { time: -1 }).lean();
                // lấy lượt like của từng trả lời
                if (ListReplyComment && ListReplyComment.length > 0) {
                    for (let j = 0; j < ListReplyComment.length; j++) {
                        ListLikeCommentChild = await LikeRN.find({ forUrlNew: url, type: { $lt: 8 }, commentId: ListReplyComment[j]._id }, {}, { type: 1 })
                        ListReplyComment[j].ListLikeCommentChild = ListLikeCommentChild
                        ListReplyComment[i].img = process.env.DOMAIN_RAO_NHANH + '/' + ListReplyComment[i].img
                    }
                }
                ListComment[i].ListLikeComment = ListLikeComment
                ListComment[i].ListReplyComment = ListReplyComment
                if (ListComment[i].img) {
                    ListComment[i].img = process.env.DOMAIN_RAO_NHANH + '/' + ListComment[i].img
                }
            }
        }

        await New.findByIdAndUpdate(id_new, { $inc: { viewCount: +1 } });
        for (let i = 0; i < data.length; i++) {
            data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, data[i].buySell)
            if (userIdRaoNhanh) {

                let dataLoveNew = await LoveNews.findOne({ id_user: userIdRaoNhanh, id_new });
                if (dataLoveNew) data[0].islove = 1;
                else data[0].islove = 0;
            } else {
                data[0].islove = 0;
            }
        }
        let dataBidding = null;
        data[0].ListComment = ListComment;
        data[0].ListLike = ListLike;
        data[0].tintuongtu = tintuongtu;
        data[0].danhmuc = danhmuc;
        data = data[0]
        if (buysell === 1) {
            dataBidding = await Bidding.aggregate([
                {
                    $match: {
                        newId: id_new
                    }
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: 'userID',
                        foreignField: 'idRaoNhanh365',
                        as: 'user'
                    }
                }, {
                    $project: {
                        user: { _id: 1, idRaoNhanh365: 1, phone: 1, avatarUser: 1, 'inforRN365.xacThucLienket': 1, createdAt: 1, userName: 1, type: 1, chat365_secret: 1, email: 1 },
                        _id: 1,
                        userName: 1,
                        userIntro: 1,
                        userFile: 1,
                        userProfile: 1,
                        userProfileFile: 1,
                        productName: 1,
                        productDesc: 1,
                        productLink: 1,
                        price: 1,
                        priceUnit: 1,
                        promotion: 1,
                        promotionFile: 1,
                        status: 1,
                        createTime: 1,
                        note: 1,
                        updatedAt: 1,
                    }
                }

            ])

            return functions.success(res, "get data success", { data, dataBidding });
        }
        //data[`${cate_Special}`] = await raoNhanh.getDataNewDetail(data[`${cate_Special}`])


        return functions.success(res, "get data success", { data });
    } catch (error) {
        console.error(error)
        return functions.setError(res, error);
    }
};
// yêu thích tin
exports.loveNew = async (req, res, next) => {
    try {
        let id = req.body.new_id;
        if ((await functions.checkNumber(id)) === false) {
            return functions.setError(res, "invalid number", 400);
        }
        let user = req.user.data.idRaoNhanh365;
        let checkLove = await LoveNews.findOne({ id_new: id, id_user: user });
        if (checkLove) {
            await LoveNews.findOneAndDelete({ id_new: id, id_user: user });
            return functions.success(res, "love new success", { status: 0 });
        } else {
            createdAt = new Date();
            let _id = await functions.getMaxID(LoveNews) + 1;
            await LoveNews.create({ _id, id_new: id, id_user: user, createdAt });
            return functions.success(res, "love new success", { status: 1 });
        }
    } catch (error) {
        return functions.setError(res, error);
    }
};
// tao token
exports.createToken = async (req, res, next) => {
    try {
        let id = 4;
        let data = await AdminUser.findById(id);
        let token = await functions.createToken(data, "100d");
        let data1 = "Bazer " + token;
        return functions.success(res, { data1 });
    } catch (error) {
        console.log(error);
    }
};
// danh sách yêu thích tin
// danh sách yêu thích tin
exports.newfavorite = async (req, res, next) => {
    try {
        let userID = req.user.data.idRaoNhanh365;
        let linkTitle = req.body.linkTitle;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let searchItem = null;
        let buySell = null;
        if (linkTitle === "tin-mua-da-yeu-thich.html") {
            buySell = 1;
            searchItem = {
                title: 1,
                money: 1,
                name: 1,
                img: 1,
                address: 1,
                updateTime: 1,
                city: 1,
                district: 1,
                ward: 1,
                apartmentNumber: 1,
                free: 1,
                endvalue: 1,
                createTime: 1,
                cateID: 1,
                until: 1,
                buySell: 1
            };
        } else if (linkTitle === "tin-ban-da-yeu-thich.html") {
            buySell = 2;
            searchItem = {
                title: 1,
                money: 1,
                name: 1,
                img: 1,
                address: 1,
                updateTime: 1,
                city: 1,
                district: 1,
                ward: 1,
                apartmentNumber: 1,
                free: 1,
                endvalue: 1,
                createTime: 1,
                cateID: 1,
                until: 1
            };
        }
        if (!buySell) {
            return functions.setError(res, "invalid data", 400);
        }
        let data = [];


        let tin = 0;
        let check = await LoveNews.find({ id_user: userID }).skip(skip).limit(limit);
        if (check && check.length) {
            for (let i = 0; i < check.length; i++) {
                tin = await New.findOne(
                    { _id: check[i].id_new, buySell },
                    searchItem
                );

                if (tin && tin.img) {
                    tin.img = await raoNhanh.getLinkFile(tin.img, tin.cateID, tin.buySell);
                }
                if (tin) {
                    data.push(tin)
                }
            }
        }
        let soluongtinyeuthich = await LoveNews.aggregate([
            { $match: { id_user: userID } },
            {
                $lookup: {
                    from: "RN365_News",
                    localField: "id_new",
                    foreignField: "_id",
                    as: "new",
                },
            },

            { $unwind: "$new" },
            { $match: { 'new.buySell': buySell } },
            { $count: 'sl' }

        ])
        return functions.success(res, "get data success", { soluongtinyeuthich: soluongtinyeuthich[0].sl, data });
    } catch (error) {
        console.error(error)
        return functions.setError(res, error);
    }
};
// quản lí tin mua
exports.managenew = async (req, res, next) => {
    try {
        let linkTitle = req.body.linkTitle;
        let userID = req.user.data.idRaoNhanh365;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let data = [];
        let tin_conhan = await New.find({
            userID,
            'bidding.han_su_dung': { $gte: new Date() },
            buySell: 1,
        }).count();
        let tin_dangan = await New.find({ userID, active: 0, buySell: 1 }).count();
        let tong_soluong = await New.find({ userID, buySell: 1 }).count();
        let tin_hethan = tong_soluong - tin_conhan;
        let searchItem = {
            title: 1,
            active: 1,
            createTime: 1,
            sold: 1,
            endvalue: 1,
            until_bidding: 1,
            img: 1,
            city: 1,
            district: 1,
            ward: 1,
            apartmentNumber: 1,
            endvalue: 1,
            until: 1,
            linkTitle: 1,
            cateID: 1,
            money: 1,
            free: 1,
            infoSell: 1,
            address: 1,
            dia_chi: 1,
            pinCate: 1,
            pinHome: 1,
            buySell: 1,
            'bidding.han_su_dung': 1,

        };
        if (linkTitle === "quan-ly-tin-mua.html") {
            data = await New.find({ userID, buySell: 1, cateID: { $nin: [120, 121] } }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-con-han.html") {
            data = await New.find(
                {
                    userID,
                    buySell: 1,
                    'bidding.han_su_dung': { $gte: new Date() },
                    cateID: { $nin: [120, 121] }
                },
                searchItem
            ).skip(skip).limit(limit);
        } else if (linkTitle === "tin-het-han.html") {
            data = await New.find(
                {
                    userID,
                    buySell: 1,
                    'bidding.han_su_dung': { $lte: new Date() },
                    cateID: { $nin: [120, 121] }
                },
                searchItem
            ).skip(skip).limit(limit);
        } else if (linkTitle === "tin-dang-an.html") {
            data = await New.find({ userID, buySell: 1, $or: [{ active: 0 }, { sold: 1 }], cateID: { $nin: [120, 121] } }, searchItem).skip(skip).limit(limit);
        } else {
            return functions.setError(res, "page not found ", 404);
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].img) {
                data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", { tong_soluong, tin_conhan, tin_hethan, tin_dangan, data });
    } catch (error) {
        return functions.setError(res, error);
    }
};
// tin đang dự thầu
exports.newisbidding = async (req, res, next) => {
    try {
        let linkTitle = req.body.linkTitle;
        let userID = req.user.data.idRaoNhanh365;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let sl_tatCaTin = await Bidding.find({ userID }).count();
        let sl_tinConHan = 0;
        let searchItem = {
            new: {
                title: 1,
                tgian_bd: 1,
                tgian_kt: 1,
                city: 1,
                district: 1,
                ward: 1,
                apartmentNumber: 1,
                endvalue: 1,
                money: 1,
                bidding: 1,
                linkTitle: 1,
                cateID: 1,
                sold: 1,
                until: 1,
                img: 1,
                createTime: 1,
                free: 1,
                pinCate: 1,
                pinHome: 1,
                active: 1,
                han_su_dung: 1,
                status: 1,
                cateID: 1,
                buySell: 1,
                userID: 1
            },
            _id: 1,
            newId: 1,
            userName: 1,
            userIntro: 1,
            userFile: 1,
            userProfile: 1,
            userProfileFile: 1,
            productName: 1,
            productDesc: 1,
            productLink: 1,
            price: 1,
            priceUnit: 1,
            promotion: 1,
            promotionFile: 1,
            status: 1,
            createTime: 1,
            note: 1,
            user: { _id: 1, address: 1, idRaoNhanh365: 1, phone: 1, isOnline: 1, userName: 1, avatarUser: 1, type: 1, chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1, 'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1 },

        };
        let tinConHan = await Bidding.aggregate([
            {
                $match: { userID }
            },
            {
                $lookup: {
                    from: "RN365_News",
                    localField: "newId",
                    foreignField: "_id",
                    as: "new",
                },
            },
            {
                $match: {
                    'new.bidding.han_su_dung': { $gte: new Date() },
                },
            },
            {
                $count: "all",
            },
        ]);
        if (tinConHan.length) {
            sl_tinConHan = tinConHan[0].all;
        }
        let sl_tinHetHan = sl_tatCaTin - sl_tinConHan;
        if (linkTitle === "quan-ly-tin-dang-du-thau.html") {
            data = await Bidding.aggregate([
                { $match: { userID } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new",
                    },
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "userID",
                        foreignField: "idRaoNhanh365",
                        as: "user",
                    },
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }

            ]);
        } else if (linkTitle === "tin-dang-du-thau-con-han.html") {
            data = await Bidding.aggregate([
                { $match: { userID } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new",
                    },
                },
                { $unwind: "$new" },
                { $match: { 'new.bidding.han_su_dung': { $gte: new Date() }, }, },
                {
                    $lookup: {
                        from: "Users",
                        localField: "userID",
                        foreignField: "idRaoNhanh365",
                        as: "user",
                    },
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }
            ]);
        } else if (linkTitle === "tin-dang-du-thau-het-han.html") {
            data = await Bidding.aggregate([
                { $match: { userID } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new",
                    },
                },
                { $unwind: "$new" },
                { $match: { 'new.bidding.han_su_dung': { $lt: new Date() }, }, },
                {
                    $lookup: {
                        from: "Users",
                        localField: "userID",
                        foreignField: "idRaoNhanh365",
                        as: "user",
                    },
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem, },
            ]);
        } else {
            return functions.setError(res, "page not found ", 404);
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].new && data[i].new.img) {
                data[i].new.img = await raoNhanh.getLinkFile(data[i].new.img, data[i].new.cateID, data[i].new.buySell);
            }
            let nguoidang = await Users.findOne({ idRaoNhanh365: data[i].new.userID },
                {
                    _id: 1, idRaoNhanh365: 1, phone: 1, isOnline: 1,
                    userName: 1, avatarUser: 1, type: 1,
                    chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1,
                    'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1
                },
            )
            data[i].nguoidang = nguoidang
        }

        return functions.success(res, "get data success", {
            sl_tatCaTin,
            sl_tinConHan,
            sl_tinHetHan,
            data,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
// danh sách danh mục con/cha
exports.getListCate = async (req, res, next) => {
    try {
        let parentId = req.body.parentId;
        if (!parentId) {
            parentId = 0;
        }
        const listCate = await functions.pageFindWithFields(
            CategoryRaoNhanh365,
            { parentId: parentId },
            { name: 1, parentId: 1 },
            { _id: 1 },
        );
        const totalCount = await functions.findCount(CategoryRaoNhanh365, {
            parentId: parentId,
        });
        return functions.success(res, "get list category success", {
            totalCount: totalCount,
            data: listCate,
        });
    } catch (error) {
        return functions.setError(res, error);
    }
};
// quản lí tin bán
exports.manageNewBuySell = async (req, res, next) => {
    try {
        let linkTitle = req.body.linkTitle;
        let userID = req.user.data.idRaoNhanh365;
        let data = [];
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let tong_soluong = await New.find({ userID, buySell: 2, cateID: { $nin: [120, 121] } }).count();
        let tinDangDang = await New.find({ userID, sold: 1, buySell: 2, cateID: { $nin: [120, 121] } }).count();
        let tinDaBan = await New.find({ userID, sold: 0, buySell: 2, cateID: { $nin: [120, 121] } }).count();
        let tinDangAn = await New.find({ userID, active: 0, buySell: 2, cateID: { $nin: [120, 121] } }).count();
        let tinHetHang = await New.find({ userID, active: 1, totalSold: 0, buySell: 2, cateID: { $nin: [120, 121] } }).count();
        let searchItem = {
            title: 1,
            pinHome: 1,
            pinCate: 1,
            city: 1,
            district: 1,
            ward: 1,
            apartmentNumber: 1,
            address: 1,
            money: 1,
            han_su_dung: 1,
            linkTitle: 1,
            timeSell: 1,
            active: 1,
            createTime: 1,
            sold: 1,
            endvalue: 1,
            until: 1,
            img: 1,
            quantitySold: 1,
            totalSold: 1,
            free: 1,
            new_day_tin: 1,
            cateID: 1,
            buySell: 1

        };
        if (linkTitle === "quan-ly-tin-ban.html") {
            data = await New.find({ userID, buySell: 2, cateID: { $nin: [120, 121] } }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-dang-dang.html") {
            data = await New.find({ userID, sold: 1, buySell: 2, cateID: { $nin: [120, 121] } }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-da-ban.html") {
            data = await New.find({ userID, sold: 0, buySell: 2, cateID: { $nin: [120, 121] } }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-dang-an.html") {
            data = await New.find({ userID, active: 0, buySell: 2, cateID: { $nin: [120, 121] } }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-het-hang.html") {
            data = await New.find({ userID, active: 1, buySell: 2, totalSold: 0, cateID: { $nin: [120, 121] } }, searchItem).skip(skip).limit(limit);
        } else {
            return functions.setError(res, "page not found ", 404);
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].img) {
                data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", {
            tong_soluong,
            tinDangDang,
            tinDangAn,
            tinDaBan,
            tinHetHang,
            data,
        });
    } catch (error) {
        return functions.setError(res, error);
    }
};
// danh sách tin tìm ứng viên
exports.listCanNew = async (req, res, next) => {
    try {
        let linkTitle = req.body.linkTitle;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let userID = req.user.data.idRaoNhanh365;
        let data = [];
        let tong_soluong = await New.find({ userID, cateID: 120 }).count();
        let tinDangTimUngVien = await New.find({
            userID,
            cateID: 120,
            sold: 0
        }).count();
        let tinDaTimUngVien = await New.find({
            userID,
            cateID: 120,
            sold: 1
        }).count();
        let searchItem = {
            title: 1,
            linkTitle: 1,
            cateID: 1,
            sold: 1,
            money: 1,
            endvalue: 1,
            until: 1,
            img: 1,
            createTime: 1,
            free: 1,
            pinCate: 1,
            pinHome: 1,
            active: 1,
            han_su_dung: 1,
            city: 1,
            district: 1,
            ward: 1,
            apartmentNumber: 1,
            address: 1,
            benefit: 1,
            cateID: 1,
            buySell: 1
        };
        if (linkTitle === "quan-ly-tin-tim-ung-vien.html") {
            data = await New.find({ userID, cateID: 120 }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-dang-tim.html") {
            data = await New.find({ userID, sold: 0, cateID: 120 }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-da-tim.html") {
            data = await New.find({ userID, sold: 1, cateID: 120 }, searchItem).skip(skip).limit(limit);
        } else {
            return functions.setError(res, "page not found ", 404);
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].img) {
                data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", {
            tong_soluong,
            tinDangTimUngVien,
            tinDaTimUngVien,
            data,
        });
    } catch (error) {
        return functions.setError(res, error);
    }
};
// danh sách tin tìm việc làm
exports.listJobNew = async (req, res, next) => {
    try {
        let linkTitle = req.body.linkTitle;
        let userID = req.user.data.idRaoNhanh365;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let data = [];
        let tong_soluong = await New.find({ userID, cateID: 121 }).count();
        let tinDangTimViec = await New.find({
            userID,
            cateID: 121,
            sold: 0,
        }).count();
        let tinDaTimViec = await New.find({
            userID,
            cateID: 121,
            sold: 1,
        }).count();
        let searchItem = {
            title: 1,
            linkTitle: 1,
            cateID: 1,
            sold: 1,
            money: 1,
            endvalue: 1,
            until: 1,
            img: 1,
            createTime: 1,
            free: 1,
            pinCate: 1,
            pinHome: 1,
            active: 1,
            han_su_dung: 1,
            city: 1,
            district: 1,
            ward: 1,
            apartmentNumber: 1,
            address: 1,
            benefit: 1,
            cateID: 1,
            buySell: 1
        };
        if (linkTitle === "quan-ly-tin-tim-viec-lam.html") {
            data = await New.find({ userID, cateID: 121 }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-dang-tim.html") {
            data = await New.find({ userID, sold: 0, cateID: 121 }, searchItem).skip(skip).limit(limit);
        } else if (linkTitle === "tin-da-tim.html") {
            data = await New.find({ userID, sold: 1, cateID: 121 }, searchItem).skip(skip).limit(limit);
        } else {
            return functions.setError(res, "page not found ", 404);
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].img) {
                data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", {
            tong_soluong,
            tinDangTimViec,
            tinDaTimViec,
            data,
        });
    } catch (error) {
        return functions.setError(res, error);
    }
};
// thích tin
exports.likeNews = async (req, res, next) => {
    try {
        let { forUrlNew } = req.body;
        let ip = req.ip;
        let commentId = Number(req.body.commentId) || 0;
        let userName = req.user.data.userName;
        let type = Number(req.body.type) || null;
        let userId = req.user.data.idRaoNhanh365;
        let userAvatar = req.user.data.userAvatar;


        if (!forUrlNew) {
            return functions.setError(res, "Missing input value", 404);
        }
        if (commentId == 0) {
            let like = await LikeRN.findOne({
                userIdChat: userId,
                forUrlNew: forUrlNew,
                commentId: 0
            });
            if (like && type !== 0) {
                await LikeRN.findOneAndUpdate(
                    { _id: like._id },
                    {
                        type: type,
                    }
                );
                return functions.success(res, "Like thành công");
            } else if (like && type == 0) {
                await LikeRN.findOneAndDelete({ _id: like._id });
                return functions.success(res, "Xoá like thành công");
            } else {
                let maxIdLike = await LikeRN.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                let newIdLike;
                if (maxIdLike) {
                    newIdLike = Number(maxIdLike._id) + 1;
                } else newIdLike = 1;

                like = new LikeRN({
                    _id: newIdLike,
                    forUrlNew: forUrlNew,
                    type: type,
                    commentId: 0,
                    userName: userName,
                    userAvatar: userAvatar,
                    userIdChat: userId,
                    ip: ip,
                    time: Date(),
                });
                await like.save();
                return functions.success(res, "Like bài viết thành công");
            }
        }
        let maxIdLike = await LikeRN.findOne({}, { _id: 1 })
            .sort({ _id: -1 })
            .limit(1)
            .lean();
        let newIdLike;
        if (maxIdLike) {
            newIdLike = Number(maxIdLike._id) + 1;
        } else newIdLike = 1;

        like = new LikeRN({
            _id: newIdLike,
            forUrlNew: forUrlNew,
            type: type,
            commentId: commentId,
            userName: userName,
            userAvatar: userAvatar,
            userIdChat: userId,
            ip: ip,
            time: Date(Date.now()),
        });
        await like.save();
        return functions.success(res, "Like comment thành công");


    } catch (err) {
        console.log("Err from server", err);
        return functions.setError(res, "Err from server", 500);
    }
};
// ứng tuyển
exports.createApplyNews = async (req, res, next) => {
    try {
        let { newId } = req.body;
        let candidateId = req.user.data.idRaoNhanh365;
        if (!newId) {
            return functions.setError(res, "Missing input value", 404);
        }
        let isExistUv = await ApplyNewsRN.findOne({
            candidateId: candidateId,
            newId,
        });
        if (isExistUv) {
            return functions.success(res, "Uv da ton tai!");
        } else {
            const maxIdApplyNew = await ApplyNewsRN.findOne({}, { _id: 1 })
                .sort({ _id: -1 })
                .limit(1)
                .lean();
            let newIdApplyNew;
            if (maxIdApplyNew) {
                newIdApplyNew = Number(maxIdApplyNew._id) + 1;
            } else newIdApplyNew = 1;

            like = new ApplyNewsRN({
                _id: newIdApplyNew,
                uvId: candidateId,
                newId: newId,
                applytime: new Date(),
            });
            await like.save();
        }
        return functions.success(res, "Candidate apply news success!");
    } catch (err) {
        console.log("Err from server", err);
        return functions.setError(res, "Err from server", 500);
    }
};
// xoá ứng viên
exports.deleteUv = async (req, res, next) => {
    try {
        let { id, newId } = req.body;
        if (!id) return functions.setError(res, "Missing input value", 404);
        let candidate = await ApplyNewsRN.findOneAndDelete({
            _id: id,
            newId
        });
        return functions.success(res, "Candidate not found");
    } catch (err) {
        console.log(err);
        return functions.setError(res, "Err from server", 500);
    }
};
// Quản lý khuyến mãi
exports.manageDiscount = async (req, res, next) => {
    try {
        let searchItem = {
            title: 1,
            money: 1,
            until: 1,
            'infoSell.promotionValue': 1,
            'infoSell.promotionType': 1,
            timePromotionStart: 1,
            timePromotionEnd: 1,
            cateID: 1,
            buySell: 1
        };
        let userID = req.user.data.idRaoNhanh365;
        let search = { userID };
        let { searchKey, cateID, promotionType } = req.query;
        if (searchKey) {
            let query = raoNhanh.createLinkTilte(searchKey);
            search.linkTitle = { $regex: `.*${query}.*` };
        }
        if (cateID) search.cateID = cateID;
        if (!promotionType) search["infoSell.promotionType"] = { $gt: 0 };
        else {
            search["infoSell.promotionType"] = promotionType;
        }
        let data = await New.find(search, searchItem);
        for (let i = 0; i < data.length; i++) {
            if (data[i].img) {
                data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", { data });
    } catch (err) {
        console.error(err);
        return functions.setError(res, err);
    }
};
// tin đang ứng tuyển
exports.getListNewsApplied = async (req, res, next) => {
    try {
        let userId = req.user.data.idRaoNhanh365;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let data = await ApplyNewsRN.aggregate([
            {
                $match: { uvId: userId }
            },
            { $sort: { _id: -1 } },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'RN365_News',
                    localField: 'newId',
                    foreignField: '_id',
                    as: 'new'
                }
            },
            { $unwind: '$new' },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'uvId',
                    foreignField: 'idRaoNhanh365',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    'new._id': 1, 'new.title': 1, 'new.han_su_dung': 1, 'new.name': 1, 'new.linkTitle': 1, 'user.idRaoNhanh365': 1,
                    'user._id': 1, 'user.userName': 1, 'user.inforRN365.xacThucLienket': 1, 'user.inforRN365.store_name': 1, _id: 1, status: 1, time: 1,
                    'new.cateID': 1, time: 1, 'new.han_su_dung': 1,
                    newId: '$new._id'
                }
            }
        ])

        const totalCount = await functions.findCount(ApplyNewsRN, { uvId: userId });
        return functions.success(res, "get list news applied sucess", {
            totalCount: totalCount,
            data
        });
    } catch (err) {
        console.log("Err from server", err);
        return functions.setError(res, "Err from server", 500);
    }
};
//Danh sách tin mà áp dụng dịch vụ
exports.listJobWithPin = async (req, res, next) => {
    try {
        let userID = req.user.data.idRaoNhanh365;
        let data = await New.find({
            userID: userID,
            $or: [{ pinHome: 1 }, { pinCate: 1 }, { timePushNew: { $ne: null } }],
        }, { _id: 1, cateID: 1, title: 1, money: 1, endvalue: 1, until: 1, createTime: 1, buySell: 1, free: 1, img: 1, dia_chi: 1, address: 1, pinHome: 1, pinCate: 1, new_day_tin: 1, sold: 1, cateID: 1, updateTime: 1 });
        for (let i = 0; i < data.length; i++) {
            if (data[i].img) {
                data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(
            res, "Get List New With Pin Of User Success!", { data }
        );
    } catch (err) {
        console.log("Err from server", err);
        return functions.setError(res, "Err from server", 500);
    }
};
// thêm mới khuyến mãi
exports.addDiscount = async (req, res, next) => {
    try {
        let request = req.body;
        let user_id = req.user.data.idRaoNhanh365;
        if (request.new_id && request.new_id.length) {
            for (let i = 0; i < request.new_id.length; i++) {
                let loai_khuyenmai = request.loai_khuyenmai;
                let giatri_khuyenmai = request.giatri_khuyenmai;
                let ngay_bat_dau = request.ngay_bat_dau;
                let ngay_ket_thuc = request.ngay_ket_thuc;
                let new_id = request.new_id[i];
                if (
                    loai_khuyenmai &&
                    ngay_bat_dau &&
                    ngay_ket_thuc &&
                    giatri_khuyenmai
                ) {
                    if (loai_khuyenmai === 1 || loai_khuyenmai === 2) {
                    } else {
                        return functions.setError(res, "Nhập ngày không hợp lệ", 400);
                    }
                    if (
                        functions.checkNumber(giatri_khuyenmai) === false ||
                        giatri_khuyenmai <= 0
                    ) {
                        return functions.setError(res, "invalid number", 400);
                    }

                    if (
                        (await functions.checkDate(ngay_bat_dau)) === true &&
                        (await functions.checkDate(ngay_ket_thuc)) === true
                    ) {
                        if (
                            (await functions.checkTime(ngay_bat_dau)) &&
                            (await functions.checkTime(ngay_ket_thuc))
                        ) {
                            let date1 = new Date(ngay_bat_dau);
                            let date2 = new Date(ngay_ket_thuc);
                            if (date1 >= date2) {
                                return functions.setError(res, "Nhập ngày không hợp lệ", 400);
                            }
                        } else {
                            return functions.setError(
                                res,
                                "Ngày nhập vào nhỏ hơn ngày hiện tại",
                                400
                            );
                        }
                    } else {
                        return functions.setError(res, "Invalid date format", 400);
                    }
                    let checkNew = await New.findById(new_id);
                    if (checkNew && checkNew.length !== 0) {
                        await New.findByIdAndUpdate(new_id, {
                            timePromotionStart: ngay_bat_dau,
                            timePromotionEnd: ngay_ket_thuc,
                            "infoSell.promotionType": loai_khuyenmai,
                            "infoSell.promotionValue": giatri_khuyenmai,
                        });
                    } else {
                        return functions.setError(res, "not found new", 400);
                    }
                } else {
                    return functions.setError(res, "missing data", 400);
                }
            }
        }
        return functions.success(res, "add discount success");
    } catch (error) {
        console.log("Err from server", error);
        return functions.setError(res, error);
    }
};
// bình luận
exports.comment = async (req, res, next) => {
    try {
        let { cm_id, url, comment } = req.body;
        let userID = req.user.data.idRaoNhanh365;
        let File = req.files;
        let parent_id = 0;
        if (cm_id) parent_id = cm_id;
        let content = comment;
        let ip = req.ip;
        let tag = req.body.tag || null;
        let time = new Date();
        let _id = (await functions.getMaxID(Comments)) + 1;

        if (url) {
            if (File.Image) {
                let img = await raoNhanh.uploadFileRaoNhanh(
                    "comment",
                    `${time.getFullYear()}/${time.getMonth() + 1
                    }/${time.getDate()}`,
                    File.Image,
                    [".jpg", ".png"]
                );
                if (!img) {
                    return functions.setError("Ảnh không phù hợp");
                }
                await Comments.create({
                    _id,
                    url,
                    parent_id,
                    content,
                    img: `/pictures/comment/${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}/` + img,
                    ip,
                    sender_idchat: userID,
                    tag,
                    time,
                });
            } else {
                await Comments.create({
                    _id,
                    url,
                    parent_id,
                    content,
                    ip,
                    sender_idchat: userID,
                    tag,
                    time,
                });
            }
        } else {
            return functions.setError(res, "missing data", 400);
        }

        return functions.success(res, "comment success");
    } catch (error) {
        return functions.setError(res, error);
    }
};
// sửa bình luận
exports.updateComment = async (req, res, next) => {
    try {
        let { comment, id_comment } = req.body;
        let userID = req.user.data.idRaoNhanh365;
        let File = req.files;
        let content = comment;
        let ip = req.ip;
        let tag = req.body.tag || null;

        if (id_comment && ip) {
            let check = await Comments.findById(id_comment);

            let date = new Date(check.time)
            if (File.Image) {
                let img = await raoNhanh.uploadFileRaoNhanh(
                    "comment",
                    `${date.getFullYear()}/${date.getMonth() + 1
                    }/${date.getDate()}`,
                    File.Image,
                    [".jpg", ".png"]
                );
                if (!img) {
                    return functions.setError("Ảnh không phù hợp");
                }
                await Comments.findOneAndUpdate(
                    { _id: id_comment, sender_idchat: userID },
                    { content, img: `/pictures/comment/${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}/` + img, tag }
                );
            } else {
                await Comments.findOneAndUpdate(
                    { _id: id_comment, sender_idchat: userID },
                    { content, tag }
                );
            }
        } else {
            return functions.setError(res, "missing data", 400);
        }

        return functions.success(res, "comment success");
    } catch (error) {
        return functions.setError(res, error);
    }
};
// danh sách ứng viên đang ứng tuyển
exports.getListCandidateApplied = async (req, res, next) => {
    try {
        let userID = req.user.data.idRaoNhanh365;

        // let searchItem = {
        //     new: {
        //         _id: 1, userID: 1, timeSell: 1, title: 1, linkTitle: 1, han_su_dung: 1,
        //         name: 1, cateID: 1
        //     }, user: { _id: 1, userName: 1, 'inforRN365.store_name': 1, type: 1, chat365_secret: 1, phone: 1 }
        //     , _id: 1, time: 1, status: 1, note: 1
        // }
        let data = await ApplyNews.aggregate([
            {
                $match: {
                    uvId: userID
                }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'uvId',
                    foreignField: 'idRaoNhanh365',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'RN365_News',
                    localField: 'newId',
                    foreignField: '_id',
                    as: 'new'
                }
            },
            // {
            //     $project: searchItem
            // }
        ])

        return functions.success(res, "get list candidate applied sucess", {
            data
        });
    } catch (err) {
        console.log("Err from server", err);
        return functions.setError(res, "Err from server", 500);
    }
};
// api lấy thông tin ngân hàng
exports.getDatabank = async (req, res, next) => {
    try {
        let data = await NetworkOperator.find({ active: 1 });
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error)
    }
}
// nạp tiền
exports.napTien = async (req, res, next) => {
    try {
        let nhaCungCap = req.body.nhaCungCap;
        let maThe = req.body.maThe;
        let soSerial = req.body.soSerial;
        let menhGia = req.body.menhGia;
        let idRaoNhanh365 = req.user.data.idRaoNhanh365;
        if (nhaCungCap && maThe && soSerial && menhGia) {
            let partner_id = 66878317039;
            let partner_key = '982fd3f73b5a4c2374a4c3fe08ebca85';
            let request_id = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            let sign = md5(partner_key, maThe, soSerial)
            let ngay_nap = new Date();
            let check = await axios({
                method: "post",
                url: "https://work247.vn/apiRaonhanh/connectChargingws.php",
                data: {
                    telco: nhaCungCap,
                    code: maThe,
                    serial: soSerial,
                    amount: menhGia,
                    request_id: request_id,
                    partner_id: partner_id,
                    sign: sign,
                    command: 'charging'
                },
                headers: { 'Content-Type': 'application/json' }
            });
            if (check.status == 1 || check.status == 99) {
                let bangGia = await NetworkOperator.findOne({ active: 1, nameAfter: nhaCungCap, })
                let tienNhan = menhGia - ((menhGia * bangGia.discount) / 100);
                await Users.findOneAndUpdate({ idRaoNhanh365 }, { $inc: { 'inforRN365.money': +tienNhan } })
                await History.create({
                    userId: idRaoNhanh365,
                    seri: soSerial,
                    cardId: maThe,
                    tranId: ',',
                    price: menhGia,
                    priceSuccess: tienNhan,
                    content: 'Nạp tiền',
                    networkOperatorName: nhaCungCap,
                    time: ngay_nap,


                })
            }
            return functions.setError(res, 'mã thẻ sai', 400)
        }
        return functions.setError(res, 'missing data', 400)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}
// api lấy danh sách đấu thầu theo id
exports.getDataBidding = async (req, res, next) => {
    try {
        let id = Number(req.body.id);
        let sapxep = Number(req.body.type);
        let data = await Bidding.aggregate([
            { $match: { newId: id } },
            { $sort:{}},
            {
                $lookup: {
                    from: 'RN365_News',
                    localField: 'newId',
                    foreignField: '_id',
                    as: 'new'
                }
            },
            { $unwind: '$new' },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'userID',
                    foreignField: 'idRaoNhanh365',
                    as: 'nguoidauthau'
                }
            },
            { $unwind: '$nguoidauthau' },
            {
                $project: {
                    _id: 1,
                    newId: 1,
                    userName: 1,
                    userIntro: 1,
                    userFile: 1,
                    userProfile: 1,
                    userProfileFile: 1,
                    productName: 1,
                    productDesc: 1,
                    productLink: 1,
                    price: 1,
                    priceUnit: 1,
                    promotion: 1,
                    promotionFile: 1,
                    status: 1,
                    createTime: 1,
                    note: 1,
                    updatedAt: 1,
                    nguoidauthau: {
                        userName: 1,
                        avatarUser: 1,
                        phone: 1,
                        isOnline: 1,
                        phoneTK: 1,
                        address: 1,
                    },
                    thongtinthau: '$new.bidding'
                }
            }

        ])

        return functions.success(res, "get data success", { data });
    } catch (error) {
        console.error(error)
        return functions.setError(res, error);
    }
};

// info ghim tin
exports.ghimTin = async (req, res, next) => {
    try {
        let id = Number(req.body.id);
        if (!id) return functions.setError(res, 'missing id', 400)
        let userId = req.user.data.idRaoNhanh365;
        let data = await New.findOne({ _id: id, userID: userId }, {
            title: 1, money: 1, img: 1, address: 1,
            createTime: 1, until: 1, cateID: 1, endvalue: 1, free: 1, buySell: 1
        });
        if (data.img) {
            data.img = await raoNhanh.getLinkFile(data.img, data.cateID, data.buySell)
        }
        let trangchu = await PriceList.find({ type: 1 }).limit(5)
        let trangdanhmuc = await PriceList.find({ type: 5 }).limit(5)

        return functions.success(res, 'get data success', { data, trangchu, trangdanhmuc })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// info day tin
exports.dayTin = async (req, res, next) => {
    try {
        let id = Number(req.body.id);
        if (!id) return functions.setError(res, 'missing id', 400)
        let userId = req.user.data.idRaoNhanh365;
        let data = await New.findOne({ _id: id, userID: userId }, {
            title: 1, money: 1, img: 1, address: 1,
            createTime: 1, until: 1, cateID: 1, endvalue: 1, free: 1, buySell: 1
        });
        if (data.img) {
            data.img = await raoNhanh.getLinkFile(data.img, data.cateID, data.buySell)
        }
        let tien_daytin = await PriceList.find({ type: 2 }).limit(1)
        let thoigian = await PushNewsTime.find()

        return functions.success(res, 'get data success', { data, tien_daytin, thoigian })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// cập nhật tin
exports.capNhatTin = async (req, res, next) => {
    try {
        let id = Number(req.body.id);
        if (!id) return functions.setError(res, 'missing id', 400)
        let userId = req.user.data.idRaoNhanh365;
        let data = await New.findOne({ _id: id, userID: userId });
        if (!data) return functions.setError(res, 'not found new', 404)
        let thoi_gian = new Date();
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let ngay = new Date().getDate();
        let hom_nay = new Date(year, month, ngay).getTime() / 1000;
        let ngay_mai = hom_nay + 86400;
        let check = await New.countDocuments({
            userID: userId,
            refreshTime: {
                $gt: hom_nay,
                $lt: ngay_mai
            },
            refresh_new_home: 1
        })
        if (check === 0) {
            await New.findByIdAndUpdate(id, {
                createTime: thoi_gian,
                updateTime: thoi_gian,
                refreshTime: thoi_gian.getTime() / 1000,
                refresh_new_home: 1
            })
        } else {
            return functions.setError(res, 'Bạn đã làm mới tin ngày hôm nay.', 400)
        }
        return functions.success(res, 'update new success')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// đăng bán lại
exports.dangBanLai = async (req, res, next) => {
    try {
        let id = Number(req.body.id);
        let userID = req.user.data.idRaoNhanh365;
        let type = Number(req.body.type);
        if (!id) return functions.setError(res, 'missing id', 400)
        let checkga = await New.findOne({ _id: id, userID: userID })
        if (!checkga) return functions.setError(res, 'not found new', 404)

        // đã bán
        if (type === 1) {
            await New.findByIdAndUpdate(id, {
                sold: 1,
                timeSell: new Date(),
            })
            let check = await New.findOneAndUpdate({
                _id: id,
                userID: userID,
                $or: [
                    { pinHome: { $ne: 0 } },
                    { pinCate: { $ne: 0 } },
                    { new_day_tin: { $ne: 0 } }
                ]
            }, {
                timeStartPinning: new Date().getTime() / 1000,
            })
            await axios({
                method: "post",
                url: "http://43.239.223.10:5003/update_data_sanpham",
                data: {
                    new_id: id,
                    da_ban: 1,
                    site: 'spraonhanh365'
                },
                headers: { 'Content-Type': 'application/json' }
            });
        } else if (type === 2) {
            let check = await New.findOne({
                _id: id,
                userID: userID,
                $or: [
                    { pinHome: { $ne: 0 } },
                    { pinCate: { $ne: 0 } },
                    { new_day_tin: { $ne: 0 } }
                ]
            }, { timePinning: 1, dayEndPinning: 1 })
            if (check) {
                dayEndPinning = check.dayEndPinning;
                timePinning = check.timePinning;
                let tgian_clai = dayEndPinning - timePinning;
                let tgian_ktmoi = tgian_clai + new Date().getTime() / 1000;
                await New.findOneAndUpdate({
                    _id: id,
                    userID: userID,
                }, {
                    timePinning: 0,
                    dayEndPinning: tgian_ktmoi
                })
            }
            await New.findOneAndUpdate({
                _id: id,
                userID: userID,
            }, {
                sold: 0,
                createTime: new Date()
            });
            await axios({
                method: "post",
                url: "http://43.239.223.10:5003/update_data_sanpham",
                data: {
                    new_id: id,
                    da_ban: 0,
                    site: 'spraonhanh365'
                },
                headers: { 'Content-Type': 'application/json' }
            });

        }
        return functions.success(res, 'success')
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
}

// xoá comment
exports.deleteComment = async (req, res, next) => {
    try {
        let id = Number(req.body.id);
        let userID = req.user.data.idRaoNhanh365;
        if (!id) return functions.setError(res, 'missing id', 400)
        let check = await Comments.findOne({
            sender_idchat: userID,
            _id: id
        })
        if (!check) return functions.setError(res, 'not found comment', 404)

        await Comments.findOneAndDelete({
            sender_idchat: userID,
            _id: id
        })
        return functions.success(res, 'delete comment success')
    } catch (error) {
        return functions.setError(res, error);
    }
}

// support for update new 
exports.getDataNew = async (req, res, next) => {
    try {
        let id = Number(req.query.id);
        let data = await New.findById(id);
        if (data) {
            let nameCate = await raoNhanh.getNameCate(data.cateID, 1)
            let folder = await raoNhanh.checkFolderCateRaoNhanh(nameCate)
            if (data.video) {
                data.video = process.env.DOMAIN_RAO_NHANH + `/pictures/${folder}/` + data.video
            }
            if (data.img) {
                data.img = await raoNhanh.getLinkFile(data.img, data.cateID, data.buySell)
            }
            return functions.success(res, 'get data success', { data })
        } else {
            return functions.success(res, 'get data success', { data: [] })
        }
    } catch (error) {
        return functions.setError(res, error)
    }
}

// lấy tin theo danh mục
exports.getNewForDiscount = async (req, res, next) => {
    try {
        let userID = req.user.data.idRaoNhanh365;
        let cateID = req.query.cateID;
        let data = await New.find({ cateID, userID }, {
            electroniceDevice: 0, vehicle: 0, realEstate: 0, ship: 0, beautifull: 0, wareHouse: 0, pet: 0, Job: 0,
            noiThatNgoaiThat: 0, bidding: 0
        })
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].img) {
                    data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, 2)
                }
            }
        }
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: new.js:3342 ~ exports.getNewForDiscount= ~ error:", error)
        return functions.setError(res, error)
    }
}

// lấy tin đã áp dụng khuyến mãi
exports.tinApDungKhuyenMai = async (req, res, next) => {
    try {
        let userID = req.user.data.idRaoNhanh365;
        let cateID = req.body.cateID;
        let type = Number(req.body.type);
        let ten = req.body.ten;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let conditions = {};
        if (cateID) conditions.cateID = Number(cateID);
        if (type) conditions.type = Number(type);
        if (ten) {
            conditions.title = new RegExp(ten, 'i')
        }
        conditions.userID = userID;
        conditions.buySell = 2;
        let data = await New.find(conditions, {
            electroniceDevice: 0, vehicle: 0, realEstate: 0, ship: 0, beautifull: 0, wareHouse: 0, pet: 0, Job: 0,
            noiThatNgoaiThat: 0, bidding: 0
        }).skip(skip).limit(limit)
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].img) {
                    data[i].img = await raoNhanh.getLinkFile(data[i].img, data[i].cateID, 2)
                }
            }
        }
        return functions.success(res, 'get data success', { data })
    } catch (err) {
        return functions.setError(res, err)
    }
}

// chỉnh sửa tin khuyến mãi
exports.updateNewPromotion = async (req, res, next) => {
    try {
        let id = req.body.id;
        let loaikhuyenmai = req.body.loaikhuyenmai;
        let giatri = req.body.giatri;
        let ngay_bat_dau = req.body.ngay_bat_dau;
        let ngay_ket_thuc = req.body.ngay_ket_thuc;
        if (Array.isArray(loaikhuyenmai) && Array.isArray(giatri) && Array.isArray(id)
            && loaikhuyenmai.length === giatri.length && giatri.length === id.length) {
            for (let i = 0; i < id.length; i++) {
                let checkNew = await New.findById(id[i]);
                if (checkNew) {
                    await New.findByIdAndUpdate(id[i], {
                        timePromotionStart: new Date(ngay_bat_dau[i]).getTime() / 1000,
                        timePromotionEnd: new Date(ngay_ket_thuc[i]).getTime() / 1000,
                        "infoSell.promotionType": loaikhuyenmai[i],
                        "infoSell.promotionValue": giatri[i],
                    });
                } else {
                    return functions.setError(res, "Không tìm thấy tin", 400);
                }
            }
            return functions.success(res, 'Cập nhật khuyến mãi thành công')
        }
        return functions.setError(res, 'Nhập đúng kiểu dữ liệu')
    } catch (error) {
        return functions.setError(res, error)
    }
}