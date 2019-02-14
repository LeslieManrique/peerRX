const sequelize = require('../models').sequelize;

// choose only id, email_address, and user_type columns; don't send out passwords from db
const VIEWABLE_USER_COLS = `users.id, users.email_address, users.user_type`;

// find user by user ID then get their user type
// search for user id from req.params.userId in users table and get user type number
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

// full outer join given table with users table (only accepts Agencies, Peers, or Locations)
function usersFullOuterJoin(tableName){
    if(tableName !== "Agencies" && tableName !== "Peers" && tableName !== "Locations"){
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

// gets info from users table and given table for a given user ID
function getGivenUserInfoAll(currentUserId, tableName){
    return usersFullOuterJoin(tableName)
        .then(users => {
            if(users.length === 0){
                return Promise.resolve(`No ${tableName}`);
            }

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
    if(tableName !== "Agencies" && tableName !== "Peers" && tableName !== "Locations"){
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

// get user ID from params
function getUserId(req){
    return {userId: parseInt(req.params.userId)};
};

// get specified user info from user table
function getGivenUserInfo(currentUserId){
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
    isAddressChanged
};