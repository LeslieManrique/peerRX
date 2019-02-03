const Agency = require('../models').Agency;
const {getCoordinatePoint} = require('../helpers/geocode');
const User = require('../models').users;
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

// list agencies
function list(req, res){
    return Agency
        .findAll({
            attributes: ['address1', 'address2', 'city', 'state', 'zipcode', 'coordinate_point','userId']
        })
        .then(agencies => res.status(200).send(agencies))
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
            sequelize
                .query('SELECT * FROM `users` WHERE id=:userId', {
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
                .then(allAgencyInfo => {
                    return res.status(200).send(allAgencyInfo);
                });
        })
        .catch(error => res.status(400).send(error))
}

// update specified agency info
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

            return agency
                .update(req.body, {
                    fields: Object.keys(req.body)                 
                })
                .then(updatedAgency => res.status(200).send(updatedAgency))
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}

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