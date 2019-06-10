const express = require('express');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const users = require('../models').users;
const secret = process.env.JWT_SECRET;

router
    .post('/login', async (req,res, next)=>{
        //validate user
        console.log("LOGIN IN USER...")
        if(!req.body.email_address && !req.body.password){
            res.status(401).send({"success":"false","message":"No email or password given."})
        }
        const user = await users.findOne({
            where: {email_address: req.body.email_address}
          });
        if(!user){
            res.status(401).send({"success":false, "message":"Email has not been registered. Please register your account."});
        }
        //validate password
        const validate = await user.isValidPassword(req.body.password);
        if(!validate){
            res.status(401).send({"success":false, "message":"Incorrect Password"});
        }
        else{
            body = {id : user.id, email_address: user.email_address, user_type: user.user_type};

            console.log("TOKEN BODY\t", body)
            const token = jwt.sign({data: {user : body}}, secret, { expiresIn: "10d"});
            
            res.json({success: true, token: 'JWT ' + token, user: body});
        }
    });

module.exports = router;