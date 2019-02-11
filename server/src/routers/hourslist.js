const express = require('express');
const router = new express.Router();
const hoursListController = require('../controllers').hourslist;

router
    .get('/hourslist', (req, res) => res.status(200).send({message: 'Welcome to the HoursList API!'}))
    .get('/hourslists', hoursListController.list)
    .get('/find_hourslist/:userId', hoursListController.retrieve)
    .post('/add_hourslist/:userId', hoursListController.create)
    .delete('/delete_hourslist/:userId', hoursListController.destroy);

module.exports = router;