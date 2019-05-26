const express = require("express");
const router = new express.Router();
const usersController = require('../controllers').users;
const interestController = require('../controllers').interest;
const {authenticateAdmin, isApproved} = require('../services/auth');

router
    .get('/admin/listUsers', [authenticateAdmin, isApproved], usersController.list)

    // .get('/admin/interestedUsers', [authenticateAdmin, isApproved], interestController.list)

    // .delete('/admin/interestedUsers/:id', [authenticateAdmin, isApproved], interestController.delInterestById)
    //approve user
    .post('/admin/approve/:id', [authenticateAdmin, isApproved], function(req, res, next){
        console.log("approve user function");
        usersController.approveUser("admin", req, res);

    })
module.exports = router;