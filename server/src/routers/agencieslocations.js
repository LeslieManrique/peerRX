const express = require('express');
const router = new express.Router();
const agenciesLocationsController = require('../controllers').agencieslocations;

router
    .get('/find_agencylocation/:userId', agenciesLocationsController.retrieveAssociation)
    .post('/add_agencylocation/:userId', agenciesLocationsController.addAssociation)
    .delete('/delete_agencylocation/:userId', agenciesLocationsController.deleteAssociation);

module.exports = router;