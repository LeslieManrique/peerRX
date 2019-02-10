const express = require('express');
const router = new express.Router();
const agenciesPeersController = require('../controllers').agenciespeers;

router
    .get('/find_agencypeer/:userId', agenciesPeersController.retrieveAssociation)
    .post('/add_agencypeer/:userId', agenciesPeersController.addAssociation)
    .delete('/delete_agencypeer/:userId', agenciesPeersController.deleteAssociation);

module.exports = router;