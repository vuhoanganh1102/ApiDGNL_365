
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const linktb = require('./rao nhanh/raoNhanh')
const dotenv = require("dotenv");
dotenv.config();
const path = require('path');

 const functions = require('./functions')

exports.covert = async(checkConvert) => {
        let date = '';
        let moth = '';
        if(checkConvert.getDate() < 10 || checkConvert.getMonth() < 10) {
             date = "0" + checkConvert.getDate() 
             moth = "0" + checkConvert.getMonth()
        }
          let year = checkConvert.getFullYear()
          let newdate = year + "-" + moth + "-" + date
          return newdate
}
exports.formatDate = (dateString) =>{
    // Sử dụng phương thức `replace()` để thay thế dấu / bằng dấu -
    return new Date(dateString).toLocaleDateString('en-GB').replace(/\//g, '-');
  }

exports.getDatesFromRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const stopDate = new Date(endDate);
    while (currentDate <= stopDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
   
  }

// hàm khi thành công
exports.success = async (res, messsage = "", data = []) => {
    return res.status(200).json({ data: { result: true, message: messsage, ...data }, error: null, })
};

// hàm thực thi khi thất bại
exports.setError = async (res, message, code = 500) => {
    return res.status(code).json({ code, message })
};

exports.uploadFileVanThu = (id, file) => {
    let path = `../storage/base365/vanthu/tailieu/${id}/`;
    let filePath = `../storage/base365/vanthu/tailieu/${id}/` + file.originalFilename;

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(path, { recursive: true });
    }

    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(" luu thanh cong ");
            }
        });
    });
}
exports.createLinkFileVanthu = (id, file) => {
    let link = process.env.port_picture_qlc + `/storage/base365/vanthu/tailieu/${id}/`  + file;
    return link;
}

exports.getMaxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id + 1;
};

exports.getMaxIDQJ = async(model) => {
    const maxUser = await model.findOne({}, {}, { sort: { id: -1 } }).lean() || 0;
    return maxUser.id + 1;
};
exports.getMaxIDrose = async(model) => {
    const maxUser = await model.findOne({}, {}, { sort: { ro_id: -1 } }).lean() || 0;
    return maxUser.ro_id + 1;
};
exports.getMaxIDtp = async(model) => {
    const maxUser = await model.findOne({}, {}, { sort: { pay_id: -1 } }).lean() || 0;
    return maxUser.pay_id + 1;
};


exports.chat = async (id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, status, link, file_kem) => {
    return await axios.post('http://43.239.223.142:9000/api/V2/Notification/NotificationOfferReceive', {
        SenderID: id_user,
        ListReceive: id_user_duyet,
        CompanyId: com_id,
        Message: name_dx,
        ListFollower: id_user_theo_doi,
        Status: status,
        Link: link,
        file_kem: file_kem,
        // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link
    }).then(function (response) {
        //  console.log("name_dx: " + name_dx + "user_dx :  " + user_dx + " noi_dung: " + noi_dung + " fileKem: " + fileKem);
    })
        .catch(function (error) {
            console.log(error);
        });

}

