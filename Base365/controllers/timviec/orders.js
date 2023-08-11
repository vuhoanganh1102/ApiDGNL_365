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
        const send = await axios.post('http://43.239.223.142:9009/api/message/SendMessage_v2', data);
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
                    sendMessageToSupporter(adminUser.emp_id, code_order, name, phone, adminUser.adm_name, final_price);
                    
                    // gửi tin nhắn sang chat
                    let detail = await Users.findOne()
                    // let detail = await HandleQuery(`SELECT chat365_id FROM user_company WHERE usc_id = ${id_user}`);
                    // // if(detail && detail.length){
                        // lưu ảnh đơn hàng ,lưu pdf  //https://timviec365.vn/mua-hang/hoa-don-mua-hang-o61
                        const browser = await puppeteer.launch({
                            headless: 'chrome',
                            args: ["--no-sandbox", "--disabled-setupid-sandbox", "--font-render-hinting=none", '--force-color-profile=srgb', '--disable-web-security']
                        });
                        let namepdf = `/usr/local/nginx/public_html/chat/api/pdforder/order_${Number(id_order)}.pdf`;
                        let nameimg = `/usr/local/nginx/public_html/chat/api/imageorder/order_${Number(id_order)}.png`;
                        const page = await browser.newPage();
                        const session = await page.target().createCDPSession();
                        await session.send('DOM.enable');
                        await session.send('CSS.enable');
                        session.on('CSS.fontsUpdated', event => {
                            // console.log(event);
                        });
                        const website_url = `https://timviec365.vn/mua-hang/hoa-don-mua-hang-o${id_order}`;
                        await page.goto(website_url, { waitUntil: 'networkidle2' });
                        await page.emulateMediaType('screen');
                        await page.evaluateHandle('document.fonts.ready');
                        await page.pdf({
                            path: namepdf,
                            margin: { top: '50px', right: '0px', bottom: '0px', left: '0px' },
                            printBackground: true,
                        });
                        const height = await page.evaluate(docHeight);
                        await page.screenshot({
                            path: nameimg,
                            height: `${height}px`,
                            fullPage: true,
                            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
                        });
                        await axios({
                            method: "post",
                            url: "http://43.239.223.142:9009/api/message/SendMessageCv",
                            data: {
                                senderId: 1192,
                                userId: detail[0].chat365_id,
                                linkImg:`https://timviec365.vn/chat/api/imageorder/order_${id_order}.png`,
                                linkPdf:`https://timviec365.vn/chat/api/pdforder/order_${id_order}.pdf`
                            },
                            headers: { "Content-Type": "multipart/form-data" }
                        });

                        // cập nhật link pdf vào đơn hàng
                        let linkpdf = `https://timviec365.vn/chat/api/pdforder/order_${id_order}.pdf`;
                        await HandleQuery(`UPDATE orders SET bill_pdf='${linkpdf}' WHERE id = ${id_order}`);
                    }
                    else{
                        console.log("Nhà tuyển dụng không có id chat")
                    }
                   
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
const OrderProduct = async (req, res, next) => {
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

            handleOrderProduct(id_user,type_user,name,phone,email,adm_id,count,price,chiet_khau,discount_vip,discount_fee,vat_fee,final_price,list_product,point_use);
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