const sequelize = require('../models').sequelize;
const user_types = require('../models').user_types;
const users = require('../models').users;

// choose only id, email_address, and user_type columns; don't send out passwords from db
const VIEWABLE_USER_COLS = `users.id, users.email_address, users.user_type, users.approved`;
const VIEWABLE_USER_COLS_ALT = `users.email_address`;

// find user by user ID then get their user type
// search for user id from req.params.userId in users table and get user type number

const registerUser = async(req, res)=>{
    console.log("registerUser");
    console.log(req.body);
    const user_type_name = await getUserTypeName(req.body.user_type);
    if(!req.body.email_address && !req.body.password && !req.body.user_type){
        console.log('error 1');
        return null;
    }
    if(!user_type_name){
        console.log('error 2');
      return null;
    }
    if(user_type_name == "admin"){
        console.log('error 3');
      return null;
    }
    return users
      .create({
        email_address: req.body.email_address,
        password: req.body.password,
        user_type: req.body.user_type
      })
      .then(user => {
          console.log('user --', user);
        return user.id;
      })
      .catch(error => {
          console.log(error);
        return null;
      });
  }
const getUserTypeName = async(user_id) => {
    let user_type = null;
    try{
        user_type = await user_types.findOne({where:{user_type : user_id}});
    }
    catch(error){
        console.log("get user type from name");
        console.log(error);
    }

    if(!user_type){
    return; 
    }
    else{
        return user_type.user_type_name;
    }
}

const getUserTypeFromName = async(type_name) => {
    const user_type_data = await user_types.findOne({where:{user_type_name:type_name}});
    if(!user_type_data){
        return;
    }
    else{
        return user_type_data.user_type; 
    }
}

