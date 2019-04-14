const express = require('express');
const router = new express.Router();
const locationController = require('../controllers').locations;
const {authenticateAdmin, authenticateLocation, isApproved, canAccessParam} = require('../services/auth');

router
    .get('/location', (req, res) => res.status(200).send({
        message: 'Welcome to Locations API!'
    }))
    //submitting a profile only needs to make sure that theh right user is authorizing
    .post('/location/add/:userId', authenticateLocation, locationController.create)
    // only current user and admin can access this route 
    .get('/profile/location/:userId', [authenticateLocation, canAccessParam], locationController.retrieve)
    //only admin can access this route
    .get('/locations/all', [authenticateAdmin, isApproved], locationController.list) 
    .post('/update_location/:userId', [authenticateLocation], locationController.update)
    //submit a locations profile
    .delete('/delete_location/:userId', locationController.destroy);

module.exports = router;