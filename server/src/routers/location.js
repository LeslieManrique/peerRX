const express = require('express');
const router = new express.Router();
const locationController = require('../controllers').locations;
const {authenticateAdmin, authenticateLocation, isApproved, canAccessParam} = require('../services/auth');

router
    //submitting a profile only needs to make sure that theh right user is authorizing
    .post('/location/add/:userId', authenticateLocation, locationController.create)
    // only current user and admin can access this route 
    .get('/profile/location/:userId', [authenticateLocation, canAccessParam], locationController.retrieve)
    //only admin can access this route
    .get('/location/all', [authenticateAdmin, isApproved], locationController.list) 
    .post('/location/update/:userId', [authenticateLocation], locationController.update)
    //submit a locations profile
    .delete('location/delete/:userId', [authenticateAdmin, isApproved], locationController.destroy);

module.exports = router;