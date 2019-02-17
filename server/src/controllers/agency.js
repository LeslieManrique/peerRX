const Agency = require('../models').Agency;
const {getCoordinatePoint} = require('../helpers/geocode');
const {getGivenUserInfoAll, getUserId, usersLeftJoin, getGivenUserInfo, 
        usersInnerJoin, deleteGivenUser, updateGivenUserEmail, isAddressChanged} = require('../helpers/queryFunctions');
// constant, user type 1 is agency
const AGENCY_TYPE = 1;

// add new agency
function create(req, res){
    return Agency
        .findOne({where: getUserId(req)})
        .then(users => {
            // check that it is not already in Agency table
            if(users){
                console.log(users.dataValues);
                return res.status(400).send({message: "Agency already exists."});
            }

            // check that userId exists in users table
            getGivenUserInfo(req.params.userId)
                .then(user => {
                    if(user){
                        if(user.user_type !== AGENCY_TYPE){
                            return res.status(201).send({message: "User not an Agency"});
                        }

                        return Agency
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
                                userId: req.params.userId
                            })
                            .then(agency => res.status(201).send(agency))
                            .catch(error => res.status(400).send(error));
                    }
                    else{
                        return res.status(201).send({message: "User Not Found"});
                    }
                });
        })
        .catch(error => res.status(400).send(error));
}

// list agencies
function list(req, res){
    usersLeftJoin("Agencies")
        .then(users => {
            const agencies = users.filter(user => {
                return user.user_type === AGENCY_TYPE;
            });
            res.status(200).send(agencies);
        })
        .catch(error => res.status(400).send(error));
}

// retrieve info of specified agency
function retrieve(req, res){
    const agencyId = parseInt(req.params.userId);
    getGivenUserInfoAll(agencyId, "Agencies")
        .then(agency => {
            if(!agency){
                return res.status(404).send({message: 'User Not Found'});
            }

            //check that user is an Agency
            if(agency.user_type !== AGENCY_TYPE){
                return res.status(400).send({message: "No Agency with given ID exists."})
            }

            return res.status(200).send(agency);
        })
        .catch(error => res.status(400).send(error));
}

// update user info for specified user and return all of users info
function getAllUpdatedInfo(user, req){
    const currentUserId = user.userId;
    return updateGivenUserEmail(user, req)
        .then(result => {
            console.log(result.message);

            // return the joined full info of updated agency with user info
            return usersInnerJoin("Agencies")
                .then(users => {
                    const specifiedUser = users.filter(user => {
                        return user.id === currentUserId;
                    });
                    return specifiedUser[0];
                });
        })
        .catch(error => error);
}

// update specified agency info (allows updates in users table too)
function update(req, res){
    return Agency
        .findOne({
            where: getUserId(req)
        })
        .then(agency => {
            if(!agency){
                return new Error('Agency Not Found');
            }

            // check if address changed
            if(isAddressChanged(agency, req)){
                // updated req.body with new coordinate_point
                const newCoords = getCoordinatePoint(req.body.address1, req.body.address2, 
                    req.body.city, req.body.state, req.body.zipcode);
                req.body["coordinate_point"] = newCoords;
            }

            // update Agencies table entries, then update users table entries
            // get and send the updated info from both Agencies and users table 
            return agency
                .update(req.body, {
                    fields: Object.keys(req.body)                 
                })
                .then(updatedAgency => {
                    const updatedAgencyInfo = updatedAgency.dataValues;
                    return getAllUpdatedInfo(updatedAgencyInfo, req);
                })
                .catch(error => error);
        })
        .then(updatedAgency => {
            if(updatedAgency instanceof Error){
                return res.status(400).send({message: updatedAgency.message});
            }
            return res.status(200).send(updatedAgency);
        })
        .catch(error => res.status(400).send(error));
}

// delete specified agency from Agencies and users tables
function destroy(req,res){
    const currentUserId = req.params.userId;
    return Agency
        .findOne({ where: getUserId(req) })
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
    retrieve
};