const functions = require('../../services/functions');
const Category = require('../../models/Raonhanh365/Category');
const New = require('../../models/Raonhanh365/UserOnSite/New');
const CategoryRaoNhanh365 = require('../../models/Raonhanh365/Category');
const User = require('../../models/Users');
const LoveNews = require('../../models/Raonhanh365/UserOnSite/LoveNews');
const Bidding = require('../../models/Raonhanh365/Bidding');

// đăng tin
exports.postNewMain = async (req, res, next) => {
    try {
        let img = req.files.img;
        let video = req.files.video;
        let listImg = [];
        let nameVideo = '';
        let request = req.body,
            userID = request.user_id,
            cateID = request.cate_id,
            title = request.title,
            money = request.money,
            until = request.until,
            description = request.description,
            free = request.free,
            poster = request.poster,
            name = request.name,
            email = request.email,
            address = request.address,
            phone = request.phone,
            status = request.status,
            detailCategory = request.detailCategory,
            buySell = request.buySell,
            productType = request.productType,
            productGroup = request.productGroup,
            city = request.city,
            district = request.district,
            ward = request.ward,
            brand = request.brand;
        let fields = [userID, cateID, title, money, until, description, free, poster, name, email, address, phone, status, detailCategory];
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i])
                return functions.setError(res, 'Missing input value', 404)
        }
        const maxIDNews = await New.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIDNews;
        if (maxIDNews) {
            newIDNews = Number(maxIDNews._id) + 1;
        } else newIDNews = 1;
        if (money) {
            if (img && img.length >= 1 && img.length <= 10) {
                let isValid = true;
                for (let i = 0; i < img.length; i++) {
                    let checkImg = await functions.checkImage(img[i].path);
                    if (checkImg) {
                        // day mot object gom 2 truong(nameImg, size) vao listImg
                        listImg.push({ nameImg: img[i].originalFilename, size: img[i].size });
                    } else {
                        isValid = false;
                    }
                }
                if (isValid == false) {
                    await functions.deleteImgVideo(img, video)
                    return functions.setError(res, 'đã có ảnh sai định dạng hoặc lớn hơn 2MB', 405)
                }
            } else if (img && img.length > 10) {
                await functions.deleteImgVideo(img, video)
                return functions.setError(res, 'chỉ được đưa lên tối đa 10 ảnh', 406)
            } else {
                return functions.setError(res, 'Missing input image', 406)
            }

            if (video) {
                if (video.length == 1) {
                    let checkVideo = await functions.checkVideo(video[0]);
                    if (checkVideo) {
                        nameVideo = video[0].filename
                    } else {
                        video.forEach(async (element) => {
                            await functions.deleteImg(element)
                        })
                        return functions.setError(res, 'video không đúng định dạng hoặc lớn hơn 100MB ', 407)
                    }
                }
                else if (video.length > 1) {
                    await functions.deleteImgVideo(img, video)
                    return functions.setError(res, 'chỉ được đưa lên 1 video', 408)
                }
            }
            req.info = {
                _id: newIDNews,
                userID: userID,
                cateID: cateID,
                title: title,
                money: money,
                until: until,
                description: description,
                free: free,
                poster: poster,
                name: name,
                status: status,
                email: email,
                address: address,
                phone: phone,
                detailCategory: detailCategory,
                district: district,
                img: listImg,
                video: nameVideo,
                productGroup: productGroup,
                productType: productType,
                city: city,
                district: district,
                ward: ward,
                brand: brand,
                buySell: 2
            }
            return next()
        }
        return functions.setError(res, 'Thiếu dữ liệu ', 404)
    } catch (err) {
        console.log(err);
        return functions.setError(res, err);
    }
}

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
                typeHarđrive: request.typeHarđrive,
                screen: request.screen,
                size: request.size,
                brand: request.brand,
                machineSeries: request.machineSeries
            }

            //cac truong khi dang tin do xe co
            let fieldsVehicle = {
                brandMaterials: request.brandMaterials,
                vehicles: request.vehicles,
                spareParts: request.spareParts,
                interior: request.interior,
                device: request.device,
                color: request.color,
                capacity: request.capacity,
                connectInternet: request.connectInternet,
                generalType: request.generalType,
                wattage: request.wattage,
                resolution: request.resolution,
                engine: request.engine,
                accessary: request.accessary,
                frameMaterial: request.frameMaterial,
                volume: request.volume,
                manufacturingYear: request.manufacturingYear,
                fuel: request.fuel,
                numberOfSeats: request.numberOfSeats,
                gearBox: request.gearBox,
                style: request.style,
                payload: request.payload,
                carNumber: request.carNumber,
                km: request.km,
                origin: request.origin,
                version: request.version
            }

            // cac truong khi dang tin bat dong san
            let fieldsRealEstate = {
                statusSell: request.statusSell,
                nameApartment: request.nameApartment,
                numberOfStoreys: request.numberOfStoreys,
                storey: request.storey,
                mainDirection: request.mainDirection,
                balconyDirection: request.balconyDirection,
                legalDocuments: request.legalDocuments,
                statusInterior: request.statusInterior,
                acreage: request.acreage,
                length: request.length,
                width: request.width,
                buyingArea: request.buyingArea,
                numberToletRoom: request.numberToletRoom,
                numberBedRoom: request.numberBedRoom,
                typeOfApartment: request.typeOfApartment,
                special: request.special,
                statusBDS: request.statusBDS,
                codeApartment: request.codeApartment,
                cornerUnit: request.cornerUnit,
                nameArea: request.nameArea,
                useArea: request.useArea,
                landType: request.landType,
                officeType: request.officeType,
                block: request.block,
                htmchrt: request.htmchrt
            };
            // cac truong cua ship
            let fieldsShip = {
                product: request.product,
                timeStart: Date(request.timeStart),
                timeEnd: Date(request.timeEnd),
                allDay: request.allDay,
                vehicloType: request.vehicloType
            };
            //cac truong cua danh muc thu cung
            let fieldsPet = {
                age: req.body.age,
                gender: req.body.gender,
                weigth: req.body.weigth,
            };
            //cac truong cua danh muc cong viec
            let fieldsJob = {
                minAge: req.body.minAge,
                exp: req.body.exp,
                level: req.body.level,
                skill: req.body.skill,
                quantity: req.body.quantity,
                addressNumber: req.body.addressNumber,
                payBy: req.body.payBy,
                benefit: req.body.benefit,
                salary: req.body.salary,
                gender: req.body.gender,
                degree: req.body.degree,
            };

            //
            fields.electroniceDevice = fieldsElectroniceDevice;
            fields.vehicle = fieldsVehicle;
            fields.realEstate = fieldsRealEstate;
            fields.ship = fieldsShip;
            fields.pet = fieldsPet;
            fields.Job = fieldsJob;

            req.fields = fields;
            return next();

        }
        return functions.setError(res, "Category not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

exports.createNews = async (req, res, next) => {
    try {
        let fields = req.fields;
        fields.createTime = new Date(Date.now());
        const news = new New(fields);
        await news.save();
        return functions.success(res, "create news success");
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

//chinh sua tat ca cac loai tin
exports.updateNews = async (req, res, next) => {
    try {
        let idNews = Number(req.body.news_id);
        console.log(idNews);
        if (!idNews)
            return functions.setError(res, "Missing input news_id!", 405);
        let existsNews = await New.find({ _id: idNews });
        let fields = req.fields;
        fields.updateTime = new Date(Date.now());
        if (existsNews) {
            // xoa truong _id
            delete fields._id;
            await New.findByIdAndUpdate(idNews, fields);
            return functions.success(res, "News edited successfully");
        }
        return functions.setError(res, "News not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err);
    }
}

exports.searchSellNews = async (req, res, next) => {
    try {
        if (req.body) {
            let buySell = 2;
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
            let listCondition = { buySell: buySell };

            // dua dieu kien vao ob listCondition
            if (idNews) listCondition.idNews = idNews;
            if (title) listCondition.title = new RegExp(title, "i");
            if (description) listCondition.description = new RegExp(description);
            if (city) listCondition.city = Number(city);
            if (district) listCondition.district = Number(district);
            if (ward) listCondition.ward = Number(ward);

            let fieldsGet =
            {
                userID: 1, title: 1, linkTitle: 1, money: 1, endvalue: 1, downPayment: 1, until: 1, cateID: 1, type: 1, image: 1, video: 1, buySell: 1, createTime: 1, updateTime: 1, city: 1, district: 1
            }
            listNews = await functions.pageFindWithFields(New, listCondition, fieldsGet, { _id: 1 }, skip, limit);
            totalCount = await New.countDocuments(listCondition);
            return functions.success(res, "get buy news success", { data: { totalCount, listNews } });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (err) {
        console.log(err);
        return functions.setError(res, err);
    }
}

// đăng tin do dien tu
exports.postNewElectron = async (req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 1 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let request = req.body,
                microprocessor = request.microprocessor,
                ram = request.ram,
                hardDrive = request.hardDrive,
                typeHarđrive = request.typeHarđrive,
                screen = request.screen,
                size = request.size,
                brand = request.brand,
                machineSeries = request.machineSeries;
            let subFields = { microprocessor, ram, hardDrive, typeHarđrive, screen, size, brand, machineSeries };
            fields.createTime = new Date(Date.now());
            fields.electroniceDevice = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news electronic device success");
        }
        return functions.setError(res, "Category electronic device not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin
exports.postNewVehicle = async (req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 2 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        const exists = listID.includes(req.info.cateID);
        if (exists) {
            let request = req.body,
                brandMaterials = request.brandMaterials,
                vehicles = request.vehicles,
                spareParts = request.spareParts,
                interior = request.interior,
                device = request.device,
                color = request.color,
                capacity = request.capacity,
                connectInternet = request.connectInternet,
                generalType = request.generalType,
                wattage = request.wattage,
                resolution = request.resolution,
                engine = request.engine,
                accessary = request.accessary,
                frameMaterial = request.frameMaterial,
                volume = request.volume,
                manufacturingYear = request.manufacturingYear,
                fuel = request.fuel,
                numberOfSeats = request.numberOfSeats,
                gearBox = request.gearBox,
                style = request.style,
                payload = request.payload,
                carNumber = request.carNumber,
                km = request.km,
                origin = request.origin,
                version = request.version;
            let newRN = New({
                cateID: cateID,
                title: title,
                money: money,
                until: until,
                description: description,
                free: free,
                poster: poster,
                name: name,
                status: status,
                email: email,
                address: address,
                phone: phone,
                detailCategory: detailCategory,
                district: district,
                img: img,
                video: video
            })
        }
        return next();
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin
exports.postNewVehicle = async (req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 3 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        const exists = listID.includes(req.info.cateID);
        if (exists) {
            let request = req.body,
                statusSell = request.statusSell,
                nameApartment = request.nameApartment,
                numberOfStoreys = request.numberOfStoreys,
                storey = request.storey,
                mainDirection = request.mainDirection,
                balconyDirection = request.balconyDirection,
                legalDocuments = request.legalDocuments,
                statusInterior = request.statusInterior,
                acreage = request.acreage,
                length = request.length,
                width = request.width,
                buyingArea = request.buyingArea,
                kvCity = request.kvCity,
                kvDistrict = request.kvDistrict,
                kvWard = request.kvWard,
                numberToletRoom = request.numberToletRoom,
                numberBedRoom = request.numberBedRoom,
                typeOfApartment = request.typeOfApartment,
                special = request.special,
                statusBDS = request.statusBDS,
                codeApartment = request.codeApartment,
                cornerUnit = request.cornerUnit,
                nameArea = request.nameArea,
                useArea = request.useArea,
                officeType = request.officeType,
                block = request.block,
                htmchrt = request.htmchrt,
                landType = request.landType;
        }
        return next();
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// trang chủ trước đăng nhập
exports.getNewBeforeLogin = async (req, res, next) => {
    try {
        // item cần hiển thị
        let searchitem = {
            _id: 1, title: 1, address: 1, money: 1, updateTime: 1,
            img: 1, updateTime: 1, name: 1, address: 1, district: 1, ward: 1, city: 1
        }

        // tìm tin được ưu tiên đẩy lên đầu với trường pinHome
        let data = await New.find({ pinHome: 1, buySell: 2 }, searchitem).limit(50);

        // nếu dữ liệu ưu tiên ít hơn 50 thì thêm dữ liệu thường vào
        if (data.length < 50) {
            // lấy data với những tin có ngày cập nhật mới nhất
            let data_new = await New.find({ buySell: 2 }, searchitem).sort({ updateTime: -1 }).limit(50 - data.length);

            for (let i = 0; i < 50 - data.length; i++) {
                data.push(data_new[i]);
            }
        }
        return functions.success(res, "get data success", { data })

    } catch (error) {
        return functions.setError(res, error)
    }
}
// tìm kiếm tin 
exports.searchNew = async (req, res, next) => {
    try {
        let searchItem = { _id: 1, title: 1, cateID: 1, viewCount: 1, address: 1, money: 1, apartmentNumber: 1, updateTime: 1, linkTitle: 1, image: 1, img: 1, description: 1, createTime: 1, video: 1, name: 1, phone: 1, email: 1, address: 1, district: 1, ward: 1, quantitySold: 1, totalSold: 1 }
        // let pageSize = 10;
        // let { page, sort } = req.params;
        // sort = Number(sort);
        // page = Number(page);
        // let skip = (page - 1) * pageSize;
        // if (!functions.checkNumber(page) || !functions.checkNumber(sort)) {
        //     functions.setError(res, "invalid number", 404)
        // }
        let data = [];
        let totalCount = 0;
        let search_query = req.query.search_query || null;
        let danh_muc = req.query.cateID || null;
        let danh_muc1 = null;
        let danh_muc2 = null;
        let danh_muc3 = null;
        let nhom = null;
        let danh_muc_cuoi = null
        if (search_query && !danh_muc) {
            let query_danhmuc = await CategoryRaoNhanh365.find({ name: search_query }, searchItem)
            if (query_danhmuc.length !== 0) {
                data = await New.find({ cateID: query_danhmuc[0]._id })
            } else {
                let query = functions.createLinkTilte(search_query);
                data = await New.find({ linkTitle: { $regex: `.*${query}.*` } })
            }
        } else {
            danh_muc1 = await CategoryRaoNhanh365.findById(danh_muc);
            if (danh_muc1.parentId !== 0) {
                danh_muc2 = await CategoryRaoNhanh365.findById(danh_muc1.parentId);
                if (danh_muc2.parentId !== 0) {
                    danh_muc3 = await CategoryRaoNhanh365.findById(danh_muc2.parentId);
                }
            }
            if (danh_muc3) {
                danh_muc_cuoi = await functions.checkNameCateRaoNhanh(danh_muc3);
            } else {
                if (danh_muc2) {
                    danh_muc_cuoi = await functions.checkNameCateRaoNhanh(danh_muc2);
                } else {
                    danh_muc_cuoi = await functions.checkNameCateRaoNhanh(danh_muc1);
                }
            }
            data = await New.find({ danh_muc_cuoi: req.params })

        }




        return functions.success(res, "get data success", { data })
    } catch (error) {
        return functions.setError(res, "get data failed")
    }
}
// tạo tin mua 
exports.createBuyNew = async (req, res) => {
    try {
        // lấy id user từ req
        let userID = req.user.data._id;

        // khởi tạo các biến có thể có
        let tenderFile = null;

        let fileContentProcedureApply = null;

        let contentOnline = null;

        let instructionFile = null;

        let cityProcedure = req.body.cityProcedure || null;

        let districtProcedure = req.body.districtProcedure || null;

        let wardProcedure = req.body.wardProcedure || null;

        // khai báo và gán giá trị các biến bắt buộc 
        let { cateID, title, name, city, district, ward, apartmentNumber, description, timeEndReceivebidding, timeReceivebidding, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, until_tu, until_den, until_bidFee, phone, email } = req.body;
        //  tạo mảng img
        let img = [];

        //  lấy giá trị id lớn nhất rồi cộng thêm 1 tạo ra id mới
        let _id = await functions.getMaxID(New) + 1;

        // lấy thời gian hiện tại
        let createTime = new Date(Date.now());

        // khai báo đây là tin mua với giá trị là 1
        let buySell = 1;

        let File = req.files;

        let type = 0;
        // kiểm tra các điều kiện bắt buộc 
        if (cateID && title && name && city && district && ward
            && apartmentNumber && description && timeReceivebidding
            && timeEndReceivebidding && status && timeNotiBiddingStart
            && timeNotiBiddingEnd && instructionContent && bidFee &&
            startvalue && endvalue && phone && email && until_tu && until_den && until_bidFee) {

            // tạolink title từ title người dùng nhập
            let linkTitle = functions.createLinkTilte(title);

            //kiểm tra title đã được người dùng tạo chưa
            let checktitle = await New.find({ userID, linkTitle });
            if (checktitle && checktitle.length !== 0) {
                return functions.setError(res, 'The title already has a previous new word or does not have a keyword that is not allowed', 400)
            } else
                // kiểm tra tiền nhập vào có phải số không
                if (isNaN(bidFee) === true || isNaN(startvalue) === true || isNaN(endvalue) === true) {
                    return functions.setError(res, 'The input price is not a number', 400);
                }
                // kiểm tra số điện thoại
                else if (await functions.checkPhoneNumber(phone) === false) {
                    return functions.setError(res, 'Invalid phone number', 400);
                }
                // kiểm tra email
                else if (await functions.checkEmail(email) === false) {
                    return functions.setError(res, 'Invalid email', 400);
                }

            if (functions.checkDate(timeReceivebidding) === true && functions.checkDate(timeEndReceivebidding) === true && functions.checkDate(timeNotiBiddingStart) === true && functions.checkDate(timeNotiBiddingEnd) === true) {
                //  kiểm tra thời gian có nhỏ hơn thời gian hiện tại không
                if (await functions.checkTime(timeReceivebidding) && await functions.checkTime(timeEndReceivebidding) && await functions.checkTime(timeNotiBiddingStart) && await functions.checkTime(timeNotiBiddingEnd)) {
                    //  kiểm tra thời gian nộp hồ sơ và thời gian thông báo có hợp lệ không
                    let date1 = new Date(timeReceivebidding);
                    let date2 = new Date(timeEndReceivebidding);
                    let date3 = new Date(timeNotiBiddingStart);
                    let date4 = new Date(timeNotiBiddingEnd);
                    if (date1 > date2 || date3 > date4 || date3 < date2) {
                        return functions.setError(res, 'Nhập ngày không hợp lệ', 400)
                    }
                } else {
                    return functions.setError(res, 'Ngày nhập vào nhỏ hơn ngày hiện tại', 400)
                }
            }
            else {
                return functions.setError(res, 'Invalid date format', 400)
            }

            if (File.Image) {
                if (File.Image.length) {
                    if (File.Image.length > 10) return functions.setError(res, 'Gửi quá nhiều ảnh', 400);
                    for (let i = 0; i < File.Image.length; i++) {
                        functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.Image[i], ['.jpg', '.png']);
                        img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image[i].name) });
                    }
                } else {
                    functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.Image, ['.jpg', '.png']);
                    img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image.name) });
                }
            }
            if (File.tenderFile) {
                if (File.tenderFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.tenderFile, ['.jpg', '.png', '.docx', '.pdf']);
                tenderFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.tenderFile.name)
            }
            if (File.instructionFile) {
                if (File.instructionFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.instructionFile, ['.jpg', '.png', '.docx', '.pdf']);
                instructionFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.instructionFile.name)
            }
            if (File.fileContentProcedureApply) {
                if (File.fileContentProcedureApply.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.fileContentProcedureApply, ['.jpg', '.png', '.docx', '.pdf']);
                fileContentProcedureApply = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.fileContentProcedureApply.name)
            }
            //lưu dữ liệu vào DB
            const postNew = new New({ _id, cateID, title, type, linkTitle, userID, buySell, createTime, img, tenderFile, fileContentProcedureApply, contentOnline, instructionFile, cityProcedure, districtProcedure, wardProcedure, name, city, district, ward, apartmentNumber, description, timeReceivebidding, timeEndReceivebidding, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, phone, email, until_tu, until_den, until_bidFee });
            await postNew.save();
            // await New.deleteMany({userID:5})
        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, "post new success")
    } catch (error) {
        return functions.setError(res, error)
    }
}

