const peer = require('../models').peers;
const agencyPeers = require('../models').agencyPeers;
const users = require('../models').users;
const peer_language = require('../models').peer_language;

const { getGivenUserInfoAll, getUserId, usersLeftJoin, getGivenUserInfo,
    usersInnerJoin, deleteGivenUser, updateGivenUserEmail, getUserTypeName } = require('../helpers/queryFunctions');
const { getCoordinatePoint } = require('../helpers/geocode');
// add new peer
const create = async (req, res) => {
    console.log("peer --- ", peer);
    const user = await users.findOne({ where: { id: req.params.userId } });
    // console.log(user)
    if (!user) {
        return res.status(400).send({ message: "UserId does not exist" });
    }
    const role = await getUserTypeName(user.user_type);
    console.log("Role -- ", role);
    if (role !== 'location' && role !== 'agency') {
        return res.status(400).send({ message: "User does not support peer association" });
    }

    const peer_found = await peer.findOne({ where: { user_id: parseInt(req.params.userId), email_address: req.body.email_address } });

    if (peer_found) {
        console.log("Peer already exists");
        return res.status(400).send({ message: "Peer already exists." });
    }
    else {
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
const list = async (req, res) => {
    console.log("list function");
    const user = await users.findOne({ where: { id: req.params.userId } });
    if (req.query.peerId) {
        console.log(req.query.peerId);
        return peer.findAll({ where: { user_id: parseInt(req.params.userId), peer_id: parseInt(req.query.peerId) } })
            .then(peers => {
                return res.status(200).send(peers);
            })
            .catch(error => res.status(400).send(error));
    }
    else {
        console.log(req.query);
        return peer.findAll({ where: { user_id: req.params.userId } })
            .then(peers => {
                return res.status(200).send(peers);
            })
            .catch(error => res.status(400).send(error));
    }
}



// retrieve info of specified peer
// function retrieve(req, res){
//     const peerId = parseInt(req.params.userId);
//     getGivenUserInfoAll(peerId, "Peers")
//         .then(peer => {
//             if(!peer){
//                 return res.status(201).send({message: 'User Not Found'});
//             }

//             //check that user is a Peer
//             if(peer.user_type !== PEER_TYPE){
//                 return res.status(201).send({message: "No Peer with given ID exists."})
//             }

//             return res.status(200).send(peer);
//         })
//         .catch(error => res.status(400).send(error));
// }

// update user info for specified user
// function getAllUpdatedInfo(user, req){
//     const currentUserId = user.userId;
//     return updateGivenUserEmail(user, req)
//         .then(result => {
//             console.log(result.message);

//             // return the joined full info of updated peer
//             return usersInnerJoin("Peers")
//                 .then(users => {
//                     const specifiedUser = users.filter(user => {
//                         return user.id === currentUserId;
//                     });
//                     return specifiedUser[0];
//                 });
//         })
//         .catch(error => error);
// }
const update = async (req, res) => {
    console.log("peer --- ", peer);
    const user = await users.findOne({ where: { id: req.params.userId } });
    // console.log(user)
    if (!user) {
        return res.status(400).send({ message: "UserId does not exist" });
    }
    const role = await getUserTypeName(user.user_type);

    console.log("Role -- ", role);
    if (role !== 'location' && role !== 'agency') {
        return res.status(400).send({ message: "User does not support peer association" });
    }

    const peer_found = await peer.findOne({ where: { user_id: parseInt(req.params.userId), peer_id: req.params.peerId } });
    console.log(peer_found);
    if (!peer_found) {
        console.log("Peer does not exists");
        return res.status(400).send({ message: "Peer does not exist." });
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

const destroy = async (req, res) => {
    console.log("peer --- ", peer);
    const user = await users.findOne({ where: { id: req.params.userId } });
    // console.log(user)
    if (!user) {
        return res.status(400).send({ message: "UserId does not exist" });
    }
    const role = await getUserTypeName(user.user_type);

    console.log("Role -- ", role);
    if (role !== 'location' && role !== 'agency') {
        return res.status(400).send({ message: "User does not support peer association" });
    }

    const peer_found = await peer.findOne({ where: { user_id: parseInt(req.params.userId), peer_id: req.params.peerId } });
    if (!peer_found) {
        console.log("Peer does not exists");
        return res.status(400).send({ message: "Peer does not exist." });
    }
    else {
        return peer_found
            .destroy()
            .then(() => {
                res, status(200).send({ message: "Peer deleted" });
            })
            .catch((error) => {
                res.status(400).send(error);
            })
    }

}

const createPeer = (req, res, next) => {

    return peer
        .create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email_address: req.body.email_address,
            phone_number: req.body.phone_number,
            address1: req.body.address1,
            //address2: req.body.address2,
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
            available: req.body.available,
            call_center: req.body.call_center,
            on_site_location: req.body.on_site_location,
            rank: req.body.rank,
            //training_2: req.body.training_2,
            //training_3: req.body.training_3,
            supervisor_name: req.body.supervisor_name,
            supervisor_phone_number: req.body.supervisor_phone_number,
            coordinate_point: getCoordinatePoint(req.body.address1, null,
                req.body.city, req.body.state, req.body.zipcode),
            user_id: parseInt(req.body.agency_id)


        })
        .then(peer => {
            let languages = req.body.languages || null;
            let languagesJson = languages.map(function (language) {
                return { "language_id": language, "peer_id": peer.peer_id }
            })

            return peer_language.bulkCreate(languagesJson, { updateOnDuplicate: ["peer_id", "language_id"] })
        })
        .then(results => {
            res.json(results)
        })
        .catch(err => {
            next(err)
        });
}


const updatePeer = async(req, res, next) => {

    const peer_found = await peer.findOne({ where: { peer_id: parseInt(req.body.peerId)}})
    console.log("res: ",peer_found)
    if (!peer_found) {
        console.log("Peer does not exists");
        return res.status(400).send({ message: "Peer does not exist." });
    }
  
    //return res.status(200).send({ message: "Peer  Found" });
    return peer_found
        .update({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email_address: req.body.email_address,
            phone_number: req.body.phone_number,
            address1: req.body.address1,
            //address2: req.body.address2,
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
            available: req.body.available,
            call_center: req.body.call_center,
            on_site_location: req.body.on_site_location,
            rank: req.body.rank,
            //training_2: req.body.training_2,
            //training_3: req.body.training_3,
            supervisor_name: req.body.supervisor_name,
            supervisor_phone_number: req.body.supervisor_phone_number,
            coordinate_point: getCoordinatePoint(req.body.address1, null,
                req.body.city, req.body.state, req.body.zipcode),
            user_id: parseInt(req.body.agency_id)


        })
        .then(peer => {
            let listIdLanguages = req.body.languageIds || null
            listIdLanguages.map(language=>{
                peer_language.destroy({where:{peer_languages_id:language.peer_languages_id}})
                .then(() => {
                    res, status(200).send({ message: "Peer_language_id deleted" });
                })
                .catch((error) => {
                        res.status(400).send(error);
                    })
            })
            
            let languages = req.body.languages || null;
            let languagesJson = languages.map(function (language) {
                return { "language_id": language, "peer_id": peer.peer_id }
            })

            return peer_language.bulkCreate(languagesJson, { updateOnDuplicate: ["peer_id", "language_id"] })
        })
        .then(results => {
            res.json(results)
        })
        .catch(err => {
            next(err)
        });
 
}

module.exports = {
    create,
    update,
    list,
    destroy,
    createPeer,
    updatePeer
};