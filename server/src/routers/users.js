const express = require("express");
const router = new express.Router();
const usersController = require('../controllers').users;

const users = [];
let id = 1;

router
  .get('/users',usersController.list)
  .post('/users', usersController.create)
  .get('/find_user/:userId', usersController.retrieve)
  .post('/update_user/:userId', usersController.update)
  .delete('/delete_user/:userId', usersController.destroy);


module.exports = router;