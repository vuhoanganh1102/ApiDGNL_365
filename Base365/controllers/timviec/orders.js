const Users = require("../../models/Users");
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');
const PriceList = require("../../models/Timviec365/PriceList/PriceList");
const Order = require("../../models/Timviec365/Order");
const OrderDetails = require("../../models/Timviec365/OrderDetails");

const random = (from, to) => {
    return Math.floor(Math.random()*(to-from)) + from;
}

// danh sách các loại chi tiết dịch vụ crm
const listServiceCRM = (id)=>{
    let arr = [
        {
            time: 2, // thời lượng(1:tháng, 2: tuần)
            city: 0, // tỉnh thành(0: chính, 1: khác)
            cate: 0, // ngành nghề(0: chính, 1: khác)
            price: 5000000 // Đơn giá
        },
        {
            time: 1,
            city: 0,
            cate: 0,
            price: 15000000
        },
        {
            time: 2,
            city: 1,
            cate: 0,
            price: 2000000
        },
        {
            time: 1,
            city: 1,
            cate: 0,
            price: 6000000
        },
        {
            time: 2,
            city: 0,
            cate: 1,
            price: 3500000
        },
        {
            time: 1,
            city: 0,
            cate: 1,
            price: 10500000
        },
        {
            time: 2,
            city: 1,
            cate: 1,
            price: 1400000
        },
        {
            time: 1,
            city: 1,
            cate: 1,
            price: 4200000
        }
    ];
    if (id > 0 && id <= 8) {
        return arr[id-1];
    } else {
        return arr;
    }
}


// Gửi thông báo vào nhóm thanh toán đơn hàng
const sendMessageToGroupOrder = async (message) =>{
    try{
        let dataGroup = { 
            ConversationID: '806102', // id nhóm thanh toán đơn hàng
            SenderID: '1192',
            MessageType: 'text',
            Message: message
        };
        const sendGroup = await axios.post('http://43.239.223.142:9009/api/message/SendMessage', dataGroup);
        return true;
    }
    catch(e){
       console.log('error SendMessageToGroupOrder', e);
       return false; 
    }
}


// Gửi tin nhắn từ tài khoản công ty Hưng hà đến người nhận là id quản lý chung
const sendMessageToIdQlc = async (message, ContactId) =>{
    try{
        let data = { 
            ContactId: ContactId,
            SenderID: '1192',
            MessageType: 'text',
            Message: message
        };
        const send = await axios.post('http://210.245.108.202:9000/api/message/SendMessage_v2', data);
        return true;
    }
    catch(e){
       console.log('error sendMessageToIdQlc', e);
       return false; 
    }
}

// gửi thông tin đơn hàng vào chat365 cho chuyên viên và nhóm thanh toán hóa đơn
const sendMessageToSupporter = async (adm_qlc, code_order, name, phone, adm_name, final_price) =>{
    try{
         let message = `Thông tin đơn hàng \n
             - Tên khách hàng: ${name} \n - Số điện thoại: ${phone} \n - Chuyên viên chăm sóc: ${adm_name} \n
             - Mã đơn hàng: ${code_order} \n - Tổng tiền thanh toán: ${final_price.toLocaleString('vi-VN')} vnđ`;
         sendMessageToIdQlc(message, adm_qlc);
         sendMessageToGroupOrder(message);
         return true;
    }
    catch(e){
        console.log('error sendMessageToSupporter');
        return false; 
    }
 }
 

const renderServiceDetailCRM = (id_service, type_service)=>{
    let info = listServiceCRM(id_service);
    let time_service_crm = '1 ' + ((info.time==1) ? 'THÁNG' : 'TUẦN');
    let name_service_crm = ((info.cate==0) ? 'NGÀNH NGHỀ CHÍNH' : 'NGÀNH NGHỀ KHÁC') + ' + ' + ((info.city==0) ? 'HÀ NỘI/HỒ CHÍ MINH' : 'TỈNH THÀNH KHÁC');
    let info_service_crm = {
        bg_id: id_service,
        bg_tuan: time_service_crm + ' - ' + name_service_crm,
        bg_gia: info.price,
        bg_chiet_khau: 0,
        bg_thanh_tien: info.price,
        bg_vat: info.price + ((info.price*10)/100),
        bg_type: type_service
    };
    return info_service_crm;
}

