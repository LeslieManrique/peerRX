'use strict'
const jwt = require('jsonwebtoken');
const secret =  process.env.JWT_SECRET
const users = require('../models').users;

const userTypeDict = { 0: "Peers", 1: "Agencies", 2: "Locations", 3: "Admin"};

const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user']
        const role = userTypeDict[req.userdata['user_type']];
        if(role != 'Admin'){
            return res.status(401).send("Authorization token error");
        }
    
        const findUser = await users.findOne({
            where: {email_address: req.userdata['email_address']}
        });
       
        const approved = findUser.approved 

        if(approved!=true){
            return res.status(401).send("Your account has not been approved for access.");

        }
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
const authenticateLocation = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user'];
        console.log(req.userdata)
        const role = userTypeDict[req.userdata['user_type']];
        console.log("role\t", role)
        if(role != 'Locations' && role != 'Admin'){
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
const canAccessParam = async (req, res, next) => {
    console.log("CAN ACCESS PARAM");
    try{
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const id = decoded['data']['user']['id'];
        const findUser = await users.findOne({
            where: {id: id}
        });

        if(findUser.id != req.params.userId){
            if(findUser.user_type == 3 && findUser.approved == true){
                next()
            } 
            else{
                return res.status(401).send("Unauthorized Function For User")
            }
        }
        else{
            next();
        }
    }
    catch (error){
        console.log(error);
        return res.status(501).send("Error Veifying Token Authorization");
    }

}

const isApproved = async (req, res, next) => {
    try{
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const id = decoded['data']['user']['id'];
        const findUser = await users.findOne({
            where: {id: id}
        });
        const approved = findUser.approved;
        if(!approved){
            return res.status(401).send("Unauthorized Function For User")
        }
        else{
            next();
        }
    }
    catch (error){
        console.log(error);
        return res.status(501).send("Error Veifying Token Authorization");
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
    authenticateAdmin,
    authenticateLocation,
    isApproved,
    canAccessParam
};
