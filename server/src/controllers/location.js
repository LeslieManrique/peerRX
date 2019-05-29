const location = require('../models').locations;
const users = require('../models').users;
const {getCoordinatePoint} = require('../helpers/geocode');
const {getUserId, usersLeftJoin, usersInnerJoin, getGivenUserInfoAll,
        getGivenUserInfo, deleteGivenUser, updateGivenUserEmail, isAddressChanged, getUserProfile, registerUser, getUserTypeFromName, getDataByParam} = require('../helpers/queryFunctions');

// user type 2 is a location -- replace this with query 
// const LOCATION_TYPE = 2;
// const LOCATION_TYPE_NAME = 'Location'

const get_type = async() => { LOCATION_TYPE =  await getUserTypeFromName('location')};
const location_name = 'location'
// add new location profile 
const create = async(req, res)=>{
    let registration_id = '';

    try{
        registration_id = await registerUser(req, res);
    }
    catch(error){
        console.log(error);
        return res.status(400).send(error);
    }
    if(registration_id == null){
        return res.status(400).send("user could not be registered");
    }
    const LOCATION_TYPE = await getUserTypeFromName(location_name);
    return location
        .findOne({where: {location_id: registration_id}})
        .then(user => {
            // check that it is not already in Location table
            if(user){
                return res.status(201).send({"message": "Location already exists."});
            }

            // check that userId exists in users table
            getGivenUserInfo(registration_id)
                .then(user => {
                    if(user){
                        // check that user is a Location before adding to Location table
                        if(parseInt(user.user_type) !== LOCATION_TYPE){
                            return res.status(201).send({"message": "User not a Location"});
                        }

                        return location
                            .create({
                                name: req.body.name,
                                phone_number: req.body.phone_number,
                                address1: req.body.address1,
                                address2: req.body.address2,
                                city: req.body.city,
                                state: req.body.state,
                                zipcode: req.body.zipcode,
                                coordinate_point: getCoordinatePoint(req.body.address1, req.body.address2, 
                                                    req.body.city, req.body.state, req.body.zipcode),
                                location_id: parseInt(registration_id),
                                main_contact_first_name: req.body.main_contact_first_name,
                                main_contact_last_name: req.body.main_contact_last_name,
                                main_contact_phone_number: req.body.main_contact_phone_number,
                                main_contact_email_address: req.body.main_contact_email_address,
                                on_site_peers: req.body.on_site_peers,
                                location_type: req.body.location_type
                            })
                            .then(location => res.status(201).send(location))
                            .catch(error => {
                                //delete created id
                                users.destroy({where:{id:registration_id}});
                                res.status(400).send(error)
                            });
                    }
                    else{
                        users.destroy({where:{id:registration_id}});
                        return res.status(201).send({"message": "User Not Found"});
                    }
                });
        })
        .catch(error => {
            console.log(error);
            users.destroy({where:{id:registration_id}});
            res.status(400).send(error)
        });
}

// list locations
// function list(req, res){

//     usersLeftJoin("Locations")
//         .then(users => {
//             const locations = users.filter(user => {
//                 return user.user_type === LOCATION_TYPE;
//             });
//             res.status(200).send(locations);
//         })
//         .catch(error => res.status(400).send(error));
// }

// retrieve info of specified location
function retrieve(req, res){
    const locationId = parseInt(req.params.userId);
    const location_type = getUserTypeFromName(location_name);
    console.log("location type = ", location_type);
    // getGivenUserInfoAll(locationId, "Locations")
    getUserProfile(locationId, "Locations")
        .then(location => {
            if(!location){
                return res.status(404).send({"message": 'User Not Found'});
            }
            //check that user is an Location
            if(location.user_type_name !== LOCATION_TYPE_NAME){
                return res.status(404).send({"message": "No Location with given ID exists."})
            }

            return res.status(200).send(location);
        })
        .catch(error => res.status(400).send(error));
}

// retrieve public agency data 
const getLocations = async(req, res) =>{
    console.log("Getting locations");
    const table = 'locations';
    const obj = {}
    console.log(req);
    if(req.query.state){
        console.log("1");
        obj.state = req.query.state;
    }
    if(req.query.zipcode){
        console.log("2");
        obj.zipcode = req.query.zipcode;
    }
    try{
        const data = await getDataByParam(obj, table);
        return res.status(200).send(data)
    }
    catch(error){
        console.log(error);
        return res.status(400).send(error);
    }

}
// update user info for specified user
function getAllUpdatedInfo(user, req){
    const currentUserId = user.userId;
    return updateGivenUserEmail(user, req)
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
    return location
        .findOne({
            where: {location_id: parseInt(req.params.userId)}
        })
        .then(location => {
            if(!location){
                return new Error('Location Not Found');
            }
            return location
            .update(req.body, {
                fields: Object.keys(req.body)                 
            })
            .then(updatedLocation => {
                console.log("successful")
                return res.status(200).send(updatedLocation);
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
            res.status(400).send(error)
        });
}
function destroy(req, res){
    return users
      .findOne({where: {id: parseInt(req.params.userId)}})
      .then(user => {
        if(!user){
          return res.status(201).send({message: 'User Not Found'});
        }
  
        return user
          .destroy()
          .then(() => res.status(200).send({message: 'Success! User Deleted.'}))
          .catch(error => res.status(400).send(error));
      });
  }
// delete specified location from Locations and users tables
// function destroy(req,res){
//     const currentUserId = parseInt(req.params.userId);
//     return location
//         .findOne({ where: {location_id: currentUserId} })
//         .then(location => {
//             if(!location){
//                 return res.status(201).send({ "message": 'Location Not Found' });
//             }

//             return location
//                 .destroy()
//                 .then(() => {
//                     // delete location from users table
//                     return deleteGivenUser(currentUserId)
//                 })
//                 .then(deletedUserMessage => {res.status(200).send({message: deletedUserMessage.message + " Success! Location Deleted."})})
//                 .catch(error => res.status(400).send(error))
//         })
//         .catch(error => res.status(400).send(error));
// }

module.exports = {
    create,
    update,
    getLocations,
    //list,
    destroy,
    retrieve
};