//agencies list 
const getDataByParam = async(obj, table) => {
    console.log("FUNCTION GETDATABYPARAM");
    console.log('obj -- ', obj);
    console.log('table --',table);
    const cols = '`name`, `phone_number`, `address1`, `address2`, `city`, `state`, `zipcode`';
    let getQuery = ''
    //cols - [state, zip]
    if(obj.zipcode && obj.state){
        getQuery = `SELECT ${cols} FROM ${table} WHERE state = '${obj.state}' AND zipcode = '${obj.zipcode}';`;
        console.log(getQuery);
    }
    else if(obj.state){
        getQuery = `SELECT ${cols} FROM ${table} WHERE state = '${obj.state}';`;
        console.log(getQuery);
    }
    else if(obj.zipcode){
        getQuery = `SELECT ${cols} FROM ${table} WHERE zipcode = '${obj.zipcode}';`;
        console.log(getQuery);
    }
    else{
        getQuery = `SELECT ${cols} FROM ${table};`;


        console.log(getQuery);
    }
    
    return sequelize
        .query(getQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(res => {
            if(!res){
                return new Error("No data retrieved.");
            }
            return res; 
        })
        .catch(error => console.log("error--",error));


}
function findUserType(currentUserId){
    const selectByUserIdQuery = `SELECT ${VIEWABLE_USER_COLS} FROM users WHERE id=:userId;`;
    return sequelize
        .query(selectByUserIdQuery, {
            replacements: {userId: currentUserId},
            type: sequelize.QueryTypes.SELECT
        })
        .then(users => {
            if(!users){
                return new Error("User Not Found.");
            }
            return users[0].user_type;
        })
        .catch(error => console.log(error));
}

//DEPRECATED ... Query has some optimization concerns --- may slow down server due to UNION ALL and unecessary
//full table joins
// full outer join given table with users table (only accepts Agencies, Peers, or Locations)
function usersFullOuterJoin(tableName){
    if(tableName !== "agencies" && tableName !== "[eers" && tableName !== "locations"){
        return Promise.resolve(`Cannot join ${tableName} with users table.`);
    }

    const joinQuery =  `SELECT ${VIEWABLE_USER_COLS}, ${tableName}.* FROM \
                        users LEFT OUTER JOIN ${tableName} ON users.id = ${tableName}.userId \
                        UNION ALL \
                        SELECT ${VIEWABLE_USER_COLS}, ${tableName}.* FROM \
                        users RIGHT OUTER JOIN ${tableName} ON users.id = ${tableName}.userId;`;
    return sequelize
        .query(joinQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(users => {
            return users;
        });
}


function getUserProfile(currentUserId, tableName){
    console.log("Hello")
    if(tableName !== "agencies" && tableName !== "peers" && tableName !== "locations"){
        return Promise.resolve(`Cannot join ${tableName} with users table.`);
    }
    const query = `SELECT ${VIEWABLE_USER_COLS_ALT}, user_types.user_type_name, user_types.user_type, \ 
                   ${tableName}.* FROM users, ${tableName}, user_types WHERE users.id = ${currentUserId} and users.user_type = user_types.user_type;`;
    console.log("Query --", query)
    return sequelize
    .query(query, {
        type: sequelize.QueryTypes.SELECT
    })
    .then(users => {
        console.log(users)
        if(users.length === 0){
            return Promise.resolve(`No ${tableName}`);
        }
        console.log("users..", users);
        return users[0];
    });
}

// gets info from users table and given table for a given user ID
function getGivenUserInfoAll(currentUserId, tableName){
    return usersFullOuterJoin(tableName)
        .then(users => {
            if(users.length === 0){
                return Promise.resolve(`No ${tableName}`);
            }
            console.log("users..", users);
            // search for row / info for current user
            const targetUser = users.filter(user => user.id === currentUserId);
            return targetUser[0];
        });
}

// inner join given table with users table (only accepts Agencies, Peers, or Locations)
function usersInnerJoin(tableName){
    if(tableName !== "Agencies" && tableName !== "Peers" && tableName !== "Locations"){
        return Promise.resolve(`Cannot join ${tableName} with users table.`);
    }

    const joinQuery = `SELECT ${VIEWABLE_USER_COLS}, ${tableName}.* FROM users INNER JOIN ${tableName} ON users.id = ${tableName}.userId;`;
    return sequelize
        .query(joinQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(users => {
            return users;
        });
}

// left join given table with users table (only accepts Agencies, Peers, or Locations)
function usersLeftJoin(tableName){
    console.log("users left join");
    if(tableName !== "agencies" && tableName !== "locations"){
        return Promise.resolve(`Cannot join ${tableName} with users table.`);
    }
    const joinQuery = `SELECT ${VIEWABLE_USER_COLS}, ${tableName}.* FROM users LEFT JOIN ${tableName} ON users.id = ${tableName}.userId;`;
    return sequelize
        .query(joinQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(users => {
            return users;
        });
}

// left join given table with users table (only accepts Agencies, Peers, or Locations)
function usersRightJoin(tableName){
    if(tableName !== "Agencies" && tableName !== "Peers" && tableName !== "Locations"){
        return Promise.resolve(`Cannot join ${tableName} with users table.`);
    }

    const joinQuery = `SELECT ${VIEWABLE_USER_COLS}, ${tableName}.* FROM users RIGHT JOIN ${tableName} ON users.id = ${tableName}.userId;`;
    return sequelize
        .query(joinQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(users => {
            return users;
        });
}

// get user ID from params (delete this)
function getUserId(req){
    return {userId: parseInt(req.params.userId)};
};

// get specified user info from user table
function getGivenUserInfo(currentUserId){
    console.log("user query");
    const selectUserQuery = `SELECT ${VIEWABLE_USER_COLS} FROM users WHERE id=:userId LIMIT 1;`;
    return sequelize
        .query(selectUserQuery, {
            replacements: {
                userId: parseInt(currentUserId)
            },
            type: sequelize.QueryTypes.SELECT
        })
        .then(users => {
            return users[0];
        })
        .catch(error => error);
}

function approveUserToggle(user){
    console.log("approve user toggle.--------")
    let approve_val = user.approved;
    if(user.approved == false){
      approve_val = true;
    }
    else{
      approve_val = false;
    }
    return approve_val

  };
// delete user by id
function deleteGivenUser(currentUserId){
    const deleteQuery = "DELETE FROM users WHERE id=:userId;";
    return sequelize
        .query(deleteQuery, {
            replacements: {userId: currentUserId}
        })
        .then(() => {return {message: "Success! User deleted."}});
}

// update specified user info - given user's current values and new form values
function updateGivenUserEmail(user, req, ){
    const updateByUserIdQuery = 'UPDATE users SET email_address = :email_address WHERE id=:userId;';
    const currentUserId = user.userId;
    return getGivenUserInfo(currentUserId)
      .then(userInfo =>{
          return sequelize
              .query(updateByUserIdQuery, {
                  replacements: {
                      userId: userInfo.id,
                      email_address: req.body.email_address || userInfo.email_address
                  },
                  type: sequelize.QueryTypes.UPDATE
              })
              .then(() => {
                  return {message: "Successfully Updated!"};
              })
              .catch(error => error);
            });
}

// given user's original address and updated form values, determine if new coordinate point needs to be gotten
function isAddressChanged(currentUserInfo, req){
    console.log("function isAddressChanged")
    // check if address1, address2, city, state, zipcode are changed
    const addressParts = ["address1", "address2", "city", "state", "zipcode"];
    const changedParts = addressParts.filter(part => {
        if(!req.body[part]){
            return false;
        }
        return currentUserInfo[part] !== req.body[part];
    });

    // if any part of the address is altered, then address has changed
    if(changedParts.length === 0){
        console.log("No parts Changed")
        return false;
    }
    return true;
}

module.exports = {
    findUserType,
    usersFullOuterJoin,
    getGivenUserInfoAll,
    getGivenUserInfo,
    deleteGivenUser,
    updateGivenUserEmail,
    getUserId,
    usersInnerJoin,
    usersLeftJoin,
    usersRightJoin,
    isAddressChanged,
    getUserProfile,
    approveUserToggle,
    getUserTypeName,
    getUserTypeFromName,
    getDataByParam,
    registerUser
};