const sequelize = require('../models').sequelize;

const requestsMade = () => {

    return new Promise(function (resolve, reject) {
        let query = 'select * from users'
        sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}


// this will always be on the end of the file
module.exports.requestsMade = requestsMade

// add all other exports