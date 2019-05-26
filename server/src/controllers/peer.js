const peer = require('../models').peers;
const agencyPeers = require('../models').agencyPeers;
const users = require('../models').users;
const {getGivenUserInfoAll, getUserId, usersLeftJoin, getGivenUserInfo, 
    usersInnerJoin, deleteGivenUser, updateGivenUserEmail, getUserTypeName} = require('../helpers/queryFunctions');
const {getCoordinatePoint} = require('../helpers/geocode');
// add new peer
const create = async(req, res) =>{
    console.log("peer --- ", peer);
    const user = await users.findOne({where:{id:req.params.userId}});
    // console.log(user)
    if(!user){
        return res.status(400).send({message: "UserId does not exist"});
    }
    const role = await getUserTypeName(user.user_type); 
    console.log("Role -- ", role);
    if(role !== 'location' && role !== 'agency'){
        return res.status(400).send({message: "User does not support peer association"});
    }

    const peer_found = await peer.findOne({where: {user_id: parseInt(req.params.userId), email_address: req.body.email_address}});
    
    if(peer_found){
        console.log("Peer already exists");
        return res.status(400).send({message: "Peer already exists."});
    }
    else{
        console.log("Peer does not exist")
    }

    return peer
            .create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email_address: req.body.email_address,
                phone_number: req.body.phone_number,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zip,
                specialty: req.body.specialty,
                age_range_start: req.body.age_range_start,
                age_range_end: req.body.age_range_end,
                language: req.body.language,
                gender: req.body.gender,
                certification: req.body.certification,
                certification_expiration_date: req.body.certification_expiration_date,
                licensure: req.body.licensure,
                training_1: req.body.training_1,
                training_2: req.body.training_2,
                training_3: req.body.training_3,
                supervisor_name: req.body.supervisor_name,
                supervisor_phone_number: req.body.supervisor_phone_number,
                coordinate_point: 'LAT, LON',
                user_id: parseInt(req.params.userId)
            })
            .then(peer => {
                console.log("success!", peer);
                return res.status(200).send("New Peer Created");
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error)
            });
}

// list peers
const list = async(req, res) => {
    console.log("list function");
    const user = await users.findOne({where:{id:req.params.userId}});
    if(req.query.peerId){
        console.log(req.query.peerId);
        return peer.findAll({where:{user_id:parseInt(req.params.userId), peer_id: parseInt(req.query.peerId)}})
                .then(peers => {
                    return res.status(200).send(peers); 
                })
                .catch(error => res.status(400).send(error));
    }
    else{
        console.log(req.query);
        return peer.findAll({where:{user_id:req.params.userId}})
            .then(peers => {
                return res.status(200).send(peers); 
            })
            .catch(error => res.status(400).send(error));
    }
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
const update = async(req, res) =>{
    console.log("peer --- ", peer);
    const user = await users.findOne({where:{id:req.params.userId}});
    // console.log(user)
    if(!user){
        return res.status(400).send({message: "UserId does not exist"});
    }
    const role = await getUserTypeName(user.user_type); 
    
    console.log("Role -- ", role);
    if(role !== 'location' && role !== 'agency'){
        return res.status(400).send({message: "User does not support peer association"});
    }

    const peer_found = await peer.findOne({where: {user_id: parseInt(req.params.userId), peer_id: req.params.peerId}});
    console.log(peer_found); 
    if(!peer_found){
        console.log("Peer does not exists");
        return res.status(400).send({message: "Peer does not exist."});
    }
   
    return peer_found
            .update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email_address: req.body.email_address,
                phone_number: req.body.phone_number,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zipcode,
                specialty: req.body.specialty,
                age_range_start: req.body.age_range_start,
                age_range_end: req.body.age_range_end,
                language: req.body.language,
                gender: req.body.gender,
                certification: req.body.certification,
                certification_expiration_date: req.body.certification_expiration_date,
                licensure: req.body.licensure,
                training_1: req.body.training_1,
                training_2: req.body.training_2,
                training_3: req.body.training_3,
                supervisor_name: req.body.supervisor_name,
                supervisor_phone_number: req.body.supervisor_phone_number,
                coordinate_point: getCoordinatePoint(req.body.address1, req.body.address2, 
                                                    req.body.city, req.body.state, req.body.zipcode),
            })
            .then(peer => {
                console.log("success!", peer);
                return res.status(200).send("Peer Updated");
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error)
            });
}
// // update specified peer info (allows updates in users table too)
// function update(req, res){
//     return Peer
//         .findOne({
//             where: getUserId(req)
//         })
//         .then(peer => {
//             if(!peer){
//                 return new Error('Peer Not Found');
//             }

//             // update Peers table entries, then update users table entries
//             // get and send the updated info from both Peers and users table 
//             return peer
//                 .update(req.body, {
//                     fields: Object.keys(req.body)                 
//                 })
//                 .then(updatedPeer => {
//                     const updatedPeerInfo = updatedPeer.dataValues;
//                     return getAllUpdatedInfo(updatedPeerInfo, req);
//                 })
//                 .catch(error => error);
//         })
//         .then(updatedPeer => {
//             if(updatedPeer instanceof Error){
//                 return res.status(400).send({message: updatedPeer.message});
//             }
//             return res.status(200).send(updatedPeer);
//         })
//         .catch(error => res.status(400).send(error));
// }
const destroy = async(req, res) =>{
    console.log("peer --- ", peer);
    const user = await users.findOne({where:{id:req.params.userId}});
    // console.log(user)
    if(!user){
        return res.status(400).send({message: "UserId does not exist"});
    }
    const role = await getUserTypeName(user.user_type); 
    
    console.log("Role -- ", role);
    if(role !== 'location' && role !== 'agency'){
        return res.status(400).send({message: "User does not support peer association"});
    }

    const peer_found = await peer.findOne({where: {user_id: parseInt(req.params.userId), peer_id: req.params.peerId}});
    if(!peer_found){
        console.log("Peer does not exists");
        return res.status(400).send({message: "Peer does not exist."});
    }
    else{
        return peer_found
            .destroy()
            .then(()=>{
                res,status(200).send({message: "Peer deleted"});
            })
            .catch((error)=>{
                res.status(400).send(error);
            })
    }
   
}
// // delete specified peer from Peers and users tables
// function destroy(req,res){
//     const currentUserId = req.params.userId;
//     return Peer
//         .findOne({ where: getUserId(req) })
//         .then(peer => {
//             if(!peer){
//                 return res.status(201).send({ message: 'Peer Not Found' });
//             }

//             return peer
//                 .destroy()
//                 .then(() => {
//                     // delete peer from users table
//                     return deleteGivenUser(currentUserId)
//                 })
//                 .then(deletedUserMessage => {res.status(200).send({message: deletedUserMessage.message + " Success! Peer Deleted."})})
//                 .catch(error => res.status(400).send(error))
//         })
//         .catch(error => res.status(400).send(error));
// }

module.exports = {
    create,
    update,
    list,
    destroy
};