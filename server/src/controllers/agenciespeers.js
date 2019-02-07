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

// get what type of user currently signed in as to determine which values are going to be peerId and agencyId
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
                    peerId: parseInt(req.body.peerId),
                    agencyId: currentUserId
                }
            }
            // user type 0 is Peer
            else if(userType === 0){
                console.log("Current user is a Peer.");
                return {
                    peerId: currentUserId,
                    agencyId: parseInt(req.body.agencyId)
                }
            }
            else{
                // return error if user is neither an agency or a peer
                return new Error("Current User is neither an Agency nor a Peer");
            } 
        });
}

// get condition using user type using userId and add new agency-peer association
function addAssociation(req, res){
    const currentUserId = parseInt(req.params.userId);
    getConditions(currentUserId, req)
        .then(conditionJSON => {
            if(conditionJSON instanceof Error){
                return res.status(404).send({message: conditionJSON.message});
            }

            // check if association already within table before inserting
            const selectAssociationQuery = "SELECT * FROM `AgenciesPeers` WHERE agencyId=:agencyId AND peerId=:peerId";
            sequelize
                .query(selectAssociationQuery, {
                    replacements: conditionJSON,
                    type: sequelize.QueryTypes.SELECT
                })
                .then(associations => {
                    if(associations.length !== 0){
                        return res.status(404).send({message: 'Agency-Peer association already exists!'});
                    }

                    //Check that new associated user is an agency or peer type
                    findUserType(currentUserId)
                        .then(userType => {
                            // get the current user type. if agency, then only add in if peerId id is a peer
                            if(userType === 1){
                                console.log("I am an Agency");
                                const peerId = conditionJSON.peerId;
                                findUserType(peerId)
                                    .then(otherUserType => {
                                        if(otherUserType === 0){
                                            // raw query to insert new association if not already existing
                                            const insertAgencyPeerQuery = "INSERT INTO `AgenciesPeers` (peerId, agencyId) VALUES (:peerId, :agencyId)";
                                            sequelize
                                                .query(insertAgencyPeerQuery, {
                                                    replacements: conditionJSON,
                                                    type: sequelize.QueryTypes.INSERT
                                                })
                                                .then(() => res.status(200).send({message: "Success! New Agency-Peer association created."}));
                                        }
                                        return res.status(400).send({message: "Can't create association to Agency with non-Peer user."});
                                    })
                                    .catch(error => console.log(error));
                            }
                            else if(userType === 0){
                                console.log("I am a Peer");
                                const agencyId = conditionJSON.agencyId;
                                findUserType(agencyId)
                                    .then(otherUserType => {
                                        if(otherUserType === 1){
                                            // raw query to insert new association if not already existing
                                            const insertAgencyPeerQuery = "INSERT INTO `AgenciesPeers` (peerId, agencyId) VALUES (:peerId, :agencyId)";
                                            sequelize
                                                .query(insertAgencyPeerQuery, {
                                                    replacements: conditionJSON,
                                                    type: sequelize.QueryTypes.INSERT
                                                })
                                                .then(() => res.status(200).send({message: "Success! New Agency-Peer association created."}));
                                        }
                                        return res.status(400).send({message: "Can't create association to Peer with non-Agency user."});
                                    });
                            }
                            
                            return res.status(400).send({message: "User is neither Agency nor Peer. Cannot insert new Agency-Peer association."});
                        });
                })
        })
        .catch(error => res.status(400).send(error));
}

// delete an association by querying for peer ID and agency ID
function deleteAssociation(req, res){
    const currentUserId = req.params.userId;
    getConditions(currentUserId, req)
        .then(conditionJSON => {
            const deleteAssociationQuery = "DELETE FROM `AgenciesPeers` WHERE agencyId=:agencyId AND peerId=:peerId";
            return sequelize
                .query(deleteAssociationQuery, {
                    replacements: conditionJSON,
                    type: sequelize.QueryTypes.DELETE
                });
        })
        .then(() => res.status(200).send({message: "Success! Agency-Peer association deleted."}))
        .catch(error => res.status(400).send(error));
}

// do a full outer join between users table and Agencies table OR 
// a full outer join between users and Peers to get full info
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
    else if(userType === 0){
        // join with Peers table
        const peersJoinQuery = "SELECT * FROM `users` LEFT OUTER JOIN `Peers` ON users.id = Peers.userId \
                                    UNION ALL SELECT * FROM `users` \
                                    RIGHT OUTER JOIN `Peers` ON users.id = Peers.userId";
        return sequelize
            .query(peersJoinQuery, {
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
    return Promise.resolve("User is neither an Agency nor a Peer.");
}

// get associated agencies of a peer or associated peers of an agency
function getAssociatedUsers(selectionQuery, currentUserId, res){
    return sequelize
        .query(selectionQuery, {
            replacements: {userId: currentUserId},
            type: sequelize.QueryTypes.SELECT
        })
        .then(results => {
            const associatedUsersInfo = results.map((associatedUser) => {
                const associatedUserId = associatedUser.peerId || associatedUser.agencyId;
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

// find associated peers for given agency
// find associated agencies for given peer
// takes userId and gets the user type from users table to determine what to  query for
function retrieveAssociation(req, res){
    const currentUserId = parseInt(req.params.userId);
    findUserType(currentUserId)
        .then(userType => {
            // return error if user not found in users table
            if(userType instanceof Error){
                return userType
            }

            // if user is an agency then look for list of associated peers
            if(userType === 1){
                const selectPeersByAgency = "SELECT peerId FROM `AgenciesPeers` WHERE agencyId=:userId";
                getAssociatedUsers(selectPeersByAgency, currentUserId, res);
            }
            // if user is a peer then look for list of associated agencies
            else if(userType === 0){
                const selectAgenciesByPeer = "SELECT agencyId FROM `AgenciesPeers` WHERE peerId=:userId";
                getAssociatedUsers(selectAgenciesByPeer, currentUserId, res);
            }
            else{
                // return error if user is neither an agency or a peer
                return new Error("Current User is neither an Agency nor a Peer");
            }
        })
        .catch(error => res.status(400).send(error));
}

module.exports = {
    addAssociation,
    deleteAssociation,
    retrieveAssociation
};