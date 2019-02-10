const Location = require('../models').Location;
const {getCoordinatePoint} = require('../helpers/geocode');
const {getUserId, usersLeftJoin,
        usersInnerJoin, getGivenUserInfoAll,
        getGivenUserInfo, deleteGivenUser, 
        updateGivenUserInfo} = require('../helpers/queryFunctions');

// add new location
function create(req, res){
    return Location
        .findOne({where: getUserId(req)})
        .then(user => {
            // check that it is not already in Location table
            if(user){
                return res.status(400).send({message: "Location already exists."});
            }

            // check that userId exists in users table
            getGivenUserInfo(req.params.userId)
                .then(user => {
                    if(user){
                        // check that user is a Location before adding to Location table
                        if(user.user_type !== 2){
                            return res.status(201).send({message: "User not a Location"});
                        }

                        return Location
                            .create({
                                address1: req.body.address1,
                                address2: req.body.address2,
                                city: req.body.city,
                                state: req.body.state,
                                zipcode: req.body.zipcode,
                                coordinate_point: getCoordinatePoint(req.body.address1, req.body.address2, 
                                                    req.body.city, req.body.state, req.body.zipcode),
                                userId: req.params.userId
                            })
                            .then(location => res.status(201).send(location))
                            .catch(error => res.status(400).send(error));
                    }
                    else{
                        return res.status(201).send({message: "User Not Found"});
                    }
                });
        })
        .catch(error => res.status(400).send(error));
}

// list locations
function list(req, res){
    usersLeftJoin("Locations")
        .then(users => {
            const locations = users.filter(user => {
                return user.user_type === 2;
            });
            res.status(200).send(locations);
        })
        .catch(error => res.status(400).send(error));
}

// retrieve info of specified location
function retrieve(req, res){
    const locationId = parseInt(req.params.userId);
    getGivenUserInfoAll(locationId, "Locations")
        .then(location => {
            if(!location){
                return res.status(404).send({message: 'User Not Found'});
            }

            //check that user is an Location
            if(location.user_type !== 2){
                return res.status(400).send({message: "No Location with given ID exists."})
            }

            return res.status(200).send(location);
        })
        .catch(error => res.status(400).send(error));
}

// update user info for specified user
function getAllUpdatedInfo(user, req){
    const currentUserId = user.userId;
    return updateGivenUserInfo(user, req)
        .then(result => {
            console.log(result.message);

            // return the joined full info of updated location
            return usersInnerJoin("Locations")
                .then(users => {
                    const specifiedUser = users.filter(user => {
                        return user.id === currentUserId;
                    });
                    return specifiedUser[0];
                });
        })
        .catch(error => error);
}

// update specified location info (allows updates in users table too)
function update(req, res){
    return Location
        .findOne({
            where: getUserId(req)
        })
        .then(location => {
            if(!location){
                return new Error('Location Not Found');
            }

            // update Locations table entries, then update users table entries
            // get and send the updated info from both Locations and users table 
            return location
                .update(req.body, {
                    fields: Object.keys(req.body)                 
                })
                .then(updatedLocation => {
                    const updatedLocationInfo = updatedLocation.dataValues;
                    return getAllUpdatedInfo(updatedLocationInfo, req);
                })
                .catch(error => res.status(400).send(error));
        })
        .then(updatedLocation => {
            if(updatedLocation instanceof Error){
                return res.status(400).send({message: updatedLocation.message});
            }
            return res.status(200).send(updatedLocation);
        })
        .catch(error => res.status(400).send(error));
}

// delete specified location from Locations and users tables
function destroy(req,res){
    const currentUserId = req.params.userId;
    return Location
        .findOne({ where: getUserId(req) })
        .then(location => {
            if(!location){
                return res.status(404).send({ message: 'Location Not Found' });
            }

            return location
                .destroy()
                .then(() => {
                    // delete location from users table
                    return deleteGivenUser(currentUserId)
                })
                .then(deletedUserMessage => {res.status(200).send({message: deletedUserMessage.message + " Success! Location Deleted."})})
                .catch(error => res.status(400).send(error))
        })
        .catch(error => res.status(400).send(error));
}

module.exports = {
    create,
    update,
    list,
    destroy,
    retrieve
};