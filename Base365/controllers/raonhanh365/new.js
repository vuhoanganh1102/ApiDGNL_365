const functions = require('../../services/functions');
const Category = require('../../models/Raonhanh365/Category');
const New = require('../../models/Raonhanh365/UserOnSite/New')
const CategoryRaoNhanh365 = require('../../models/Raonhanh365/Category');
const User = require('../../models/Users');
const LoveNews = require('../../models/Raonhanh365/UserOnSite/LoveNews');
const Bidding = require('../../models/Raonhanh365/Bidding');
const raoNhanh = require('../../services/rao nhanh/raoNhanh')
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
            let fields = [userID, cateID, title, money, until, description, free, poster, name, email, address, phone, status, detailCategory, img];
            for (let i = 0; i < fields.length; i++) {
                if (!fields[i])
                    return functions.setError(res, 'Missing input value', 404);
            }
            const maxIDNews = await New.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
            let newIDNews;
            if (maxIDNews) {
                newIDNews = Number(maxIDNews._id) + 1;
            } else newIDNews = 1;
            if (img) {
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
                }
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
                buySell: 2,// tin ban
                active: 1// hien thi tin
            }
            return next()
        }
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

            let cv = req.files.cv;
            let nameFileCV = "";
            if (cv) {
                if (await functions.checkFileCV(cv.path)) {
                    nameFileCV = cv.originalFilename;
                } else {
                    return functions.setError(res, "Vui lòng chọn file có định đạng: PDF", 506);
                }
            }
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
                cv: nameFileCV
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

