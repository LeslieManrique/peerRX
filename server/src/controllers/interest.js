const interest = require('../models').interest;
const { body, getValidationResult }  = require('express-validator/check');

const submitInterestErrorFormatter = result => {
    console.log("result\t",result)
    let errorObject = {}
    result.array().map(i => {
        if (!errorObject.hasOwnProperty(i.param)) {
            errorObject[i.param] = i.msg;
        }
    });
    
    console.log('Error Object', errorObject);
    throw (errorObject);

}


module.exports = {
    validate: (method) => {
        switch(method){
            case 'submitInterest': {
                return [
                    body('name', 'name does not exist').exists().isLength({ min: 3 }),
                    body('email', 'Invalid email').exists().isEmail(),
                    body('phone_number', 'Invalid phone numbers assert digit only format').exists().isInt(),
                    body('user_type','user type does not exist').exists().isNumeric()
                ]
            }
        }

    },
 
    create: (req, res, next) => {
        req
        .getValidationResult() //get the result of validate function
        .then((result) => submitInterestErrorFormatter(result))
        .then(()=>{
            const {name, email, user_type, phone_number} = req.body
            console.log('posting')
            console.log(req.body)
            return interest
            .create({
                name,
                email,
                user_type,
                phone_number
              })
              .then(interest => res.status(201).send(interest))
              .catch(error => res.status(400).send(error));
        })
        .catch((error) => {
            res.json(error);
        })
     
    },
    list: (req, res) => {
      return interest
        .findAll({
          attributes: ['name','email','user_type','phone_number']
        })
        .then((interest) => res.status(200).send(interest))
        .catch((error) => res.status(400).send(error))
      }
  };