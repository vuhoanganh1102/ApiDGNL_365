const functions = require('../../services/functions');
const Category = require('../../models/Raonhanh365/Category');
const New = require('../../models/Raonhanh365/UserOnSite/New')
const CategoryRaoNhanh365 = require('../../models/Raonhanh365/Category');
const User = require('../../models/Users');
// đăng tin
exports.postNewMain = async (req, res, next) => {
    try {
        let img = req.files.img;
        let video = req.files.video;
        let listImg = [];
        let nameVideo = '';
        let request = req.body,
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
            district = request.district;
        if (money) {
            if (img && img.length >= 1 && img.length <= 10) {
                let isValid = true;
                for (let i = 0; i < img.length; i++) {
                    let checkImg = await functions.checkImage(img[i].path);
                    if (checkImg) {
                        listImg.push(img[i].filename);
                    } else {
                        isValid = false;
                    }
                }
                if (isValid == false) {
                    await functions.deleteImgVideo(img, video)
                    return functions.setError(res, 'đã có ảnh sai định dạng hoặc lớn hơn 2MB', 404)
                }
            } else if (img && img.length > 6) {
                await functions.deleteImgVideo(img, video)
                return functions.setError(res, 'chỉ được đưa lên tối đa 10 ảnh', 404)
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
                        return functions.setError(res, 'video không đúng định dạng hoặc lớn hơn 100MB ', 404)
                    }
                } else
                    if (video.length > 1) {
                        await functions.deleteImgVideo(img, video)
                        return functions.setError(res, 'chỉ được đưa lên 1 video', 404)
                    }
            }
            req.info = {
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
        return functions.setError(res, err)
    }
}

