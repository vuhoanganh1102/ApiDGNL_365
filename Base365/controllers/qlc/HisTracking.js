const Tracking = require('../../models/qlc/HisTracking');
const functions = require('../../services/functions')
const calEmp = require('../../models/qlc/CalendarWorkEmployee')
    //thêm chấm công 
exports.CreateTracking = async(req, res) => {


    const { idQLC, com_id, role, imageTrack, curDeviceName, latitude, longtitude, Location, NameWifi, IpWifi, MacWifi, shiftID, BluetoothAdrr, Note, CreateAt, status, Err, Success, dep_id } = req.body;


    if ((idQLC && com_id && role && imageTrack && curDeviceName && latitude && longtitude && Location && NameWifi && IpWifi && MacWifi && shiftID && BluetoothAdrr && Note && CreateAt && status && Err && Success) == undefined) {
        functions.setError(res, "some field required");
    } else if (isNaN(com_id)) {
        functions.setError(res, "Company id must be a number");
    } else if (isNaN(idQLC)) {
        functions.setError(res, "idQLC id must be a number");
    } else {
        let maxId = await functions.getMaxID(Tracking);
        if (!maxId) {
            maxId = 0;
        }
        const _id = Number(maxId) + 1;
        const tracking = new Tracking({
            _id: _id,
            idQLC: idQLC,
            com_id: com_id,
            dep_id: dep_id,
            role: role,
            imageTrack: imageTrack,
            CreateAt: new Date(),
            curDeviceName: curDeviceName,
            latitude: latitude,
            longtitude: longtitude,
            Location: Location,
            NameWifi: NameWifi,
            IpWifi: IpWifi,
            MacWifi: MacWifi,
            shiftID: shiftID,
            status: status,
            BluetoothAdrr: BluetoothAdrr,
            Err: Err,
            Success: Success,
            Note: Note


        });
        await tracking.save()
            .then(() => {
                functions.success(res, "Tracking successful", {tracking})
            })
            .catch(err => {
                functions.setError(res, err.message)
            })
    }
};
// Set current date TimeStamp, eg: '1666512804163'
// TimeStamp: new Date().getTime().toString()

// Display saved TimeStamp, eg: '23/10/2022'
// new Date(parseInt(TimeStamp)).toLocaleDateString()

exports.getListUserTrackingSuccess = async(req, res) => {


    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let com_id = request.com_id
        shiftID = request.shiftID
        CreateAt = request.CreateAt || true
        inputNew = request.inputNew
        inputOld = request.inputOld
        if ((com_id && shiftID) == undefined) {
            functions.setError(res, "lack of input")
        } else if (isNaN(com_id && shiftID)) {
            functions.setError(res, "id must be a Number")
        } else {
            const data = await Tracking.find({ com_id: com_id, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } }).select('_id idQLC imageTrack Location CreateAt shiftID status Success ').skip((pageNumber - 1) * 20).limit(20).sort({ _id: -1 });
            if (data) { //lấy thành công danh sách NV đã chấm công 
                //so sanh loại bỏ phan tu trung lap
                function compare(personA, personB) {
                    return personA.idQLC === personB.idQLC && personA.shiftID === personB.shiftID;
                }

                let newData = functions.arrfil(data, compare);


                return await functions.success(res, 'Lấy thành công', { newData });
            }
            return functions.setError(res, 'Không có dữ liệu', 404);
        }


    } catch (err) {
        functions.setError(res, err.message);
    };


};

exports.getlistUserNoneHistoryOfTracking = async(req, res) => {


    const pageNumber = req.body.pageNumber || 1;
    CreateAt = req.body.CreateAt || true
    inputNew = req.body.inputNew || null
    inputOld = req.body.inputOld || null
    com_id = req.body.com_id;
    shiftID = req.body.shiftID
        //ta tìm danh sách lịch sử nhân viên của công ty đã chấm công   
    const data = await Tracking.find({ com_id: com_id, shiftID: shiftID, CreateAt: { $gte: inputOld, $lte: inputNew } }).select('_id idQLC shiftID ')
        //ta tìm danh sách nhân viên đã có lịch làm việc của công ty
    const data2 = await calEmp.find({ com_id: com_id, shiftID: shiftID, }).select('_id idQLC shiftID  ')
        //ta so sánh 2 mảng 
        // Lọc ra các phần tử không giống nhau trong cả hai mảng

    function compareObjects(obj1, obj2) {
        return JSON.stringify(obj1.idQLC) === JSON.stringify(obj2.idQLC);
    }

    function removeSimilarElements(data, data2) {
        const newArray = data.filter(
            (item1) => !data2.some((item2) => compareObjects(item1, item2))
        );

        return newArray.concat(
            data2.filter(
                (item2) => !data.some((item1) => compareObjects(item1, item2))
            )
        );
    }
    const ketQua = removeSimilarElements(data, data2);
    //LỌC PHẦN TỬ LẶP LẠI 
    function compare(personA, personB) {
        return personA.idQLC === personB.idQLC && personA.shiftID === personB.shiftID;
    }

    let newData = functions.arrfil(ketQua, compare);

    const pageSize = 20;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const results = newData.slice(startIndex, endIndex);

    if (newData) { //lấy thành công danh sách NV 
        return await functions.success(res, 'Lấy thành công', { results, pageNumber });
    }
    return functions.setError(res, 'Không có dữ liệu', 404);
}


exports.getlist = async(req, res) => {


    try {
        // const com_id = req.user.data.com_id
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let idQLC = request.idQLC 
            com_id = Number(request.com_id)
            dep_id =   Number(request.dep_id) 
            inputNew = request.inputNew 
            inputOld = request.inputOld 
        let data = [];
        let listCondition = {};

    

            if (com_id) listCondition.com_id = com_id;
            if (idQLC) listCondition.idQLC = idQLC;
            if (dep_id) listCondition.dep_id = dep_id;
            if (inputNew&&inputOld) listCondition["CreateAt"] = { $gte: inputOld, $lte: inputNew };
            // const data = await Tracking.find({com_id: com_id, CreateAt: { $gte: '2023-06-01', $lte: '2023-06-06' } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
            data = await Tracking.find(listCondition).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ _id: -1 });
            console.log(data)
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);


    } catch (err) {
        functions.setError(res, err.message);
    };


}