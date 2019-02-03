const Location = require('../models').Location;

// specify location by user ID
const querySpecificLocation = (req) => {
    return {
        userId: req.params.userId
    };
};

// add new location
function create(req, res){
    return Location
        .create({
            location_type: req.body.location_type,
            name: req.body.name,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            userId: req.params.userId
        })
        .then(location => res.status(201).send(location))
        .catch(error => res.status(400).send(error));
}

// list locations
function list(req, res){
    return Location
        .findAll({
            attributes: ['location_type', 'name', 'address1', 'address2', 'city', 'state', 'zipcode', 'userId']
        })
        .then(locations => res.status(201).send(locations))
        .catch(error => res.status(400).send(error));
}

// retrieve specific location info
function retrieve(req, res){
    return Location
        .findOne({
            where: querySpecificLocation(req)
        })
        .then(location => {
            if(!location){
                return res.status(404).send({
                    message: 'Location Not Found!'
                });
            }

            return res.status(200).send(location);
        })
        .catch(error => res.status(400).send(error));
}

// update specific location info
function update(req, res){
    return Location
        .findOne({
            where: querySpecificLocation(req)
        })
        .then(location => {
            if(!location){
                return res.status(404).send({
                    message: 'Location Not Found!'
                });
            }

            return location
                .update(req.body, {
                    fields: Object.keys(req.body)
                })
                .then(updatedLocation => res.status(201).send(updatedLocation))
                .catch(error => res.status(400).send(error));
        })
}

// delete specific location
function destroy(req, res){
    return Location
        .findOne({where: querySpecificLocation(req)})
        .then(location => {
            if(!location){
                return res.state(404).send({message: 'Location Not Found!'})
            }

            return location
                .destroy()
                .then(() => res.status(200).send({message: 'Success! Location Deleted.'}))
                .catch(error => res.status(400).send(error));
        })
        .catch();
}

module.exports = {
    create,
    list,
    retrieve,
    update,
    destroy
};