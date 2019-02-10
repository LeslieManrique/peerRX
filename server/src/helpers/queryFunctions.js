const sequelize = require('../models').sequelize;

// find user by user ID then get their user type
// search for user id from req.params.userId in users table and get user type number
function findUserType(currentUserId){
    const selectByUserIdQuery = 'SELECT * FROM `users` WHERE id=:userId'
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

    const joinQuery = `SELECT * FROM users LEFT OUTER JOIN ${tableName} \
                                ON users.id = ${tableName}.userId \
                                UNION ALL SELECT * FROM users \
                                RIGHT OUTER JOIN ${tableName} \
                                ON users.id = ${tableName}.userId`;
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

    const joinQuery = `SELECT * FROM users INNER JOIN ${tableName} ON users.id = ${tableName}.userId`;
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

    const joinQuery = `SELECT * FROM users LEFT JOIN ${tableName} ON users.id = ${tableName}.userId`;
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

    const joinQuery = `SELECT * FROM users LEFT JOIN ${tableName} ON users.id = ${tableName}.userId`;
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
    const selectUserQuery = 'SELECT * FROM `users` WHERE id=:userId LIMIT 1';
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
    const deleteQuery = "DELETE FROM users WHERE id=:userId";
    return sequelize
        .query(deleteQuery, {
            replacements: {userId: currentUserId}
        })
        .then(() => {return {message: "Success! User deleted."}});
}

// update specified user info - given user's current values and new form values
function updateGivenUserInfo(user, req){
    const updateByUserIdQuery = 'UPDATE `users` SET first_name = :first_name, last_name = :last_name, email_address = :email_address, phone_number = :phone_number WHERE id=:userId';
    const currentUserId = user.userId;
    return getGivenUserInfo(currentUserId)
      .then(userInfo =>{
          return sequelize
              .query(updateByUserIdQuery, {
                  replacements: {
                      userId: userInfo.id,
                      first_name: req.body.first_name || userInfo.first_name,
                      last_name: req.body.last_name || userInfo.last_name,
                      email_address: req.body.email_address || userInfo.email_address,
                      phone_number: req.body.phone_number || userInfo.phone_number
                  },
                  type: sequelize.QueryTypes.UPDATE
              })
              .then(() => {
                  return {message: "Successfully Updated!"};
              })
              .catch(error => error);
            });
}

module.exports = {
    findUserType,
    usersFullOuterJoin,
    getGivenUserInfoAll,
    getGivenUserInfo,
    deleteGivenUser,
    updateGivenUserInfo,
    getUserId,
    usersInnerJoin,
    usersLeftJoin,
    usersRightJoin
};