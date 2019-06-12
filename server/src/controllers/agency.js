const agency = require('../models').agencies;
const users = require('../models').users;
const {getCoordinatePoint} = require('../helpers/geocode');
const {getGivenUserInfoAll, getUserId, usersLeftJoin, getGivenUserInfo, 
        usersInnerJoin, deleteGivenUser, updateGivenUserEmail, isAddressChanged, getUserTypeFromName, getUserProfile, getDataByParam, registerUser } = require('../helpers/queryFunctions');
const adminQueries = require('../queries/adminQueries')
// constant, user type 1 is agency
const get_type = async() => { AGENCY_TYPE =  await getUserTypeFromName('agency')};
const agency_name = 'agency'

// add new agency
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
    const AGENCY_TYPE = await getUserTypeFromName(agency_name);
    return agency
        .findOne({where: {agency_id: registration_id}})
        .then(users => {
            // check that it is not already in Agency table
            if(users){
                return res.status(400).send({message: "Agency already exists."});
            }
            // check that userId exists in users table
            getGivenUserInfo(registration_id)
                .then(user => {
                    if(user){
                        if(parseInt(user.user_type) !== AGENCY_TYPE){
                            return res.status(201).send({message: "User not an Agency"});
                        }

                        return agency
                            .create({
                                name: req.body.name,
                                phone_number: req.body.phone_number,
                                country: req.body.country,
                                address1: req.body.address1,
                                address2: req.body.address2,
                                city: req.body.city,
                                state: req.body.state,
                                zipcode: req.body.zipcode,
                                coordinate_point: getCoordinatePoint(req.body.address1, req.body.address2, 
                                                    req.body.city, req.body.state, req.body.zipcode),
                                agency_id: parseInt(registration_id),
                                main_contact_first_name: req.body.main_contact_first_name,
                                main_contact_last_name: req.body.main_contact_last_name,
                                main_contact_phone_number: req.body.main_contact_phone_number,
                                main_contact_email_address: req.body.main_contact_email_address,
                                open_hour:req.body.open_hour,
                                closing_hour:req.body.closing_hour
                            })
                            .then(agency => res.status(201).send(agency))
                            .catch(error => {
                                users.destroy({where:{id:registration_id}});

                                console.log(error);
                                res.status(400).send(error)
                            });
                    }
                    else{
                        users.destroy({where:{id:registration_id}});

                        return res.status(201).send({message: "User Not Found"});
                    }
                });
        })
        .catch(error => {
            users.destroy({where:{id:registration_id}});
            res.status(400).send(error)
        });
}

// list agencies
// todo - delete
const list= async(req, res)=>{
    AGENCY_TYPE = await getUserTypeFromName(agency_name);
    console.log("AGENCY TYPE = ", AGENCY_TYPE);
    console.log("list agencies");
    usersLeftJoin("agencies")
        .then(users => {
            const agencies = users.filter(user => {
                return user.user_type === AGENCY_TYPE;
            });
            res.status(200).send(agencies);
        })
        .catch(error => res.status(400).send(error));
}



// retrieve info of specified agency
const retrieve = async(req, res) =>{
    console.log("retrieving")
    const AGENCY_TYPE = await getUserTypeFromName(agency_name);
    console.log("AGENCY TYPE = ", AGENCY_TYPE);
    const agencyId = parseInt(req.params.userId);
    getUserProfile(agencyId, "agencies")
        .then(agency => {
            if(!agency){
                return res.status(404).send({message: 'User Not Found'});
            }
            console.log("---\n", agency);
            //check that user is an Agency
            if(agency.user_type !== AGENCY_TYPE){
                return res.status(400).send({message: "No Agency with given ID exists."})
            }

            return res.status(200).send(agency);
        })
        .catch(error => res.status(400).send(error));
}

// retrieve public agency data 
const getAgencies = async(req, res) =>{
    console.log("Getting agencies");
    const table = 'agencies';
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

const getAgenciesForAdmin = async(req, res) =>{
    console.log("Getting agencies");
    const table = 'agencies';
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
        const data = await adminQueries.getAgenciesQuery(obj, table);
        return res.status(200).send(data)
    }
    catch(error){
        console.log(error);
        return res.status(400).send(error);
    }

}

// // update user info for specified user and return all of users info
// function getAllUpdatedInfo(user, req){
//     const currentUserId = user.userId;
//     return updateGivenUserEmail(user, req)
//         .then(result => {
//             console.log(result.message);

//             // return the joined full info of updated agency with user info
//             return usersInnerJoin("Agencies")
//                 .then(users => {
//                     const specifiedUser = users.filter(user => {
//                         return user.id === currentUserId;
//                     });
//                     return specifiedUser[0];
//                 });
//         })
//         .catch(error => error);
// }

// update specified agency info (allows updates in users table too)
function update(req, res){
    return agency
        .findOne({where: {agency_id: req.params.userId}})
        .then(agency => {
            if(!agency){
                console.log("no agency found");
                return res.status(400).send({ message: 'Agency Not Found' });
            }
            return agency
                .update(req.body, {
                    fields: Object.keys(req.body)                 
                })
                .then(updatedAgency => {
                    console.log("successful")
                    return res.status(200).send(updatedAgency);
                })
                .catch(error => error);
        })
        .catch(error => res.status(400).send(error));
}

// delete specified agency from Agencies and users tables
function destroy(req,res){
    const currentUserId = req.params.userId;
    return agency
        .findOne({where: {agency_id: req.params.userId}})
        .then(agency => {
            if(!agency){
                return res.status(404).send({ message: 'Agency Not Found' });
            }

            return agency
                .destroy()
                .then(() => {
                    // delete agency from users table
                    return deleteGivenUser(currentUserId)
                })
                .then(deletedUserMessage => {res.status(200).send({message: deletedUserMessage.message + " Success! Agency Deleted."})})
                .catch(error => res.status(400).send(error))
        })
        .catch(error => res.status(400).send(error));
}

module.exports = {
    create,
    update,
    list,
    destroy,
    retrieve,
    getAgencies,
    getAgenciesForAdmin
};