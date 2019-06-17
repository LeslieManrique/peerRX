const languages = require('../models').language;
const { check } = require('express-validator/check');

const createLanguage = async(req, res) =>{  
    console.log(req.body);
  return languages
    .create({
      language_id: req.body.language_id,
      language: req.body.language,
    })
    .then(language => res.status(201).json({"success":true, "message":"Added New Language"}))
    .catch(error => {
      const errorObject = {"status":false, "message": error.errors[0]["message"]};
      res.status(400).send(errorObject);
    });



}

module.exports = {
    createLanguage   
  };
      
      