exports.hideNews = async (req, res, next) => {
    try {
        let idNews = Number(req.body.news_id);
        if (!idNews)
            return functions.setError(res, "Missing input news_id!", 405);
        let existsNews = await New.find({_id: idNews});
        if (existsNews ) {
            let active = 0;
            if(existsNews.active==0){
                active = 1;
            }
            await New.findByIdAndUpdate(idNews, {active: active, updateTime: new Date(Date.now())});

            return functions.success(res, "Hide news successfully");
        }
        return functions.setError(res, "News not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err);
    }
}


exports.pinNews = async(req, res, next) => {
    try{
        let idNews = Number(req.body.news_id);
        if(!idNews)
            return functions.setError(res, "Missing input news_id!", 405);
        let {timeStartPinning, dayStartPinning, numberDayPinning, moneyPinning, pinHome, pinCate} = req.body;
        let existsNews = await New.find({_id: idNews});
        if (existsNews ) {
            let now = new Date(Date.now());
            if(!timeStartPinning) timeStartPinning = now;
            if(!dayStartPinning) dayStartPinning = now;
            let fields = {
                timeStartPinning: timeStartPinning,
                dayStartPinning: dayStartPinning,
                numberDayPinning: numberDayPinning,
                moneyPinning: moneyPinning,
                pinHome: pinHome,
                pinCate: pinCate,
                updateTime: now
            }
            await New.findByIdAndUpdate(idNews, fields);
            return functions.success(res, "Pin news successfully");
        }
        return functions.setError(res, "News not found!", 505);
    }catch(err){
        console.log(err);
        return functions.setError(res, err);
    }
}


exports.pushNews = async(req, res, next) => {
    try{
        let idNews = Number(req.body.news_id);
        if(!idNews)
            return functions.setError(res, "Missing input news_id!", 405);
        let {dayStartPinning, timeStartPinning, numberDayPinning, moneyPinning, timePinning, pinHome} = req.body;
        let existsNews = await New.find({_id: idNews});
        if (existsNews ) {
            let now = new Date(Date.now());
            if(!timeStartPinning) timeStartPinning = now;
            if(!dayStartPinning) dayStartPinning = now;
            let fields = {
                timePinning: timePinning,
                moneyPinning: moneyPinning,
                numberDayPinning: numberDayPinning,
                timeStartPinning: timeStartPinning,
                dayStartPinning: dayStartPinning,
                pinHome: pinHome,
                updateTime: now
            }
            await New.findByIdAndUpdate(idNews, fields);
            return functions.success(res, "Push news successfully");
        }
        return functions.setError(res, "News not found!", 505);
    }catch(err){
        console.log(err);
        return functions.setError(res, err);
    }
}

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


exports.deleteNews = async (req, res) => {
    try {
        let idNews = req.query.idNews;
        let buySell = 2;
        if (idNews) {
            let news = await functions.getDataDeleteOne(New, { _id: idNews, buySell: buySell });
            if (news.deletedCount === 1) {
                return functions.success(res, "Delete sell news by id success");
            } else {
                return functions.success(res, "Buy news not found");
            }
        } else {
            if (!await functions.getMaxID(New)) {
                functions.setError(res, "No news existed", 513);
            } else {
                New.deleteMany({ buySell: buySell })
                    .then(() => functions.success(res, "Delete all news successfully"))
                    .catch(err => functions.setError(res, err.message, 514));
            }
        }
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
};

// trang chủ trước đăng nhập
exports.getNewBeforeLogin = async (req, res, next) => {
    try {
        // item cần hiển thị
        let searchitem = {
            _id: 1, title: 1, address: 1, money: 1, updateTime: 1,
            img: 1, updateTime: 1, name: 1, address: 1, district: 1, ward: 1, city: 1
        }

        // tìm tin được ưu tiên đẩy lên đầu với trường pinHome
        let data = await New.find({ pinHome: 1, buySell: 2, active:1 }, searchitem).limit(50);

        // nếu dữ liệu ưu tiên ít hơn 50 thì thêm dữ liệu thường vào
        if (data.length < 50) {
            // lấy data với những tin có ngày cập nhật mới nhất
            let data_new = await New.find({ buySell: 2, active:1 }, searchitem).sort({ updateTime: -1 }).limit(50 - data.length);
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
        let link = req.params.link;
        let buySell = 1;
        let searchItem = {};
        let { page, pageSize, search_key, cateID, brand, wattage, microprocessor, ram, hardDrive, typeHardrive, screen, size, brandMaterials, vehicles, spareParts,
            interior, device, color, capacity, connectInternet, generalType, resolution, machineSeries, engine, accessary, frameMaterial, volume, manufacturingYear
            , fuel, numberOfSeats, gearBox, style, payload, carNumber, km, origin, version, statusSell, nameApartment, numberOfStoreys, storey, mainDirection
            , balconyDirection, legalDocuments, statusInterior, acreage, length, width, buyingArea, kvCity, kvDistrict, kvWard, numberToletRoom
            , numberBedRoom, typeOfApartment, special, statusBDS, codeApartment, cornerUnit, nameArea, useArea, landType, officeType, block, kindOfPet
            , age, gender, exp, level, degree, jobType, jobDetail, jobKind, salary, benefit, skill, city, district, ward, payBy, giaTu, giaDen }
            = req.query;
        if(!page && !pageSize){
            return functions.setError(res,'missing data',400)
          
        }
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        if(await functions.checkNumber(page) === false || await functions.checkNumber(page) === false)
        {
            return functions.setError(res,'page not found',404)
        }
        if (link === 'tat-ca-tin-dang-ban.html') {
            buySell = 2;
            searchItem = { _id: 1, active:1, title: 1, viewCount: 1, address: 1, money: 1, apartmentNumber: 1, img: 1, updateTime: 1, name: 1, address: 1, district: 1, ward: 1 }
        } else if (link === 'tat-ca-tin-dang-mua.html') {
            buySell = 1;
            searchItem = { _id: 1,active:1, title: 1, viewCount: 1, address: 1, money: 1, startvalue: 1, timeReceivebidding: 1, timeEndReceivebidding: 1, img: 1, apartmentNumber: 1, updateTime: 1, createTime: 1, name: 1, address: 1, district: 1, ward: 1, }

        } else {
            return functions.setError(res, "page not found", 404)
        }
        let condition = { buySell };
        if (search_key) {
            let query = raoNhanh.createLinkTilte(search_key);
            condition.linkTitle = { $regex: `.*${query}.*` };
        }
        if (cateID) condition.cateID = cateID;
        if (brand) condition.brand = brand;
        if (wattage) condition.wattage = wattage;
        if (microprocessor) condition["electroniceDevice.microprocessor"] = microprocessor;
        if (ram) condition["electroniceDevice.ram"] = ram;
        if (hardDrive) condition["electroniceDevice.hardDrive"] = hardDrive;
        if (typeHardrive) condition["electroniceDevice.typeHardrive"] = typeHardrive;
        if (screen) condition["electroniceDevice.screen"] = screen;
        if (size) condition["electroniceDevice.size"] = size;
        if (machineSeries) condition["electroniceDevice.machineSeries"] = machineSeries;
        if (brandMaterials) condition["vehicle.brandMaterials"] = brandMaterials;
        if (vehicles) condition["vehicle.vehicles"] = vehicles;
        if (spareParts) condition["vehicle.spareParts"] = spareParts;
        if (interior) condition["vehicle.interior"] = interior;
        if (device) condition["vehicle.device"] = device;
        if (color) condition["vehicle.color"] = color;
        if (capacity) condition["vehicle.capacity"] = capacity;
        if (connectInternet) condition["vehicle.connectInternet"] = connectInternet;
        if (generalType) condition["vehicle.generalType"] = generalType;
        if (resolution) condition["vehicle.resolution"] = resolution;
        if (engine) condition["vehicle.engine"] = engine;
        if (accessary) condition["vehicle.accessary"] = accessary;
        if (frameMaterial) condition["vehicle.frameMaterial"] = frameMaterial;
        if (volume) condition["vehicle.volume"] = volume;
        if (manufacturingYear) condition["vehicle.manufacturingYear"] = manufacturingYear;
        if (fuel) condition["vehicle.fuel"] = fuel;
        if (numberOfSeats) condition["vehicle.numberOfSeats"] = numberOfSeats;
        if (gearBox) condition["vehicle.gearBox"] = gearBox;
        if (style) condition["vehicle.style"] = style;
        if (payload) condition["vehicle.payload"] = payload;
        if (carNumber) condition["vehicle.carNumber"] = carNumber;
        if (km) condition["vehicle.km"] = km;
        if (origin) condition["vehicle.origin"] = origin;
        if (version) condition["vehicle.version"] = version;
        if (statusSell) condition["realEstate.statusSell"] = statusSell;
        if (nameApartment) condition["realEstate.nameApartment"] = nameApartment;
        if (numberOfStoreys) condition["realEstate.numberOfStoreys"] = numberOfStoreys;
        if (storey) condition["realEstate.storey"] = storey;
        if (mainDirection) condition["realEstate.mainDirection"] = mainDirection;
        if (balconyDirection) condition["realEstate.balconyDirection"] = balconyDirection;
        if (legalDocuments) condition["realEstate.legalDocuments"] = legalDocuments;
        if (statusInterior) condition["realEstate.statusInterior"] = statusInterior;
        if (acreage) condition["realEstate.acreage"] = acreage;
        if (length) condition["realEstate.length"] = length;
        if (width) condition["realEstate.width"] = width;
        if (buyingArea) condition["realEstate.buyingArea"] = buyingArea;
        if (kvCity) condition["realEstate.kvCity"] = kvCity;
        if (kvDistrict) condition["realEstate.kvDistrict"] = kvDistrict;
        if (kvWard) condition["realEstate.kvWard"] = kvWard;
        if (numberToletRoom) condition["realEstate.numberToletRoom"] = numberToletRoom;
        if (numberBedRoom) condition["realEstate.numberBedRoom"] = numberBedRoom;
        if (typeOfApartment) condition["realEstate.typeOfApartment"] = typeOfApartment;
        if (special) condition["realEstate.special"] = special;
        if (statusBDS) condition["realEstate.statusBDS"] = statusBDS;
        if (codeApartment) condition["realEstate.codeApartment"] = codeApartment;
        if (cornerUnit) condition["realEstate.cornerUnit"] = cornerUnit;
        if (nameArea) condition["realEstate.nameArea"] = nameArea;
        if (useArea) condition["realEstate.useArea"] = useArea;
        if (landType) condition["realEstate.landType"] = landType;
        if (officeType) condition["realEstate.officeType"] = officeType;
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
        if (city) condition["Job.city"] = city;
        if (district) condition["Job.district"] = district;
        if (ward) condition["Job.ward"] = ward;
        if (payBy) condition["Job.payBy"] = payBy;
        if (benefit) condition["Job.benefit"] = benefit;
        if (giaTu && buySell === 1) condition.startvalue = { $gte: startvalue };
        if (giaDen && buySell === 1) condition.endvalue = { $lte: endvalue };
        if (giaTu && buySell === 2) condition.money = { $gte: giaTu };
        if (giaTu && buySell === 2) condition.money = { $gte: giaTu };
        let data = await New.find(condition, searchItem).skip(skip).limit(limit);
        const totalCount = await New.countDocuments({buySell})
        const totalPages = Math.ceil(totalCount / pageSize)
        return functions.success(res, "get data success", {totalCount,totalPages, data })
    } catch (error) {
        return functions.setError(res, error)
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
            let linkTitle = raoNhanh.createLinkTilte(title);

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
                        raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.Image[i], ['.jpg', '.png']);
                        img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image[i].name) });
                    }
                } else {
                    raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.Image, ['.jpg', '.png']);
                    img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image.name) });
                }
            }
            if (File.tenderFile) {
                if (File.tenderFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.tenderFile, ['.jpg', '.png', '.docx', '.pdf']);
                tenderFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.tenderFile.name)
            }
            if (File.instructionFile) {
                if (File.instructionFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.instructionFile, ['.jpg', '.png', '.docx', '.pdf']);
                instructionFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.instructionFile.name)
            }
            if (File.fileContentProcedureApply) {
                if (File.fileContentProcedureApply.length) return functions.setError(res, 'Gửi quá nhiều file');
                raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.fileContentProcedureApply, ['.jpg', '.png', '.docx', '.pdf']);
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
            let linkTitle = raoNhanh.createLinkTilte(title);

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
                        raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.Image[i], ['.jpg', '.png']);
                        img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image[i].name) });
                    }
                } else {
                    raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.Image, ['.jpg', '.png']);
                    img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image.name) });
                }
                if (files_old.img) {
                    for (let i = 0; i < files_old.img.length; i++) {
                        let text = files_old.img[i].nameImg.split('/').reverse()[0];
                        raoNhanh.deleteFileRaoNhanh(userID, text)
                    }
                }
                updateItem.img = img;
            }
            if (File.tenderFile) {
                if (File.tenderFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.tenderFile, ['.jpg', '.png', '.docx', '.pdf']);
                tenderFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.tenderFile.name)
                if (files_old.tenderFile) {

                    let text = files_old.tenderFile.split('/').reverse()[0]
                    raoNhanh.deleteFileRaoNhanh(userID, text)
                }
                updateItem.tenderFile = tenderFile;
            }
            if (File.instructionFile) {
                if (File.instructionFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.instructionFile, ['.jpg', '.png', '.docx', '.pdf']);
                instructionFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.instructionFile.name)
                if (files_old.fileContentProcedureApply) {

                    let text = files_old.fileContentProcedureApply.split('/').reverse()[0]
                    raoNhanh.deleteFileRaoNhanh(userID, text)
                }
                updateItem.instructionFile = instructionFile;
            }
            if (File.fileContentProcedureApply) {
                if (File.fileContentProcedureApply.length) return functions.setError(res, 'Gửi quá nhiều file');
                raoNhanh.uploadFileRaoNhanh('avt_tindangmua', userID, File.fileContentProcedureApply, ['.jpg', '.png', '.docx', '.pdf']);
                fileContentProcedureApply = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.fileContentProcedureApply.name)
                if (files_old.instructionFile) {

                    let text = files_old.instructionFile.split('/').reverse()[0]
                    raoNhanh.deleteFileRaoNhanh(userID, text)
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
        if (!check) {
            return functions.setError(res, 'not found', 404)
        }
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
            cate_Special = await raoNhanh.checkNameCateRaoNhanh(danh_muc3);
        } else {
            if (danh_muc2) {
                cate_Special = await raoNhanh.checkNameCateRaoNhanh(danh_muc2);
            } else {
                cate_Special = await raoNhanh.checkNameCateRaoNhanh(danh_muc1);
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
                detailCategory: 1,viewCount:1, user: { userName: 1, type: 1, createdAt: 1 }
            };
        } else if (buy === 'b') {
            buysell = 2;
            searchitem = { title: 1,viewCount:1, money: 1, name: 1, phone: 1, address: 1, updateTime: 1, img: 1, status: 1, description: 1, detailCategory: 1, user: { userName: 1, type: 1, createdAt: 1 } };

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
                $match: { _id: 631733  }
            }
        ]);
        tintuongtu = await New.find({ cateID: check.cateID }, searchitem).limit(6);

        await New.findByIdAndUpdate(id_new,{$inc:{viewCount:+1}})
        if (tintuongtu) {   
             data.push({ tintuongtu: tintuongtu })
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
            let upload = raoNhanh.uploadFileRaoNhanh('avt_dangtin', _id, File.avatarUser, ['.jpeg', '.jpg', '.png']);
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
exports.managenew = async (req, res, next) => {
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
        let searchItem = { title: 1, timeEndReceivebidding: 1, city: 1, district: 1, ward: 1, apartmentNumber: 1, endvalue: 1, until_den: 1, Bidding: { status: 1 } }
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
                    $match: { 'Bidding.userID': userID, timeEndReceivebidding: { $lte: new Date(Date.now()) } }
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
        let data = [];
        if (link === 'cate') {
            data = await CategoryRaoNhanh365.find({ parentId: 0 }, { name: 1 })
        } else if (link === 'city') {
            data = await city.find();
        } else {
            return functions.setError(res, 'page not found')
        }
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// quản lí tin bán 
exports.manageNewBuySell = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let userID = req.user.data._id;
        let data = [];
        let tong_soluong = await New.find({ userID, buySell: 2 }).count(); 
        let tinDangDang  = await New.find({ userID,sold:1, buySell: 2 }).count();
        let tinDaBan = await New.find({ userID, sold:0, buySell: 2 }).count();
        let tinDangAn = await New.find({ userID,active:0, buySell: 2 }).count();
        let searchItem = { title: 1, pinHome:1,pinCate:1, city: 1, district: 1, ward: 1, apartmentNumber: 1,address:1, money: 1 }
        if (linkTitle === 'quan-ly-tin-ban.html') {
            data = await New.find({ userID, buySell: 2 }, searchItem)
        } else if (linkTitle === 'tin-dang-dang.html') {
            data = await New.find({ userID,sold:1, buySell: 2 }, searchItem)
        } else if (linkTitle === 'tin-da-ban.html') {
            data = await New.find({  userID, sold:0, buySell: 2 }, searchItem)
        } else if (linkTitle === 'tin-dang-an.html') {
            data = await New.find({ userID,active:0, buySell: 2 }, searchItem)
        } else {
            return functions.setError(res, 'page not found ', 404)
        }
        return functions.success(res, 'get data success', { tong_soluong, tinDangDang, tinDangAn, tinDaBan, data })
    }
    catch (error) {
        console.log("🚀 ~ file: new.js:1315 ~ exports.manageNewBuySell= ~ error:", error)
        return functions.setError(res, error)
    }
}

