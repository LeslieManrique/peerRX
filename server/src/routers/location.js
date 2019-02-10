const express = require('express');
const router = new express.Router();
const locationController = require('../controllers').locations;

router
    .get('/location', (req, res) => res.status(200).send({
        message: 'Welcome to Locations API!'
    }))
    .get('/locations', locationController.list)
    .get('/find_location/:userId', locationController.retrieve)
    .post('/update_location/:userId', locationController.update)
    .post('/add_location/:userId', locationController.create)
    .delete('/delete_location/:userId', locationController.destroy);

module.exports = router;