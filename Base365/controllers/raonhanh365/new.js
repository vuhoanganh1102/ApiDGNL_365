const functions = require('../../services/functions');
const Category = require('../../models/Raonhanh365/Category');
const New = require('../../models/Raonhanh365/UserOnSite/New')
const CategoryRaoNhanh365 = require('../../models/Raonhanh365/Category');
    // đăng tin
exports.postNewMain = async(req, res, next) => {
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
            district = request.district,
            buySell = request.buySell,
            producType = request.producType;
        let fields = [userID, cateID, title, money, until, description, free, poster, name, email, address, phone, status, detailCategory];
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
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
                video: nameVideo
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
                kvCity: request.kvCity,
                kvDistrict: request.kvDistrict,
                kvWard: request.kvWard,
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

            //
            fields.createTime = new Date(Date.now());
            fields.electroniceDevice = fieldsElectroniceDevice;
            fields.vehicle = fieldsVehicle;
            fields.fieldsRealEstate = fieldsRealEstate;
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

// đăng tin xe co
exports.postNewVehicle = async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 2 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let subFields = {
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
            
            fields.createTime = new Date(Date.now());
            fields.vehicle = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news vihicle success!");
        }else {
            return functions.setError(res, "Category vihicle not found!", 505); 
        }

    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}


// đăng tin nha dat
exports.postNewRealEstate = async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 3 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let request = req.body;
            let subFields = {
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
                kvCity: request.kvCity,
                kvDistrict: request.kvDistrict,
                kvWard: request.kvWard,
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
            fields.createTime = new Date(Date.now());
            fields.realEstate = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news realEstate success");
        }
        return functions.setError(res, "Category realEstate not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin ship
exports.postNewShip= async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 4 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let request = req.body;
            let subFields = {
                product: request.product,
                timeStart: Date(request.timeStart),
                timeEnd: Date(request.timeEnd),
                allDay: request.allDay,
                vehicloType: request.vehicloType
            };
            let kvShip = {
                kvCity: request.kvCity,
                kvDistrict: request.kvDistrict
            }
            fields.createTime = new Date(Date.now());
            fields.ship = subFields;
            fields.realEstate = kvShip; // them ke dia chi ship vao truong realEstate
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news ship success");
        }
        return functions.setError(res, "Category ship not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin dich vu - giai tri
exports.postNewEntertainmentService= async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 13 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let subFields = {
                brand: req.body.brand
            };
            fields.createTime = new Date(Date.now());
            fields.entertainmentService = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news Entertainment Service success");
        }
        return functions.setError(res, "Category Entertainment Servicee not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}


// đăng tin the thao
exports.postNewSport= async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 75 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let subFields = {
                sport: req.body.sport,
                typeSport: req.body.typeSport
            };
            fields.createTime = new Date(Date.now());
            fields.sports = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news sport success");
        }
        return functions.setError(res, "Category sport not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin do gia dung
exports.postNewHouseWare= async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 21 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            
            let subFields = {
                typeDevice: req.body.typeDevice,
                typeProduct: req.body.typeProduct,
                guarantee: req.body.guarantee,
            };
            fields.createTime = new Date(Date.now());
            fields.houseWare = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news house ware success");
        }
        return functions.setError(res, "Category house ware not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin suc khoe sac dep
exports.postNewHealth= async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 22 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let subFields = {
                typeProduct: req.body.typeProduct,
                kindCosmetics: req.body.kindCosmetics,
                expiry: Date(req.body.expiry),
                brand: req.body.brand
            };
            fields.createTime = new Date(Date.now());
            fields.houseWare = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news health success");
        }
        return functions.setError(res, "Category health not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin tim viec
exports.postNewJob= async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 119 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let subFields = {
                jobType: req.body.jobType,
                jobKind: req.body.jobKind,
                minAge: req.body.minAge,
                exp: req.body.exp,
                level: req.body.level,
                skill: req.body.skill,
                quantity: req.body.quantity,
                city: req.body.city,
                district: req.body.district,
                ward: req.body.ward,
                addressNumber: req.body.addressNumber,
                payBy: req.body.payBy,
                benefit: req.body.benefit,
                jobDetail: req.body.jobDetail,
                salary: req.body.salary,
                gender: req.body.gender,
                degree: req.body.degree,
            };
            fields.createTime = new Date(Date.now());
            fields.Job = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news job success");
        }
        return functions.setError(res, "Category job not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin do an do uong
exports.postNewFood= async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 93 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let subFields = {
                typeFood: req.body.typeFood,
                expiry: req.body.expiry,
            };
            fields.createTime = new Date(Date.now());
            fields.food = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news food success");
        }
        return functions.setError(res, "Category food not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// đăng tin do an do uong
exports.postNewPet= async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 51 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let subFields = {
                kindOfPet: req.body.kindOfPet,
                age: req.body.age,
                gender: req.body.gender,
                weigth: req.body.weigth,
            };
            fields.createTime = new Date(Date.now());
            fields.pet = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news pet success");
        }
        return functions.setError(res, "Category pet not found!", 505);
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
    // tìm kiếm tin 
exports.searchNews = async(req, res, next) => {
        try {
            // tạo mảng
            let output = [];
            // trường hợp không nhập gì mà tìm kiếm
            if (!req.body.key || req.body.key === undefined) {
                let data = await New.find({}).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50);
                for (let i = 0; i < data.length; i++) {
                    // thêm tin vào mảng 
                    output.push(data[i])
                }
            } else {
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
                        let data = await New.find({ cateID: data_search[0]._id }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50);
                        if (data) {
                            for (let i = 0; i < data.length; i++) {
                                output.push(data[i])
                            }
                        } else {
                            // lấy data với tên của sản phẩm
                            let data = await New.find({ name: regex }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50);
                            for (let i = 0; i < data.length; i++) {
                                output.push(data[i])
                            }
                        }
                    }

                } else {
                    // tìm kiếm tin với id của danh mục đã tìm được
                    let data = await New.find({ cateID: query[0]._id }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50);
                    // đẩy dữ liệu vào mảng
                    if (data) {
                        for (let i = 0; i < data.length; i++) {
                            output.push(data[i])
                        }
                    } else {
                        return functions.setError(res, "get data failed")
                    }
                }

            }
            return functions.success(res, "get data success", { output })
        } catch (error) {
            return functions.setError(res, error)
        }
    }


exports.deleteAllNews = async (req, res) => {

    if (!await functions.getMaxID(New)) {
        functions.setError(res, "No deparment existed", 513);
    } else {
        New.deleteMany()
            .then(() => functions.success(res, "Delete all news successfully"))
            .catch(err => functions.setError(res, err.message, 514));
    }

};