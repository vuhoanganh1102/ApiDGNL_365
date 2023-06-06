const Tracking = require('../../models/qlc/HisTracking');
const functions = require('../../services/functions')

//thêm chấm công 
exports.CreateTracking = async (req,res)=>{
    // const idQLC = req.body.idQLC;
    // const companyID = req.body.companyID;
    // const role = req.body.role;
    // const imageTrack = req.body.imageTrack;
    // const curDeviceName = req.body.curDeviceName;
    // const latitude = req.body.latitude;
    // const longtitude = req.body.longtitude;
    // const Location = req.body.Location;
    // const NameWifi = req.body.NameWifi;
    // const IpWifi = req.body.IpWifi;
    // const MacWifi = req.body.MacWifi;
    // const shiftID = req.body.shiftID;
    // const BluetoothAdrr = req.body.BluetoothAdrr;
    // // const Err = req.body.Err;
    // // const Success = req.body.Success;
    // const Note = req.body.Note;

    const {idQLC, companyID, role,imageTrack,curDeviceName,latitude,longtitude,Location,NameWifi,IpWifi,MacWifi,shiftID ,BluetoothAdrr,Note,CreateAt,status,Err,Success,depID } = req.body;


    if ((idQLC &&  companyID &&  role && imageTrack && curDeviceName && latitude && longtitude && Location && NameWifi && IpWifi && MacWifi && shiftID  && BluetoothAdrr && Note && CreateAt && status && Err && Success)== undefined) {
        functions.setError(res, "some field required");
    }else if (isNaN(companyID)) {
        functions.setError(res, "Company id must be a number");
    }else if (isNaN(idQLC)) {
        functions.setError(res, "idQLC id must be a number");
    }else {
        let maxId = await functions.getMaxID(Tracking);
        if (!maxId) {
            maxId = 0;
        }
        const _id =Number(maxId) + 1;
        const tracking = new Tracking({
            _id : _id,
            idQLC: idQLC,
            companyID: companyID,
            depID: depID,
            role: role,
            imageTrack: imageTrack,
            CreateAt: new Date(),
            curDeviceName: curDeviceName,
            latitude: latitude ,
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
            .then(()=>{
                functions.success(res,"Tracking successful",tracking)
            })
            .catch(err =>{
                functions.setError(res,err.message)
            })
    }
};
// Set current date TimeStamp, eg: '1666512804163'
// TimeStamp: new Date().getTime().toString()

// Display saved TimeStamp, eg: '23/10/2022'
// new Date(parseInt(TimeStamp)).toLocaleDateString()

exports.getListUserTrackingSuccess = async (req,res)=>{


    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let companyID = request.companyID,
            Success = request.Success || true
        if((companyID && Success)==undefined){
            functions.setError(res,"lack of input")
        }else if(isNaN(companyID)){
            functions.setError(res,"id must be a Number")
        }else{
            const data = await Tracking.find({companyID: companyID, Success : Success}).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ _id : -1});
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data }, {pageNumber});
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
   

    } catch (err) {
        functions.setError(res, err.message);
    };


};

exports.getListUserTrackingFalse = async (req,res)=>{


    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let companyID = request.companyID,
            Err = request.Err || true
        if((companyID && Err)==undefined){
            functions.setError(res,"lack of input")
        }else if(isNaN(companyID)){
            functions.setError(res,"id must be a Number")
        }else{
            const data = await Tracking.find({companyID: companyID, Err : Err}).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ _id : -1});
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
   

    } catch (err) {
        functions.setError(res, err.message);
    };


}

exports.getTrackingtime = async (req,res)=>{


    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let companyID = request.companyID,
            CreateAt = request.CreateAt || true
            inputNew = request.inputNew 
            inputOld = request.inputOld



        if((companyID && CreateAt && inputNew && inputOld )==undefined){
            functions.setError(res,"lack of input")
        }else if(isNaN(companyID)){
            functions.setError(res,"id must be a Number")
        }else{
            // const data = await Tracking.find({companyID: companyID, CreateAt: { $gte: '2023-06-01', $lte: '2023-06-06' } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
            const data = await Tracking.find({companyID: companyID, CreateAt: { $gte: inputOld , $lte: inputNew } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
   

    } catch (err) {
        functions.setError(res, err.message);
    };


}
exports.getTrackingALLCondition = async (req,res)=>{


    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let idQLC = request.idQLC || true
            companyID = request.companyID,
            depID = request.depID || true
            CreateAt = request.CreateAt || true
            inputNew = request.inputNew || null
            inputOld = request.inputOld || null



        if((companyID && CreateAt  )==undefined){
            functions.setError(res,"lack of input")
        }else if(isNaN(companyID)){
            functions.setError(res,"id must be a Number")
        }else{
            // const data = await Tracking.find({companyID: companyID, CreateAt: { $gte: '2023-06-01', $lte: '2023-06-06' } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
            const data = await Tracking.find({companyID: companyID,idQLC : idQLC ,depID:depID, CreateAt: { $gte: inputOld , $lte: inputNew } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
   

    } catch (err) {
        functions.setError(res, err.message);
    };

 
}
exports.getTrackingALLConNotTime = async (req,res)=>{


    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let idQLC = request.idQLC || true
            companyID = request.companyID,
            depID = request.depID || true




        if((companyID && CreateAt  )==undefined){
            functions.setError(res,"lack of input")
        }else if(isNaN(companyID)){
            functions.setError(res,"id must be a Number")
        }else{
            // const data = await Tracking.find({companyID: companyID, CreateAt: { $gte: '2023-06-01', $lte: '2023-06-06' } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
            const data = await Tracking.find({companyID: companyID,idQLC : idQLC ,depID:depID }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ _id : -1});
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
   

    } catch (err) {
        functions.setError(res, err.message);
    };

 
}

