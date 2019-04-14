const users = require('../models').users;
const { check } = require('express-validator/check');
const { usersInnerJoin } = require('../helpers/queryFunctions');
// services/auth.js for registration
// change this to controllers/admin 
const userTypeDict = { 0: "Peers", 1: "Agencies", 2: "Locations", 3: "Admin"};

function createUser(req, res) {
  if(!req.body.email_address  && !req.body.password && !req.body.user_type){
    return res.json({"success":false, "message":"please fill out all required fields"});
  }
  if(!(req.body.user_type in userTypeDict)){
    return res.json({"success":false, "message":"Incorrect User Type"});
  }
  if(userTypeDict[req.body.user_type]=="Admin"){
    return res.json({"success":false, "message":"invalid user type"});
  }
  return users
    .create({
      email_address: req.body.email_address,
      password: req.body.password,
      user_type: req.body.user_type
    })
    .then(user => res.status(201).json({"success":true, "message":"Added New User"}))
    .catch(error => {
      const errorObject = {"status":false, "message": error.errors[0]["message"]};
      res.status(400).send(errorObject);
    });
}


function createAdmin(req, res) {
  if(!req.body.email_address  && !req.body.password && !req.body.user_type){
    return res.json({"success":false, "message":"please fill out all required fields"});
  }
  if(userTypeDict[req.body.user_type]!="Admin"){
    return res.json({"success":false, "message":"Incorrect User Type"});
  }
  return users
    .create({
      email_address: req.body.email_address,
      password: req.body.password,
      user_type: req.body.user_type
    })
    .then(user => res.status(201).res.json({"success":true, "message":"Added New User"}))
    .catch(error => {
      const errorObject = {"status":false, "message": error.errors[0]["message"]};
      return res.status(400).send(errorObject);
    });
}

function list(req, res) {
  return users
    .findAll({
      attributes: ['id','email_address','user_type', 'approved']
    })
    .then((users) => res.status(200).send(users))
    .catch((error) => res.status(400).send(error))
}

// get user specified by ID
function retrieve(req, res){
  return users
    .findOne({where: {id: parseInt(req.params.userId)}, attributes: ['id','email_address','user_type', 'approved']})
    .then(user => {
      if(!user){
        return res.status(201).send({message: "User Not Found"})
      }
      else{
        return res.status(200).send(user)
      }

      // returns full user info from related tables
      // if user is not as expected, a message is also returned
      // return getFullInfo(user)
      //   .then(fullInfo => {
      //     return res.status(200).send(fullInfo);
      //   });
    })
    .catch(error => res.status(400).send(error));
}

// delete user from users table (user is also deleted from Peer/Agency/Location table)
function destroy(req, res){
  return users
    .findOne({where: {id: parseInt(req.params.userId)}})
    .then(user => {
      if(!user){
        return res.status(201).send({message: 'User Not Found'});
      }

      return user
        .destroy()
        .then(() => res.status(200).send({message: 'Success! User Deleted.'}))
        .catch(error => res.status(400).send(error));
    });
}

module.exports = {
  createUser,
  createAdmin,
  list,
  retrieve,
  destroy
};
    
    