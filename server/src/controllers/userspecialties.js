const UserSpecialties = require('../models').UserSpecialties;
const sequelize = require('../models').sequelize;
const {getAllSpecialties} = require('../helpers/getSpecialties');

// specialties
// const specialtiesDict = { 0: "Specialty0", 1: "Specialty1", 2: "Specialty2"};
// get specialties from SpecialtyItems table
let specialtiesDict = {};
getAllSpecialties().then(result => specialtiesDict = result);

// check that user exists 
function checkUserExists(currentUserId){
    const findUserQuery = `SELECT * FROM users WHERE id=${currentUserId};`
    return sequelize
        .query(findUserQuery, {type: sequelize.QueryTypes.SELECT})
        .then(user => {
            if(user.length === 0){
                return new Error('User not found.');
            }
            return user[0];
        });
}

// check if user-specialty association already exists
function checkUserSpecialty(currentUserId, currentSpecialtyId){
    return UserSpecialties
        .findOne({where: {userId: parseInt(currentUserId), specialtyId: parseInt(currentSpecialtyId)}})
        .then(userSpecialty => {
            if(userSpecialty){
                console.log(`User ${currentUserId} already has ${specialtiesDict[currentSpecialtyId]} specialty.`);
                return true;
            }
            return false;
        });
}

// in the form, user will be able to check multiple checkboxes for specialties
// expects dict with key name 'specialtyItems' and value as an arry of specialties (numerical values that correspond to specialtiesDict) 
function create(req, res){
    // check that user exists
    return checkUserExists(req.params.userId)
        .then(result => {
            if(result instanceof Error){
                return res.status(404).send({message: result.message});
            }

            // add new user-specialty association if user exists
            const specialtyItems = req.body.specialtyItems;
            const specialtyItemsAdd = specialtyItems.map(specialtyId => {
                return checkUserSpecialty(req.params.userId, specialtyId)
                    .then(result => {
                        if(!result){
                            // add new user-specialty if not already in table
                            return UserSpecialties
                                .create({userId: parseInt(req.params.userId), specialtyId: parseInt(specialtyId)})
                                .then(newUserSpecialty => newUserSpecialty)
                                .catch(error => error);
                        }
                        return Promise.resolve(`User ${req.params.userId} and Specialty ${specialtiesDict[specialtyId]} association already exists.`);
                    })
            });

            return Promise
                .all(specialtyItemsAdd)
                .then(results => res.status(200).send(results));
        });
}

// get specialties of a given user
function retrieve(req, res){
    // check that user exists
    return checkUserExists(req.params.userId)
        .then(result => {
            if(result instanceof Error){
                return res.status(404).send({message: result.message});
            }

            // get all of user's specialties
            return UserSpecialties
                .findAll({where: {userId: parseInt(req.params.userId)}})
                .then(userSpecialties => res.status(200).send(userSpecialties))
                .catch(error => res.status(400).send(error));
        });
}

// get all user-specialty associations
function list(req, res){
    // get all of user's specialties
    return UserSpecialties
        .findAll()
        .then(userSpecialties => res.status(200).send(userSpecialties))
        .catch(error => res.status(400).send(error));
}

// function to delete association 
function deleteUserSpecialty(currentUserId, currentSpecialtyId){
    console.log(currentSpecialtyId);
    return UserSpecialties
        .findOne({where: {userId: parseInt(currentUserId), specialtyId: parseInt(currentSpecialtyId)}})
        .then(userSpecialty => {
            if(!userSpecialty){
                return Promise.resolve(`Error. User ${currentUserId} does not have specialty ${specialtiesDict[currentSpecialtyId]}`);
            }

            const deleteUserSpecialtyQuery = `DELETE FROM UserSpecialties WHERE userId=${currentUserId} AND specialtyId=${currentSpecialtyId};`
            return sequelize
                .query(deleteUserSpecialtyQuery, {type: sequelize.QueryTypes.DELETE})
                .then(() => ({message: `User ${currentUserId} - Specialty ${specialtiesDict[currentSpecialtyId]} association successfully deleted.`}))
                .catch(error => error);
        });
}

// function to add association
function addUserSpecialty(currentUserId, currentSpecialtyId){
    return UserSpecialties
        .findOne({where: {userId: parseInt(currentUserId), specialtyId: parseInt(currentSpecialtyId)}})
        .then(userSpecialty => {
            if(userSpecialty){
                return Promise.resolve(`Error. User ${currentUserId} already has specialty ${specialtiesDict[currentSpecialtyId]}`);
            }

            return UserSpecialties
                .create({userId: parseInt(currentUserId), specialtyId: parseInt(currentSpecialtyId)})
                .then(newUserSpecialty => ({added_specialty: newUserSpecialty, message: `User ${currentUserId} - Specialty ${specialtiesDict[currentSpecialtyId]} association successfully created.`}))
                .catch(error => error);
        });
}

// get array of specialties given an array of UserSpecialties entries
function getSpecialitesArray(userSpecialtiesEntries){
    return userSpecialtiesEntries.map(entry => entry.specialtyId);
}

// given a new array of user's associations, add/delete current associations
function update(req, res){
    // check that user exists
    return checkUserExists(req.params.userId)
        .then(result => {
            if(result instanceof Error){
                return res.status(404).send({message: result.message});
            }

            // get all of user's specialties
            return UserSpecialties
                .findAll({where: {userId: parseInt(req.params.userId)}})
                .then(userSpecialties => {
                    // get current array of specialties
                    const currentSpecialties = getSpecialitesArray(userSpecialties);
                    // new specialties array
                    const newSpecialties = req.body.specialtyItems.map(item => parseInt(item));
                    // get specialties to delete
                    const deletedSpecialties = currentSpecialties.filter(specialty => !newSpecialties.includes(specialty));                    
                    // get specialties to add
                    const addedSpecialties = newSpecialties.filter(specialty => !currentSpecialties.includes(specialty));

                    // delete and add appropriate specialties
                    const deleteActions = deletedSpecialties.map(specialty => deleteUserSpecialty(req.params.userId, specialty));
                    const addActions = addedSpecialties.map(specialty => addUserSpecialty(req.params.userId, specialty));
                    
                    return deleteActions.concat(addActions);
                })
                .then(actions => {
                    return Promise
                        .all(actions)
                        .then(results => res.status(200).send(results))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });

}

// delete all given user's specialties
function destroy(req, res){
    // check that user exists
    return checkUserExists(req.params.userId)
        .then(result => {
            if(result instanceof Error){
                return res.status(404).send({message: result.message});
            }

            return UserSpecialties
                .findAll({where: {userId: parseInt(req.params.userId)}})
                .then(userSpecialties => {
                    const deletedSpecialties = userSpecialties.map(userSpecialty => {
                        return userSpecialty
                            .destroy()
                            .then(() => ({message: `User ${req.params.userId} specialty deleted.`}))
                            .catch(error => error);
                    });

                    return deletedSpecialties;
                })
                .then(action => {
                    return Promise
                        .all(action)
                        .then(results => res.status(200).send(results))
                        .catch(error => res.status(400).send(error));
                });
        });
}

module.exports = {
    create,
    retrieve,
    list,
    update,
    destroy
};
