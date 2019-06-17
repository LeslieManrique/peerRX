const PeerLanguages = require('../models').peer_language;
const { check } = require('express-validator/check');

const createPeerLanguage = async(req, res) =>{  
    console.log(req.body);
  return PeerLanguages
    .create({
      language_id: req.body.language_id,
      peer_id: req.body.peer_id
    })
    .then(peerLanguage => res.status(201).json({"success":true, "message":"Added New Peer Language Asociation"}))
    .catch(error => {
      const errorObject = {"status":false, "message": error.errors[0]["message"]};
      res.status(400).send(errorObject);
    });

}

module.exports = {
    createPeerLanguage   
  };
      
      