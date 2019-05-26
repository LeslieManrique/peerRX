const express = require('express');
// const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const usersController = require('../controllers').users;

router
    // .post('/signupAdmin', usersController.createAdmin)
    
    .post('/signupUser', usersController.createUser)


module.exports = router; 
