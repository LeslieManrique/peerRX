const sequelize = require('../models').sequelize;
const {findUserType, getGivenUserInfoAll} = require('../helpers/queryFunctions');

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

// check if association already exists (given agency id and peer id)
function checkExisting(identifications){
    const selectAssociationQuery = "SELECT * FROM `AgenciesPeers` WHERE agencyId=:agencyId AND peerId=:peerId";
    return sequelize
        .query(selectAssociationQuery, {
            replacements: identifications,
            type: sequelize.QueryTypes.SELECT
        })
        .then(associations => {
            if(associations.length !== 0){
                return new Error('Agency-Peer association already exists!');
            }

            //return the agencyId and peerId if association not found
            return identifications;
        })
        .catch(error => console.log(error));
}

// insert association into AgenciesPeers table
function insertAssociation(association){
    // raw query to insert new association
    const insertAgencyPeerQuery = "INSERT INTO `AgenciesPeers` (peerId, agencyId) VALUES (:peerId, :agencyId)";
    return sequelize
        .query(insertAgencyPeerQuery, {
            replacements: association,
            type: sequelize.QueryTypes.INSERT
        })
        .then(() => {
            return {message: "Success! New Agency-Peer association created."}
        })
        .catch(error => error);
}

// get condition using user type using userId and add new agency-peer association
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

            //Check that new associated user is an agency or peer type
            findUserType(currentUserId)
                .then(userType => {
                    // if not Agency or Peer, cannot add
                    if(userType !== 1 && userType !== 0){
                        return res.status(400).send({message: "User is neither Agency nor Peer. Cannot insert new Agency-Peer association."});
                    }

                    // get the current user type. if agency, then only add in if other user is a peer
                    if(userType === 1){
                        console.log("I am an Agency");

                        // verify that other user is actually a peer
                        const peerId = association.peerId;
                        findUserType(peerId)
                            .then(otherUserType => {
                                if(otherUserType === 0){
                                    // raw query to insert new association if not already existing
                                    return insertAssociation(association);
                                }
                                return new Error("Cannot associate non-Peer user to Agency.");
                            })
                            .then(result => {
                                if(result instanceof Error){
                                    return res.status(400).send({message: result.message});
                                }
                                return res.status(200).send(result);
                            })
                            .catch(error => res.status(400).send(error));
                    }
                    else if(userType === 0){
                        console.log("I am a Peer");

                        // verify that other user is actually an agency
                        const agencyId = association.agencyId;
                        findUserType(agencyId)
                            .then(otherUserType => {
                                if(otherUserType === 1){
                                    // raw query to insert new association if not already existing
                                    return insertAssociation(association); 
                                }  
                                return new Error("Cannot associate non-Agency user to Peer.");
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
        return getGivenUserInfoAll(currentUserId, "Agencies");
    }
    else if(userType === 0){
        // join with Peers table
        return getGivenUserInfoAll(currentUserId, "Peers");
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
                return res.status(200).send({message: "User's user type not found."});
            }

            if(userType !== 0 && userType !== 1){
                // return error if user is neither an agency or a peer
                return res.status(200).send({message: "Current User is neither an Agency nor a Peer"});
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
        })
        .catch(error => res.status(400).send(error));
}

module.exports = {
    addAssociation,
    deleteAssociation,
    retrieveAssociation
};