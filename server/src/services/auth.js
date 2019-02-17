'use strict'
const jwt = require('jsonwebtoken');
const secret =  process.env.JWT_SECRET
const users = require('../models').users;

const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user']
        const role = req.userdata['role'];
        if(role != 'admin'){
            return res.status(401).send("Authorization token error");
        }
    
        const findUser = await users.findOne({
            where: {email: req.userdata['email']}
        });

        console.log("----- FIND USER", findUser);
       
        const approved = findUser.approved 

        console.log("---approved\t", approved)
        if(approved!=true){
            return res.status(401).send("Your account has not been approved for access.");

        }
        console.log("user data:\t", req.userdata)
        next();
      }
      catch (error) {
        console.log("error", error)
        return res.status(401).send('Authorization token error');
      }
}
const authenticateAgency= (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user']
        const role = req.userdata['role'];
        if(role != 'agency'){
            return res.status(401).send("Authorization token error");
        }
        console.log("user data:\t", req.userdata)
        next();
      }
      catch (error) {
        console.log("error", error)
        return res.status(401).send('Authorization token error');
      }
}
const authenticateLocation = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user']
        const role = req.userdata['role'];
        if(role != 'location'){
            return res.status(401).send("Authorization token error");
        }
        console.log("user data:\t", req.userdata)
        next();
      }
      catch (error) {
        console.log("error", error)
        return res.status(401).send('Authorization token error');
      }
}

const authenticatePeer = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user']
        const role = req.userdata['role'];
        if(role != 'peer'){
            return res.status(401).send("Authorization token error");
        }
        console.log("user data:\t", req.userdata)
        next();
      }
      catch (error) {
        console.log("error", error)
        return res.status(401).send('Authorization token error');
      }
}
module.exports = {
    authenticateAdmin
};
