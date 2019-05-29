'use strict'
const jwt = require('jsonwebtoken');
const secret =  process.env.JWT_SECRET
const users = require('../models').users;
const user_types = require('../models').user_types;
const {getUserTypeName } = require('../helpers/queryFunctions');


//const userTypeDict = { 0: "Peers", 1: "Agencies", 2: "Locations", 3: "Admin"};
const verifyRelationship = async (req, res, next) => {
    try{
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user']
        console.log(req.userdata);
        //const role = userTypeDict[req.userdata['user_type']];
        //admin can approve all types of users accounts
        const role = getUserTypeName(req.userdata['user_type']);
        if(role == 'admin'){
            next()
        }
        else{
            const status = check_relationship(req.userdata['id'], req.params.userId)
            if(status == true){
                next()
            }
            else{
                return res.status(401).send("Authorization Token Error")
            }
        }

    }
    catch (error){

    }
}

const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);

        req.userdata = decoded['data']['user']
        // const role = userTypeDict[req.userdata['user_type']];
        const role = await getUserTypeName(req.userdata['user_type']);
        if(role != 'admin'){
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

const authenticateAgency = async (req, res, next) => {
    console.log("....auth Agency");
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
        req.userdata = decoded['data']['user'];
        console.log(req.userdata)
        const role = await getUserTypeName(req.userdata['user_type']);
        if(role != 'agency' && role != 'admin'){
            console.log("NANI\t", role);
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
        req.userdata = decoded['data']['user'];
        const id = req.userdata['id'];
        const role = await getUserTypeName(req.userdata['user_type']);
        const findUser = await users.findOne({
            where: {id: id}
        });
        if(findUser.id != req.params.userId){
            if(role == 'admin' && findUser.approved == true){
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

const authenticateLocation = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user'];
        console.log(req.userdata)
        // const role = userTypeDict[req.userdata['user_type']];
        const role = await getUserTypeName(req.userdata['user_type']);
        console.log("role\t", role)
        if(role != 'location' && role != 'admin'){
            console.log("not a location and not an admin");
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


const isApproved = async (req, res, next) => {
    console.log("is approved")
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

const authenticateGeneral = async (req, res, next) => {
    console.log(req);
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);

        req.userdata = decoded['data']['user']
        
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

const authenticatePeer = async (req, res, next) => {
    console.log("auth Agency");
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.userdata = decoded['data']['user'];
        console.log(req.userdata)
        // const role = userTypeDict[req.userdata['user_type']];
        const role = getUserTypeName(req.userdata['user_type']);
        console.log("roleeee\t", role)
        if(role != 'Peers' || role != 'Admin'){
            console.log("nani")
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
    canAccessParam,
    authenticateAgency,
    authenticatePeer,
    authenticateGeneral
};
