const SpecialtyItem = require('../models').SpecialtyItem;

function create(req, res){
    return SpecialtyItem
        .create({
            description: req.body.description
        })
        .then(specialty => res.status(200).send({message: `Successfully added new specialty, ${specialty.description}.`, added: specialty}))
        .catch(error => res.status(400).send(error));
}

function list(req, res){
    return SpecialtyItem
        .findAll()
        .then(specialties => res.status(200).send(specialties))
        .catch(error => res.status(400).send(error));
}

function destroy(req, res){
    return SpecialtyItem
        .findOne({where: {id: req.body.id}})
        .then(specialty => {
            if(!specialty){
                return res.status(404).send({message: "Specialty Not Found."})
            }
            
            return specialty
                .destroy()
                .then(() => res.status(200).send({message: "Specialty Deleted."}))
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error))
}

module.exports = {
    create,
    list,
    destroy
};