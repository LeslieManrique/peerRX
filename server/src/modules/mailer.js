const nodemailer = require('nodemailer');
const fillTemplate = require('es6-dynamic-template');
const fs = require('fs');

module.exports = {
    sendInterestRequest: (body) => {
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

        const tranporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER_RECEIVER,
            subject: 'PeerRX Interest Request',
            html: content, 
            replyTo: process.env.EMAIL_USER_RECEIVER
        };

        tranporter.sendMail(mailOptions, function(err, res){
            console.log("sending");
            if(err){
                console.log("There was an error: ", err);
                error = {error: "There was an error in sending your email. Please Try again"};
                throw(error);
            }
            else{
                console.log('Email sent!');
            }
        });
    }
}
