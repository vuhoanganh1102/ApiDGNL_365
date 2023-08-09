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
const raoNhanh = require("../../services/raoNhanh365/service");
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
const BaoCao = require("../../models/Raonhanh365/BaoCao");
const tags = require("../../models/Raonhanh365/Tags");
const City = require("../../models/City");
const District = require("../../models/District");
const Ward = require("../../models/Raonhanh365/PhuongXa");
const CateVl = require("../../models/Raonhanh365/CateVl");
const Keywords = require("../../models/Raonhanh365/Keywords");

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
        let linkImage = req.body.linkImage;
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
        let brand = request.brand;
        let chat_lieu = request.chat_lieu;
        let kich_co = request.kich_co;

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
            brand,
            endvalue,
            downPayment,
            until,
            kich_co,
            chat_lieu,
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
            linkImage,
            video,
            chat_lieu,
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
        return functions.setError(res, err.message);
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
                loai_xe: request.loai_xe,
                xuat_xu: request.xuat_xu,
                mau_sac: request.mau_sac,

                chat_lieu_khung: request.chat_lieu_khung,
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
                vehicleType: request.vehicleType,
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
            };
            let fieldwareHouse = {
                loai_thiet_bi: req.body.loai_thiet_bi,
                cong_suat: req.body.cong_suat,
                dung_tich: req.body.dung_tich,
                khoiluong: req.body.khoiluong,
                loai_chung: req.body.loai_chung,
            };

            let noiThatNgoaiThat = {
                hinhdang: req.body.hinhdang,
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
        return functions.setError(res, err.message);
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
                    image.push({ nameImg: img })
                } else {
                    return functions.setError(res, 'upload file failed', 400)
                }
            }
            fields.img = image;
        }
        if (fields.linkImage && fields.linkImage.length) {
            for (let i = 0; i < fields.linkImage.length; i++) {
                await raoNhanh.copyFolder(fields.linkImage[i], folder)
                let img = fields.linkImage[i].split('/').reverse()[0]
                fields.img.push({ nameImg: img })
            }
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
        fields.updateTime = new Date();

        const news = new New(fields);
        await news.save();
        return functions.success(res, "create news success");
    } catch (err) {
        console.error(err);
        return functions.setError(res, err.message);
    }
};
//chỉnh sửa tin bán
exports.updateNews = async (req, res, next) => {
    try {
        let idNews = Number(req.body.news_id);
        if (!idNews) return functions.setError(res, "Missing input news_id!", 400);
        let existsNews = await New.findById(idNews).lean();
        if (!existsNews) return functions.setError(res, "Không tìm thấy tin", 404);
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
        }
        if (fields.linkImage && Array.isArray(fields.linkImage)) {
            for (let i = 0; i < fields.linkImage.length; i++) {
                let check = await raoNhanh.copyFolder(fields.linkImage[i], folder)
                if (!check) return functions.setError(res, 'upload file failed', 400)
                let img = fields.linkImage[i].split('/').reverse()[0]
                image.push({ nameImg: img })
            }
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
            fields.updateTime = new Date();
            await New.findByIdAndUpdate(idNews, fields);
            return functions.success(res, "Sửa tin thành công");
        }
    } catch (err) {
        console.error(err);
        return functions.setError(res, err.message);
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
        return functions.setError(res, err.message);
    }
};
// ghim tin
exports.pinNews = async (req, res, next) => {
    try {
        let idNews = Number(req.body.id);
        let userID = req.user.data.idRaoNhanh365;
        if (!idNews) return functions.setError(res, "Missing input news_id", 400);
        let {
            type,
            tienthanhtoan,
            so_ngay
        } = req.body;
        let existsNews = await New.findOne({ _id: idNews, userID });
        let check = await Users.findOne({ idRaoNhanh365: userID }, { inforRN365: 1 });
        if (check.inforRN365 && check.inforRN365.money) {
            if (check.inforRN365.money < tienthanhtoan) {
                return functions.setError(res, 'You dont have enough money', 400)
            }
        } else {
            return functions.setError(res, 'You dont have enough money', 400)
        }
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
        return functions.setError(res, err.message);
    }
};
// đẩy tin
exports.pushNews = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let userID = req.user.data.idRaoNhanh365;
        let type = req.user.data.type;
        // biến người dùng nhập vào
        let id = Number(req.body.id);
        let tienThanhToan = Number(req.body.tienThanhToan);
        let gioDayTin = Number(req.body.gioDayTin);
        let gio_lonnhat = gioDayTin;
        let gio_nhonhat = gioDayTin - 1;
        let so_ngay = Number(req.body.so_ngay);
        let noi_dung = 'Đẩy tin đăng ';
        let thoi_gian = new Date();
        let ngay_bdau = new Date(thoi_gian.getFullYear(), thoi_gian.getMonth(), thoi_gian.getDate()).getTime() / 1000;
        let checkuser = await User.findOne({ idRaoNhanh365: userID }).lean();
        if (checkuser && checkuser.inforRN365 && checkuser.inforRN365.money) {
            if (checkuser.inforRN365.money > tienThanhToan) {
                if (id && tienThanhToan && gioDayTin && so_ngay) {
                    let gio_ss = gio_nhonhat * 3600 + ngay_bdau
                    if (gio_ss > thoi_gian.getTime() / 1000) {
                        var ngay_kthuc = (ngay_bdau + (86400 * so_ngay) + (gio_lonnhat * 3600)) - 86400;
                    } else {
                        var ngay_kthuc = ngay_bdau + (86400 * so_ngay) + (gio_lonnhat * 3600);
                    }
                    let check = await New.findOne({
                        _id: id,
                        userID
                    })
                    if (check) {
                        await New.findByIdAndUpdate(id,
                            {
                                new_day_tin: gioDayTin,
                                numberDayPinning: so_ngay,
                                timeStartPinning: thoi_gian.getTime() / 1000,
                                dayStartPinning: ngay_bdau,
                                dayEndPinning: ngay_kthuc,
                                moneyPinning: tienThanhToan
                            })

                        await User.findOneAndUpdate({ idRaoNhanh365: userID }, {
                            $inc: { 'inforRN365.money': -tienThanhToan }
                        })

                        let hisID = await functions.getMaxID(History) + 1 || 1;
                        await History.create({
                            _id: hisID,
                            userId: userID,
                            price: tienThanhToan,
                            priceSuccess: tienThanhToan,
                            time: new Date(),
                            type: req.user.data.type,
                            content: noi_dung,
                            distinguish: 2
                        })
                        return functions.success(res, 'Đẩy tin thành công')
                    }
                    return functions.setError(res, 'không tìm thấy tin của bạn', 404)
                }
                return functions.setError(res, 'missing data', 400)
            }
            return functions.setError(res, 'Số dư tài khoản không đủ', 400)
        }
        return functions.setError(res, 'Không tìm thấy tài khoản user hoặc tiền còn lại bằng null', 400)

    } catch (err) {
        console.error(err);
        return functions.setError(res, err.message);
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
        return functions.setError(res, err.message);
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
            { $sort: { pinHome: -1 }, },
            { $match: { buySell: 2, sold: 0, active: 1, userID: { $ne: 0 } } },
            { $sort: { createTime: -1, updateTime: -1 } },
            { $limit: 50 },
            {
                $lookup: {
                    from: "Users",
                    localField: 'userID',
                    foreignField: "idRaoNhanh365",
                    as: "user",
                },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $project: searchItem },

        ]);
        if (userIdRaoNhanh) {
            var dataLoveNew = await LoveNews.find({ id_user: userIdRaoNhanh }).lean();
        }
        for (let i = 0; i < data.length; i++) {
            data[i].link = `https://raonhanh365.vn/${data[i].linkTitle}-c${data[i]._id}.html`;
            data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, 2)
            data[i].islove = 0;
            if (data[i].user && data[i].user.avatarUser) {
                data[i].user.avatarUser = await raoNhanh.getLinkAvatarUser(data[i].user.idRaoNhanh365, data[i].user.avatarUser)
            }
            if (userIdRaoNhanh) {
                let checklove = dataLoveNew.find(item => item.id_new == data[i]._id);
                checklove ? data[i].islove = 1 : data[i].islove = 0;
            }
            if (data[i].city && data[i].city != 0) {
                let datacity = await City.findById({ _id: data[i].city }).lean();
                if (datacity) data[i].city = datacity.name
            }
            if (data[i].district && data[i].district != 0) {
                let datadistric = await District.findById({ _id: data[i].district }).lean();
                if (datadistric) data[i].district = datadistric.name
            }
            if (data[i].ward && data[i].ward != 0) {
                let dataward = await Ward.findById({ _id: data[i].ward }).lean();
                if (dataward) data[i].ward = dataward.name
            }
        }

        return functions.success(res, "get data success", { data });
    } catch (error) {
        console.error(error);
        return functions.setError(res, error.message);
    }
};
// tìm kiếm tin
exports.searchNew = async (req, res, next) => {
    try {
        let link = req.body.link;
        let buySell = 1;
        let searchItem = {};
        let uutien = Number(req.body.uutien) || 2;
        let {
            search_key,
            cateID,
            brand,
            startvalue,
            microprocessor,
            ram,
            hardDrive,
            typeHardrive,
            screen,
            size,
            Jobcity,
            Jobdistrict,
            Jobward,
            device,
            capacity,
            machineSeries,
            com_address_num,
            productType,
            productGroup,
            warranty,
            endvalue,
            numberOfSeats,
            loai_sanphamwh,
            loai_sanphambe,
            phien_banxc,
            phien_banddt,
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
        if (brand) condition.brand = brand;
        if (city) condition.city = Number(city);
        if (district) condition.district = Number(district);
        if (ward) condition.ward = Number(ward);
        if (com_address_num) condition.com_address_num = com_address_num;
        if (productType) condition.productType = productType;
        if (productGroup) condition.productGroup = productGroup;
        if (baohanh) condition.baohanh = baohanh;
        if (microprocessor)
            condition["electroniceDevice.microprocessor"] = microprocessor;
        if (ram) condition["electroniceDevice.ram"] = ram;
        if (hardDrive) condition["electroniceDevice.hardDrive"] = hardDrive;
        if (typeHardrive)
            condition["electroniceDevice.typeHardrive"] = typeHardrive;
        if (screen) condition["electroniceDevice.screen"] = screen;
        if (size) condition["electroniceDevice.size"] = size;
        if (warranty) condition["electroniceDevice.warranty"] = warranty;
        if (device) condition["electroniceDevice.device"] = device;
        if (capacity) condition["electroniceDevice.capacity"] = capacity;
        if (sdung_sim) condition["electroniceDevice.sdung_sim"] = sdung_sim;
        if (phien_banddt) condition["electroniceDevice.phien_ban"] = phien_banddt;
        if (machineSeries)
            condition["electroniceDevice.machineSeries"] = machineSeries;
        if (loai_xe) condition["vehicle.loai_xe"] = loai_xe;
        if (xuat_xu) condition["vehicle.xuat_xu"] = xuat_xu;
        if (mau_sac) condition["vehicle.mau_sac"] = mau_sac;
        if (kich_co) condition.kich_co = kich_co;
        if (chat_lieu_khung) condition["vehicle.chat_lieu_khung"] = chat_lieu_khung;
        if (dong_xe) condition["vehicle.dong_xe"] = dong_xe;
        if (nam_san_xuat) condition["vehicle.nam_san_xuat"] = nam_san_xuat;
        if (dung_tich) condition["vehicle.dung_tich"] = dung_tich;
        if (td_bien_soxe) condition["vehicle.td_bien_soxe"] = td_bien_soxe;
        if (phien_banxc) condition["vehicle.phien_ban"] = phien_banxc;
        if (hop_so) condition["vehicle.hop_so"] = hop_so;
        if (nhien_lieu) condition["vehicle.nhien_lieu"] = nhien_lieu;
        if (kieu_dang) condition["vehicle.kieu_dang"] = kieu_dang;
        if (so_cho) condition["vehicle.so_cho"] = so_cho;
        if (trong_tai) condition["vehicle.trong_tai"] = trong_tai;
        if (loai_linhphu_kien)
            condition["vehicle.loai_linhphu_kien"] = loai_linhphu_kien;
        if (so_km_da_di) condition["vehicle.so_km_da_di"] = so_km_da_di;
        if (numberOfSeats) condition["vehicle.numberOfSeats"] = numberOfSeats;
        if (ten_toa_nha) condition["realEstate.ten_toa_nha"] = ten_toa_nha;
        if (td_macanho) condition["realEstate.td_macanho"] = td_macanho;
        if (ten_phan_khu)
            condition["realEstate.ten_phan_khu"] = ten_phan_khu;
        if (td_htmch_rt) condition["realEstate.td_htmch_rt"] = td_htmch_rt;
        if (so_pngu) condition["realEstate.so_pngu"] = so_pngu;
        if (so_pve_sinh)
            condition["realEstate.so_pve_sinh"] = so_pve_sinh;
        if (tong_so_tang) condition["realEstate.tong_so_tang"] = tong_so_tang;
        if (huong_chinh) condition["realEstate.huong_chinh"] = huong_chinh;
        if (giay_to_phap_ly) condition["realEstate.giay_to_phap_ly"] = giay_to_phap_ly;
        if (tinh_trang_noi_that) condition["realEstate.tinh_trang_noi_that"] = tinh_trang_noi_that;
        if (dac_diem) condition["realEstate.dac_diem"] = dac_diem;
        if (dien_tich) condition["realEstate.dien_tich"] = dien_tich;
        if (dientichsd) condition["realEstate.dientichsd"] = dientichsd;
        if (chieu_dai) condition["realEstate.chieu_dai"] = chieu_dai;
        if (chieu_rong) condition["realEstate.chieu_rong"] = chieu_rong;
        if (tinh_trang_bds)
            condition["realEstate.tinh_trang_bds"] = tinh_trang_bds;
        if (td_block_thap) condition["realEstate.td_block_thap"] = td_block_thap;
        if (tang_so)
            condition["realEstate.tang_so"] = tang_so;
        if (loai_hinh_canho) condition["realEstate.loai_hinh_canho"] = loai_hinh_canho;
        if (loaihinh_vp) condition["realEstate.loaihinh_vp"] = loaihinh_vp;
        if (loai_hinh_dat) condition["realEstate.loai_hinh_dat"] = loai_hinh_dat;
        if (kv_thanhpho) condition["realEstate.kv_thanhpho"] = kv_thanhpho;
        if (kv_quanhuyen) condition["realEstate.kv_quanhuyen"] = kv_quanhuyen;
        if (kv_phuongxa) condition["realEstate.kv_phuongxa"] = kv_phuongxa;
        if (product) condition["ship.product"] = product;
        if (timeStart) condition["ship.timeStart"] = { $gte: { timeStart } };
        if (timeEnd) condition["ship.timeEnd"] = { $gte: { timeEnd } };
        if (allDay) condition["ship.allDay"] = allDay;
        if (loai_hinh_sp) condition["beautifull.loai_hinh_sp"] = loai_hinh_sp;
        if (loai_sanphambe) condition["beautifull.loai_sanpham"] = loai_sanphambe;
        if (hang_vattu) condition["beautifull.hang_vattu"] = hang_vattu;
        if (loai_thiet_bi) condition["wareHouse.loai_thiet_bi"] = loai_thiet_bi;
        if (hang) condition["wareHouse.hang"] = hang;
        if (cong_suat) condition["wareHouse.cong_suat"] = cong_suat;
        if (hang_vattu) condition["wareHouse.hang_vattu"] = hang_vattu;
        if (dung_tich) condition["wareHouse.dung_tich"] = dung_tich;
        if (khoiluong) condition["wareHouse.khoiluong"] = khoiluong;
        if (loai_chung) condition["wareHouse.loai_chung"] = loai_chung;
        if (block) condition["pet.block"] = block;
        if (kindOfPet) condition["pet.kindOfPet"] = kindOfPet;
        if (age) condition["pet.age"] = age;
        if (gender) condition["pet.gender"] = gender;
        if (jobType) condition["Job.jobType"] = jobType;
        if (jobDetail) condition["Job.jobDetail"] = jobDetail;
        if (jobKind) condition["Job.jobKind"] = jobKind;
        if (salary) condition["Job.salary"] = salary;
        if (gender) condition["Job.gender"] = gender;
        if (exp) condition["Job.exp"] = exp;
        if (level) condition["Job.level"] = level;
        if (degree) condition["Job.degree"] = degree;
        if (skill) condition["Job.skill"] = skill;
        if (Jobcity) condition["Job.city"] = Jobcity;
        if (Jobdistrict) condition["Job.district"] = Jobdistrict;
        if (Jobward) condition["Job.ward"] = Jobward;
        if (payBy) condition["Job.payBy"] = payBy;
        if (benefit) condition["Job.benefit"] = benefit;
        if (startvalue) condition.money = { $gte: Number(startvalue) };
        if (endvalue) condition.money = { $lte: Number(endvalue) };
        if (startvalue && endvalue) condition.money = { $gte: Number(startvalue), $lte: Number(endvalue) };
        condition.userID = { $ne: 0 }
        condition.active = 1
        let sort = { pinCate: -1 };
        if (uutien === 2) sort.updateTime = -1;
        if (uutien === 3) condition.type = 0;
        if (uutien === 4) condition.type = 1;
        if (uutien === 1) sort.viewCount = -1;
        let data = await New.aggregate([
            { $sort: sort },
            { $match: condition },
            { $skip: skip },
            { $limit: limit },
            { $sort: { createTime: -1, order: -1, updateTime: -1 } },
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
                data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell)
                data[i].soluonganh = data[i].img.length
            }
            data[i].islove = 0;
            if (buySell === 1) {
                data[i].link = `https://raonhanh365.vn/${data[i].linkTitle}-ct${data[i]._id}.html`;
            } else {
                data[i].link = `https://raonhanh365.vn/${data[i].linkTitle}-c${data[i]._id}.html`;
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
                let minhLike = ListLike.find((item) => item.userIdChat == userIdRaoNhanh)
                minhLike ? data[i].minhLike = 1 : data[i].minhLike = 0
                minhLike ? data[i].typelike = minhLike.type : data[i].typelike = 0
            }
            if (data[i].city && data[i].city != 0) {
                let datacity = await City.findById({ _id: data[i].city }).lean();
                if (datacity) data[i].city = datacity.name
            }
            if (data[i].district && data[i].district != 0) {
                let datadistric = await District.findById({ _id: data[i].district }).lean();
                if (datadistric) data[i].district = datadistric.name
            }
            if (data[i].ward && data[i].ward != 0) {
                let dataward = await Ward.findById({ _id: data[i].ward }).lean();
                if (dataward) data[i].ward = dataward.name
            }
            data[i].soShare = 0;
            data[i].nguoiShare = [];
            data[i].ListLike = ListLike
            data[i].ListComment = ListComment
            data[i].soluonglike = soluonglike
            data[i].soluongcomment = soluongcomment

        }

        let totalCount = data.length

        return functions.success(res, "get data success", {
            totalCount,
            data,
        });
    } catch (error) {
        console.error(error);
        return functions.setError(res, error.message);
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
            linkImage,
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

            if (File.Image && File.Image.length) {
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
            if (linkImage && Array.isArray(linkImage)) {
                for (let i = 0; i < linkImage.length; i++) {
                    let check = await raoNhanh.copyFolder(linkImage[i], 'avt_tindangmua')
                    if (!check) return functions.setError(res, 'upload file failed', 400)
                    let imgg = linkImage[i].split('/').reverse()[0]
                    img.push({ nameImg: imgg })
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
        return functions.setError(res, error.message);
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
            linkImage,
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
            if (File.Image && File.Image.length) {
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
            if (linkImage && Array.isArray(linkImage)) {
                for (let i = 0; i < linkImage.length; i++) {
                    let check = await raoNhanh.copyFolder(linkImage[i], 'avt_tindangmua')
                    if (!check) return functions.setError(res, 'upload file failed', 400)
                    let imgg = linkImage[i].split('/').reverse()[0]
                    img.push({ nameImg: imgg })
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
                img,
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
        return functions.setError(res, error.message);
    }
};
// chi tiết tin 
exports.getDetailNew = async (req, res, next) => {
    try {
        // số lượng comment
        let cm_page = Number(req.body.cm_page) || 1;
        let cm_limit = Number(req.body.cm_limit) || 5;
        let cm_start = (cm_page - 1) * cm_limit;

        //kiếm tra token
        let userIdRaoNhanh = await raoNhanh.checkTokenUser(req, res, next);

        // khai báo biến
        let linkTitle = req.body.linkTitle;     // khai báo linkTitle
        let sort = Number(req.body.sort) || 1;   // dùng để sắp xếp comment
        let searchItem = null;
        let tintuongtu = [];
        let ListComment = [];
        let ListLike = [];

        if (!linkTitle) {
            return functions.setError(res, "Vui lòng truyền lên linkTitle", 400);
        }

        // logic lấy id từ link title
        let linkTitlee = linkTitle.replace(".html", "")

        let id = linkTitlee.split("-").reverse()[0];

        let buy = id.match(/[a-zA-Z]+/g)[0];

        let id_new = Number(id.replace(buy, ''));

        // kiểm tra id tin là 1 số
        if (await functions.checkNumber(id_new) === false) return functions.setError(res, "invalid number", 404);

        // kiểm tra tồn tại tin
        let check = await New.findById(id_new, { cateID: 1, userID: 1 });

        if (!check) return functions.setError(res, "not found", 404);

        // lấy ra tên danh mục
        let danhmuc = await raoNhanh.getNameCate(check.cateID, 2)

        // lấy ra tên danh mục con
        let cate_Special = await raoNhanh.getNameCate(check.cateID, 1)
        cate_Special = await raoNhanh.checkNameCateRaoNhanh(cate_Special)

        // lấy các trường cần trả ra 
        if (buy === "ct") {
            searchItem = await raoNhanh.searchItem(1)
        } else if (buy === "c") {
            searchItem = await raoNhanh.searchItem(2)
        } else {
            return functions.setError(res, "not found data", 404);
        }

        // lấy các trường thuộc danh mục
        if (cate_Special) {
            searchItem[`${cate_Special}`] = 1;
        }

        // truy vấn DB
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
            { $project: searchItem },

        ]);

        // logic lấy dữ liệu đếm số lượng sao đánh giá
        let thongTinSao = await raoNhanh.getInfoEnvaluate(res, Evaluate, data[0].userID)

        // trả về link đầy đủ cho video
        if (data[0].video) {
            let nameCate = await raoNhanh.getNameCate(data[0].cateID, 1)
            let folder = await raoNhanh.checkFolderCateRaoNhanh(nameCate)
            data[0].video = process.env.DOMAIN_RAO_NHANH + `/pictures/${folder}/` + data[0].video
        }

        // tìm kiếm tin tương tự
        tintuongtu = await raoNhanh.tinTuongTu(res, New, check, id_new, userIdRaoNhanh, LoveNews);

        // lấy comment 
        ListComment = await raoNhanh.getComment(res, Comments, LikeRN, linkTitle, sort, cm_start, cm_limit);

        // lấy like 
        ListLike = await LikeRN.find({ forUrlNew: linkTitle, commentId: 0, type: { $lt: 8 } }, {}).sort({ type: 1, _id: -1 })

        // tăng viwe cho tin
        await New.findByIdAndUpdate(id_new, { $inc: { viewCount: +1 } });

        // hàm chuyển link ảnh và thông tin yêu thích
        for (let i = 0; i < data.length; i++) {
            data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell)
            if (userIdRaoNhanh) {
                let dataLoveNew = await LoveNews.findOne({ id_user: userIdRaoNhanh, id_new });
                if (dataLoveNew) data[0].islove = 1;
                else data[0].islove = 0;
                // xem mình đã thích tin này chưa
                var minhLike = ListLike.find((item) => item.userIdChat == userIdRaoNhanh)
                minhLike ? data[0].minhLike = 1 : data[0].minhLike = 0
                minhLike ? data[0].typelike = minhLike.type : data[0].typelike = 0
            } else {
                data[0].islove = 0;
                data[0].minhLike = 0
                data[0].typelike = 0
            }
        }

        // lấy tổng số lượng comment
        let soComment = await Comments.countDocuments({ url: linkTitle })

        data[0].ListComment = ListComment;
        data[0].ListLike = ListLike;
        data[0].tintuongtu = tintuongtu;
        data[0].danhmuc = danhmuc;
        data[0].thongTinSao = thongTinSao;
        data[0].solike = ListLike.length;
        data[0].soComment = soComment;
        data = data[0];

        // lấy data đấu thầu nếu là tin mua
        if (buy === "ct") {
            let Biddingg = await raoNhanh.getDataBidding(res, Bidding, id_new, Evaluate)
            return functions.success(res, "get data success", { data, Bidding: Biddingg });
        }

        // await raoNhanh.getDataNewDetail(data, 61)
        if (data.city) {
            let datacity = await City.findById({ _id: data.city }).lean();
            if (datacity) data.city = datacity.name
        }
        if (data.district) {
            let datadistric = await District.findById({ _id: data.district }).lean();
            if (datadistric) data.district = datadistric.name
        }
        if (data.ward) {
            let dataward = await Ward.findById({ _id: data.ward }).lean();
            if (dataward) data.ward = dataward.name
        }
        if (data.brand) {
            let databrand = await CateDetail.findOne({ 'brand.$._id': data.brand }).lean();
            if (databrand) data.brand = databrand.name
        }
        return functions.success(res, "get data success", { data });
    } catch (error) {
        console.error(error)
        return functions.setError(res, error.message);
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
        return functions.setError(res, error.message);
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
                buySell: 1,
                userID: 1,
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
                until: 1,
                userID: 1,
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
                    tin.img = await raoNhanh.getLinkFile(tin.userID, tin.img, tin.cateID, tin.buySell);
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
        return functions.setError(res, error.message);
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
            userID: 1,
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
                data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", { tong_soluong, tin_conhan, tin_hethan, tin_dangan, data });
    } catch (error) {
        return functions.setError(res, error.message);
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
            userID: 1,
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
                data[i].new.img = await raoNhanh.getLinkFile(data[i].userID, data[i].new.img, data[i].new.cateID, data[i].new.buySell);
            }
            let nguoidang = await Users.findOne({ idRaoNhanh365: data[i].new.userID },
                {
                    _id: 1, idRaoNhanh365: 1, phone: 1, isOnline: 1,
                    userName: 1, avatarUser: 1, type: 1,
                    chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1,
                    'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1
                },
            )
            if (data[i].user.avatarUser) data[i].user.avatarUser = await raoNhanh.getLinkAvatarUser(data[i].user.idRaoNhanh365, data[i].user.avatarUser)
            if (nguoidang.avatarUser) nguoidang.avatarUser = await raoNhanh.getLinkAvatarUser(nguoidang.idRaoNhanh365, nguoidang.avatarUser)

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
        return functions.setError(res, error.message);
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
        return functions.setError(res, error.message);
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
            buySell: 1,
            userID: 1,
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
                data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell);
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
        return functions.setError(res, error.message);
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
            buySell: 1,
            userID: 1,
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
                data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", {
            tong_soluong,
            tinDangTimUngVien,
            tinDaTimUngVien,
            data,
        });
    } catch (error) {
        return functions.setError(res, error.message);
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
            userID: 1,
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
                data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", {
            tong_soluong,
            tinDangTimViec,
            tinDaTimViec,
            data,
        });
    } catch (error) {
        return functions.setError(res, error.message);
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
            time: Date(),
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
            cateID: 1, userID: 1,
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
                data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell);
            }
        }
        return functions.success(res, "get data success", { data });
    } catch (err) {
        console.error(err);
        return functions.setError(res, err.message);
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
        }, { _id: 1, cateID: 1, title: 1, userID: 1, money: 1, endvalue: 1, until: 1, createTime: 1, buySell: 1, free: 1, img: 1, dia_chi: 1, address: 1, pinHome: 1, pinCate: 1, new_day_tin: 1, sold: 1, cateID: 1, updateTime: 1 });
        for (let i = 0; i < data.length; i++) {
            if (data[i].img) {
                data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell);
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
                let loai_khuyenmai = Number(request.loai_khuyenmai);
                let giatri_khuyenmai = Number(request.giatri_khuyenmai);
                let ngay_bat_dau = request.ngay_bat_dau;
                let ngay_ket_thuc = request.ngay_ket_thuc;
                let new_id = Number(request.new_id[i]);
                if (
                    loai_khuyenmai &&
                    ngay_bat_dau &&
                    ngay_ket_thuc &&
                    giatri_khuyenmai
                ) {
                    if (loai_khuyenmai == 1 || loai_khuyenmai == 2) {
                    } else {
                        return functions.setError(res, "Nhập số không hợp lệ", 400);
                    }
                    if (
                        functions.checkNumber(giatri_khuyenmai) === false || giatri_khuyenmai <= 0
                    ) {
                        return functions.setError(res, "invalid number", 400);
                    }

                    let checkNew = await New.findById(new_id);
                    if (checkNew && checkNew.length !== 0) {
                        await New.findByIdAndUpdate(new_id, {
                            timePromotionStart: new Date(ngay_bat_dau).getTime() / 1000,
                            timePromotionEnd: new Date(ngay_ket_thuc).getTime() / 1000,
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
        return functions.setError(res, error.message);
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
        return functions.setError(res, error.message);
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
        return functions.setError(res, error.message);
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
        return functions.setError(res, error.message)
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
        return functions.setError(res, error.message)
    }
}
// api lấy danh sách đấu thầu theo id
exports.getDataBidding = async (req, res, next) => {
    try {
        let id = Number(req.body.id);
        let type = Number(req.body.type) || 1;
        let data = await Bidding.aggregate([
            { $match: { newId: id } },
            { $sort: { price: type } },
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
                        idRaoNhanh365: 1
                    },
                    thongtinthau: '$new.bidding'
                }
            }
        ])
        for (let i = 0; i < data.length; i++) {
            if (data[i].nguoidauthau.avatarUser) {
                data[i].nguoidauthau.avatarUser = await raoNhanh.getLinkAvatarUser(data[i].nguoidauthau.idRaoNhanh365, data[i].nguoidauthau.avatarUser)
            }
            if (data[i].userFile) {
                data[i].userFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + data[i].userFile;
            }
            if (data[i].userProfileFile) {
                data[i].userProfileFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + data[i].userProfileFile;
            }
            if (data[i].promotionFile) {
                data[i].promotionFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + data[i].promotionFile;
            }
        }
        return functions.success(res, "get data success", { data });
    } catch (error) {
        console.error(error)
        return functions.setError(res, error.message);
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
            createTime: 1, until: 1, cateID: 1, endvalue: 1, userID: 1, free: 1, buySell: 1
        });
        if (data.img) {
            data.img = await raoNhanh.getLinkFile(data[i].userID, data.img, data.cateID, data.buySell)
        }
        let trangchu = await PriceList.find({ type: 1 }).limit(5)
        let trangdanhmuc = await PriceList.find({ type: 5 }).limit(5)

        return functions.success(res, 'get data success', { data, trangchu, trangdanhmuc })
    } catch (error) {
        return functions.setError(res, error.message)
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
            createTime: 1, until: 1, cateID: 1, endvalue: 1, userID: 1, free: 1, buySell: 1
        });
        if (data.img) {
            data.img = await raoNhanh.getLinkFile(data[i].userID, data.img, data.cateID, data.buySell)
        }
        let tien_daytin = await PriceList.find({ type: 2 }).limit(1)
        let thoigian = await PushNewsTime.find()

        return functions.success(res, 'get data success', { data, tien_daytin, thoigian })
    } catch (error) {
        return functions.setError(res, error.message)
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
        return functions.setError(res, error.message)
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
        return functions.setError(res, error.message)
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
        return functions.setError(res, error.message);
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
                data.img = await raoNhanh.getLinkFile(data.userID, data.img, data.cateID, data.buySell)
            }
            return functions.success(res, 'get data success', { data })
        } else {
            return functions.success(res, 'get data success', { data: [] })
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// lấy tin theo danh mục
exports.getNewForDiscount = async (req, res, next) => {
    try {
        let userID = req.user.data.idRaoNhanh365;
        let cateID = req.query.cateID;
        let data = await New.find({ cateID, userID, 'infoSell.promotionType': { $nin: [1, 2] } }, {
            electroniceDevice: 0, vehicle: 0, realEstate: 0, ship: 0, beautifull: 0, wareHouse: 0, pet: 0, Job: 0,
            noiThatNgoaiThat: 0, bidding: 0
        })
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].img) {
                    data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, 2)
                }
            }
        }
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error.message)
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
        let typeSold = Number(req.body.typeSold);
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let conditions = {};
        if (typeSold) {
            conditions = {
                'infoSell.promotionType': { $nin: [1, 2] }
            }
        }
        if (type) conditions['infoSell.promotionType'] = Number(type);
        if (ten) {
            conditions.title = new RegExp(ten, 'i')
        }

        conditions.userID = userID;
        conditions.buySell = 2;
        conditions.cateID = {
            $nin: [120, 121, 119, 11, 12, 26, 27, 29, 33, 34]
        }
        if (cateID) conditions.cateID = Number(cateID);

        let data = await New.find(conditions, {
            electroniceDevice: 0, vehicle: 0, realEstate: 0, ship: 0, beautifull: 0, wareHouse: 0, pet: 0, Job: 0,
            noiThatNgoaiThat: 0, bidding: 0
        }).skip(skip).limit(limit)
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].img) {
                    data[i].img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, 2)
                }
            }
        }
        let tongsoluong = New.countDocuments(conditions)
        let soluong = data.length
        return functions.success(res, 'get data success', { tongsoluong, soluong, data })
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
                let checkNew = await New.findById(Number(id[i]));
                if (checkNew) { 
                    await New.findByIdAndUpdate(Number(id[i]), {
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
        return functions.setError(res, error.message)
    }
}

// lấy kho ảnh
exports.getDataImage = async (req, res, next) => {
    try {
        let userId = req.user.data.idRaoNhanh365;
        let khoAnh = [];
        let data = await New.find({ userID: userId }, { img: 1, buySell: 1, cateID: 1, userID: 1 });
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].img) {
                    let img = await raoNhanh.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell)
                    for (let j = 0; j < img.length; j++) {
                        khoAnh.push(img[j].nameImg)
                    }
                }
            }
        }

        data = [];
        for (let i = 0; i < khoAnh.length; i++) {
            let img = khoAnh[i].split('/').reverse()[0];
            if (!data.find(item => item.split('/').reverse()[0] == img)) data.push(khoAnh[i]);
        }
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// báo cáo tin
exports.reportNew = async (req, res, next) => {
    try {
        let userId = req.user.data.idRaoNhanh365;
        let idnew = Number(req.body.id);
        let vande = Number(req.body.vande);
        let mota = req.body.mota;
        let time = new Date().getTime() / 1000;

        if (idnew && vande && mota) {
            let check = await New.findById(idnew);
            if (check) {
                let id = await functions.getMaxID(BaoCao) + 1 || 1;
                await BaoCao.create({
                    _id: id,
                    user_baocao: userId,
                    new_user: check.userID,
                    tgian_baocao: time,
                    van_de: vande,
                    mo_ta: mota,
                    new_baocao: idnew
                })
                return functions.success(res, 'Report success')
            }
            return functions.setError(res, 'Không tìm thấy tin', 404)
        }
        return functions.setError(res, 'Missing data', 400)
    } catch (error) {
        return functions.setError(res, error.messsage)
    }
}

