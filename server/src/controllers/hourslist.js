const HoursList = require('../models').HoursList;
const sequelize = require('../models').sequelize;
const {getGivenUserInfo} = require('../helpers/queryFunctions');
 
// TODO: get userId from creating new entry in Peers/Agencies/Locations and just generate when new account is made
// Use this route if ever user deletes their hourslist and need to make a new one
// create new HoursList for user 
function create(req, res){
    // check that user doesn't already have an HoursList
    return HoursList
        .findOne({where: {userId: req.params.userId}})
        .then(hoursList => {
            if(hoursList){
                return res.status(400).send({message: 'User already has an hours list.'})
            }
            // check that user exists
            getGivenUserInfo(req.params.userId)
                .then(user => {
                    if(user){
                        // create hours list for user
                        return HoursList
                            .create({userId: req.params.userId})
                            .then(hoursList => res.status(200).send(hoursList))
                            .catch(error => res.status(400).send(error));
                    } else {
                        return res.status(404).send({message: 'User Not Found.'})
                    }
                })
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}

// gets the hour items given hours list id
function getHourItems(hoursListId){
    const selectHourItemsQuery = `SELECT * FROM HourItems WHERE hoursListId=${hoursListId};`
    return sequelize
        .query(selectHourItemsQuery, {type: sequelize.QueryTypes.SELECT})
        .then(hourItems => {
            return hourItems;
        })
        .catch(error => error);
}

// may be an unnecessary route for production; has uses during development
// list out all users hours list and their hour items
function list(req, res){
    return HoursList
        .findAll()
        .then(hoursLists => {
            // get hour items for each list and display that with list
            const addedHourItems = hoursLists.map(hoursList => {
                const hoursListInfo = hoursList.dataValues;
                return getHourItems(hoursListInfo.id)
                    .then(hourItems => {
                        hoursListInfo['hourItems'] = hourItems;
                        return hoursListInfo;
                    });
            });

            Promise
                .all(addedHourItems)
                .then(fullHoursLists => {
                    return res.status(200).send(fullHoursLists)
                })
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}

// get hours list for specific user
function retrieve(req, res){
    return HoursList
        .findOne({where: {userId: req.params.userId}})
        .then(hoursList => {
            if(!hoursList){
                return new Error('User\'s hours list not found.');
            }

            // get hour items from given hours list if found
            const hoursListInfo = hoursList.dataValues;
            return getHourItems(hoursListInfo.id)
                .then(hourItems => {
                    hoursListInfo["hourItems"] = hourItems;
                    return hoursListInfo;
                })
                .catch(error => error);
        })
        .then(result => {
            if(result instanceof Error){
                return res.status(404).send({message: result.message});
            }
            return res.status(200).send(result);
        })
        .catch(error => res.status(400).send(error));
}

// NOTE: there should be no use case where someone would alter the user-hoursList association

// delete hour item entries in HourItems table for given hours list id
function deleteHourItems(hoursListId){
    const deleteHourItemQuery = `DELETE FROM HourItems WHERE hoursListId=${hoursListId};`
    return sequelize
        .query(deleteHourItemQuery, {type: sequelize.QueryTypes.DELETE})
        .then(() => {return {message: `Hour items in hours list ${hoursListId} deleted.`}})
        .catch(error => error);; 
}

// delete user's hours list
function destroy(req, res){
    return HoursList
        .findOne({where: {userId: req.params.userId}})
        .then(hoursList => {
            if(!hoursList){
                return new Error("User\'s hours list not found.");
            }
            
            // destroy hours list and entries in hour items table with that hours list
            const hoursListId = hoursList.dataValues.id;
            return hoursList
                .destroy()
                .then(() => {
                    return deleteHourItems(hoursListId)
                        .then(result => result);
                })
                .catch(error => error);
        })
        .then(result => {
            if(result instanceof Error){
                return res.status(200).send({message: result.message});
            }
            const messages = ["User\'s hours list was deleted.", result.message];
            return res.status(200).send({message: messages.join(" ")});
        })
        .catch(error => res.status(400).send(error));
}

module.exports = {
    create,
    list,
    retrieve,
    destroy
};