const express = require("express");
const router = new express.Router();
const usersController = require('../controllers').users;

router
  .get('/users',usersController.list)
  .post('/users', usersController.createUser) //can create any type of user except admin
  .get('/find_user/:userId', usersController.retrieve)
  .delete('/delete_user/:userId', usersController.destroy)




  


// router
//   .get('/users',usersController.list)
//   .post('/users', usersController.create)
//   
//   .post('/update_user/:userId', usersController.update)
//   .delete('/delete_user/:userId', usersController.destroy)


module.exports = router;