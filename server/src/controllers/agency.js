const Agency = require('../models').Agency;
const {getCoordinatePoint} = require('../helpers/geocode');
// const User = require('../models').users;
const sequelize = require('../models').sequelize;

// specify agency by user ID
const querySpecificAgency = (req) => {
    return {
        userId: req.params.userId
    };
};

// add new agency
function create(req, res){
    return Agency
        .create({
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

// Get rest of agency user info from users table
// returns the promise from query
function addUserInfo(agency){
    const selectByUserIdQuery = 'SELECT * FROM `users` WHERE id=:userId'
    return sequelize
        .query(selectByUserIdQuery, {
            replacements: {userId: agency.userId},
            type: sequelize.QueryTypes.SELECT
        })
        .then(users => {
            // combine agency info and user info
            userInfo = users[0];
            agencyInfo = agency.dataValues;
            const allAgencyInfo = {
                ...userInfo,
                ...agencyInfo
            };
            
            return allAgencyInfo;
        })
        .catch(error => console.log(error));
}

// list agencies
function list(req, res){
    return Agency
        .findAll({
            attributes: ['address1', 'address2', 'city', 'state', 'zipcode', 'coordinate_point','userId']
        })
        .then(agencies => {
            // resolve all the promises getting user info into one and send that value to page
            const allAgenciesInfo = agencies.map(agency => addUserInfo(agency));
            Promise
                .all(allAgenciesInfo)
                .then(agenciesInfo => {
                    return res.status(200).send(agenciesInfo);
                });
        })
        .catch(error => res.status(401).send(error));
}

// retrieve info of specified agency
function retrieve(req, res){
    return Agency
        .findOne({
            where: querySpecificAgency(req)
        })
        .then(agency => {
            if(!agency){
                return res.status(404).send({
                    message: 'Agency Not Found'
                });
            }

            // Get rest of agency user info from users table
            // addUserInfo returns a promise
            addUserInfo(agency)
                .then(agencyInfo => {
                    return res.status(200).send(agencyInfo);
                });
        })
        .catch(error => res.status(400).send(error))
}

// update user info for specified agency
function updateUserInfo(agency, req){
    const updateByUserIdQuery = 'UPDATE `users` SET first_name = :first_name, last_name = :last_name, email_address = :email_address, phone_number = :phone_number WHERE id=:userId'
    return sequelize
        .query(updateByUserIdQuery, {
            replacements: {
                userId: agency.userId,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email_address: req.body.email_address,
                phone_number: req.body.phone_number
            },
            type: sequelize.QueryTypes.UPDATE
        })
        .then(() => {
            console.log("Successfully Updated!");
        })
        .catch(error => console.log(error));
}

// update specified agency info (allows updates in users table too)
function update(req, res){
    return Agency
        .findOne({
            where: querySpecificAgency(req)
        })
        .then(agency => {
            if(!agency){
                return res.status(404).send({
                    message: 'Agency Not Found'
                });
            }

            // update Agencies table entries, then update users table entries
            // get and send the updated info from both Agencies and users table 
            return agency
                .update(req.body, {
                    fields: Object.keys(req.body)                 
                })
                .then(updatedAgency => updateUserInfo(updatedAgency, req))
                .then(() => addUserInfo(updatedAgency))
                .then(updatedAgencyInfo => {
                    res.status(200).send(updatedAgencyInfo);
                })
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}

// TODO: deleting user entry along with agency entry
// delete specified agency
function destroy(req,res){
    return Agency
        .findOne({where: querySpecificAgency(req)})
        .then(agency => {
            if(!agency){
                return res.status(404).send({
                    message: 'Agency Not Found'
                });
            }

            return agency
                .destroy()
                .then(() => res.status(200).send({message: "Success! Agency Deleted."}))
                .catch(error => res.status(400).send(error))
        })
        .catch(error => res.status(400).send("find error\n" + error))
}

module.exports = {
    create,
    update,
    list,
    destroy,
    retrieve
};