// đăng tin
exports.postNewElectron = async (req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 1 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        const exists = listID.includes(req.info.cateID);
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


// lấy tin trước đăng nhập
exports.getNewBeforeLogin = async (req, res, next) => {
    try {
        let searchitem = { _id: 1, title: 1, address: 1, updateTime: 1, linkTitle: 1, image: 1, img: 1, description: 1, createTime: 1, video: 1, name: 1, phone: 1, email: 1, address: 1, district: 1, ward: 1, quantitySold: 1, totalSold: 1 }
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
        let user = await User.findOne({ _id: 5 });
        let token = await functions.createToken(user, "2d");
        token1 = 'Bear ' + token;
        console.log("🚀 ~ file: new.js:278 ~ exports.searchNews= ~ token:", token1)
        let searchItem = { _id: 1, title: 1, address: 1, updateTime: 1, linkTitle: 1, image: 1, img: 1, description: 1, createTime: 1, video: 1, name: 1, phone: 1, email: 1, address: 1, district: 1, ward: 1, quantitySold: 1, totalSold: 1 }

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
exports.createBuyNew = async (req, res, next) => {
    try {
        // lấy thông tin file từ req
        let File = req.files;
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

        // lấy id user từ req
        let userID = req.user.data._id;

        //  tạo mảng img
        let img = [];

        //  lấy giá trị id lớn nhất rồi cộng thêm 1 tạo ra id mới
        let _id = await functions.getMaxID(New) + 1;

        // lấy thời gian hiện tại
        let createTime = new Date(Date.now());

        // khai báo đây là tin mua với giá trị là 1
        let buySell = 1;

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
                else if (functions.checkPhoneNumber(phone) === false) {
                    return functions.setError(res, 'Invalid phone number');
                }
                // kiểm tra email
                else if (functions.checkEmail(email) === false) {
                    return functions.setError(res, 'Invalid email');
                }
                // kiểm tra file có tồn tại không
                else if (File && File.length !== 0) {

                    // khởi tạo vòng lặp
                    for (let i = 0; i < File.length; i++) {

                        // nếu trường gửi lên có tên Image
                        if (File[i].fieldname === 'Image') {

                            // thêm link của file vào mảng img
                            img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File[i].filename) });
                        }

                        // tương tự
                        else if (File[i].fieldname === 'tenderFile') {
                            tenderFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File[i].filename)
                            // tương tự
                        } else if (File[i].fieldname === 'fileContentProcedureApply') {
                            fileContentProcedureApply = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File[i].filename)
                            // tương tự
                        } else if (File[i].fieldname === 'instructionFile') {
                            instructionFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File[i].filename)
                        }
                    }

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
            // lưu dữ liệu vào DB
            const postNew = new New({ _id, cateID, title, linkTitle, userID, buySell, createTime, img, tenderFile, fileContentProcedureApply, contentOnline, instructionFile, cityProcedure, districtProcedure, wardProcedure, name, city, district, ward, apartmentNumber, description, timeReceivebidding, bidExpirationTime, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, phone, email, until_tu, until_den, until_bidFee });
            await postNew.save();
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
        // lấy thông tin file từ req
        let File = req.files;
        // khởi tạo các biến có thể có
        let tenderFile = null;

        let fileContentProcedureApply = null;

        let contentOnline = null;

        let instructionFile = null;

        let cityProcedure = req.body.cityProcedure || null;

        let districtProcedure = req.body.districtProcedure || null;

        let wardProcedure = req.body.wardProcedure || null;

        // khai báo và gán giá trị các biến bắt buộc 
        let {id, cateID, title, name, city, district, ward, apartmentNumber, description, bidExpirationTime, timeReceivebidding, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, until_tu, until_den, until_bidFee, phone, email } = req.body;

        // lấy id user từ req
        let userID = req.user.data._id;

        //  tạo mảng img
        let img = [];

        // lấy thời gian hiện tại
        let updateTime = new Date(Date.now());


        // kiểm tra các điều kiện bắt buộc 
        if (id && cateID && title && name && city && district && ward
            && apartmentNumber && description && timeReceivebidding
            && bidExpirationTime && status && timeNotiBiddingStart
            && timeNotiBiddingEnd && instructionContent && bidFee &&
            startvalue && endvalue && phone && email && until_tu && until_den && until_bidFee) {

            // kiểm tra tin có tồn tại không
            let data_New = await New.findById(id);
            if(!data_New){
                return functions.setError(res, 'New is not exits');
            }
            
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
                else if (functions.checkPhoneNumber(phone) === false) {
                    return functions.setError(res, 'Invalid phone number');
                }
                // kiểm tra email
                else if (functions.checkEmail(email) === false) {
                    return functions.setError(res, 'Invalid email');
                }
                // kiểm tra file có tồn tại không
                else if (File && File.length !== 0) {

                    // khởi tạo vòng lặp
                    for (let i = 0; i < File.length; i++) {

                        // nếu trường gửi lên có tên Image
                        if (File[i].fieldname === 'Image') {

                            // thêm link của file vào mảng img
                            img.push({ nameImg: functions.createLinkFileRaonhanh('avt_tindangmua', userID, File[i].filename) });
                        }

                        // tương tự
                        else if (File[i].fieldname === 'tenderFile') {
                            tenderFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File[i].filename)
                            // tương tự
                        } else if (File[i].fieldname === 'fileContentProcedureApply') {
                            fileContentProcedureApply = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File[i].filename)
                            // tương tự
                        } else if (File[i].fieldname === 'instructionFile') {
                            instructionFile = functions.createLinkFileRaonhanh('avt_tindangmua', userID, File[i].filename)
                        }
                    }

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
           
           await New.findByIdAndUpdate(id,{ title, linkTitle,updateTime, img, tenderFile, fileContentProcedureApply, contentOnline, instructionFile, cityProcedure, districtProcedure, wardProcedure, name, city, district, ward, apartmentNumber, description, timeReceivebidding, bidExpirationTime, status, timeNotiBiddingStart, timeNotiBiddingEnd, instructionContent, bidFee, startvalue, endvalue, phone, email, until_tu, until_den, until_bidFee });
        } else {
            return functions.setError(res, 'missing data', 404)
        }
        return functions.success(res, "post new success")
    } catch (error) {
        return functions.setError(res, error)
    }
}