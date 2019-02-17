const sequelize = require('../models').sequelize;
const { findUserType, getGivenUserInfoAll } = require('../helpers/queryFunctions');

// get what type of user currently signed in as to determine which values are going to be locationId and agencyId
function getConditions(currentUserId, req){
    return findUserType(currentUserId)
        .then(userType => {
            // return error if user not found in users table
            if(userType instanceof Error){
                return userType
            }

            // user type 1 is Agency
            if(userType === 1){
                console.log("Current user is an Agency.");
                return {
                    locationId: parseInt(req.body.locationId),
                    agencyId: currentUserId
                }
            }
            // user type 2 is Location
            else if(userType === 2){
                console.log("Current user is a Location.");
                return {
                    locationId: currentUserId,
                    agencyId: parseInt(req.body.agencyId)
                }
            }
            else{
                // return error if user is neither an agency or a location
                return new Error("Current User is neither an Agency nor a Location");
            } 
        });
}

// check if association already exists (given agency id and location id)
function checkExisting(identifications){
    const selectAssociationQuery = "SELECT * FROM `AgenciesLocations` WHERE agencyId=:agencyId AND locationId=:locationId";
    return sequelize
        .query(selectAssociationQuery, {
            replacements: identifications,
            type: sequelize.QueryTypes.SELECT
        })
        .then(associations => {
            if(associations.length !== 0){
                return new Error('Agency-Location association already exists!');
            }

            //return the agencyId and locationId if association not found
            return identifications;
        })
        .catch(error => console.log(error));
}

// insert association into AgenciesLocations table
function insertAssociation(association){
    // raw query to insert new association
    const insertAgencyLocationQuery = "INSERT INTO `AgenciesLocations` (locationId, agencyId) VALUES (:locationId, :agencyId)";
    return sequelize
        .query(insertAgencyLocationQuery, {
            replacements: association,
            type: sequelize.QueryTypes.INSERT
        })
        .then(() => {
            return {message: "Success! New Agency-Location association created."}
        })
        .catch(error => error);
}

// get condition using user type using userId and add new agency-location association
function addAssociation(req, res){
    const currentUserId = parseInt(req.params.userId);
    getConditions(currentUserId, req)
        // check if association exists, return the IDs if not
        .then(conditionJSON => {
            if(conditionJSON instanceof Error){
                return res.status(404).send({message: conditionJSON.message});
            }

            // check if association already within table before inserting
            return checkExisting(conditionJSON);
        })
        .then(association => {
            if(association instanceof Error){
                return res.status(400).send({message: association.message});
            }

            //Check that new associated user is an agency or location type
            findUserType(currentUserId)
                .then(userType => {
                    // if not Agency or Location, cannot add
                    if(userType !== 1 && userType !== 2){
                        return res.status(400).send({message: "User is neither Agency nor Location. Cannot insert new Agency-Location association."});
                    }

                    // get the current user type. if agency, then only add in if other user is a location
                    if(userType === 1){
                        console.log("I am an Agency");

                        // verify that other user is actually a location
                        const locationId = association.locationId;
                        findUserType(locationId)
                            .then(otherUserType => {
                                if(otherUserType === 2){
                                    // raw query to insert new association if not already existing
                                    return insertAssociation(association);
                                }
                                return new Error("Cannot associate non-Location user to Agency.");
                            })
                            .then(result => {
                                if(result instanceof Error){
                                    return res.status(400).send({message: result.message});
                                }
                                return res.status(200).send(result);
                            })
                            .catch(error => res.status(400).send(error));
                    }
                    else if(userType === 2){
                        console.log("I am a Location");

                        // verify that other user is actually an agency
                        const agencyId = association.agencyId;
                        findUserType(agencyId)
                            .then(otherUserType => {
                                if(otherUserType === 1){
                                    // raw query to insert new association if not already existing
                                    return insertAssociation(association); 
                                }  
                                return new Error("Cannot associate non-Agency user to Location.");
                            })
                            .then(result => {
                                if(result instanceof Error){
                                    return res.status(400).send({message: result.message});
                                }
                                return res.status(200).send(result);
                            })
                            .catch(error => res.status(400).send(error));                        
                        }
                    });
                })
                .catch(error => res.status(400).send(error));
}

// delete an association by querying for location ID and agency ID
function deleteAssociation(req, res){
    const currentUserId = req.params.userId;
    getConditions(currentUserId, req)
        .then(conditionJSON => {
            const deleteAssociationQuery = "DELETE FROM `AgenciesLocations` WHERE agencyId=:agencyId AND locationId=:locationId";
            return sequelize
                .query(deleteAssociationQuery, {
                    replacements: conditionJSON,
                    type: sequelize.QueryTypes.DELETE
                });
        })
        .then(() => res.status(200).send({message: "Success! Agency-Location association deleted."}))
        .catch(error => res.status(400).send(error));
}

// do a full outer join between users table and Agencies table OR 
// a full outer join between users and Locations to get full info
function getAllUserInfo(currentUserId, userType){
    if(userType === 1){
        // join with Agencies table
        return getGivenUserInfoAll(currentUserId, "Agencies");
    }
    else if(userType === 2){
        // join with Locations table
        return getGivenUserInfoAll(currentUserId, "Locations")
    }
    return Promise.resolve("User is neither an Agency nor a Location.");
}

// get associated agencies of a location or associated locations of an agency
function getAssociatedUsers(selectionQuery, currentUserId, res){
    return sequelize
        .query(selectionQuery, {
            replacements: {userId: currentUserId},
            type: sequelize.QueryTypes.SELECT
        })
        .then(results => {
            const associatedUsersInfo = results.map((associatedUser) => {
                const associatedUserId = associatedUser.locationId || associatedUser.agencyId;
                return findUserType(associatedUserId)
                    .then(userType => {
                        return getAllUserInfo(associatedUserId, userType);
                    });
            });

            Promise
                .all(associatedUsersInfo)
                .then(associatedUsers => res.status(200).send(associatedUsers))
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}

// find associated locations for given agency
// find associated agencies for given location
// takes userId and gets the user type from users table to determine what to  query for
function retrieveAssociation(req, res){
    const currentUserId = parseInt(req.params.userId);
    findUserType(currentUserId)
        .then(userType => {
            // return error if user not found in users table
            if(userType instanceof Error){
                return userType
            }

            if(userType !== 2 && userType !== 1){
                // return error if user is neither an agency or a location
                return res.status(200).send({message: "Current User is neither an Agency nor a Location"});
            }

            // if user is an agency then look for list of associated locations
            if(userType === 1){
                const selectLocationsByAgency = "SELECT locationId FROM `AgenciesLocations` WHERE agencyId=:userId";
                getAssociatedUsers(selectLocationsByAgency, currentUserId, res);
            }
            // if user is a location then look for list of associated agencies
            else if(userType === 2){
                const selectAgenciesByLocation = "SELECT agencyId FROM `AgenciesLocations` WHERE locationId=:userId";
                getAssociatedUsers(selectAgenciesByLocation, currentUserId, res);
            }            
        })
        .catch(error => res.status(400).send(error));
}

module.exports = {
    addAssociation,
    deleteAssociation,
    retrieveAssociation
};