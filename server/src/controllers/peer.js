const Peer = require('../models').Peer;

// specify peer by user ID
const querySpecificPeer = (req) => {
    return {
        userId: req.params.userId
    };
};

// add new peer
function create(req, res){
    return Peer
        .create({
            certifications: req.body.certifications,
            training_certs: req.body.training_certs,
            userId: req.params.userId
        })
        .then(peer => res.status(201).send(peer))
        .catch(error => res.status(400).send(error));
}

// list peer
function list(req, res){
    return Peer
        .findAll({
            attributes: ['certifications', 'training_certs', 'userId']
        })
        .then(peers => res.status(200).send(peers))
        .catch(error => res.status(401).send(error));
}

// retrieve info of specified peer
function retrieve(req, res){
    return Peer
        .findOne({
            where: querySpecificPeer(req)
        })
        .then(peer => {
            if(!peer){
                return res.status(404).send({
                    message: 'Peer Not Found'
                });
            }

            return res.status(200).send(peer);
        })
        .catch(error => res.status(400).send(error))
}

// update specified peer info
function update(req, res){
    return Peer
        .findOne({
            where: querySpecificPeer(req)
        })
        .then(peer => {
            if(!peer){
                return res.status(404).send({
                    message: 'Peer Not Found'
                });
            }

            return peer
                .update(req.body, {
                    fields: Object.keys(req.body)                 
                })
                .then(updatedPeer => res.status(200).send(updatedPeer))
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}

// delete specified peer
function destroy(req,res){
    return Peer
        .findOne({where: querySpecificPeer(req)})
        .then(peer => {
            if(!peer){
                return res.status(404).send({
                    message: 'Peer Not Found'
                });
            }

            return peer
                .destroy()
                .then(() => res.status(200).send({message: "Success! Peer Deleted"}))
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