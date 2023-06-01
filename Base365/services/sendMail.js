const axios = require('axios');

exports.sendMailHunghapay = async(partner, toAddress, subject, body, int_type) => {
    const soapUrl = 'http://ctyhungha.com/soap/server_mail.php?wsdl';
    const xml_post_string = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <CreateMail xmlns="http://tempuri.org/">
        <partner>${partner}</partner>
        <toAddress>${toAddress}</toAddress>
        <subject>${subject}</subject>
        <body>${body}</body>
        <type>${int_type}</type>
      </CreateMail>
    </soap:Body>
  </soap:Envelope>`;

    const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'Accept': 'text/xml',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Content-length': xml_post_string.length.toString(),
    };

    try {
        const response = await axios.post(soapUrl, xml_post_string, { headers });
        // Handle the response here
        console.log(response.data);
    } catch (error) {
        // Handle the error here
        console.error(error);
    }
}