// sửa tin mua
exports.updateBuyNew = async (req, res, next) => {
    try {
        // lấy id user từ req
        let userID = req.user.data._id;
        // khởi tạo các biến có thể có
        let tenderFile = null;

        let fileContentProcedureApply = null;

        let contentOnline = null;

        let instructionFile = null;

        let cityProcedure = req.body.cityProcedure || null;

        let districtProcedure = req.body.districtProcedure || null;

        let wardProcedure = req.body.wardProcedure || null;

        // khai báo và gán giá trị các biến bắt buộc 
        let { id, title, name, city, district, ward, apartmentNumber, description, timeEndReceivebidding, timeReceivebidding, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, until_tu, until_den, until_bidFee, phone, email } = req.body;
        //  tạo mảng img
        let img = [];


        // lấy thời gian hiện tại
        let updateTime = new Date(Date.now());

        let File = req.files;

        // kiểm tra các điều kiện bắt buộc 
        if (title && name && city && district && ward
            && apartmentNumber && description && timeReceivebidding
            && timeEndReceivebidding && status && timeNotiBiddingStart
            && timeNotiBiddingEnd && instructionContent && bidFee &&
            startvalue && endvalue && phone && email && until_tu && until_den && until_bidFee) {

            // tạolink title từ title người dùng nhập
            let linkTitle = functions.createLinkTilte(title);

            // kiểm tra title đã được người dùng tạo chưa
            let checktitle = await New.find({ userID, linkTitle });
            if (checktitle && checktitle.length > 1) {
                return functions.setError(res, 'The title already has a previous new word or does not have a keyword that is not allowed', 404)
            } else
                // kiểm tra tiền nhập vào có phải số không
                if (isNaN(bidFee) === true || isNaN(startvalue) === true || isNaN(endvalue) === true) {
                    return functions.setError(res, 'The input price is not a number', 400);
                }
                // kiểm tra số điện thoại
                else if (await functions.checkPhoneNumber(phone) === false) {
                    return functions.setError(res, 'Invalid phone number', 400);
                }
                // kiểm tra email
                else if (await functions.checkEmail(email) === false) {
                    return functions.setError(res, 'Invalid email', 400);
                }

            if (functions.checkDate(timeReceivebidding) === true && functions.checkDate(timeEndReceivebidding) === true && functions.checkDate(timeNotiBiddingStart) === true && functions.checkDate(timeNotiBiddingEnd) === true) {
                //  kiểm tra thời gian có nhỏ hơn thời gian hiện tại không
                if (await functions.checkTime(timeReceivebidding) && await functions.checkTime(timeEndReceivebidding) && await functions.checkTime(timeNotiBiddingStart) && await functions.checkTime(timeNotiBiddingEnd)) {
                    //  kiểm tra thời gian nộp hồ sơ và thời gian thông báo có hợp lệ không
                    let date1 = new Date(timeReceivebidding);
                    let date2 = new Date(timeEndReceivebidding);
                    let date3 = new Date(timeNotiBiddingStart);
                    let date4 = new Date(timeNotiBiddingEnd);
                    if (date1 > date2 || date3 > date4 || date3 < date2) {
                        return functions.setError(res, 'Nhập ngày không hợp lệ', 400)
                    }
                } else {
                    return functions.setError(res, 'Ngày nhập vào nhỏ hơn ngày hiện tại', 400)
                }
            }
            else {
                return functions.setError(res, 'Invalid date format', 400)
            }
            let updateItem = { title, contentOnline, linkTitle, updateTime, cityProcedure, districtProcedure, wardProcedure, name, city, district, ward, apartmentNumber, description, timeReceivebidding, timeEndReceivebidding, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, phone, email, until_tu, until_den, until_bidFee }

            // xoá file
            let files_old = await New.findById(id, { img: 1, tenderFile: 1, instructionFile: 1, fileContentProcedureApply: 1 })

            if (File.Image) {
                if (File.Image.length) {
                    if (File.Image.length > 10) return functions.setError(res, 'Gửi quá nhiều ảnh');
                    for (let i = 0; i < File.Image.length; i++) {
                        functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.Image[i], ['.jpg', '.png']);
                        img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image[i].name) });
                    }
                } else {
                    functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.Image, ['.jpg', '.png']);
                    img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image.name) });
                }
                if (files_old.img) {
                    for (let i = 0; i < files_old.img.length; i++) {
                        let text = files_old.img[i].nameImg.split('/').reverse()[0];
                        functions.deleteFileRaoNhanh(userID, text)
                    }
                }
                updateItem.img = img;
            }
            if (File.tenderFile) {
                if (File.tenderFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.tenderFile, ['.jpg', '.png', '.docx', '.pdf']);
                tenderFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.tenderFile.name)
                if (files_old.tenderFile) {

                    let text = files_old.tenderFile.split('/').reverse()[0]
                    functions.deleteFileRaoNhanh(userID, text)
                }
                updateItem.tenderFile = tenderFile;
            }
            if (File.instructionFile) {
                if (File.instructionFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.instructionFile, ['.jpg', '.png', '.docx', '.pdf']);
                instructionFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.instructionFile.name)
                if (files_old.fileContentProcedureApply) {

                    let text = files_old.fileContentProcedureApply.split('/').reverse()[0]
                    functions.deleteFileRaoNhanh(userID, text)
                }
                updateItem.instructionFile = instructionFile;
            }
            if (File.fileContentProcedureApply) {
                if (File.fileContentProcedureApply.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh('avt_tindangmua', userID, File.fileContentProcedureApply, ['.jpg', '.png', '.docx', '.pdf']);
                fileContentProcedureApply = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.fileContentProcedureApply.name)
                if (files_old.instructionFile) {

                    let text = files_old.instructionFile.split('/').reverse()[0]
                    functions.deleteFileRaoNhanh(userID, text)
                }
                updateItem.fileContentProcedureApply = fileContentProcedureApply;
            }
            await New.findByIdAndUpdate(id, updateItem);

        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, "update new success")
    } catch (error) {
        console.log("🚀 ~ file: new.js:825 ~ exports.updateBuyNew= ~ error:", error)
        return functions.setError(res, error)
    }
}

