const sequelize = require('../models').sequelize;
            
const findPeersForLocation = (locationId, specialty, rank, language, gender, ageRangeStart, ageRangeEnd) => {
    let query
    if (locationId && specialty, rank) {
        query = `select * from peers as p join peer_languages as pl on p.peer_id = pl.peer_id
        where p.location_id = ? and p.specialty = ? and p.rank = ? `
    }
    if (language) {
        query = query + `and pl.language_id = ? `
    }
    if (gender) {
        query = query + `and p.gender = ? `
    }
    if (ageRangeStart && ageRangeEnd) {
        query = query + `and p.age_range_start = ? and p.age_range_end = ?`
    }
    query = query + `;`

    // query = `select * from peers as p join peer_languages as pl on p.peer_id = pl.peer_id 
    // where p.location_id = ? and p.specialty = ? and p.rank = ? 
    // and pl.language = ? 
    // and p.gender = ? 
    // and p.age_range_start = ? and p.age_range_end = ?`
    // query = query + `;`

    let bindArray = [locationId, specialty, rank, language, gender, ageRangeStart, ageRangeEnd]
    return sequelize.query(query, { replacements: bindArray, type: sequelize.QueryTypes.SELECT })
}

module.exports = {
    findPeersForLocation
}