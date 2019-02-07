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

// get condition using user type using userId and add new agency-location association
function addAssociation(req, res){
    const currentUserId = parseInt(req.params.userId);
    getConditions(currentUserId, req)
        .then(conditionJSON => {
            if(conditionJSON instanceof Error){
                return res.status(404).send({message: conditionJSON.message});
            }

            // check if association already within table before inserting
            const selectAssociationQuery = "SELECT * FROM `AgenciesLocations` WHERE agencyId=:agencyId AND locationId=:locationId";
            sequelize
                .query(selectAssociationQuery, {
                    replacements: conditionJSON,
                    type: sequelize.QueryTypes.SELECT
                })
                .then(associations => {
                    if(associations.length !== 0){
                        return res.status(404).send({message: 'Agency-Location association already exists!'});
                    }

                    //Check that new associated user is an agency or location type
                    findUserType(currentUserId)
                        .then(userType => {
                            // get the current user type. if agency, then only add in if other user is a location
                            if(userType === 1){
                                console.log("I am an Agency");
                                const locationId = conditionJSON.locationId;
                                findUserType(locationId)
                                    .then(otherUserType => {
                                        if(otherUserType === 2){
                                            // raw query to insert new association if not already existing
                                            const insertAgencyLocationQuery = "INSERT INTO `AgenciesLocations` (locationId, agencyId) VALUES (:locationId, :agencyId)";
                                            sequelize
                                                .query(insertAgencyLocationQuery, {
                                                    replacements: conditionJSON,
                                                    type: sequelize.QueryTypes.INSERT
                                                })
                                                .then(() => res.status(200).send({message: "Success! New Agency-Location association created."}));
                                        }
                                        return res.status(400).send({message: "Can't create association to Agency with non-Location user."});
                                    });
                            }
                            else if(userType === 2){
                                console.log("I am a Location");
                                const agencyId = conditionJSON.agencyId;
                                findUserType(agencyId)
                                    .then(otherUserType => {
                                        if(otherUserType === 1){
                                            // raw query to insert new association if not already existing
                                            const insertAgencyLocationQuery = "INSERT INTO `AgenciesLocations` (locationId, agencyId) VALUES (:locationId, :agencyId)";
                                            sequelize
                                                .query(insertAgencyLocationQuery, {
                                                    replacements: conditionJSON,
                                                    type: sequelize.QueryTypes.INSERT
                                                })
                                                .then(() => res.status(200).send({message: "Success! New Agency-Location association created."}));
                                        }
                                        return res.status(400).send({message: "Can't create association to Location with non-Agency user."});
                                    });
                            }
                            return res.status(400).send({message: "User is neither Agency nor Location. Cannot insert new Agency-Location association."});
                        });
                })
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
        const agenciesJoinQuery = "SELECT * FROM `users` LEFT OUTER JOIN `Agencies` ON users.id = Agencies.userId \
                                    UNION ALL SELECT * FROM `users` \
                                    RIGHT OUTER JOIN `Agencies` ON users.id = Agencies.userId";
        return sequelize
            .query(agenciesJoinQuery, {
                replacements: {userId: currentUserId},
                type: sequelize.QueryTypes.SELECT
            })
            .then(users => {
                if(users.length === 0){
                    return new Error("User does not exist");
                }

                // search for row / info for current user
                const targetUser = users.filter(user => user.id === currentUserId);
                return targetUser[0];
            });
    }
    else if(userType === 2){
        // join with Locations table
        const locationsJoinQuery = "SELECT * FROM `users` LEFT OUTER JOIN `Locations` ON users.id = Locations.userId \
                                    UNION ALL SELECT * FROM `users` \
                                    RIGHT OUTER JOIN `Locations` ON users.id = Locations.userId";
        return sequelize
            .query(locationsJoinQuery, {
                replacements: {userId: currentUserId},
                type: sequelize.QueryTypes.SELECT
            })
            .then(users => {
                if(users.length === 0){
                    return new Error("User does not exist");
                }

                // search for row / info for current user
                const targetUser = users.filter(user => user.id === currentUserId);
                return targetUser[0];
            });
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
            else{
                // return error if user is neither an agency or a location
                return new Error("Current User is neither an Agency nor a Location");
            }
        })
        .catch(error => res.status(400).send(error));
}

module.exports = {
    addAssociation,
    deleteAssociation,
    retrieveAssociation
};