const users = require('../models').users;
const { check } = require('express-validator/check');
const { usersInnerJoin, updateGivenUserInfo} = require('../helpers/queryFunctions');
const userTypeDict = {0: "Peer", 1: "Agency", 2: "Location"};
const sequelize = require('../models').sequelize;

// add new user
function create(req, res) {
  console.log('posting')
  console.log(req.body)
  return users
    .create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_address: req.body.email_address,
      user_type: req.body.user_type,
      phone_number: req.body.phone_number,
      password: req.body.password,
    })
    .then(users => res.status(201).send(users))
    .catch(error => res.status(400).send(error));
}

// get full info of given user
function getFullInfo(user){
  const userType = parseInt(user.user_type);
  const currentUserId = parseInt(user.id);
  
  // determine which table to join with based on user type
  const tableName = getUserTableName(userType);
  if(!tableName){
    return Promise.resolve({message: "User is not a Peer, Agency, or Location.",
                            user_info: user});
  }

  return usersInnerJoin(tableName)
    .then(joinedUsers => {
        const specifiedUser = joinedUsers.filter(joinedUser => {
            return joinedUser.id === currentUserId;
        });

        // new user may not be in their appropriate tables yet so return just user info
        if(specifiedUser.length === 0){
          return {message: `User is a(n) ${userTypeDict[userType]} but not yet finished registering.`,
                  user_info: user};
        }

        return specifiedUser[0];
    });
}

// list all users
function list(req, res) {
  return users
    .findAll({
      attributes: ['first_name', 'last_name','id','email_address','user_type','phone_number']
    })
    .then((users) => {
      const fullInfo = users.map(user => {
        return getFullInfo(user);
      });

      Promise
        .all(fullInfo)
        .then(allInfo => res.status(200).send(allInfo))
        .catch(error => res.status(400).send(error))
    })
    .catch(error => res.status(400).send(error));
}

// determines which table to check in based on user type
function getUserTableName(userType){
  let tableName = undefined;
  // determine which table to join with based on user type
  if(userType === 0){
    tableName = "Peers";
  } else if(userType === 1){
    tableName = "Agencies";
  } else if(userType === 2){
    tableName = "Locations";
  }
  return tableName;
}

// get user specified by ID
function retrieve(req, res){
  return users
    .findOne({where: {id: parseInt(req.params.userId)}})
    .then(user => {
      if(!user){
        return res.status(404).send({message: "User Not Found"})
      }

      // returns full user info from related tables
      // if user is not as expected, a message is also returned
      return getFullInfo(user)
        .then(fullInfo => {
          return res.status(200).send(fullInfo);
        });
    })
    .catch(error => res.status(400).send(error));
}

// get user info from table based on type
function getMoreUserInfo(currentUserId, tableName){
  // Join users table with user types
  return usersInnerJoin(tableName)
    .then(users => {
        const specifiedUser = users.filter(user => {
            return user.id === currentUserId;
        });
        return specifiedUser[0];
    });
}

// update user info for specified user and return all of users info
function getAllUpdatedInfo(user, req){
  const currentUserId = parseInt(user.id);
  const currentUserType = parseInt(user.user_type);
  const tableName = getUserTableName(currentUserType);
  
  if(!tableName){
    return new Error("User is neither a Peer, Agency, nor Location.");
  }
  
  return getMoreUserInfo(currentUserId, tableName)
    .then(userInfo => userInfo);
}

// update given user info (only updates Users table info)
// TODO: give functionality to update Peer/Agency/Location tables when updating user info
function update(req, res){
  return users
    .findOne({ where: {id: parseInt(req.params.userId)} })
    .then(user => {
      if(!user){
        return res.status(404).send({message: 'User Not Found'});
      }

      // update users table entries
      return user
          .update(req.body, {
              fields: Object.keys(req.body)                 
          })
          .then(updatedUser => {
            const updatedUserInfo = updatedUser.dataValues;
            return getAllUpdatedInfo(updatedUserInfo, req);
          })
          .then(updatedUser => {
            if(updatedUser instanceof Error){
              return res.status(400).send({message: updatedUser.message});
            }
            return res.status(200).send(updatedUser);
          })
          .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

// delete user from users table (user is also deleted from Peer/Agency/Location table)
function destroy(req, res){
  return users
    .findOne({where: {id: parseInt(req.params.userId)}})
    .then(user => {
      if(!user){
        return res.status(404).send({message: 'User Not Found'});
      }

      return user
        .destroy()
        .then(() => res.status(200).send({message: 'Success! User Deleted.'}))
        .catch(error => res.status(400).send(error));
    });
}

module.exports = {
  create,
  list,
  update,
  retrieve,
  destroy
};