exports.uploadFileNameRandom = async (folder, file_img) => {
    let filename = '';
    const time_created = Date.now();
    const date = new Date(time_created);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const timestamp = Math.round(date.getTime() / 1000);

    const dir = `../Storage/base365/vanthu/uploads/${folder}/${year}/${month}/${day}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    filename = `${timestamp}-tin-${file_img.originalFilename}`.replace(/,/g, '');
    const filePath = dir + filename;
    filename = filename + ',';

    fs.readFile(file_img.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return filename;
}

exports.getLinkFile = (folder, time, fileName) => {
    let date = new Date(time * 1000);
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    let link = process.env.DOMAIN_VAN_THU + `/base365/vanthu/uploads/${folder}/${y}/${m}/${d}/`;
    let res = '';

    let arrFile = fileName.split(',').slice(0, -1);
    for (let i = 0; i < arrFile.length; i++) {
        if (res == '') res = `${link}${arrFile[i]}`
        else res = `${res}, ${link}${arrFile[i]}`
    }
    return res;
}

exports.getMaxId = async (model) => {
    let maxId = await model.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
    if (maxId) {
        maxId = Number(maxId._id) + 1;
    } else maxId = 1;
    return maxId;
}

exports.sendChat = async (link, data) => {
    return await axios
        .post(link, data)
        .then(response => {
            console.log(response.data);
            // Xử lý phản hồi từ server
        })
        .catch(error => {
            console.error(error);
            // Xử lý lỗi
        });
}

exports.checkToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Missing token" });
        }
        jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            let infoUser = user.data;
            if (!infoUser || !infoUser.type || !infoUser.idQLC || !infoUser.userName || !infoUser.com_id) {
                return res.status(404).json({ message: "Token missing info!" });
            }
            req.id = infoUser.idQLC;
            req.comId = infoUser.com_id;
            req.userName = infoUser.userName;
            req.type = infoUser.type;
            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(503).json({ message: "Error from server!" });
    }

}

exports.arrAPI = () => {
    return {
        'NotificationOfferReceive': "http://43.239.223.142:9000/api/V2/Notification/NotificationOfferReceive",
        'NotificationOfferSent': "http://43.239.223.142:9000/api/V2/Notification/NotificationOfferSent",
        "NotificationReport": "http://43.239.223.142:9000/api/V2/Notification/NotificationReport",
        "SendContractFile": "http://43.239.223.142:9000/api/V2/Notification/SendContractFile"
    }
}

exports.replaceTitle = (title) => {
    // Hàm replaceTitle() là hàm tùy chỉnh của bạn để thay thế các ký tự không hợp lệ trong tiêu đề
    // Hãy thay thế nó bằng cách xử lý phù hợp với yêu cầu của bạn
    return title.replace(/[^a-zA-Z0-9]/g, '-');
};

exports.uploadfile = async (folder, file_img, time) => {
    let filename = '';
    const date = new Date(time);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const timestamp = Math.round(date.getTime() / 1000);

    const dir = `../storage/base365/vanthu/uploads/${folder}/${year}/${month}/${day}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    filename = `${timestamp}-tin-${file_img.originalFilename}`.replace(/,/g, '');
    const filePath = dir + filename;
    filename = filename + ',';
    fs.readFile(file_img.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return filename;
}
exports.deleteFile = (file) => {
    let namefile = file.replace(`${process.env.DOMAIN_VAN_THU}/base365/vanthu/uploads/`, '');
    let filePath = '../storage/base365/vanthu/uploads/' + namefile;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}

exports.convertTimestamp = (date) => {
    let time = new Date(date);
    return Math.round(time.getTime() / 1000);
}

exports.convertDate = (timestamp) => {
    return new Date(timestamp * 1000);
}

// duyệt đề xuất
exports.browseProposals = async (res,His_Handle, De_Xuat, _id,check) => {
        try {
            let timeNow = new Date();
            const maxID = await functions.getMaxID(His_Handle);
            let newID = 0;
            if (maxID) {
                newID = Number(maxID) + 1;
            }
            const createHis = new His_Handle({
                _id: newID,
                id_dx: check._id,
                type_handling: 2,
                time: timeNow
            });
            await createHis.save();
            if (check.kieu_duyet == 0) {
                await De_Xuat.findOneAndUpdate(
                    { _id: _id },
                    {
                        $set: {
                            type_duyet: 5,
                            time_duyet: timeNow
                        }
                    },
                    { new: true }
                );
                res.status(200).json({ message: 'Đã duyệt đề xuất' });
            } else {
                const historyDuyet = await His_Handle.find({ id_dx: check._id, type_handling: 2 }).sort({ id_his: 1 });
                const listDuyet = historyDuyet.map((item) => item.id_user).join(',');
                const arrDuyet = listDuyet.split(',');
                const arrDuyet1 = check.id_user_duyet.split(',');
                arrDuyet.sort();
                arrDuyet1.sort();
                if (JSON.stringify(arrDuyet) === JSON.stringify(arrDuyet1)) {
                    await De_Xuat.findOneAndUpdate(
                        { _id: _id },
                        {
                            $set: {
                                type_duyet: 5,
                                time_duyet: timeNow
                            }
                        },
                        { new: true }
                    );
                    res.status(200).json({ message: 'Đã duyệt đề xuất' });
                } else {
                    return res.status(200).json({ message: 'Không thể duyệt đề xuất' });
                }
            }
        } catch (error) {
            return functions.setError(res, error);
        }  
}

// từ chối đề xuất
exports.refuseProposal = async (res,His_Handle, De_Xuat, _id,id_ep,check) => {
    try {
        let timeNow = new Date()
        await De_Xuat.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    type_duyet: 3,
                    time_duyet: timeNow
                }
            },
            { new: true }
        );
        const createHis = new His_Handle({
            _id: await functions.getMaxID(His_Handle) + 1,
            id_dx: check._id,
            type_handling: 3,
            time: timeNow
        });
        await createHis.save();

        const deXuatInfo = await De_Xuat.findOne({ _id: _id });
        const link = `https://vanthu.timviec365.vn/chi-tiet-dx/${linktb.createLinkTilte(deXuatInfo.name_dx)}-dx${_id}.html`;
        const notificationData = {
            EmployeeId: deXuatInfo.id_user,
            SenderId: id_ep,
            CompanyId: deXuatInfo.com_id,
            Message: deXuatInfo.name_dx,
            ListFollower: `[${deXuatInfo.id_user_theo_doi}]`,
            Status: deXuatInfo.name_cate_dx,
            Link: link,
            type: 1
        };
        await axios.post('https://mess.timviec365.vn/Notification/NotificationOfferSent', notificationData);
        return res.status(200).json({ message: 'Từ chối đề xuất thành công' });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

// bắt buộc đi làm
exports.compulsoryWork = async (res,His_Handle,De_Xuat,_id,check) => {
    try {
        let timeNow = new Date();
        await De_Xuat.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    type_duyet: 6,
                    time_duyet: timeNow
                }
            },
            { new: true }
        );
        const createHis = new His_Handle({
            _id: await functions.getMaxID(His_Handle) + 1,
            id_dx: check._id,
            type_handling: 6,
            time: timeNow
        });
        await createHis.save();
        return res.status(200).json({ message: 'Bắt buộc đi làm thành công' });
    } catch (error) {
        return functions.setError(res, error)
    }
}

// duyệt chuyển tiếp
exports.forwardBrowsing = async (res,His_Handle,De_Xuat,_id,id_uct,check)=>{
    try {
        let timeNow = new Date()
        const user_td = `${check.id_user_theo_doi},${id_uct}`;
        await De_Xuat.findOneAndUpdate(
          { _id: _id },
          { id_user_duyet: id_uct, id_user_theo_doi: user_td },
          { new: true }
        );

        const createHis = new His_Handle({
          _id: await functions.getMaxID(His_Handle) + 1,
          id_dx: check._id,
          type_handling: 2,
          time: timeNow
        });
        await createHis.save();

        return res.status(200).json({ message: 'Chuyển tiếp đề xuất thành công' });
    } catch (error) {
        return functions.setError(res,error)
    }
}