// danh sách tin tìm ứng viên
exports.listCanNew = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let userID = req.user.data._id;
        let data = [];
        let tong_soluong = await New.find({ userID, cateID:120 }).count(); 
        let tinDangTimUngVien = await New.find({ userID, status:1, cateID:120  }).count();
        let tinDaTimUngVien = await New.find({ userID, status:0, cateID:120 }).count();
        let searchItem = { title: 1,  city: 1, district: 1, ward: 1, apartmentNumber: 1,address:1, benefit: 1 }
        if (linkTitle === 'quan-ly-tin-tim-ung-vien.html') {
            data = await New.find({ userID, cateID:120 }, searchItem)
        } else if (linkTitle === 'tin-dang-tim.html') {
            data = await New.find({ userID, status:1, cateID:120 }, searchItem)
        } else if (linkTitle === 'tin-da-tim.html') {
            data = await New.find({ userID, status:0, cateID:120 }, searchItem)
        } else {
            return functions.setError(res, 'page not found ', 404)
        }
        return functions.success(res, 'get data success', { tong_soluong, tinDangTimUngVien, tinDaTimUngVien, data })
    }
    catch (error) {
        console.log("🚀 ~ file: new.js:1315 ~ exports.manageNewBuySell= ~ error:", error)
        return functions.setError(res, error)
    }
}