// toàn bộ danh sách tin
exports.getAllNew = async (req, res, next) => {
    try {
        let searchitem = { _id: 1, title: 1, viewCount: 1, apartmentNumber: 1, money: 1, address: 1, updateTime: 1, linkTitle: 1, image: 1, img: 1, description: 1, createTime: 1, video: 1, name: 1, phone: 1, email: 1, address: 1, district: 1, ward: 1, quantitySold: 1, totalSold: 1 }
        let pageSize = 10;
        let { page, sort } = req.params;
        if (!functions.checkNumber(page) || !functions.checkNumber(sort)) {
            functions.setError(res, "invalid number", 404)
        }
        sort = Number(sort);
        page = Number(page);
        let skip = (page - 1) * pageSize;
        let data = [];
        let totalCount = 0;
        if (sort === 1) {
            data = await New.find({ buySell: 2 }, searchitem).sort({ viewCount: -1 }).skip(skip).limit(pageSize);
            totalCount = await New.countDocuments({ buySell: 2 });
            totalPages = Math.ceil(totalCount / pageSize)
        }
        else if (sort === 2) {
            data = await New.find({ buySell: 2 }, searchitem).sort({ createTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 2 });
            totalPages = Math.ceil(totalCount / pageSize)
        } else if (sort === 3) {
            data = await New.find({ type: 0, buySell: 2 }, searchitem).sort({ createTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 2, type: 0 });
            totalPages = Math.ceil(totalCount / pageSize)
        } else if (sort === 4) {
            data = await New.find({ type: 1, buySell: 2 }, searchitem).sort({ createTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 2, type: 1 });
            totalPages = Math.ceil(totalCount / pageSize)
        }

        return functions.success(res, 'get data success ', { totalCount, totalPages, data })

    } catch (error) {
        return functions.setError(res, error)
    }
}

