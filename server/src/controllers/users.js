const users = require('../models').users;
const { check } = require('express-validator/check');
const { usersInnerJoin, approveUserToggle, getUserTypeName } = require('../helpers/queryFunctions');
// services/auth.js for registration
// change this to controllers/admin 

// const userTypeDict = { 0: "Peers", 1: "Agencies", 2: "Locations", 3: "Admin"};


const createUser = async(req, res) =>{
  const user_type_name =  await getUserTypeName(req.body.user_type);
  if(!req.body.email_address  && !req.body.password && !req.body.user_type){
    return res.json({"success":false, "message":"please fill out all required fields"});
  }
  if(!user_type_name){
    return res.json({"success":false, "message":"invalid user type"});
  }
  if(user_type_name=="admin"){
    console.log("user type is admin");
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

const approveUser = async (type, req, res) => {
  console.log("APPROVE FUNCTION");
  console.log(type, res, res);
  let user = null;
  try{
      user = await users.findOne({where: {id: parseInt(req.params.id)}, attributes: ['id','email_address','user_type', 'approved']})
  }
  catch (error) {
      return res.status(400).send(error);
  }

  let can_approve = false

  if(type == "admin"){
    can_approve = true
  }
  else if(type == "agency"){
    if(user.user_type == 0 || user.user_type == 1){
      can_approve = true
    }
    else{
      can_approve = false
    }
  }
  else{
    can_approve = false
  }

  if (can_approve == true){
    try{
      await users.update({approved:approveUserToggle(user)},{where:{id:parseInt(user.id)}});
      res.json({success:true, message: "User approval value changed"});
    }
    catch(error){
      res.status(400).send(error)
    }
  }
  else{
    res.json({success:true, message: "User approval value cannot be changed"});
  }
}


module.exports = {
  createUser,
  list,
  retrieve,
  destroy,
  approveUser
};
    
    