// thông tin thả cảm xúc
exports.getDataLike = async (req, res, next) => {
    try {
        let url = req.body.url;
        let type = Number(req.body.type) || 1;
        if (url) {
            let dataa = await LikeRN.aggregate([
                { $match: { forUrlNew: url } },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'userIdChat',
                        foreignField: 'idRaoNhanh365',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $project: { type: 1, user: { userName: 1, avatarUser: 1, idRaoNhanh365: 1 } }
                }
            ])
            if (dataa.length !== 0) {
                for (let i = 0; i < dataa.length; i++) {
                    if (dataa[i].user.avatarUser) dataa[i].user.avatarUser = await raoNhanh.getLinkAvatarUser(dataa[i].user.idRaoNhanh365, dataa[i].user.avatarUser)
                }
                let data = dataa.filter(item => item.type === type)
                let soluong1 = dataa.filter(item => item.type === 1).length;
                let soluong2 = dataa.filter(item => item.type === 2).length;
                let soluong3 = dataa.filter(item => item.type === 3).length;
                let soluong4 = dataa.filter(item => item.type === 4).length;
                let soluong5 = dataa.filter(item => item.type === 5).length;
                let soluong6 = dataa.filter(item => item.type === 6).length;
                let soluong7 = dataa.filter(item => item.type === 7).length;

                let soluong = { soluong1, soluong2, soluong3, soluong4, soluong5, soluong6, soluong7 }
                return functions.success(res, 'get data success', { soluong, data })
            }
            return functions.success(res, 'get data success', { soluong: 0, data: [] })
        }
        return functions.setError(res, 'missing data input', 400)
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// đánh giá tài khoản
exports.envaluate = async (req, res, next) => {
    try {
        let userId = req.user.data.idRaoNhanh365;
        let us_bl = Number(req.body.us_bl);
        let so_sao = req.body.so_sao || 1;
        let noi_dung_dgia = req.body.noi_dung_dgia;
        let parentId = Number(req.body.parentId) || 0;
        let tgian_bluan = new Date();
        if (us_bl && noi_dung_dgia) {

            let check = await Evaluate.findOne({ userId, blUser: us_bl })
            if (check) {
                return functions.setError(res, 'Bạn đã đánh giá tài khoản này', 400)
            }
            let id = await functions.getMaxID(Evaluate) + 1 || 1;
            await Evaluate.create({
                _id: id,
                userId,
                blUser: us_bl,
                stars: so_sao,
                comment: noi_dung_dgia,
                time: tgian_bluan,
                active: 1,
                newId: 0,
                tgianHetcs: 0,
                csbl: 0,
                parentId
            })


            return functions.success(res, 'Đánh giá tài khoản thành công')
        }
        return functions.setError(res, 'missing data', 400)
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// update status ứng tuyển
exports.updateStatusAplly = async (req, res, next) => {
    try {
        let userId = req.user.data.idRaoNhanh365;
        let id = Number(req.body.id);
        let note = req.body.note;
        let status = Number(req.body.status);

        if (id) {
            let check = await ApplyNews.aggregate([
                { $match: { _id: id } },
                {
                    $lookup: {
                        from: 'RN365_News',
                        localField: 'newId',
                        foreignField: '_id',
                        as: 'new'
                    }
                },
                { $unwind: '$new' },
                { $match: { 'new.userID': userId } }
            ]);
            if (check.length !== 0) {

                if (note) {
                    await ApplyNews.findByIdAndUpdate(
                        id, {
                        note: note,
                        status: status
                    })
                }
                if (status && status !== 0) {
                    await ApplyNews.findByIdAndUpdate(
                        id, {
                        note: note,
                        status: status
                    })
                }
                return functions.success(res, 'update success')
            }
            return functions.setError(res, 'not found apply new', 404)
        }
        return functions.setError(res, 'missing data', 400)
    } catch (error) {
        return functions.setError(res, error);
    }
}

// get tags
exports.getTags = async (req, res, next) => {
    try {
        let data = await tags.find({});
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error);
    }
}

// danh mục việc làm
exports.getCateVL = async (req, res, next) => {
    try {
        let data = await CateVl.find({ active: 1 }).lean();
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error);
    }
}

// tags việc làm
exports.getTagsVL = async (req, res, next) => {
    try {
        let data = await Keywords.find({}).lean();
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error);
    }
}