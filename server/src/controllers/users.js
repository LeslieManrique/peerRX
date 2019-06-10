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

// retrieve info of specified agency
const retrieve = async(req, res) =>{
  console.log("retrieving")
  const location_type = await getUserTypeFromName(location_name);
  const locationId = parseInt(req.params.userId);
  getUserProfile(locationId, "locations")
      .then(location => {
          if(!location){
              return res.status(404).send({message: 'User Not Found'});
          }
          console.log("---\n", location);
          //check that user is an Agency
          if(location.user_type !== location_type){
              return res.status(400).send({message: "No location with given ID exists."})
          }

          return res.status(200).send(location);
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

const approveUser = async (req, res) => {
  console.log("APPROVE FUNCTION");
  console.log(type, res, res);
  let user = null;
  try{
      user = await users.findOne({where: {id: parseInt(req.params.id)}, attributes: ['id','email_address','user_type', 'approved']})
  }
  catch (error) {
      return res.status(400).send(error);
  }

  if (user){
    try{
      await users.update({approved:approveUserToggle(user)},{where:{id:parseInt(user.id)}});
      res.json({success:true, message: "User approval value changed"});
    }
    catch(error){
      res.status(400).s|end(error)
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
    
    