// // danh sách tin đang ứng tuyển
// exports.listJobNewApply = async (req, res, next) => {
//     try {
//         let userID = req.user.data._id;
//         let data = [];
//         data = await User.aggregate([
//             {
//                 $lookup: {
//                     from: "Order",
//                     localField: "_id",
//                     foreignField: "sellerId",
//                     as: "Order"
//                 }
//             },
//             {
//                 $match: { "Order.buyerId": 5}
//             },
//              {
//                 $project: { title: 1,img:1,userName:1, Order: {status:1,newId:1,createdAt:1 } }
//             }
//         ])
//         return functions.success(res, 'get data success', {data})
//     }
//     catch (error) {
//         return functions.setError(res, error)
//     }
// }

// danh sách tin tìm việc làm 
exports.listJobNew = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let userID = req.user.data._id;
        let data = [];
        let tong_soluong = await New.find({ userID, cateID:121 }).count(); 
        let tinDangTimViec = await New.find({ userID, status:1, cateID:121  }).count();
        let tinDaTimViec = await New.find({ userID, status:0, cateID:121 }).count();
        let searchItem = { title: 1,  city: 1, district: 1, ward: 1, apartmentNumber: 1,address:1, benefit: 1 }
        if (linkTitle === 'quan-ly-tin-tim-viec-lam.html') {
            data = await New.find({ userID, cateID:121 }, searchItem)
        } else if (linkTitle === 'tin-dang-tim.html') {
            data = await New.find({ userID, status:1, cateID:121 }, searchItem)
        } else if (linkTitle === 'tin-da-tim.html') {
            data = await New.find({ userID, status:0, cateID:121 }, searchItem)
        } else {
            return functions.setError(res, 'page not found ', 404)
        }
        return functions.success(res, 'get data success', { tong_soluong, tinDangTimViec, tinDaTimViec  , data })
    }
    catch (error) {
        console.log("🚀 ~ file: new.js:1315 ~ exports.manageNewBuySell= ~ error:", error)
        return functions.setError(res, error)
    }
}