// xử lý mua hàng
const handleOrderProduct = async (id_user,type_user,name,phone,email,adm_id,count,price,chiet_khau,discount_vip,discount_fee,vat_fee,final_price,list_product,point_use) =>{
    try{
        let checkUser = await Users.findOne({idTimViec365: id_user, type: type_user});
        if(checkUser){
            
            let adminUser = await AdminUser.findOne({ adm_bophan: adm_id }).lean();
            if(adminUser){
                let time = functions.getTimeNow()
                let arr_product = list_product;
                // let str_lst_product = arr_product.map(item => item.id_service);
                let arr_id_service = [];
                let arr_id_service_crm = [];
                for(let i = 0; i < arr_product.length; i++){
                    if (arr_product[i].type_service != 7) {
                        arr_id_service.push(arr_product[i].id_service);
                    } else {
                        arr_id_service_crm.push(arr_product[i].id_service);
                    }
                }
                let list_service = await PriceList.find({bg_id: {$in: arr_id_service}});
                if ((list_service && list_service.length > 0) || arr_id_service_crm.length > 0) {
                    let code_order = 'A' + random(1, 1000000);
                    let id = 0;
                    let latestOrder = await Order.findOne().sort({id: -1}).lean();
                    if (latestOrder) id = latestOrder.id + 1;
                    let savedOrder = await (new Order({
                        id: id,
                        code_order: code_order,
                        admin_id: adm_id,
                        id_user: id_user,
                        type_user: type_user,
                        name: name,
                        phone: phone,
                        email: email,
                        count: count,
                        price: price,
                        chiet_khau: chiet_khau,
                        discount_vip: discount_vip,
                        discount_fee: discount_fee,
                        vat_fee: vat_fee,
                        final_price: final_price,
                        create_time: time,
                    })).save()
                    let id_order = savedOrder.id;
                    let detail_id = 0;
                    let latestOrderDetails = await OrderDetails.findOne().sort({id: -1}).lean();
                    if (latestOrderDetails) detail_id = latestOrder.id + 1;
                    let promises = [];
                    for(let i = 0; i < arr_product.length; i++){
                        let serviceDetail;
                        let product = arr_product[i];
                        if (product.type_service != 7) {
                            serviceDetail = await PriceList.findOne({
                                bg_id: product.id_service
                            });
                        } else {
                            serviceDetail = renderServiceDetailCRM(product.id_service, product.type_service);
                        }
                        if (product.type_service == 2) {
                            product.new_id = 0;
                        }
                        promises.push((new OrderDetails({
                            id: detail_id,
                            order_id: id_order,
                            product_id: product.id_service,
                            product_type: product.type_service,
                            price: serviceDetail.bg_gia,
                            chiet_khau: serviceDetail.bg_chiet_khau,
                            price_chiet_khau: serviceDetail.bg_thanh_tien,
                            new_id: product.new_id,
                            count_product: product.count,
                            created_at: time,
                        })).save());
                        detail_id++;
                    }
                    /**
                     * Thêm detail có id lớn nhất trước để giữ chỗ cho các bản ghi có id nhỏ hơn,
                     * tránh trường hợp ghi trùng id
                     */
                    await promises.pop();
                    await Promise.all(promises);
                    

                    // lưu dữ liệu sử dụng điểm khuyến mại 
                    // if (point_use > 0) {
                    //     await  HandleQuery(`INSERT INTO history_point_promotion
                    //     (userId, userType, order_id , point , time) VALUES 
                    //     (${id_user},${type_user},'${id_order}',${point_use},${time})`);
                    // }

                    // sendMessageToSupporter(adminUser.emp_id, code_order, name, phone, adminUser.adm_name, final_price);
                    
                    // gửi tin nhắn sang chat
                    // let detail = await Users.findOne()
                    // // let detail = await HandleQuery(`SELECT chat365_id FROM user_company WHERE usc_id = ${id_user}`);
                    // // // if(detail && detail.length){
                    //     // lưu ảnh đơn hàng ,lưu pdf  //https://timviec365.vn/mua-hang/hoa-don-mua-hang-o61
                    //     const browser = await puppeteer.launch({
                    //         headless: 'chrome',
                    //         args: ["--no-sandbox", "--disabled-setupid-sandbox", "--font-render-hinting=none", '--force-color-profile=srgb', '--disable-web-security']
                    //     });
                    //     let namepdf = `/usr/local/nginx/public_html/chat/api/pdforder/order_${Number(id_order)}.pdf`;
                    //     let nameimg = `/usr/local/nginx/public_html/chat/api/imageorder/order_${Number(id_order)}.png`;
                    //     const page = await browser.newPage();
                    //     const session = await page.target().createCDPSession();
                    //     await session.send('DOM.enable');
                    //     await session.send('CSS.enable');
                    //     session.on('CSS.fontsUpdated', event => {
                    //         // console.log(event);
                    //     });
                    //     const website_url = `https://timviec365.vn/mua-hang/hoa-don-mua-hang-o${id_order}`;
                    //     await page.goto(website_url, { waitUntil: 'networkidle2' });
                    //     await page.emulateMediaType('screen');
                    //     await page.evaluateHandle('document.fonts.ready');
                    //     await page.pdf({
                    //         path: namepdf,
                    //         margin: { top: '50px', right: '0px', bottom: '0px', left: '0px' },
                    //         printBackground: true,
                    //     });
                    //     const height = await page.evaluate(docHeight);
                    //     await page.screenshot({
                    //         path: nameimg,
                    //         height: `${height}px`,
                    //         fullPage: true,
                    //         margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
                    //     });
                    //     await axios({
                    //         method: "post",
                    //         url: "http://43.239.223.142:9009/api/message/SendMessageCv",
                    //         data: {
                    //             senderId: 1192,
                    //             userId: detail[0].chat365_id,
                    //             linkImg:`https://timviec365.vn/chat/api/imageorder/order_${id_order}.png`,
                    //             linkPdf:`https://timviec365.vn/chat/api/pdforder/order_${id_order}.pdf`
                    //         },
                    //         headers: { "Content-Type": "multipart/form-data" }
                    //     });

                    //     // cập nhật link pdf vào đơn hàng
                    //     let linkpdf = `https://timviec365.vn/chat/api/pdforder/order_${id_order}.pdf`;
                    //     await HandleQuery(`UPDATE orders SET bill_pdf='${linkpdf}' WHERE id = ${id_order}`);
                    // }
                    // else{
                    //     console.log("Nhà tuyển dụng không có id chat")
                    // }
                   
                    return true;
                } else{
                    return false;
                }
            } else{
                console.log('error check admin handleOrderProduct')
                return false;
            }
        } else{
            console.log('error check exist user handleOrderProduct')
            return false;
        }
    } catch(e){
        console.log("Error handleOrderProduct",e);
        return false;
    }
}

