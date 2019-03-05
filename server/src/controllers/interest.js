const interest = require('../models').interest;
const { body, getValidationResult }  = require('express-validator/check');
const sendInterestRequest = require('../services/mailer').sendInterestRequest;

const submitInterestErrorFormatter = result => {
    if (!result.isEmpty()){
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

}

module.exports = {
    validate: (method) => {
        switch(method){
            case 'submitInterest': {
                return [
                    body('name', 'name does not exist').exists().isLength({ min: 3 }),
                    body('email', 'Invalid email').exists().isEmail(),
                    body('phone_number', 'Invalid phone numbers assert digit only format at least 10 characters').exists().isInt().isLength({min:10}),
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
            const {name, email, user_type, phone_number, organization} = req.body
            console.log('posting')
            console.log(req.body)
            return interest
            .create({
                name,
                email,
                user_type,
                phone_number,
                organization
              })
              .then(interest => res.status(201).send(interest))
              .catch(error => res.status(400).send(error));
        })
        .catch((error) => {
            console.log("catiching error ", error)
            res.status(500).json(error);
        })
        .then(()=> {
            console.log("submitting email");
            sendInterestRequest(req.body);
        })
        .catch((error)=>{
            console.log("Could not submit email", error);
        })
     
    },
    delInterestById: (req, res)=> {
        console.log(req.params.id)
        const id = req.params.id;
        return interest
            .destroy({where: {id:id}
            })
            .then(result => {
                if(result >= 1){
                    res.status(200).json({"success":true, "message":"successful deletion"});
                }
                else{
                    res.status(200).json({"success":true, "message":"no rows deleted"});
                }

              })
            .catch((error) => {
                res.status(400).json({"success":true, "message":"Unable to delete"});
            })
    }, 
    list: (req, res) => {
      return interest
        .findAll({
          attributes: ['id','name','email','user_type','phone_number', 'organization']
        })
        .then((interest)=> res.status(200).send(interest))
        .catch((error)=> res.status(400).send(error))
      }
  };

