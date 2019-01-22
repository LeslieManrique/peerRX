// npm install nodemailer googleapis
const nodemailer = require('nodemailer');
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fillTemplate = require('es6-dynamic-template');
const fs = require('fs');

module.exports = {
    sendInterestRequest: async (body) => {
        let {name, email, user_type, phone_number, organization} = body;
        if (user_type == 0){
            user_type = 'peer';
        }
        else if (user_type == 1){
            user_type = 'peer agency';
        }
        else{
            user_type = 'location';
        }

        console.log('obj',{name, email, user_type, phone_number, organization});

        const fs_read = fs.readFileSync('src/static/interest_email.html', 'utf8');
        const content = fillTemplate(fs_read, {name, email, user_type, phone_number, organization});

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465, 
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                access_token: process.env.GOOGLE_ACCESS_TOKEN,
                expires: Number.parseInt(process.env.GOOGLE_EXPIRES,10)
            }
           
        });

        let maillist = [
            'info@connect2apeer.com',
            'leslie@peer-rx.com'
        ];
          
        maillist = maillist.toString();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: maillist,
            subject: 'PeerRX Interest Request',
            html: content, 
            replyTo: 'info@connect2apeer.com'
        };

        transporter.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            transporter.close();
       });
       
    }
}
