const express = require('express');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const users = require('../models').users;
const secret = process.env.JWT_SECRET;

router
    .post('/login', async (req,res, next)=>{
        //validate user
        if(!req.body.email || !req.body.password){
            res.status(401).send({"success":"false","message":"No email or password given."})
        }
        const user = await users.findOne({
            where: {email: req.body.email}
          });
        if(!user){
            res.status(401).send({"success":false, "message":"Email has not been registered. Please register your account."});
        }
        console.log("----user\n", user)
        //validate password
        const validate = await user.isValidPassword(req.body.password);
        if(!validate){
            res.status(401).send({"success":false, "message":"Incorrect Password"});
        }
        else{
            body = {id : user.id, email: user.email, role: user.role};
            const token = jwt.sign({data: {user : body}}, secret, { expiresIn: "10m"});
            res.json({success: true, token: 'JWT ' + token});
        }
    });

module.exports = router;