// api mua hàng
exports.orderProduct = async (req, res, next) => {
    try{
        if(req.body.id_user && req.body.adm_id && req.body.count && req.body.list_product){ 
            const id_user = Number(req.body.id_user); // id KH
            const type_user = Number(req.body.type_user) || 1; // type KH
            const name = String(req.body.name) || ''; // tên KH
            const phone = String(req.body.phone) || ''; // SDT KH
            const email = String(req.body.email) || ''; // email KH
            const adm_id = Number(req.body.adm_id); // id chuyên viên
            const count = Number(req.body.count); // tổng số lượng các sản phẩm đơn hàng
            const price = Number(req.body.price); // giá tổng tiền gốc các sp 
            const chiet_khau = Number(req.body.chiet_khau) || 0; // tổng chiết khấu các sản phẩm
            const discount_vip = Number(req.body.discount_vip) || 0; // tiền khuyến mại vip
            const discount_fee = Number(req.body.discount_fee) || 0; // tiền khuyến mại 
            const vat_fee = Number(req.body.vat_fee) || 10; // phí VAT
            let final_price = Number(req.body.final_price); // tổng số tiền cuối cùng các sp trong đơn hàng
            const list_product = req.body.list_product; // chuỗi json ds sản phẩm

            const point_use = Number(req.body.point_use) || 0;// điểm sử dụng điểm khuyến mãi 

            // let final_price = ( price_per_product * count - discount_fee ) * (100 + vat_fee) / 100;

            await handleOrderProduct(id_user,type_user,name,phone,email,adm_id,count,price,chiet_khau,discount_vip,discount_fee,vat_fee,final_price,list_product,point_use);
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// xử lý chuyên viên hủy đơn hàng
const handleSupporterCancelOrder = async (order_id)=>{
    try{
        let checkOrder = await HandleQuery(`SELECT id, code_order, id_user, type_user FROM orders WHERE id = ${order_id} LIMIT 1`);
        if(checkOrder && checkOrder.length){
            await HandleQuery(`UPDATE orders SET status = 4 WHERE id = ${order_id}`);
            let message = `Thông báo \n Đơn hàng với mã ${checkOrder[0].code_order} đã bị hủy bởi chuyên viên chăm sóc.`;
            SendMessageToGroupOrder(message);
            if (checkOrder[0].type_user == 1) {
                let infoCus = await HandleQuery(`SELECT chat365_id FROM user_company WHERE usc_id = ${checkOrder[0].id_user} LIMIT 1`);
                SendMessageToIdChat(message, infoCus[0].chat365_id);
            }
            return true;
       } else{
           return false;
       }
    } catch(e){
        console.log('handleSupporterCancelOrder',e);
        return false;
    }
}

// api chuyên viên hủy đơn hàng
const SupporterCancelOrder = async (req, res, next) => {
    try{
        if(req.body.order_id){ 
            const order_id = Number(req.body.order_id); 

            handleSupporterCancelOrder(order_id);
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// xử lý chuyên viên duyệt đơn hàng
const handleSupporterAcceptOrder = async (order_id,money_received,money_bonus,money_real_received)=>{
    try{
        let checkOrder = await HandleQuery(`SELECT id, code_order, id_user, type_user FROM orders WHERE id = ${order_id} LIMIT 1`);
        if(checkOrder && checkOrder.length){
            let time = new Date().getTime()/1000;
            await HandleQuery(`UPDATE orders SET admin_accept = 1, status = 0, accept_time_1 = ${time}, money_received = ${money_received}, money_bonus = ${money_bonus}, money_real_received = ${money_real_received} WHERE id = ${order_id}`);
            let message = `Thông báo \n Đơn hàng với mã ${checkOrder[0].code_order} đã được duyệt bởi chuyên viên chăm sóc, hãy chờ để được tổng đài hỗ trợ hoàn thành đơn hàng.`;
            SendMessageToGroupOrder(message);
            if (checkOrder[0].type_user == 1) {
                let infoCus = await HandleQuery(`SELECT chat365_id FROM user_company WHERE usc_id = ${checkOrder[0].id_user} LIMIT 1`);
                SendMessageToIdChat(message, infoCus[0].chat365_id);
            }
            return true;
       } else{
           return false;
       }
    } catch(e){
        console.log('handleSupporterAcceptOrder',e);
        return false;
    }
}

// api chuyên viên duyệt đơn hàng = gửi đề xuất đơn hàng đến tổng đài
const SupporterAcceptOrder = async (req, res, next) => {
    try{
        if(req.body.order_id){ 
            const order_id = Number(req.body.order_id); 
            const money_received = Number(req.body.money_received); 
            const money_bonus = Number(req.body.money_bonus); 
            const money_real_received = Number(req.body.money_real_received); 

            handleSupporterAcceptOrder(order_id,money_received,money_bonus,money_real_received);
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// xử lý trực hủy đơn hàng
const handleAdminCancelOrder = async (order_id,admin_id)=>{
    try{
        let checkAdmin = await HandleQuery(`SELECT adm_id FROM  admin_user WHERE adm_id = ${admin_id} LIMIT 1`);
        let checkOrder = await HandleQuery(`SELECT id, code_order, id_user, type_user, admin_id FROM orders WHERE id = ${order_id} LIMIT 1`);
        if(checkAdmin && checkAdmin.length && checkOrder && checkOrder.length){
            if (admin_id == 4) {
                await HandleQuery(`UPDATE orders SET status = 4, admin_accept = 3 WHERE id = ${order_id}`);
                let message = `Thông báo \n Đơn hàng với mã ${checkOrder[0].code_order} đã bị từ chối bởi tổng đài hỗ trợ.`;
                SendMessageToGroupOrder(message);
                if (checkOrder[0].type_user == 1) {
                    let infoCus = await HandleQuery(`SELECT chat365_id FROM user_company WHERE usc_id = ${checkOrder[0].id_user} LIMIT 1`);
                    SendMessageToIdChat(message, infoCus[0].chat365_id);
                }
                let infoSupporter = await HandleQuery(`SELECT emp_id FROM  admin_user WHERE adm_bophan = ${checkOrder[0].admin_id} LIMIT 1`);
                if (infoSupporter && infoSupporter.length) {
                    SendMessageToIdQlc(message, infoSupporter[0].emp_id);
                }
            }
            return true;
        } else{
            return false;
        }
    } catch(e){
        console.log('handleAdminCancelOrder',e);
        return false;
    }
}

// api trực hủy đơn hàng
const AdminCancelOrder = async (req, res, next) => {
    try{
        if(req.body.order_id && req.body.admin_id){ 
            const order_id = Number(req.body.order_id); 
            const admin_id = Number(req.body.admin_id); 

            handleAdminCancelOrder(order_id,admin_id);
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

function uniqueArray(a, fn) {
    if (a.length === 0 || a.length === 1) {
        return a;
    }
    if (!fn) {
        return a;
    }
    for (let i = 0; i < a.length; i++) {
        for (let j = i + 1; j < a.length; j++) {
            if (fn(a[i], a[j])) {
                a.splice(i, 1);
            }
        }
    }
    return a;
}

// xử lý trực duyệt đơn hàng
const handleAdminAcceptOrder = async (order_id,admin_id)=>{
    try{
        let checkAdmin = await HandleQuery(`SELECT adm_id FROM  admin_user WHERE adm_id = ${admin_id} LIMIT 1`);
        let checkOrder = await HandleQuery(`SELECT id, code_order, id_user, type_user, admin_id, final_price, money_bonus FROM orders WHERE id = ${order_id} LIMIT 1`);
        if(checkAdmin && checkAdmin.length && checkOrder && checkOrder.length){
            if (admin_id == 4) {
                // gửi thông báo cho NTD, chuyên viên và nhóm đơn hàng
                let time = new Date().getTime()/1000;
                await HandleQuery(`UPDATE orders SET status = 1, admin_accept = 2, accept_time_2 = ${time} WHERE id = ${order_id}`);
                let message = `Thông báo \n Đơn hàng với mã ${checkOrder[0].code_order} đã được duyệt bởi tổng đài hỗ trợ, đơn hàng chuyển sang trạng thái đang hoạt động.`;
                SendMessageToGroupOrder(message);
                if (checkOrder[0].type_user == 1) {
                    let infoCus = await HandleQuery(`SELECT chat365_id FROM user_company WHERE usc_id = ${checkOrder[0].id_user} LIMIT 1`);
                    SendMessageToIdChat(message, infoCus[0].chat365_id);
                }
                let infoSupporter = await HandleQuery(`SELECT emp_id FROM  admin_user WHERE adm_bophan = ${checkOrder[0].admin_id} LIMIT 1`);
                if (infoSupporter && infoSupporter.length) {
                    SendMessageToIdQlc(message, infoSupporter[0].emp_id);
                }
                // cộng điểm mua hàng
                let money_bonus_order = ((checkOrder[0].final_price*2)/100)/1000;
                await HandleQuery(`INSERT INTO save_exchange_point_order (userId,userType,order_id,point,unit_point,time)
                        VALUES (${checkOrder[0].id_user}, ${checkOrder[0].type_user},${order_id},${money_bonus_order},0,${time})`);

                // KHI TRỰC DUYỆT SẼ TỰ ĐỘNG THỰC THI CÁC GÓI DỊCH VỤ MÀ NTD ĐÃ MUA
                let detail_order = await HandleQuery(`
                    SELECT id, product_id, product_type, new_id, count_product, bg_time, bg_hoso
                    FROM orders_detail 
                    JOIN bang_gia ON bg_id =  product_id
                    WHERE order_id = ${order_id}`);

                let arr_detail_service = [];
                if (detail_order && detail_order.length) {
                    for(let i = 0; i < detail_order.length; i++){
                        let new_id = detail_order[i].new_id,
                            product_type = detail_order[i].product_type,
                            arr_detail_service_item = [],
                            so_tuan = 0,
                            so_hoso = 0;
                        for(let j = 0; j < detail_order.length; j++){
                            let new_id_ = detail_order[j].new_id,
                                product_type_ = detail_order[j].product_type;

                            if (new_id == new_id_ && product_type == product_type_) {
                                so_tuan += parseInt(detail_order[j].bg_time)*parseInt(detail_order[j].count_product);
                                so_hoso += parseInt(detail_order[j].bg_hoso)*parseInt(detail_order[j].count_product);
                                arr_detail_service_item.push(detail_order[j]);
                            }
                        }
                        arr_detail_service.push({
                            product_type: product_type,
                            new_id: new_id,
                            so_tuan: so_tuan,
                            so_hoso: so_hoso
                        });
                    }
                }
                let total_hoso = 0,
                    tuan_hoso = 0;
                // lọc các tin và loại dịch vụ trùng nhau trong mảng
                let arr_service = uniqueArray(arr_detail_service, (a, b) => (a.product_type === b.product_type) & (a.new_id === b.new_id));
                // thực thi ghim tin và cộng điểm cho từng tin
                arr_service.forEach(async function callback(service, s) {
                    let datetime = new Date();
                    let time_han = (datetime.setDate(datetime.getDate() + (parseInt(service.so_tuan) * 7)))/1000;
                    // ghim trang chủ
                    if (parseInt(service.so_tuan) > 0) {
                        if (service.product_type == 1 || service.product_type == 3 || service.product_type == 4 || service.product_type == 5) {
                            let data;
                            // box hấp dẫn
                            if (service.product_type == 1 || service.product_type == 3) {
                                data = `new_hot = 1, new_gap = 0, new_cao = 0`;
                            }
                            // box thương hiệu 
                            else if(service.product_type == 4) {
                                data = `new_hot = 0, new_gap = 1, new_cao = 0`;
                            }
                            // box tuyển gấp
                            else if(service.product_type == 5) {
                                data = `new_hot = 0, new_gap = 0, new_cao = 1`;
                            }
                            await HandleQuery(`UPDATE new SET ${data}, new_vip_time = ${time_han} WHERE new_id = ${service.new_id}`);
                        }
                        // ghim trang ngành
                        if (service.product_type == 6) {
                            await HandleQuery(`UPDATE new SET new_nganh = 1, new_cate_time = ${time_han} WHERE new_id = ${service.new_id}`);
                        }
                    }
                    // cộng điểm lọc hồ sơ
                    if (parseInt(service.so_hoso) > 0) {
                        if (service.product_type == 2 || service.product_type == 3) {
                            total_hoso += service.so_hoso;
                            tuan_hoso += service.so_tuan;
                        }
                    }
                });
                console.log("điểm lọc: "+ total_hoso);

                if (total_hoso > 0) {
                    // check bản ghi điểm của NTD ở bảng tbl_point_company
                    let point_ntd = await HandleQuery(`SELECT point_usc FROM tbl_point_company WHERE usc_id = ${checkOrder[0].id_user} LIMIT 1`);
                    if (point_ntd) {
                        let datetime = new Date();
                        let time_han_hoso = (datetime.setDate(datetime.getDate() + (parseInt(tuan_hoso) * 7)))/1000;
                        if (point_ntd.length) {
                            total_hoso = parseInt(point_ntd[0].point_usc) + total_hoso;
                            await HandleQuery(`UPDATE tbl_point_company SET point_usc = ${total_hoso},ngay_reset_diem_ve_0 = ${time_han_hoso}  WHERE usc_id = ${checkOrder[0].id_user}`);
                        } else {
                            await HandleQuery(`INSERT INTO tbl_point_company (usc_id, point_usc, ngay_reset_diem_ve_0)
                                VALUES (${checkOrder[0].id_user}, ${total_hoso},${time_han_hoso})`);
                        }
                        let point_chenh = parseInt(total_hoso) - parseInt(point_ntd[0].point_usc);
                        await HandleQuery(`INSERT INTO tbl_point_used (usc_id,point,type,used_day)
                                VALUES (${checkOrder[0].id_user}, ${point_chenh},1,${time})`);
                    }
                }
            }
            return true;
        } else{
            return false;
        }
    } catch(e){
        console.log('handleAdminAcceptOrder',e);
        return false;
    }
}

// api trực duyệt đơn hàng
const AdminAcceptOrder = async (req, res, next) => {
    try{
        if(req.body.order_id && req.body.admin_id){ 
            const order_id = Number(req.body.order_id); 
            const admin_id = Number(req.body.admin_id); 

            handleAdminAcceptOrder(order_id,admin_id);
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// hàm xử lý đổi điểm thưởng mua hàng. và khi dùng điểm đã đổi mua hàng
const HandleExchangePointOrder = async (userId, userType, point) =>{
    try{
        let checkUser = await CheckExistUser(userId,userType);
        if(checkUser && point > 0){
            let time = new Date().getTime()/1000;
            let exchange_point = await HandleQuery(`SELECT * FROM save_exchange_point_order WHERE userId = ${userId} AND userType = ${userType} ORDER BY id DESC`);

            if (exchange_point && exchange_point.length) {
                let point_plus_order = 0;
                let point_minus_order = 0;
                for(let i = 0; i < exchange_point.length; i++){
                    if (exchange_point[i].unit_point == 0) {
                        point_plus_order += exchange_point[i].point;
                    } else {
                        point_minus_order += exchange_point[i].point;
                    }
                }
                let total_point_order = point_plus_order - point_minus_order;
                if (total_point_order >= 100 && point <= total_point_order) {
                    await HandleQuery(`INSERT INTO save_exchange_point_order (userId,userType,order_id,point,unit_point,is_used,time)
                        VALUES (${userId}, ${userType},0,${point},1,0,${time})`);
                }
            }
        }
        return true;
    } catch(e){
        console.log(e);
        return false;
    }
}

// api đổi điểm thưởng mua hàng. và khi dùng điểm đã đổi mua hàng
const ExchangePointOrder = async (req, res, next) => {
    try{
        if(req.body.userId && req.body.point){
            const userId = Number(req.body.userId),
                  userType = Number(req.body.userType) || 0,
                  point = Number(req.body.point);

            HandleExchangePointOrder(userId, userType, point);
            return res.json({
                data:{
                    result:true
                }
            })
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}








const handleAcceptOrder1 = async (adm_id,id)=>{
    try{
       let check = await CheckExistUser(adm_id,1);
       if(check){
           let time = new Date().getTime()/1000;
           await HandleQuery(`UPDATE orders SET accept_time_1 = ${time},status = 1 WHERE id = ${id} AND adm_id = ${adm_id}`)
           return true;
       }
       else{
           return false;
       }
    }
    catch(e){
        console.log('handleAcceptOrder1',e);
        return false;
    }
}
const AcceptOrder1 = async (req, res, next) => {
    try{
        if(req.body.adm_id && req.body.id ){ 
            const adm_id = Number(req.body.adm_id);
            const id = Number(req.body.id);
            handleAcceptOrder1(adm_id,id)
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

const handleAcceptOrder2 = async (adm_id,id)=>{
    try{
       let check = await CheckExistUser(adm_id,1);
       if(check){
           let time = new Date().getTime()/1000;
           await HandleQuery(`UPDATE orders SET accept_time_2 = ${time},status = 2 WHERE id = ${id} AND adm_id = ${adm_id}`)
           return true;
       }
       else{
           console.log('error check exist user handleAcceptOrder1')
       }
    }
    catch(e){
        console.log('handleAcceptOrder1',e);
        return false;
    }
}
const AcceptOrder2 = async (req, res, next) => {
    try{
        if(req.body.adm_id && req.body.id ){ 
            const adm_id = Number(req.body.adm_id);
            const id = Number(req.body.id);
            const admin_timviec = Number(req.body.admin_timviec);
            if(admin_timviec == admin_timviec_supporter){
                handleAcceptOrder2(adm_id,id)
                return res.json({
                    data:{
                        result:true
                    }
                })
            }
            else{
                return res.json({
                    data:null,
                    error:"Bạn không có thẩm quyền"
                })
            }
        }
        else{
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// phân trang : tất cả đơn hàng
const GetListOrderSupporter = async (req, res) =>{
   try{
        if(req.body.adm_id && req.body.loaded){
             const adm_id = Number(req.body.adm_id);
             const loaded = Number(req.body.loaded);
             const limit = 10;
             let data = await HandleQuery(`SELECT * FROM orders WHERE adm_id = ${adm_id} LIMIT ${limit} OFFSET ${loaded}`);
             return res.json({
                data:{
                    result:true,
                    listUser:data
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thiếu thông tin truyền lên"
            })
        }
   }
   catch(e){
        console.log('error GetListOrderSupporter',e);
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
   }
}

// phân trang : đơn hàng chờ chuyên viên duyệt của 1 chuyên viên 
const GetListOrderWaitingSupporter1 = async (req, res) =>{
    try{
        if(req.body.adm_id && req.body.loaded){
             const adm_id = Number(req.body.adm_id);
             const loaded = Number(req.body.loaded);
             const limit = 10;
             let data = await HandleQuery(`SELECT * FROM orders WHERE adm_id = ${adm_id} AND status = 0 LIMIT ${limit} OFFSET ${loaded}`);
             return res.json({
                data:{
                    result:true,
                    listUser:data
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thiếu thông tin truyền lên"
            })
        }
   }
   catch(e){
        console.log('error GetListOrderSupporter1',e);
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
   }
}

// phân trang: đơn hàng chờ tổng đài duyệt của 1 chuyên viên 
const GetListOrderWaitingSupporter2 = async (req, res) =>{
    try{
        if(req.body.adm_id && req.body.loaded){
             const adm_id = Number(req.body.adm_id);
             const loaded = Number(req.body.loaded);
             const limit = 10;
             let data = await HandleQuery(`SELECT * FROM orders WHERE adm_id = ${adm_id} AND status = 1 LIMIT ${limit} OFFSET ${loaded}`);
             return res.json({
                data:{
                    result:true,
                    listUser:data
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thiếu thông tin truyền lên"
            })
        }
   }
   catch(e){
        console.log('error GetListOrderSupporter2',e);
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
   }
}

// phân trang: đơn hàng đã duyệt bởi tổng đài của 1 chuyên viên 
const GetListOrderAcceptedSupporter = async (req, res) =>{
    try{
        if(req.body.adm_id && req.body.loaded){
             const adm_id = Number(req.body.adm_id);
             const loaded = Number(req.body.loaded);
             const limit = 10;
             let data = await HandleQuery(`SELECT * FROM orders WHERE adm_id = ${adm_id} AND status = 2 LIMIT ${limit} OFFSET ${loaded}`);
             return res.json({
                data:{
                    result:true,
                    listUser:data
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thiếu thông tin truyền lên"
            })
        }
   }
   catch(e){
        console.log('error GetListOrderAcceptedSupporter',e);
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
   }
}

// phân trang: đơn hàng chờ tổng đài duyệt 
const GetListWaitingOrderAdmin = async (req, res) => {
    try{
        if(req.body.adm_id && req.body.loaded){
             const loaded = Number(req.body.loaded);
             const limit = 10;
             let data = await HandleQuery(`SELECT * FROM orders WHERE status = 1 LIMIT ${limit} OFFSET ${loaded}`);
             return res.json({
                data:{
                    result:true,
                    listUser:data
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thiếu thông tin truyền lên"
            })
        }
   }
   catch(e){
        console.log('error GetListOrderAcceptedSupporter',e);
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
   }
}

// phân trang: đơn hàng đã được tổng đài duyệt 
const GetListAcceptedOrderAdmin = async (req, res) => {
    try{
        if(req.body.adm_id && req.body.loaded){
             const loaded = Number(req.body.loaded);
             const limit = 10;
             let data = await HandleQuery(`SELECT * FROM orders WHERE status = 2 LIMIT ${limit} OFFSET ${loaded}`);
             return res.json({
                data:{
                    result:true,
                    listUser:data
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thiếu thông tin truyền lên"
            })
        }
   }
   catch(e){
        console.log('error GetListOrderAcceptedSupporter',e);
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
   }
}
