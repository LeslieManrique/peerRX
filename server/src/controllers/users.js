const users = require('../models').users;
module.exports = {
    create(req, res) {
      console.log('posting')
      console.log(req.body)
      return users
        .create({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email_address: req.body.email,
          user_type: req.body.user_type,
          phone_number: req.body.phone_number,
          password: req.body.password

        })
        .then(users => res.status(201).send(users))
        .catch(error => res.status(400).send(error));
    },
  };