// chi tiết tin trước đăng nhập    
exports.getDetailNew = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        if (!linkTitle) {
            return functions.setError(res, 'missing data', 400)
        }
        let id = linkTitle.split('-').reverse()[0];
        let buy = id.charAt(0);
        let id_new = id.slice(1);
        let danh_muc1 = null;
        let danh_muc2 = null;
        let danh_muc3 = null;
        let cate_Special = null;
        let buysell = null;
        let searchitem = null;
        let tintuongtu = [];
        if (await functions.checkNumber(id_new) === false) {
            return functions.setError(res, 'invalid number', 404)
        }
        let check = await New.findById(id_new, { cateID: 1, userID: 1 });
        cate1 = await CategoryRaoNhanh365.findById(check.cateID);
        danh_muc1 = cate1.name;

        if (cate1.parentId !== 0) {
            cate2 = await CategoryRaoNhanh365.findById(cate1.parentId);
            danh_muc2 = cate2.name;
            if (cate2.parentId !== 0) {
                cate3 = await CategoryRaoNhanh365.findById(cate2.parentId);
                danh_muc3 = cate3.name;
            }
        }
        if (danh_muc3) {
            cate_Special = await functions.checkNameCateRaoNhanh(danh_muc3);
        } else {
            if (danh_muc2) {
                cate_Special = await functions.checkNameCateRaoNhanh(danh_muc2);
            } else {
                cate_Special = await functions.checkNameCateRaoNhanh(danh_muc1);
            }
        }

        if (buy === 'm') {
            buysell = 1;
            searchitem = {
                title: 1, money: 1, name: 1, timeEndReceivebidding: 1, timeReceivebidding: 1,
                timeNotiBiddingStart: 1, timeNotiBiddingEnd: 1, tenderFile: 1,
                fileContentProcedureApply: 1, fileContent: 1, contentOnline: 1,
                fileContent: 1, instructionContent: 1, instructionFile: 1,
                startvalue: 1, endvalue: 1, until_tu: 1, until_den: 1, bidFee: 1, until_bidFee: 1, phone: 1, img: 1,
                address: 1, updateTime: 1, status: 1, description: 1, city: 1, district: 1, ward: 1, apartmentNumber: 1,
                detailCategory: 1, user: { userName: 1, type: 1, createdAt: 1 }
            };
        } else if (buy === 'b') {
            buysell = 2;
            searchitem = { title: 1, money: 1, name: 1, phone: 1, address: 1, updateTime: 1, img: 1, status: 1, description: 1, detailCategory: 1, user: { userName: 1, type: 1, createdAt: 1 } };

        } else {
            return functions.setError(res, 'not found data', 404)
        }
        if (cate_Special) {
            searchitem[`${cate_Special}`] = 1;
        }
        let data = await New.aggregate([
            {
                $lookup:
                {
                    from: "Users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "user"
                }
            }, {
                $project: searchitem
            }, {
                $match: { _id: id_new }
            }
        ]);
        tintuongtu = await New.find({ cateID: check.cateID }, searchitem).limit(6)
        if (tintuongtu) {
            for (let i = 0; i < tintuongtu.length; i++) {
                data.push({ tintuongtu: tintuongtu[i] })
            }
        }
        functions.success(res, 'get data success', { danh_muc1, danh_muc2, danh_muc3, data })
    } catch (error) {
        functions.setError(res, error)
    }
}

