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

module.exports = {
    findUserType,
    usersFullOuterJoin,
    getGivenUserInfoAll,
};