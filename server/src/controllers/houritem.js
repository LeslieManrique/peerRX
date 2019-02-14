const HourItem = require('../models').HourItem;
const sequelize = require('../models').sequelize;
const HoursList = require('../models').HoursList;

// TODO: check and consolidate time range of overlapping hour items in list when user is adding new hour item
function consolidateTime(hoursListId, dayOfWeek, timeIn, timeOut){
    // 1. query for hour items given hourListId and dayOfWeek
    // 2. convert timeIn and timeOut string to datatime object using arbitrary, but same, date
    // 3. a. one at a time, convert time in and time out of hour items using same date as above
    //    b. compare times 
    //       i. timeIn > time_in AND timeOut < time_out => time already accepted range, don't create new hour item
    //      ii. timeIn >= time_in AND timeOut > time_out => consolidate and update existing hour item to time_in, timeOut
    //     iii. timeIn < time_in AND timeOut <= time_out => consolidate and use timeIn, time_out
    //      iv. timeIn < time_in AND timeOut > time_out => replace existing hour item with timeIn, timeOut
}

// create new hour item given user id
function create(req,res){
    return HoursList
        .findOne({where: {id: parseInt(req.params.hoursListId)}})
        .then(hoursList => {
            if(!hoursList){
                return res.status(404).send({message: "Hours list not found."})
            }

            // TODO: check time range for given day_of_week before adding to table
            return HourItem
                .create({
                    hoursListId: req.params.hoursListId,
                    day_of_week: req.body.day_of_week,
                    time_in: req.body.time_in,
                    time_out: req.body.time_out
                })
                .then(newHourItem => {
                    return res.status(200).send(newHourItem);
                })
                .catch(error => res.status(200).send(error));
        })
        .catch(error => res.status(200).send(error));
}

// list out ALL hour items in table
function list(req,res){
    return HourItem
        .findAll()
        .then(allHourItems => res.status(200).send(allHourItems))
        .catch(error => res.status(400).send(error));
}

// get all hour items for a specified hours list
function retrieve(req,res){
    return HoursList
        .findOne({where: {id: parseInt(req.params.hoursListId)}})
        .then(hoursList => {
            if(!hoursList){
                return res.status(404).send({message: "Hours list not found."})
            }

            return HourItem
                .findAll({where: {hoursListId: parseInt(req.params.hoursListId)}})
                .then(hourItems => {
                    return res.status(200).send(hourItems);
                })
                .catch(error => res.status(200).send(error));
        })
        .catch(error => res.status(200).send(error));
}

// User has their hour items displayed and can choose to edit/delete a specified hour item whose hourItemId gets sent with request

// updates a single hour item given a JSON with hour item id, day_of_week, time_in, and time_out values
function updateSingleItem(update){
    return HourItem
        .findOne({where: {id: update.id, hoursListId: update.hoursListId}})
        .then(item => {
            if(!item){
                return Promise.resolve({message: `Hour Item with id ${update.id} in hours list ${update.hoursListId} not found.`});
            }
            return item
                .update(update, {fields: Object.keys(update)})
                .then(updatedHourItem => updatedHourItem)
                .catch(error => error);
        });
}

// given a specified hours list and all their current hour items on display, update specific hour items
// the hour item's id is sent through request as hourItemId along with any changes to values
// for multiple hour item updates on one request, bundle the changes up and send it as an array
function update(req,res){
    return HoursList
        .findOne({where: {id: parseInt(req.params.hoursListId)}})
        .then(hoursList => {
            if(!hoursList){
                return res.status(404).send({message: "Hours list not found."})
            }

            // NOTICE: expects a JSON of updates for hour items (each key is the item id and the value is a JSON of updated values)
            // body is application/json instead of form-urlencoded
            const allUpdates = req.body;
            const updatedHourItems = Object.keys(allUpdates).map(update => 
                updateSingleItem({...allUpdates[update], id: update, hoursListId: parseInt(req.params.hoursListId)})
            );
            return Promise
                .all(updatedHourItems)
                .then(hourItems => res.status(200).send(hourItems))
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(200).send(error));
}

// given hoursListId and hour item ids, delete from table
function destroySingleItem(destroy){
    return HourItem
        .findOne({where: {id: destroy.id, hoursListId: destroy.hoursListId}})
        .then(item => {
            if(!item){
                return Promise.resolve({message: `Hour Item with id ${destroy.id} in hours list ${destroy.hoursListId} not found.`})
            }
            return item
                .destroy()
                .then(() => ({message: `Hour item in hours list ${destroy.hoursListId} succesfully deleted.`}))
                .catch(error => error);
        });
}

// given a specified hours list, and their current hour items on display
function destroy(req, res){
    return HoursList
        .findOne({where: {id: parseInt(req.params.hoursListId)}})
        .then(hoursList => {
            if(!hoursList){
                return res.status(404).send({message: "Hours list not found."})
            }

            // NOTICE: expects item ids of deleted items in an array and the array set as value to the key "deletedItems"
            const deletedItems = req.body.deletedItems;
            const deletedHourItems = deletedItems.map(itemId => 
                destroySingleItem({id: itemId, hoursListId: parseInt(req.params.hoursListId)})
            );
            return Promise
                .all(deletedHourItems)
                .then(deleteResults => res.status(200).send(deleteResults))
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(200).send(error));
}

module.exports = {
    create,
    list,
    retrieve,
    update,
    destroy
};