// yêu thích tin 
exports.loveNew = async (req, res, next) => {
    try {
        let id = req.body.id;
        let user = req.user.data;
        user._id = 19;
        let checkLove = await LoveNews.find({ id_new: id, id_user: user._id });
        if (checkLove.length !== 0) {
            await LoveNews.findOneAndDelete({ id_new: id, id_user: user._id })
        } else {
            createdAt = new Date(Date.now());
            let _id = await functions.getMaxID(LoveNews) + 1;
            await LoveNews.create({ _id, id_new: id, id_user: user._id, createdAt })
        }
        return functions.success(res, "love new success")
    } catch (error) {
        return functions.setError(res, error)
    }
}

// chỉnh sửa thông tin tài khoản
exports.updateInfoUserRaoNhanh = async (req, res, next) => {
    try {
        let _id = req.user.data._id;

        let { userName, email, address } = req.body;
        let File = req.files || null;
        let avatarUser = null;
        let updatedAt = new Date(Date.now());

        if (await functions.checkEmail(email) === false) {
            return functions.setError(res, 'invalid email')
        } else {
            let check_email = await User.findById(_id);
            if (check_email.email !== email) {
                let check_email_lan2 = await User.find({ email });
                if (check_email_lan2.length !== 0) {
                    return functions.setError(res, "email is exits")
                }
            }
        }
        if (File) {
            let upload = functions.uploadFileRaoNhanh('avt_dangtin', _id, File.avatarUser, ['.jpeg', '.jpg', '.png']);
            if (!upload) {
                return functions.setError(res, 'Định dạng ảnh không hợp lệ')
            }
            avatarUser = functions.createLinkFileRaonhanh('avt_dangtin', _id, File.avatarUser.name)
            await User.findByIdAndUpdate(_id, { email, address, userName, avatarUser, updatedAt });
        }
        await User.findByIdAndUpdate(_id, { email, address, userName, updatedAt });
        return functions.success(res, 'update data user success')
    } catch (error) {
        return functions.setError(res, error)
    }
}
// tao token
exports.createToken = async (req, res, next) => {
    try {
        let id = 5;
        let data = await User.findById(id);
        let token = await functions.createToken(data, '10d');
        let data1 = 'Bear ' + token;
        return functions.success(res, { data1 })
    } catch (error) {
        console.log(error)
    }
}

