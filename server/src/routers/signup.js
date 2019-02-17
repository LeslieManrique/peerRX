const express = require('express');
// const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const usersController = require('../controllers').users;

router
    .post('/signupAdmin', usersController.createAdmin);
// router
//     .post('/signupAgency', usersController.createAgency);
// router
//     .post('/signupPeer', usersController.createPeer);
// router
//     .post('/signupLocation', usersController.createLocation);


module.exports = router; 
