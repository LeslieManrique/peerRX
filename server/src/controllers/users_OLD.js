// const users = require('../models').users;
// const { check } = require('express-validator/check')
// module.exports = {
//     create(req, res) {
//       console.log('posting')
//       console.log(req.body)
//       return users
//         .create({
//           first_name: req.body.first_name,
//           last_name: req.body.last_name,
//           email_address: req.body.email,
//           user_type: req.body.user_type,
//           phone_number: req.body.phone_number,
//           password: req.body.password,
//           user_type: req.body.user_type

//         })
//         .then(users => res.status(201).send(users))
//         .catch(error => res.status(400).send(error));
//     },
//     list(req, res) {
//       return users
//         .findAll({
//           attributes: ['first_name', 'last_name','id','email_address','user_type','phone_number']
//         })
//         .then((users) => res.status(200).send(users))
//         .catch((error) => res.status(400).send(error))
//       }
//   };