// danh sách yêu thích tin
exports.newfavorite = async (req, res, next) => {
    try {
        let userID = req.user.data._id;
        let linkTitle = req.params.linkTitle;
        let searchItem = null;
        let buySell = null;
        if (linkTitle === 'tin-mua-da-yeu-thich.html') {
            buySell = 1;
            searchItem = {
                title: 1, money: 1, name: 1, startvalue: 1, until_tu: 1,
                address: 1, updateTime: 1, city: 1, district: 1, ward: 1, img: 1, apartmentNumber: 1
            }
        } else if (linkTitle === 'tin-ban-da-yeu-thich.html') {
            buySell = 2;
            searchItem = { title: 1, money: 1, name: 1, img: 1, address: 1, updateTime: 1, city: 1, district: 1, ward: 1, apartmentNumber: 1 }
        }
        if (!buySell) {
            return functions.setError(res, 'invalid data', 400)
        }
        let data = [];
        let check = await LoveNews.find({ id_user: userID })
        if (check && check.length) {
            for (let i = 0; i < check.length; i++) {
                let datanew = await New.find({ _id: check[i].id_new }, searchItem)
                data.push(datanew[0])
            }
        }
        return functions.success(res, 'get data success', { data })
    } catch (error) {

        return functions.setError(res, error)
    }
}

