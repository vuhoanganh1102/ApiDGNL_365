const Tracking = require('../../models/qlc/HisTracking');
const functions = require('../../services/functions')
const calEmp = require('../../models/qlc/CalendarWorkEmployee')
    //thêm chấm công 
exports.CreateTracking = async(req, res) => {


    const { ep_id, com_id, role, ts_image, device, ts_lat, ts_long, ts_location_name, wifi_name, wifi_ip, wifi_mac, shift_id, bluetooth_address, note, at_time, status, ts_error, is_success, dep_id } = req.body;


    if ((ep_id && com_id && role && ts_image && device && ts_lat && ts_long && ts_location_name && wifi_name && wifi_ip && wifi_mac && shift_id && bluetooth_address && note && at_time && status && ts_error && is_success) == undefined) {
        functions.setError(res, "some field required");
    } else if (isNaN(com_id)) {
        functions.setError(res, "Company id must be a number");
    } else if (isNaN(ep_id)) {
        functions.setError(res, "ep_id id must be a number");
    } else {
        let maxId = await functions.getMaxID(Tracking);
        if (!maxId) {
            maxId = 0;
        }
        const sheet_id = Number(maxId) + 1;
        const tracking = new Tracking({
            sheet_id: sheet_id,
            ep_id: ep_id,
            com_id: com_id,
            dep_id: dep_id,
            role: role,
            ts_image: ts_image,
            at_time: new Date(),
            device: device,
            ts_lat: ts_lat,
            ts_long: ts_long,
            ts_location_name: ts_location_name,
            wifi_name: wifi_name,
            wifi_ip: wifi_ip,
            wifi_mac: wifi_mac,
            shift_id: shift_id,
            status: status,
            bluetooth_address: bluetooth_address,
            ts_error: ts_error,
            is_success: is_success,
            note: note
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
        shift_id = request.shift_id
        at_time = request.at_time || true
        inputNew = request.inputNew
        inputOld = request.inputOld
        if ((com_id && shift_id) == undefined) {
            functions.setError(res, "lack of input")
        } else if (isNaN(com_id && shift_id)) {
            functions.setError(res, "id must be a Number")
        } else {
            const data = await Tracking.find({ com_id: com_id, shift_id: shift_id, at_time: { $gte: inputOld, $lte: inputNew } }).select('_id ep_id ts_image ts_location_name at_time shift_id status is_success ').skip((pageNumber - 1) * 20).limit(20).sort({ sheet_id: -1 });
            if (data) { //lấy thành công danh sách NV đã chấm công 
                //so sanh loại bỏ phan tu trung lap
                function compare(personA, personB) {
                    return personA.ep_id === personB.ep_id && personA.shift_id === personB.shift_id;
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
    at_time = req.body.at_time || true
    inputNew = req.body.inputNew || null
    inputOld = req.body.inputOld || null
    com_id = req.body.com_id;
    shift_id = req.body.shift_id
        //ta tìm danh sách lịch sử nhân viên của công ty đã chấm công   
    const data = await Tracking.find({ com_id: com_id, shift_id: shift_id, at_time: { $gte: inputOld, $lte: inputNew } }).select('_id ep_id shift_id ')
        //ta tìm danh sách nhân viên đã có lịch làm việc của công ty
    const data2 = await calEmp.find({ com_id: com_id, shift_id: shift_id, }).select('_id ep_id shift_id  ')
        //ta so sánh 2 mảng 
        // Lọc ra các phần tử không giống nhau trong cả hai mảng

    function compareObjects(obj1, obj2) {
        return JSON.stringify(obj1.ep_id) === JSON.stringify(obj2.ep_id);
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
        return personA.ep_id === personB.ep_id && personA.shift_id === personB.shift_id;
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
        let ep_id = request.ep_id 
            com_id = Number(request.com_id)
            dep_id =   Number(request.dep_id) 
            inputNew = request.inputNew 
            inputOld = request.inputOld 
        let data = [];
        let listCondition = {};

    

            if (com_id) listCondition.com_id = com_id;
            if (ep_id) listCondition.ep_id = ep_id;
            if (dep_id) listCondition.dep_id = dep_id;
            if (inputNew&&inputOld) listCondition["at_time"] = { $gte: inputOld, $lte: inputNew };
            // const data = await Tracking.find({com_id: com_id, at_time: { $gte: '2023-06-01', $lte: '2023-06-06' } }).select('_id ep_id ts_location_name at_time shift_id status  ').skip((pageNumber - 1) * 20).limit(20).sort({ at_time : -1});
            data = await Tracking.find(listCondition).select('_id ep_id ts_location_name at_time shift_id status  ').skip((pageNumber - 1) * 20).limit(20).sort({ sheet_id: -1 });
            console.log(data)
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);


    } catch (err) {
        functions.setError(res, err.message);
    };


}