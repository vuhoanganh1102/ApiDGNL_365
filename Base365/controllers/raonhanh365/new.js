const functions = require('../../services/functions');
const Category = require('../../models/Raonhanh365/Category');
const New = require('../../models/Raonhanh365/UserOnSite/New')
const CategoryRaoNhanh365 = require('../../models/Raonhanh365/Category');
const User = require('../../models/Users');
const LoveNews = require('../../models/Raonhanh365/UserOnSite/LoveNews');
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
        let fields = [userID, cateID, title, money, until, description, free, poster, name, email, address, phone, status, detailCategory, img];
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
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
                        listImg.push({nameImg: img[i].originalFilename, size: img[i].size});
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
        }else{
            return functions.setError(res, 'Missing input image', 406)
        }
        
        if (video) {
            if (video.length == 1) {
                let checkVideo = await functions.checkVideo(video[0]);
                if (checkVideo) {
                    nameVideo = video[0].filename
                } else {
                    video.forEach(async(element) => {
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
    } catch (err) {
        console.log(err);
        return functions.setError(res, err);
    }
}

// đăng tin chung cho tat ca cac tin
exports.postNewsGeneral = async(req, res, next) => {
    try {
        let exists = await Category.find({ _id: req.cateID }); 
        let fields = req.info;
        if (exists) {
            let request = req.body;
            
            //cac truong khi dang tin do dien tu
            let fieldsElectroniceDevice = {
                microprocessor : request.microprocessor,
                ram : request.ram,
                hardDrive : request.hardDrive,
                typeHarđrive : request.typeHarđrive,
                screen : request.screen,
                size : request.size,
                brand : request.brand,
                machineSeries : request.machineSeries
            }

            //cac truong khi dang tin do xe co
            let fieldsVehicle = {
                brandMaterials : request.brandMaterials,
                vehicles : request.vehicles,
                spareParts : request.spareParts,
                interior : request.interior,
                device : request.device,
                color : request.color,
                capacity : request.capacity,
                connectInternet : request.connectInternet,
                generalType : request.generalType,
                wattage : request.wattage,
                resolution : request.resolution,
                engine : request.engine,
                accessary : request.accessary,
                frameMaterial : request.frameMaterial,
                volume : request.volume,
                manufacturingYear : request.manufacturingYear,
                fuel : request.fuel,
                numberOfSeats : request.numberOfSeats,
                gearBox : request.gearBox,
                style : request.style,
                payload : request.payload,
                carNumber : request.carNumber,
                km : request.km,
                origin : request.origin,
                version : request.version
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
            if(cv){
                if(await functions.checkFileCV(cv.path)){
                    nameFileCV = cv.originalFilename;
                }else {
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

exports.createNews = async(req, res, next)=>{
    try {
        let fields = req.fields;
        fields.createTime = new Date(Date.now());
        const news = new New(fields);
        await news.save();
        return functions.success(res, "create news success");
    }catch(err){
        console.log(err);
        return functions.setError(res, err)
    }
}

//chinh sua tat ca cac loai tin
exports.updateNews = async(req, res, next) => {
    try {
        let idNews = Number(req.body.news_id);
        if(!idNews)
            return functions.setError(res, "Missing input news_id!", 405);
        let existsNews = await New.find({_id: idNews});
        let fields = req.fields;
        fields.updateTime = new Date(Date.now());
        if (existsNews ) {
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

exports.hideNews = async(req, res, next)=>{
    try{
        let idNews = Number(req.body.news_id);
        if(!idNews)
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
    }catch(err){
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
exports.searchSellNews = async(req, res, next)=>{
    try{
        if (req.body) {
            
            if(!req.body.page){
                return functions.setError(res, "Missing input page", 401);
            }
            if(!req.body.pageSize){
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
            let listNews=[];
            let listCondition = {};
            let cateID = Number(req.body.cateID);
            let buySell =  Number(req.body.buySell);

            // dua dieu kien vao ob listCondition
            if(idNews) listCondition._id = idNews;
            if(cateID) listCondition.cateID = cateID;
            if(buySell) listCondition.buySell = buySell;
            if(title) listCondition.title =  new RegExp(title, "i");
            if(description) listCondition.description = new RegExp(description);
            if(city) listCondition.city = Number(city);
            if(district) listCondition.district = Number(district);
            if(ward) listCondition.ward = Number(ward);

            let fieldsGet = 
            {   
                userID:1, title:1, linkTitle:1, money:1,endvalue:1,downPayment:1,until:1,cateID:1,type:1,image:1,video:1,buySell:1,createTime:1,updateTime:1, city: 1, district: 1
            }
            listNews = await functions.pageFindWithFields(New, listCondition, fieldsGet, { _id: 1 }, skip, limit); 
            totalCount = await New.countDocuments(listCondition);
            return functions.success(res, "get buy news success", { data: {totalCount, listNews} });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    }catch(err){
        console.log(err);
        return functions.setError(res, err);
    }
}


// đăng tin do dien tu
exports.postNewElectron = async(req, res, next) => {
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
            let subFields = {microprocessor, ram, hardDrive, typeHarđrive, screen, size, brand, machineSeries};
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

// lấy tin trước đăng nhập

exports.getNewsBeforeLogin = async(req, res, next) => {
        try {
            // tạo mảng
            let output = [];
            // tìm tin được ưu tiên đẩy lên đầu với trường pinHome và pinCate
            let data_pinHome = await New.find({ pinHome: 1 }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber');

            if (data_pinHome) {
                for (let i = 0; i < data_pinHome.length; i++) {
                    // thêm tin vào mảng 
                    output.push(data_pinHome[i])
                }
            }
            // nếu dữ liệu ưu tiên ít hơn 50 thì thêm dữ liệu thường vào
            if (output.length < 50) {
                // lấy data với những tin có ngày cập nhật mới nhất
                let data = await New.find({}).sort({ updatedAt: -1 }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50 - output.length);
                for (let i = 0; i < data.length; i++) {
                    // thêm tin vào mảng 
                    output.push(data[i])
                }
            }
            return functions.success(res, "get data success", { output })
        } catch (error) {
            return functions.setError(res, error)
        }
    }


exports.deleteNews = async (req, res) => {
    try {
        let idNews = req.query.idNews;
        let buySell = 2;
        if (idNews) {
            let news = await functions.getDataDeleteOne(New ,{_id: idNews, buySell: buySell});
            if (news.deletedCount===1) {
                return functions.success(res, "Delete sell news by id success");
            }else{
                return functions.success(res, "Buy news not found");
            }
        } else {
            if (!await functions.getMaxID(New)) {
                functions.setError(res, "No news existed", 513);
            } else {
                New.deleteMany({buySell: buySell})
                    .then(() => functions.success(res, "Delete all news successfully"))
                    .catch(err => functions.setError(res, err.message, 514));
            }
        }
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
};


exports.getNewBeforeLogin = async (req, res, next) => {
    try {
        let searchitem = { _id: 1, title: 1, address: 1, viewCount: 1, money: 1, updateTime: 1, apartmentNumber: 1, linkTitle: 1, image: 1, img: 1, description: 1, createTime: 1, video: 1, name: 1, phone: 1, email: 1, address: 1, district: 1, ward: 1, quantitySold: 1, totalSold: 1 }
        // tìm tin được ưu tiên đẩy lên đầu với trường pinHome
        let data = await New.find({ pinHome: 1, buySell: 2 }, searchitem).limit(50);
        if (data) {
            // lặp để chèn link ảnh
            for (let i = 0; i < data.length; i++) {
                // chèn link ảnh
                data[i].image = await functions.getUrlLogoCompany(data[i].createTime, data[i].image);
                if (data[i].img.length !== 0) {
                    for (let j = 0; j < data[i].img.length; j++) {
                        // chèn link ảnh
                        data[i].img[j].nameImg = await functions.getUrlLogoCompany(data[i].createTime, data[i].img[j].nameImg);
                    }
                }
            }
        }
        // nếu dữ liệu ưu tiên ít hơn 50 thì thêm dữ liệu thường vào
        if (data.length < 50) {
            // lấy data với những tin có ngày cập nhật mới nhất
            let data_new = await New.find({ buySell: 2 }, searchitem).sort({ updateTime: -1 }).limit(50 - data.length);
            // lặp để chèn link ảnh
            for (let i = 0; i < data_new.length; i++) {
                // chèn link ảnh
                data_new[i].image = await functions.getUrlLogoCompany(data_new[i].createTime, data_new[i].image);
                if (data_new[i].img.length !== 0) {
                    for (let j = 0; j < data_new[i].img.length; j++) {
                        // chèn link ảnh
                        data_new[i].img[j].nameImg = await functions.getUrlLogoCompany(data_new[i].createTime, data_new[i].img[j].nameImg);
                    }
                }
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
        let searchItem = { _id: 1, title: 1, viewCount: 1, address: 1, money: 1, apartmentNumber: 1, updateTime: 1, linkTitle: 1, image: 1, img: 1, description: 1, createTime: 1, video: 1, name: 1, phone: 1, email: 1, address: 1, district: 1, ward: 1, quantitySold: 1, totalSold: 1 }

        // trường hợp không nhập gì mà tìm kiếm
        if (!req.body.key || req.body.key === undefined) {
            let data = await New.find({ buySell: 2 }, searchItem).sort({ updateTime: -1 }).limit(50);
            for (let i = 0; i < data.length; i++) {
                data[i].image = await functions.getUrlLogoCompany(data[i].createTime, data[i].image);
                if (data[i].img.length !== 0) {
                    for (let j = 0; j < data[i].img.length; j++) {
                        data[i].img[j].nameImg = await functions.getUrlLogoCompany(data[i].createTime, data[i].img[j].nameImg);
                    }
                }
            }
            return functions.success(res, "get data success", { data })
        }
        // lấy giá trị search key
        let search = req.body.key;
        // đưa câu truy vấn về chữ thường
        let key_lower = search.toLowerCase();
        // đổi chữ cái đầu thành chữ hoa
        let key = key_lower.charAt(0).toUpperCase() + key_lower.slice(1);
        // tìm kiếm danh mục với key
        let query = await CategoryRaoNhanh365.find({ name: key })
        if (!query || query.length === 0) {
            //tạo biểu thức chính quy cho phép truy vấn key không phân biệt hoa thường
            const regex = new RegExp(key, "i");
            // tìm data với biểu thức chính quy 
            let data_search = await CategoryRaoNhanh365.find({ name: regex });
            if (data_search) {
                // lấy data nếu có trong danh mục
                let data = await New.find({ cateID: data_search[0]._id, buySell: 2 }, searchItem).sort({ updateTime: -1 }).limit(50);
                if (data) {
                    for (let i = 0; i < data.length; i++) {
                        data[i].image = await functions.getUrlLogoCompany(data[i].createTime, data[i].image);
                        if (data[i].img.length !== 0) {
                            for (let j = 0; j < data[i].img.length; j++) {
                                data[i].img[j].nameImg = await functions.getUrlLogoCompany(data[i].createTime, data[i].img[j].nameImg);
                            }
                        }
                    }
                    return functions.success(res, "get data success", { data })
                }
                else {
                    // lấy data với tên của sản phẩm
                    let data = await New.find({ name: regex, buySell: 2 }, searchItem).limit(50);
                    for (let i = 0; i < data.length; i++) {
                        data[i].image = await functions.getUrlLogoCompany(data[i].createTime, data[i].image);
                        if (data[i].img.length !== 0) {
                            for (let j = 0; j < data[i].img.length; j++) {
                                data[i].img[j].nameImg = await functions.getUrlLogoCompany(data[i].createTime, data[i].img[j].nameImg);
                            }
                        }
                    }
                    return functions.success(res, "get data success", { data })
                }
            }

        } else {
            // tìm kiếm tin với id của danh mục đã tìm được
            let data = await New.find({ cateID: query[0]._id, buySell: 2 }, searchItem).limit(50);
            // đẩy dữ liệu vào mảng
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].image = await functions.getUrlLogoCompany(data[i].createTime, data[i].image);
                    if (data[i].img.length !== 0) {
                        for (let j = 0; j < data[i].img.length; j++) {
                            data[i].img[j].nameImg = await functions.getUrlLogoCompany(data[i].createTime, data[i].img[j].nameImg);
                        }
                    }
                }
                return functions.success(res, "get data success", { data })
            }
            else {
                return functions.setError(res, "get data failed")
            }
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
        let { cateID, title, name, city, district, ward, apartmentNumber, description, bidExpirationTime, timeReceivebidding, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, until_tu, until_den, until_bidFee, phone, email } = req.body;
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
            && bidExpirationTime && status && timeNotiBiddingStart
            && timeNotiBiddingEnd && instructionContent && bidFee &&
            startvalue && endvalue && phone && email && until_tu && until_den && until_bidFee) {

            // tạolink title từ title người dùng nhập
            let linkTitle = functions.createLinkTilte(title);

            // kiểm tra title đã được người dùng tạo chưa
            let checktitle = await New.find({ userID, linkTitle });
            if (checktitle && checktitle.length !== 0) {
                return functions.setError(res, 'The title already has a previous new word or does not have a keyword that is not allowed', 404)
            } else
                // kiểm tra tiền nhập vào có phải số không
                if (isNaN(bidFee) === true || isNaN(startvalue) === true || isNaN(endvalue) === true) {
                    return functions.setError(res, 'The input price is not a number');
                }
                // kiểm tra số điện thoại
                else if (await functions.checkPhoneNumber(phone) === false) {
                    return functions.setError(res, 'Invalid phone number');
                }
                // kiểm tra email
                else if (await functions.checkEmail(email) === false) {
                    return functions.setError(res, 'Invalid email');
                }

            if (functions.checkDate(timeReceivebidding) === true && functions.checkDate(bidExpirationTime) === true && functions.checkDate(timeNotiBiddingStart) === true && functions.checkDate(timeNotiBiddingEnd) === true) {
                //  kiểm tra thời gian có nhỏ hơn thời gian hiện tại không
                if (await functions.checkTime(timeReceivebidding) && await functions.checkTime(bidExpirationTime) && await functions.checkTime(timeNotiBiddingStart) && await functions.checkTime(timeNotiBiddingEnd)) {
                    //  kiểm tra thời gian nộp hồ sơ và thời gian thông báo có hợp lệ không
                    let date1 = new Date(timeReceivebidding);
                    let date2 = new Date(bidExpirationTime);
                    let date3 = new Date(timeNotiBiddingStart);
                    let date4 = new Date(timeNotiBiddingEnd);
                    if (date1 > date2 || date3 > date4 || date3 < date2) {
                        return functions.setError(res, 'Nhập ngày không hợp lệ', 404)
                    }
                } else {
                    return functions.setError(res, 'Ngày nhập vào nhỏ hơn ngày hiện tại', 404)
                }
            }
            else {
                return functions.setError(res, 'Invalid date format', 404)
            }

            if (File.Image) {
                if (File.Image.length) {
                    if (File.Image.length > 10) return functions.setError(res, 'Gửi quá nhiều ảnh');
                    for (let i = 0; i < File.Image.length; i++) {
                        functions.uploadFileRaoNhanh(userID, File.Image[i]);
                        img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image[i].name) });
                    }
                } else {
                    functions.uploadFileRaoNhanh(userID, File.Image);
                    img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image.name) });
                }
            }
            if (File.tenderFile) {
                if (File.tenderFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh(userID, File.tenderFile);
                tenderFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.tenderFile.name)
            }
            if (File.instructionFile) {
                if (File.instructionFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh(userID, File.instructionFile);
                instructionFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.instructionFile.name)
            }
            if (File.fileContentProcedureApply) {
                if (File.fileContentProcedureApply.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh(userID, File.fileContentProcedureApply);
                fileContentProcedureApply = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.fileContentProcedureApply.name)
            }
            //lưu dữ liệu vào DB
            const postNew = new New({ _id, cateID, title, type, linkTitle, userID, buySell, createTime, img, tenderFile, fileContentProcedureApply, contentOnline, instructionFile, cityProcedure, districtProcedure, wardProcedure, name, city, district, ward, apartmentNumber, description, timeReceivebidding, bidExpirationTime, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, phone, email, until_tu, until_den, until_bidFee });
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
        let { id, title, name, city, district, ward, apartmentNumber, description, bidExpirationTime, timeReceivebidding, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, until_tu, until_den, until_bidFee, phone, email } = req.body;
        //  tạo mảng img
        let img = [];


        // lấy thời gian hiện tại
        let updateTime = new Date(Date.now());

        let File = req.files;

        // kiểm tra các điều kiện bắt buộc 
        if (title && name && city && district && ward
            && apartmentNumber && description && timeReceivebidding
            && bidExpirationTime && status && timeNotiBiddingStart
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
                    return functions.setError(res, 'The input price is not a number');
                }
                // kiểm tra số điện thoại
                else if (await functions.checkPhoneNumber(phone) === false) {
                    return functions.setError(res, 'Invalid phone number');
                }
                // kiểm tra email
                else if (await functions.checkEmail(email) === false) {
                    return functions.setError(res, 'Invalid email');
                }

            if (functions.checkDate(timeReceivebidding) === true && functions.checkDate(bidExpirationTime) === true && functions.checkDate(timeNotiBiddingStart) === true && functions.checkDate(timeNotiBiddingEnd) === true) {
                //  kiểm tra thời gian có nhỏ hơn thời gian hiện tại không
                if (await functions.checkTime(timeReceivebidding) && await functions.checkTime(bidExpirationTime) && await functions.checkTime(timeNotiBiddingStart) && await functions.checkTime(timeNotiBiddingEnd)) {
                    //  kiểm tra thời gian nộp hồ sơ và thời gian thông báo có hợp lệ không
                    let date1 = new Date(timeReceivebidding);
                    let date2 = new Date(bidExpirationTime);
                    let date3 = new Date(timeNotiBiddingStart);
                    let date4 = new Date(timeNotiBiddingEnd);
                    if (date1 > date2 || date3 > date4 || date3 < date2) {
                        return functions.setError(res, 'Nhập ngày không hợp lệ', 404)
                    }
                } else {
                    return functions.setError(res, 'Ngày nhập vào nhỏ hơn ngày hiện tại', 404)
                }
            }
            else {
                return functions.setError(res, 'Invalid date format', 404)
            }
            let files_old = await New.findById(id, { img: 1, tenderFile: 1, instructionFile: 1, fileContentProcedureApply: 1 })
            if (files_old.tenderFile) {

                let text = files_old.tenderFile.split('/').reverse()[0]
                functions.deleteFileRaoNhanh(userID, text)
            }
            if (files_old.img) {
                for (let i = 0; i < files_old.img.length; i++) {
                    let text = files_old.img[i].nameImg.split('/').reverse()[0];
                    functions.deleteFileRaoNhanh(userID, text)
                }
            }
            if (files_old.fileContentProcedureApply) {

                let text = files_old.fileContentProcedureApply.split('/').reverse()[0]
                functions.deleteFileRaoNhanh(userID, text)
            }
            if (files_old.instructionFile) {

                let text = files_old.instructionFile.split('/').reverse()[0]
                functions.deleteFileRaoNhanh(userID, text)
            }


            if (File.Image) {
                if (File.Image.length) {
                    if (File.Image.length > 10) return functions.setError(res, 'Gửi quá nhiều ảnh');
                    for (let i = 0; i < File.Image.length; i++) {
                        functions.uploadFileRaoNhanh(userID, File.Image[i]);
                        img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image[i].name) });
                    }
                } else {
                    functions.uploadFileRaoNhanh(userID, File.Image);
                    img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.Image[i].name) });
                }
            }
            if (File.tenderFile) {
                if (File.tenderFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh(userID, File.tenderFile);
                tenderFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.tenderFile.name)
            }
            if (File.instructionFile) {
                if (File.instructionFile.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh(userID, File.instructionFile);
                instructionFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.instructionFile.name)
            }
            if (File.fileContentProcedureApply) {
                if (File.fileContentProcedureApply.length) return functions.setError(res, 'Gửi quá nhiều file');
                functions.uploadFileRaoNhanh(userID, File.fileContentProcedureApply);
                fileContentProcedureApply = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File.fileContentProcedureApply.name)
            }

            await New.findByIdAndUpdate(id, { title, linkTitle, img, tenderFile, updateTime, fileContentProcedureApply, contentOnline, instructionFile, cityProcedure, districtProcedure, wardProcedure, name, city, district, ward, apartmentNumber, description, timeReceivebidding, bidExpirationTime, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, phone, email, until_tu, until_den, until_bidFee })

        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, "update new success")
    } catch (error) {
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
            data = await New.find({ buySell: 2 }, searchitem).sort({ updateTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 2 });
            totalPages = Math.ceil(totalCount / pageSize)
        } else if (sort === 3) {
            data = await New.find({ type: 0, buySell: 2 }, searchitem).sort({ updateTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 2, type: 0 });
            totalPages = Math.ceil(totalCount / pageSize)
        } else if (sort === 4) {
            data = await New.find({ type: 1, buySell: 2 }, searchitem).sort({ updateTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 2, type: 1 });
            totalPages = Math.ceil(totalCount / pageSize)
        }

        return functions.success(res, 'get data success ', { totalCount, totalPages, data })

    } catch (error) {
        return functions.setError(res, error)
    }
}

// chi tiết tin bán
exports.getDetailNew = async (req, res, next) => {
    try {
        let searchitem = { title: 1, userID: 1, cateID: 1, viewCount: 1, totalSold: 1, buySell: 1, apartmentNumber: 1, money: 1, address: 1, updateTime: 1, linkTitle: 1, img: 1, description: 1, createTime: 1, video: 1, name: 1, phone: 1, email: 1, address: 1, district: 1, ward: 1, quantitySold: 1, totalSold: 1 }
        let id = req.body.id;
        let data = await New.find({ _id: id, buySell: 2 }, searchitem);
        if (!data) {
            functions.setError(res, "get data failed")
        }
        let cateID = Number(data.cateID);
        let nameCateParent = null;
        let dataCate = await CategoryRaoNhanh365.findById(cateID, { parentId: 1, name: 1 });
        let nameCate = dataCate.name;
        if (dataCate.parentId !== 0) {
            nameCateParent = await CategoryRaoNhanh365.findById(dataCate.parentId, { name: 1 })
        }
        functions.success(res, 'get data success', { nameCate, nameCateParent, data })
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

// danh sách tin mua
exports.getAllBuyNew = async (req, res, next) => {
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
            data = await New.find({ buySell: 1 }, searchitem).sort({ viewCount: -1 }).skip(skip).limit(pageSize);
            totalCount = await New.countDocuments({ buySell: 1 });
            totalPages = Math.ceil(totalCount / pageSize)
        }
        else if (sort === 2) {
            data = await New.find({ buySell: 1 }, searchitem).sort({ updateTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 1 });
            totalPages = Math.ceil(totalCount / pageSize)
        } else if (sort === 3) {
            data = await New.find({ type: 0, buySell: 1 }, searchitem).sort({ updateTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 1, type: 0 });
            totalPages = Math.ceil(totalCount / pageSize)
        } else if (sort === 4) {
            data = await New.find({ type: 1, buySell: 1 }, searchitem).sort({ updateTime: -1 }).skip(skip).limit(pagesize);
            totalCount = await New.countDocuments({ buySell: 1, type: 1 });
            totalPages = Math.ceil(totalCount / pageSize)
        }

        return functions.success(res, 'get data success ', { totalCount, totalPages, data })

    } catch (error) {
        return functions.setError(res, error)
    }
}

// chi tiết tin mua
exports.getDetailBuyNew = async (req, res, next) => {
    try {
        let searchitem = { _id: 1, cateID: 1, title: 1, type: 1, linkTitle: 1, userID: 1, buySell: 1, createTime: 1, img: 1, tenderFile: 1, fileContentProcedureApply: 1, contentOnline: 1, instructionFile: 1, cityProcedure: 1, districtProcedure: 1, wardProcedure: 1, name: 1, city: 1, district: 1, ward: 1, apartmentNumber: 1, description: 1, timeReceivebidding: 1, bidExpirationTime: 1, status: 1, timeNotiBiddingStart: 1, timeNotiBiddingEnd: 1, instructionContent: 1, bidFee: 1, startvalue: 1, endvalue: 1, phone: 1, email: 1, until_tu: 1, until_den: 1, until_bidFee: 1 }
        let id = req.body.id;
        let data = await New.find({ _id: id, buySell: 1 }, searchitem);
        if (!data) {
            functions.setError(res, "get data failed")
        }
        let cateID = Number(data.cateID);
        let nameCateParent = null;
        let dataCate = await CategoryRaoNhanh365.findById(cateID, { parentId: 1, name: 1 });
        let nameCate = dataCate.name;
        if (dataCate.parentId !== 0) {
            nameCateParent = await CategoryRaoNhanh365.findById(dataCate.parentId, { name: 1 })
        }
        return functions.success(res, 'get data success', { nameCate, nameCateParent, data })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// chỉnh sửa thông tin tài khoản
exports.updateInfoUserRaoNhanh = async (req, res, next) => {
    try {
        let _id = req.user.data._id;
        let { userName, email, address } = req.body;
        let avatarUser = req.body.avatarUser || null;

        if (await functions.checkEmail(email) === false) {
            return functions.setError(res, 'invalid email')
        } else {
            let check_email = await User.findById(_id);
            if (check_email !== email) {
                let check_email_lan2 = await User.find({ email });
                if (check_email_lan2.length !== 0) {
                    return functions.setError(res, "email is exits")
                }
            }
        }
        if (avatarUser) {

        }

        return functions.success(res, 'get update data user success')
    } catch (error) {
        return functions.setError(res, error)
    }
}