// quản lí tin mua
exports.managenewbuy = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let userID = req.user.data._id;
        let data = [];
        let tin_conhan = await New.find({ userID, timeEndReceivebidding: { $gte: new Date(Date.now()) }, buySell: 1 }).count();
        let tin_dangan = await New.find({ userID, active: 0, buySell: 1 }).count();
        let tong_soluong = await New.find({ userID, buySell: 1 }).count();
        let tin_hethan = tong_soluong - tin_conhan;
        let searchItem = { title: 1, timeEndReceivebidding: 1, city: 1, district: 1, ward: 1, apartmentNumber: 1, endvalue: 1, until_den: 1 }
        if (linkTitle === 'quan-ly-tin-mua.html') {
            data = await New.find({ userID, buySell: 1 }, searchItem)
        } else if (linkTitle === 'tin-con-han.html') {
            data = await New.find({ userID, buySell: 1, timeEndReceivebidding: { $gte: new Date(Date.now()) } }, searchItem)
        } else if (linkTitle === 'tin-het-han.html') {
            data = await New.find({ userID, buySell: 1, timeEndReceivebidding: { $lte: new Date(Date.now()) } }, searchItem)
        } else if (linkTitle === 'tin-dang-an.html') {
            data = await New.find({ userID, buySell: 1, active: 0 }, searchItem)
        } else {
            return functions.setError(res, 'page not found ', 404)
        }
        return functions.success(res, 'get data success', { tong_soluong, tin_conhan, tin_hethan, tin_dangan, data })
    }
    catch (error) {
        return functions.setError(res, error)
    }
}

