const sequelize = require('../models').sequelize;

function getAllSpecialties(){
    const selectAllSpecialtiesQuery = `SELECT id, description FROM SpecialtyItems;`
    return sequelize
        .query(selectAllSpecialtiesQuery, { type: sequelize.QueryTypes.SELECT })
        .then(specialties => {
            // parse through specialties to creat dict in {id: description, id: description} format
            let specialtiesDict = {}
            specialties.forEach(specialty => {
                specialtiesDict[parseInt(specialty.id)] = specialty.description;
            });
            return specialtiesDict;
        });
}

module.exports = {
    getAllSpecialties
};