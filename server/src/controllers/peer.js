const Peer = require('../models').Peer;
const {getGivenUserInfoAll, getUserId, usersLeftJoin, getGivenUserInfo, 
    usersInnerJoin, deleteGivenUser, updateGivenUserEmail} = require('../helpers/queryFunctions');
// user type 0 is a peer
const PEER_TYPE = 0; 

// add new peer
function create(req, res){
    return Peer
        .findOne({where: getUserId(req)})
        .then(users => {
            // check that it is not already in Peer table
            if(users){
                return res.status(201).send({message: "Peer already exists."});
            }

            // check that userId exists in users table
            getGivenUserInfo(req.params.userId)
                .then(user => {
                    if(user){
                        // check that user is a Peer before adding to Peer table
                        if(user.user_type !== PEER_TYPE){
                            return res.status(201).send({message: "User not a Peer"});
                        }

                        return Peer
                            .create({
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                phone_number: req.body.phone_number,
                                certifications: req.body.certifications,
                                training_certs: req.body.training_certs,
                                userId: req.params.userId
                            })
                            .then(peer => res.status(200).send(peer))
                            .catch(error => res.status(400).send(error));
                    }
                    else{
                        return res.status(201).send({message: "User Not Found"});
                    }
                });
        })
        .catch(error => res.status(400).send(error));
}

// list peers
function list(req, res){
    usersLeftJoin("Peers")
        .then(users => {
            const peers = users.filter(user => {
                return user.user_type === PEER_TYPE;
            });
            return res.status(200).send(peers);
        })
        .catch(error => res.status(400).send(error));
}

// retrieve info of specified peer
function retrieve(req, res){
    const peerId = parseInt(req.params.userId);
    getGivenUserInfoAll(peerId, "Peers")
        .then(peer => {
            if(!peer){
                return res.status(201).send({message: 'User Not Found'});
            }

            //check that user is an Peer
            if(peer.user_type !== PEER_TYPE){
                return res.status(201).send({message: "No Peer with given ID exists."})
            }

            return res.status(200).send(peer);
        })
        .catch(error => res.status(400).send(error));
}

// update user info for specified user
function getAllUpdatedInfo(user, req){
    const currentUserId = user.userId;
    return updateGivenUserEmail(user, req)
        .then(result => {
            console.log(result.message);

            // return the joined full info of updated peer
            return usersInnerJoin("Peers")
                .then(users => {
                    const specifiedUser = users.filter(user => {
                        return user.id === currentUserId;
                    });
                    return specifiedUser[0];
                });
        })
        .catch(error => error);
}

// update specified peer info (allows updates in users table too)
function update(req, res){
    return Peer
        .findOne({
            where: getUserId(req)
        })
        .then(peer => {
            if(!peer){
                return new Error('Peer Not Found');
            }

            // update Peers table entries, then update users table entries
            // get and send the updated info from both Peers and users table 
            return peer
                .update(req.body, {
                    fields: Object.keys(req.body)                 
                })
                .then(updatedPeer => {
                    const updatedPeerInfo = updatedPeer.dataValues;
                    return getAllUpdatedInfo(updatedPeerInfo, req);
                })
                .catch(error => error);
        })
        .then(updatedPeer => {
            if(updatedPeer instanceof Error){
                return res.status(400).send({message: updatedPeer.message});
            }
            return res.status(200).send(updatedPeer);
        })
        .catch(error => res.status(400).send(error));
}

// delete specified peer from Peers and users tables
function destroy(req,res){
    const currentUserId = req.params.userId;
    return Peer
        .findOne({ where: getUserId(req) })
        .then(peer => {
            if(!peer){
                return res.status(201).send({ message: 'Peer Not Found' });
            }

            return peer
                .destroy()
                .then(() => {
                    // delete peer from users table
                    return deleteGivenUser(currentUserId)
                })
                .then(deletedUserMessage => {res.status(200).send({message: deletedUserMessage.message + " Success! Peer Deleted."})})
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