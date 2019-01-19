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
        
        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground" // Redirect URL
            );
        
        // get a new access token
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });
        
        const tokens = await oauth2Client.refreshAccessToken()
        const accessToken = tokens.credentials.access_token

        // const accessToken = ''
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'oauth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                access_token: accessToken
            }
           
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER_RECEIVER,
            subject: 'PeerRX Interest Request',
            html: content, 
            replyTo: process.env.EMAIL_USER_RECEIVER
        };

        transporter.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            transporter.close();
       });
       
    }
}
