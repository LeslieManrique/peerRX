const users = require('../models').users;
const { check } = require('express-validator/check')
// services/auth.js for registration
// change this to controllers/admin 
module.exports = {
    create(req,res){
      res.json({"success":false, "message":"please fill out all required fields"});
    },
    createAdmin(req, res) {
      console.log("Hello")
      console.log("--------------", sequelize);
      if(!req.body.email  || !req.body.password || !req.body.role){
        
  
        res.json({"success":false, "message":"please fill out all required fields"});
       
        //handle different types of profile registrations 
        // if(req.body.role == 'admin'){
        //   res.json({"success":false, "message":"admin has no registration portal"});
        // }


        // else if(req.body.role == "peer"){

        // }
        // else if(req.body.role == "agency"){
          
        // }
        // else if(req.body.role == "location"){

        // }
      }
      console.log('posting')
      console.log(req.body)
      return users
        .create({
          email: req.body.email,
          password: req.body.password,
          role: req.body.role
        })
        .then(user => res.status(201).send(user))
        .catch(error => {
          const errorObject = {"status":false, "message": error.errors[0]["message"]};
          res.status(400).send(errorObject);
        });
    },
    list(req, res) {
      return users
        .findAll({
          attributes: ['email','role']
        })
        .then((users) => res.status(200).send(users))
        .catch((error) => res.status(400).send(error))
      }
  };