// tin đang dự thầu
exports.newisbidding = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let userID = req.user.data._id;
        let sl_tatCaTin = await Bidding.find({ userID }).count()
        let sl_tinConHan = 0;
        let searchItem = { title: 1, timeEndReceivebidding: 1, city: 1, district: 1, ward: 1, apartmentNumber: 1, endvalue: 1, until_den: 1,Bidding:{status:1} }
        let tinConHan = await New.aggregate([
            {
                $lookup: {
                    from: 'Bidding',
                    localField: '_id',
                    foreignField: 'newId',
                    as: 'Bidding'
                }
            },
            {
                $match: {
                    'Bidding.userID': userID, timeEndReceivebidding: { $gte: new Date(Date.now()) }
                }
            }, {
                $count: 'all'
            }
        ]);
        if (tinConHan.length) {
            sl_tinConHan = tinConHan[0].all
        }
        let sl_tinHetHan = sl_tatCaTin - sl_tinConHan;
        if (linkTitle === 'quan-ly-tin-dang-du-thau.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: 'Bidding',
                        localField: '_id',
                        foreignField: 'newId',
                        as: 'Bidding'
                    }
                }, {
                    $match: { 'Bidding.userID': userID }
                },
                {
                    $project: searchItem
                }
            ]);
        } else if (linkTitle === 'tin-dang-du-thau-con-han.html') {
            data = await New.New.aggregate([
                {
                    $lookup: {
                        from: 'Bidding',
                        localField: '_id',
                        foreignField: 'newId',
                        as: 'Bidding'
                    }
                }, 
                {
                    $match: { 'Bidding.userID': userID, timeEndReceivebidding: { $gte: new Date(Date.now()) } }
                },
                {
                    $project: searchItem
                }
            ]);
        } else if (linkTitle === 'tin-dang-du-thau-het-han.html') {
            data = await New.New.aggregate([
                {
                    $lookup: {
                        from: 'Bidding',
                        localField: '_id',
                        foreignField: 'newId',
                        as: 'Bidding'
                    }
                }, {
                    $match: {'Bidding.userID': userID, timeEndReceivebidding: { $lte: new Date(Date.now()) } }
                },
                {
                    $project: searchItem
                }
            ]);
        } else {
            return functions.setError(res, 'page not found ', 404)
        }
        return functions.success(res, 'get data success', { sl_tatCaTin, sl_tinConHan, sl_tinHetHan, data })
    } catch (error) {
        console.log("🚀 ~ file: new.js:1173 ~ exports.newisbidding= ~ error:", error)
        return functions.setError(res, error)
    }
}

// danh sách danh mục/ tỉnh thành
exports.listCate = async (req, res, next) => {
    try {
        let link = req.params.link;     
        let data =[];
        if(link === 'cate'){
            data = await CategoryRaoNhanh365.find({parentId:0},{name:1})
        }else if(link === 'city'){
            data = await city.find();
        }else{
            return functions.setError(res, 'page not found')
        }
        return functions.success(res, 'get data success', {data})
    } catch (error) {
        return functions.setError(res, error)
    }
}

 