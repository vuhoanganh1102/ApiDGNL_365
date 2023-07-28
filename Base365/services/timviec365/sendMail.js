const axios = require('axios');
const parser = require('fast-xml-parser');

exports.SendmailHunghapay = async(partner, toAddress, subject, body, int_type) => {

    const soapUrl = 'http://ctyhungha.com/soap/server_mail.php?wsdl';

    const xml_post_string = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
            <soap:Body>
            <tem:CreateMail>
                <tem:partner>${partner}</tem:partner>
                <tem:toAddress>${toAddress}</tem:toAddress>
                <tem:subject>${subject}</tem:subject>
                <tem:body>${body}</tem:body>
                <tem:type>${int_type}</tem:type>
            </tem:CreateMail>
            </soap:Body>
        </soap:Envelope>`;

    const headers = {
        'Content-Type': 'text/xml; charset=utf-8'
    };

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: soapUrl,
        headers: headers,
        data: xml_post_string
    };

    await axios.request(config)
        .then((response) => {
            // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

exports.CreateSendMail = async(toFrom, toAddress, ccAddress, bccAddress, subject, body, type) => {
    //send mail 
    await exports.SendmailHunghapay("TV365", toAddress, subject, body, type);
    //$type
    // 10 xác thực đăng ký ứng viên
    // 11 xác thực đăng ký ntd
    // 12 gửi lại mail xác thực cho ntd và uv
    // 13 gửi thông báo có ứng viên nộp hồ sơ ứng tuyển cho NTD
    // 14 gửi thông báo cho ứng viên khi ứng viên nộp hồ sơ ứng tuyển
    // 15 quên mật khẩu ntd và uv

    // 16 gửi ứng viên thông báo có NTD xem thông tin
    // 17 quên mật khẩu CTV
    // 18 đăng ký tài khoản CTV
    // 19 mail chát đầu tiên trong ngày
}

exports.Send_NTD_xem_UV = async(email, name_uv, name_com, link_uv, link_com, list_job) => {
    let body = `
    <body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: arial;padding-top: 20px;padding-bottom: 20px;">
        <table style="width: 700px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000">
            <tr style="height: 120px;background-image: url(https://timviec365.vn/images/email/banner_mailxemUV.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;">
            </tr>
            <tr><td style="padding-bottom: 20px;background: #dad7d7"></td></tr>
            <tr  style="float: left;padding:10px 15px 0px 15px;min-height: 175px;">
                <td colspan="2">
                    <p style="font-size: 16px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 15px;">Xin chào ${name_uv}</p>
                    <p style="font-size: 16px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 5px;">Cám ơn bạn đã tin tưởng Timviec365.vn là cầu nối giúp bạn tìm kiếm công việc mong muốn.</p>
                    <p style="font-size: 16px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 5px;"><span><a style="    font-weight: bold;color: #307df1;text-decoration: none;" href="${link_uv}">Hồ sơ của bạn</a> trên website Timviec365.vn đã được nhà tuyển dụng <span><a style="font-weight: bold;color: #307df1;text-decoration: none;" href="${link_com}">${name_com}</a> xem</span>. Bạn có thể tham khảo các công việc tương tự xem có phù hợp với mình không nhé!</p> 
                    <p style="font-size: 16px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 5px;">Trân trọng!</p>
                </td>
            </tr> 
            <tr><td style="padding-bottom: 20px;background: #dad7d7"></td></tr>
            <tr style="float:left;padding:10px 15px 0px 15px;width:100%;box-sizing: border-box;">
                <td style="display:block;">
                    <p style="font-size: 16px;margin: 0;line-height: 25px;margin-bottom: 5px;">
                        Timviec365.vn gửi bạn danh sách việc làm tương tự 
                    </p>
                </td>
            </tr>
            ${list_job}
            <tr><td style="padding-bottom: 20px;background: #dad7d7"></td></tr>
            <tr  style="float: left;padding:0px 15px 0px 15px;min-height: 115px;">
                <td>
                    <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-top: 15px;color: #307df1">Công ty Cổ phần Thanh toán Hưng Hà</p>
                    <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;color:#4D4D4D"><span style="color: #307df1">VP1: </span>Tầng 4, B50, Lô 6, KĐT Định Công - Hoàng Mai - Hà Nội</p>
                    <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;margin-bottom: 5px;color:#4D4D4D"><span style="color: #307df1">VP2: </span> Thôn Thanh Miếu, Xã Việt Hưng, Huyện Văn Lâm, Tỉnh Hưng Yên</p>
                    <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;margin-bottom: 5px;color:#4D4D4D"><span style="color: #307df1">Hotline:</span> 1900633682 - ấn phím 1</p>
                    <p style="margin: 0;font-size: 14px;margin: 0;line-height: 19px;margin-bottom: 5px;padding-bottom: 15px;color:#4D4D4D"><span style="color: #307df1">Email hỗ trợ:</span> timviec365.vn@gmail.com</p>
                </td>
            </tr>
            <tr><td style="padding-bottom: 39px;background: #dad7d7"></td></tr>
        </table>
    </body>
`;

    body = Buffer.from(body, "utf-8").toString("base64");

    // Call CreateSendMail function to send the email
    await exports.CreateSendMail(email, email, "", "", "[Timviec365.vn]", body, 16)
}

exports.SendRegisterNTD = async(email, name_uv, name_com, link_uv, link_com, list_job) => {
    let body = `<body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: unset;padding-top: 20px;padding-bottom: 20px;">
    <table style="width: 600px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000">
       <tr style="height: 165px;background-image: url(https://timviec365.vn/images/email/bg1.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;">
          <td style="padding-top: 23px;float: left;">
             <img src="https://timviec365.vn/images/email/logo2.png">
          </td>
          <td style="text-align: left;float: right;">
             <ul style="margin-top: 15px;padding-left: 0px;">
                <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Đăng tin tuyển dụng miễn phí</span></li>
                <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Không giới hạn tin đăng tuyển dụng</span></li>
                <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Biểu mẫu nhân sự chuyên nghiệp</span></li>
             </ul>          
          </td>
       </tr>
       <tr  style="float: left;padding:10px 30px 30px 30px;">
          <td colspan="2">
             <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-top: 15px;">Xin chào <span style="color:#307df1;">${company_name}!</span></p>
             <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Chúc mừng bạn đã hoàn thành thông tin đăng ký tài khoản nhà tuyển dụng tại website Timviec365</p>
             <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Dưới đây là thông tin tài khoản đã tạo:</p>
             <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Tài khoản: ${email}</p>
             <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Mật khẩu: ********</p>
             <p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Vui lòng bấm nút xác thực để hoàn thành quá trình đăng ký:</p>
             <p style="margin: auto;margin-top: 45px;text-align: center;width: 160px;height: 43px;background:#307df1;border-radius: 5px;"><a href="${link}" style="color: #fff;text-decoration: none;font-size: 18px;line-height: 43px;">Xác thực</a></p>
          </td>
       </tr>
 
       <tr style="height: 160px;background-image: url(https://timviec365.vn/images/email/bg2.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;">
          <td style="padding-top: 50px;">
             <ul>
                <li style="list-style-type: none;color: #fff;margin-bottom: 5px;">
                   <span style="font-size: 18px;line-height: 18px;">Liên hệ với chúng tôi để được hỗ trợ nhiều hơn:</span>
                </li>
                <li style="list-style-type: none;color: #fff;margin-bottom: 5px;">
                   <span style="font-size: 18px;line-height: 18px;">Hotline: <span style="color: #ffa111;">1900633682</span> - ấn phím 1</span>
                </li>
                <li style="list-style-type: none;color: #fff;margin-bottom: 5px;">
                   <span style="font-size: 18px;line-height: 18px;color: #ffa111;">Trân trọng !</span>
                </li>
             </ul>       
          </td>
       </tr>
    </table>
    </body>`
    body = Buffer.from(body, "utf-8").toString("base64");

    // Call CreateSendMail function to send the email
    await exports.CreateSendMail(email, email, "", "", "Đăng ký NTD", body, 11)
}

exports.SendRegisterNTDAPP = async(email, company_name, otp) => {
    let body = `<body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: unset;padding-top: 20px;padding-bottom: 20px;"><table style="width: 600px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000"><tr style="height: 165px;background-image: url(https://timviec365.vn/images/email/bg1.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;"><td style="padding-top: 23px;float: left;"><img src="https://timviec365.vn/images/email/logo2.png"></td><td style="text-align: left;float: right;"><ul style="margin-top: 15px;padding-left: 0px;"><li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Hiển thị danh sách ứng viên online</span></li><li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Nhắn tin trực tiếp ứng viên qua Chat365</span></li><li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Cam kết bảo hành 100%</span></li></ul></td></tr><tr style="float: left;padding:10px 30px 30px 30px;"><td colspan="2"><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-top: 15px;">Xin chào <span style="color:#307df1;">
    ${company_name}!</span></p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Chúc mừng bạn đã hoàn thành thông tin đăng ký tài khoản nhà tuyển dụng tại website Timviec365</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Dưới đây là thông tin tài khoản đã tạo:</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Tài khoản: ${email}</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Mật khẩu: ********</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Dưới đây là mã OTP của bạn</p><p style="margin: auto;margin-top: 45px;text-align: center;width: 160px;height: 43px;background:#307df1;border-radius: 5px;font-size: 22px;color: #fff; line-height: 40px">${otp}</a></p></td></tr><tr style="height: 160px;background-image: url(https://timviec365.vn/images/email/bg2.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;"><td style="padding-top: 50px;"><ul><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Liên hệ với chúng tôi để được hỗ trợ nhiều hơn:</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Hotline: <span style="color: #ffa111;">1900633682</span> - ấn phím 1</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;color: #ffa111;">Trân trọng !</span></li></ul></td></tr></table></body>`;

    body = Buffer.from(body, "utf-8").toString("base64");

    // Call CreateSendMail function to send the email
    await exports.CreateSendMail(email, email, "", "", "Timviec365.vn - Đăng ký tài khoản nhà tuyển dụng", body, 11)
}

exports.SendqmkNTDAPP = async(email, company_name, otp) => {
    let body = `<body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: unset;padding-top: 20px;padding-bottom: 20px;"><table style="width: 600px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000"><tr style="height: 165px;background-image: url(https://timviec365.vn/images/email/bg1.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;"><td style="padding-top: 23px;float: left;"><img src="https://timviec365.vn/images/email/logo2.png"></td><td style="text-align: left;float: right;"><ul style="margin-top: 15px;padding-left: 0px;"><li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Đăng tin tuyển dụng miễn phí</span></li><li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Không giới hạn tin đăng tuyển dụng</span></li><li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Biểu mẫu nhân sự chuyên nghiệp</span></li></ul></td></tr><tr style="float: left;padding:10px 30px 30px 30px;"><td colspan="2"><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-top: 15px;">Xin chào <span style="color:#307df1;">${company_name}</span></p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Yêu cầu xác thực mật khẩu của bạn đã được tiếp nhận</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Dưới đây là thông tin tài khoản của bạn:</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">
    - Tài khoản: ${company_name}</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Mật khẩu: ********</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Vui lòng nhập mã OTP để hoàn thành quá trình đổi mật khẩu:</p><p style="margin: auto;color:#fff;margin-top: 45px;font-size: 20px;line-height: 40px;text-align: center;width: 160px;height: 43px;background:#307df1;border-radius: 5px;">${otp}</p></td></tr><tr style="height: 160px;background-image: url(https://timviec365.vn/images/email/bg2.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;"><td style="padding-top: 50px;"><ul><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Liên hệ với chúng tôi để được hỗ trợ nhiều hơn:</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Hotline: <span style="color: #ffa111;">1900633682</span> - ấn phím 1</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;color: #ffa111;">Trân trọng !</span></li></ul></td></tr><tr style="height: 86px;background-color: #dad7d7;"><td style="text-align: center;" colspan="2"><p style="margin:5px;"><span style="font-weight: 600;font-style: italic;">Chú ý</span> : Đây là mail tự động không nhận mail phản hồi</p></td></tr></table></body>`;

    body = Buffer.from(body, "utf-8").toString("base64");

    // Call CreateSendMail function to send the email
    await exports.CreateSendMail(email, email, "", "", "Timviec365 - Yêu cầu khôi phục mật khẩu!", body, 12)
}